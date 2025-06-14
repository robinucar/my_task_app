export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  dueDate?: Date;
  status?: TaskStatus;
};

export type UpdateTaskInput = Omit<Partial<CreateTaskInput>, 'dueDate'> & {
  dueDate?: string | Date | null;
};

/**
 * Core Task type returned by the database or API.
 */
export type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Sorting fields.
 */
export type TaskSortBy = 'status' | 'dueDate';
export type TaskSortOrder = 'asc' | 'desc';

export type SortQuery = {
  sortBy?: TaskSortBy;
  sortOrder?: TaskSortOrder;
};

/**
 *  Payload used when creating a task.
 */
export type TaskPayloadCreate = Required<Pick<CreateTaskInput, 'title'>> &
  Omit<CreateTaskInput, 'title'>;

/**
 *  Payload used when updating a task — must include `id`.
 */
export type TaskPayloadUpdate = TaskPayloadCreate & {
  id: string;
};
