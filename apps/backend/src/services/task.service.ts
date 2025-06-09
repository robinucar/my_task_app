import prisma from '../client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateTaskInput, UpdateTaskInput } from '@shared-types';
import { sortTasks } from '../utils/sortTask';
import { AppError } from '../utils/AppError';

type Task = Awaited<ReturnType<typeof prisma.task.findFirst>>;
type TaskListItem = Awaited<ReturnType<typeof prisma.task.findMany>>[number];

/**
 * Fetches all tasks from the database and sorts them.
 *
 * By default, tasks are sorted by `createdAt` in descending order (newest first).
 * If `sortBy` is set to `'status'` or `'dueDate'`, sorting is done in memory.
 *
 * @param sortBy - The field to sort by: `'status'`, `'dueDate'`, or `'createdAt'` (default: `'createdAt'`)
 * @param sortOrder - The order direction: `'asc'` or `'desc'` (default: `'desc'`)
 * @returns Sorted list of tasks
 */
export const getAllTasks = async (
  sortBy: 'status' | 'dueDate' | 'createdAt' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<TaskListItem[]> => {
  if (sortBy === 'createdAt') {
    return prisma.task.findMany({
      orderBy: { createdAt: sortOrder },
    });
  }

  const tasks = await prisma.task.findMany();
  return sortTasks(tasks, sortBy, sortOrder);
};

/**
 * Retrieve a single task by its ID.
 *
 * @param id - The task's unique identifier.
 * @returns The found task or throws an error.
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

/**
 * Create a new task.
 *
 * @param data - The task data to be created.
 * @returns The newly created task.
 */
export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  return await prisma.task.create({ data });
};

/**
 * Update an existing task by ID.
 *
 * @param id - The task ID to update.
 * @param data - The fields to update.
 * @returns The updated task.
 */
export const updateTask = async (id: string, data: UpdateTaskInput): Promise<Task> => {
  try {
    return await prisma.task.update({
      where: { id },
      data,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('Task not found', 404);
    }
    throw err;
  }
};

/**
 * Delete a task by ID.
 *
 * @param id - The task ID to delete.
 * @returns The deleted task.
 */
export const deleteTask = async (id: string): Promise<Task> => {
  try {
    return await prisma.task.delete({
      where: { id },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('Task not found', 404);
    }
    throw err;
  }
};
