# Feature Voting System

A product feature request tracker where users can submit, discover, and upvote features.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Django 5 + Django REST Framework
- **Database**: PostgreSQL 16
- **Auth**: Header-based fake auth (dev only)
- **Infra**: Docker + Docker Compose

## Prerequisites

- Docker Desktop 4.x+
- Docker Compose v2+

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd feature-voting-system

# 2. Copy env file (defaults work out of the box)
cp .env.example .env

# 3. Build and start all services
docker compose up --build

# 4. Run migrations (first time only — in a separate terminal)
docker compose exec backend python manage.py migrate

# 5. Open the app
open http://localhost:3000
```

## Services

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8000 |
| Postgres | localhost:5432        |

## Fake Auth

No login required. A UUID is auto-generated and stored in your browser's `localStorage` on first visit. Every API request sends it as an `X-User-ID` header.

Use the **dev switcher** (bottom-right corner) to switch between preset test users (Alice, Bob, Carol) — useful for verifying per-user vote state.

## API Reference

| Method | Path                       | Description          |
|--------|----------------------------|----------------------|
| GET    | `/api/features/`           | List features        |
| POST   | `/api/features/`           | Create feature       |
| GET    | `/api/features/{id}/`      | Get feature detail   |
| PUT    | `/api/features/{id}/`      | Update feature       |
| DELETE | `/api/features/{id}/`      | Delete feature       |
| POST   | `/api/features/{id}/vote/` | Toggle vote          |

All endpoints require `X-User-ID: <uuid>` header.

## Development Commands

### Backend

```bash
# Django shell
docker compose exec backend python manage.py shell

# Create migrations after model changes
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Create superuser for Django admin
docker compose exec backend python manage.py createsuperuser
```

### Database

```bash
# Connect to Postgres
docker compose exec db psql -U postgres featurevoting

# Verify vote counts match
SELECT id, title, vote_count FROM features_feature;
SELECT feature_id, COUNT(*) FROM votes_vote GROUP BY feature_id;
```

## Local Backend Setup (without Docker)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # edit DATABASE_URL to point to local Postgres
python manage.py migrate
python manage.py runserver
```
