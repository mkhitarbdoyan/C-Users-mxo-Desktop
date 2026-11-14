import { apiRequest } from '@/lib/api/client';
import type { Question } from '@/types';

export type ExamItemView = {
  orderIndex: number;
  questionId: string;
  selectedIndex: number | null;
  flagged: boolean;
  answeredAt: string | null;
  aiExplanation: string | null;
  question: Question & { difficulty?: string; imageUrl?: string | null };
};

export type ExamSessionView = {
  id: string;
  status: string;
  questionCount: number;
  durationSec: number;
  startedAt: string;
  endsAt: string;
  submittedAt: string | null;
  remainingSec: number;
  scoreCorrect: number | null;
  scoreTotal: number | null;
  items: ExamItemView[];
  review: { unanswered: string[]; flagged: string[] };
};

export type ExamReport = {
  examId: string;
  status: string;
  submittedAt: string;
  scoreCorrect: number;
  scoreTotal: number;
  percent: number;
  unansweredCount: number;
  flaggedCount: number;
  bySystem: Record<string, { correct: number; total: number }>;
  items: Array<
    ExamItemView & {
      correctIndex: number;
      correct: boolean;
    }
  >;
};

export function startExam(input?: {
  questionCount?: number;
  durationMinutes?: number;
  categories?: string[];
  systems?: string[];
  difficulties?: string[];
}) {
  return apiRequest<ExamSessionView>('/api/exams/start', {
    method: 'POST',
    body: input ?? {},
  });
}

export function getExam(examId: string) {
  return apiRequest<ExamSessionView>(`/api/exams/${examId}`);
}

export function submitExamAnswer(
  examId: string,
  body: { questionId: string; selectedIndex: number; flagged?: boolean }
) {
  return apiRequest<{ questionId: string; selectedIndex: number; flagged: boolean }>(
    `/api/exams/${examId}/answers`,
    { method: 'POST', body }
  );
}

export function setExamFlag(examId: string, body: { questionId: string; flagged: boolean }) {
  return apiRequest<{ questionId: string; flagged: boolean }>(`/api/exams/${examId}/flag`, {
    method: 'POST',
    body,
  });
}

export function explainExamAnswer(examId: string, questionId: string) {
  return apiRequest<{
    questionId: string;
    explanation: string;
    source: string;
    imageUrl: string | null;
  }>(`/api/exams/${examId}/explain`, { method: 'POST', body: { questionId } });
}

export function endExam(examId: string) {
  return apiRequest<ExamReport>(`/api/exams/${examId}/end`, { method: 'POST', body: {} });
}
