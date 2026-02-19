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
                // Add referred_by to users table
                Schema::table('users', function (Blueprint $table) {
                        $table->unsignedBigInteger('referred_by')->nullable()->after('referral_id');
                        $table->integer('referral_points')->default(0)->after('referred_by');
                        $table->foreign('referred_by')->references('id')->on('users')->onDelete('set null');
                });

                // Drop old referrals table and recreate with better structure
                Schema::dropIfExists('referrals');

                Schema::create('referrals', function (Blueprint $table) {
                        $table->id();
                        $table->foreignId('referrer_id')->constrained('users')->onDelete('cascade');
                        $table->foreignId('referred_id')->constrained('users')->onDelete('cascade');
                        $table->integer('points_earned')->default(10);
                        $table->string('status')->default('active'); // active, rewarded
                        $table->timestamp('rewarded_at')->nullable();
                        $table->timestamps();

                        $table->unique('referred_id'); // A user can only be referred once
                        $table->index('referrer_id');
                });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
                Schema::dropIfExists('referrals');

                // Recreate original referrals table
                Schema::create('referrals', function (Blueprint $table) {
                        $table->id();
                        $table->string('referral_code');
                        $table->integer('referred_user_id')->nullable();
                        $table->string('referred_name')->nullable();
                        $table->string('referred_phone')->nullable();
                        $table->string('status')->default('pending');
                        $table->integer('reward_amount')->default(0);
                        $table->timestamp('rewarded_at')->nullable();
                        $table->foreignId('account_id')->constrained()->onDelete('cascade');
                        $table->timestamp('created_at')->useCurrent();

                        $table->index('account_id');
                        $table->index('referral_code');
                });

                Schema::table('users', function (Blueprint $table) {
                        $table->dropForeign(['referred_by']);
                        $table->dropColumn(['referred_by', 'referral_points']);
                });
        }
};
