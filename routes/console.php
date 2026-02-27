<?php

use App\Jobs\ProcessMonthlyDistribution;
use App\Models\ThriftSubscription;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Monthly distribution: runs daily, dispatches jobs on the 1st of each month
Schedule::call(function () {
    if (now()->day !== 1) {
        return;
    }

    $month = now()->format('Y-m');

    $userIds = ThriftSubscription::where('status', 'active')
        ->distinct('user_id')
        ->pluck('user_id');

    foreach ($userIds as $userId) {
        ProcessMonthlyDistribution::dispatch($userId, $month);
    }
})->daily()->at('01:00')->name('monthly-distribution-check');

// TEST ONLY: distribution every 10 seconds for development testing
Schedule::call(function () {
    $month = now()->format('Y-m');

    $userIds = ThriftSubscription::where('status', 'active')
        ->distinct('user_id')
        ->pluck('user_id');

    foreach ($userIds as $userId) {
        ProcessMonthlyDistribution::dispatch($userId, $month);
    }
})->everyTenSeconds()->name('test-distribution-check')
    ->environments(['local']);
