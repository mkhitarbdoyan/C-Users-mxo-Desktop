import type { Request } from 'express';

import type { ApiNursingSystem } from '../lib/mappers';

export type UserPublic = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  studyGoal: string | null;
  preferredCategories: ApiNursingSystem[];
  updatedAt: string;
  provider: 'email' | 'google';
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type UpdateMeBody = {
  name?: string;
  email?: string | null;
  studyGoal?: string | null;
  preferredCategories?: ApiNursingSystem[];
};

export type AuthSuccessResponse = {
  token: string;
  user: UserPublic;
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};
