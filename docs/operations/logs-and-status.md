---
sidebar_position: 1
---

# Logs and Status

```bash
docker compose ps                       # container health
docker compose logs -f app              # app stdout/stderr
docker compose logs -f postgres         # DB
docker compose logs --since 30m app     # last 30 minutes
```

## Health checks

Both `app` and `postgres` ship Docker healthchecks:

```bash
docker inspect --format='{{.State.Health.Status}}' coursemaker-app
docker inspect --format='{{.State.Health.Status}}' coursemaker-postgres
```

`healthy` means the app responds to `GET /` with HTTP 200 and
Postgres is accepting queries.

## Running a one-off command in the app container

```bash
docker compose exec app sh
docker compose exec app node -e 'console.log(process.env.NEXT_PUBLIC_APP_URL)'
```

## Re-running migrations manually

Migrations run automatically at container start. Force a manual run:

```bash
docker compose exec app bun migrate.js
```

(`migrate.js` is the bundled Drizzle migrator shipped inside the
image.)

## Disk and DB size

```bash
docker system df
docker compose exec postgres psql -U coursemaker -d coursemaker \
  -c "SELECT pg_size_pretty(pg_database_size('coursemaker'));"
```
