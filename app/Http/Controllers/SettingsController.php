<?php

namespace App\Http\Controllers;

use App\Models\StaticAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Load static account
        $staticAccount = $user->staticAccount;
        
        return Inertia::render('settings/Settings', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'bvn' => $user->bvn ?? null,
                'date_of_birth' => $user->date_of_birth,
            ],
            'notifications' => [
                'email_notifications' => $user->email_notifications ?? true,
                'sms_notifications' => $user->sms_notifications ?? true,
                'transaction_alerts' => $user->transaction_alerts ?? true,
                'marketing_emails' => $user->marketing_emails ?? false,
            ],
            'staticAccount' => $staticAccount ? [
                'account_number' => $staticAccount->account_number,
                'bank_name' => $staticAccount->bank_name,
                'balance' => $staticAccount->balance,
                'created_at' => $staticAccount->created_at->toISOString(),
            ] : null,
        ]);
    }
    
    public function createStaticAccount(Request $request)
    {
        $validated = $request->validate([
            'bvn' => 'required|string|size:11',
        ]);
        
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Check if user already has a static account
        if ($user->staticAccount) {
            return back()->withErrors([
                'bvn' => 'You already have a static account.'
            ]);
        }
        
        try {
            // Step 1: Create Wallet ID
            $response = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => config('services.alatpay.public_key'),
                'Content-Type' => 'application/json',
            ])->post('https://apibox.alatpay.ng/alatpay-wallet/api/v1/staticaccount', [
                'businessId' => config('services.alatpay.business_id'),
                'staticWalletType' => 1,
                'bvn' => $validated['bvn'],
                'email' => $user->email,
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                $walletId = $data['data']['staticWalletId'] ?? null;
                
                if ($walletId) {
                    return back()->with([
                        'walletId' => $walletId,
                        'success' => 'OTP sent! Please check your phone.'
                    ]);
                }
            }
            
            Log::error('AlatPay Create Wallet Failed', [
                'response' => $response->json(),
                'status' => $response->status(),
            ]);
            
            return back()->withErrors([
                'bvn' => 'Failed to create wallet. Please try again.'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Static Account Creation Error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            
            return back()->withErrors([
                'bvn' => 'An error occurred. Please try again later.'
            ]);
        }
    }
    
    public function verifyStaticAccount(Request $request)
    {
        $validated = $request->validate([
            'walletId' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);
        
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Check if user already has a static account
        if ($user->staticAccount) {
            return back()->withErrors([
                'otp' => 'You already have a static account.'
            ]);
        }
        
        try {
            // Step 2: Validate and Create Wallet
            $response = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => config('services.alatpay.public_key'),
                'Content-Type' => 'application/json',
            ])->post('https://apibox.alatpay.ng/alatpay-wallet/api/v1/staticaccount/validateAndCreate', [
                'staticWalletId' => $validated['walletId'],
                'businessId' => config('services.alatpay.business_id'),
                'otp' => $validated['otp'],
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                $accountNumber = $data['data']['accountNumber'] ?? null;
                $bankName = $data['data']['bankName'] ?? 'MightyShare Bank';
                
                if ($accountNumber) {
                    // Create static account record
                    StaticAccount::create([
                        'account_number' => $accountNumber,
                        'bank_name' => $bankName,
                        'balance' => 0,
                        'user_id' => $user->id,
                    ]);
                    
                    return back()->with('success', 'Static account created successfully!');
                }
            }
            
            Log::error('AlatPay Verify OTP Failed', [
                'response' => $response->json(),
                'status' => $response->status(),
            ]);
            
            return back()->withErrors([
                'otp' => 'OTP verification failed. Please try again.'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Static Account Verification Error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            
            return back()->withErrors([
                'otp' => 'An error occurred. Please try again later.'
            ]);
        }
    }

    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'transaction_alerts' => 'boolean',
            'marketing_emails' => 'boolean',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        try {
            $user->update([
                'email_notifications' => $validated['email_notifications'] ?? false,
                'sms_notifications' => $validated['sms_notifications'] ?? false,
                'transaction_alerts' => $validated['transaction_alerts'] ?? false,
                'marketing_emails' => $validated['marketing_emails'] ?? false,
            ]);

            return back()->with('success', 'Notification preferences updated successfully!');
        } catch (\Exception $e) {
            Log::error('Notification Update Error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return back()->withErrors([
                'notifications' => 'Failed to update preferences. Please try again.'
            ]);
        }
    }
}
