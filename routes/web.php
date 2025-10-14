<?php

use App\Http\Controllers\AccountsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PackagesController;
use App\Http\Controllers\SettlementsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('login', [AuthController::class, "loginPage"])->name('login');
Route::post('login', [AuthController::class, "login"])->name('login.user');
Route::get('register', [AuthController::class, "registerPage"])->name('register');


Route::prefix('dashboard')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('accounts/add', [AccountsController::class, 'create'])->name('accounts.add');
    
    Route::get('wallet', [WalletController::class, 'index'])->name('wallet');
    
    Route::get('transactions', [TransactionsController::class, 'index'])->name('transactions');
    
    Route::get('settlements', [SettlementsController::class, 'index'])->name('settlements');
    
    Route::get('settlements/due-for-clearance', [SettlementsController::class, 'dueForClearance'])->name('settlements.due-for-clearance');
    
    Route::get('settlements/all-paid-accounts', [SettlementsController::class, 'allPaidAccounts'])->name('settlements.all-paid-accounts');
    
    Route::get('settlements/request-bulk-withdrawal', [SettlementsController::class, 'requestBulkWithdrawal'])->name('settlements.request-bulk-withdrawal');
    
    Route::get('settlements/next-settlement', [SettlementsController::class, 'nextSettlement'])->name('settlements.next-settlement');
    
    Route::get('packages', [PackagesController::class, 'index'])->name('packages');
    
    Route::get('packages/my-subscriptions', [PackagesController::class, 'mySubscriptions'])->name('packages.my-subscriptions');
    
    Route::get('complaints', [ComplaintsController::class, 'index'])->name('complaints');
    
    Route::get('notifications', [NotificationsController::class, 'index'])->name('notifications');
    
    Route::get('settings', [SettingsController::class, 'index'])->name('settings');
    
});