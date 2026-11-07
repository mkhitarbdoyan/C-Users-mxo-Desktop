import type { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';

import { mapFlashcard, mapQuestion, toDbDifficulty, toDbSystem } from '../lib/mappers';
import { prisma } from '../lib/prisma';

function contentFilters(query: Request['query']): {
  where: Prisma.QuestionWhereInput & Prisma.FlashcardWhereInput;
  error?: string;
} {
  const where: Prisma.QuestionWhereInput & Prisma.FlashcardWhereInput = {};
  const system = typeof query.system === 'string' ? query.system : typeof query.category === 'string' ? query.category : null;
  const difficulty = typeof query.difficulty === 'string' ? query.difficulty : null;

  if (system) {
    const dbSystem = toDbSystem(system);
    if (!dbSystem) return { where, error: 'Invalid system/category filter' };
    where.system = dbSystem;
  }
  if (difficulty) {
    const dbDifficulty = toDbDifficulty(difficulty);
    if (!dbDifficulty) return { where, error: 'Invalid difficulty filter' };
    where.difficulty = dbDifficulty;
  }
  return { where };
}

export async function listQuestions(req: Request, res: Response): Promise<void> {
  const { where, error } = contentFilters(req.query);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  const rows = await prisma.question.findMany({ where, orderBy: { id: 'asc' } });
  res.json({ items: rows.map(mapQuestion), count: rows.length });
}

export async function getQuestion(req: Request, res: Response): Promise<void> {
  const row = await prisma.question.findUnique({ where: { id: req.params.id } });
  if (!row) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json(mapQuestion(row));
}

export async function listFlashcards(req: Request, res: Response): Promise<void> {
  const { where, error } = contentFilters(req.query);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  const rows = await prisma.flashcard.findMany({ where, orderBy: { id: 'asc' } });
  res.json({ items: rows.map(mapFlashcard), count: rows.length });
}

export async function getFlashcard(req: Request, res: Response): Promise<void> {
  const row = await prisma.flashcard.findUnique({ where: { id: req.params.id } });
  if (!row) {
    res.status(404).json({ error: 'Flashcard not found' });
    return;
  }
  res.json(mapFlashcard(row));
}
