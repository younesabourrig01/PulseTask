<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Script;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ScriptController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $user = $request->user();
        $scripts = Script::where('team_id', $user->team_id)->paginate(15);

        return response()->json([
            'status' => 'success',
            'scripts' => $scripts
        ]);
    }
    public function show(Request $request, Script $script)
    {
        $this->authorize('view', $script);
        return response()->json([
            'status' => 'success',
            'script' => $script
        ]);
    }
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|min:3',
            'script_slug' => 'required|string|unique:scripts,script_slug',
            'content' => 'required|string'
        ]);

        $script = $user->team->scripts()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'new script created',
            'script' => $script
        ], 201);
    }

    public function update(Request $request, Script $script)
    {

        $this->authorize('update', $script);

        $validated = $request->validate([
            'title' => 'required|string|min:3',
            'script_slug' => [
                'required',
                'string',
                Rule::unique('scripts')->ignore($script),
            ],
            'content' => 'required|string'
        ]);

        $script->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'script updated',
            'script' => $script
        ]);

    }
    public function delete(Request $request, Script $script)
    {
        $this->authorize('delete', $script);

        $script->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'script deleted',
            'script' => $script
        ]);
    }
}
