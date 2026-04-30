---
sidebar_position: 3
---

# Environment Reference

CourseForge keeps the `.env` file deliberately small. Only
infrastructure-level secrets live here — everything tenant-specific
(Stripe keys, Bunny keys, SMTP credentials, OAuth client IDs) is
stored encrypted in the database and configured from the admin UI.

## Required at deploy time

| Variable              | Required | Purpose                                            |
| --------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | yes      | Canonical public URL, no trailing slash. Used for OAuth callbacks, Stripe success URLs, and email links. |
| `BETTER_AUTH_URL`     | yes      | Auth canonical URL. Usually equal to `NEXT_PUBLIC_APP_URL`. |
| `BETTER_AUTH_SECRET`  | yes      | 32-byte base64 secret signing session cookies. Generate with `openssl rand -base64 32`. |
| `ENCRYPTION_KEY`      | yes      | 32-byte base64 key encrypting tenant credentials in the DB. **Losing this is fatal.** |
| `POSTGRES_PASSWORD`   | yes      | Postgres superuser password. Strong, unique. |

## Optional / defaulted

| Variable          | Default        | Notes |
| ----------------- | -------------- | ----- |
| `POSTGRES_USER`   | `courseforge`  | DB role. Rarely changed. |
| `POSTGRES_DB`     | `courseforge`  | DB name. Rarely changed. |
| `APP_HOST_PORT`   | `4210`         | Port on `127.0.0.1` the app container binds to. Your reverse proxy points here. |
| `SKIP_MIGRATIONS` | unset          | Set to `1` on the `app` service to skip migrations on startup (rollback / debugging). |

## Things that are NOT in `.env`

These live encrypted in the `app_settings` table and are configured
through `/admin/settings`:

- Stripe secret key + webhook signing secret.
- Bunny Stream API key + library ID + CDN hostname.
- SMTP host / port / user / password / from-address.
- Google OAuth client ID + secret.
- Storefront colours, fonts, custom CSS.

This split is intentional: a sysadmin can stand up the platform
without ever seeing the client's payment keys. The client pastes them
into the UI themselves after first login.

## Generating the two secrets

```bash
# 32-byte base64, suitable for both vars
openssl rand -base64 32
```

If `openssl` is unavailable:

```bash
head -c 32 /dev/urandom | base64
```

## Rotating secrets

- `BETTER_AUTH_SECRET` — rotating invalidates all current sessions.
  Set the new value in `.env`, run `docker compose up -d`, users
  re-log-in.
- `ENCRYPTION_KEY` — **do not rotate naively**. Encrypted credentials
  in the DB are tied to the current key. Rotation requires a
  re-encryption migration; see
  [Backups & Restore](../operations/backup-restore.md).
