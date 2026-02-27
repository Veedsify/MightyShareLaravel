<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('static_accounts', function (Blueprint $table) {
            $table->integer('pending_registration_balance')->default(0)->after('balance');
            $table->integer('pending_distribution_balance')->default(0)->after('pending_registration_balance');
        });
    }

    public function down(): void
    {
        Schema::table('static_accounts', function (Blueprint $table) {
            $table->dropColumn(['pending_registration_balance', 'pending_distribution_balance']);
        });
    }
};
