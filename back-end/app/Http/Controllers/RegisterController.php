<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // ///////////////////
        // Validation Form //
        // ///////////////////
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|string|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        // /////////////////////
        // Register for User //
        // /////////////////////
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // ///////////////////////
        // Response If Success //
        // ///////////////////////
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }
}
