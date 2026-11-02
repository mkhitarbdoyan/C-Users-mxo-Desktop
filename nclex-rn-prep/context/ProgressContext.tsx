import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  appendAttempt,
  appendSessionFromAttempts,
  clearProgress,
  computeStats,
  loadProgress,
  saveProgress,
} from '@/lib/progressStorage';
import type { Attempt, ProgressState, ProgressStats } from '@/types';

type RecordAnswerInput = {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
};

type ProgressContextValue = {
  ready: boolean;
  state: ProgressState;
  stats: ProgressStats;
  /** Attempts recorded in the current open practice session (not yet closed). */
  openSessionAttempts: Attempt[];
  recordAnswer: (input: RecordAnswerInput) => Promise<void>;
  endSession: () => Promise<void>;
  resetProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<ProgressState>({ attempts: [], sessions: [] });
  const [openSessionAttempts, setOpenSessionAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadProgress();
      if (!cancelled) {
        setState(loaded);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: ProgressState) => {
    setState(next);
    await saveProgress(next);
  }, []);

  const recordAnswer = useCallback(
    async (input: RecordAnswerInput) => {
      const next = appendAttempt(state, input);
      const newest = next.attempts[next.attempts.length - 1];
      setOpenSessionAttempts((prev) => [...prev, newest]);
      await persist(next);
    },
    [persist, state]
  );

  const endSession = useCallback(async () => {
    if (openSessionAttempts.length === 0) return;
    const next = appendSessionFromAttempts(state, openSessionAttempts);
    setOpenSessionAttempts([]);
    await persist(next);
  }, [openSessionAttempts, persist, state]);

  const resetProgress = useCallback(async () => {
    setOpenSessionAttempts([]);
    await clearProgress();
    setState({ attempts: [], sessions: [] });
  }, []);

  const stats = useMemo(() => computeStats(state), [state]);

  const value = useMemo(
    () => ({
      ready,
      state,
      stats,
      openSessionAttempts,
      recordAnswer,
      endSession,
      resetProgress,
    }),
    [ready, state, stats, openSessionAttempts, recordAnswer, endSession, resetProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
