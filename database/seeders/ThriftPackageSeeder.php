<?php

namespace Database\Seeders;

use App\Models\ThriftPackage;
use Illuminate\Database\Seeder;

class ThriftPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Option A',
                'price' => 2400, // NGN2,500 monthly
                'duration' => 30, // 3 months in weeks
                'profit_percentage' => 5, // 5% returns
                'description' => 'Contribute 2,400 weekly for 30 weeks and get Cash back of 120,000 with foodstuff worth 25,000.',
                'terms' => 'Monthly contribution of NGN2,500 for 3 months. Maximum of 100 accounts can be managed. 5% profit on successful completion. Early withdrawal penalties may apply.',
                'is_active' => true,
                'min_number_of_accounts' => 1,
                'number_of_accounts' => 100,
                'min_contribution' => 2400,
                'max_contribution' => 100000, // 100 account limit * NGN1,000 average
                'features' => [
                    'Monthly contribution plan',
                    'Up to 100 accounts',
                    '30 weeks duration',
                    'Customer support',
                    'Cash Back of 120,000 in 30 weeks, food stuff worth 25,000',
                ]
            ],
            [
                'name' => 'Option B',
                'price' => 10000, // NGN10,000 monthly
                'duration' => 28, // 6 months in weeks
                'profit_percentage' => 8, // 8% returns
                'description' => 'Contribute 10,000 monthly for 7 months and get Cash back of 120,000 with foodstuff worth 30,000.',
                'terms' => 'Monthly contribution of NGN10,000 for 6 months. Maximum of 500 accounts can be managed. 8% profit on successful completion. Priority customer support included.',
                'is_active' => true,
                'min_number_of_accounts' => 1,
                'number_of_accounts' => 500,
                'min_contribution' => 10000,
                'max_contribution' => 500000, // 500 account limit * NGN1,000 average
                'features' => [
                    'Monthly contribution plan',
                    'Up to 500 accounts',
                    '7 months duration',
                    'Customer support',
                    'Cash Back of 120,000 in 7 months, food stuff worth 30,000',
                ]
            ],
            [
                'name' => 'Option C',
                'price' => 70000, // NGN70,000 one-time
                'duration' => 24, // 6 months in weeks
                'profit_percentage' => 12, // 12% returns
                'description' => 'Contribute 70,000  once and get Cash back of 120,000 in 6 months with foodstuff worth 30,000.',
                'terms' => 'One-time payment of NGN70,000 for 6 months access. Maximum of 1000 accounts can be managed. 12% profit on successful completion. Premium support and exclusive features included.',
                'is_active' => true,
                'min_number_of_accounts' => 10,
                'number_of_accounts' => 1000,
                'min_contribution' => 70000,
                'max_contribution' => 1000000, // 1000 account limit * NGN1,000 average
                'features' => [
                    'One-time payment plan',
                    'Up to 1000 accounts',
                    '6 months duration',
                    'Premium 24/7 support',
                    'Cash Back of 120,000 in 6 months, food stuff worth 30,000',
                ]
            ]
        ];

        foreach ($packages as $package) {
            ThriftPackage::create(
                [
                    'name' => $package['name'],
                    'price' => $package['price'],
                    'duration' => $package['duration'],
                    'profit_percentage' => $package['profit_percentage'],
                    'description' => $package['description'],
                    'terms' => $package['terms'],
                    'is_active' => $package['is_active'],
                    'min_number_of_accounts' => $package['min_number_of_accounts'],
                    'number_of_accounts' => $package['number_of_accounts'],
                    'min_contribution' => $package['min_contribution'],
                    'max_contribution' => $package['max_contribution'],
                    'features' => $package['features'],
                ],
            );
        }
    }
}
