<?php

use App\Http\Controllers\AccountsController;
use App\Http\Controllers\AlatPayController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\ComplaintsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PackagesController;
use App\Http\Controllers\PaymentRegistrationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SettlementsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, "loginPage"])->name('login');
    Route::post('login', [AuthController::class, "login"])->name('login.user');
    Route::get('register', [AuthController::class, "registerPage"])->name('register');
    Route::post('register', [AuthController::class, "register"])->name('register.user');

    // Password Reset Routes
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, "logout"])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/

// Protected payment routes (requires authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('register-payment', [PaymentRegistrationController::class, 'show'])->name('register-payment');
    Route::post('payment/registration/complete', [PaymentRegistrationController::class, 'complete'])->name('payment.registration.complete');

    // AlatPay protected routes
    Route::post('alatpay/initialize', [AlatPayController::class, 'initialize'])->name('alatpay.initialize');
    Route::post('alatpay/verify', [AlatPayController::class, 'verify'])->name('alatpay.verify');

    // Wallet topup routes
    Route::post('alatpay/topup', [AlatPayController::class, 'topupInitialize'])->name('alatpay.topup');
    Route::post('alatpay/topup-verify', [AlatPayController::class, 'topupVerify'])->name('alatpay.topup.verify');
});

// Public callback routes (no auth required for webhooks)
Route::get('alatpay/callback', [AlatPayController::class, 'callbackGet'])->name('alatpay.callback.get');
Route::post('alatpay/callback', [AlatPayController::class, 'callbackPost'])->name('alatpay.callback.post');

/*
|--------------------------------------------------------------------------
| Dashboard Routes (Protected)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix("dashboard")->group(function () {
    // Main dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Account management
    Route::prefix('accounts')->name('accounts.')->group(function () {
        Route::get('add', [AccountsController::class, 'create'])->name('add');
        Route::post('store', [AccountsController::class, 'store'])->name('store');
    });

    // Wallet management
    Route::get('wallet', [WalletController::class, 'index'])->name('wallet');
    Route::post('wallet/topup', [WalletController::class, 'topup'])->name('wallet.topup');

    // Transaction management
    Route::get('transactions', [TransactionsController::class, 'index'])->name('transactions');

    // Settlement management
    Route::prefix('settlements')->name('settlements.')->group(function () {
        Route::get('/', [SettlementsController::class, 'index'])->name('index');
        Route::get('due-for-clearance', [SettlementsController::class, 'dueForClearance'])->name('due-for-clearance');
        Route::get('all-paid-accounts', [SettlementsController::class, 'allPaidAccounts'])->name('all-paid-accounts');
        Route::get('request-bulk-withdrawal', [SettlementsController::class, 'requestBulkWithdrawal'])->name('request-bulk-withdrawal');
        Route::get('next-settlement', [SettlementsController::class, 'nextSettlement'])->name('next-settlement');
    });

    // Package management
    Route::prefix('packages')->name('packages.')->group(function () {
        Route::get('/', [PackagesController::class, 'index'])->name('index');
        Route::get('my-subscriptions', [PackagesController::class, 'mySubscriptions'])->name('my-subscriptions');
    });

    // Complaint management
    Route::prefix('complaints')->name('complaints.')->group(function () {
        Route::get('/', [ComplaintsController::class, 'index'])->name('index');
        Route::post('store', [ComplaintsController::class, 'store'])->name('store');
        Route::post('{id}/reply', [ComplaintsController::class, 'addReply'])->name('reply');
    });

    // Notifications
    Route::get('notifications', [NotificationsController::class, 'index'])->name('notifications');

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        
        // Static Account routes
        Route::post('static-account/create', [SettingsController::class, 'createStaticAccount'])->name('static-account.create');
        Route::post('static-account/verify', [SettingsController::class, 'verifyStaticAccount'])->name('static-account.verify');

        // Profile management
        Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Password management
        Route::put('password', [PasswordController::class, 'update'])->name('password.update');

        // Notifications management
        Route::put('notifications', [SettingsController::class, 'updateNotifications'])->name('notifications.update');

        // Two-factor authentication
        Route::post('two-factor-authentication', [TwoFactorAuthenticationController::class, 'store'])->name('two-factor.enable');
        Route::delete('two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy'])->name('two-factor.disable');
        Route::get('two-factor-qr-code', [TwoFactorAuthenticationController::class, 'show'])->name('two-factor.qr-code');
        Route::get('two-factor-recovery-codes', [TwoFactorAuthenticationController::class, 'recoveryCode'])->name('two-factor.recovery-codes');
        Route::post('two-factor-recovery-codes', [TwoFactorAuthenticationController::class, 'regenerateRecoveryCodes'])->name('two-factor.recovery-codes.regenerate');
    });
});

/*
|--------------------------------------------------------------------------
| Additional API-like Routes for AJAX Requests
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Account management API endpoints
    Route::prefix('api/accounts')->name('api.accounts.')->group(function () {
        Route::get('/', [AccountsController::class, 'index'])->name('index');
        Route::post('/', [AccountsController::class, 'store'])->name('store');
    });

    // Search API endpoint
    Route::get('api/search/{query}', [SearchController::class, 'search'])->name('api.search');

    // Transaction API endpoints
    Route::prefix('api/transactions')->name('api.transactions.')->group(function () {
        Route::get('/', [TransactionsController::class, 'index'])->name('index');
    });

    // Wallet API endpoints
    Route::prefix('api/wallet')->name('api.wallet.')->group(function () {
        Route::get('/', [WalletController::class, 'show'])->name('show');
        Route::post('topup', [WalletController::class, 'topup'])->name('topup');
    });

    // Settlement API endpoints
    Route::prefix('api/settlements')->name('api.settlements.')->group(function () {
        Route::get('/', [SettlementsController::class, 'index'])->name('index');
        Route::post('bulk-withdrawal', [SettlementsController::class, 'requestBulkWithdrawal'])->name('bulk-withdrawal');
    });

    // Package API endpoints
    Route::prefix('api/packages')->name('api.packages.')->group(function () {
        Route::get('/', [PackagesController::class, 'index'])->name('index');
        Route::get('subscriptions', [PackagesController::class, 'mySubscriptions'])->name('subscriptions');
        Route::post('subscribe', [PackagesController::class, 'subscribe'])->name('subscribe');
    });

    // Notification API endpoints
    Route::prefix('api/notifications')->name('api.notifications.')->group(function () {
        Route::post('{id}/read', [NotificationsController::class, 'markAsRead'])->name('mark-read');
        Route::post('read-all', [NotificationsController::class, 'markAllAsRead'])->name('mark-all-read');
    });
});
