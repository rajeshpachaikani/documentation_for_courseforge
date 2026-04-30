---
sidebar_position: 1
---

# System Requirements

## Server

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Disk     | 20 GB   | 40 GB SSD   |
| OS       | Ubuntu 22.04 / 24.04, Debian 12, AlmaLinux 9 | Ubuntu 24.04 LTS |

Video files are **not** stored on the server — they live in Bunny
Stream — so disk usage stays small. The Postgres volume holds users,
courses, page-builder JSON, theme settings, and encrypted credentials.

## Software

- Docker Engine 24+ with the Compose plugin (`docker compose`, not
  `docker-compose`).
- A reverse proxy that terminates TLS. Pick one:
  - **Caddy** — easiest, automatic Let's Encrypt.
  - **Nginx + Certbot** — most familiar.
  - A managed load balancer (Cloudflare, Hetzner, AWS ALB, etc).

The bundled `docker-compose.yml` does **not** include a reverse
proxy — the app container binds to `127.0.0.1:4210` by default and
expects you to terminate TLS in front of it.

## Network

- A public DNS A/AAAA record pointing at the server.
- Inbound TCP 80 and 443 reachable from the internet.
- Outbound HTTPS to:
  - `api.bunny.net` and `video.bunnycdn.com` (video uploads + signed
    embeds).
  - `api.stripe.com` (Checkout sessions).
  - Your SMTP provider (typical port 465 or 587).

## Third-party accounts the client must own

These belong to **the client**, not you. They are pasted into the
admin UI after install — you do not need them to bring the stack up.

- **Stripe** account (Checkout + webhook signing secret).
- **Bunny.net** account with a Stream library and an API key.
- An **SMTP** provider (Resend, SES, Postmark, or any
  username/password SMTP server) for transactional email.
- Optionally a **Google Cloud** OAuth client for "Sign in with Google".

If any of these are missing on launch day, the platform still boots —
the client just can't accept payments / upload videos / send mail
until they fill the keys in.
