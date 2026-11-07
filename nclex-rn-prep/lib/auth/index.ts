import { createApiAuthRepository } from '@/lib/auth/apiAuthRepository';
import type { AuthRepository } from '@/lib/auth/AuthRepository';

export type { AuthRepository } from '@/lib/auth/AuthRepository';

/** Active auth repository — Express backend (JWT). */
export function createAuthRepository(): AuthRepository {
  return createApiAuthRepository();
}

export const authRepository: AuthRepository = createAuthRepository();
