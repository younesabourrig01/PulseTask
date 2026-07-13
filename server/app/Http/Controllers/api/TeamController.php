<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use App\Models\User;

class TeamController extends Controller
{
    public function teamInfo(Team $team)
    {
        $data = [
            '$members' => $team->members,
            '$name ' => $team->name,
            '$owner' => User::where('id', $team->owner_id)->first(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
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
    public function generateInvCode(Team $team)
    {

    }
    public function leave(Request $request)
    {
        $user = $request->user();
        $team = $user->team;

        if (!$team) {
            return response()->json([
                'status' => 'faild',
                'message' => 'You are not in a team.'
            ], 422);
        }

        if ($team->owner_id === $user->id) {
            return response()->json([
                'status' => 'faild',
                'message' => 'As the owner, you cannot leave. You must delete the team or transfer ownership.'
            ], 422);
        }

        $user->update([
            'team_id' => null
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'You have left the team.'
        ]);

    }

    public function deleteTeam(Request $request)
    {
        $user = $request->user();
        $team = $user->team;

        if (!$team || $team->owner_id !== $user->id) {
            return response()->json([
                'status' => 'faild',
                'message' => 'Unauthorized. Only the owner can delete the team.'
            ], 403);
        }

        $team->members()->update(['team_id' => null]);

        $team->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Team and all associated data have been deleted.'
        ]);
    }
}
