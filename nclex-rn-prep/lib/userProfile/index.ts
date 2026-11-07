import { createAsyncStorageUserProfileRepository } from '@/lib/userProfile/asyncStorageUserProfileRepository';
import type { UserProfileRepository } from '@/lib/userProfile/UserProfileRepository';

export type { UserProfileRepository } from '@/lib/userProfile/UserProfileRepository';

/**
 * Active profile repository for the app.
 * Replace this factory return with an API-backed implementation when a backend exists.
 */
export function createUserProfileRepository(): UserProfileRepository {
  return createAsyncStorageUserProfileRepository();
}

/** Shared singleton used by ProfileProvider / AuthProvider. */
export const userProfileRepository: UserProfileRepository = createUserProfileRepository();
