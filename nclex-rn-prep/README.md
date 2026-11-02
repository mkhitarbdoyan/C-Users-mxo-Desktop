# NCLEX RN Prep

Expo (React Native) TypeScript starter for NCLEX-RN exam preparation. Offline sample practice questions, nursing flashcards, and local progress tracking.

> Sample content is original study scaffolding and is **not** affiliated with NCSBN or the official NCLEX exam.

## Stack

- **Expo SDK 58** + **React Native** + **TypeScript**
- **Expo Router** (file-based tabs)
- **`@react-native-async-storage/async-storage`** for progress persistence

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
│   ├── _layout.tsx          # Root stack + ProgressProvider
│   └── (tabs)/
│       ├── _layout.tsx      # Home / Practice / Flashcards / Progress tabs
│       ├── index.tsx        # Home
│       ├── practice.tsx     # MCQ + rationale
│       ├── flashcards.tsx   # Flip cards
│       └── progress.tsx     # Stats + session history
├── components/              # Shared UI (buttons, chips, themed helpers)
├── constants/               # Colors + spacing/typography tokens
├── context/ProgressContext.tsx
├── data/                    # Embedded questions & flashcards
├── lib/progressStorage.ts   # AsyncStorage read/write + stats
└── types/                   # Question, Flashcard, Attempt, Progress
```

## What’s ready vs stubbed

| Area | Status |
| --- | --- |
| Tab navigation (Home, Practice, Flashcards, Progress) | Ready |
| ~12 NCLEX-style sample questions with rationales | Ready (embedded) |
| ~14 nursing concept flashcards | Ready (embedded) |
| Practice answer checking + rationale | Ready |
| Progress stats + recent sessions (AsyncStorage) | Ready |
| Calm clinical teal/blue theme | Ready (basic light/dark tokens) |
| Auth / backend / payments / push | Out of scope |
| Full NCLEX bank / categories / quiz modes | Stubbed for later |
| E2E tests / dark-mode polish | Out of scope this pass |

## Typecheck

```bash
npm run typecheck
```
