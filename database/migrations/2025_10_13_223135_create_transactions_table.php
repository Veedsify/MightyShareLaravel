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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->integer('amount');
            $table->string('type'); // topup, withdrawal, contribution, reward, etc.
            $table->string('status')->default('pending'); // pending, successful, failed
            $table->string('payment_method')->nullable(); // wema, alatpay, bank_transfer, etc.
            $table->string('description')->nullable();
            $table->string('platform_transaction_reference')->nullable();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->index('account_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
