import cors from 'cors';
import express from 'express';

import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import examRoutes from './routes/examRoutes';
import progressRoutes from './routes/progressRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'nclex-rn-prep-backend',
    scope: 'postgres-content-exam-srs',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', contentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/exams', examRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
