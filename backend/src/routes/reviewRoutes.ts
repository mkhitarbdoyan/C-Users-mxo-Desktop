import { Router } from 'express';

import { listDue, submitReview } from '../controllers/reviewController';
import { requireAuth } from '../middleware/auth';

const reviewRoutes = Router();

reviewRoutes.get('/due', requireAuth, listDue);
reviewRoutes.post('/:itemType/:itemId', requireAuth, submitReview);

export default reviewRoutes;
