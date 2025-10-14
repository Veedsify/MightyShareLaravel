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
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->string('referral_code');
            $table->integer('referred_user_id')->nullable();
            $table->string('referred_name')->nullable();
            $table->string('referred_phone')->nullable();
            $table->string('status')->default('pending'); // pending, active, rewarded
            $table->integer('reward_amount')->default(0);
            $table->timestamp('rewarded_at')->nullable();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('account_id');
            $table->index('referral_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
