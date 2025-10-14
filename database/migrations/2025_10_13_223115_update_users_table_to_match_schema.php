<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop old columns
            $table->dropColumn(['name', 'email', 'email_verified_at', 'remember_token']);
            
            // Add new columns
            $table->string('fullname')->after('id');
            $table->string('phone')->unique()->after('fullname');
            $table->string('plan')->after('password');
            $table->string('referral_id')->unique()->after('plan');
            $table->timestamp('plan_start_date')->nullable()->default(now())->after('referral_id');
            $table->boolean('registration_paid')->default(false)->after('plan_start_date');
            $table->json('notifications')->default('[]')->after('registration_paid');
            $table->string('last_activity')->nullable()->after('notifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn([
                'fullname',
                'phone',
                'plan',
                'referral_id',
                'plan_start_date',
                'registration_paid',
                'notifications',
                'last_activity'
            ]);
            
            // Restore old columns
            $table->string('name')->after('id');
            $table->string('email')->unique()->after('name');
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->rememberToken()->after('password');
        });
    }
};
