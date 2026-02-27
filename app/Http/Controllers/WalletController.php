<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\StaticAccount;
use App\Services\RegistrationFeeService;
use App\Services\TopUpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WalletController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

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

        $activeSubscription = $user->thriftSubscriptions->first();
        $package = $activeSubscription?->package;
        $minContribution = $package?->min_contribution ?? 0;

        $unpaidAccounts = $user->accounts->where('is_paid', false);
        $unpaidAccountsCount = $unpaidAccounts->count();
        $registrationFee = RegistrationFeeService::REGISTRATION_FEE;
        $totalRegistrationRequired = $unpaidAccountsCount * $registrationFee;

        $staticAccount = $user->staticAccount;
        $staticAccountBalance = $staticAccount?->balance ?? 0;
        $pendingRegistrationBalance = $staticAccount?->pending_registration_balance ?? 0;

        return Inertia::render('wallet/Wallet', [
            'walletData' => [
                'staticAccountBalance' => $staticAccountBalance,
                'hasStaticAccount' => $staticAccount !== null,
                'staticAccountNumber' => $staticAccount?->account_number,
                'staticAccountBank' => $staticAccount?->bank_name,
                'unpaidAccountsCount' => $unpaidAccountsCount,
                'registrationFee' => $registrationFee,
                'totalRegistrationRequired' => $totalRegistrationRequired,
                'pendingRegistrationBalance' => $pendingRegistrationBalance,
                'minContribution' => $minContribution,
                'packageName' => $package?->name ?? 'No Active Package',
                'accounts' => $user->accounts->map(function ($account) {
                    return [
                        'id' => $account->id,
                        'account_number' => $account->account_number,
                        'balance' => $account->balance,
                        'total_contributions' => $account->total_contributions,
                        'is_paid' => $account->is_paid,
                        'is_primary' => $account->is_primary,
                        'created_at' => $account->created_at->format('Y-m-d H:i:s'),
                    ];
                })->sortByDesc('balance')->values(),
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

        if (!$user->staticAccount) {
            return back()->withErrors([
                'amount' => 'You need to generate a static account first. Please go to Settings to create one.'
            ]);
        }

        try {
            $topUpService = app(TopUpService::class);
            $result = $topUpService->processTopUp(
                $user->id,
                $validated['amount'],
            );

            $message = 'Top-up successful! ₦' . number_format($validated['amount'], 2) . ' added to your balance.';

            if ($result['registration_deducted'] > 0) {
                $message .= ' ₦' . number_format($result['registration_deducted'], 2) . ' deducted for pending registration fees.';
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors([
                'amount' => 'An error occurred during top-up. Please try again.'
            ]);
        }
    }
}
