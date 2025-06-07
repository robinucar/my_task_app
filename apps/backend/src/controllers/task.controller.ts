import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';

/**
 * Get all tasks with optional sorting by due date or status.
 */
export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sortBy, sortOrder } = req.query;
    const tasks = await taskService.getAllTasks(
      sortBy === 'status' ? 'status' : 'dueDate',
      sortOrder === 'desc' ? 'desc' : 'asc',
    );
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single task by its ID.
 */
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new task.
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a task by ID.
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(id, req.body);
    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a task by ID.
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await taskService.deleteTask(id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
