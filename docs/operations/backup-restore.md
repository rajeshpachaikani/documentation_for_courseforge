---
sidebar_position: 2
---

# Backups and Restore

CourseForge holds two pieces of state on the server:

1. The **Postgres volume** (`pgdata`) — users, courses, page-builder
   JSON, theme, encrypted credentials.
2. The **`ENCRYPTION_KEY`** environment value — required to decrypt
   the credentials in (1).

**Both must be backed up together.** A DB dump without the key is a
brick.

Video files live in Bunny Stream, not on the server — Bunny handles
their durability separately.

## Daily DB dump

Cron (root crontab):

```bash
0 3 * * * docker compose -f /opt/courseforge/docker-compose.yml \
  exec -T postgres pg_dump -U courseforge -d courseforge \
  | gzip > /var/backups/courseforge/$(date +\%Y\%m\%d).sql.gz
```

Retain 30 days, ship offsite (S3, B2, Borg, restic — your call).

## Backing up the encryption key

Either:

- Paste it into the client's password manager / secrets vault
  alongside their root credentials, or
- Encrypt it with `age` / `gpg` and store next to the DB dumps:

  ```bash
  echo -n "$ENCRYPTION_KEY" | age -r <recipient> > key.age
  ```

Test the recovery path at least once a year. A backup you cannot
restore is not a backup.

## Restoring

On a fresh host:

```bash
git clone https://github.com/<your-org>/courseforge.git /opt/courseforge
cd /opt/courseforge
cp .env.example .env
# Paste the ORIGINAL ENCRYPTION_KEY into .env. Generate the
# others fresh.
docker compose up -d --build
docker compose stop app

zcat /path/to/backup.sql.gz | docker compose exec -T postgres \
  psql -U courseforge -d courseforge

docker compose start app
```

Visit the URL. Sign in with an existing admin account. Open
`/admin/settings` and confirm the saved Stripe / Bunny / SMTP keys
load — that's the proof the encryption key matches.

## What if you lost the encryption key?

The encrypted credentials in `app_settings` are unrecoverable. The
DB structurally is fine — you keep all users, courses, and lessons —
but the client must re-paste every Stripe / Bunny / SMTP value into
`/admin/settings`. There is no other path.
