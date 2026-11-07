import type { Response } from 'express';

import type { AuthenticatedRequest } from '../types/auth';

/**
 * Current-user stub. Requires auth middleware.
 * Returns the JWT identity until a real user store exists.
 */
export function getMe(req: AuthenticatedRequest, res: Response): void {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // TODO: load UserRecord by req.auth.sub and return toPublicUser(...)
  res.status(501).json({
    error: 'Not implemented',
    message: 'GET /users/me stub — load user from store next',
    auth: req.auth,
  });
}

/**
 * Profile update stub for name / study fields later.
 */
export function updateMe(req: AuthenticatedRequest, res: Response): void {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.status(501).json({
    error: 'Not implemented',
    message: 'PATCH /users/me stub — persist profile fields next',
    auth: req.auth,
    received: req.body ?? {},
  });
}
