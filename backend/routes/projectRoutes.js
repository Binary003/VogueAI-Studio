import express from 'express';
import {
  getAllProjects,
  getProjectById,
  deleteProject,
} from '../controllers/projectsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProjectById);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
