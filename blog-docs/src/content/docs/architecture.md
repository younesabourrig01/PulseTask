---
title: Architecture & data model
description: How PulseTask scopes data, authorizes users, and connects its Laravel models and background work.
---

## Request and job flow

```text
React dashboard / CLI
        │ Bearer token
        ▼
Laravel REST API ──► Laravel policies ──► SQLite or MySQL
        │                                      │
        ├── queue script run ──► SSH / phpseclib
        └── queue uptime check ► HTTP request ┘
                                      │
                         events / Discord webhook
```

The Laravel API authenticates private routes with `auth:sanctum`; each user receives a personal access token after registration or login. Resource controllers use Laravel policies to enforce team boundaries.

## Data model

| Model | Key fields | Relationships and lifecycle |
| --- | --- | --- |
| `User` | `name`, `email`, `password`, `team_id`, `avatar` | Belongs to zero or one team; has many script runs; has Sanctum tokens. |
| `Team` | `name`, `owner_id`, `invite_code`, `invite_code_expires_at`, `discord_webhook_url` | Has many users, servers, and scripts. Deleting a team cascades to servers and scripts; controller logic first detaches members. |
| `Server` | `team_id`, `name`, `ip_address`, `ssh_user`, `ssh_private_key`, `ssh_port`, `status` | Has many uptime checks and script runs. The migration defaults SSH port to 22. |
| `UptimeCheck` | `server_id`, `url`, `expected_status_code`, `is_enabled` | Has many ping logs. Enabled checks are dispatched every minute. |
| `PingLog` | `uptime_check_id`, `status_code`, `response_time_ms`, `is_up`, `error_message` | Pruned after 7 days. |
| `Script` | `team_id`, `title`, `script_slug`, `content` | A reusable remote shell command/script. `script_slug` is globally unique in the current schema. |
| `ScriptRun` | `script_id`, `server_id`, `user_id`, `status`, `output`, `error_output` | Represents an asynchronous execution; pruned after 30 days. |
| `Otp` | `email`, hashed `otp`, `expires_at` | One current six-digit password-reset code per email; valid for 10 minutes. |

## Authorization model

Server, uptime-check, script, and script-run policies permit access when the resource belongs to the user's team. There is no separate editor/operator role at present: team membership grants operational access.

| Operation | Who may do it |
| --- | --- |
| View/manage servers, checks, scripts, and runs | Any member of the resource's team |
| Run a saved script | Any member of the script's and server's shared team |
| View team information | Any current team member |
| Update team name/webhook, generate invite code, delete team | Team owner only |
| Leave a team | Non-owner member only |

Invite codes begin with `PT-`, are generated uniquely, and expire 24 hours after generation. A user cannot create or join another team while `team_id` is already set.

## Dashboard calculations

`GET /api/dashboard/summary` builds team-wide metrics from the last 24 hours of ping logs and script runs:

- average latency uses successful pings only;
- uptime percentage is successful pings divided by all pings in that period;
- server status counts use the persisted `servers.status` field;
- the latency chart consists of twelve two-hour buckets;
- no-team users receive an empty, zero-valued summary.

This distinction matters: the current persisted status reflects the last check that updated a server, while uptime percentage reflects all check logs during the last 24 hours.
