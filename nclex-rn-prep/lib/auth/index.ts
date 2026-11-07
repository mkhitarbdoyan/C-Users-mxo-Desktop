import { createAsyncStorageAuthRepository } from '@/lib/auth/asyncStorageAuthRepository';
import type { AuthRepository } from '@/lib/auth/AuthRepository';

export type { AuthRepository } from '@/lib/auth/AuthRepository';

/**
 * Active auth repository.
 * Swap for an API / real Google OAuth implementation when ready.
 */
export function createAuthRepository(): AuthRepository {
  return createAsyncStorageAuthRepository();
}

export const authRepository: AuthRepository = createAuthRepository();
