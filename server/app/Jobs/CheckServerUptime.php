<?php

namespace App\Jobs;

use App\Models\UptimeCheck;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\LogManager;

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
        if (!$this->uptimeCheck->is_enabled) {
            return;
        }

        $this->info("=== [START] Checking URL: " . $this->uptimeCheck->url . " ===");

        $startTime = microtime(true);

        try {

            $this->info("-> Sending HTTP Request...");

            $response = Http::timeout(15)->get($this->uptimeCheck->url);

            $this->info("-> Response received! Status: " . $response->status());

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

            $this->info("=== [SUCCESS] Log saved to DB ===");
        } catch (\Exception $e) {

            $this->error("=== [ERROR] Caught exception: " . $e->getMessage() . " ===");

            $this->uptimeCheck->pingLogs()->create([
                'status_code' => 0,
                'response_time_ms' => 0,
                'is_up' => false,
                'error_message' => substr($e->getMessage(), 0, 255),
            ]);

            $this->uptimeCheck->server->update(['status' => 'offline']);

        }
    }
    private function info($msg)
    {
        echo "\033[32m" . $msg . "\033[0m\n";
    }
    private function error($msg)
    {
        echo "\033[31m" . $msg . "\033[0m\n";
    }
}
