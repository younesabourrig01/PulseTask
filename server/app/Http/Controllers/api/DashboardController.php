<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\PingLog;
use App\Models\ScriptRun;
use App\Models\UptimeCheck;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get aggregated overview metrics and health data for the team dashboard.
     */
    public function summary(Request $request)
    {
        $user = $request->user();
        $team = $user->team;

        if (!$team) {
            return response()->json([
                'status' => 'success',
                'summary' => [
                    'total_servers' => 0,
                    'online_servers' => 0,
                    'offline_servers' => 0,
                    'average_latency' => '0ms',
                    'uptime_percentage' => '100%',
                    'runs_last_24h' => 0,
                    'servers' => [],
                    'recent_runs' => [],
                    'latency_chart' => [],
                ],
            ]);
        }

        // Fetch team's servers with their uptime checks and recent ping logs
        $servers = $team->servers()
            ->with([
                'uptimesCheck' => function ($query) {
                    $query->with(['pinglogs' => function ($q) {
                        $q->latest()->limit(15);
                    }]);
                },
            ])
            ->get();

        $serverIds = $servers->pluck('id');
        $checkIds = UptimeCheck::whereIn('server_id', $serverIds)->pluck('id');

        // Recent pings in the last 24 hours
        $pingsLast24h = PingLog::whereIn('uptime_check_id', $checkIds)
            ->where('created_at', '>=', now()->subHours(24))
            ->get();

        $totalPings = $pingsLast24h->count();
        $upPings = $pingsLast24h->where('is_up', true);

        $avgLatency = $upPings->count() > 0
            ? round($upPings->avg('response_time_ms')) . 'ms'
            : '—';

        $uptimePct = $totalPings > 0
            ? round(($upPings->count() / $totalPings) * 100, 2) . '%'
            : ($servers->count() > 0 ? '100%' : '—');

        // Script runs in the last 24 hours
        $runsLast24h = ScriptRun::whereIn('server_id', $serverIds)
            ->where('created_at', '>=', now()->subHours(24))
            ->count();

        // Recent script executions (last 10)
        $recentRuns = ScriptRun::whereIn('server_id', $serverIds)
            ->with([
                'script:id,title,script_slug',
                'server:id,name,ip_address',
                'user:id,name',
            ])
            ->latest()
            ->limit(10)
            ->get();

        // Build server health list with latest latency & history points
        $serversList = $servers->map(function ($server) {
            $latestPing = null;
            $allLogs = collect();

            foreach ($server->uptimesCheck as $check) {
                if ($check->pinglogs->isNotEmpty()) {
                    $allLogs = $allLogs->concat($check->pinglogs);
                }
            }

            $sortedLogs = $allLogs->sortByDesc('created_at')->values();
            $latestPing = $sortedLogs->first();

            return [
                'id' => $server->id,
                'name' => $server->name,
                'ip' => $server->ip_address,
                'status' => $server->status ?? 'offline',
                'latency' => $latestPing && $latestPing->is_up ? "{$latestPing->response_time_ms}ms" : '—',
                'recent_pings' => $sortedLogs->take(20)->map(fn($log) => [
                    'is_up' => (bool)$log->is_up,
                    'response_time_ms' => $log->response_time_ms,
                    'time' => $log->created_at->format('H:i'),
                ])->reverse()->values(),
            ];
        });

        // Hourly latency timeline for charts (last 24 hours, grouped into 2-hour blocks)
        $latencyChart = [];
        for ($i = 22; $i >= 0; $i -= 2) {
            $startTime = now()->subHours($i + 2);
            $endTime = now()->subHours($i);
            $bucketPings = $pingsLast24h->filter(function ($ping) use ($startTime, $endTime) {
                return $ping->created_at >= $startTime && $ping->created_at < $endTime;
            });

            $upInBucket = $bucketPings->where('is_up', true);
            $avgInBucket = $upInBucket->count() > 0 ? round($upInBucket->avg('response_time_ms')) : 0;

            $latencyChart[] = [
                'time' => $endTime->format('H') . 'h',
                'latency' => $avgInBucket,
                'checks' => $bucketPings->count(),
            ];
        }

        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_servers' => $servers->count(),
                'online_servers' => $servers->where('status', 'online')->count(),
                'offline_servers' => $servers->where('status', 'offline')->count(),
                'average_latency' => $avgLatency,
                'uptime_percentage' => $uptimePct,
                'runs_last_24h' => $runsLast24h,
                'servers' => $serversList,
                'recent_runs' => $recentRuns,
                'latency_chart' => $latencyChart,
            ],
        ]);
    }
}
