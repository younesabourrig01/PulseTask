---
title: Security & production checklist
description: Security responsibilities and deployment considerations for PulseTask.
---

PulseTask intentionally handles sensitive infrastructure material: personal access tokens, SSH private keys, remote command text and output, avatar uploads, mail credentials, and optional Discord webhooks. Deploy it as an internal operations application.

## Before production

- Set `APP_ENV=production`, `APP_DEBUG=false`, a unique `APP_KEY`, and the public `APP_URL`.
- Use HTTPS for the API, dashboard, and WebSocket endpoint. Never send Sanctum bearer tokens over HTTP.
- Use a managed database with backups; SQLite is practical for local use but needs deliberate storage, locking, and backup planning in production.
- Run durable queue workers under a process supervisor and run Laravel's scheduler every minute (or use `php artisan schedule:work` under a supervisor).
- Configure a real mailer before enabling password resets; the development `log` mailer does not deliver OTPs.
- Set production CORS/session/domain settings to match the dashboard origin.
- Restrict server database, backups, logs, and object storage to administrators because SSH keys and script outputs may be present.

## SSH hardening

- Use one dedicated, least-privilege SSH account per managed host.
- Prefer restricted keys and a narrow `sudoers` policy over a general administrator key.
- Protect the Laravel database at rest; `ssh_private_key` is stored in the server record and is not application-encrypted by the current model/controller implementation.
- Do not place private keys, bearer tokens, or webhook URLs in Git, browser local storage exports, or public issue reports.
- Treat every script as privileged code. The application does not parse, approve, or sandbox script content.

## Token and account behavior

Registration and login create Sanctum personal access tokens. Logout removes the token used for the current request. Password reset deletes all user tokens after a successful reset, requiring fresh login. The token-generation endpoint returns a plain-text token only once; save it in a secure secret manager.

The current API protects password-reset requests with `throttle:5,1`, which permits five requests per minute for that route. OTP values are six digits, hashed in the database, and expire after ten minutes.

## Data retention

Ping logs are deleted after seven days and script runs after 30 days. This reduces sensitive data retention but is not a substitute for access control, audit logging, or backups.

## Integration hygiene

Discord webhook URLs are team-level secrets. Restrict who has owner access, rotate a webhook after accidental disclosure, and use a dedicated channel because notifications can reveal server names, IP addresses, script titles, and error messages.
