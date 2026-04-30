ARG BUN_VERSION=1.2.20
ARG NGINX_VERSION=1.27-alpine

# --- build the static site with Bun ---
FROM oven/bun:${BUN_VERSION}-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# --- serve with nginx ---
FROM nginx:${NGINX_VERSION} AS runner
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
