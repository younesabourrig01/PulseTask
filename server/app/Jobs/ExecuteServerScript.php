<?php

namespace App\Jobs;

use App\Models\ScriptRun;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\Net\SSH2;
use App\Services\DiscordAlertService;


class ExecuteServerScript implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ScriptRun $scriptRun)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $run = $this->scriptRun;
        $script = $run->script;
        $server = $run->server;

        $run->update(['status' => 'running']);

        try {
            $key = PublicKeyLoader::load($server->ssh_private_key);

            //open new ssh connection with server informations and add 30s timeout
            $ssh = new SSH2($server->ip_address, $server->ssh_port ?? 22, 30);

            //login with username and ssh private key
            if (!$ssh->login($server->ssh_user, $key)) {
                throw new \Exception("SSH Login Failed: Invalid credentials or key.");
            }

            //set a timeout for how mush the server can whait tell execute the script
            $ssh->setTimeout(300);

            //execute script
            $outPut = $ssh->exec($script->content);

            $exitStatus = $ssh->getExitStatus();

            if ($exitStatus === 0) {
                $run->update([
                    'status' => 'success',
                    'output' => $outPut
                ]);

                DiscordAlertService::send(
                    $run->server->team,
                    "✅ Script Executed Successfully",
                    "The script **{$run->script->title}** was executed by **{$run->user->name}** on server **{$run->server->name}**.",
                    "success"
                );
            } else {
                $run->update([
                    'status' => 'failed',
                    'output' => $outPut ?: "Script exited with status code: {$exitStatus}"
                ]);

                DiscordAlertService::send(
                    $run->server->team,
                    "🚨 Script Executed with errors",
                    "The script **{$run->script->title}** was executed by **{$run->user->name}** on server **{$run->server->name}**.",
                    "danger"
                );
            }

        } catch (\Exception $e) {
            $run->update([
                'status' => 'failed',
                'error_output' => 'Engine Error: ' . $e->getMessage(),
            ]);

            DiscordAlertService::send(
                $run->server->team,
                "🚨 Script dosn't Executed",
                "The script **{$run->script->title}** by **{$run->user->name}** on server **{$run->server->name}** faced an engine Error : **{$e->getMessage()}**.",
                "danger"
            );
        }
    }
}
