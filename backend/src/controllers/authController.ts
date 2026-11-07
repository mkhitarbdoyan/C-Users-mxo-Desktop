import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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
  if (!user || user.provider !== 'email') {
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
