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

        return response()->json(['message' => 'Queued..., eyes on the logs']);
    }
}
