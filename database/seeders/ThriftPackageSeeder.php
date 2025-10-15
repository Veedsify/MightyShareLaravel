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
                'price' => 2500, // ₦2,500 monthly
                'duration' => 12, // 3 months in weeks
                'profit_percentage' => 5, // 5% returns
                'description' => 'Perfect for beginners looking to start their thrift journey. Affordable monthly contributions with steady returns.',
                'terms' => 'Monthly contribution of ₦2,500 for 3 months. Maximum of 100 accounts can be managed. 5% profit on successful completion. Early withdrawal penalties may apply.',
                'is_active' => true,
                'min_contribution' => 2400,
                'max_contribution' => 100000, // 100 account limit * ₦1,000 average
                'features' => [
                    'Monthly contribution plan',
                    'Up to 100 accounts',
                    '5% profit returns',
                    '3 months duration',
                    'Basic customer support',
                    'Mobile app access'
                ]
            ],
            [
                'name' => 'Option B',
                'price' => 10000, // ₦10,000 monthly
                'duration' => 24, // 6 months in weeks
                'profit_percentage' => 8, // 8% returns
                'description' => 'Ideal for regular savers who want better returns and can manage more accounts. Enhanced features and support.',
                'terms' => 'Monthly contribution of ₦10,000 for 6 months. Maximum of 500 accounts can be managed. 8% profit on successful completion. Priority customer support included.',
                'is_active' => true,
                'min_contribution' => 10000,
                'max_contribution' => 500000, // 500 account limit * ₦1,000 average
                'features' => [
                    'Monthly contribution plan',
                    'Up to 500 accounts',
                    '8% profit returns',
                    '6 months duration',
                    'Priority customer support',
                    'Advanced analytics dashboard',
                    'Mobile app access',
                    'SMS notifications'
                ]
            ],
            [
                'name' => 'Option C',
                'price' => 70000, // ₦70,000 one-time
                'duration' => 24, // 6 months in weeks
                'profit_percentage' => 12, // 12% returns
                'description' => 'Premium package for serious investors. One-time payment with highest returns and maximum account management capacity.',
                'terms' => 'One-time payment of ₦70,000 for 6 months access. Maximum of 1000 accounts can be managed. 12% profit on successful completion. Premium support and exclusive features included.',
                'is_active' => true,
                'min_contribution' => 70000,
                'max_contribution' => 1000000, // 1000 account limit * ₦1,000 average
                'features' => [
                    'One-time payment plan',
                    'Up to 1000 accounts',
                    '12% profit returns',
                    '6 months duration',
                    'Premium 24/7 support',
                    'Advanced analytics dashboard',
                    'Mobile app access',
                    'SMS & Email notifications',
                    'Dedicated account manager',
                    'Early withdrawal flexibility',
                    'Bonus referral rewards'
                ]
            ]
        ];

        foreach ($packages as $package) {
            ThriftPackage::updateOrCreate(
                ['name' => $package['name']],
                $package
            );
        }
    }
}
