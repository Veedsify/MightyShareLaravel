<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set PostgreSQL client encoding to UTF-8 to handle special characters like ₦
        if (config('database.default') === 'pgsql') {
            // Use a connection resolver to set encoding when connection is established
            DB::resolving(function ($connection) {
                if ($connection->getDriverName() === 'pgsql') {
                    $connection->getPdo()->exec("SET client_encoding TO 'UTF8'");
                }
            });
        }
    }
}
