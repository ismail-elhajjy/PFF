<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validation
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        $credentials = $request->only('email', 'password');

        // In Case of Fail
        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email or Password is wrong!'], 401);
        }

        // In Case of Success
        return response()->json([
            'token' => $token,
            'message' => 'Login successful',
        ]);
    }
}
