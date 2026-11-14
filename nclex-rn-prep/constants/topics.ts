import type { Difficulty, TopicCategory } from '@/types';

export const TOPIC_CATEGORIES: TopicCategory[] = [
  'cardiac',
  'respiratory',
  'neuro',
  'pharmacology',
  'maternity',
  'psychiatric',
  'fundamentals',
  'endocrine',
];

export const TOPIC_CATEGORY_LABELS: Record<TopicCategory, string> = {
  cardiac: 'Cardiac',
  respiratory: 'Respiratory',
  neuro: 'Neuro',
  pharmacology: 'Pharmacology',
  maternity: 'Maternity',
  psychiatric: 'Psychiatric',
  fundamentals: 'Fundamentals',
  endocrine: 'Endocrine',
};

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
