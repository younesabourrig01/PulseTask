---
title: "Making Server Health Feel Live"
pubDate: "2026-10-22"
author: "PulseTask Team"
tags: ["Realtime", "Reverb", "Observability"]
draft: false
---

Monitoring is easier to trust when the interface responds as checks complete. PulseTask's uptime jobs do more than save a database row: they publish events that can update a connected dashboard in real time.

## Two events, one team channel

After an uptime job completes, PulseTask broadcasts two pieces of information:

- `ping.created` when a new ping log is written;
- `server.updated` after the server status is updated.

Both are sent to the private `team.{teamId}` channel. Channel authorization checks that the authenticated user belongs to that exact team, mirroring the authorization rules used by the REST API.

The split matters. A ping event is detailed telemetry—status code, duration, and success state—while a server update is a compact state change that can drive a status badge or server list.

## Local first, realtime when ready

Broadcasting is configurable. The example environment uses Laravel's log broadcaster, which is perfect for local inspection but does not push browser updates. To deliver websocket events, configure Reverb credentials, set `BROADCAST_CONNECTION=reverb`, and run the Reverb service alongside the API, scheduler, and queue worker.

This lets teams adopt realtime behavior without making it a prerequisite for the core monitoring loop. The database remains the source of truth; events make the experience faster and more responsive.

## Alerts that reach the right place

PulseTask can also send Discord embeds to a webhook configured on the team. Script outcomes, connection failures, and team membership changes are useful moments to notify an operations channel. As with all webhooks, the URL is a secret and should be managed like a credential.

The result is a small but practical observability loop: checks run in the background, results are stored, dashboards can update live, and important operational events can leave the application when a team needs them to.
