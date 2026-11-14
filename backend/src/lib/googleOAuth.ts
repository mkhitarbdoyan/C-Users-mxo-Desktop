import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  /** Backend callback registered in Google Cloud Console. */
  callbackUrl: string;
};

export type GoogleUserProfile = {
  googleId: string;
  email: string;
  name: string;
  emailVerified: boolean;
};

type OAuthStatePayload = {
  purpose: 'google_oauth';
  redirectUri: string;
  nonce: string;
};

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
const GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo';

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const port = process.env.PORT || '4000';
  const callbackUrl =
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `http://localhost:${port}/api/auth/google/callback`;

  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret, callbackUrl };
}

/** Deep-link / app redirect URIs allowed after a successful Google login. */
export function getAllowedMobileRedirectUris(): string[] {
  const fromEnv = process.env.MOBILE_OAUTH_REDIRECT_URIS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return ['nclexrnprep://auth/google'];
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

export function signOAuthState(redirectUri: string): string {
  const payload: OAuthStatePayload = {
    purpose: 'google_oauth',
    redirectUri,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  return jwt.sign(payload, jwtSecret(), { expiresIn: '10m' });
}

export function verifyOAuthState(state: string): OAuthStatePayload {
  const payload = jwt.verify(state, jwtSecret()) as OAuthStatePayload;
  if (payload?.purpose !== 'google_oauth' || !payload.redirectUri || !payload.nonce) {
    throw new Error('Invalid OAuth state');
  }
  return payload;
}

export function buildGoogleAuthorizationUrl(state: string, config: GoogleOAuthConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    include_granted_scopes: 'true',
    prompt: 'select_account',
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  config: GoogleOAuthConfig
): Promise<{ accessToken: string; idToken?: string }> {
  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.callbackUrl,
    grant_type: 'authorization_code',
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
  });
  const data = (await response.json()) as {
    access_token?: string;
    id_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Google token exchange failed');
  }

  return { accessToken: data.access_token, idToken: data.id_token };
}

export async function fetchGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  });
  const data = (await response.json()) as {
    sub?: string;
    email?: string;
    name?: string;
    email_verified?: boolean | string;
    error?: string;
  };

  if (!response.ok || !data.sub || !data.email) {
    throw new Error(data.error || 'Could not load Google user profile');
  }

  const emailVerified =
    data.email_verified === true || data.email_verified === 'true' || data.email_verified === undefined;

  return {
    googleId: data.sub,
    email: data.email.trim().toLowerCase(),
    name: (data.name?.trim() || data.email.split('@')[0] || 'Google Learner').slice(0, 120),
    emailVerified,
  };
}

/** Verify a Google ID token (e.g. from a native SDK) via Google's tokeninfo endpoint. */
export async function verifyGoogleIdToken(
  idToken: string,
  expectedClientId: string
): Promise<GoogleUserProfile> {
  const url = `${GOOGLE_TOKENINFO_URL}?id_token=${encodeURIComponent(idToken)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  const data = (await response.json()) as {
    sub?: string;
    email?: string;
    name?: string;
    email_verified?: string | boolean;
    aud?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.sub || !data.email) {
    throw new Error(data.error_description || data.error || 'Invalid Google ID token');
  }
  if (data.aud !== expectedClientId) {
    throw new Error('Google ID token audience mismatch');
  }

  const emailVerified =
    data.email_verified === true || data.email_verified === 'true' || data.email_verified === undefined;

  return {
    googleId: data.sub,
    email: data.email.trim().toLowerCase(),
    name: (data.name?.trim() || data.email.split('@')[0] || 'Google Learner').slice(0, 120),
    emailVerified,
  };
}

export function appendAuthParams(
  redirectUri: string,
  params: { token?: string; error?: string }
): string {
  const url = new URL(redirectUri);
  if (params.error) {
    url.searchParams.set('error', params.error);
  } else if (params.token) {
    url.searchParams.set('token', params.token);
  }
  return url.toString();
}

/** Allow exact allowlist matches, or Expo Go URLs that end with /auth/google when enabled. */
export function isAllowedMobileRedirectUri(uri: string): boolean {
  const normalized = uri.trim();
  if (!normalized) return false;
  if (getAllowedMobileRedirectUris().some((allowed) => allowed === normalized)) {
    return true;
  }
  const allowExpoGo = process.env.MOBILE_OAUTH_ALLOW_EXPO_GO !== 'false';
  if (!allowExpoGo) return false;
  try {
    const parsed = new URL(normalized);
    const path = `${parsed.host}${parsed.pathname}`.replace(/\/+$/, '');
    return (
      (parsed.protocol === 'exp:' || parsed.protocol === 'exps:') &&
      (path.endsWith('auth/google') || parsed.pathname.endsWith('/auth/google'))
    );
  } catch {
    return false;
  }
}
