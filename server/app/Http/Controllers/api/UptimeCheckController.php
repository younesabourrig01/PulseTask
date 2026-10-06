<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Jobs\CheckServerUptime;
use App\Models\Server;
use App\Models\UptimeCheck;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class UptimeCheckController extends Controller
{
    use AuthorizesRequests;

    /**
     * List uptime checks and recent ping logs for a server.
     */
    public function index(Request $request, Server $server)
    {
        $this->authorize('view', $server);

        $uptimeChecks = $server->uptimesCheck()
            ->with(['pinglogs' => function ($query) {
                $query->latest()->limit(20);
            }])
            ->get();

        return response()->json([
            'status' => 'success',
            'uptime_checks' => $uptimeChecks,
        ]);
    }

    /**
     * Create an uptime monitor check for a server.
     */
    public function store(Request $request, Server $server)
    {
        $this->authorize('update', $server);

        $validated = $request->validate([
            'url' => 'required|url',
            'expected_status_code' => 'nullable|integer|min:100|max:599',
            'is_enabled' => 'nullable|boolean',
        ]);

        $uptimeCheck = $server->uptimesCheck()->create([
            'url' => $validated['url'],
            'expected_status_code' => $validated['expected_status_code'] ?? 200,
            'is_enabled' => $validated['is_enabled'] ?? true,
        ]);

        // Run immediate initial ping check
        try {
            CheckServerUptime::dispatchSync($uptimeCheck);
        } catch (\Throwable $e) {
            // Ignore if immediate ping fails, log will reflect it
        }

        $uptimeCheck->load(['pinglogs' => function ($query) {
            $query->latest()->limit(5);
        }]);

        return response()->json([
            'status' => 'success',
            'message' => 'Uptime check created successfully',
            'uptime_check' => $uptimeCheck,
        ], 201);
    }

    /**
     * Update an uptime check (e.g. toggle enabled, edit URL).
     */
    public function update(Request $request, UptimeCheck $uptimeCheck)
    {
        $this->authorize('update', $uptimeCheck);

        $validated = $request->validate([
            'url' => 'sometimes|url',
            'expected_status_code' => 'sometimes|integer|min:100|max:599',
            'is_enabled' => 'sometimes|boolean',
        ]);

        $uptimeCheck->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Uptime check updated',
            'uptime_check' => $uptimeCheck->fresh(['pinglogs' => fn($q) => $q->latest()->limit(5)]),
        ]);
    }

    /**
     * Delete an uptime check.
     */
    public function destroy(Request $request, UptimeCheck $uptimeCheck)
    {
        $this->authorize('delete', $uptimeCheck);

        $uptimeCheck->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Uptime check deleted successfully',
        ]);
    }

    /**
     * Trigger an instant ping check on demand.
     */
    public function pingNow(Request $request, UptimeCheck $uptimeCheck)
    {
        $this->authorize('update', $uptimeCheck);

        try {
            CheckServerUptime::dispatchSync($uptimeCheck);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ping execution failed: ' . $e->getMessage(),
            ], 500);
        }

        $uptimeCheck->load(['pinglogs' => function ($query) {
            $query->latest()->limit(5);
        }, 'server']);

        return response()->json([
            'status' => 'success',
            'message' => 'Ping executed successfully',
            'uptime_check' => $uptimeCheck,
            'latest_ping' => $uptimeCheck->pinglogs->first(),
        ]);
    }

    /**
     * Get historical ping metrics for chart visualization.
     */
    public function history(Request $request, Server $server)
    {
        $this->authorize('view', $server);

        $checkIds = $server->uptimesCheck()->pluck('id');

        $logs = \App\Models\PingLog::whereIn('uptime_check_id', $checkIds)
            ->latest()
            ->limit(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'status' => 'success',
            'history' => $logs,
        ]);
    }
}
