<?php

namespace App\Console\Commands;

use App\Models\UptimeCheck;
use App\Jobs\CheckServerUptime;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('pulse:check-servers')]
#[Description('Dispatch ping jobs for all enabled uptime checks')]
class PulseCheckServers extends Command
{
    /**
     * Execute the console command.
     */

    public function handle()
    {
        $checks = UptimeCheck::where('is_enabled', true)->get();

        $this->info("Found " . $checks->count() . " active checks in database.");

        foreach ($checks as $check) {
            CheckServerUptime::dispatch($check);
        }

        $this->info('All server uptime checks have been dispatched to the queue!');
    }
}
