import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { zodValidator } from '../middlewares/zodValidator';
import { createTaskSchema, updateTaskSchema } from '../validation/task.zod.schema';
const router = express.Router();

/**
 * @route GET /api/tasks
 * @description Get all tasks with optional sorting by dueDate or status
 * @queryParam sortBy {string} - Field to sort by (dueDate or status)
 * @queryParam sortOrder {string} - Sort direction (asc or desc)
 */
router.get('/', getAllTasks);

/**
 * @route GET /api/tasks/:id
 * @description Get a single task by ID
 */
router.get('/:id', getTaskById);

/**
 * @route POST /api/tasks
 * @description Create a new task
 */
router.post('/', zodValidator(createTaskSchema), createTask);

/**
 * @route PUT /api/tasks/:id
 * @description Update a task by ID
 */
router.put('/:id', zodValidator(updateTaskSchema), updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @description Delete a task by ID
 */
router.delete('/:id', deleteTask);

export default router;
