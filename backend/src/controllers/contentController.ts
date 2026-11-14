import type { Request, Response } from 'express';

import { parseContentFilters, parseFlashcardFilters } from '../lib/contentFilters';
import { mapFlashcard, mapQuestion, toApiDifficulty } from '../lib/mappers';
import { prisma } from '../lib/prisma';
import {
  TOPIC_CATEGORIES,
  TOPIC_CATEGORY_BLURBS,
  TOPIC_CATEGORY_LABELS,
  toApiTopicCategory,
  toDbTopicCategory,
} from '../lib/topics';

export async function listCategories(_req: Request, res: Response): Promise<void> {
  const grouped = await prisma.question.groupBy({
    by: ['category'],
    _count: { _all: true },
  });
  const countByCategory = new Map(
    grouped.map((row) => [toApiTopicCategory(row.category), row._count._all])
  );

  res.json({
    items: TOPIC_CATEGORIES.map((id) => ({
      id,
      label: TOPIC_CATEGORY_LABELS[id],
      blurb: TOPIC_CATEGORY_BLURBS[id],
      questionCount: countByCategory.get(id) ?? 0,
    })),
    difficulties: [
      { id: 'easy', label: 'Easy' },
      { id: 'medium', label: 'Medium' },
      { id: 'hard', label: 'Hard' },
    ],
    systems: [
      { id: 'med-surg', label: 'Med-Surg' },
      { id: 'pharmacology', label: 'Pharmacology' },
      { id: 'maternity', label: 'Maternity' },
      { id: 'psychiatric', label: 'Psychiatric' },
      { id: 'fundamentals', label: 'Fundamentals' },
    ],
  });
}

export async function getCategory(req: Request, res: Response): Promise<void> {
  const id = toDbTopicCategory(req.params.id);
  if (!id) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  const apiId = toApiTopicCategory(id);
  const questionCount = await prisma.question.count({ where: { category: id } });
  const difficulties = await prisma.question.groupBy({
    by: ['difficulty'],
    where: { category: id },
    _count: { _all: true },
  });

  res.json({
    id: apiId,
    label: TOPIC_CATEGORY_LABELS[apiId],
    blurb: TOPIC_CATEGORY_BLURBS[apiId],
    questionCount,
    difficulties: difficulties.map((row) => ({
      id: toApiDifficulty(row.difficulty),
      count: row._count._all,
    })),
  });
}

export async function listQuestions(req: Request, res: Response): Promise<void> {
  const { where, error } = parseContentFilters(req.query as Record<string, unknown>);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  const rows = await prisma.question.findMany({ where, orderBy: { id: 'asc' } });
  res.json({
    items: rows.map(mapQuestion),
    count: rows.length,
    filters: {
      category: req.query.category ?? req.query.categories ?? null,
      system: req.query.system ?? req.query.systems ?? null,
      difficulty: req.query.difficulty ?? req.query.difficulties ?? null,
    },
  });
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
  const { where, error } = parseFlashcardFilters(req.query as Record<string, unknown>);
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

/** Nursing-system labels for clients that still filter by system. */
export function listSystems(_req: Request, res: Response): void {
  res.json({
    items: [
      { id: 'med-surg', label: 'Med-Surg' },
      { id: 'pharmacology', label: 'Pharmacology' },
      { id: 'maternity', label: 'Maternity' },
      { id: 'psychiatric', label: 'Psychiatric' },
      { id: 'fundamentals', label: 'Fundamentals' },
    ],
  });
}
