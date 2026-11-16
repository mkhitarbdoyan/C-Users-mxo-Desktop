# ArmJob

ArmJob is a modern jobs and community classifieds board for the Armenian community in Los Angeles — inspired by [ArmenianBD.com](https://armenianbd.com).

## Features

- **Jobs** — browse, filter by location/category/type, view details, post a listing (auth required)
- **Resumes / job wanted** — candidate listings
- **Housing** — apartments and ADUs
- **Cars** — for sale and rideshare rentals
- **Events** — community gatherings
- **Business directory** — local services with phone and hours
- **Auth** — sign up, sign in, sign out (Auth.js credentials)
- **Backend** — SQLite + Prisma, Next.js CRUD API routes

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma + SQLite
- Auth.js (NextAuth v5)

## Setup

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

- `demo@armjob.local` / `password123`
- `employer@armjob.local` / `password123`

### Useful scripts

```bash
npm run db:migrate   # apply migrations
npm run db:seed      # reseeds sample LA listings + demo users
npm run build
npm run lint
```

### API overview

| Resource   | List / create     | Detail / delete        |
| ---------- | ----------------- | ---------------------- |
| Jobs       | `GET/POST /api/jobs` | `GET/PUT/DELETE /api/jobs/[id]` |
| Resumes    | `GET/POST /api/resumes` | `GET/DELETE /api/resumes/[id]` |
| Housing    | `GET/POST /api/housing` | `GET/DELETE /api/housing/[id]` |
| Cars       | `GET/POST /api/cars` | `GET/DELETE /api/cars/[id]` |
| Events     | `GET/POST /api/events` | `GET/DELETE /api/events/[id]` |
| Directory  | `GET/POST /api/directory` | `GET/DELETE /api/directory/[id]` |

`POST` / `PUT` / `DELETE` require an authenticated session. Creating a listing stores `authorId`.

## Still open

- Armenian language UI
- Deploy
- End-to-end walkthrough covering auth + posting
