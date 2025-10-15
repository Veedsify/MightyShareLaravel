<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PaymentRegistrationController extends Controller
{
    /**
     * Show the payment registration page
     */
    public function show()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // If user has already paid, redirect to dashboard
        if ($user->registration_paid) {
            return redirect()->route('dashboard');
        }

        // Load user with thrift subscriptions and packages
        $user->load(['thriftSubscriptions.package']);

        return Inertia::render('payment/RegisterPayment', [
            'user' => $user
        ]);
    }

    /**
     * Mark user registration as paid
     */
    public function complete(Request $request)
    {
        $request->validate([
            'userId' => 'required|integer|exists:users,id'
        ]);

        $user = Auth::user();

        if (!$user || $user->id != $request->userId) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        try {
            $user->update(['registration_paid' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Registration marked as paid successfully',
                'user' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update registration status'
            ], 500);
        }
    }
}
