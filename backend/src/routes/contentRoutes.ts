import { Router } from 'express';

import {
  getCategory,
  getFlashcard,
  getQuestion,
  listCategories,
  listFlashcards,
  listQuestions,
  listSystems,
} from '../controllers/contentController';

const contentRoutes = Router();

contentRoutes.get('/categories', listCategories);
contentRoutes.get('/categories/:id', getCategory);
contentRoutes.get('/systems', listSystems);
contentRoutes.get('/questions', listQuestions);
contentRoutes.get('/questions/:id', getQuestion);
contentRoutes.get('/flashcards', listFlashcards);
contentRoutes.get('/flashcards/:id', getFlashcard);

export default contentRoutes;
