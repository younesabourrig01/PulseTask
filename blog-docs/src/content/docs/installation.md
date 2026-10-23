---
title: Installation & local development
description: Install and run the Laravel API, queue, scheduler, React dashboard, and Astro documentation site.
---

## Prerequisites

- PHP 8.3 or newer with Composer
- Node.js 22.12 or newer (required by the Astro project)
- npm
- SQLite, or a configured MySQL instance
- An SSH-reachable test host if you intend to execute scripts

Laravel uses SQLite by default. Ensure the database file referenced by `DB_DATABASE` exists, or switch the database variables in `server/.env` to MySQL before migrating.

## Start the Laravel service

From `server/`, create the environment file, install dependencies, generate an application key, and migrate the database.

```powershell
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

On macOS or Linux use `cp .env.example .env` instead of `copy`.

Then run these processes in separate terminals:

```powershell
php artisan serve
php artisan queue:work
php artisan schedule:work
```

The API is served at `http://localhost:8000`; its health endpoint is `GET /up`. The queue worker is required for scheduled uptime jobs and SSH script jobs. The scheduler is required to dispatch the per-minute uptime command and daily pruning.

## Start the dashboard

```powershell
cd client
npm install
npm run dev
```

The current client source has a fixed API base URL of `http://localhost:8000/api`. Keep the Laravel service on port 8000 unless you also change `client/src/app/api/apiSlice.js`.

## Start the documentation site

```powershell
cd blog-docs
npm install
npm run dev
```

Astro serves the site at `http://localhost:4321` by default. Validate it for production with:

```powershell
npm run build
```

## One-command Windows launcher

From the repository root, `start.bat` starts the API, queue worker, scheduler, React dashboard, and Astro site. Use the separate commands above when you want to observe each process individually.

## Optional sample data

```powershell
cd server
php artisan db:seed --class=StartDataSeeder
```

The seed data is only for local exploration. It includes placeholder SSH details and must never be treated as deployable configuration.

## Environment configuration

`server/.env.example` defaults to a database queue and cache store. These items need attention outside a basic local run:

| Feature | Configuration |
| --- | --- |
| Database | `DB_CONNECTION` and the matching `DB_*` values |
| Queue | `QUEUE_CONNECTION`; run `php artisan queue:work` for database queues |
| Mail / OTP reset | `MAIL_*`, including a real mailer and `MAIL_FROM_*` |
| Broadcast events | `BROADCAST_CONNECTION=reverb` plus `REVERB_*` credentials, then run the Reverb server |
| File uploads | `FILESYSTEM_DISK=public` and public storage exposure for uploaded avatars |
| Discord | Set a `discord_webhook_url` for a team through the team update endpoint |

The default mailer is `log`, and the default broadcast connection is `log` in the example environment. That means OTP emails and broadcast events are recorded locally instead of delivered until configured.

## Verification

```powershell
cd server
php artisan test
php artisan pulse:check-servers
```

The custom command dispatches all enabled uptime checks. With the worker running, it is also dispatched automatically every minute by the scheduler.
