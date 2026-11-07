import { Router } from 'express';

import {
  getFlashcard,
  getQuestion,
  listFlashcards,
  listQuestions,
} from '../controllers/contentController';

const contentRoutes = Router();

contentRoutes.get('/questions', listQuestions);
contentRoutes.get('/questions/:id', getQuestion);
contentRoutes.get('/flashcards', listFlashcards);
contentRoutes.get('/flashcards/:id', getFlashcard);

export default contentRoutes;
