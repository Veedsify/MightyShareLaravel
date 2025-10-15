<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AccountsController extends Controller
{
    public function create(): Response
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return Inertia::render('errors/404', [
                    'error' => 'User not found'
                ]);
            }

            // Load user with accounts and active thrift subscription
            $userData = User::with([
                'accounts',
                'thriftSubscriptions' => function ($query) {
                    $query->where('status', 'active')->with('package');
                }
            ])->find($user->id);

            // Get active subscription
            $activeSubscription = $userData->thriftSubscriptions->first();
            
            // Determine account limits (min and max)
            $minAccountLimit = 1; // Default minimum
            $maxAccountLimit = 1; // Default maximum
            
            if ($activeSubscription && $activeSubscription->package) {
                $maxAccountLimit = $activeSubscription->package->number_of_accounts ?? 1;
                $minAccountLimit = $activeSubscription->package->min_number_of_accounts ?? 1;
            }

            $currentCount = $userData->accounts->count();
            $remaining = max(0, $maxAccountLimit - $currentCount);
            $needsMore = max(0, $minAccountLimit - $currentCount);

            // Format data for Inertia
            $formattedData = [
                'user' => [
                    'id' => $userData->id,
                    'name' => $userData->name,
                    'email' => $userData->email,
                    'accounts' => $userData->accounts->map(function ($account, $idx) {
                        return [
                            'id' => $account->id,
                            'accountNumber' => $account->account_number,
                            'balance' => $account->balance,
                            'createdAt' => $account->created_at->toISOString(),
                        ];
                    }),
                ],
                'limits' => [
                    'minAccountLimit' => $minAccountLimit,
                    'maxAccountLimit' => $maxAccountLimit,
                ],
                'currentCount' => $currentCount,
                'remaining' => $remaining,
                'needsMore' => $needsMore,
                'meetsMinimum' => $currentCount >= $minAccountLimit,
                'activeSubscription' => $activeSubscription ? [
                    'id' => $activeSubscription->id,
                    'package' => [
                        'name' => $activeSubscription->package->name,
                        'minAccountLimit' => $activeSubscription->package->min_number_of_accounts ?? 1,
                        'maxAccountLimit' => $activeSubscription->package->number_of_accounts ?? 1,
                    ],
                ] : null,
            ];

            return Inertia::render('accounts/Add', $formattedData);
        } catch (\Exception $e) {
            Log::error('Error loading add account page: ' . $e->getMessage());
            
            return Inertia::render('errors/500', [
                'error' => 'Failed to load page'
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            // Validate request
            $validated = $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            $quantity = $validated['quantity'];

            // Load user with accounts and active subscription
            $userData = User::with([
                'accounts',
                'thriftSubscriptions' => function ($query) {
                    $query->where('status', 'active')->with('package');
                }
            ])->find($user->id);

            // Get active subscription and determine limit
            $activeSubscription = $userData->thriftSubscriptions->first();
            $minAccountLimit = 1; // Default minimum
            $maxAccountLimit = 1; // Default maximum
            
            if ($activeSubscription && $activeSubscription->package) {
                $maxAccountLimit = $activeSubscription->package->number_of_accounts ?? 1;
                $minAccountLimit = $activeSubscription->package->min_number_of_accounts ?? 1;
            }

            $currentCount = $userData->accounts->count();

            // Check if user has reached maximum limit
            if ($currentCount >= $maxAccountLimit) {
                return response()->json([
                    'success' => false,
                    'error' => 'Maximum account limit reached for your current package',
                    'currentCount' => $currentCount,
                    'minLimit' => $minAccountLimit,
                    'maxLimit' => $maxAccountLimit,
                ], 400);
            }

            // Check if requested quantity exceeds available slots
            if ($currentCount + $quantity > $maxAccountLimit) {
                return response()->json([
                    'success' => false,
                    'error' => 'Requested quantity exceeds available account slots',
                    'currentCount' => $currentCount,
                    'minLimit' => $minAccountLimit,
                    'maxLimit' => $maxAccountLimit,
                    'remaining' => $maxAccountLimit - $currentCount,
                ], 400);
            }

            // Create accounts
            $createdAccounts = [];
            
            DB::beginTransaction();
            try {
                for ($i = 0; $i < $quantity; $i++) {
                    $account = Account::create([
                        'user_id' => $user->id,
                        'account_number' => $this->generateAccountNumber(),
                        'balance' => 0,
                        'total_contributions' => 0,
                        'rewards' => 0,
                        'total_debt' => 0,
                        'referral_earnings' => 0,
                    ]);

                    $createdAccounts[] = [
                        'id' => $account->id,
                        'accountNumber' => $account->account_number,
                        'balance' => $account->balance,
                        'createdAt' => $account->created_at->toISOString(),
                    ];
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully created {$quantity} account(s)",
                    'accounts' => $createdAccounts,
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid request data',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating accounts: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to create accounts',
            ], 500);
        }
    }

    /**
     * Generate a unique account number
     */
    private function generateAccountNumber(): string
    {
        do {
            $accountNumber = 'MS' . time() . rand(100, 999);
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }
}
