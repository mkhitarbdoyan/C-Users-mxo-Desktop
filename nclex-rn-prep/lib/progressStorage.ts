import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Attempt, ProgressState, ProgressStats, SessionSummary } from '@/types';

const STORAGE_KEY = '@nclex_rn_prep/progress_v1';

const EMPTY_STATE: ProgressState = {
  attempts: [],
  sessions: [],
};

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE, attempts: [], sessions: [] };
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch {
    return { ...EMPTY_STATE, attempts: [], sessions: [] };
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function computeStats(state: ProgressState): ProgressStats {
  const questionsAnswered = state.attempts.length;
  const correctCount = state.attempts.filter((a) => a.correct).length;
  const accuracyPercent =
    questionsAnswered === 0 ? null : Math.round((correctCount / questionsAnswered) * 100);

  const recentSessions = [...state.sessions]
    .sort((a, b) => b.endedAt.localeCompare(a.endedAt))
    .slice(0, 8);

  return {
    questionsAnswered,
    correctCount,
    accuracyPercent,
    recentSessions,
  };
}

export function appendAttempt(
  state: ProgressState,
  input: { questionId: string; selectedIndex: number; correct: boolean }
): ProgressState {
  const attempt: Attempt = {
    id: createId('att'),
    questionId: input.questionId,
    selectedIndex: input.selectedIndex,
    correct: input.correct,
    answeredAt: new Date().toISOString(),
  };
  return {
    ...state,
    attempts: [...state.attempts, attempt],
  };
}

/** Close out a practice burst as a session when the user finishes a run of answers. */
export function appendSessionFromAttempts(
  state: ProgressState,
  attemptSlice: Attempt[]
): ProgressState {
  if (attemptSlice.length === 0) return state;
  const startedAt = attemptSlice[0].answeredAt;
  const endedAt = attemptSlice[attemptSlice.length - 1].answeredAt;
  const session: SessionSummary = {
    id: createId('ses'),
    startedAt,
    endedAt,
    attemptCount: attemptSlice.length,
    correctCount: attemptSlice.filter((a) => a.correct).length,
  };
  return {
    ...state,
    sessions: [...state.sessions, session],
  };
}

export { createId };
