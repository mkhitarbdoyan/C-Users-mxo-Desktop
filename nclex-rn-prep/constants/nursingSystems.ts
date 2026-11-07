import type { NursingSystem } from '@/types';

export const NURSING_SYSTEMS: NursingSystem[] = [
  'med-surg',
  'pharmacology',
  'maternity',
  'psychiatric',
  'fundamentals',
];

export const NURSING_SYSTEM_LABELS: Record<NursingSystem, string> = {
  'med-surg': 'Med-Surg',
  pharmacology: 'Pharmacology',
  maternity: 'Maternity',
  psychiatric: 'Psychiatric',
  fundamentals: 'Fundamentals',
};
