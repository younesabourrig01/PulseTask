<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;

class TeamController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'name' => 'string|required|max:255'
        ]);

        if ($user->team_id !== null) {
            return response()->json([
                'status' => 'faild',
                'message' => 'You are already in a team.'
            ], 422);
        }

        $team = Team::create([
            'name' => $request->name,
            'owner_id' => $user->id
        ]);

        $user->update([
            'team_id' => $team->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Team created successfully!',
            'team' => $team
        ], 201);
    }
    public function invite()
    {
        //
    }

    public function leave()
    {
        //
    }

    public function deleteTeam()
    {
        //
    }
}
