# NCLEX RN Prep — Backend

Express + TypeScript + Prisma/Postgres API for the NCLEX RN Prep Expo app.

## Stack

- Node.js 20+
- Express + TypeScript (`tsx` for local dev)
- Prisma + PostgreSQL
- JWT auth (`jsonwebtoken` + `bcryptjs`)
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
# set JWT_SECRET and optionally GEMINI_API_KEY
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
| `GET` | `/api/users/me` | Yes | Current user |
| `PATCH` | `/api/users/me` | Yes | Update profile |
| `GET` | `/api/questions` | No | Question bank (`?system=&difficulty=`) |
| `GET` | `/api/flashcards` | No | Flashcards (`?system=&difficulty=`) |
| `GET` | `/api/reviews/due` | Yes | Spaced-repetition due items |
| `POST` | `/api/reviews/:itemType/:itemId` | Yes | Record SM-2 review |
| `POST` | `/api/exams/start` | Yes | Start timed exam |
| `GET` | `/api/exams/:id` | Yes | Exam state |
| `POST` | `/api/exams/:id/answers` | Yes | Submit answer |
| `POST` | `/api/exams/:id/flag` | Yes | Flag / unflag |
| `POST` | `/api/exams/:id/explain` | Yes | AI (Gemini) explanation |
| `POST` | `/api/exams/:id/end` | Yes | End exam + score report |

## Gemini

Set `GEMINI_API_KEY` in `.env` for free-tier explanations after each exam answer. Without a key, the API falls back to the authored rationale.

## Deploy (Render + Neon)

Step-by-step free-tier hosting checklist: **[DEPLOY_RENDER_NEON.md](./DEPLOY_RENDER_NEON.md)** (Neon Postgres, Render Web Service, migrate/seed, Expo `EXPO_PUBLIC_API_URL`, free-tier gotchas).
