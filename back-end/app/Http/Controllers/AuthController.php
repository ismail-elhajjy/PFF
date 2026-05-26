<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    
    public function login(Request $request)
    {
        // 1. Validation Logic
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $credentials = $request->only('email', 'password');

        // 2. Authentication Attempt
        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password credentials.',
            ], 401);
        }

        // 3. Retrieve Authenticated User
        $user = auth('api')->user();

        // 4. Success Response
        return response()->json([
            'status' => 'success',
            'message' => 'Login successful.',
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'admin_preferences' => $user->admin_preferences,
            ],
        ], 200);
    }

    // This for To ensure that the user info is authenticated
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    // Logout
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

}

