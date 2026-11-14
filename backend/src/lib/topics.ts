import type { TopicCategory } from '@prisma/client';

export type ApiTopicCategory =
  | 'cardiac'
  | 'respiratory'
  | 'neuro'
  | 'pharmacology'
  | 'maternity'
  | 'psychiatric'
  | 'fundamentals'
  | 'endocrine';

export const TOPIC_CATEGORIES: ApiTopicCategory[] = [
  'cardiac',
  'respiratory',
  'neuro',
  'pharmacology',
  'maternity',
  'psychiatric',
  'fundamentals',
  'endocrine',
];

export const TOPIC_CATEGORY_LABELS: Record<ApiTopicCategory, string> = {
  cardiac: 'Cardiac',
  respiratory: 'Respiratory',
  neuro: 'Neuro',
  pharmacology: 'Pharmacology',
  maternity: 'Maternity',
  psychiatric: 'Psychiatric',
  fundamentals: 'Fundamentals',
  endocrine: 'Endocrine',
};

export const TOPIC_CATEGORY_BLURBS: Record<ApiTopicCategory, string> = {
  cardiac: 'Heart failure, ACS, dysrhythmias, and perfusion priorities.',
  respiratory: 'Airway, oxygenation, PE, and acute breathing emergencies.',
  neuro: 'Stroke, ICP, seizures, and neurologic assessment cues.',
  pharmacology: 'High-alert meds, adverse effects, and safe administration.',
  maternity: 'Antepartum, intrapartum, and postpartum safety checks.',
  psychiatric: 'Mood, psychosis, safety, and therapeutic communication.',
  fundamentals: 'Infection control, injections, and core nursing skills.',
  endocrine: 'Diabetes, thyroid, and hormone-related emergencies.',
};

export function toDbTopicCategory(value: string): TopicCategory | null {
  return TOPIC_CATEGORIES.includes(value as ApiTopicCategory)
    ? (value as TopicCategory)
    : null;
}

export function toApiTopicCategory(value: TopicCategory): ApiTopicCategory {
  return value as ApiTopicCategory;
}
