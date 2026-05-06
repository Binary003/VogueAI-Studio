import express from 'express';
import { generateImages } from '../controllers/generateController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateImageGeneration } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, validateImageGeneration, generateImages);

export default router;
