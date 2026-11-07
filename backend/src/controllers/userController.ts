import type { Response } from 'express';

import { toApiSystem, toDbSystem } from '../lib/mappers';
import { prisma } from '../lib/prisma';
import type { AuthenticatedRequest, UpdateMeBody, UserPublic } from '../types/auth';

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

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.auth.sub } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(toPublicUser(user));
}

export async function updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const body = (req.body ?? {}) as UpdateMeBody;
  const data: {
    name?: string;
    email?: string;
    studyGoal?: string | null;
    preferredCategories?: NonNullable<ReturnType<typeof toDbSystem>>[];
  } = {};

  if (body.name !== undefined) {
    const name = body.name.trim();
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    data.name = name;
  }

  if (typeof body.email === 'string' && body.email.trim()) {
    const email = body.email.trim().toLowerCase();
    if (!email.includes('@')) {
      res.status(400).json({ error: 'Enter a valid email' });
      return;
    }
    data.email = email;
  }

  if (body.studyGoal !== undefined) {
    data.studyGoal =
      typeof body.studyGoal === 'string' && body.studyGoal.trim()
        ? body.studyGoal.trim()
        : null;
  }

  if (body.preferredCategories !== undefined) {
    if (!Array.isArray(body.preferredCategories)) {
      res.status(400).json({ error: 'preferredCategories must be an array' });
      return;
    }
    const mapped = body.preferredCategories.map(toDbSystem);
    if (mapped.some((v) => v === null)) {
      res.status(400).json({ error: 'preferredCategories contains an invalid system' });
      return;
    }
    data.preferredCategories = mapped as NonNullable<(typeof mapped)[number]>[];
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.auth.sub },
      data,
    });
    res.json(toPublicUser(user));
  } catch {
    res.status(404).json({ error: 'User not found' });
  }
}
