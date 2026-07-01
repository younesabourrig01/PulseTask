<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Team;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max|255',
            'email' => 'required|string|email|max|255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'team_name' => 'required_without:invite_code|string|max:255',
            'invite_code' => 'required_without:team_name|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        ['user' => $user, 'token' => $token] = DB::transaction(function () use ($request) {

            if ($request->filled('team_name')) {
                // case 1: User is creating a new team
                $team = Team::create([
                    "name" => $request->team_name
                ]);
            } else {
                // case 2: User is joining an existing team
                $team = Team::where('invite_code', $request->invite_code)->firstOrFail();
            }

            $avatarPath = null;

            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('users', 'public');
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'team_id' => $team->id,
                'avatar' => $avatarPath
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token
            ];
        });

        return response()->json([
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
    //forgot password
    public function reset()
    {
        //
    }
    //logout
    public function logout()
    {
        //
    }
    //delete account
    public function delete()
    {
        //
    }
    //update profile
    public function update()
    {
        //
    }
}
