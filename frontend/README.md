# BandUp Web

Responsive dashboard for the BandUp vocabulary learning experience. It loads the curated vocabulary, today's learning queue, and learner progress from the FastAPI backend. Learning answers use the backend's development demo identity until Clerk sign-in is added.

## Run locally

Requires Node.js 20 or newer.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Vocabulary and progress are loaded from the API; review answers are saved there as well. Some profile and collection actions remain interface placeholders.

Start the backend separately as described in [`../backend/README.md`](../backend/README.md). The frontend calls `http://127.0.0.1:8000` by default. To use another API address, create `.env.local` in this directory:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Vocabulary, today's queue, progress, and recall answers require the API and its database to be available. When the API cannot be reached, the dashboard shows the connection error in the learning card.
