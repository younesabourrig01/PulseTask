<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Server;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ServerController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $user = $request->user();

        $servers = Server::where('team_id', $user->team_id)->paginate(10);

        return response()->json([
            'status' => 'success',
            'servers' => $servers
        ]);
    }

    public function show(Request $request, Server $server)
    {
        $this->authorize('view', $server);
        return response()->json([
            'status' => 'success',
            'server' => $server
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'string|min:3|required',
            'ip_address' => 'string|required',
            'ssh_user' => 'string|required',
            'ssh_private_key' => 'string|required',
            'status' => 'string'
        ]);

        $server = $user->team->servers()->create($validated);

        return response()->json([
            'status' => 'success',
            'server' => $server
        ], 201);

    }

    public function generateToken(Request $request)
    {
        $request->validate(['token_name' => 'required|string']);

        $token = $request->user()->createToken($request->token_name);

        return response()->json([
            'status' => 'success',
            'plain_text_token' => $token->plainTextToken
        ]);
    }
}
