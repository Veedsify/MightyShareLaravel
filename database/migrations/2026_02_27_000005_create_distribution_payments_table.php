<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distribution_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->foreignId('thrift_package_id')->nullable()->constrained('thrift_packages')->onDelete('set null');
            $table->string('month', 7); // e.g. 2026-02
            $table->integer('amount');
            $table->string('status')->default('completed'); // completed, failed
            $table->string('reference')->nullable();
            $table->timestamps();

            $table->unique(['account_id', 'month'], 'dist_pay_account_month_unique');
            $table->index(['user_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribution_payments');
    }
};
