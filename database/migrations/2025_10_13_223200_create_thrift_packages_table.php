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
        Schema::create('thrift_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('price');
            $table->integer('duration'); // in weeks
            $table->integer('profit_percentage');
            $table->text('description');
            $table->text('terms');
            $table->boolean('is_active')->default(true);
            $table->integer('min_contribution')->nullable();
            $table->integer('max_contribution')->nullable();
            $table->integer('number_of_accounts')->nullable();
            $table->integer('min_number_of_accounts')->nullable();
            $table->json('features')->default('[]');
            $table->timestamps();
            
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thrift_packages');
    }
};
