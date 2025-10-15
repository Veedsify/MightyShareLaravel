<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'phone' => '+2348000000000',
                'password' => Hash::make('password'),
                'referral_id' => 'REF-TEST-001',
                'registration_paid' => true,
                'email_verified_at' => now(),
            ]
        );

        // Seed ThriftPackages
        $this->call(ThriftPackageSeeder::class);
    }
}
