---
title: "Uptime Monitoring That Uses Laravel Queues"
pubDate: "2026-10-16"
author: "PulseTask Team"
tags: ["Monitoring", "Queues", "Laravel"]
draft: false
---

An uptime check is only valuable when it runs reliably and does not make the dashboard feel slow. PulseTask uses Laravel's scheduler and queue system to keep those responsibilities separate.

## The monitoring loop

Every minute, Laravel runs the `pulse:check-servers` command. The command finds all enabled uptime checks and dispatches one background job for each. A queue worker then performs the actual HTTP request.

Each check records four useful pieces of information:

- the returned HTTP status code;
- response time in milliseconds;
- whether the result matches the configured expected status code;
- an error message when the request itself fails.

The job has a 15-second HTTP timeout. A response is considered up only when its status exactly matches the expected code—`200` by default. This is useful for endpoints that intentionally return something other than 200, such as a `204` health endpoint.

## Immediate feedback, background reliability

When a monitor is created, PulseTask performs an initial ping immediately. The same applies to the manual **Ping now** action. Operators get useful feedback straight away, while the normal one-minute cycle remains asynchronous and does not block API requests.

After every result, the job writes a ping log and updates the server's visible status. The dashboard can therefore show both a quick current signal and recent response-time history.

## Keep the data useful

Ping logs are pruned after seven days. The goal is to preserve enough operational context for short-term troubleshooting without allowing a small dashboard to accumulate unbounded monitoring data.

For local development, all three processes matter: the API, `php artisan queue:work`, and `php artisan schedule:work`. Starting only the API means monitors can be configured, but scheduled checks will not actually be processed.
