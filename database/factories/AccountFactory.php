<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'account_number' => 'MS' . time() . rand(100, 999),
            'balance' => fake()->numberBetween(0, 1000000), // Random balance in kobo
            'total_contributions' => fake()->numberBetween(0, 500000),
            'rewards' => fake()->numberBetween(0, 100000),
            'total_debt' => fake()->numberBetween(0, 50000),
            'referral_earnings' => fake()->numberBetween(0, 25000),
        ];
    }
}
