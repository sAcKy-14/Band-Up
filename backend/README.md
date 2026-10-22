# BandUp API

FastAPI service for the BandUp IELTS vocabulary learning platform.

Requires Python 3.11 or newer.

## Local development

From this directory, create and activate a virtual environment, then install the dependencies:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; interactive docs are at `/docs`, the health endpoint is `/api/v1/health`, and the sample vocabulary feed is `/api/v1/vocabulary`.

The vocabulary endpoint supports optional `category` and `difficulty` filters and a `limit` from 1 to 100. It currently returns seed data so the response shape can be integrated before PostgreSQL persistence is added.

The initial layout separates HTTP routes, settings, schemas, business logic, and data access so MVP features can be added by domain. PostgreSQL connection settings and an initial Prisma datasource are included; database client lifecycle and feature models can be implemented when persistence is introduced.
