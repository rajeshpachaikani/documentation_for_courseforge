---
sidebar_position: 1
slug: /
title: CourseMaker for System Administrators
---

# CourseMaker for System Administrators

CourseMaker is a self-hostable, white-label course selling platform. Each
client gets their own Docker-deployed instance with their own Stripe,
Bunny Stream, and SMTP credentials, and full control over storefront
appearance.

This guide is written for the **System Administrator** who installs
CourseMaker on a server and hands the running URL over to the client.
Client-side configuration (catalog, theming, payment keys) happens
through the admin UI after the install — those steps are covered in
[Post-Install Setup](./post-install/first-admin-account.md).

## What you get

- A 3-container Docker Compose stack: PostgreSQL 17, the Next.js app,
  and a host-level reverse proxy you put in front (Caddy / Nginx /
  Cloudflare).
- Migrations run automatically at container start. No manual DB step.
- All tenant credentials (Stripe, Bunny, SMTP, Google OAuth) live
  encrypted (AES-256-GCM) inside the database, configured by the
  client through `/admin/settings`. The only secret you protect at
  the infrastructure level is the `ENCRYPTION_KEY`.
- Video never traverses the VPS — uploads go direct from the
  browser to Bunny Stream via TUS.

## Audience

You should be comfortable with:

- A Linux VPS (Ubuntu / Debian / Alma).
- `docker` and `docker compose`.
- DNS records and a reverse proxy of your choice.
- TLS certificates (Let's Encrypt via Caddy or Certbot, or a managed
  load balancer).

You do **not** need to know Next.js, TypeScript, Node, or Bun — the
app ships as a prebuilt Docker image. Source-builds are documented
in [Building from Source](./advanced/building-from-source.md) for
people who want to fork.

## Where to next

1. [System Requirements](./installation/requirements.md)
2. [Quick Install](./installation/quick-install.md)
3. [First Admin Account](./post-install/first-admin-account.md)
