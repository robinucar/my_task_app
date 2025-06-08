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

export type UpdateTaskInput = Partial<CreateTaskInput>;
