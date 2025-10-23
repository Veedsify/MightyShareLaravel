<?php

namespace App\Http\Controllers;

use App\Models\ThriftPackage;
use App\Services\PackageService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PackagesController extends Controller
{

    private PackageService $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index(): Response
    {
        $packages = $this->packageService->getAllPackages();
        $mySubscriptions = $this->packageService->getMySubscriptions();
        Log::info('My Subscriptions:', ['subscriptions' => $mySubscriptions]);

        return Inertia::render('packages/Packages', [
            'packages' => $packages,
            'mySubscriptions' => $mySubscriptions,
        ]);
    }

    public function mySubscriptions(): Response
    {
        $user = Auth::user();

        // Fetch all subscriptions for the authenticated user with related package
        $subscriptions = $user->thriftSubscriptions()
            ->with('package')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($subscription) => [
                'id' => $subscription->id,
                'packageName' => $subscription->package?->name ?? 'Unknown Package',
                'packageTier' => $this->getTierFromPrice($subscription->package?->price ?? 0),
                'startDate' => $subscription->start_date?->format('Y-m-d'),
                'maturityDate' => $subscription->end_date?->format('Y-m-d'),
                'monthlyContribution' => '₦' . number_format($subscription->amount_invested / max(1, $subscription->start_date?->diffInMonths($subscription->end_date) ?? 1)),
                'totalContributed' => '₦' . number_format($subscription->amount_invested),
                'expectedReturn' => '₦' . number_format($subscription->expected_return ?? 0),
                'totalPayout' => '₦' . number_format(($subscription->amount_invested ?? 0) + ($subscription->expected_return ?? 0)),
                'status' => $subscription->status,
                'daysRemaining' => $subscription->end_date ? max(0, now()->diffInDays($subscription->end_date, false)) : 0,
                'progress' => $subscription->end_date ? min(100, max(0, (int)((1 - now()->diffInDays($subscription->end_date, false) / max(1, $subscription->start_date?->diffInDays($subscription->end_date) ?? 1)) * 100))) : 0,
                'completedAt' => $subscription->completed_at?->format('Y-m-d'),
                'cancelledAt' => $subscription->cancelled_at?->format('Y-m-d'),
                'notes' => $subscription->notes,
            ]);

        return Inertia::render('packages/MySubscriptions', [
            'subscriptions' => $subscriptions,
        ]);
    }

    /**
     * Determine package tier based on price
     */
    private function getTierFromPrice(int $price): string
    {
        if ($price <= 50000) {
            return 'Bronze';
        } elseif ($price <= 100000) {
            return 'Silver';
        } elseif ($price <= 200000) {
            return 'Gold';
        } else {
            return 'Platinum';
        }
    }
}
