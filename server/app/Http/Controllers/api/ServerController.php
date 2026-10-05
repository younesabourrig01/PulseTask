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
        $search = trim($request->query('search', ''));

        $query = Server::where('team_id', $user->team_id);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhere('ssh_user', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        $servers = $query->paginate(10);

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
            'message' => 'new server created',
            'server' => $server
        ], 201);

    }

    public function update(Request $request, Server $server)
    {

        $validated = $request->validate([
            'name' => 'string|min:3|required',
            'ip_address' => 'string|required',
            'ssh_user' => 'string|required',
            'ssh_private_key' => 'string|required',
            'status' => 'string'
        ]);

        $this->authorize('update', $server);

        $server->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'server updated',
            'server' => $server
        ]);
    }

    public function destroy(Request $request, Server $server)
    {

        $this->authorize('delete', $server);

        $server->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'server deleted successfuly',
            'server' => $server
        ]);

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
