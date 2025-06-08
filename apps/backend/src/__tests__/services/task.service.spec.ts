import * as taskService from '../../services/task.service';
import prisma from '../../client';
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
  const baseTask = {
    id: '1',
    title: 'Task',
    description: 'Desc',
    createdAt: new Date('2025-06-01T00:00:00Z'),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns tasks sorted by createdAt desc by default (via Prisma)', async () => {
    const tasks = [
      { ...baseTask, id: '2', createdAt: new Date('2025-06-02T00:00:00Z') },
      { ...baseTask, id: '1' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks();
    expect(prisma.task.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    expect(result).toEqual(tasks);
  });

  it('returns tasks sorted by dueDate ascending with null at end', async () => {
    const tasks = [
      { ...baseTask, id: '1', dueDate: new Date('2025-06-01'), status: 'PENDING' },
      { ...baseTask, id: '2', dueDate: null, status: 'PENDING' },
      { ...baseTask, id: '3', dueDate: new Date('2025-05-01'), status: 'PENDING' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  it('returns tasks sorted by dueDate descending with null at end', async () => {
    const tasks = [
      { ...baseTask, id: '1', dueDate: new Date('2025-06-01'), status: 'PENDING' },
      { ...baseTask, id: '2', dueDate: null, status: 'PENDING' },
      { ...baseTask, id: '3', dueDate: new Date('2025-07-01'), status: 'PENDING' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  it('returns tasks sorted by status asc (PENDING < IN_PROGRESS < COMPLETED)', async () => {
    const tasks = [
      { ...baseTask, id: '1', status: 'IN_PROGRESS' },
      { ...baseTask, id: '2', status: 'PENDING' },
      { ...baseTask, id: '3', status: 'COMPLETED' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('status', 'asc');
    expect(result.map((t) => t.status)).toEqual(['PENDING', 'IN_PROGRESS', 'COMPLETED']);
  });

  it('returns tasks sorted by status desc (COMPLETED > IN_PROGRESS > PENDING)', async () => {
    const tasks = [
      { ...baseTask, id: '1', status: 'PENDING' },
      { ...baseTask, id: '2', status: 'IN_PROGRESS' },
      { ...baseTask, id: '3', status: 'COMPLETED' },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(tasks);

    const result = await taskService.getAllTasks('status', 'desc');
    expect(result.map((t) => t.status)).toEqual(['COMPLETED', 'IN_PROGRESS', 'PENDING']);
  });
});
