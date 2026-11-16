# NCLEX RN Prep

Expo (React Native) TypeScript app for NCLEX-RN exam preparation. Offline sample practice questions, topic learning guides, nursing flashcards, local progress tracking, study profile, Google OAuth + email auth, and timed exams.

> Sample content is original study scaffolding and is **not** affiliated with NCSBN or the official NCLEX exam.

## Stack

- **Expo SDK 58** + **React Native** + **TypeScript**
- **Expo Router** (auth stack + tabs)
- **`@react-native-async-storage/async-storage`** behind repository abstractions for progress, profile, and auth

## Install & run

```bash
cd nclex-rn-prep
npm install
npx expo start
```

Then open in Expo Go (iOS/Android), a simulator, or press `w` for web.

### Useful scripts

| Command | Purpose |
| --- | --- |
| `npm start` / `npx expo start` | Dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run android` / `ios` / `web` | Platform-specific start |

## Project structure

```
nclex-rn-prep/
├── app/
│   ├── index.tsx            # Auth gate redirect
│   ├── _layout.tsx          # Providers + root stack
│   ├── (auth)/              # Login + register
│   ├── (tabs)/              # Home / Practice / Flashcards / Learn / Exam / Progress / Profile
│   ├── exam/                # Timed exam session stack
│   └── learn/               # Topic detail stack (`/learn/[category]`)
├── components/
├── constants/               # Colors, theme, nursing + topic labels
├── context/                 # AuthProvider, ProfileProvider, ProgressProvider
├── data/                    # Embedded questions, flashcards, topic guides
├── lib/
│   ├── progressStorage.ts
│   ├── api/                 # Backend client (auth, exams, content)
│   ├── auth/                # AuthRepository (API + Google browser session)
│   └── userProfile/         # UserProfileRepository + AsyncStorage impl
└── types/
```

## Backend API

Copy `.env.example` → `.env` and point `EXPO_PUBLIC_API_URL` at the Express server (default `http://localhost:4000`). Auth register/login now use the backend JWT API. Start the backend first (see `../backend/README.md`).

## Auth

- Register / sign in with email + password against the backend
- **Continue with Google** opens the backend OAuth URL in a browser session and stores the returned JWT
- Requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` on the API (see `../backend/README.md`)
- Session JWT is stored on device; Sign out is on the Profile tab

## Learn topics

- **Learn** tab lists clinical categories (cardiac, respiratory, neuro, pharmacology, …)
- Tap a category → `/learn/[category]` quick-reference conditions (key points + nursing priorities)
- Also reachable from Home → **Browse topics**

## Practice & exam filters

- Practice: filter embedded questions by **category** and **difficulty**
- Exam: same chips are sent to `POST /api/exams/start` as `categories` / `difficulties`

## Exam mode

- **Exam** tab (also linked from Home): timed sessions, flagging, review before submit, score report
- After each answer, the app requests an AI explanation (`POST /api/exams/:id/explain`, Gemini when `GEMINI_API_KEY` is set)

## Profile

- Per-user profile (name, email, study goal, preferred categories)
- Created automatically on register
- Editable on the Profile tab via `UserProfileRepository`

## What’s ready vs stubbed

| Area | Status |
| --- | --- |
| Tab navigation + Profile | Ready |
| Learn topic hub + detail guides | Ready |
| Practice / Flashcards / Progress | Ready (local content still embedded for practice tabs) |
| Category + difficulty filters | Ready |
| Backend email auth + JWT | Ready |
| Google OAuth (browser session) | Ready (needs Google Cloud credentials) |
| Exam mode (timed + AI explain) | Ready |
| Native Google Sign-In SDK | Optional via `POST /api/auth/google/id-token` (not wired in UI) |

## Typecheck

```bash
npm run typecheck
```
