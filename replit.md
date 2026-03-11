# OPRPG Tools

Ferramentas completas para Ordem Paranormal RPG — fichas automáticas, bestiário, rituais, arsenal e muito mais.

## Stack

- **Frontend**: React 18 + React Router + Tailwind CSS + Framer Motion (port 5000)
- **Backend**: Node.js + Express (port 3001)
- **Database**: PostgreSQL (Replit built-in)
- **Auth**: JWT + bcrypt

## Architecture

- `frontend/` — React SPA using react-scripts (CRA)
- `backend/` — Express REST API
- `start.sh` — Starts both services (backend on 3001, frontend on 5000)

## Environment Variables

- `DATABASE_URL` — Replit PostgreSQL connection string (auto-set)
- `JWT_SECRET` — JWT signing secret
- `FRONTEND_URL` — Backend CORS origin (http://localhost:5000)
- `REACT_APP_API_URL` — Frontend API base URL (http://localhost:3001/api)
- `HOST` — Frontend host (0.0.0.0)
- `DANGEROUSLY_DISABLE_HOST_CHECK` — Allows Replit proxy access (true)

## Database Setup

The backend auto-runs `migrate.sql` and `seed.sql` on startup via `db-setup.js`.

- `backend/src/schema.sql` — Full table definitions
- `backend/src/migrate.sql` — Additive migrations (safe to run multiple times)
- `backend/src/seed.sql` — Catalog data (creatures, rituals, items, powers, origins)

## Modules

- **Fichas de Personagem** — Character sheet creation with auto-calculated stats
- **Bestiário** — 50+ creatures with element/VD/type/source filters
- **Rituais** — Catalog by element and circle
- **Arsenal** — Weapons, armor, paranormal and cursed items
- **Poderes** — General, class, and paranormal powers
- **Mesa do Mestre** — GM tools
- **Arquivos Secretos** — Subscriber-only content

## Workflow

Single workflow "Start application" runs `bash start.sh` on port 5000 (webview).
