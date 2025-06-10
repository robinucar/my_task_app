export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
};

export type UpdateTaskInput = Omit<Partial<CreateTaskInput>, 'dueDate'> & {
  dueDate?: string | Date | null;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskSortBy = 'status' | 'dueDate';
export type TaskSortOrder = 'asc' | 'desc';

export type SortQuery = {
  sortBy?: TaskSortBy;
  sortOrder?: TaskSortOrder;
};
