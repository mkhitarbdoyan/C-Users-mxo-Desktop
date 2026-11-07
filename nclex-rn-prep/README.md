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

## Auth (local mock)

- Register / sign in with email + password (stored locally)
- **Continue with Google** creates/resumes a mock Google account (`nclex.learner@gmail.com`)
- Session persists across restarts; Sign out is on the Profile tab
- UI talks to `AuthRepository` / `AuthContext` only — not AsyncStorage
- Swap `createAuthRepository()` for a real API / Google SDK later

## Profile

- Per-user profile (name, email, study goal, preferred categories)
- Created automatically on register / first Google sign-in
- Editable on the Profile tab via `UserProfileRepository`

## What’s ready vs stubbed

| Area | Status |
| --- | --- |
| Tab navigation + Profile | Ready |
| Practice / Flashcards / Progress | Ready |
| Local email auth + mock Google | Ready (device-local only) |
| User profile storage abstraction | Ready |
| Real OAuth / backend / email verification | Stubbed (seams only) |
| Full NCLEX bank / quiz modes | Stubbed for later |

## Typecheck

```bash
npm run typecheck
```
