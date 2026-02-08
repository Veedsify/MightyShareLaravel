<?php

use App\Http\Controllers\SettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('settlements/static-account/callback', [SettingsController::class, 'staticAccountCallback'])->name('static-account.callback');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
