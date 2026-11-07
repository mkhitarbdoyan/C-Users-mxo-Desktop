import type { Response } from 'express';

import { prisma } from '../lib/prisma';
import { applySm2, qualityFromCorrect } from '../lib/sm2';
import type { AuthenticatedRequest } from '../types/auth';

export async function getProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const [attempts, sessions] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId: req.auth.sub },
      orderBy: { answeredAt: 'desc' },
      take: 500,
    }),
    prisma.studySession.findMany({
      where: { userId: req.auth.sub },
      orderBy: { endedAt: 'desc' },
      take: 20,
    }),
  ]);

  const questionsAnswered = attempts.length;
  const correctCount = attempts.filter((a) => a.correct).length;
  const accuracyPercent =
    questionsAnswered === 0 ? null : Math.round((correctCount / questionsAnswered) * 100);

  res.json({
    questionsAnswered,
    correctCount,
    accuracyPercent,
    attempts: attempts.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      selectedIndex: a.selectedIndex,
      correct: a.correct,
      answeredAt: a.answeredAt.toISOString(),
    })),
    recentSessions: sessions.map((s) => ({
      id: s.id,
      startedAt: s.startedAt.toISOString(),
      endedAt: s.endedAt.toISOString(),
      attemptCount: s.attemptCount,
      correctCount: s.correctCount,
    })),
  });
}

export async function recordAttempt(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const body = (req.body ?? {}) as {
    questionId?: string;
    selectedIndex?: number;
    correct?: boolean;
  };

  if (!body.questionId || typeof body.selectedIndex !== 'number' || typeof body.correct !== 'boolean') {
    res.status(400).json({ error: 'questionId, selectedIndex, and correct are required' });
    return;
  }

  const question = await prisma.question.findUnique({ where: { id: body.questionId } });
  if (!question) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId: req.auth.sub,
      questionId: body.questionId,
      selectedIndex: body.selectedIndex,
      correct: body.correct,
    },
  });

  // Also advance spaced-repetition schedule for this question.
  const existing = await prisma.reviewSchedule.findUnique({
    where: {
      userId_itemType_itemId: {
        userId: req.auth.sub,
        itemType: 'question',
        itemId: body.questionId,
      },
    },
  });
  const prev = existing
    ? {
        easiness: existing.easiness,
        intervalDays: existing.intervalDays,
        repetitions: existing.repetitions,
      }
    : { easiness: 2.5, intervalDays: 0, repetitions: 0 };
  const next = applySm2(prev, qualityFromCorrect(body.correct));
  const now = new Date();
  await prisma.reviewSchedule.upsert({
    where: {
      userId_itemType_itemId: {
        userId: req.auth.sub,
        itemType: 'question',
        itemId: body.questionId,
      },
    },
    create: {
      userId: req.auth.sub,
      itemType: 'question',
      itemId: body.questionId,
      easiness: next.easiness,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
      lastReviewedAt: now,
    },
    update: {
      easiness: next.easiness,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
      lastReviewedAt: now,
    },
  });

  res.status(201).json({
    id: attempt.id,
    questionId: attempt.questionId,
    selectedIndex: attempt.selectedIndex,
    correct: attempt.correct,
    answeredAt: attempt.answeredAt.toISOString(),
    nextDueAt: next.dueAt.toISOString(),
  });
}

export async function endSession(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const body = (req.body ?? {}) as {
    startedAt?: string;
    endedAt?: string;
    attemptCount?: number;
    correctCount?: number;
  };

  if (
    typeof body.attemptCount !== 'number' ||
    typeof body.correctCount !== 'number' ||
    !body.startedAt ||
    !body.endedAt
  ) {
    res.status(400).json({
      error: 'startedAt, endedAt, attemptCount, and correctCount are required',
    });
    return;
  }

  const session = await prisma.studySession.create({
    data: {
      userId: req.auth.sub,
      startedAt: new Date(body.startedAt),
      endedAt: new Date(body.endedAt),
      attemptCount: body.attemptCount,
      correctCount: body.correctCount,
    },
  });

  res.status(201).json({
    id: session.id,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt.toISOString(),
    attemptCount: session.attemptCount,
    correctCount: session.correctCount,
  });
}
