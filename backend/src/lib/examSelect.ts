import type { Difficulty, NursingSystem, Question } from '@prisma/client';

/**
 * Pick a balanced exam set: rotate systems and mix difficulties to resemble
 * a short NCLEX-style distribution.
 */
export function selectExamQuestions(all: Question[], count: number): Question[] {
  if (all.length === 0) return [];
  const target = Math.min(Math.max(1, count), all.length);

  const bySystem = new Map<NursingSystem, Question[]>();
  for (const q of all) {
    const list = bySystem.get(q.system) ?? [];
    list.push(q);
    bySystem.set(q.system, list);
  }

  const systems = [...bySystem.keys()];
  // Shuffle each system bucket (Fisher–Yates).
  for (const system of systems) {
    const bucket = bySystem.get(system)!;
    for (let i = bucket.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
    }
  }

  const difficultyRank: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
  const picked: Question[] = [];
  const used = new Set<string>();
  let systemCursor = 0;

  while (picked.length < target) {
    let added = false;
    for (let pass = 0; pass < systems.length && picked.length < target; pass += 1) {
      const system = systems[(systemCursor + pass) % systems.length];
      const bucket = bySystem.get(system) ?? [];
      const next = bucket.find((q) => !used.has(q.id));
      if (!next) continue;
      used.add(next.id);
      picked.push(next);
      added = true;
    }
    systemCursor = (systemCursor + 1) % Math.max(systems.length, 1);
    if (!added) break;
  }

  // Soft difficulty mix: prefer not to clump all hard at the end.
  picked.sort((a, b) => {
    const da = difficultyRank[a.difficulty];
    const db = difficultyRank[b.difficulty];
    if (da !== db) return da - db;
    return a.id.localeCompare(b.id);
  });

  // Re-interleave after difficulty sort so systems stay mixed.
  const easy = picked.filter((q) => q.difficulty === 'easy');
  const medium = picked.filter((q) => q.difficulty === 'medium');
  const hard = picked.filter((q) => q.difficulty === 'hard');
  const interleaved: Question[] = [];
  const maxLen = Math.max(easy.length, medium.length, hard.length);
  for (let i = 0; i < maxLen; i += 1) {
    if (medium[i]) interleaved.push(medium[i]);
    if (easy[i]) interleaved.push(easy[i]);
    if (hard[i]) interleaved.push(hard[i]);
  }

  return interleaved.slice(0, target);
}
