---
sidebar_position: 4
---

# Troubleshooting

## App container exits at startup

```bash
docker compose logs app | tail -100
```

Common causes:

| Symptom in logs                                                      | Fix |
| -------------------------------------------------------------------- | --- |
| `BETTER_AUTH_SECRET required` / `ENCRYPTION_KEY required`            | The variable is empty in `.env`. Generate one with `openssl rand -base64 32`. |
| `connect ECONNREFUSED postgres:5432`                                 | Postgres isn't healthy yet. Run `docker compose ps` — the `app` should `depends_on` Postgres being healthy, but a slow VM occasionally beats it. Restart `app`. |
| `error: column "..." does not exist` after upgrade                   | Migrations didn't run. `docker compose exec app bun migrate.js`. |
| `error: encrypted credential cannot be decrypted`                    | `ENCRYPTION_KEY` doesn't match the one used when credentials were saved. Restore the original key, or wipe `app_settings` and re-enter every credential. |

## Stripe webhook never fires

1. Stripe → Developers → Webhooks → click your endpoint → check
   recent attempts. Failed attempts show the response code.
2. 401 / `invalid signature` → the webhook signing secret in
   `/admin/settings` doesn't match the endpoint. Copy it again.
3. 404 → the endpoint URL is wrong. It must be exactly
   `https://learn.client.com/api/webhooks/stripe`, no trailing slash.
4. Connection error → the reverse proxy is blocking it. Confirm
   `curl -I https://learn.client.com/api/webhooks/stripe` returns
   `405 Method Not Allowed` (the route only accepts POST).

## Bunny upload stalls at 0 %

- Wrong API key or wrong library ID in `/admin/settings`.
- The browser's network is blocking `*.bunnycdn.com`. TUS uploads
  go direct from the browser, not through the server.
- Reverse proxy `client_max_body_size` set too low. Bunny chunks
  upload through the browser, not the server, but a stalled CSRF
  preflight will look identical. Bump to 5 GB anyway.

## Email never arrives

- `/admin/settings` → **Send test email**. The error message it
  shows is the SMTP server's actual response.
- `From` address must be on a domain verified with the SMTP
  provider, otherwise it gets silently dropped.
- For port 465 set TLS to `true`; for 587 set STARTTLS.

## "First account" was a student, not the admin

A student registered before you opened the URL. Reset:

```bash
docker compose down
docker volume rm coursemaker_pgdata
docker compose up -d --build
```

This wipes everything. Only do it before any real data exists.

## I lost the `ENCRYPTION_KEY`

See [Backups: what if you lost the
key](./backup-restore.md#what-if-you-lost-the-encryption-key). All
encrypted credentials are gone; users, courses, and lesson data
survive.
