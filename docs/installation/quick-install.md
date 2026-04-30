---
sidebar_position: 2
---

# Quick Install

End-to-end install on a fresh Ubuntu 24.04 VPS. Time to first boot:
about 10 minutes.

## 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
# log out and back in so the group change takes effect
```

Verify:

```bash
docker --version
docker compose version
```

## 2. Get the CourseMaker source

CourseMaker is shipped as a source repository — `docker compose up
--build` builds the image locally. Clone it onto the server:

```bash
sudo mkdir -p /opt/coursemaker
sudo chown "$USER":"$USER" /opt/coursemaker
cd /opt/coursemaker
git clone https://github.com/<your-org>/coursemaker.git .
```

:::tip
Replace `<your-org>` with the repository URL your vendor gave you.
If you received a tarball instead, `tar xzf coursemaker.tar.gz -C
/opt/coursemaker --strip-components=1`.
:::

## 3. Generate secrets

CourseMaker needs two random 32-byte secrets:

```bash
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)"
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)"
```

:::danger Back up `ENCRYPTION_KEY` before continuing.
This key encrypts every Stripe / Bunny / SMTP credential the client
will paste into the admin UI. **If you lose it, the credentials are
unrecoverable** even if the database is intact. Store it in a password
manager or a secrets vault before pasting it into `.env`.
:::

## 4. Create `.env`

Copy the template and fill it in:

```bash
cp .env.example .env
nano .env
```

Required values:

```ini
NEXT_PUBLIC_APP_URL=https://learn.client.com
BETTER_AUTH_URL=https://learn.client.com
BETTER_AUTH_SECRET=<paste the value you generated>
ENCRYPTION_KEY=<paste the value you generated>

POSTGRES_USER=coursemaker
POSTGRES_PASSWORD=<choose a strong password>
POSTGRES_DB=coursemaker

APP_HOST_PORT=4210
```

`NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` should be the **public
HTTPS URL** the client will use. Do not include a trailing slash.

See [Environment Reference](./environment-reference.md) for the full
list of variables.

## 5. Bring the stack up

```bash
docker compose up -d --build
```

The first build takes 3–5 minutes (it pulls Bun + Node base images
and runs `next build`). Subsequent builds are cached.

Watch the migrations run:

```bash
docker compose logs -f app
```

Look for `Migrations complete` followed by `Ready in <ms>ms`. The
app is now listening on `127.0.0.1:4210`.

## 6. Put a reverse proxy in front

Install Caddy (simplest option):

```bash
sudo apt install -y caddy
```

Edit `/etc/caddy/Caddyfile`:

```caddy
learn.client.com {
    reverse_proxy 127.0.0.1:4210
}
```

```bash
sudo systemctl reload caddy
```

Caddy fetches a Let's Encrypt cert on first request. For Nginx,
HAProxy, or Cloudflare Tunnels see [Reverse Proxy
Recipes](./reverse-proxy.md).

## 7. Smoke test

```bash
curl -I https://learn.client.com
```

Expected: `HTTP/2 200`. Open the URL in a browser — you should see
the CourseMaker landing page with a **Sign Up** button.

## Next

The deployment is up. Hand the URL to the client and walk them
through [First Admin Account](../post-install/first-admin-account.md).
