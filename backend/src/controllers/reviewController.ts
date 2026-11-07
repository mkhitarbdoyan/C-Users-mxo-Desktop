import type { Response } from 'express';

import { mapFlashcard, mapQuestion, toDbItemType } from '../lib/mappers';
import { prisma } from '../lib/prisma';
import { applySm2, qualityFromCorrect } from '../lib/sm2';
import type { AuthenticatedRequest } from '../types/auth';

export async function listDue(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const typeParam = typeof req.query.type === 'string' ? req.query.type : null;
  const itemType = typeParam ? toDbItemType(typeParam) : null;
  if (typeParam && !itemType) {
    res.status(400).json({ error: 'type must be question or flashcard' });
    return;
  }

  const now = new Date();
  const schedules = await prisma.reviewSchedule.findMany({
    where: {
      userId: req.auth.sub,
      dueAt: { lte: now },
      ...(itemType ? { itemType } : {}),
    },
    orderBy: { dueAt: 'asc' },
  });

  const questionIds = schedules.filter((s) => s.itemType === 'question').map((s) => s.itemId);
  const flashcardIds = schedules.filter((s) => s.itemType === 'flashcard').map((s) => s.itemId);

  const [questions, flashcards] = await Promise.all([
    questionIds.length
      ? prisma.question.findMany({ where: { id: { in: questionIds } } })
      : Promise.resolve([]),
    flashcardIds.length
      ? prisma.flashcard.findMany({ where: { id: { in: flashcardIds } } })
      : Promise.resolve([]),
  ]);

  const qMap = new Map(questions.map((q) => [q.id, mapQuestion(q)]));
  const fMap = new Map(flashcards.map((f) => [f.id, mapFlashcard(f)]));

  const items = schedules
    .map((s) => {
      if (s.itemType === 'question') {
        const question = qMap.get(s.itemId);
        if (!question) return null;
        return {
          itemType: 'question' as const,
          dueAt: s.dueAt.toISOString(),
          schedule: {
            easiness: s.easiness,
            intervalDays: s.intervalDays,
            repetitions: s.repetitions,
          },
          question,
        };
      }
      const flashcard = fMap.get(s.itemId);
      if (!flashcard) return null;
      return {
        itemType: 'flashcard' as const,
        dueAt: s.dueAt.toISOString(),
        schedule: {
          easiness: s.easiness,
          intervalDays: s.intervalDays,
          repetitions: s.repetitions,
        },
        flashcard,
      };
    })
    .filter(Boolean);

  res.json({
    count: items.length,
    dueQuestionCount: items.filter((i) => i && i.itemType === 'question').length,
    dueFlashcardCount: items.filter((i) => i && i.itemType === 'flashcard').length,
    items,
  });
}

/**
 * Record a review outcome and advance SM-2 schedule.
 * Body: { quality?: 0-5, correct?: boolean }
 */
export async function submitReview(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const itemType = toDbItemType(req.params.itemType);
  const itemId = req.params.itemId;
  if (!itemType || !itemId) {
    res.status(400).json({ error: 'itemType and itemId are required' });
    return;
  }

  if (itemType === 'question') {
    const exists = await prisma.question.findUnique({ where: { id: itemId } });
    if (!exists) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
  } else {
    const exists = await prisma.flashcard.findUnique({ where: { id: itemId } });
    if (!exists) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }
  }

  const body = (req.body ?? {}) as { quality?: number; correct?: boolean };
  let quality: number;
  if (typeof body.quality === 'number') {
    quality = body.quality;
  } else if (typeof body.correct === 'boolean') {
    quality = qualityFromCorrect(body.correct);
  } else {
    res.status(400).json({ error: 'quality (0-5) or correct (boolean) is required' });
    return;
  }

  const existing = await prisma.reviewSchedule.findUnique({
    where: {
      userId_itemType_itemId: {
        userId: req.auth.sub,
        itemType,
        itemId,
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

  const next = applySm2(prev, quality);
  const now = new Date();

  const schedule = await prisma.reviewSchedule.upsert({
    where: {
      userId_itemType_itemId: {
        userId: req.auth.sub,
        itemType,
        itemId,
      },
    },
    create: {
      userId: req.auth.sub,
      itemType,
      itemId,
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

  res.json({
    itemType,
    itemId,
    quality,
    dueAt: schedule.dueAt.toISOString(),
    easiness: schedule.easiness,
    intervalDays: schedule.intervalDays,
    repetitions: schedule.repetitions,
  });
}
