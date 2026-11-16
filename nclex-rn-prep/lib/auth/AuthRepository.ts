import type { AuthSession, LoginInput, RegisterInput } from '@/types';

/**
 * Auth storage / identity seam.
 * Today: local mock accounts + session in AsyncStorage.
 * Later: swap for a real API / Google SDK without rewriting auth screens.
 */
export interface AuthRepository {
  getSession(): Promise<AuthSession | null>;
  register(input: RegisterInput): Promise<AuthSession>;
  login(input: LoginInput): Promise<AuthSession>;
  /** Google OAuth via backend authorization URL + deep-link callback JWT. */
  signInWithGoogle(): Promise<AuthSession>;
  logout(): Promise<void>;
}
