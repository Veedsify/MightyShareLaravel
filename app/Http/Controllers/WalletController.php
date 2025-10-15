<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\StaticAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Load user with accounts, static account, and active thrift subscription with package
        $user->load([
            'accounts',
            'staticAccount',
            'thriftSubscriptions' => function ($query) {
                $query->where('status', 'active')
                      ->with('package')
                      ->latest()
                      ->limit(1);
            }
        ]);
        
        // Get the active package
        $activeSubscription = $user->thriftSubscriptions->first();
        $package = $activeSubscription?->package;
        $packagePrice = $package?->price ?? 0;
        $minContribution = $package?->min_contribution ?? 0;
        
        // Calculate unpaid accounts
        $unpaidAccounts = $user->accounts->where('is_paid', false);
        $unpaidAccountsCount = $unpaidAccounts->count();
        $totalInitialPaymentRequired = $unpaidAccountsCount * $packagePrice;
        
        // Get static account balance
        $staticAccountBalance = $user->staticAccount?->balance ?? 0;
        
        return Inertia::render('wallet/Wallet', [
            'walletData' => [
                'staticAccountBalance' => $staticAccountBalance,
                'hasStaticAccount' => $user->staticAccount !== null,
                'staticAccountNumber' => $user->staticAccount?->account_number,
                'staticAccountBank' => $user->staticAccount?->bank_name,
                'unpaidAccountsCount' => $unpaidAccountsCount,
                'totalInitialPaymentRequired' => $totalInitialPaymentRequired,
                'packagePrice' => $packagePrice,
                'minContribution' => $minContribution,
                'packageName' => $package?->name ?? 'No Active Package',
                'accounts' => $user->accounts->map(function ($account) {
                    return [
                        'id' => $account->id,
                        'account_number' => $account->account_number,
                        'balance' => $account->balance,
                        'is_paid' => $account->is_paid,
                    ];
                }),
            ],
        ]);
    }
    
    public function topup(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1',
        ]);
        
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Check if user has static account
        $staticAccount = $user->staticAccount;
        
        if (!$staticAccount) {
            return back()->withErrors([
                'amount' => 'You need to generate a static account first. Please go to Settings to create one.'
            ]);
        }
        
        // Load user's active subscription with package
        $user->load([
            'accounts',
            'thriftSubscriptions' => function ($query) {
                $query->where('status', 'active')
                      ->with('package')
                      ->latest()
                      ->limit(1);
            }
        ]);
        
        $activeSubscription = $user->thriftSubscriptions->first();
        $package = $activeSubscription?->package;
        
        if (!$package) {
            return back()->withErrors([
                'amount' => 'No active package found. Please subscribe to a package first.'
            ]);
        }
        
        $packagePrice = $package->price;
        $minContribution = $package->min_contribution;
        $topupAmount = $validated['amount'];
        
        // Get unpaid accounts
        $unpaidAccounts = $user->accounts->where('is_paid', false);
        $unpaidAccountsCount = $unpaidAccounts->count();
        $totalUnpaidAmount = $unpaidAccountsCount * $packagePrice;
        
        DB::beginTransaction();
        
        try {
            // If there are unpaid accounts
            if ($unpaidAccountsCount > 0) {
                // Check if topup amount covers all unpaid accounts
                if ($topupAmount < $totalUnpaidAmount) {
                    DB::rollBack();
                    return back()->withErrors([
                        'amount' => "You have {$unpaidAccountsCount} unpaid account(s). Minimum top-up required: ₦" . number_format($totalUnpaidAmount, 2) . " ({$unpaidAccountsCount} × ₦" . number_format($packagePrice, 2) . ")"
                    ]);
                }
                
                // Mark all unpaid accounts as paid
                foreach ($unpaidAccounts as $account) {
                    $account->is_paid = true;
                    $account->save();
                }
                
                // Calculate remaining amount after paying for accounts
                $remainingAmount = $topupAmount - $totalUnpaidAmount;
                
                // Add remaining amount to static account balance
                $staticAccount->balance += $remainingAmount;
                $staticAccount->save();
                
                DB::commit();
                
                return back()->with('success', "Successfully paid for {$unpaidAccountsCount} account(s) and added ₦" . number_format($remainingAmount, 2) . " to your balance!");
            } else {
                // No unpaid accounts - check minimum contribution
                if ($topupAmount < $minContribution) {
                    DB::rollBack();
                    return back()->withErrors([
                        'amount' => "Minimum top-up amount is ₦" . number_format($minContribution, 2)
                    ]);
                }
                
                // Add full amount to static account balance
                $staticAccount->balance += $topupAmount;
                $staticAccount->save();
                
                DB::commit();
                
                return back()->with('success', 'Top-up successful! ₦' . number_format($topupAmount, 2) . ' added to your balance.');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'amount' => 'An error occurred during top-up. Please try again.'
            ]);
        }
    }
}
