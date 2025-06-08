import { sortTasks } from '../../utils/sortTask';
import { Task, TaskStatus } from '@prisma/client';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task A',
    description: null,
    dueDate: new Date('2024-01-01'),
    status: TaskStatus.IN_PROGRESS,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Task B',
    description: null,
    dueDate: new Date('2023-12-01'),
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Task C',
    description: null,
    dueDate: new Date('2024-03-01'),
    status: TaskStatus.COMPLETED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('sortTasks', () => {
  it('returns unsorted array if sortBy is undefined or invalid', () => {
    const result = sortTasks(mockTasks, undefined as any);
    expect(result.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('sorts by dueDate ascending by default when specified', () => {
    const result = sortTasks(mockTasks, 'dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['2', '1', '3']);
  });

  it('sorts by dueDate descending', () => {
    const result = sortTasks(mockTasks, 'dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

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
  it('sorts by dueDate ascending and places nulls at the end', () => {
    const tasksWithNull: Task[] = [
      ...mockTasks,
      {
        ...mockTasks[0],
        id: '4',
        dueDate: null,
      },
    ];
    const result = sortTasks(tasksWithNull, 'dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['2', '1', '3', '4']);
  });

  it('sorts by dueDate descending and places nulls at the end', () => {
    const tasksWithNull: Task[] = [
      ...mockTasks,
      {
        ...mockTasks[0],
        id: '4',
        dueDate: null,
      },
    ];
    const result = sortTasks(tasksWithNull, 'dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2', '4']);
  });
});
