<?php

namespace App\Jobs;

use App\Models\UptimeCheck;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\LogManager;

class CheckServerUptime implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public UptimeCheck $uptimeCheck)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->uptimeCheck->is_enabled) {
            return;
        }

        $startTime = microtime(true);

        try {
            $response = Http::timeout(15)->get($this->uptimeCheck->url);
            $endtime = microtime(true);

            $responseTimeMs = round(($endtime - $startTime) * 1000);

            $isUp = $response->status() === $this->uptimeCheck->expected_status_code;

            $this->uptimeCheck->pingLogs()->create([
                'status_code' => $response->status(),
                'response_time_ms' => $responseTimeMs,
                'is_up' => $isUp,
            ]);

            $this->uptimeCheck->server->update([
                'status' => $isUp ? 'online' : 'offline'
            ]);
        } catch (\Exception $e) {
            $this->uptimeCheck->pingLogs()->create([
                'status_code' => 0,
                'response_time_ms' => 0,
                'is_up' => false,
                'error_message' => substr($e->getMessage(), 0, 255),
            ]);

            $this->uptimeCheck->server->update(['status' => 'offline']);

        }
    }
}
