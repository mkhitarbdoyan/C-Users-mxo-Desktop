import type { UserProfile, UserProfileInput } from '@/types';

/**
 * Storage seam for user profile data (scoped by auth user id).
 * Swap the AsyncStorage implementation for an API-backed one later
 * without changing Profile UI or ProfileContext.
 */
export interface UserProfileRepository {
  get(userId: string): Promise<UserProfile | null>;
  save(userId: string, input: UserProfileInput): Promise<UserProfile>;
  clear(userId: string): Promise<void>;
}
