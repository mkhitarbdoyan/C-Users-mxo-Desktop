# NCLEX RN Prep — Backend

Express + TypeScript + Prisma/Postgres API for the NCLEX RN Prep Expo app.

## Stack

- Node.js 20+
- Express + TypeScript (`tsx` for local dev)
- Prisma + PostgreSQL
- JWT auth (`jsonwebtoken` + `bcryptjs`)
- Google OAuth (authorization code + optional ID token)
- Optional Gemini explanations (`GEMINI_API_KEY`)

## Setup

### 1. Postgres

**Docker (recommended):**

```bash
cd backend
docker compose up -d
```

**Or local Postgres** with a database/user matching `.env.example`.

### 2. Env + migrate + seed

```bash
cd backend
cp .env.example .env
# set JWT_SECRET, Google OAuth keys, and optionally GEMINI_API_KEY
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Health: [http://localhost:4000/health](http://localhost:4000/health)

## Key endpoints

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| `POST` | `/api/auth/register` | No | Create account |
| `POST` | `/api/auth/login` | No | Login → JWT |
| `GET` | `/api/auth/google` | No | Start Google OAuth (`redirect_uri` required) → `{ authorizationUrl }` |
| `GET` | `/api/auth/google/callback` | No | Google redirect; exchanges code, upserts user, redirects with `?token=` |
| `POST` | `/api/auth/google/id-token` | No | Exchange Google ID token → JWT (native SDK path) |
| `POST` | `/api/auth/session` | No | Hydrate `{ token, user }` from a JWT (post deep-link) |
| `GET` | `/api/users/me` | Yes | Current user |
| `PATCH` | `/api/users/me` | Yes | Update profile |
| `GET` | `/api/categories` | No | Topic categories + difficulties + systems |
| `GET` | `/api/categories/:id` | No | One category with question counts |
| `GET` | `/api/systems` | No | Nursing-system labels |
| `GET` | `/api/questions` | No | Question bank (`?categories=&difficulties=&systems=`) |
| `GET` | `/api/flashcards` | No | Flashcards (`?system=&difficulty=`) |
| `GET` | `/api/reviews/due` | Yes | Spaced-repetition due items |
| `POST` | `/api/reviews/:itemType/:itemId` | Yes | Record SM-2 review |
| `POST` | `/api/exams/start` | Yes | Start timed exam (optional `categories` / `difficulties` / `systems`) |
| `GET` | `/api/exams/:id` | Yes | Exam state |
| `POST` | `/api/exams/:id/answers` | Yes | Submit answer |
| `POST` | `/api/exams/:id/flag` | Yes | Flag / unflag |
| `POST` | `/api/exams/:id/explain` | Yes | AI (Gemini) explanation |
| `POST` | `/api/exams/:id/end` | Yes | End exam + score report |

### Question filters

`GET /api/questions` and `POST /api/exams/start` accept:

- **categories** — clinical topics: `cardiac`, `respiratory`, `neuro`, `pharmacology`, `maternity`, `psychiatric`, `fundamentals`, `endocrine` (comma-separated or array)
- **difficulties** — `easy`, `medium`, `hard`
- **systems** — broader nursing systems: `med-surg`, `pharmacology`, …

Singular keys (`category`, `difficulty`, `system`) also work.

## Google OAuth

1. Create an OAuth **Web** client in Google Cloud Console.
2. Set authorized redirect URI to `GOOGLE_REDIRECT_URI` (default `http://localhost:4000/api/auth/google/callback`).
3. Put `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env`.
4. Mobile opens `GET /api/auth/google?redirect_uri=nclexrnprep://auth/google`, completes Google consent, then receives `redirect_uri?token=<JWT>`.

## Gemini

Set `GEMINI_API_KEY` in `.env` for free-tier explanations after each exam answer. Without a key, the API falls back to the authored rationale.
