<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Services\DiscordAlertService;


class TeamController extends Controller
{
    use AuthorizesRequests;

    public function teamInfo(Request $request)
    {
        $user = $request->user();
        $team = $user->team;

        if (!$team) {
            return response()->json([
                'status' => 'faild',
                'message' => $user->name . ' does not belong to any team yet.'
            ]);
        }

        $this->authorize('view', $team);

        return response()->json([
            'status' => 'success',
            'has_team' => true,
            'data' => $team->load('members')
        ]);
    }
    public function create(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'name' => 'string|required|max:255',
            'discord_webhook_url' => 'nullable|string'
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
    public function update(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'string|required',
            'discord_webhook_url' => 'string'
        ]);

        $user = $request->user();
        if ($user->team_id === null) {
            return response()->json([
                'status' => 'faild',
                'message' => 'Unauthorized. join a team first'
            ], 403);
        }

        $this->authorize('update', $team);

        $team->update([
            'name' => $request->name,
            'discord_webhook_url' => $request->discord_webhook_url
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'team info updated successfuly',
            'team' => $team
        ]);
    }
    public function joinByCode(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'invite_code' => 'required|string'
        ]);

        if ($user->team_id !== null) {
            return response()->json([
                'status' => 'faild',
                'message' => 'You are already a member of a team.'
            ], 422);
        }

        $team = Team::where('invite_code', $request->invite_code)
            ->where('invite_code_expires_at', '>', Carbon::now())
            ->first();

        if (!$team) {
            return response()->json([
                'status' => 'faild',
                'message' => 'Invalid or expired invitation code.'
            ], 422);
        }

        $user->update([
            'team_id' => $team->id,
        ]);

        DiscordAlertService::send(
            $team,
            "✨New Member is here!",
            "Say welcome to **{$user->name}**",
            "info"
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully joined the team: ' . $team->name,
            'team' => $team
        ]);


    }
    public function generateInvCode(Request $request)
    {
        $user = $request->user();
        $team = $user->team;

        if (!$team || $team->owner_id !== $user->id) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Unauthorized. Only team owners can generate invite codes.'
            ], 403);
        }

        do {
            $inviteCode = 'PT-' . strtoupper(Str::random(8));
        } while (Team::where('invite_code', $inviteCode)->exists());

        $team->update([
            'invite_code' => $inviteCode,
            'invite_code_expires_at' => Carbon::now()->addHours(24)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Invite code generated successfully!',
            'invite_code' => $inviteCode,
            'expires_at' => $team->invite_code_expires_at->toIso8601String(),
        ]);
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

        DiscordAlertService::send(
            $team,
            "😢 Member left the team!",
            "Say good bay to **{$user->name}**, we wish to you all the best.",
            "info"
        );

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
