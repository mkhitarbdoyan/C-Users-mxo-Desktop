# Deploy NCLEX RN Prep API — Render (free) + Neon Postgres (free)

Step-by-step checklist for hosting the Express + Prisma backend in `backend/` on **Render’s free Web Service** with a **Neon free Postgres** database. No application code changes are required for this path.

---

## Prerequisites

- GitHub repo with `backend/` on `master` (includes Prisma migrations)
- Accounts: [Neon](https://neon.tech), [Render](https://render.com), optional [Google AI Studio](https://aistudio.google.com/apikey) for `GEMINI_API_KEY`
- Local Node 20+ (to run migrations/seed against Neon from your machine)

---

## 1) Create Neon project and get the connection string

1. Sign in at [https://console.neon.tech](https://console.neon.tech).
2. **Create a project** (e.g. name `nclex-rn-prep`, region close to you / to Render’s Oregon `oregon` if you pick US West).
3. When the project opens, open **Dashboard → Connection details**.
4. Copy **two** connection strings (toggle / connection type):
   - **Pooled** (has `-pooler` in the host) — use this as `DATABASE_URL` on **Render** for the running app.
   - **Direct** (no `-pooler`) — use this locally for **`prisma migrate deploy`** and **seed** (Prisma migrations are more reliable without PgBouncer).
5. Ensure the string includes SSL, e.g. append if missing:
   - `?sslmode=require`
   - Example shape:  
     `postgresql://USER:PASSWORD@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`  
     Pooled:  
     `postgresql://USER:PASSWORD@ep-xxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`
6. Save both strings somewhere private. Do **not** commit them.

Optional Neon UI checks:

- Project → **Branches** → use the default `main` branch DB.
- **Roles** / database name (often `neondb`) must match the URL path.

---

## 2) Configure the Render Web Service

1. Sign in at [https://dashboard.render.com](https://dashboard.render.com).
2. **New → Web Service**.
3. Connect the GitHub repo `mkhitarbdoyan/C-Users-mxo-Desktop` (or your fork).
4. Set:

| Field | Value |
| --- | --- |
| **Name** | e.g. `nclex-rn-prep-api` |
| **Region** | Prefer same region family as Neon when possible |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | See below |
| **Start Command** | See below |
| **Instance type** | **Free** |

### Build command

Render often sets `NODE_ENV=production`, which can skip `devDependencies`. This repo keeps `prisma`, `typescript`, and `tsx` under **devDependencies**, so force installing them for the build:

```bash
npm install --include=dev && npx prisma generate && npm run build
```

(`npm run build` already runs `prisma generate && tsc` — the extra `prisma generate` is fine.)

### Start command

```bash
npm start
```

(equiv. `node dist/index.js`)

### Environment variables (Render → Environment)

| Key | Value | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Neon **pooled** URL + `sslmode=require` | Runtime connections |
| `JWT_SECRET` | Long random string | Required for auth/exams |
| `GEMINI_API_KEY` | Google AI Studio key | Optional; explain falls back without it |
| `GEMINI_MODEL` | optional, e.g. `gemini-2.0-flash` | Optional override |
| `PORT` | *(leave unset)* | Render injects `PORT`; the app already uses `process.env.PORT \|\| 4000` |
| `NODE_ENV` | `production` | Usually set by Render |

Do **not** put a fixed `PORT=4000` that conflicts with Render’s assigned port; rely on Render’s `PORT`.

5. Click **Create Web Service** and wait for the first deploy.
6. Copy the service URL, e.g. `https://nclex-rn-prep-api.onrender.com`.
7. Smoke-test after migrate/seed (next sections):

```bash
curl https://YOUR-SERVICE.onrender.com/health
```

Expect JSON like `{ "ok": true, "service": "nclex-rn-prep-backend", ... }`.

---

## 3) Run Prisma migrations against Neon (remote)

Run from your **local** machine (or any CI with Node 20+), using the Neon **direct** (non-pooler) URL:

```bash
cd backend
npm install --include=dev

# Use the DIRECT Neon connection string (no -pooler host)
export DATABASE_URL='postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require'

npx prisma migrate deploy
```

- `migrate deploy` applies committed migrations in `prisma/migrations/` (including `init_exam_content` and `add_question_image_url`).
- Prefer **direct** URL here. If migrate fails with prepared-statement / pooler errors, you almost certainly used the pooled URL — switch to direct.

Verify tables exist (Neon SQL Editor or):

```bash
npx prisma db pull   # optional sanity check; discard generated changes
```

---

## 4) Seed the remote database

Still using the **direct** `DATABASE_URL`:

```bash
cd backend
export DATABASE_URL='postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require'

npm run db:seed
# same as: npx tsx prisma/seed.ts
```

This upserts the sample **12 questions** (some with `imageUrl`) and **14 flashcards**.

Re-seed is safe for this seed script (upserts by id). It does **not** create a demo user — register via the app or `POST /api/auth/register`.

---

## 5) Point the Expo app at the Render URL

1. In `nclex-rn-prep/`, create or edit `.env` (do not commit secrets; `.env` should stay local):

```bash
cd nclex-rn-prep
cp .env.example .env
```

2. Set:

```bash
EXPO_PUBLIC_API_URL=https://YOUR-SERVICE.onrender.com
```

No trailing slash. Expo only inlines `EXPO_PUBLIC_*` at bundle time — **restart** Expo after changing `.env`:

```bash
npx expo start -c
```

3. Device notes:
   - **Physical phone**: Render HTTPS URL works (unlike `localhost`).
   - **Simulator/emulator**: same HTTPS URL is fine for production API.
   - Confirm login/register hits the cloud API (first request may be slow — see cold starts below).

4. Quick API checks from a terminal:

```bash
curl https://YOUR-SERVICE.onrender.com/health
curl https://YOUR-SERVICE.onrender.com/api/questions
```

---

## 6) Free-tier gotchas

| Topic | What to expect |
| --- | --- |
| **Render cold starts** | Free web services **spin down** after ~15 minutes idle. First request after sleep can take **30–60+ seconds** and may time out in the app. Retry once, or hit `/health` in a browser to wake the service before demos. |
| **Render free limits** | Monthly hours / spin-down policies can change; check Render’s Free plan docs. No custom domains required. |
| **Neon free limits** | Compute can **suspend** when idle; first query after wake is slower. Storage and compute caps apply (see Neon Free plan). |
| **Connection limits** | Neon free has a low connection cap. Prefer the **pooled** URL on Render. Avoid opening many Prisma clients (this app uses a singleton). Don’t run long `migrate`/`seed` against pooler if it errors — use **direct**. |
| **Prisma + pooler** | Without a Prisma `directUrl` in schema (this repo only has `url`), keep **migrate/seed on direct** and **app runtime on pooled**. |
| **devDependencies on Render** | Build must use `npm install --include=dev` (or equivalent) or `prisma` / `tsc` will be missing. |
| **JWT_SECRET** | Must be set in production or auth/exam routes fail. |
| **CORS** | Backend uses `cors()` with default open config — fine for Expo. |
| **Images** | Seeded `imageUrl`s are public Unsplash HTTPS links; they load on the client, not via Render. |
| **Gemini** | Free-tier quotas/rate limits apply; without `GEMINI_API_KEY`, explain still works via blind/rationale fallback. |
| **Monorepo root** | Render **Root Directory** must be `backend` or installs/builds will target the wrong package. |

---

## End-to-end checklist (copy/paste)

- [ ] Neon project created; **pooled** + **direct** URLs saved with `sslmode=require`
- [ ] Render Web Service: root `backend`, branch `master`, free instance
- [ ] Build: `npm install --include=dev && npx prisma generate && npm run build`
- [ ] Start: `npm start`
- [ ] Env on Render: `DATABASE_URL` (pooled), `JWT_SECRET`, optional `GEMINI_API_KEY` / `GEMINI_MODEL` — **no** conflicting hard-coded `PORT`
- [ ] Local: `DATABASE_URL=<direct> npx prisma migrate deploy`
- [ ] Local: `DATABASE_URL=<direct> npm run db:seed`
- [ ] `curl https://YOUR-SERVICE.onrender.com/health` → `ok: true`
- [ ] `curl https://YOUR-SERVICE.onrender.com/api/questions` → seeded items
- [ ] Expo `.env`: `EXPO_PUBLIC_API_URL=https://YOUR-SERVICE.onrender.com` + restart Expo
- [ ] Register/login in app; start a short exam (expect cold-start delay on first hit)

---

## Related local scripts (reference)

From `backend/package.json`:

| Script | Use |
| --- | --- |
| `npm run build` | `prisma generate && tsc` |
| `npm start` | `node dist/index.js` |
| `npx prisma migrate deploy` | Apply migrations to remote (production-style) |
| `npm run db:seed` | `tsx prisma/seed.ts` |

For day-to-day local Docker Postgres, see `README.md` and `docker-compose.yml`. This document is specifically for **Render + Neon**.
