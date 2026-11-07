import { Router } from 'express';

import { getMe, updateMe } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const userRoutes = Router();

userRoutes.get('/me', requireAuth, getMe);
userRoutes.patch('/me', requireAuth, updateMe);

export default userRoutes;
