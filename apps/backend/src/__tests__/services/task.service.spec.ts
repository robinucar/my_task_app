import * as taskService from '../../services/task.service';
import prisma from '../../client';
import { TaskStatus } from '@prisma/client';

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
  const mockTask = {
    id: '123',
    title: 'Test Task',
    description: 'Desc',
    dueDate: new Date('2025-06-01T00:00:00Z'),
    status: 'PENDING' as TaskStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all tasks sorted by dueDate ascending by default', async () => {
    const tasks = [
      { ...mockTask, dueDate: new Date('2025-06-02T00:00:00Z') },
      { ...mockTask, dueDate: new Date('2025-06-01T00:00:00Z') },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks();
    expect(result[0].dueDate).toEqual(new Date('2025-06-01T00:00:00Z'));
    expect(result[1].dueDate).toEqual(new Date('2025-06-02T00:00:00Z'));
  });

  it('should get all tasks sorted by dueDate descending', async () => {
    const tasks = [
      { ...mockTask, dueDate: new Date('2025-06-01T00:00:00Z') },
      { ...mockTask, dueDate: new Date('2025-06-02T00:00:00Z') },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('dueDate', 'desc');
    expect(result[0].dueDate).toEqual(new Date('2025-06-02T00:00:00Z'));
    expect(result[1].dueDate).toEqual(new Date('2025-06-01T00:00:00Z'));
  });

  it('should get all tasks sorted by status ascending', async () => {
    const tasks = [
      { ...mockTask, status: 'IN_PROGRESS' },
      { ...mockTask, status: 'PENDING' },
      { ...mockTask, status: 'COMPLETED' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('status', 'asc');
    const statusOrder = result.map((task) => task.status);
    expect(statusOrder).toEqual(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
  });

  it('should get all tasks sorted by status descending', async () => {
    const tasks = [
      { ...mockTask, status: 'COMPLETED' },
      { ...mockTask, status: 'PENDING' },
      { ...mockTask, status: 'IN_PROGRESS' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('status', 'desc');
    const statusOrder = result.map((task) => task.status);
    expect(statusOrder).toEqual(['COMPLETED', 'IN_PROGRESS', 'PENDING']);
  });

  it('should get a task by ID', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

    const result = await taskService.getTaskById('123');
    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: '123' } });
    expect(result).toEqual(mockTask);
  });

  it('should create a task', async () => {
    (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

    const result = await taskService.createTask({
      title: 'Test Task',
      description: 'Desc',
      dueDate: new Date(),
      status: 'PENDING',
    });

    expect(prisma.task.create).toHaveBeenCalled();
    expect(result).toEqual(mockTask);
  });

  it('should update a task', async () => {
    (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

    const result = await taskService.updateTask('123', {
      title: 'Updated Title',
    });

    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { title: 'Updated Title' },
    });
    expect(result).toEqual(mockTask);
  });

  it('should delete a task', async () => {
    (prisma.task.delete as jest.Mock).mockResolvedValue(mockTask);

    const result = await taskService.deleteTask('123');

    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: '123' } });
    expect(result).toEqual(mockTask);
  });
});
