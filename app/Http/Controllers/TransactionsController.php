<?php

namespace App\Http\Controllers;

use App\Models\DistributionPayment;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TransactionsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Fetch payments (legacy)
        $payments = $user->payments()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($payment) => [
                'id' => 'pay-' . $payment->id,
                'reference' => $payment->order_id ?? "PAY-{$payment->id}",
                'amount' => $payment->amount,
                'type' => 'payment',
                'direction' => $payment->amount > 0 ? 'credit' : 'debit',
                'status' => $payment->status->value,
                'paymentMethod' => $payment->description,
                'description' => $payment->description,
                'createdAt' => $payment->created_at?->toIso8601String(),
                'accountNumber' => null,
            ]);

        // Fetch topup/registration/pending transactions (NOT distribution)
        $transactions = Transaction::where('user_id', $user->id)
            ->whereNotIn('type', ['distribution', 'pending_distribution'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($txn) => [
                'id' => 'txn-' . $txn->id,
                'reference' => $txn->reference,
                'amount' => $txn->amount,
                'type' => $txn->type,
                'direction' => $txn->direction,
                'status' => $txn->status,
                'paymentMethod' => $txn->payment_method,
                'description' => $txn->description,
                'createdAt' => $txn->created_at?->toIso8601String(),
                'accountNumber' => $txn->account?->account_number,
            ]);

        // Combine and sort transactions and payments
        $allTransactions = collect([$payments, $transactions])
            ->flatten(1)
            ->sortByDesc('createdAt')
            ->values();

        // Fetch distribution payments (separate table)
        $distributionPayments = DistributionPayment::where('user_id', $user->id)
            ->with('account')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($dp) => [
                'id' => $dp->id,
                'accountNumber' => $dp->account?->account_number,
                'accountId' => $dp->account_id,
                'month' => $dp->month,
                'amount' => $dp->amount,
                'status' => $dp->status,
                'reference' => $dp->reference,
                'createdAt' => $dp->created_at?->toIso8601String(),
            ]);

        // Distribution summary per month
        $distributionSummary = DistributionPayment::where('user_id', $user->id)
            ->where('status', 'completed')
            ->selectRaw('month, count(*) as accounts_count, sum(amount) as total_amount')
            ->groupBy('month')
            ->orderByDesc('month')
            ->get()
            ->map(fn($row) => [
                'month' => $row->month,
                'accountsCount' => $row->accounts_count,
                'totalAmount' => $row->total_amount,
            ]);

        return Inertia::render('transactions/Transactions', [
            'transactions' => $allTransactions,
            'distributionPayments' => $distributionPayments,
            'distributionSummary' => $distributionSummary,
        ]);
    }
}
