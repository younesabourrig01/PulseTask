---
title: PulseTask
description: An overview of PulseTask, its services, and the core infrastructure workflow.
---

PulseTask is a team-scoped infrastructure dashboard. It combines server inventory, HTTP uptime monitoring, reusable remote shell scripts, execution history, and optional notifications in one application.

## What PulseTask does

An authenticated user joins or creates one team. All servers, scripts, uptime checks, and script executions belong to that team. From the React dashboard, a team can:

- register remote SSH servers;
- monitor one or more HTTP/HTTPS URLs for each server;
- retain short-term response-time and availability history;
- save shell scripts once and execute them on a selected server through SSH;
- inspect queued, running, successful, and failed script runs;
- receive Discord notifications and live status events when those integrations are configured.

The HTTP URL checked by an uptime monitor is independent from the server SSH address. For example, a server stored as `10.0.0.15` may monitor `https://api.example.com/health`.

## Services

| Directory | Service | Responsibility |
| --- | --- | --- |
| `server/` | Laravel 13 API | REST API, Sanctum tokens, SQLite/MySQL persistence, queue jobs, scheduler, SSH execution, events |
| `client/` | React 19 dashboard | Authenticated operator interface, built with Vite, Redux Toolkit Query, and Tailwind CSS |
| `blog-docs/` | Astro 7 + Starlight | This documentation site and the project blog |

The dashboard targets `http://localhost:8000/api` in its current source configuration. The Laravel API is therefore the system of record; the React and Astro services are separate applications.

## Typical workflow

1. Register or sign in and keep the returned Sanctum token.
2. Create a team, or join one with a valid 24-hour invite code.
3. Add a server with its SSH user and private key.
4. Add an uptime check. PulseTask immediately performs an initial HTTP request.
5. Start the scheduler and queue worker so enabled checks run every minute and scripts run asynchronously.
6. Create a script, then queue it on a server from the dashboard or CLI endpoint.
7. Review execution output, recent pings, and dashboard metrics.

## Important behavior

- **Team isolation:** controller authorization policies compare the user's `team_id` with the target resource's team. Any team member can manage that team's servers, monitors, scripts, and runs; only the team owner can update team settings, issue invite codes, or delete the team.
- **Server status:** an uptime job sets the server status to `online` only when the most recently checked URL returns exactly the check's expected status code. A failed request or different status marks it `offline`.
- **Retention:** scheduled model pruning removes ping logs older than 7 days and script runs older than 30 days.
- **SSH execution:** script text is executed remotely as the configured SSH user. Treat saved scripts and stored private keys as highly sensitive operational data.

Continue with [Installation & local development](./installation/) to run the complete stack.
