import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  apiRequest,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/lib/api/client';
import type { AuthRepository } from '@/lib/auth/AuthRepository';
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from '@/types';

const SESSION_KEY = '@nclex_rn_prep/auth_session_v1';

type ApiUser = {
  id: string;
  email: string;
  name: string;
  provider?: 'email' | 'google';
};

type ApiAuthResponse = { token: string; user: ApiUser };

function toAuthUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider ?? 'email',
  };
}

function toSession(token: string, user: ApiUser): AuthSession {
  return {
    token,
    user: toAuthUser(user),
    createdAt: new Date().toISOString(),
  };
}

async function persistSession(session: AuthSession): Promise<void> {
  await setStoredToken(session.token);
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function createApiAuthRepository(): AuthRepository {
  return {
    async getSession() {
      try {
        const token = await getStoredToken();
        if (!token) return null;
        try {
          const me = await apiRequest<ApiUser>('/api/users/me', { token });
          const session = toSession(token, me);
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
          return session;
        } catch {
          const raw = await AsyncStorage.getItem(SESSION_KEY);
          if (!raw) return null;
          const cached = JSON.parse(raw) as AuthSession;
          if (!cached?.user?.id || !cached.token) return null;
          return cached;
        }
      } catch {
        return null;
      }
    },

    async register(input: RegisterInput) {
      const data = await apiRequest<ApiAuthResponse>('/api/auth/register', {
        method: 'POST',
        body: {
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          password: input.password,
        },
        skipAuth: true,
      });
      const session = toSession(data.token, data.user);
      await persistSession(session);
      return session;
    },

    async login(input: LoginInput) {
      const data = await apiRequest<ApiAuthResponse>('/api/auth/login', {
        method: 'POST',
        body: {
          email: input.email.trim().toLowerCase(),
          password: input.password,
        },
        skipAuth: true,
      });
      const session = toSession(data.token, data.user);
      await persistSession(session);
      return session;
    },

    async signInWithGoogle() {
      throw new Error('Google sign-in is not connected to the backend yet');
    },

    async logout() {
      await clearStoredToken();
      await AsyncStorage.removeItem(SESSION_KEY);
    },
  };
}
