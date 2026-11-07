import type { Response } from 'express';

import { selectExamQuestions } from '../lib/examSelect';
import { explainExamAnswer } from '../lib/gemini';
import { mapQuestion } from '../lib/mappers';
import { prisma } from '../lib/prisma';
import type { AuthenticatedRequest } from '../types/auth';

const DEFAULT_QUESTION_COUNT = 10;
const DEFAULT_DURATION_MIN = 20;
const MAX_QUESTION_COUNT = 75;
const MAX_DURATION_MIN = 180;

function remainingSec(endsAt: Date, now = new Date()): number {
  return Math.max(0, Math.floor((endsAt.getTime() - now.getTime()) / 1000));
}

async function loadExamOr404(examId: string, userId: string) {
  return prisma.examSession.findFirst({
    where: { id: examId, userId },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
        include: { question: true },
      },
    },
  });
}

/** Live exam payloads must not leak the key or authored rationale. */
function mapQuestionForExam(
  question: Parameters<typeof mapQuestion>[0],
  includeAnswerKey: boolean
) {
  const full = mapQuestion(question);
  if (includeAnswerKey) return full;
  const { correctIndex: _correctIndex, rationale: _rationale, ...blind } = full;
  return blind;
}

function serializeExam(
  exam: NonNullable<Awaited<ReturnType<typeof loadExamOr404>>>,
  opts?: { includeAnswerKey?: boolean }
) {
  const now = new Date();
  const expired = exam.status === 'in_progress' && now > exam.endsAt;
  const includeAnswerKey = Boolean(opts?.includeAnswerKey);
  return {
    id: exam.id,
    status: expired ? 'expired' : exam.status,
    questionCount: exam.questionCount,
    durationSec: exam.durationSec,
    startedAt: exam.startedAt.toISOString(),
    endsAt: exam.endsAt.toISOString(),
    submittedAt: exam.submittedAt?.toISOString() ?? null,
    remainingSec: exam.status === 'in_progress' ? remainingSec(exam.endsAt, now) : 0,
    scoreCorrect: includeAnswerKey ? exam.scoreCorrect : null,
    scoreTotal: includeAnswerKey ? exam.scoreTotal : null,
    items: exam.items.map((item) => ({
      orderIndex: item.orderIndex,
      questionId: item.questionId,
      selectedIndex: item.selectedIndex,
      flagged: item.flagged,
      answeredAt: item.answeredAt?.toISOString() ?? null,
      correct: includeAnswerKey ? item.correct : undefined,
      aiExplanation: item.aiExplanation,
      question: mapQuestionForExam(item.question, includeAnswerKey),
    })),
    review: {
      unanswered: exam.items.filter((i) => i.selectedIndex === null).map((i) => i.questionId),
      flagged: exam.items.filter((i) => i.flagged).map((i) => i.questionId),
    },
  };
}

export async function startExam(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const body = (req.body ?? {}) as { questionCount?: number; durationMinutes?: number };
  const questionCount = Math.min(
    MAX_QUESTION_COUNT,
    Math.max(1, Number(body.questionCount) || DEFAULT_QUESTION_COUNT)
  );
  const durationMinutes = Math.min(
    MAX_DURATION_MIN,
    Math.max(1, Number(body.durationMinutes) || DEFAULT_DURATION_MIN)
  );
  const durationSec = durationMinutes * 60;

  const pool = await prisma.question.findMany();
  if (pool.length === 0) {
    res.status(503).json({ error: 'Question bank is empty — run db:seed' });
    return;
  }

  const selected = selectExamQuestions(pool, questionCount);
  const now = new Date();
  const endsAt = new Date(now.getTime() + durationSec * 1000);

  const exam = await prisma.examSession.create({
    data: {
      userId: req.auth.sub,
      questionCount: selected.length,
      durationSec,
      startedAt: now,
      endsAt,
      items: {
        create: selected.map((q, orderIndex) => ({
          questionId: q.id,
          orderIndex,
        })),
      },
    },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
        include: { question: true },
      },
    },
  });

  res.status(201).json(serializeExam(exam, { includeAnswerKey: false }));
}

export async function getExam(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const exam = await loadExamOr404(req.params.id, req.auth.sub);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }
  // Answer key only after the exam has been ended (submittedAt set by /end).
  res.json(serializeExam(exam, { includeAnswerKey: exam.submittedAt != null }));
}

export async function submitAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const exam = await loadExamOr404(req.params.id, req.auth.sub);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }
  if (exam.status !== 'in_progress') {
    res.status(409).json({ error: 'Exam is not in progress' });
    return;
  }
  if (new Date() > exam.endsAt) {
    await prisma.examSession.update({
      where: { id: exam.id },
      data: { status: 'expired' },
    });
    res.status(409).json({ error: 'Exam time has expired' });
    return;
  }

  const body = (req.body ?? {}) as {
    questionId?: string;
    selectedIndex?: number;
    flagged?: boolean;
  };
  if (!body.questionId || typeof body.selectedIndex !== 'number') {
    res.status(400).json({ error: 'questionId and selectedIndex are required' });
    return;
  }
  if (body.selectedIndex < 0 || body.selectedIndex > 3) {
    res.status(400).json({ error: 'selectedIndex must be 0–3' });
    return;
  }

  const item = exam.items.find((i) => i.questionId === body.questionId);
  if (!item) {
    res.status(404).json({ error: 'Question is not part of this exam' });
    return;
  }

  const correct = body.selectedIndex === item.question.correctIndex;
  const updated = await prisma.examItem.update({
    where: { id: item.id },
    data: {
      selectedIndex: body.selectedIndex,
      answeredAt: new Date(),
      correct,
      flagged: typeof body.flagged === 'boolean' ? body.flagged : item.flagged,
    },
    include: { question: true },
  });

  res.json({
    questionId: updated.questionId,
    selectedIndex: updated.selectedIndex,
    flagged: updated.flagged,
    answeredAt: updated.answeredAt?.toISOString() ?? null,
    // Do not reveal correctness until exam end — NCLEX-style.
  });
}

export async function setFlag(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const exam = await loadExamOr404(req.params.id, req.auth.sub);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }
  if (exam.status !== 'in_progress') {
    res.status(409).json({ error: 'Exam is not in progress' });
    return;
  }

  const body = (req.body ?? {}) as { questionId?: string; flagged?: boolean };
  if (!body.questionId || typeof body.flagged !== 'boolean') {
    res.status(400).json({ error: 'questionId and flagged are required' });
    return;
  }
  const item = exam.items.find((i) => i.questionId === body.questionId);
  if (!item) {
    res.status(404).json({ error: 'Question is not part of this exam' });
    return;
  }

  const updated = await prisma.examItem.update({
    where: { id: item.id },
    data: { flagged: body.flagged },
  });
  res.json({ questionId: updated.questionId, flagged: updated.flagged });
}

export async function explainAnswer(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const exam = await loadExamOr404(req.params.id, req.auth.sub);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }

  const body = (req.body ?? {}) as { questionId?: string };
  if (!body.questionId) {
    res.status(400).json({ error: 'questionId is required' });
    return;
  }
  const item = exam.items.find((i) => i.questionId === body.questionId);
  if (!item) {
    res.status(404).json({ error: 'Question is not part of this exam' });
    return;
  }
  if (item.selectedIndex === null || item.selectedIndex === undefined) {
    res.status(400).json({ error: 'Answer the question before requesting an explanation' });
    return;
  }

  if (item.aiExplanation) {
    res.json({
      questionId: item.questionId,
      explanation: item.aiExplanation,
      source: 'cached',
    });
    return;
  }

  const choices = Array.isArray(item.question.choices)
    ? (item.question.choices as string[])
    : [];
  const { explanation, source } = await explainExamAnswer({
    stem: item.question.stem,
    choices,
    correctIndex: item.question.correctIndex,
    selectedIndex: item.selectedIndex,
    rationale: item.question.rationale,
    // Mid-exam: teach the concept without naming the correct option letter.
    revealAnswerKey: false,
  });

  await prisma.examItem.update({
    where: { id: item.id },
    data: { aiExplanation: explanation },
  });

  res.json({ questionId: item.questionId, explanation, source });
}

export async function endExam(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const exam = await loadExamOr404(req.params.id, req.auth.sub);
  if (!exam) {
    res.status(404).json({ error: 'Exam not found' });
    return;
  }
  if (exam.status === 'submitted') {
    res.json(buildReport(exam));
    return;
  }

  const scoreTotal = exam.items.length;
  const scoreCorrect = exam.items.filter(
    (i) => i.selectedIndex !== null && i.selectedIndex === i.question.correctIndex
  ).length;

  // Persist correctness for any answered items missing the flag.
  await Promise.all(
    exam.items.map((item) => {
      if (item.selectedIndex === null || item.selectedIndex === undefined) {
        return prisma.examItem.update({
          where: { id: item.id },
          data: { correct: false },
        });
      }
      return prisma.examItem.update({
        where: { id: item.id },
        data: { correct: item.selectedIndex === item.question.correctIndex },
      });
    })
  );

  const updated = await prisma.examSession.update({
    where: { id: exam.id },
    data: {
      status: new Date() > exam.endsAt ? 'expired' : 'submitted',
      submittedAt: new Date(),
      scoreCorrect,
      scoreTotal,
    },
    include: {
      items: {
        orderBy: { orderIndex: 'asc' },
        include: { question: true },
      },
    },
  });

  res.json(buildReport(updated));
}

function buildReport(
  exam: NonNullable<Awaited<ReturnType<typeof loadExamOr404>>>
) {
  const scoreTotal = exam.scoreTotal ?? exam.items.length;
  const scoreCorrect =
    exam.scoreCorrect ??
    exam.items.filter(
      (i) => i.selectedIndex !== null && i.selectedIndex === i.question.correctIndex
    ).length;
  const percent = scoreTotal === 0 ? 0 : Math.round((scoreCorrect / scoreTotal) * 100);

  const bySystem: Record<string, { correct: number; total: number }> = {};
  for (const item of exam.items) {
    const system = mapQuestion(item.question).system;
    const bucket = bySystem[system] ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (item.selectedIndex === item.question.correctIndex) bucket.correct += 1;
    bySystem[system] = bucket;
  }

  return {
    examId: exam.id,
    status: exam.status,
    submittedAt: exam.submittedAt?.toISOString() ?? new Date().toISOString(),
    scoreCorrect,
    scoreTotal,
    percent,
    unansweredCount: exam.items.filter((i) => i.selectedIndex === null).length,
    flaggedCount: exam.items.filter((i) => i.flagged).length,
    bySystem,
    items: exam.items.map((item) => ({
      orderIndex: item.orderIndex,
      questionId: item.questionId,
      selectedIndex: item.selectedIndex,
      correctIndex: item.question.correctIndex,
      correct: item.selectedIndex === item.question.correctIndex,
      flagged: item.flagged,
      aiExplanation: item.aiExplanation,
      question: mapQuestion(item.question),
    })),
  };
}
