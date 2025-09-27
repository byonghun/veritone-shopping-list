# veritone-shopping-list
Shopping List App

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
npm run dev
```
