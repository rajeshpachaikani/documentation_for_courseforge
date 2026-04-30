---
sidebar_position: 3
---

# One Server, Multiple Clients

CourseMaker is **not** multi-tenant — every client gets their own
fully isolated instance. That's a deliberate product decision: each
client owns their Stripe account, their Bunny library, their data.

If you operate CourseMaker as a hosting provider for several
clients on the same physical machine, run **one stack per client**:

```
/opt/coursemaker/client-acme/
  docker-compose.yml
  .env                   # NEXT_PUBLIC_APP_URL=https://learn.acme.com
                         # APP_HOST_PORT=4210

/opt/coursemaker/client-beta/
  docker-compose.yml
  .env                   # NEXT_PUBLIC_APP_URL=https://learn.beta.com
                         # APP_HOST_PORT=4211
```

Each compose project gets a unique `name:` (top of the compose file)
so volumes and networks don't collide:

```yaml
name: coursemaker-acme
```

Reverse proxy each public hostname to its own `APP_HOST_PORT`.

## Resource sizing

Per stack, expect:

- 200–400 MB RAM idle for the app container.
- 100–200 MB RAM idle for Postgres.
- < 1 % CPU at idle, spikes during catalogue browsing or migration
  runs.

A 4 GB / 2 vCPU VPS comfortably hosts 4–6 small instances. Above
that, isolate per-VPS so a runaway instance can't starve its
neighbours.

## Backups across multiple stacks

Loop over each `/opt/coursemaker/client-*` directory in the cron job
and dump each Postgres separately. **Each stack has its own
`ENCRYPTION_KEY`** — back up keys per-client.
