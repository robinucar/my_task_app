import * as taskService from '../../services/task.service';
import prisma from '../../client';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/AppError';
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

  describe('getAllTasks', () => {
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

  describe('getTaskById', () => {
    it('returns a task if it exists', async () => {
      const mockTask = { ...mockTaskList[0], id: 'abc' };
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('abc');
      expect(result).toEqual(mockTask);
    });

    it('throws AppError if task not found', async () => {
      (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(taskService.getTaskById('not-found')).rejects.toThrow(AppError);
    });
  });

  describe('updateTask', () => {
    it('returns updated task if update is successful', async () => {
      const updatedTask = { ...mockTaskList[0], title: 'Updated Title' };
      (prisma.task.update as jest.Mock).mockResolvedValue(updatedTask);

      const result = await taskService.updateTask('123', { title: 'Updated Title' });
      expect(result).toEqual(updatedTask);
    });

    it('throws AppError if task not found during update', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '4.15.0',
      });

      (prisma.task.update as jest.Mock).mockRejectedValue(prismaError);

      await expect(taskService.updateTask('not-found', { title: 'x' })).rejects.toThrow(AppError);
    });
  });

  describe('deleteTask', () => {
    it('returns deleted task if successful', async () => {
      const deletedTask = mockTaskList[0];
      (prisma.task.delete as jest.Mock).mockResolvedValue(deletedTask);

      const result = await taskService.deleteTask('123');
      expect(result).toEqual(deletedTask);
    });

    it('throws AppError if task not found during delete', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '4.15.0',
      });

      (prisma.task.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(taskService.deleteTask('not-found')).rejects.toThrow(AppError);
    });
  });
});
