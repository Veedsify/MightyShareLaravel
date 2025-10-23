<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TransactionsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        // Fetch all payments for the authenticated user
        $payments = $user->payments()
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($payment) => [
                'id' => $payment->id,
                'reference' => $payment->order_id ?? "PAY-{$payment->id}",
                'amount' => $payment->amount,
                'type' => $payment->amount > 0 ? 'credit' : 'debit',
                'status' => $payment->status->value,
                'paymentMethod' => $payment->description,
                'description' => $payment->description,
                'createdAt' => $payment->created_at?->toIso8601String(),
                'accountNumber' => null,
            ]);

        return Inertia::render('transactions/Transactions', [
            'transactions' => $payments,
        ]);
    }
}
