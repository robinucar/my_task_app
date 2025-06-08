import * as taskService from '../../services/task.service';
import prisma from '../../client';
import {
  mockTaskList,
  mockTasksWithNullDueDate,
  mockTasksUnsortedByStatusAsc,
  mockTasksUnsortedByStatusDesc,
} from '../__mocks__/task.mock';
jest.mock('../../client', () => ({
  task: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Task Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns tasks sorted by createdAt desc by default (via Prisma)', async () => {
    const sortedByCreatedAtDesc = [
      { ...mockTaskList[0], id: '2', createdAt: new Date('2025-06-02T00:00:00Z') },
      { ...mockTaskList[0], id: '1', createdAt: new Date('2025-06-01T00:00:00Z') },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(sortedByCreatedAtDesc);

    const result = await taskService.getAllTasks();
    expect(prisma.task.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    expect(result).toEqual(sortedByCreatedAtDesc);
  });

  it('returns tasks sorted by dueDate ascending with null at end', async () => {
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasksWithNullDueDate);

    const result = await taskService.getAllTasks('dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['2', '1', '3', '4']);
  });

  it('returns tasks sorted by dueDate descending with null at end', async () => {
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasksWithNullDueDate);

    const result = await taskService.getAllTasks('dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2', '4']);
  });

  it('returns tasks sorted by status asc (PENDING < IN_PROGRESS < COMPLETED)', async () => {
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasksUnsortedByStatusAsc);

    const result = await taskService.getAllTasks('status', 'asc');
    expect(result.map((t) => t.status)).toEqual(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
  });

  it('returns tasks sorted by status desc (COMPLETED > IN_PROGRESS > PENDING)', async () => {
    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasksUnsortedByStatusDesc);

    const result = await taskService.getAllTasks('status', 'desc');
    expect(result.map((t) => t.status)).toEqual(['COMPLETED', 'IN_PROGRESS', 'PENDING']);
  });
});
