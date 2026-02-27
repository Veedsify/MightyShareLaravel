<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('thrift_packages', function (Blueprint $table) {
            $table->string('distribution_frequency')->default('monthly')->after('min_contribution');
        });
    }

    public function down(): void
    {
        Schema::table('thrift_packages', function (Blueprint $table) {
            $table->dropColumn('distribution_frequency');
        });
    }
};
