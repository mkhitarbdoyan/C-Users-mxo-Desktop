import { Router } from 'express';

import {
  endExam,
  explainAnswer,
  getExam,
  setFlag,
  startExam,
  submitAnswer,
} from '../controllers/examController';
import { requireAuth } from '../middleware/auth';

const examRoutes = Router();

examRoutes.post('/start', requireAuth, startExam);
examRoutes.get('/:id', requireAuth, getExam);
examRoutes.post('/:id/answers', requireAuth, submitAnswer);
examRoutes.post('/:id/flag', requireAuth, setFlag);
examRoutes.post('/:id/explain', requireAuth, explainAnswer);
examRoutes.post('/:id/end', requireAuth, endExam);

export default examRoutes;
