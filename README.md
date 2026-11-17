# BotForge

BotForge is a multi-tenant AI bot builder SaaS platform.

## Scaffold

- `apps/web`: React, TypeScript, Vite dashboard
- `apps/api`: Express, TypeScript REST API
- `packages/shared`: shared Zod schemas and types
- `apps/api/prisma`: PostgreSQL data model
- `docker-compose.yml`: PostgreSQL and Redis for local development

## Run locally

1. Copy `.env.example` to `.env`.
2. Start infrastructure: `docker compose up -d`.
3. Install dependencies: `npm install`.
4. Generate Prisma Client: `npm run db:generate`.
5. Start both apps: `npm run dev`.

The web app runs at `http://localhost:5173` and the API health endpoint is `http://localhost:4000/health`.

## GitHub Pages

The web dashboard can be deployed as a static GitHub Pages site. Push the repository to GitHub, enable **Settings → Pages → GitHub Actions**, and push to `main`. The workflow in `.github/workflows/deploy-pages.yml` builds and publishes `apps/web/dist`.

The current dashboard stores created bots in browser `localStorage`, so it works without a backend when hosted on GitHub Pages. API-backed authentication, AI providers, and shared workspaces require deploying `apps/api` and PostgreSQL separately.
