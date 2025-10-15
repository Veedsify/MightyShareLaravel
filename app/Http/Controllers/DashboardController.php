<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return Inertia::render('errors/404', [
                    'error' => 'User not found'
                ]);
            }

            // Load user data with comprehensive relationships
            $userData = \App\Models\User::with([
                'accounts' => function ($query) {
                    $query->select('id', 'user_id', 'account_number', 'balance', 'total_contributions', 'rewards', 'total_debt', 'referral_earnings');
                },
                'accounts.transactions' => function ($query) {
                    $query->orderBy('created_at', 'desc')->limit(10);
                },
                'thriftSubscriptions' => function ($query) {
                    $query->with('package');
                }
            ])->find($user->id);

            if (!$userData) {
                return Inertia::render('errors/404', [
                    'error' => 'User not found'
                ]);
            }

            // Calculate dashboard statistics
            $totalBalance = $userData->accounts->sum('balance');
            $totalTransactions = $userData->accounts->sum(function ($account) {
                return $account->transactions->count();
            });
            $totalContributions = $userData->accounts->sum('total_contributions');
            $totalRewards = $userData->accounts->sum('rewards');
            $activePackagesCount = $userData->thriftSubscriptions->where('status', 'active')->count();

            // Get recent transactions from all accounts
            $recentTransactions = collect();
            foreach ($userData->accounts as $account) {
                foreach ($account->transactions as $transaction) {
                    $recentTransactions->push([
                        'id' => $transaction->id,
                        'type' => ucfirst($transaction->type),
                        'amount' => '₦' . number_format($transaction->amount / 100, 2),
                        'status' => $transaction->status,
                        'date' => $transaction->created_at->diffForHumans(),
                        'reference' => $transaction->reference,
                        'accountNumber' => $account->account_number,
                    ]);
                }
            }
            $recentTransactions = $recentTransactions->sortByDesc('id')->take(5)->values();

            // Format user data for Inertia.js compatibility (matching Next.js API structure)
            $dashboardData = [
                'success' => true,
                'user' => [
                    'id' => $userData->id,
                    'name' => $userData->name,
                    'email' => $userData->email,
                    'phone' => $userData->phone,
                    'referralId' => $userData->referral_id,
                    'registrationPaid' => $userData->registration_paid,
                    'planStartDate' => $userData->plan_start_date,
                    'lastActivity' => $userData->last_activity,
                    'notifications' => $userData->notifications ?? [],
                    'accounts' => $userData->accounts->map(function ($account, $idx) {
                        if ($idx === 0) {
                            return [
                                'id' => $account->id,
                                'name' => 'Default ' . substr($account->account_number, -4), // Generate friendly name
                                'accountNumber' => $account->account_number,
                                'balance' => '₦' . number_format($account->balance / 100, 2),
                                'balanceRaw' => $account->balance,
                                'totalContributions' => $account->total_contributions,
                                'rewards' => $account->rewards,
                                'totalDebt' => $account->total_debt,
                                'referralEarnings' => $account->referral_earnings,
                            ];
                        } else {
                            return [
                                'id' => $account->id,
                                'name' => 'Account ' . substr($account->account_number, -4), // Generate friendly name
                                'accountNumber' => $account->account_number,
                                'balance' => '₦' . number_format($account->balance / 100, 2),
                                'balanceRaw' => $account->balance,
                                'totalContributions' => $account->total_contributions,
                                'rewards' => $account->rewards,
                                'totalDebt' => $account->total_debt,
                                'referralEarnings' => $account->referral_earnings,
                            ];
                        }
                    }),
                    'thriftSubscriptions' => $userData->thriftSubscriptions->map(function ($subscription) {
                        return [
                            'id' => $subscription->id,
                            'packageId' => $subscription->package_id,
                            'amountInvested' => $subscription->amount_invested ?? 0,
                            'status' => $subscription->status,
                            'package' => $subscription->package ? [
                                'id' => $subscription->package->id,
                                'name' => $subscription->package->name,
                                'price' => $subscription->package->price,
                                'duration' => $subscription->package->duration,
                                'profitPercentage' => $subscription->package->profit_percentage,
                                'description' => $subscription->package->description ?? '',
                            ] : null,
                        ];
                    }),
                ],
                'dashboardStats' => [
                    'totalBalance' => '₦' . number_format($totalBalance / 100, 2),
                    'totalTransactions' => $totalTransactions,
                    'totalContributions' => '₦' . number_format($totalContributions / 100, 2),
                    'totalRewards' => '₦' . number_format($totalRewards / 100, 2),
                    'activePackages' => $activePackagesCount,
                ],
                'recentTransactions' => $recentTransactions,
            ];

            return Inertia::render('dashboard/Dashboard', $dashboardData);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Dashboard loading error: ' . $e->getMessage());

            return Inertia::render('errors/500', [
                'error' => 'Failed to load dashboard'
            ]);
        }
    }
}
