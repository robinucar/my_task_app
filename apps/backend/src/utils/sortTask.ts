import { Task } from '@prisma/client';

/**
 * Defines the custom sort priority for each TaskStatus.
 * Lower values indicate higher priority when sorting in ascending order.
 */
const statusOrder: Record<Task['status'], number> = {
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
};

/**
 * Sorts an array of tasks by a specified field (`status` or `dueDate`) and order.
 *
 * - If `sortBy` is `'status'`, tasks are sorted using a fixed priority:
 *   PENDING < IN_PROGRESS < COMPLETED.
 *
 * - If `sortBy` is `'dueDate'`, tasks are sorted by actual date values.
 *   Tasks without a due date are always placed at the end.
 *
 * @param tasks - The array of tasks to be sorted.
 * @param sortBy - The field to sort by. Allowed values: `'status'` or `'dueDate'`.
 * @param sortOrder - The direction to sort in. `'asc'` (default) or `'desc'`.
 * @returns A new array of tasks sorted according to the specified criteria.
 */
export const sortTasks = (
  tasks: Task[],
  sortBy: 'status' | 'dueDate',
  sortOrder: 'asc' | 'desc' = 'asc',
): Task[] => {
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

      const aTime = a.dueDate.getTime();
      const bTime = b.dueDate.getTime();

      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    });
  }

  return [...tasks];
};
