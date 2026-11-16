import type { Prisma } from '@prisma/client';

import { toDbDifficulty, toDbSystem } from './mappers';
import { toDbTopicCategory } from './topics';

function collectQueryValues(query: Record<string, unknown>, keys: string[]): string[] {
  const out: string[] = [];
  for (const key of keys) {
    const raw = query[key];
    if (typeof raw === 'string') {
      out.push(...raw.split(',').map((s) => s.trim()).filter(Boolean));
    } else if (Array.isArray(raw)) {
      for (const item of raw) {
        if (typeof item === 'string') {
          out.push(...item.split(',').map((s) => s.trim()).filter(Boolean));
        }
      }
    }
  }
  return [...new Set(out)];
}

export type ContentFilterResult = {
  where: Prisma.QuestionWhereInput;
  error?: string;
};

/**
 * Parse topic category, nursing system, and difficulty filters from query or body.
 * Accepts singular or plural keys and comma-separated lists.
 */
export function parseContentFilters(
  source: Record<string, unknown> | undefined | null
): ContentFilterResult {
  const where: Prisma.QuestionWhereInput = {};
  if (!source) return { where };

  const categories = collectQueryValues(source, ['category', 'categories', 'topic', 'topics']);
  const systems = collectQueryValues(source, ['system', 'systems']);
  const difficulties = collectQueryValues(source, ['difficulty', 'difficulties']);

  if (categories.length > 0) {
    const mapped = categories.map(toDbTopicCategory);
    if (mapped.some((v) => v === null)) {
      return { where, error: 'Invalid category filter' };
    }
    const values = mapped as NonNullable<(typeof mapped)[number]>[];
    where.category = values.length === 1 ? values[0] : { in: values };
  }

  if (systems.length > 0) {
    const mapped = systems.map(toDbSystem);
    if (mapped.some((v) => v === null)) {
      return { where, error: 'Invalid system filter' };
    }
    const values = mapped as NonNullable<(typeof mapped)[number]>[];
    where.system = values.length === 1 ? values[0] : { in: values };
  }

  if (difficulties.length > 0) {
    const mapped = difficulties.map(toDbDifficulty);
    if (mapped.some((v) => v === null)) {
      return { where, error: 'Invalid difficulty filter' };
    }
    const values = mapped as NonNullable<(typeof mapped)[number]>[];
    where.difficulty = values.length === 1 ? values[0] : { in: values };
  }

  return { where };
}

/** Flashcards do not have topic categories — system + difficulty only. */
export function parseFlashcardFilters(
  source: Record<string, unknown> | undefined | null
): { where: Prisma.FlashcardWhereInput; error?: string } {
  const where: Prisma.FlashcardWhereInput = {};
  if (!source) return { where };

  const systems = collectQueryValues(source, ['system', 'systems', 'category', 'categories']);
  const difficulties = collectQueryValues(source, ['difficulty', 'difficulties']);

  if (systems.length > 0) {
    const mapped = systems.map(toDbSystem);
    if (mapped.some((v) => v === null)) {
      return { where, error: 'Invalid system/category filter' };
    }
    const values = mapped as NonNullable<(typeof mapped)[number]>[];
    where.system = values.length === 1 ? values[0] : { in: values };
  }

  if (difficulties.length > 0) {
    const mapped = difficulties.map(toDbDifficulty);
    if (mapped.some((v) => v === null)) {
      return { where, error: 'Invalid difficulty filter' };
    }
    const values = mapped as NonNullable<(typeof mapped)[number]>[];
    where.difficulty = values.length === 1 ? values[0] : { in: values };
  }

  return { where };
}
