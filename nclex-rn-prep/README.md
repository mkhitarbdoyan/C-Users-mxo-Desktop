# NCLEX RN Prep

Expo (React Native) TypeScript starter for NCLEX-RN exam preparation. Offline sample practice questions, nursing flashcards, local progress tracking, study profile, and mock auth.

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
│   └── (tabs)/              # Home / Practice / Flashcards / Progress / Profile
├── components/
├── constants/               # Colors, theme, nursing system labels
├── context/                 # AuthProvider, ProfileProvider, ProgressProvider
├── data/                    # Embedded questions & flashcards
├── lib/
│   ├── progressStorage.ts
│   ├── auth/                # AuthRepository + AsyncStorage mock impl
│   └── userProfile/         # UserProfileRepository + AsyncStorage impl
└── types/
```

## Backend API

Copy `.env.example` → `.env` and point `EXPO_PUBLIC_API_URL` at the Express server (default `http://localhost:4000`). Auth register/login now use the backend JWT API. Start the backend first (see `../backend/README.md`).

## Auth

- Register / sign in with email + password against the backend
- Google sign-in is not wired to the backend yet
- Session JWT is stored on device; Sign out is on the Profile tab

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
| Practice / Flashcards / Progress | Ready (local content still embedded for practice tabs) |
| Backend email auth + JWT | Ready |
| Exam mode (timed + AI explain) | Ready |
| Google OAuth | Stubbed |

## Typecheck

```bash
npm run typecheck
```
