<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// For Contact Page
Route::post('/contact', [ContactController::class, 'validateData']);

// For Login Page
Route::post('/login', [AuthController::class, 'login']);