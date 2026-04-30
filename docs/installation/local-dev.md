---
sidebar_position: 5
---

# Local Development (optional)

Most sysadmins do not need this section — the production install
above does not require running the codebase locally. Use this guide
only if you intend to fork CourseMaker or test changes before
deploying.

## Prerequisites

- Bun 1.2+ (`curl -fsSL https://bun.sh/install | bash`)
- Docker (for the dev Postgres)

## Steps

```bash
git clone https://github.com/<your-org>/coursemaker.git
cd coursemaker
cp .env.example .env.local
```

Fill `BETTER_AUTH_SECRET` and `ENCRYPTION_KEY` with `openssl rand
-base64 32`.

Start the dev Postgres on port 5455:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Install deps, run migrations, start the dev server:

```bash
bun install
bun run db:migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The first account you register
becomes the admin.

## Useful scripts

```bash
bun run db:generate   # Drizzle: regenerate migration SQL from schema
bun run db:push       # Drizzle: push schema directly (dev only)
bun run db:studio     # Drizzle Studio at https://local.drizzle.studio
bun run lint          # ESLint
bun run build         # Production build (Next.js standalone)
```
