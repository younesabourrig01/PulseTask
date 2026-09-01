<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Otp;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    //register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('users', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $avatarPath
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'you are regestred, go login',
            'user' => $user,
            'token' => $token
        ]);

    }
    //login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }
    //logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logged out'
        ]);
    }
    //update password
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        // client shold send fild with this name so "confermed" in laravel can validate the new password new_password_confirmation

        $request->validate([
            'password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password is incorrect.'
            ], 422);
        }

        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'New password must be different from the current password.'
            ], 422);
        }

        if ($request->new_password !== $request->new_password_confirmation) {
            return response()->json([
                'status' => 'error',
                'message' => 'different password, try write the same password'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password updated successfully.',
        ]);
    }
    //delete account
    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'password' => 'required'
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                "status" => "error",
                "message" => "password incorrect!"
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Account deleted successfully'
        ]);
    }
    //update profile
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $data = [
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
        ];

        if ($request->hasFile('avatar')) {

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('users', 'public');
        }

        $user->update($data);
        $user->refresh();
        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);

    }
    //send otp for forgot password
    public function sendOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'status' => 'success',
                'message' => 'If this email exists, a verification code has been sent.'
            ]);
        }

        $otp = (string) random_int(100000, 999999);

        Otp::updateOrCreate(
            ['email' => $validated['email']],
            [
                'otp' => Hash::make($otp),
                'expires_at' => now()->addMinutes(10),
            ]
        );

        Mail::send('emails.otp', ['otp' => $otp], function ($message) use ($validated) {
            $message->from(config('mail.from.address'), config('mail.from.name'));
            $message->to($validated['email']);
            $message->subject('PulseTask Verification Code');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'If this email exists, a verification code has been sent.'
        ]);
    }
    //reset password
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
            'otp' => 'required|string|digits:6',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::where('email', $validated['email'])->first();

        $otpRecord = Otp::where('email', $validated['email'])->first();

        if (
            !$user ||
            !$otpRecord ||
            $otpRecord->expires_at->isPast() ||
            !Hash::check($validated['otp'], $otpRecord->otp)
        ) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Invalid or expired verification code.'
            ], 400);
        }

        DB::transaction(function () use ($user, $otpRecord, $validated) {
            $user->update([
                'password' => Hash::make($validated['new_password'])
            ]);

            $otpRecord->delete();
            $user->tokens()->delete();
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully. Please log in again.'
        ]);

    }
}
