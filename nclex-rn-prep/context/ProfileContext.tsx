import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import { userProfileRepository } from '@/lib/userProfile';
import type { UserProfile, UserProfileInput } from '@/types';

type ProfileContextValue = {
  ready: boolean;
  profile: UserProfile | null;
  saveProfile: (input: UserProfileInput) => Promise<UserProfile>;
  clearProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { session, ready: authReady } = useAuth();
  const userId = session?.user.id ?? null;

  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setReady(true);
      return;
    }
    const loaded = await userProfileRepository.get(userId);
    setProfile(loaded);
    setReady(true);
  }, [userId]);

  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;
    setReady(false);
    (async () => {
      await refreshProfile();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [authReady, refreshProfile]);

  const saveProfile = useCallback(
    async (input: UserProfileInput) => {
      if (!userId) {
        throw new Error('Sign in to save a profile');
      }
      const saved = await userProfileRepository.save(userId, input);
      setProfile(saved);
      return saved;
    },
    [userId]
  );

  const clearProfile = useCallback(async () => {
    if (!userId) return;
    await userProfileRepository.clear(userId);
    setProfile(null);
  }, [userId]);

  const value = useMemo(
    () => ({
      ready,
      profile,
      saveProfile,
      clearProfile,
      refreshProfile,
    }),
    [ready, profile, saveProfile, clearProfile, refreshProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return ctx;
}
