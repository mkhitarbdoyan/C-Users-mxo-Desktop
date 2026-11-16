import type { Difficulty, NursingSystem, ReviewItemType, TopicCategory } from '@prisma/client';

import { toApiTopicCategory, type ApiTopicCategory } from './topics';

/** API / Expo nursing system strings. */
export type ApiNursingSystem =
  | 'med-surg'
  | 'pharmacology'
  | 'maternity'
  | 'psychiatric'
  | 'fundamentals';

export type ApiDifficulty = 'easy' | 'medium' | 'hard';
export type { ApiTopicCategory };

const SYSTEM_TO_DB: Record<ApiNursingSystem, NursingSystem> = {
  'med-surg': 'med_surg',
  pharmacology: 'pharmacology',
  maternity: 'maternity',
  psychiatric: 'psychiatric',
  fundamentals: 'fundamentals',
};

const SYSTEM_TO_API: Record<NursingSystem, ApiNursingSystem> = {
  med_surg: 'med-surg',
  pharmacology: 'pharmacology',
  maternity: 'maternity',
  psychiatric: 'psychiatric',
  fundamentals: 'fundamentals',
};

export function toDbSystem(value: string): NursingSystem | null {
  return SYSTEM_TO_DB[value as ApiNursingSystem] ?? null;
}

export function toApiSystem(value: NursingSystem): ApiNursingSystem {
  return SYSTEM_TO_API[value];
}

export function toDbDifficulty(value: string): Difficulty | null {
  if (value === 'easy' || value === 'medium' || value === 'hard') return value;
  return null;
}

export function toApiDifficulty(value: Difficulty): ApiDifficulty {
  return value;
}

export function toDbItemType(value: string): ReviewItemType | null {
  if (value === 'question' || value === 'flashcard') return value;
  return null;
}

export function mapQuestion(row: {
  id: string;
  system: NursingSystem;
  category?: TopicCategory;
  stem: string;
  choices: unknown;
  correctIndex: number;
  rationale: string;
  imageUrl?: string | null;
  difficulty: Difficulty;
}) {
  const choices = Array.isArray(row.choices) ? (row.choices as string[]) : [];
  return {
    id: row.id,
    system: toApiSystem(row.system),
    category: row.category ? toApiTopicCategory(row.category) : null,
    stem: row.stem,
    choices: choices as [string, string, string, string],
    correctIndex: row.correctIndex as 0 | 1 | 2 | 3,
    rationale: row.rationale,
    imageUrl: row.imageUrl ?? null,
    difficulty: toApiDifficulty(row.difficulty),
  };
}

export function mapFlashcard(row: {
  id: string;
  system: NursingSystem;
  front: string;
  back: string;
  difficulty: Difficulty;
}) {
  return {
    id: row.id,
    system: toApiSystem(row.system),
    front: row.front,
    back: row.back,
    difficulty: toApiDifficulty(row.difficulty),
  };
}
