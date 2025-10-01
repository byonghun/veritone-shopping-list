# veritone-shopping-list

Shopping List App

## What this repo contains

### - Apps

- `apps/server`: Node/Express API (Dockerized for local/dev).

### - Infra

- Dockerfiles for web + server, `docker-compose.yml` for local.
- `apps/web/nginx.conf` with SPA fallback, caching, and `/healthz`.

## Third Pary components & attributions

#### This project depends on open-source software

- **Runtime/build**: Node.js, Webpack, Babel, TypScript
- **Frontend**: React, React Router, Tailwind CSS, shadcn/ui, Radix UI
- **Fonts**: `@fontsource/dosis` and `@fontsource/nunito`
- **Container images**: `postgres:16-alpine`, `nginx:1.27-x-alpine`

## Backend

### Prerequisites

- Docker Desktop
  - macOS - `brew install --cask docker`
  - Windows 10/11 (WSL2 recommended) - `winget install -e --id Docker.DockerDesktop`
- Node.js >=18.0.0
- Npm 10.9.2

### Environment Variables

```
cp .env.example .env.development
# Edit values as needed:
PORT=3001
API_BASE_URL=http://localhost:3001
```

### Quick Start (Docker)

```
# Build + run dev stack (hot reload via tsx)
# db + server + web
npm run dev:docker
# or
docker compose up --build
```

### Quick Start Backend (Locally)

```
# Run locally, hot reload via tsx
cd apps/server
npm run dev
```

### Quick Start Frontend (Locally)

```
# Run locally, hot reload via tsx
cd apps/web

# Dev server with Hot Module Replacement (HMR)
npm run dev

# Production build to dist/
npm run build

# Same as dev
npm run start

# Analyze the production bundle
# Creates stats.json file
npm run analyze

# Run to visually see analysis
# Must run after stats.json is created via `npm run analyze`
npx webpack-bundle-analyze stats.json
```
