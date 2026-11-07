# NCLEX RN Prep — Backend

Minimal Express + TypeScript API for the **NCLEX RN Prep** Expo app.

**Current scope:** authentication and user-info route stubs only. No questions/flashcards API and no real database yet.

## Stack

- Node.js 20+
- Express
- TypeScript (`tsx` for local dev)
- `cors`, `dotenv`
- `jsonwebtoken` + `bcryptjs` (ready for auth implementation)

## Folder structure

```
backend/
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts              # Server entrypoint
    ├── app.ts                # Express app + route mounting
    ├── controllers/          # Auth & user handlers (stubs)
    ├── middleware/           # JWT requireAuth
    ├── models/               # In-memory user placeholder
    ├── routes/               # /api/auth, /api/users
    └── types/                # Shared request/response types
```

## Setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env` if you want a different `PORT` or `JWT_SECRET`. `DATABASE_URL` is a placeholder and is unused for now.

## Run

```bash
# Development (reload on change)
npm run dev

# Typecheck
npm run typecheck

# Production-style
npm run build
npm start
```

Server defaults to [http://localhost:4000](http://localhost:4000).

## Endpoints (stubs)

| Method | Path | Auth | Status today |
| ------ | ---- | ---- | ------------ |
| `GET` | `/health` | No | `200` hello-world health |
| `POST` | `/api/auth/register` | No | `501` stub (validates body) |
| `POST` | `/api/auth/login` | No | `501` stub (validates body) |
| `GET` | `/api/users/me` | Bearer JWT | `501` stub (middleware verifies token) |
| `PATCH` | `/api/users/me` | Bearer JWT | `501` stub |

### Quick checks

```bash
curl http://localhost:4000/health

curl -s -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret123"}'
```

## Next steps (not in this scaffold)

1. Persist users (Postgres / SQLite + Prisma or similar)
2. Implement register/login with `bcryptjs` + JWT
3. Return real user profiles from `GET /users/me`
4. Point the Expo `AuthRepository` at these endpoints
5. Add questions / flashcards / progress APIs later

The Expo app under `nclex-rn-prep/` is untouched by this scaffold.
