<?php

namespace App\Services;

use App\Models\Account;
use App\Models\StaticAccount;
use App\Models\Transaction;
use App\Mail\DeductionNotificationEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class RegistrationFeeService
{
    public const REGISTRATION_FEE = 2500;

    /**
     * Process registration fee for a newly created savings account.
     * Deducts from static account if funds exist, otherwise tracks as pending.
     */
    public function processRegistrationFee(Account $account): Transaction
    {
        return DB::transaction(function () use ($account) {
            $staticAccount = StaticAccount::where('user_id', $account->user_id)
                ->with('user')
                ->lockForUpdate()
                ->firstOrFail();

            if ($staticAccount->balance >= self::REGISTRATION_FEE) {
                return $this->deductRegistrationFee($staticAccount, $account);
            }

            return $this->trackPendingRegistrationFee($staticAccount, $account);
        });
    }

    /**
     * Deduct registration fee from static account balance.
     */
    private function deductRegistrationFee(StaticAccount $staticAccount, Account $account): Transaction
    {
        $staticAccount->decrement('balance', self::REGISTRATION_FEE);

        $account->update(['is_paid' => true]);

        $transaction = Transaction::create([
            'reference' => Transaction::generateReference('REG'),
            'amount' => self::REGISTRATION_FEE,
            'type' => 'registration_fee',
            'direction' => 'debit',
            'status' => 'completed',
            'description' => 'Registration fee for account ' . $account->account_number,
            'account_id' => $account->id,
            'user_id' => $account->user_id,
        ]);

        // Send Deduction Email
        Mail::to($staticAccount->user->email)->queue(new DeductionNotificationEmail($staticAccount->user, self::REGISTRATION_FEE, $transaction->description));

        return $transaction;
    }

    /**
     * Track unpaid registration fee as pending.
     */
    private function trackPendingRegistrationFee(StaticAccount $staticAccount, Account $account): Transaction
    {
        $availableBalance = $staticAccount->balance;
        $shortfall = self::REGISTRATION_FEE - $availableBalance;

        if ($availableBalance > 0) {
            $staticAccount->decrement('balance', $availableBalance);
        }

        $staticAccount->increment('pending_registration_balance', $shortfall);

        $transaction = Transaction::create([
            'reference' => Transaction::generateReference('PREG'),
            'amount' => self::REGISTRATION_FEE,
            'type' => 'pending_registration_fee',
            'direction' => 'debit',
            'status' => 'pending',
            'description' => "Registration fee for account {$account->account_number}. Shortfall: {$shortfall}",
            'account_id' => $account->id,
            'user_id' => $account->user_id,
        ]);

        if ($availableBalance > 0) {
            // Send email for partial deduction
            Mail::to($staticAccount->user->email)->queue(new DeductionNotificationEmail($staticAccount->user, $availableBalance, "Partial registration fee deduction for account {$account->account_number}"));
        }

        return $transaction;
    }

    /**
     * Deduct pending registration balance from available funds.
     * Also syncs any unpaid accounts that aren't yet tracked in pending_registration_balance.
     * Returns the amount actually deducted.
     */
    public function deductPendingRegistrationFees(StaticAccount $staticAccount): int
    {
        // Sync: ensure unpaid accounts are reflected in pending_registration_balance
        $unpaidCount = Account::where('user_id', $staticAccount->user_id)
            ->where('is_paid', false)
            ->count();

        $expectedPending = $unpaidCount * self::REGISTRATION_FEE;

        if ($expectedPending > $staticAccount->pending_registration_balance) {
            $deficit = $expectedPending - $staticAccount->pending_registration_balance;
            $staticAccount->increment('pending_registration_balance', $deficit);
            $staticAccount->refresh();
        }

        if ($staticAccount->pending_registration_balance <= 0) {
            return 0;
        }

        $deductible = min($staticAccount->balance, $staticAccount->pending_registration_balance);

        if ($deductible <= 0) {
            return 0;
        }

        $staticAccount->decrement('balance', $deductible);
        $staticAccount->decrement('pending_registration_balance', $deductible);
        $staticAccount->refresh();

        $transaction = Transaction::create([
            'reference' => Transaction::generateReference('PDCT'),
            'amount' => $deductible,
            'type' => 'pending_deduction',
            'direction' => 'debit',
            'status' => 'completed',
            'description' => "Pending registration fee deduction. Remaining pending: {$staticAccount->pending_registration_balance}",
            'user_id' => $staticAccount->user_id,
        ]);

        // Send Deduction Email
        if (!$staticAccount->relationLoaded('user')) {
             $staticAccount->load('user');
        }
        Mail::to($staticAccount->user->email)->queue(new DeductionNotificationEmail($staticAccount->user, $deductible, $transaction->description));

        // Mark accounts as paid based on how many fees have been fully covered
        $remainingPending = $staticAccount->pending_registration_balance;
        $stillUnpaidCount = (int) ceil($remainingPending / self::REGISTRATION_FEE);
        $paidCount = $unpaidCount - $stillUnpaidCount;

        if ($paidCount > 0) {
            $paidAccountIds = Account::where('user_id', $staticAccount->user_id)
                ->where('is_paid', false)
                ->orderBy('id')
                ->limit($paidCount)
                ->pluck('id');

            Account::whereIn('id', $paidAccountIds)->update(['is_paid' => true]);

            // Mark their pending_registration_fee transactions as completed
            Transaction::where('user_id', $staticAccount->user_id)
                ->where('type', 'pending_registration_fee')
                ->where('status', 'pending')
                ->whereIn('account_id', $paidAccountIds)
                ->update(['status' => 'completed']);
        }

        // If all pending cleared, mark any remaining pending_registration_fee txns as completed
        if ($staticAccount->pending_registration_balance <= 0) {
            Transaction::where('user_id', $staticAccount->user_id)
                ->where('type', 'pending_registration_fee')
                ->where('status', 'pending')
                ->update(['status' => 'completed']);
        }

        return $deductible;
    }
}
