import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import {
  apiRequest,
  clearStoredToken,
  getApiBaseUrl,
  getStoredToken,
  setStoredToken,
} from '@/lib/api/client';
import type { AuthRepository } from '@/lib/auth/AuthRepository';
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from '@/types';

WebBrowser.maybeCompleteAuthSession();

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

function parseQueryParam(url: string, key: string): string | null {
  try {
    const parsed = Linking.parse(url);
    const value = parsed.queryParams?.[key];
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  } catch {
    // fall through
  }
  const match = new RegExp(`[?&#]${key}=([^&#]*)`).exec(url);
  return match ? decodeURIComponent(match[1]) : null;
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
      const redirectUri = Linking.createURL('auth/google');
      const start = await apiRequest<{ authorizationUrl: string }>(
        `/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`,
        { skipAuth: true }
      );

      const result = await WebBrowser.openAuthSessionAsync(start.authorizationUrl, redirectUri);
      if (result.type !== 'success' || !('url' in result) || !result.url) {
        throw new Error('Google sign-in was cancelled');
      }

      const oauthError = parseQueryParam(result.url, 'error');
      if (oauthError) {
        throw new Error(oauthError);
      }

      const token = parseQueryParam(result.url, 'token');
      if (!token) {
        throw new Error('Google sign-in did not return a session token');
      }

      const data = await apiRequest<ApiAuthResponse>('/api/auth/session', {
        method: 'POST',
        body: { token },
        skipAuth: true,
      });
      const session = toSession(data.token, data.user);
      await persistSession(session);
      return session;
    },

    async logout() {
      await clearStoredToken();
      await AsyncStorage.removeItem(SESSION_KEY);
    },
  };
}

/** Exposed for diagnostics / tests. */
export function __getApiBaseUrlForAuth() {
  return getApiBaseUrl();
}
