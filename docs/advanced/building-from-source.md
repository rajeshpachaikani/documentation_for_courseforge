---
sidebar_position: 2
---

# Building from Source

The standard install (`docker compose up --build`) already builds
from source — the image is constructed locally on the server, not
pulled from a registry. This page covers the variants.

## CI-built image (recommended for fleets)

If you operate more than a handful of CourseMaker deployments,
build once in CI and push to a private registry:

```bash
docker build -t registry.example.com/coursemaker:v1.4.0 .
docker push registry.example.com/coursemaker:v1.4.0
```

Then on each server, replace the `build:` block in
`docker-compose.yml` with `image: registry.example.com/coursemaker:v1.4.0`.
Upgrades become `docker compose pull && docker compose up -d`.

## Architecture-specific notes

The `Dockerfile` builds on Node + Bun. The build stage uses **Node**
explicitly (`node node_modules/next/dist/bin/next build`) because
Bun's Turbopack chunk loader fails on arm64 with `ChunkLoadError`
during page-data collection. Don't switch the build stage to Bun
unless you've confirmed this still reproduces.

The runtime stage is also Node, with the Bun binary copied in solely
to run the bundled migrator.

## Forking the codebase

The repository contains a `CLAUDE.md` / `AGENTS.md` warning the
Next.js version uses non-standard conventions. Read
`node_modules/next/dist/docs/` before changing anything in `app/` —
the Next.js installed here may not match what your Next docs
elsewhere describe.
