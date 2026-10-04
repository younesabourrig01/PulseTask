# PulseTask

PulseTask is a team-based infrastructure dashboard for tracking servers, checking service uptime, and running saved scripts remotely over SSH.

## What it does

- Create or join teams and keep their infrastructure separate.
- Add and manage remote servers.
- Monitor URLs with scheduled uptime checks and retain ping logs.
- Save reusable shell scripts and run them on registered servers through SSH.
- Track script-run status and output.
- Authenticate users with Laravel Sanctum; password-reset OTP emails are supported.
- Send optional Discord alerts and broadcast status updates.

## Stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS
- **Backend:** Laravel 13, PHP 8.3+, Sanctum, queues, Reverb
- **Storage:** SQLite by default (MySQL can be configured)

## Project layout

```text
client/  React dashboard
server/  Laravel API, jobs, scheduler, and database migrations
```

## Local setup

### 1. Start the API

```bash
cd server
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

SQLite is the default database connection. Ensure the database file configured by `DB_DATABASE` exists before migrating, or update `.env` to use MySQL.

Run the API, queue worker, and scheduler in separate terminals:

```bash
php artisan serve
php artisan queue:work
php artisan schedule:work
```

The API is served at `http://localhost:8000` by default.

### 2. Start the dashboard

```bash
cd client
npm install
npm run dev
```

The frontend currently calls `http://localhost:8000/api`, so keep the Laravel server running on port 8000 during development.

## Useful commands

```bash
# From server/
php artisan test
php artisan pulse:check-servers  # dispatch enabled uptime checks
php artisan db:seed --class=StartDataSeeder

# From client/
npm run build
npm run lint
```

`pulse:check-servers` is scheduled to run every minute. It requires both the scheduler and queue worker in a local environment.

## Configuration notes

- Configure `MAIL_*` values in `server/.env` to send password-reset OTPs.
- Configure broadcasting/Reverb and Discord values only if those integrations are needed.
- Servers store SSH connection details and scripts can execute commands remotely. Use test machines locally and protect database access and API tokens in production.
- `pulsetaskFromCli.sh` is a small example CLI client for triggering and checking script runs; set its token and API URL before using it.

