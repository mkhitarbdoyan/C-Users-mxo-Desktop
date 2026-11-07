/** Nursing topic area for sample content. */
export type NursingSystem =
  | 'med-surg'
  | 'pharmacology'
  | 'maternity'
  | 'psychiatric'
  | 'fundamentals';

export type Question = {
  id: string;
  system: NursingSystem;
  stem: string;
  choices: [string, string, string, string];
  /** Zero-based index of the correct choice. */
  correctIndex: 0 | 1 | 2 | 3;
  rationale: string;
  /** Optional clinical image (shown mid-exam; key still blinded). */
  imageUrl?: string | null;
};

export type Flashcard = {
  id: string;
  system: NursingSystem;
  front: string;
  back: string;
};

export type Attempt = {
  id: string;
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  answeredAt: string; // ISO timestamp
};

export type SessionSummary = {
  id: string;
  startedAt: string;
  endedAt: string;
  attemptCount: number;
  correctCount: number;
};

export type ProgressState = {
  attempts: Attempt[];
  sessions: SessionSummary[];
};

export type ProgressStats = {
  questionsAnswered: number;
  correctCount: number;
  accuracyPercent: number | null;
  recentSessions: SessionSummary[];
};

/** Local study profile — persisted via UserProfileRepository (per auth user). */
export type UserProfile = {
  name: string;
  email: string | null;
  /** Free-text goal or target exam date (e.g. "Pass by June 2027"). */
  studyGoal: string | null;
  preferredCategories: NursingSystem[];
  updatedAt: string; // ISO timestamp
};

/** Writable profile fields (updatedAt is set by the repository/context). */
export type UserProfileInput = {
  name: string;
  email?: string | null;
  studyGoal?: string | null;
  preferredCategories: NursingSystem[];
};

export type AuthProviderId = 'email' | 'google';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  provider: AuthProviderId;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  createdAt: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
