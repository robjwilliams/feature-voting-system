# Feature Voting System

A full-stack app for teams to submit and upvote product feature requests. Users log in, propose features, and vote on what should get built next — the list ranks itself by vote count.

## Architecture

```
┌─────────────────────────────────┐
│  Browser                        │
│  Next.js (App Router)           │
│  React · TypeScript             │
│  Tailwind CSS · shadcn/ui       │
└──────────────┬──────────────────┘
               │ HTTP REST + JWT Bearer token
┌──────────────▼──────────────────┐
│  Backend                        │
│  Django 5 + REST Framework      │
│  SimpleJWT                      │
└──────────────┬──────────────────┘
               │ SQL (psycopg2)
┌──────────────▼──────────────────┐
│  PostgreSQL 16                  │
│  users · features · votes       │
└─────────────────────────────────┘

All services run via Docker Compose.
```

## Layers

### Frontend (`frontend/`)

| Path            | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `/login`        | Single-click sign-in using default credentials (`admin` / `admin`, configurable via env vars) |
| `/`             | Feature list, sorted by vote count                                                            |
| `/features/new` | Create a new feature request                                                                  |

- **`AuthContext`** — global JWT state; token persisted to `localStorage` under `fv-token`
- **`lib/api.ts`** — typed fetch wrapper that automatically attaches the `Authorization: Bearer` header
- **Optimistic updates** — vote counts update in local state before the API response returns, then re-sort the list

### Backend (`backend/`)

Three Django apps:

| App        | Responsibility                                                                     |
| ---------- | ---------------------------------------------------------------------------------- |
| `users`    | Custom `User` model (extends `AbstractUser`); `/api/auth/me/` profile endpoint     |
| `features` | Feature list and create                                                            |
| `votes`    | Vote toggle (create or delete); prevents authors from voting on their own features |

Notable patterns:

- **Denormalized `vote_count`** — plain integer column kept in sync via Django `post_save` / `post_delete` signals on `Vote`, avoiding `COUNT()` on every list request
- **Query optimization** — `select_related('author')` plus a SQL `EXISTS` annotation for `has_voted`, keeping the list fetch to a single query

## API Reference

All endpoints require `Authorization: Bearer <token>`.

| Method | Path                       | Description                                           |
| ------ | -------------------------- | ----------------------------------------------------- |
| `POST` | `/api/auth/login/`         | Obtain JWT tokens (`username` + `password`)           |
| `GET`  | `/api/auth/me/`            | Get current user profile                              |
| `GET`  | `/api/features/`           | List all features (ranked)                            |
| `POST` | `/api/features/`           | Create a feature                                      |
| `POST` | `/api/features/{id}/vote/` | Toggle vote on/off (authors cannot vote on their own) |

## Getting Started

### Prerequisites

- **Docker Desktop 4.x+** and **Docker Compose v2+** (recommended)
- Or: Node.js 22+, Python 3.12+, and a local PostgreSQL instance

### Docker Quick Start (recommended)

```bash
# 1. Clone the repo
git clone git@github.com:robjwilliams/feature-voting-system.git
cd feature-voting-system

# 2. Copy environment file (defaults work out of the box)
cp .env.example .env

# 3. Build and start all services
docker compose up --build -d

# 4. Run database migrations (first time only, in a separate terminal)
docker compose exec backend python manage.py migrate

# 5. Create a superuser (needed to sign in)
docker compose exec backend python manage.py createsuperuser
# follow the prompts — use "admin" / "admin" to match the frontend defaults

# 6. (Optional) Seed sample data
docker compose exec backend python manage.py seed_demo
```

| Service      | URL                         |
| ------------ | --------------------------- |
| Frontend     | http://localhost:3000       |
| Backend API  | http://localhost:8000       |
| Django Admin | http://localhost:8000/admin |
| PostgreSQL   | localhost:5432              |

Sign in at http://localhost:3000/login with the default credentials (`admin` / `admin`).

## Running Tests

**Backend:**

```bash
docker compose exec backend python manage.py test
```

**Frontend:**

```bash
cd frontend
npm run test:run   # single run
npm run test       # watch mode
```

## Environment Variables

Defined in `.env` (copy from `.env.example`):

| Variable               | Default                         | Description                              |
| ---------------------- | ------------------------------- | ---------------------------------------- |
| `POSTGRES_DB`          | `featurevoting`                 | PostgreSQL database name                 |
| `POSTGRES_USER`        | `postgres`                      | PostgreSQL user                          |
| `POSTGRES_PASSWORD`    | `postgres`                      | PostgreSQL password                      |
| `DJANGO_SECRET_KEY`    | `dev-secret-key-change-in-prod` | Django secret key — change in production |
| `DJANGO_DEBUG`         | `True`                          | Enable Django debug mode                 |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1,backend`   | Comma-separated allowed hosts            |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000`         | Origins permitted to call the API        |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000`         | Backend URL used by the frontend         |

Two optional frontend env vars control the default login credentials:

| Variable                       | Default | Description                            |
| ------------------------------ | ------- | -------------------------------------- |
| `NEXT_PUBLIC_DEFAULT_USER`     | `admin` | Username pre-filled on the login page  |
| `NEXT_PUBLIC_DEFAULT_PASSWORD` | `admin` | Password used for single-click sign-in |
