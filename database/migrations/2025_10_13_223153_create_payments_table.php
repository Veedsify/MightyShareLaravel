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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('business_id');
            $table->integer('amount');
            $table->string('currency');
            $table->string('order_id')->unique();
            $table->string('description');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('customer_first_name');
            $table->string('customer_last_name');
            $table->string('customer_metadata')->nullable();
            $table->enum('status', ['PENDING', 'SUCCESSFUL', 'FAILED'])->default('PENDING');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
