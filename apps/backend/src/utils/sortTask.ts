import type { PrismaClient } from '@prisma/client';

type TaskItem = Awaited<ReturnType<PrismaClient['task']['findMany']>>[number];

/**
 * Defines the custom sort priority for each TaskStatus.
 * Lower values indicate higher priority when sorting in ascending order.
 */
const statusOrder: Record<TaskItem['status'], number> = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
};

/**
 * Sorts an array of tasks by a specified field (`status` or `dueDate`) and order.
 *
 * @param tasks - The array of tasks to be sorted.
 * @param sortBy - 'status' or 'dueDate'
 * @param sortOrder - 'asc' or 'desc'
 * @returns A new array of sorted tasks
 */
export const sortTasks = (
  tasks: TaskItem[],
  sortBy: 'status' | 'dueDate',
  sortOrder: 'asc' | 'desc' = 'asc',
): TaskItem[] => {
  if (sortBy === 'status') {
    return [...tasks].sort((a, b) => {
      const aPriority = statusOrder[a.status];
      const bPriority = statusOrder[b.status];
      return sortOrder === 'asc' ? aPriority - bPriority : bPriority - aPriority;
    });
  }

  if (sortBy === 'dueDate') {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return sortOrder === 'asc'
        ? a.dueDate.getTime() - b.dueDate.getTime()
        : b.dueDate.getTime() - a.dueDate.getTime();
    });
  }

  return [...tasks];
};
