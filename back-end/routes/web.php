<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// For Contact Page
Route::post('/contact', [ContactController::class, 'validateData']);