import { Task, TaskStatus } from '@prisma/client';

const now = new Date('2025-06-01T10:00:00Z');

export const singleMockTask: Task = {
  id: '123',
  title: 'Test Task',
  description: 'Desc',
  dueDate: now,
  status: TaskStatus.PENDING,
  createdAt: now,
  updatedAt: now,
};

export const mockTaskList: Task[] = [
  {
    ...singleMockTask,
    id: '1',
    title: 'Task A',
    dueDate: new Date('2024-01-01'),
    status: TaskStatus.IN_PROGRESS,
  },
  {
    ...singleMockTask,
    id: '2',
    title: 'Task B',
    dueDate: new Date('2023-12-01'),
    status: TaskStatus.PENDING,
  },
  {
    ...singleMockTask,
    id: '3',
    title: 'Task C',
    dueDate: new Date('2024-03-01'),
    status: TaskStatus.COMPLETED,
  },
];

export const mockTasksWithNullDueDate: Task[] = [
  ...mockTaskList,
  {
    ...mockTaskList[0],
    id: '4',
    dueDate: null,
  },
];

export const mockTasksUnsortedByStatusAsc: Task[] = [
  mockTaskList[0], // IN_PROGRESS
  mockTaskList[1], // PENDING
  mockTaskList[2], // COMPLETED
];

export const mockTasksUnsortedByStatusDesc: Task[] = [
  mockTaskList[1], // PENDING
  mockTaskList[0], // IN_PROGRESS
  mockTaskList[2], // COMPLETED
];
