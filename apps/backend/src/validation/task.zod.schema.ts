import { z } from 'zod';

/**
 * Constants for maximum lengths of task fields.
 */
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

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
 *                 Empty strings are treated as undefined.
 *                 Null is also allowed (nullable).
 * - `dueDate`: Optional, coerced to Date.
 * - `status`: Optional enum, defaults to 'PENDING' in the database if omitted.
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
  description: z
    .preprocess((val) => {
      if (val === '') return undefined;
      if (val === null) return null;
      return val;
    }, z.string().max(DESCRIPTION_MAX_LENGTH).nullable())
    .optional(),
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
 *                 Empty strings are treated as undefined.
 *                 Null is also allowed (nullable).
 * - `dueDate`: Optional, coerced to Date. Empty string is treated as undefined.
 * - `status`: Optional enum.
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH).optional(),
  description: z
    .preprocess((val) => {
      if (val === '') return undefined;
      if (val === null) return null;
      return val;
    }, z.string().max(DESCRIPTION_MAX_LENGTH).nullable())
    .optional(),
  dueDate: z
    .preprocess((val) => (val === '' ? undefined : val), z.coerce.date().optional())
    .optional(),
  status: TaskStatusEnum.optional(),
});

/**
 * Zod schema for validating query parameters when fetching tasks.
 *
 * - `sortBy`: Optional. Must be either "status", "dueDate", or "createdAt".
 * - `sortOrder`: Optional. Must be "asc" or "desc".
 */
export const getAllTasksQuerySchema = z.object({
  sortBy: z.enum(['status', 'dueDate', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
