import express from 'express';
import { signup, login, getProfile, updateProfile, updatePassword, deleteAccount } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validateSignup, validateLogin } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);
router.delete('/profile', authMiddleware, deleteAccount);

export default router;
