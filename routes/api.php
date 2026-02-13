<?php

use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('settlements/static-account/callback', [SettingsController::class, 'staticAccountCallback'])->name('static-account.callback');

// Contact endpoints
Route::post('contacts', [ContactController::class, 'store'])->name('contacts.store');
Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
Route::get('contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');
Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
