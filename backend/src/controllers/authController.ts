import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import {
  appendAuthParams,
  buildGoogleAuthorizationUrl,
  exchangeCodeForTokens,
  fetchGoogleUserProfile,
  getGoogleOAuthConfig,
  isAllowedMobileRedirectUri,
  signOAuthState,
  verifyGoogleIdToken,
  verifyOAuthState,
  type GoogleUserProfile,
} from '../lib/googleOAuth';
import { toApiSystem } from '../lib/mappers';
import { prisma } from '../lib/prisma';
import type { LoginBody, RegisterBody, UserPublic } from '../types/auth';

function toPublicUser(user: {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google';
  studyGoal: string | null;
  preferredCategories: Parameters<typeof toApiSystem>[0][];
  createdAt: Date;
  updatedAt: Date;
}): UserPublic {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    studyGoal: user.studyGoal,
    preferredCategories: user.preferredCategories.map(toApiSystem),
    updatedAt: user.updatedAt.toISOString(),
    provider: user.provider,
  };
}

function issueToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: userId, email }, secret, { expiresIn: '7d' });
}

async function upsertGoogleUser(profile: GoogleUserProfile) {
  if (!profile.emailVerified) {
    throw new Error('Google email is not verified');
  }

  const byGoogleId = await prisma.user.findUnique({ where: { googleId: profile.googleId } });
  if (byGoogleId) {
    const updated = await prisma.user.update({
      where: { id: byGoogleId.id },
      data: {
        email: profile.email,
        name: profile.name || byGoogleId.name,
        provider: 'google',
        passwordHash: null,
      },
    });
    return updated;
  }

  const byEmail = await prisma.user.findUnique({ where: { email: profile.email } });
  if (byEmail) {
    if (byEmail.provider === 'email' && byEmail.passwordHash) {
      throw new Error(
        'An account with this email already exists. Sign in with email and password instead.'
      );
    }
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId: profile.googleId,
        name: profile.name || byEmail.name,
        provider: 'google',
        passwordHash: null,
      },
    });
  }

  return prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name,
      provider: 'google',
      googleId: profile.googleId,
      passwordHash: null,
    },
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<RegisterBody>;
  const name = body.name?.trim() ?? '';
  const email = body.email?.trim().toLowerCase() ?? '';
  const password = body.password ?? '';

  if (!name || !email || !password) {
    res.status(400).json({ error: 'name, email, and password are required' });
    return;
  }
  if (!email.includes('@')) {
    res.status(400).json({ error: 'Enter a valid email' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists' });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
        provider: 'email',
      },
    });
    const token = issueToken(user.id, user.email);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not register';
    res.status(500).json({ error: message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<LoginBody>;
  const email = body.email?.trim().toLowerCase() ?? '';
  const password = body.password ?? '';

  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.provider !== 'email' || !user.passwordHash) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  try {
    const token = issueToken(user.id, user.email);
    res.json({ token, user: toPublicUser(user) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not login';
    res.status(500).json({ error: message });
  }
}

/**
 * Start Google OAuth. Returns an authorization URL the mobile app opens in a browser session.
 * Query: redirect_uri — deep link that receives `?token=` after callback (must be allowlisted).
 */
export async function googleAuthStart(req: Request, res: Response): Promise<void> {
  const config = getGoogleOAuthConfig();
  if (!config) {
    res.status(503).json({
      error:
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the API.',
    });
    return;
  }

  const redirectUri =
    typeof req.query.redirect_uri === 'string' ? req.query.redirect_uri.trim() : '';
  if (!redirectUri || !isAllowedMobileRedirectUri(redirectUri)) {
    res.status(400).json({
      error: 'redirect_uri is required and must be an allowlisted mobile deep link',
      allowed: process.env.MOBILE_OAUTH_REDIRECT_URIS
        ? process.env.MOBILE_OAUTH_REDIRECT_URIS.split(',').map((s) => s.trim()).filter(Boolean)
        : ['nclexrnprep://auth/google'],
    });
    return;
  }

  try {
    const state = signOAuthState(redirectUri);
    const authorizationUrl = buildGoogleAuthorizationUrl(state, config);

    if (req.query.redirect === '1' || req.query.redirect === 'true') {
      res.redirect(authorizationUrl);
      return;
    }

    res.json({
      authorizationUrl,
      state,
      callbackUrl: config.callbackUrl,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not start Google OAuth';
    res.status(500).json({ error: message });
  }
}

/**
 * Google redirects here with `code` + `state`. Exchange the code, upsert the user,
 * issue the same JWT shape as email login, then redirect to the mobile deep link.
 */
export async function googleAuthCallback(req: Request, res: Response): Promise<void> {
  const config = getGoogleOAuthConfig();
  if (!config) {
    res.status(503).json({ error: 'Google OAuth is not configured' });
    return;
  }

  const errorParam = typeof req.query.error === 'string' ? req.query.error : null;
  const code = typeof req.query.code === 'string' ? req.query.code : null;
  const state = typeof req.query.state === 'string' ? req.query.state : null;
  const wantsJson = req.query.format === 'json' || req.headers.accept?.includes('application/json');

  let redirectUri: string | null = null;

  try {
    if (!state) throw new Error('Missing OAuth state');
    const statePayload = verifyOAuthState(state);
    redirectUri = statePayload.redirectUri;
    if (!isAllowedMobileRedirectUri(redirectUri)) {
      throw new Error('OAuth redirect URI is not allowlisted');
    }

    if (errorParam) {
      throw new Error(errorParam === 'access_denied' ? 'Google sign-in was cancelled' : errorParam);
    }
    if (!code) throw new Error('Missing authorization code');

    const tokens = await exchangeCodeForTokens(code, config);
    const profile = await fetchGoogleUserProfile(tokens.accessToken);
    const user = await upsertGoogleUser(profile);
    const token = issueToken(user.id, user.email);

    if (wantsJson) {
      res.json({ token, user: toPublicUser(user) });
      return;
    }

    res.redirect(appendAuthParams(redirectUri, { token }));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Google sign-in failed';
    if (wantsJson || !redirectUri) {
      res.status(400).json({ error: message });
      return;
    }
    res.redirect(appendAuthParams(redirectUri, { error: message }));
  }
}

/**
 * Alternate mobile path: verify a Google ID token (native SDK) and issue our JWT.
 * Body: { idToken: string }
 */
export async function googleAuthWithIdToken(req: Request, res: Response): Promise<void> {
  const config = getGoogleOAuthConfig();
  if (!config) {
    res.status(503).json({
      error:
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the API.',
    });
    return;
  }

  const idToken =
    typeof (req.body as { idToken?: unknown })?.idToken === 'string'
      ? (req.body as { idToken: string }).idToken.trim()
      : '';
  if (!idToken) {
    res.status(400).json({ error: 'idToken is required' });
    return;
  }

  try {
    const profile = await verifyGoogleIdToken(idToken, config.clientId);
    const user = await upsertGoogleUser(profile);
    const token = issueToken(user.id, user.email);
    res.json({ token, user: toPublicUser(user) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Google sign-in failed';
    res.status(401).json({ error: message });
  }
}

/**
 * After the deep-link returns with `?token=`, the app can hydrate the public user.
 */
export async function sessionFromToken(req: Request, res: Response): Promise<void> {
  const token =
    typeof (req.body as { token?: unknown })?.token === 'string'
      ? (req.body as { token: string }).token.trim()
      : '';
  if (!token) {
    res.status(400).json({ error: 'token is required' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET is not configured' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { sub?: string; email?: string };
    if (!payload.sub) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    res.json({ token, user: toPublicUser(user) });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
