import { z } from 'zod';

/**
 * Enum representing valid task statuses.
 * Matches the Prisma enum: PENDING, IN_PROGRESS, COMPLETED
 */
const TaskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

/**
 * Zod schema for validating task creation payloads.
 *
 * - `title`: Required, non-empty string.
 * - `description`: Optional, max 500 characters.
 * - `dueDate`: Optional, coerced to Date.
 * - `status`: Optional enum, defaults to 'PENDING' in the database if omitted.
 */
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(500).optional(),
  dueDate: z.coerce.date().optional(),
  status: TaskStatusEnum.optional(),
});

/**
 * Zod schema for validating task update payloads.
 *
 * All fields are optional to support partial updates.
 *
 * - `title`: Optional, non-empty string if provided.
 * - `description`: Optional, max 500 characters.
 * - `dueDate`: Optional, coerced to Date.
 * - `status`: Optional enum.
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().max(500).optional(),
  dueDate: z.coerce.date().optional(),
  status: TaskStatusEnum.optional(),
});
