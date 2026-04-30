---
sidebar_position: 4
---

# Reverse Proxy Recipes

The CourseForge app container binds to `127.0.0.1:${APP_HOST_PORT}`
(default `4210`). It speaks plain HTTP. **You must put a TLS
terminator in front of it.** Three working recipes below.

## Caddy (recommended)

Caddy fetches and renews Let's Encrypt certificates automatically.

`/etc/caddy/Caddyfile`:

```caddy
learn.client.com {
    encode zstd gzip

    # Bunny TUS uploads can exceed the default 10 MB limit
    request_body {
        max_size 5GB
    }

    reverse_proxy 127.0.0.1:4210 {
        header_up X-Forwarded-Proto https
        header_up X-Forwarded-Host {host}
    }
}
```

```bash
sudo systemctl reload caddy
```

## Nginx + Certbot

`/etc/nginx/sites-available/courseforge`:

```nginx
server {
    listen 80;
    server_name learn.client.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learn.client.com;

    ssl_certificate     /etc/letsencrypt/live/learn.client.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn.client.com/privkey.pem;

    client_max_body_size 5G;
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;

    location / {
        proxy_pass http://127.0.0.1:4210;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/courseforge /etc/nginx/sites-enabled/
sudo certbot --nginx -d learn.client.com
sudo systemctl reload nginx
```

## Cloudflare Tunnel

If the server has no public IP (NATted home lab, hardened VPS), run
`cloudflared` on the host and route the public hostname to the local
port. No inbound 80/443 needed.

```bash
cloudflared tunnel route dns courseforge learn.client.com
```

`/etc/cloudflared/config.yml`:

```yaml
tunnel: courseforge
credentials-file: /etc/cloudflared/courseforge.json

ingress:
  - hostname: learn.client.com
    service: http://127.0.0.1:4210
  - service: http_status:404
```

## Important headers

The app trusts the `X-Forwarded-Proto` header to know whether the
client connection is HTTPS. **Set it.** If it's missing or wrong,
session cookies will be issued without `Secure` and OAuth callbacks
will redirect to HTTP.
