<?php

namespace App\Services;

use App\Models\StaticAccount;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class TopUpService
{
    public function __construct(
        private RegistrationFeeService $registrationFeeService,
    ) {}

    /**
     * Process a top-up to a user's static account.
     * Records the top-up, then deducts any pending fees.
     */
    public function processTopUp(int $userId, int $amount, ?string $paymentMethod = null, ?string $platformReference = null): array
    {
        return DB::transaction(function () use ($userId, $amount, $paymentMethod, $platformReference) {
            $staticAccount = StaticAccount::where('user_id', $userId)
                ->lockForUpdate()
                ->firstOrFail();

            // 1. Credit the static account
            $staticAccount->increment('balance', $amount);
            $staticAccount->refresh();

            $topUpTransaction = Transaction::create([
                'reference' => Transaction::generateReference('TOP'),
                'amount' => $amount,
                'type' => 'topup',
                'direction' => 'credit',
                'status' => 'completed',
                'payment_method' => $paymentMethod,
                'platform_transaction_reference' => $platformReference,
                'description' => "Top-up of {$amount} to static account",
                'user_id' => $userId,
            ]);

            // 2. Deduct pending registration fees
            $registrationDeducted = $this->registrationFeeService
                ->deductPendingRegistrationFees($staticAccount);

            $staticAccount->refresh();

            return [
                'topup_transaction' => $topUpTransaction,
                'registration_deducted' => $registrationDeducted,
                'remaining_balance' => $staticAccount->balance,
            ];
        });
    }
}
