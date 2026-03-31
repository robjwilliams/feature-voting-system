# Feature Voting System

A full-stack app for teams to submit and upvote product feature requests. Users log in, propose features, and vote on what should get built next — the list ranks itself by vote count in real time.

## Architecture

```
┌─────────────────────────────────┐
│  Browser                        │
│  Next.js 14 (App Router)        │
│  React 19 · TypeScript          │
│  Tailwind CSS 4 · shadcn/ui     │
└──────────────┬──────────────────┘
               │ HTTP REST + JWT Bearer token
┌──────────────▼──────────────────┐
│  Backend                        │
│  Django 5 + REST Framework      │
│  SimpleJWT · Custom permissions │
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

Built with **Next.js 14 App Router**, TypeScript, Tailwind CSS 4, and shadcn/ui components.

| Path            | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `/login`        | Single-click sign-in using default credentials (`admin` / `admin`, configurable via env vars) |
| `/`             | Feature list, sorted by vote count                                                            |
| `/features/new` | Create a new feature request                                                                  |

Key internals:

- **`AuthContext`** — global JWT state (user object, `login()`, `logout()`); token persisted to `localStorage` under the key `fv-token`
- **`lib/api.ts`** — typed fetch wrapper that automatically attaches the `Authorization: Bearer <token>` header to every request
- **Optimistic updates** — vote counts update immediately in local state before the API response returns, keeping the UI snappy

### Backend (`backend/`)

Built with **Django 5** and **Django REST Framework**. Authentication is handled by **SimpleJWT** (Bearer tokens).

Three Django apps:

| App        | Responsibility                                                                     |
| ---------- | ---------------------------------------------------------------------------------- |
| `users`    | Custom `User` model (extends `AbstractUser`); `/api/auth/me/` profile endpoint     |
| `features` | Feature CRUD; `IsAuthorOrReadOnly` permission — only the author can edit/delete    |
| `votes`    | Vote toggle (create or delete); prevents authors from voting on their own features |

Notable patterns:

- **Denormalized `vote_count`** — `Feature.vote_count` is a plain integer column kept in sync by Django `post_save` / `post_delete` signals on the `Vote` model, avoiding expensive `COUNT()` queries on every list request
- **Query optimization** — the feature list view uses `select_related('author')` and `prefetch_related('votes')` to avoid N+1 queries

### Database (PostgreSQL 16)

| Table              | Key columns                                                     |
| ------------------ | --------------------------------------------------------------- |
| `users_user`       | Standard Django auth fields                                     |
| `features_feature` | `title`, `description`, `author_id`, `vote_count`, `created_at` |
| `votes_vote`       | `feature_id`, `user_id`, `created_at`                           |

- Unique constraint on `(feature_id, user_id)` prevents duplicate votes
- Index on `vote_count` for efficient ranking queries
- Features are ordered by `vote_count DESC`, then `created_at DESC`

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
git clone <repo-url>
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

### Local Development (without Docker)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # edit POSTGRES_* vars to match your local DB
python manage.py migrate
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm install
# set NEXT_PUBLIC_API_URL=http://localhost:8000 in frontend/.env.local
npm run dev
```

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
