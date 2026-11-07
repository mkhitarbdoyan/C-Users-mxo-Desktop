import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthRepository } from '@/lib/auth/AuthRepository';
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from '@/types';

const USERS_KEY = '@nclex_rn_prep/auth_users_v1';
const SESSION_KEY = '@nclex_rn_prep/auth_session_v1';

type StoredAccount = {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google';
  /** Mock-only credential fingerprint — not real password hashing. */
  passwordFingerprint: string | null;
};

type UsersMap = Record<string, StoredAccount>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Deterministic mock fingerprint (not secure; local demo only). */
function fingerprintPassword(password: string): string {
  const salt = 'nclex-rn-prep-mock';
  const raw = `${salt}:${password}`;
  // Simple reversible-looking encoding for demo persistence — not cryptography.
  return Array.from(raw)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

function createToken(userId: string): string {
  return `mock-token-${userId}-${Date.now().toString(36)}`;
}

function toSession(account: StoredAccount): AuthSession {
  const user: AuthUser = {
    id: account.id,
    email: account.email,
    name: account.name,
    provider: account.provider,
  };
  return {
    token: createToken(account.id),
    user,
    createdAt: new Date().toISOString(),
  };
}

async function readUsers(): Promise<UsersMap> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UsersMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeUsers(users: UsersMap): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function writeSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function createAsyncStorageAuthRepository(): AuthRepository {
  return {
    async getSession() {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw) as AuthSession;
        if (!session?.user?.id || !session.token) return null;
        return session;
      } catch {
        return null;
      }
    },

    async register(input: RegisterInput) {
      const email = normalizeEmail(input.email);
      const name = input.name.trim();
      const password = input.password;

      if (!name) throw new Error('Name is required');
      if (!email || !email.includes('@')) throw new Error('Enter a valid email');
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const users = await readUsers();
      if (users[email]) {
        throw new Error('An account with this email already exists');
      }

      const account: StoredAccount = {
        id: createId('user'),
        email,
        name,
        provider: 'email',
        passwordFingerprint: fingerprintPassword(password),
      };
      users[email] = account;
      await writeUsers(users);

      const session = toSession(account);
      await writeSession(session);
      return session;
    },

    async login(input: LoginInput) {
      const email = normalizeEmail(input.email);
      const users = await readUsers();
      const account = users[email];
      if (!account || account.provider !== 'email') {
        throw new Error('Invalid email or password');
      }
      if (account.passwordFingerprint !== fingerprintPassword(input.password)) {
        throw new Error('Invalid email or password');
      }

      const session = toSession(account);
      await writeSession(session);
      return session;
    },

    async signInWithGoogle() {
      // Mock Google account — replace with real Google SDK + backend later.
      const email = 'nclex.learner@gmail.com';
      const users = await readUsers();
      let account = users[email];

      if (!account) {
        account = {
          id: createId('google'),
          email,
          name: 'NCLEX Learner',
          provider: 'google',
          passwordFingerprint: null,
        };
        users[email] = account;
        await writeUsers(users);
      } else {
        account = {
          ...account,
          provider: 'google',
          name: account.name || 'NCLEX Learner',
          passwordFingerprint: null,
        };
        users[email] = account;
        await writeUsers(users);
      }

      const session = toSession(account);
      await writeSession(session);
      return session;
    },

    async logout() {
      await AsyncStorage.removeItem(SESSION_KEY);
    },
  };
}
