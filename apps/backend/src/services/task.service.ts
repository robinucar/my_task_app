import prisma from '../client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateTaskInput, UpdateTaskInput } from '@shared-types';
import { sortTasks } from '../utils/sortTask';
import { AppError } from '../utils/AppError';
import { stripUndefined } from '../utils/stripUndefined';

type Task = Awaited<ReturnType<typeof prisma.task.findFirst>>;
type TaskListItem = Awaited<ReturnType<typeof prisma.task.findMany>>[number];

/**
 * Fetch all tasks, with optional in-memory sorting.
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
 * Retrieve a single task by ID.
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) throw new AppError('Task not found', 404);
  return task;
};

/**
 * Create a new task.
 */
export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  return await prisma.task.create({ data });
};

/**
 * Update an existing task by ID, ignoring undefined fields and converting empty dueDate to null.
 */
export const updateTask = async (id: string, data: UpdateTaskInput): Promise<Task> => {
  try {
    const cleanData = stripUndefined({
      ...data,
      dueDate: data.dueDate === '' ? null : data.dueDate,
    });

    return await prisma.task.update({
      where: { id },
      data: cleanData,
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
 */
export const deleteTask = async (id: string): Promise<Task> => {
  try {
    return await prisma.task.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError('Task not found', 404);
    }
    throw err;
  }
};
