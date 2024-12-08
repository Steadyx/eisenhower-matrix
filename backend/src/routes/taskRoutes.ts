import { Router } from 'express';
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from '@controllers/taskController';
import { authenticate } from '@middleware/authenticate';

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

// Define your routes...
router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
