import prisma from '../../prisma/client';
import { TaskStatus, Task } from '@prisma/client';

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
 * Defines the custom order for TaskStatus sorting.
 */
const statusOrder = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
} as const;

/**
 * Get all tasks, optionally sorted by due date or status.
 *
 * @param sortBy - The field to sort by ('dueDate' or 'status'). Default is 'dueDate'.
 * @param sortOrder - The sorting direction ('asc' or 'desc'). Default is 'asc'.
 * @returns A sorted array of tasks.
 */
export const getAllTasks = async (
  sortBy: 'dueDate' | 'status' = 'dueDate',
  sortOrder: 'asc' | 'desc' = 'asc',
): Promise<Task[]> => {
  const tasks = await prisma.task.findMany();

  if (sortBy === 'status') {
    return tasks.sort((a, b) => {
      const aPriority = statusOrder[a.status];
      const bPriority = statusOrder[b.status];
      return sortOrder === 'asc' ? aPriority - bPriority : bPriority - aPriority;
    });
  }

  return tasks.sort((a, b) => {
    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
  });
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
