<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Account;
use App\Enums\PaymentStatus;
use App\Services\AlatPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AlatPayController extends Controller
{
    private AlatPayService $alatPayService;

    public function __construct(AlatPayService $alatPayService)
    {
        $this->alatPayService = $alatPayService;
    }

    /**
     * Initialize payment with AlatPay
     */
    public function initialize(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'currency' => 'required|string|in:NGN',
                'description' => 'required|string|max:255'
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            $amount = $request->amount;
            $currency = $request->currency;
            $description = $request->description;

            // Generate unique order ID
            $orderId = 'ORD' . Str::random(10);

            // Validate AlatPay configuration
            if (!$this->alatPayService->validateConfiguration()) {
                Log::error('AlatPay service is not properly configured');
                return response()->json([
                    'error' => 'Payment service is not properly configured'
                ], 500);
            }

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'currency' => $currency,
                'description' => $description,
                'status' => PaymentStatus::PENDING,
                'business_id' => config('services.alatpay.business_id'),
                'customer_email' => $this->generateCustomerEmail($user),
                'customer_first_name' => $this->getFirstName($user->name),
                'customer_last_name' => $this->getLastName($user->name),
                'customer_phone' => $user->phone,
                'order_id' => $orderId,
                'customer_metadata' => json_encode([
                    'OtherName' => $user->name,
                    'userId' => $user->id,
                ]),
            ]);

            // Generate virtual account using AlatPayService
            $result = $this->alatPayService->generateVirtualAccount(
                $orderId,
                $amount,
                $description,
                $user
            );

            if ($result['success']) {
                return response()->json($result['data']);
            } else {
                return response()->json([
                    'error' => $result['error'],
                    'details' => $result['details'] ?? null
                ], 400);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('AlatPay initialize error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Payment initialization error',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify payment with AlatPay
     */
    public function verify(Request $request)
    {
        try {
            $request->validate([
                'orderId' => 'required|string',
            ]);

            /** @var User|null $user */
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            $orderId = $request->orderId;
            $transactionId = $request->transactionId ?? $orderId;

            // Find payment record
            $payment = Payment::where('order_id', $orderId)
                ->where('user_id', $user->id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'error' => 'Payment record not found'
                ], 404);
            }

            // Verify with AlatPay using service
            $result = $this->alatPayService->verifyPayment($transactionId);

            if ($result['success']) {
                $transaction = $result['data'];

                // Verify amount matches
                if (($transaction['amount'] ?? 0) < $payment->amount) {
                    return response()->json([
                        'error' => 'Payment amount insufficient'
                    ], 400);
                }

                // Get user's first account
                $userAccount = $user->accounts()->first();

                // Create transaction record
                Transaction::create([
                    'amount' => $transaction['amount'] ?? $payment->amount,
                    'reference' => $payment->order_id ?? $transaction['transactionId'],
                    'status' => 'SUCCESSFUL',
                    'type' => 'CREDIT',
                    'payment_method' => 'ALATPAY',
                    'account_id' => $userAccount?->id,
                    'platform_transaction_reference' => $transaction['transactionId'] ?? null,
                    'description' => $transaction['description'] ?? $payment->description,
                ]);

                // Update payment status
                $payment->update([
                    'status' => PaymentStatus::SUCCESSFUL,
                    'customer_metadata' => json_encode([
                        ...$transaction,
                        'verifiedAt' => now()->toISOString(),
                    ]),
                ]);

                // Mark user registration as paid and handle wallet credit
                $registrationFeeDeducted = 0;
                $creditedAmount = $transaction['amount'] ?? $payment->amount;

                if (!$user->registration_paid) {
                    // Get registration fee from user's thrift package price
                    $activeSubscription = $user->getActiveThriftSubscription();
                    $registrationFee = $activeSubscription?->package?->price ?? 2500; // Default to ₦2,500 if no package found

                    if ($creditedAmount >= $registrationFee) {
                        $registrationFeeDeducted = $registrationFee;
                        $creditedAmount -= $registrationFee;

                        // Update user registration status
                        $user->registration_paid = true;
                        $user->save();
                    }
                }

                // Credit user's wallet (account balance)
                if ($creditedAmount > 0 && $userAccount) {
                    $userAccount->increment('balance', $creditedAmount);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Payment verified successfully',
                    'amount' => $transaction['amount'] ?? $payment->amount,
                    'reference' => $orderId,
                    'userId' => $payment->user_id,
                    'creditedAmount' => $creditedAmount,
                    'registrationFeeDeducted' => $registrationFeeDeducted,
                    'updatedAt' => $transaction['updatedAt'] ?? now()->toISOString(),
                ]);
            } else {
                return response()->json([
                    'error' => $result['error'],
                    'details' => $result['details'] ?? null
                ], 400);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('AlatPay verify error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Payment verification error',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle AlatPay callbacks (GET redirects)
     */
    public function callbackGet(Request $request)
    {
        try {
            $orderId = $request->query('orderId');
            $reference = $request->query('reference');
            $status = $request->query('status');

            if (!$orderId && !$reference) {
                return redirect()->route('register-payment', [
                    'status' => 'failed',
                    'error' => 'no_reference'
                ]);
            }

            $paymentReference = $orderId ?: $reference;

            // Redirect to register-payment page with reference for verification
            return redirect()->route('register-payment', [
                'reference' => $paymentReference,
                'provider' => 'alatpay',
                'status' => $status ?: 'pending'
            ]);
        } catch (\Exception $e) {
            Log::error('AlatPay callback GET error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('register-payment', ['status' => 'failed']);
        }
    }

    /**
     * Handle AlatPay webhooks (POST)
     */
    public function callbackPost(Request $request)
    {
        try {
            $reference = $request->input('reference');
            $status = $request->input('status');
            $amount = $request->input('amount');
            $customer = $request->input('customer', []);

            // Verify status with AlatPay API using service
            $result = $this->alatPayService->verifyPaymentAlternative($reference);

            if (!$result['success']) {
                return response()->json(['error' => 'Payment verification failed'], 400);
            }

            // Find user by phone (assuming AlatPay returns it in customer)
            $phone = $customer['phone'] ?? null;
            if (!$phone) {
                return response()->json(['error' => 'Customer phone not provided'], 400);
            }

            /** @var User|null $user */
            $user = User::where('phone', $phone)->with('accounts')->first();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Handle registration fee deduction
            $registrationPaid = $user->registration_paid;
            $balanceToCredit = $amount;

            if (!$registrationPaid) {
                // Get registration fee from user's thrift package price
                $activeSubscription = $user->getActiveThriftSubscription();
                $registrationFee = $activeSubscription?->package?->price ?? 2500; // Default to ₦2,500 if no package found

                if ($amount >= $registrationFee) {
                    $balanceToCredit = $amount - $registrationFee;
                    $registrationPaid = true;
                } else {
                    $balanceToCredit = 0; // registration not complete
                }
            }

            // Update user wallet
            $firstAccount = $user->accounts->first();
            if ($firstAccount && $balanceToCredit > 0) {
                $firstAccount->increment('balance', $balanceToCredit);
            }

            // Update user
            $user->registration_paid = $registrationPaid;
            $user->last_activity = "Payment verified (₦{$amount})";
            $user->save();

            return response()->json([
                'success' => true,
                'user' => $user->fresh(['accounts'])
            ]);
        } catch (\Exception $e) {
            Log::error('AlatPay callback POST error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Initialize wallet topup payment with AlatPay
     */
    public function topupInitialize(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:100', // Minimum topup amount
                'currency' => 'required|string|in:NGN',
                'description' => 'string|max:255'
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            $amount = $request->amount;
            $currency = $request->currency;
            $description = $request->description ?? 'Wallet Topup';

            // Generate unique order ID for topup
            $orderId = 'TOPUP' . Str::random(10);

            // Validate AlatPay configuration
            if (!$this->alatPayService->validateConfiguration()) {
                Log::error('AlatPay service is not properly configured');
                return response()->json([
                    'error' => 'Payment service is not properly configured'
                ], 500);
            }

            // Create payment record for topup
            $payment = Payment::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'currency' => $currency,
                'description' => $description,
                'status' => PaymentStatus::PENDING,
                'business_id' => config('services.alatpay.business_id'),
                'customer_email' => $this->generateCustomerEmail($user),
                'customer_first_name' => $this->getFirstName($user->name),
                'customer_last_name' => $this->getLastName($user->name),
                'customer_phone' => $user->phone,
                'order_id' => $orderId,
                'customer_metadata' => json_encode([
                    'OtherName' => $user->name,
                    'userId' => $user->id,
                    'type' => 'wallet_topup',
                ]),
            ]);

            // Generate virtual account using AlatPayService
            $result = $this->alatPayService->generateVirtualAccount(
                $orderId,
                $amount,
                $description,
                $user
            );

            if ($result['success']) {
                return response()->json($result['data']);
            } else {
                return response()->json([
                    'error' => $result['error'],
                    'details' => $result['details'] ?? null
                ], 400);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('AlatPay topup initialize error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Wallet topup initialization error',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify wallet topup payment with AlatPay
     */
    public function topupVerify(Request $request)
    {
        try {
            $request->validate([
                'orderId' => 'required|string',
            ]);

            /** @var User|null $user */
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            $orderId = $request->orderId;
            $transactionId = $request->transactionId ?? $orderId;

            // Find payment record
            $payment = Payment::where('order_id', $orderId)
                ->where('user_id', $user->id)
                ->first();

            if (!$payment) {
                return response()->json([
                    'error' => 'Payment record not found'
                ], 404);
            }

            // Verify with AlatPay using service
            $result = $this->alatPayService->verifyPayment($transactionId);

            if ($result['success']) {
                $transaction = $result['data'];

                // Verify amount matches
                if (($transaction['amount'] ?? 0) < $payment->amount) {
                    return response()->json([
                        'error' => 'Payment amount insufficient'
                    ], 400);
                }

                // Get user's first account
                $userAccount = $user->accounts()->first();

                // Create transaction record
                Transaction::create([
                    'amount' => $transaction['amount'] ?? $payment->amount,
                    'reference' => $payment->order_id ?? $transaction['transactionId'],
                    'status' => 'SUCCESSFUL',
                    'type' => 'CREDIT',
                    'payment_method' => 'ALATPAY',
                    'account_id' => $userAccount?->id,
                    'platform_transaction_reference' => $transaction['transactionId'] ?? null,
                    'description' => $transaction['description'] ?? $payment->description,
                ]);

                // Update payment status
                $payment->update([
                    'status' => PaymentStatus::SUCCESSFUL,
                    'customer_metadata' => json_encode([
                        ...$transaction,
                        'verifiedAt' => now()->toISOString(),
                        'type' => 'wallet_topup',
                    ]),
                ]);

                // For wallet topup, credit full amount to user's wallet (no registration fee deduction)
                $creditedAmount = $transaction['amount'] ?? $payment->amount;

                // Credit user's wallet (account balance)
                if ($userAccount) {
                    $userAccount->increment('balance', $creditedAmount);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Wallet topup verified successfully',
                    'amount' => $transaction['amount'] ?? $payment->amount,
                    'reference' => $orderId,
                    'userId' => $payment->user_id,
                    'creditedAmount' => $creditedAmount,
                    'registrationFeeDeducted' => 0, // No registration fee for topup
                    'updatedAt' => $transaction['updatedAt'] ?? now()->toISOString(),
                ]);
            } else {
                return response()->json([
                    'error' => $result['error'],
                    'details' => $result['details'] ?? null
                ], 400);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('AlatPay topup verify error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Wallet topup verification error',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate customer email for AlatPay
     */
    private function generateCustomerEmail(User $user): string
    {
        $firstName = $this->getFirstName($user->name);
        return "{$firstName}-{$user->phone}@mightyshare.com";
    }

    /**
     * Get first name from full name
     */
    private function getFirstName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        return $parts[0] ?? $fullName;
    }

    /**
     * Get last name from full name
     */
    private function getLastName(string $fullName): string
    {
        $parts = explode(' ', $fullName);
        return $parts[1] ?? $fullName;
    }
}
