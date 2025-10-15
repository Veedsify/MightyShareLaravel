<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('dashboard loads user data correctly', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '+1234567890',
    ]);

    // Create an account for the user
    $account = \App\Models\Account::factory()->create([
        'user_id' => $user->id,
        'account_number' => 'MS123456789',
        'balance' => 250000, // ₦2,500.00 in kobo
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk();

    // Check that user data is passed to the view
    $response->assertInertia(
        fn($page) =>
        $page->component('dashboard/Dashboard')
            ->has('user')
            ->where('user.name', 'John Doe')
            ->where('user.email', 'john@example.com')
            ->has('user.accounts')
            ->has('dashboardStats')
            ->has('recentTransactions')
    );
});
test('dashboard handles users with no accounts gracefully', function () {
    $user = User::factory()->create([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk();

    // Check that dashboard still loads with empty data
    $response->assertInertia(
        fn($page) =>
        $page->component('dashboard/Dashboard')
            ->has('user')
            ->where('user.name', 'Jane Doe')
            ->where('user.accounts', [])
            ->where('dashboardStats.totalBalance', '₦0.00')
            ->where('dashboardStats.totalTransactions', 0)
            ->where('recentTransactions', [])
    );
});
