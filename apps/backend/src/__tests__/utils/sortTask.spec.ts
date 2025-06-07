import { sortTasks } from '../../utils/sortTask';
import { Task, TaskStatus } from '@prisma/client';

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'desc 1',
    status: TaskStatus.COMPLETED,
    dueDate: tomorrow,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'desc 2',
    status: TaskStatus.PENDING,
    dueDate: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'desc 3',
    status: TaskStatus.IN_PROGRESS,
    dueDate: yesterday,
    createdAt: now,
    updatedAt: now,
  },
];

describe('sortTasks', () => {
  it('sorts by status ascending', () => {
    const result = sortTasks(mockTasks, 'status', 'asc');
    expect(result.map((t) => t.status)).toEqual([
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ]);
  });

  it('sorts by status descending', () => {
    const result = sortTasks(mockTasks, 'status', 'desc');
    expect(result.map((t) => t.status)).toEqual([
      TaskStatus.COMPLETED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.PENDING,
    ]);
  });

  it('sorts by dueDate ascending (closest first, null last)', () => {
    const result = sortTasks(mockTasks, 'dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2']); // yesterday, tomorrow, no date
  });

  it('sorts by dueDate descending (furthest future first)', () => {
    const result = sortTasks(mockTasks, 'dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['1', '3', '2']); // tomorrow, yesterday, no date
  });

  it('returns original list if sortBy is unrecognized', () => {
    // @ts-expect-error Testing fallback for invalid sortBy
    const result = sortTasks(mockTasks, 'invalid');
    expect(result).toEqual(mockTasks);
  });
});
