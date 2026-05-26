<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class SettingsController extends Controller
{


    // hadi tatjib ga3 data l7aliya dyl admin bach tban les info dyl admin account fi settings admin form
    public function show(): JsonResponse
    {
        $user = auth('api')->user();

        return response()->json([
            'status' => 'success',
            'user' => $this->formatUser($user),
            'preferences' => $this->formatPreferences($user->admin_preferences),
        ]);
    }


    // hadi tandiro biha update data dyl admin profile ila bghina nbadlo chi data 
    public function updateProfile(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin profile updated successfully.',
            'user' => $this->formatUser($user->fresh()),
        ]);
    }

    // hadi hiya li tandiro biha update password dyl admin y3ni fach nbadlo password ghadi ytbadl bdakchi jdid li darna
    public function updatePassword(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password updated successfully.',
        ]);
    }

    // hadi dyl dok Dashboard Preferences wach bghahom admin wla la 
    public function updatePreferences(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $validated = $request->validate([
            'emailNotifications' => ['required', 'boolean'],
            'reservationAlerts' => ['required', 'boolean'],
            'weeklyReports' => ['required', 'boolean'],
            'language' => ['required', 'string', Rule::in(['English', 'French', 'Arabic'])],
            'timezone' => ['required', 'string', Rule::in(['Africa/Casablanca', 'Europe/Paris', 'UTC'])],
        ]);

        $user->update([
            'admin_preferences' => $validated,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Dashboard preferences updated successfully.',
            'preferences' => $this->formatPreferences($validated),
        ]);
    }


    // hadi tatjib object kaml dyl users 
    private function formatUser($user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
        ];
    }


    // hadi tatjib array kaml dyl preferences
    private function formatPreferences(?array $preferences): array
    {
        return array_merge([
            'emailNotifications' => true,
            'reservationAlerts' => true,
            'weeklyReports' => false,
            'language' => 'English',
            'timezone' => 'Africa/Casablanca',
        ], $preferences ?? []);
    }
}
