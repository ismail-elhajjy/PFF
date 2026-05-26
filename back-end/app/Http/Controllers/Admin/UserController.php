<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    

    // Get all users
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $users = User::query()
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
             ->orderBy('id', 'asc')
            ->paginate(10);

        $payload = $users->toArray();
        $payload['stats'] = [
            'total_users' => User::count(),
            'admin_count' => User::where('role', 'admin')->count(),
        ];

        return response()->json($payload);
    }


    // Update user role
    public function updateRole(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,client',
        ]);

        $user = User::findOrFail($id);

        if ($user->id === auth()->id() && $validated['role'] !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Action forbidden: You cannot remove your own admin role.'
            ], 403);
        }

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'status' => 'success',
            'message' => 'User role updated successfully',
            'user' => $user,
        ]);
    }


    // Delete user
    public function destroy($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            if ($user->id === auth()->id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Action forbidden: You cannot delete your own admin account.'
                ], 403);
            }
            $user->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete user. It might be linked to other records.'
            ], 500);
        }
    }
    
}
