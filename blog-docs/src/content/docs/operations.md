---
title: Monitoring, jobs & realtime
description: Uptime monitoring, script execution, retention, Discord alerts, and broadcast events.
---

## Uptime monitoring

Every enabled `UptimeCheck` is selected by the `pulse:check-servers` command. Laravel schedules this command every minute; the command dispatches one `CheckServerUptime` queue job per check.

Each job performs an HTTP GET with a 15-second timeout and compares the exact response status with `expected_status_code` (200 by default). It writes a `PingLog`, updates the owning server to `online` or `offline`, and emits events. Connection errors are captured as a log with status code `0`, zero response time, and an error message truncated to 255 characters.

Creating a monitor and the **Ping now** endpoint both execute the job synchronously first, so their response can include recent logs without waiting for the worker.

### Operational caveat

If one server has multiple monitors, each completed job writes that same server's status. The last completed monitor wins. Use checks that represent the same desired server health, or interpret individual ping logs rather than relying only on the server status field.

## Script execution

Triggering a script creates a `ScriptRun` with `pending` status and dispatches `ExecuteServerScript`. The worker:

1. changes the run to `running`;
2. loads the stored private key with phpseclib;
3. connects to the server using the stored address, user, and SSH port (22 by default);
4. permits up to 30 seconds to connect and up to 300 seconds for command execution;
5. stores output and finishes as `success` only for exit status `0`; otherwise it finishes as `failed`.

Connection and engine exceptions are recorded in `error_output` with an `Engine Error:` prefix. Script content is not sandboxed: it runs with the permissions of the SSH user. Limit SSH keys, use non-production targets during development, and review all saved scripts before execution.

## Scheduled retention

`routes/console.php` schedules `model:prune` daily. The project models define these retention windows:

| Resource | Retained for |
| --- | --- |
| Ping logs | 7 days |
| Script runs (including captured output) | 30 days |

Back up or export information needed for longer-term auditing before the retention window expires.

## Discord alerts

Set `discord_webhook_url` on a team to enable outbound Discord embeds. Alerts are sent when:

- a user joins or leaves a team;
- an uptime HTTP request throws an exception and the server is marked offline;
- a script succeeds, exits non-zero, or encounters an execution engine error.

An HTTP response with an unexpected status code marks a ping as down, but the current job only sends the server-down Discord alert for request exceptions. Webhook delivery is a simple outbound POST; failures are not retried or surfaced to the API response.

## Realtime broadcasts

When a monitor job creates a log, PulseTask broadcasts:

| Event | Private channel | Payload source |
| --- | --- | --- |
| `ping.created` | `team.{teamId}` | `PingLogCreated` with its `PingLog` |
| `server.updated` | `team.{teamId}` | `ServerStatusUpdated` with its `Server` |

Channel authorization allows only a user whose `team_id` equals the channel's team ID. Set `BROADCAST_CONNECTION=reverb`, configure `REVERB_*`, and run Reverb to deliver websocket events; `log` or `null` do not provide live browser updates.

## Useful maintenance commands

```powershell
# Queue every enabled monitor now
php artisan pulse:check-servers

# Keep the worker alive in development
php artisan queue:work

# Keep Laravel's scheduler alive in development
php artisan schedule:work

# Run test suite
php artisan test
```
