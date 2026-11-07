import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import type { AuthenticatedRequest, AuthTokenPayload } from '../types/auth';

/**
 * Requires `Authorization: Bearer <token>`.
 * Verifies JWT with JWT_SECRET and attaches `req.auth`.
 * Stub-friendly: returns 401 JSON errors; no DB lookup yet.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'JWT_SECRET is not configured' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as AuthTokenPayload;
    if (!payload?.sub || !payload?.email) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }
    req.auth = { sub: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
