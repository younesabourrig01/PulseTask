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
            'run_id' => $run->id
        ]);
    }

    public function triggerFromCli(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|string',
            'script_slug' => 'required|string'
        ]);

        $user_id = $request->user()->id;

        $server = Server::where('ip_address', $request->ip_address)->firstOrFail();
        $script = Script::where('script_slug', $request->script_slug)->firstOrFail();

        $this->authorize('execute', $script);
        $this->authorize('runScript', $server);

        $run = ScriptRun::create([
            'script_id' => $script->id,
            'server_id' => $server->id,
            'user_id' => $user_id,
            'status' => 'pending',
        ]);

        ExecuteServerScript::dispatch($run);

        return response()->json([
            'status' => 'success',
            'message' => 'Execution queued via CLI...',
            'run_id' => $run->id
        ]);
    }

    public function getStatusFromCli(ScriptRun $scriptRun)
    {
        $this->authorize('view', $scriptRun);
        return response()->json([
            'run_id' => $scriptRun->id,
            'status' => $scriptRun->status,
            'output' => $scriptRun->output,
            'error' => $scriptRun->error_output
        ]);
    }
}
