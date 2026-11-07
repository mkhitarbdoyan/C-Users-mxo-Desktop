import type { UserPublic } from '../types/auth';

/**
 * In-memory user shape used by stubs.
 * Replace with a real DB model / ORM entity later.
 */
export type UserRecord = {
  id: string;
  email: string;
  name: string;
  /** Hashed password — never return this from API handlers. */
  passwordHash: string;
  createdAt: string;
};

/** Convert a stored user into the public API shape. */
export function toPublicUser(user: UserRecord): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

/**
 * Placeholder store — no database yet.
 * Controllers should treat this as temporary scaffolding.
 */
export const usersById = new Map<string, UserRecord>();
