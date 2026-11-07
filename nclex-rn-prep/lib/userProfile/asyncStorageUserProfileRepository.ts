import AsyncStorage from '@react-native-async-storage/async-storage';

import { NURSING_SYSTEMS } from '@/constants/nursingSystems';
import type { UserProfileRepository } from '@/lib/userProfile/UserProfileRepository';
import type { NursingSystem, UserProfile, UserProfileInput } from '@/types';

const KEY_PREFIX = '@nclex_rn_prep/user_profile_v1:';

function storageKey(userId: string): string {
  return `${KEY_PREFIX}${userId}`;
}

function normalizeCategories(value: unknown): NursingSystem[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set<string>(NURSING_SYSTEMS);
  return value.filter((item): item is NursingSystem => typeof item === 'string' && allowed.has(item));
}

function normalizeProfile(raw: unknown): UserProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name) return null;

  return {
    name,
    email: typeof data.email === 'string' && data.email.trim() ? data.email.trim() : null,
    studyGoal:
      typeof data.studyGoal === 'string' && data.studyGoal.trim() ? data.studyGoal.trim() : null,
    preferredCategories: normalizeCategories(data.preferredCategories),
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
  };
}

export function createAsyncStorageUserProfileRepository(): UserProfileRepository {
  return {
    async get(userId: string) {
      if (!userId) return null;
      try {
        const raw = await AsyncStorage.getItem(storageKey(userId));
        if (!raw) return null;
        return normalizeProfile(JSON.parse(raw));
      } catch {
        return null;
      }
    },

    async save(userId: string, input: UserProfileInput) {
      if (!userId) {
        throw new Error('userId is required');
      }
      const name = input.name.trim();
      if (!name) {
        throw new Error('Name is required');
      }

      const profile: UserProfile = {
        name,
        email: input.email?.trim() ? input.email.trim() : null,
        studyGoal: input.studyGoal?.trim() ? input.studyGoal.trim() : null,
        preferredCategories: normalizeCategories(input.preferredCategories),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(storageKey(userId), JSON.stringify(profile));
      return profile;
    },

    async clear(userId: string) {
      if (!userId) return;
      await AsyncStorage.removeItem(storageKey(userId));
    },
  };
}
