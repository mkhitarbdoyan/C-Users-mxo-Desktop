import { apiRequest } from '@/lib/api/client';
import type { Difficulty, Question, TopicCategory } from '@/types';

export type CategoryListItem = {
  id: TopicCategory;
  label: string;
  blurb: string;
  questionCount: number;
};

export type CategoriesResponse = {
  items: CategoryListItem[];
  difficulties: Array<{ id: Difficulty; label: string }>;
  systems: Array<{ id: string; label: string }>;
};

export type QuestionListResponse = {
  items: Question[];
  count: number;
};

export function listCategories() {
  return apiRequest<CategoriesResponse>('/api/categories', { skipAuth: true });
}

export function getCategory(id: TopicCategory) {
  return apiRequest<CategoryListItem & { difficulties: Array<{ id: Difficulty; count: number }> }>(
    `/api/categories/${id}`,
    { skipAuth: true }
  );
}

export function listQuestions(filters?: {
  categories?: TopicCategory[];
  difficulties?: Difficulty[];
  systems?: string[];
}) {
  const params = new URLSearchParams();
  if (filters?.categories?.length) params.set('categories', filters.categories.join(','));
  if (filters?.difficulties?.length) params.set('difficulties', filters.difficulties.join(','));
  if (filters?.systems?.length) params.set('systems', filters.systems.join(','));
  const qs = params.toString();
  return apiRequest<QuestionListResponse>(`/api/questions${qs ? `?${qs}` : ''}`, {
    skipAuth: true,
  });
}
