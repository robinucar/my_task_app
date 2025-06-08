import prisma from '../client';
import { TaskStatus, Task } from '@prisma/client';
import { sortTasks } from '../utils/sortTask';
/**
 * Input type for creating a task.
 */
export type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
};

/**
 * Input type for updating a task.
 * All fields are optional.
 */
export type UpdateTaskInput = Partial<CreateTaskInput>;

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
): Promise<Task[]> => {
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
 * @returns The found task or null.
 */
export const getTaskById = async (id: string): Promise<Task | null> => {
  return await prisma.task.findUnique({
    where: { id },
  });
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
  return await prisma.task.update({
    where: { id },
    data,
  });
};

/**
 * Delete a task by ID.
 *
 * @param id - The task ID to delete.
 * @returns The deleted task.
 */
export const deleteTask = async (id: string): Promise<Task> => {
  return await prisma.task.delete({
    where: { id },
  });
};
