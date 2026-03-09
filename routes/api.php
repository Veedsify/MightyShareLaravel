<?php

use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('settlements/static-account/callback', [SettingsController::class, 'staticAccountCallback'])->name('static-account.callback');

// TEST ONLY: fake top-up endpoint for development
// Route::post('test/topup', function (Request $request) {
//     if (app()->environment('production')) {
//         abort(404);
//     }

//     $request->validate([
//         'user_id' => 'required|exists:users,id',
//         'amount' => 'required|integer|min:1',
//     ]);

//     $topUpService = app(\App\Services\TopUpService::class);
//     $result = $topUpService->processTopUp(
//         $request->input('user_id'),
//         $request->input('amount'),
//         'test',
//         'TEST-' . now()->timestamp,
//     );

//     return response()->json([
//         'message' => 'Top-up processed',
//         'data' => [
//             'transaction_reference' => $result['topup_transaction']->reference,
//             'amount' => $result['topup_transaction']->amount,
//             'registration_deducted' => $result['registration_deducted'],
//             'remaining_balance' => $result['remaining_balance'],
//         ],
//     ]);
// })->name('test.topup');

// Contact endpoints
Route::post('contacts', [ContactController::class, 'store'])->name('contacts.store');
Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
Route::get('contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');
Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
