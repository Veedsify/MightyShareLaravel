<?php

namespace App\Services;

use App\Models\Account;
use App\Models\DistributionLog;
use App\Models\DistributionPayment;
use App\Models\StaticAccount;
use App\Models\ThriftPackage;
use App\Models\ThriftSubscription;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DistributionService
{
    public function __construct(
        private RegistrationFeeService $registrationFeeService,
    ) {}

    /**
     * Execute monthly distribution for a specific user.
     * Only distributes to accounts that have sufficient funds.
     * Accounts without funds are simply skipped and retried on the next run.
     */
    public function distributeForUser(User $user, string $month): DistributionLog
    {
        return DB::transaction(function () use ($user, $month) {
            $subscription = $user->getActiveThriftSubscription();

            if (!$subscription || !$subscription->package) {
                return $this->upsertLog($user->id, $month, null, 'skipped', 0, 0,
                    'No active subscription or package found');
            }

            $package = $subscription->package;

            // Check if subscription has exceeded its duration
            if ($this->isSubscriptionExpired($subscription)) {
                return $this->upsertLog($user->id, $month, $package->id, 'completed', 0, 0,
                    'Subscription duration has been completed');
            }

            $staticAccount = StaticAccount::where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$staticAccount) {
                return $this->upsertLog($user->id, $month, $package->id, 'skipped', 0, 0,
                    'No static account found');
            }

            // Deduct pending registration fees first
            $this->registrationFeeService->deductPendingRegistrationFees($staticAccount);
            $staticAccount->refresh();

            // Get accounts that have NOT yet received a completed distribution this month
            $accounts = $this->getUndistributedAccounts($user->id, $package, $month);

            if ($accounts->isEmpty()) {
                return $this->upsertLog($user->id, $month, $package->id, 'completed', 0, 0,
                    'All accounts already distributed for this month');
            }

            // Not enough funds for even one account — skip entirely, no records created
            $minContribution = $package->min_contribution;
            if ($staticAccount->balance < $minContribution) {
                return $this->upsertLog($user->id, $month, $package->id, 'pending', 0, 0,
                    "Insufficient funds. Need at least {$minContribution}, have {$staticAccount->balance}. {$accounts->count()} accounts awaiting distribution.");
            }

            return $this->executeDistribution($user, $staticAccount, $package, $accounts, $month);
        });
    }

    /**
     * Check if a subscription has exceeded its duration.
     */
    private function isSubscriptionExpired(ThriftSubscription $subscription): bool
    {
        if (!$subscription->start_date) {
            return false;
        }

        $durationWeeks = $subscription->package->duration;
        $endDate = Carbon::parse($subscription->start_date)->addWeeks($durationWeeks);

        return now()->greaterThan($endDate);
    }

    /**
     * Get accounts that haven't received a completed distribution this month.
     * Uses the distribution_payments table for tracking.
     */
    private function getUndistributedAccounts(int $userId, ThriftPackage $package, string $month)
    {
        $allAccounts = Account::where('user_id', $userId)->get();

        if ($package->distribution_frequency === 'one_time') {
            // Exclude accounts that have EVER received a distribution
            $distributedAccountIds = DistributionPayment::where('user_id', $userId)
                ->where('status', 'completed')
                ->pluck('account_id')
                ->unique();
        } else {
            // Exclude accounts that received a completed distribution THIS month
            $distributedAccountIds = DistributionPayment::where('user_id', $userId)
                ->where('month', $month)
                ->where('status', 'completed')
                ->pluck('account_id')
                ->unique();
        }

        return $allAccounts->reject(fn($account) => $distributedAccountIds->contains($account->id));
    }

    /**
     * Execute the actual distribution across accounts.
     * Records in distribution_payments table (not transactions).
     */
    private function executeDistribution(
        User $user,
        StaticAccount $staticAccount,
        ThriftPackage $package,
        $accounts,
        string $month
    ): DistributionLog {
        $minContribution = $package->min_contribution;
        $availableBalance = $staticAccount->balance;

        $totalDistributed = 0;
        $accountsProcessed = 0;

        foreach ($accounts as $account) {
            if ($availableBalance < $minContribution) {
                break;
            }

            $staticAccount->decrement('balance', $minContribution);
            $account->increment('balance', $minContribution);
            $account->increment('total_contributions', $minContribution);
            $availableBalance -= $minContribution;
            $totalDistributed += $minContribution;
            $accountsProcessed++;

            DistributionPayment::create([
                'user_id' => $user->id,
                'account_id' => $account->id,
                'thrift_package_id' => $package->id,
                'month' => $month,
                'amount' => $minContribution,
                'status' => 'completed',
                'reference' => Transaction::generateReference('DST'),
            ]);
        }

        $remainingAccounts = $accounts->count() - $accountsProcessed;
        $status = $remainingAccounts > 0 ? 'partial' : 'completed';

        Log::info("Distribution for user {$user->id}", [
            'month' => $month,
            'package' => $package->name,
            'distributed' => $totalDistributed,
            'accounts_funded' => $accountsProcessed,
            'accounts_remaining' => $remainingAccounts,
        ]);

        $message = $remainingAccounts > 0
            ? "{$remainingAccounts} accounts still awaiting funds"
            : null;

        return $this->upsertLog(
            $user->id, $month, $package->id, $status,
            $totalDistributed, $accountsProcessed, $message
        );
    }

    /**
     * Create or update a distribution log entry.
     */
    private function upsertLog(
        int $userId, string $month, ?int $packageId, string $status,
        int $distributed, int $processed, ?string $message = null
    ): DistributionLog {
        $existing = DistributionLog::where('user_id', $userId)
            ->where('month', $month)
            ->first();

        if ($existing) {
            $updates = [
                'package_id' => $packageId ?? $existing->package_id,
                'status' => $status,
                'error_message' => $message,
            ];

            if ($processed > 0) {
                $updates['total_distributed'] = $existing->total_distributed + $distributed;
                $updates['accounts_processed'] = $existing->accounts_processed + $processed;
            }

            $existing->update($updates);
            return $existing->refresh();
        }

        return DistributionLog::create([
            'user_id' => $userId,
            'month' => $month,
            'package_id' => $packageId,
            'status' => $status,
            'total_distributed' => $distributed,
            'total_shortfall' => 0,
            'accounts_processed' => $processed,
            'error_message' => $message,
        ]);
    }
}
