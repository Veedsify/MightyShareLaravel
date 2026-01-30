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
        $user = Auth::user()->load('nextOfKin');
        
        // Load static account
        $staticAccount = $user->staticAccount;
        $nextOfKin = $user->nextOfKin;
        if ($nextOfKin) {
            $nextOfKin = [
                'name' => $nextOfKin->name,
                'phone' => $nextOfKin->phone ?? null,
                'gender' => $nextOfKin->gender ?? null,
                'date_of_birth' => $nextOfKin->date_of_birth ?? null,
                'relationship' => $nextOfKin->relationship ?? null,
                'address' => $nextOfKin->address ?? null,
            ];
        }
        
        return Inertia::render('settings/Settings', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'bvn' => $user->bvn ?? null,
                'date_of_birth' => $user->date_of_birth,
            ],
            'nextOfKin' => $nextOfKin ?? null,
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
            Log::info('Authenticating with AlatPay', [
                'email' => config('services.alatpay.email'),
                'password' => config('services.alatpay.password'),
            ]);

            // Step 1: Authenticate and get cookies
            $authResponse = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => config('services.alatpay.secret_key'),
                'Content-Type' => 'application/json',
            ])->post('https://apibox.alatpay.ng/merchant-onboarding/api/v1/auth/login', [
                'password' => config('services.alatpay.password'),
                'email' => config('services.alatpay.email'),
            ]);

            if ($authResponse->failed()) {
                return response()->json([
                    'error' => 'Failed to authenticate. Please try again.'
                ], 400);
            }

            // Retrieve auth cookies from the authenticate response
            $cookies = [];
            $setCookieHeaders = $authResponse->header('Set-Cookie');

            // Handle both single cookie and array of cookies
            if (!\is_array($setCookieHeaders)) {
                $setCookieHeaders = $setCookieHeaders ? [$setCookieHeaders] : [];
            }

            foreach ($setCookieHeaders as $cookieHeader) {
                // Split by comma followed by space and a word (to handle multiple cookies in one header)
                $individualCookies = preg_split('/,\s+(?=[a-zA-Z]+\=)/', $cookieHeader);

                foreach ($individualCookies as $cookie) {
                    // Parse cookie string (format: "name=value; path=/; domain=...")
                    preg_match('/^([^=]+)=([^;]+)/', $cookie, $matches);
                    if (\count($matches) >= 3) {
                        $cookieName = trim($matches[1]);
                        $cookieValue = trim($matches[2]);

                        // Only store the cookies we need
                        if (\in_array($cookieName, ['accessToken', 'refreshToken'])) {
                            $cookies[$cookieName] = $cookieValue;
                        }
                    }
                }
            }

            // Verify we got both required cookies
            if (!isset($cookies['accessToken'], $cookies['refreshToken'])) {
                Log::error('Missing authentication cookies', [
                    'received_cookies' => array_keys($cookies),
                    'set_cookie_headers' => $setCookieHeaders
                ]);

                return response()->json([
                    'error' => 'Failed to authenticate. Please try again.'
                ], 400);
            }

            Log::info('Authentication successful', [
                'cookies_received' => array_keys($cookies)
            ]);

            session(['alatpay_cookies' => $cookies]);

            // Step 2: Create Wallet ID, passing the cookies to authenticate
            $createResponse = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => config('services.alatpay.public_key'),
                'Content-Type' => 'application/json',
            ])
                ->withCookies($cookies, '.alatpay.ng')
                ->post('https://apibox.alatpay.ng/alatpay-wallet/api/v1/staticaccount', [
                    'businessId' => config('services.alatpay.business_id'),
                    'staticWalletType' => 1,
                    'bvn' => $validated['bvn'],
                    'email' => $user->email,
                ]);

            if ($createResponse->successful()) {
                $data = $createResponse->json();
                $otpId = $data['id'] ?? null;
                $createMessage = $data['message'] ?? null;
                $trackingId = $data['otpTrackingID'] ?? null;

                if ($otpId) {
                    return response()->json([
                        'walletId' => $otpId,
                        'trackingId' => $trackingId,
                        'createMessage' => $createMessage,
                    ], 200);
                }
            }

            Log::error('AlatPay Create Wallet Failed', [
                'response' => $createResponse->json(),
                'status' => $createResponse->status(),
                'headers' => $createResponse->headers(),
            ]);

            return response()->json([
                'error' => 'Failed to create wallet. Please try again.',
            ], 400);
            
        } catch (\Exception $e) {
            Log::error('Static Account Creation Error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return  response()->json([
                'error' => 'An error occurred. Please try again later.',
            ]);
        }
    }
    
    public function verifyStaticAccount(Request $request)
    {
        $validated = $request->validate([
            'walletId' => 'required|string',
            'otp' => 'required|string|size:6',
            'trackingId' => 'required|string',
        ]);

        $cookies = session('alatpay_cookies');

        if (!$cookies) {
            return response()->json([
                'error' => 'Failed to authenticate. Please try again.'
            ], 400);
        }
        
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Check if user already has a static account
        if ($user->staticAccount) {
            return response()->json([
                'error' => 'You already have a static account.'
            ], 400);
        }
        
        try {
            // Step 2: Validate and Create Wallet
            $response = Http::withHeaders([
                'Ocp-Apim-Subscription-Key' => config('services.alatpay.public_key'),
                'Content-Type' => 'application/json',
            ])
            ->withCookies($cookies, '.alatpay.ng')
            ->post('https://apibox.alatpay.ng/alatpay-wallet/api/v1/staticaccount/validateAndCreate', [
                'staticWalletId' => $validated['walletId'],
                'businessId' => config('services.alatpay.business_id'),
                'otp' => $validated['otp'],
                'trackingId' => $validated['trackingId'],
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                Log::info('AlatPay Verify OTP Response', [
                    'response' => $data,
                ]);
                $accountNumber = $data['accountNumber'] ?? null;
                $accountName = $data['accountName'] ?? null;
                $bankName = 'Wema Bank';
                
                if ($accountNumber) {
                    // Create static account record 
                    StaticAccount::create([
                        'account_number' => $accountNumber,
                        'bank_name' => $bankName,
                        'account_name' => $accountName,
                        'balance' => 0,
                        'is_verified' => true,
                        'static_account_id' => $validated['walletId'],
                        'user_id' => $user->id,
                    ]);
                    
                    return response()->json([
                        'success' => 'Static account created successfully!',
                    ], 200);
                }
            }
            
            Log::error('AlatPay Verify OTP Failed', [
                'response' => $response->json(),
                'status' => $response->status(),
            ]);
            
            return response()->json([
                'error' => 'OTP verification failed. Please try again.'
            ], 400);
            
        } catch (\Exception $e) {
            Log::error('Static Account Verification Error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            
            return response()->json([
                'error' => 'An error occurred. Please try again later.'
            ], 400);
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
