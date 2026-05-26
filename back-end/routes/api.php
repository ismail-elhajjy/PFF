<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillboardController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

// --------------------------------- //
//           Public Routes           //
// --------------------------------- //

// For Contact Page
Route::post('/contact', [ContactController::class, 'validateData']);

// For Login Page
Route::post('/login', [AuthController::class, 'login']);

// For Sign Up Page
Route::post('/register', [RegisterController::class, 'register']);

// For Billboards Cards
Route::get('/billboards', [BillboardController::class, 'billboards']);

// For Get One Billboard
Route::get('/billboards/{id}', [BillboardController::class, 'show']);

// For Generate PDF
Route::get('/reservations/pdf/{id}', [ReservationController::class, 'generatePDF']);

// --------------------------------- //
//         Protected Routes          //
// --------------------------------- //

Route::middleware('auth:api')->group(function () {
    Route::get('/notifications', function () {
        return auth()->user()->unreadNotifications;
    });

    Route::post('/notifications/mark-as-read', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Notifications marked as read']);
    });


    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'cancel']);
});

// --------------------------------- //
//           Admin Routes            //
// --------------------------------- //
Route::middleware(['auth:api', 'admin'])->group(function () {

    Route::get('/admin/stats', [DashboardController::class, 'index']);
    Route::get('/admin/contacts', [ContactController::class, 'index']);
    Route::apiResource('/admin/billboards', BillboardController::class)->except(['index', 'show']);
    Route::post('/admin/billboards', [BillboardController::class, 'store']);
    Route::get('/admin/reservations', [ReservationController::class, 'index']);
    Route::patch('/admin/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

    Route::get('/admin/users', [UserController::class, 'index']);
    Route::patch('/admin/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

    Route::get('/admin/settings', [SettingsController::class, 'show']);
    Route::put('/admin/settings/profile', [SettingsController::class, 'updateProfile']);
    Route::put('/admin/settings/password', [SettingsController::class, 'updatePassword']);
    Route::put('/admin/settings/preferences', [SettingsController::class, 'updatePreferences']);

    
});
