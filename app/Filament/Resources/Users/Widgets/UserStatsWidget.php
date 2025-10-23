<?php

namespace App\Filament\Resources\Users\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStatsWidget extends BaseWidget
{
      protected function getStats(): array
      {
            $totalUsers = User::count();
            $adminUsers = User::where('role', 'admin')->count();
            $regularUsers = User::where('role', 'user')->count();
            $registeredUsers = User::where('registration_paid', true)->count();
            $unregisteredUsers = User::where('registration_paid', false)->count();
            $verifiedEmails = User::whereNotNull('email_verified_at')->count();
            $activeSubscriptions = User::whereHas('thriftSubscriptions', function ($query) {
                  $query->where('status', 'active');
            })->count();

            $usersLastMonth = User::where('created_at', '>=', now()->subMonth())->count();
            $usersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();

            return [
                  Stat::make('Total Users', $totalUsers)
                        ->description($usersThisMonth . ' new this month')
                        ->descriptionIcon('heroicon-m-arrow-trending-up')
                        ->color('primary')
                        ->chart([7, 2, 10, 3, 15, 4, 17]),

                  Stat::make('Registered Users', $registeredUsers)
                        ->description($unregisteredUsers . ' pending registration')
                        ->descriptionIcon('heroicon-m-user-plus')
                        ->color('success')
                        ->chart([3, 5, 8, 12, 16, 20, $registeredUsers]),

                  Stat::make('Active Subscriptions', $activeSubscriptions)
                        ->description(round(($activeSubscriptions / max($totalUsers, 1)) * 100, 1) . '% of users')
                        ->descriptionIcon('heroicon-m-gift')
                        ->color('warning')
                        ->chart([2, 4, 6, 8, 10, 12, $activeSubscriptions]),

                  Stat::make('Email Verified', $verifiedEmails)
                        ->description(round(($verifiedEmails / max($totalUsers, 1)) * 100, 1) . '% verified')
                        ->descriptionIcon('heroicon-m-check-badge')
                        ->color('info')
                        ->chart([5, 10, 15, 20, 25, 30, $verifiedEmails]),
            ];
      }
}
