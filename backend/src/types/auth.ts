import type { Request } from 'express';

/** Public user shape returned by auth/user endpoints (no password). */
export type UserPublic = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
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

export type AuthSuccessResponse = {
  token: string;
  user: UserPublic;
};

/** JWT payload attached after auth middleware runs. */
export type AuthTokenPayload = {
  sub: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};
