<?php

use App\Jobs\ProcessMonthlyDistribution;
use App\Models\Account;
use App\Models\ThriftSubscription;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Distribution check: runs daily at 01:00
// Dispatches jobs based on each user's account creation date
// - Monthly packages: distributes on same day-of-month as account was created
// - Weekly packages (distribution_frequency = 'weekly'): distributes on same day-of-week as account was created
Schedule::call(function () {
    $today = now();
    $dayOfMonth = $today->day;
    $dayOfWeek = $today->dayOfWeek;

    $userIds = ThriftSubscription::where('status', 'active')
        ->distinct('user_id')
        ->pluck('user_id');

    foreach ($userIds as $userId) {
        $subscription = ThriftSubscription::where('user_id', $userId)
            ->where('status', 'active')
            ->with('package')
            ->first();

        if (!$subscription?->package) {
            continue;
        }

        $package = $subscription->package;

        // Use primary account creation date as distribution anchor date
        $account = Account::where('user_id', $userId)
            ->where('is_primary', true)
            ->first()
            ?? Account::where('user_id', $userId)
            ->orderBy('id')
            ->first();

        if (!$account) {
            continue;
        }

        $createdAt = $account->created_at;

        if ($package->distribution_frequency === 'weekly') {
            // Weekly: dispatch on same day-of-week as account creation
            if ($dayOfWeek === $createdAt->dayOfWeek) {
                $period = $today->format('Y') . '-W' . $today->format('W');
                ProcessMonthlyDistribution::dispatch($userId, $period);
            }
        } else {
            // Monthly: dispatch on same day-of-month as account creation
            // Handles months shorter than the creation day (e.g. created on 31st)
            $creationDay = $createdAt->day;
            $targetDay = min($creationDay, $today->daysInMonth);

            if ($dayOfMonth === $targetDay) {
                ProcessMonthlyDistribution::dispatch($userId, $today->format('Y-m'));
            }
        }
    }
})->daily()->at('01:00')->name('distribution-check');
