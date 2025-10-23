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
                  $table->boolean('email_notifications')->default(true)->after('notifications');
                  $table->boolean('sms_notifications')->default(true)->after('email_notifications');
                  $table->boolean('transaction_alerts')->default(true)->after('sms_notifications');
                  $table->boolean('marketing_emails')->default(false)->after('transaction_alerts');
                  $table->date('date_of_birth')->nullable()->after('phone');
            });
      }

      /**
       * Reverse the migrations.
       */
      public function down(): void
      {
            Schema::table('users', function (Blueprint $table) {
                  $table->dropColumn([
                        'email_notifications',
                        'sms_notifications',
                        'transaction_alerts',
                        'marketing_emails',
                        'date_of_birth',
                  ]);
            });
      }
};
