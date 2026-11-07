import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { authRepository } from '@/lib/auth';
import { userProfileRepository } from '@/lib/userProfile';
import type { AuthSession, LoginInput, RegisterInput } from '@/types';

type AuthContextValue = {
  ready: boolean;
  session: AuthSession | null;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Ensure a profile row exists for the signed-in user (compose with profile repo). */
async function ensureProfileForSession(session: AuthSession): Promise<void> {
  const existing = await userProfileRepository.get(session.user.id);
  if (existing) return;
  await userProfileRepository.save(session.user.id, {
    name: session.user.name,
    email: session.user.email,
    studyGoal: null,
    preferredCategories: [],
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await authRepository.getSession();
      if (!cancelled) {
        setSession(loaded);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const next = await authRepository.register(input);
    await ensureProfileForSession(next);
    setSession(next);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const next = await authRepository.login(input);
    await ensureProfileForSession(next);
    setSession(next);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const next = await authRepository.signInWithGoogle();
    await ensureProfileForSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    await authRepository.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      session,
      register,
      login,
      signInWithGoogle,
      logout,
    }),
    [ready, session, register, login, signInWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
