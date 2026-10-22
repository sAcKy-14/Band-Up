# BandUp API

FastAPI service for the BandUp IELTS vocabulary learning platform. It persists the curated vocabulary and learner review history in PostgreSQL.

Requires Python 3.11 or newer.

## Local development

From this directory, start the local PostgreSQL database, create and activate a virtual environment, then install the dependencies:

```powershell
docker compose up -d db
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
python -m app.scripts.seed_vocabulary
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; interactive docs are at `/docs`. The endpoints are:

- `GET /api/v1/health` — service liveness.
- `GET /api/v1/vocabulary` — curated vocabulary, filterable by `category`, `difficulty`, and `search`; `limit` is 1–100.
- `GET /api/v1/learning/today` — due words first, then new words. Accepts optional `category` and `difficulty` filters; word meanings are withheld until an answer is submitted.
- `POST /api/v1/learning/words/{word_id}/answer` — submit self-assessed recall as `{"recalled": true, "mode": "meaning_recall"}`. Correct answers schedule a longer interval; missed answers return after ten minutes. Submitting before the next review time returns `409`.
- `GET /api/v1/progress` — learned/mastered/due counts, XP, streak, and recent daily activity.

When `CLERK_SECRET_KEY` is empty and `APP_ENV=development`, learner endpoints use `demo-user` or the optional `X-Dev-User-Id` header. This local-only identity lets you explore the backend before setting up Clerk. Configure `CLERK_SECRET_KEY` and `CLERK_AUTHORIZED_PARTIES` to verify Clerk sessions. The demo identity is never used outside development; missing production auth configuration returns an error.

The schema is versioned in `migrations/versions`. After changing a model, create a migration with `alembic revision --autogenerate -m "describe the change"`, review the generated file, then apply it with `alembic upgrade head`.

The API records a learner's self-assessed recall. It does not yet evaluate typed answers, generate words with AI, or estimate IELTS band scores. Those are later product decisions in [`../docs/features.md`](../docs/features.md).
