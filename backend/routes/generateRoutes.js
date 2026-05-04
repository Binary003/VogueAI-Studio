import express from 'express';
import { generateImages } from '../controllers/generateController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateImages);

export default router;
