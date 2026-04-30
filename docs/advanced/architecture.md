---
sidebar_position: 1
---

# Architecture

A short architecture snapshot for sysadmins who need to reason about
network paths, blast radius, and what lives where.

## Containers

```
┌──────────────────────────────────────────┐
│  reverse proxy (Caddy / Nginx / CF)      │  ← TLS, public 443
│      │                                    │
│      ▼                                    │
│  app  (Next.js standalone, Node 22)      │  ← 127.0.0.1:4210
│      │                                    │
│      ▼                                    │
│  postgres:17 (pgdata volume)             │
└──────────────────────────────────────────┘
```

Two containers (`app`, `postgres`), one named volume (`pgdata`).
The reverse proxy lives on the host, not inside compose.

## Data paths

- **Browser ↔ app** — HTTPS via reverse proxy. Sessions are
  cookie-based (Better Auth).
- **Browser ↔ Bunny** — direct video uploads (TUS) and direct video
  playback (signed embed). The VPS is not in the video path.
- **app ↔ Stripe** — outbound HTTPS to create Checkout Sessions.
- **Stripe ↔ app** — inbound webhook to `/api/webhooks/stripe`.
- **app ↔ SMTP** — outbound, on save (transactional).

## What's encrypted at rest

| Data | Storage | Encryption |
| ---- | ------- | ---------- |
| User passwords | `user.password_hash` | bcrypt (Better Auth) |
| Tenant credentials (Stripe / Bunny / SMTP / Google) | `app_settings.value_encrypted` | AES-256-GCM, key = `ENCRYPTION_KEY` |
| Sessions | `session.token` | random; `BETTER_AUTH_SECRET` signs the cookie |
| Course content, theme, page-builder JSON | various | plain JSONB |

## Migrations

Drizzle migrations live in `/app/drizzle/*.sql` inside the image.
On container start, the entrypoint runs the bundled migrator
(`migrate.js`) which applies pending migrations idempotently and
records them in `__drizzle_migrations__`. Skipping is opt-in via
`SKIP_MIGRATIONS=1`.

## Idempotency in the Stripe webhook

Every webhook event is recorded in `webhook_events` keyed by Stripe
event ID. A duplicate delivery is detected and ignored — so
re-deliveries from Stripe (manual or automatic retries) won't
double-enroll a student.
