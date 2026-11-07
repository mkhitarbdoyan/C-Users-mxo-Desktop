import { Router } from 'express';

import { endSession, getProgress, recordAttempt } from '../controllers/progressController';
import { requireAuth } from '../middleware/auth';

const progressRoutes = Router();

progressRoutes.get('/', requireAuth, getProgress);
progressRoutes.post('/attempts', requireAuth, recordAttempt);
progressRoutes.post('/sessions', requireAuth, endSession);

export default progressRoutes;
