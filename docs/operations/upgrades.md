---
sidebar_position: 3
---

# Upgrades

CourseMaker ships breaking changes infrequently but they do happen.
Always read the release notes before pulling.

## Standard upgrade

```bash
cd /opt/coursemaker
git fetch --tags
git checkout v<new-version>

docker compose build app
docker compose up -d app
```

The app entrypoint runs new migrations automatically. Watch the
logs:

```bash
docker compose logs -f app
```

If migrations fail, the container exits — see
[Troubleshooting](./troubleshooting.md).

## Zero-downtime is not supported

The container restart takes 5–15 seconds and the page returns 502
during that window. Schedule upgrades for off-peak hours, or
front the deployment with a maintenance page in your reverse proxy.

## Skipping migrations on rollback

If a migration breaks something and you need to roll the app back:

```bash
git checkout v<previous-version>
docker compose build app
SKIP_MIGRATIONS=1 docker compose up -d app
```

`SKIP_MIGRATIONS=1` keeps the older app from trying to run the new
migrations again. **It does not undo migrations.** Schema changes
that the older app cannot understand will still break things — open
a support issue rather than guessing.

## Postgres major-version upgrade

The compose file pins `postgres:17-alpine`. To go to 18:

1. `pg_dump` the current DB (see
   [Backups](./backup-restore.md)).
2. `docker compose down`.
3. `docker volume rm coursemaker_pgdata`.
4. Edit `docker-compose.yml`, change `postgres:17-alpine` →
   `postgres:18-alpine`.
5. `docker compose up -d postgres`, restore the dump, then start
   `app`.
