---
title: REST API
description: Authentication, endpoint contracts, request fields, and CLI examples for the PulseTask Laravel API.
---

Base URL: `http://localhost:8000/api`

All protected endpoints require:

```http
Authorization: Bearer YOUR_SANCTUM_TOKEN
Accept: application/json
```

Requests are JSON unless an avatar file is being uploaded; avatar requests must be sent as `multipart/form-data`. Validation failures use Laravel's standard `422` response format. Protected routes also use Laravel's `throttle:api` middleware.

## Authentication and profile

| Method | Path | Body / result |
| --- | --- | --- |
| `POST` | `/register` | `name`, `email`, `password`, `password_confirmation`, optional image `avatar` (JPG/JPEG/PNG, max 2 MB). Returns `user` and `token`. |
| `POST` | `/login` | `email`, `password`. Returns `user` and a fresh `token`; invalid credentials return 401. |
| `POST` | `/logout` | Deletes the current access token. |
| `PATCH` | `/updatePassword` | `password`, `new_password`, `new_password_confirmation`; new password minimum is 8 characters. |
| `DELETE` | `/delete_account` | `password`; revokes all tokens and deletes the user. |
| `POST` or `PATCH` | `/update_profile_info` | Optional `name`, `email`, avatar upload, or `remove_avatar=true`. |
| `POST` | `/forgot-password/send-otp` | `email`; always returns a generic success response and is throttled to 5/minute. |
| `POST` | `/forgot-password/reset` | `email`, six-digit `otp`, `new_password`, `new_password_confirmation`. |
| `POST` | `/generate-token` | `token_name`; returns `plain_text_token` once. |

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"operator@example.test","password":"password"}'
```

## Teams

| Method | Path | Body / notes |
| --- | --- | --- |
| `GET` | `/team/about` | Returns the current team with `members`, or a no-team response. |
| `POST` | `/team/create` | `name`; `discord_webhook_url` is accepted by validation but is only persisted through the update endpoint in the current implementation. |
| `POST` | `/team/join` | `invite_code`. User must not already be in a team. |
| `POST` | `/team/generate-inv-code` | Owner only; returns a code expiring in 24 hours. |
| `PATCH` | `/team/update/{team}` | Owner only; `name`, optional `discord_webhook_url`. |
| `POST` | `/team/leave` | Non-owner members only. |
| `DELETE` | `/team/delete-team` | Owner only; detaches members and deletes associated data through database cascades. |

## Servers

| Method | Path | Body / notes |
| --- | --- | --- |
| `GET` | `/servers` | Optional `search` matches name, IP, SSH user, or status. Paginated, 10 per page. |
| `POST` | `/servers` | `name` (min 3), `ip_address`, `ssh_user`, `ssh_private_key`, optional `status`. |
| `GET` | `/servers/{server}` | Team-scoped server details. |
| `PATCH` | `/servers/{server}` | Same required fields as creation; send the complete server record. |
| `DELETE` | `/servers/{server}` | Deletes the server and its dependent checks/runs. |

Although the database defaults `ssh_port` to 22, the current create/update validation and model fillable fields do not expose a request field for changing it. Use port 22 unless the backend is extended.

## Uptime checks and history

| Method | Path | Body / notes |
| --- | --- | --- |
| `GET` | `/servers/{server}/uptime-checks` | Returns checks with up to 20 newest ping logs each. |
| `POST` | `/servers/{server}/uptime-checks` | `url`, optional `expected_status_code` (100–599, default 200), optional `is_enabled` (default true). Runs an immediate ping. |
| `PATCH` | `/uptime-checks/{uptimeCheck}` | Any subset of `url`, `expected_status_code`, `is_enabled`. |
| `DELETE` | `/uptime-checks/{uptimeCheck}` | Deletes the check and its logs. |
| `POST` | `/uptime-checks/{uptimeCheck}/ping` | Runs an immediate synchronous ping. |
| `GET` | `/servers/{server}/ping-history` | Latest 50 logs across the server's checks, returned oldest-to-newest. |

```bash
curl -X POST http://localhost:8000/api/servers/1/uptime-checks \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/health","expected_status_code":200}'
```

## Scripts and runs

| Method | Path | Body / notes |
| --- | --- | --- |
| `GET` | `/scripts` | Team scripts, paginated 15 per page. |
| `POST` | `/scripts` | `title` (min 3), globally unique `script_slug`, `content`. |
| `GET` | `/scripts/{script}` | Get one script. |
| `PATCH` | `/scripts/{script}` | `title`, `script_slug`, `content` are all required. |
| `DELETE` | `/scripts/{script}` | Removes the script and cascade-deletes its runs. |
| `POST` | `/run/{script}/on/{server}` | Queues the script on the server; no body required. |
| `GET` | `/script-runs` | Team runs, newest first, paginated 15 per page. |
| `GET` | `/script-runs/{scriptRun}` | Run with script/server/user details. |
| `GET` | `/scripts/{script}/runs` | That script's run history, 10 per page. |
| `GET` | `/servers/{server}/runs` | That server's run history, 10 per page. |

A queued run progresses through `pending`, `running`, then `success` or `failed`. On failed remote exit, command output is stored in `output`; on a connection/engine exception, details are stored in `error_output`.

## CLI-compatible endpoints

These endpoints use the same bearer-token authentication as the dashboard.

| Method | Path | Body / result |
| --- | --- | --- |
| `POST` | `/cli/run-script` | `ip_address`, `script_slug`; looks up both resources within the caller's team and queues the run. |
| `GET` | `/cli/run-status/{scriptRun}` | Returns `run_id`, `status`, `output`, `error`, and timestamps. |

```bash
curl -X POST http://localhost:8000/api/cli/run-script \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"script_slug":"deploy-app","ip_address":"192.168.1.50"}'

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/cli/run-status/42
```

The repository includes `pulsetaskFromCli.sh` as a small shell client. Before using it, set its `TOKEN` and `BASE_URL`; its default API host is only a placeholder.

## Dashboard summary

`GET /dashboard/summary` returns the authenticated team's metrics, server health list, latest ten runs, and twelve two-hour latency points. It is the dashboard's aggregate endpoint, not a replacement for individual server or monitor resources.
