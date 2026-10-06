<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Script;
use App\Models\Server;
use App\Models\ScriptRun;
use App\Jobs\ExecuteServerScript;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ScriptRunController extends Controller
{
    use AuthorizesRequests;

    /**
     * List all script execution runs for the user's team.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $team = $user->team;

        if (!$team) {
            return response()->json([
                'status' => 'success',
                'runs' => ['data' => []],
            ]);
        }

        $serverIds = $team->servers()->pluck('id');

        $runs = ScriptRun::whereIn('server_id', $serverIds)
            ->with([
                'script:id,title,script_slug',
                'server:id,name,ip_address',
                'user:id,name,avatar',
            ])
            ->latest()
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'runs' => $runs,
        ]);
    }

    /**
     * Show details of a specific script execution run.
     */
    public function show(Request $request, ScriptRun $scriptRun)
    {
        $this->authorize('view', $scriptRun);

        $scriptRun->load([
            'script:id,title,script_slug',
            'server:id,name,ip_address',
            'user:id,name,avatar',
        ]);

        return response()->json([
            'status' => 'success',
            'run' => $scriptRun,
        ]);
    }

    /**
     * Trigger script execution from web application.
     */
    public function trigger(Request $request, Script $script, Server $server)
    {
        $this->authorize('execute', $script);
        $this->authorize('runScript', $server);

        $user_id = $request->user()->id;

        $run = ScriptRun::create([
            'script_id' => $script->id,
            'server_id' => $server->id,
            'user_id' => $user_id,
            'status' => 'pending',
        ]);

        ExecuteServerScript::dispatch($run);

        return response()->json([
            'status' => 'success',
            'message' => 'Execution queued...',
            'run_id' => $run->id,
            'run' => $run->fresh(['script', 'server', 'user']),
        ]);
    }

    /**
     * Trigger script execution from CLI / terminal with personal access token.
     */
    public function triggerFromCli(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|string',
            'script_slug' => 'required|string',
        ]);

        $user = $request->user();
        $team = $user->team;

        if (!$team) {
            return response()->json([
                'status' => 'error',
                'message' => 'User does not belong to any team.',
            ], 403);
        }

        $server = $team->servers()->where('ip_address', $request->ip_address)->first();
        if (!$server) {
            return response()->json([
                'status' => 'error',
                'message' => "Server with IP '{$request->ip_address}' not found in your team.",
            ], 404);
        }

        $script = $team->scripts()->where('script_slug', $request->script_slug)->first();
        if (!$script) {
            return response()->json([
                'status' => 'error',
                'message' => "Script with slug '{$request->script_slug}' not found in your team.",
            ], 404);
        }

        $this->authorize('execute', $script);
        $this->authorize('runScript', $server);

        $run = ScriptRun::create([
            'script_id' => $script->id,
            'server_id' => $server->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        ExecuteServerScript::dispatch($run);

        return response()->json([
            'status' => 'success',
            'message' => 'Execution queued via CLI...',
            'run_id' => $run->id,
        ]);
    }

    /**
     * Poll run status and output (used by CLI and frontend live terminal).
     */
    public function getStatusFromCli(ScriptRun $scriptRun)
    {
        $this->authorize('view', $scriptRun);

        return response()->json([
            'run_id' => $scriptRun->id,
            'status' => $scriptRun->status,
            'output' => $scriptRun->output,
            'error' => $scriptRun->error_output,
            'created_at' => $scriptRun->created_at,
            'updated_at' => $scriptRun->updated_at,
        ]);
    }

    /**
     * Get execution history for a specific script.
     */
    public function scriptRuns(Request $request, Script $script)
    {
        $this->authorize('view', $script);

        $runs = $script->scriptruns()
            ->with(['server:id,name,ip_address', 'user:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'runs' => $runs,
        ]);
    }

    /**
     * Get execution history for a specific server.
     */
    public function serverRuns(Request $request, Server $server)
    {
        $this->authorize('view', $server);

        $runs = $server->scriptsrun()
            ->with(['script:id,title,script_slug', 'user:id,name'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'runs' => $runs,
        ]);
    }
}
