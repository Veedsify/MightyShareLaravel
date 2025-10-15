<?php

namespace App\Services;

use App\Models\User;
use App\Models\Account;
use App\Models\ThriftPackage;
use App\Models\ThriftSubscription;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserRegistrationService
{
    /**
     * Register a new user with complete setup
     *
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Validate that the package exists
            $package = ThriftPackage::findOrFail($data['package_id']);

            // Generate referral ID if not provided
            $referralId = $data['referralId'] ?? $this->generateReferralId();

            // Create the user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'referral_id' => $referralId,
                'registration_paid' => false,
                'plan_start_date' => now(),
                'last_activity' => now(),
            ]);

            // Create associated account
            Account::create([
                'user_id' => $user->id,
                'account_number' => $this->generateAccountNumber(),
                'balance' => 0,
                'total_contributions' => 0,
                'rewards' => 0,
                'total_debt' => 0,
                'referral_earnings' => 0,
            ]);

            // Create ThriftSubscription
            ThriftSubscription::create([
                'user_id' => $user->id,
                'package_id' => $package->id,
                'amount_invested' => 0,
                'start_date' => now(),
                'end_date' => now()->addWeeks($package->duration),
                'status' => 'active',
                'expected_return' => 0,
                'actual_return' => 0,
            ]);

            // Load relationships for return
            $user->load(['accounts', 'thriftSubscriptions.package']);

            return $user;
        });
    }

    /**
     * Generate a unique referral ID
     *
     * @return string
     */
    private function generateReferralId(): string
    {
        do {
            $referralId = 'REF-' . time() . rand(100, 999);
        } while (User::where('referral_id', $referralId)->exists());

        return $referralId;
    }

    /**
     * Generate a unique account number
     *
     * @return string
     */
    private function generateAccountNumber(): string
    {
        do {
            $accountNumber = 'MS' . time() . rand(100, 999);
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }
}
