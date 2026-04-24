<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillboardController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\RegisterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// For Contact Page 
Route::post('/contact', [ContactController::class, 'validateData']);

// For Login Page
Route::post('/login', [AuthController::class, 'login']);

// For Register Page
Route::post('/register', [RegisterController::class, 'register']);

// For billbords Page
Route::get('/billboards', [BillboardController::class, 'billboards']);