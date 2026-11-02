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
