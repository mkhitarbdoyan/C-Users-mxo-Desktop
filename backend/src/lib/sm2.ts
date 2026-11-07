/**
 * Simplified SM-2 spaced repetition.
 * quality: 0–5 (0–2 fail / hard fail, 3 pass with difficulty, 4 good, 5 easy).
 */
export type Sm2State = {
  easiness: number;
  intervalDays: number;
  repetitions: number;
};

export type Sm2Result = Sm2State & {
  dueAt: Date;
};

export function qualityFromCorrect(correct: boolean): number {
  return correct ? 4 : 1;
}

export function applySm2(prev: Sm2State, quality: number, now = new Date()): Sm2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { easiness, intervalDays, repetitions } = prev;

  easiness = Math.max(
    1.3,
    easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  if (q < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easiness));
    }
    repetitions += 1;
  }

  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return { easiness, intervalDays, repetitions, dueAt };
}
