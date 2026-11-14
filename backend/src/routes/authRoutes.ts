import { Router } from 'express';

import {
  googleAuthCallback,
  googleAuthStart,
  googleAuthWithIdToken,
  login,
  register,
  sessionFromToken,
} from '../controllers/authController';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);

authRoutes.get('/google', googleAuthStart);
authRoutes.get('/google/callback', googleAuthCallback);
authRoutes.post('/google/id-token', googleAuthWithIdToken);
authRoutes.post('/session', sessionFromToken);

export default authRoutes;
