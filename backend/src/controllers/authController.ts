import type { Request, Response } from 'express';

import type { LoginBody, RegisterBody } from '../types/auth';

/**
 * Auth stubs aligned with the Expo app's AuthRepository surface
 * (register / login). No persistence or hashing yet — wire next.
 */
export function register(req: Request, res: Response): void {
  const body = req.body as Partial<RegisterBody>;
  const { name, email, password } = body;

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'name, email, and password are required' });
    return;
  }

  // TODO: hash password (bcrypt), persist user, issue JWT
  res.status(501).json({
    error: 'Not implemented',
    message: 'Register stub — connect user store + JWT next',
    received: { name: name.trim(), email: email.trim().toLowerCase() },
  });
}

export function login(req: Request, res: Response): void {
  const body = req.body as Partial<LoginBody>;
  const { email, password } = body;

  if (!email?.trim() || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  // TODO: look up user, verify password, issue JWT
  res.status(501).json({
    error: 'Not implemented',
    message: 'Login stub — connect user store + JWT next',
    received: { email: email.trim().toLowerCase() },
  });
}
