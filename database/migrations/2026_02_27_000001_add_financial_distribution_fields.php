<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('platform_transaction_reference')->constrained()->nullOnDelete();
            $table->string('direction')->default('debit')->after('type');
            $table->dropForeign(['account_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('account_id')->nullable()->change();
            $table->foreign('account_id')->references('id')->on('accounts')->nullOnDelete();
            $table->index('user_id');
        });

        Schema::create('distribution_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('month', 7); // YYYY-MM
            $table->foreignId('package_id')->nullable()->constrained('thrift_packages')->nullOnDelete();
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->integer('total_distributed')->default(0);
            $table->integer('total_shortfall')->default(0);
            $table->integer('accounts_processed')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'month']);
            $table->index('month');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distribution_logs');

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('account_id')->nullable(false)->change();
            $table->foreign('account_id')->references('id')->on('accounts')->cascadeOnDelete();
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn(['user_id', 'direction']);
        });
    }
};
