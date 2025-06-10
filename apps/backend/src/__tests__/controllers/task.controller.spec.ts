import { Request, Response, NextFunction } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../../controllers/task.controller';
import * as taskService from '../../services/task.service';
import { singleMockTask } from '../__mocks__/task.mock';
jest.mock('../../services/task.service');

describe('Task Controller', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next: NextFunction = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all tasks', async () => {
    (taskService.getAllTasks as jest.Mock).mockResolvedValue([singleMockTask]);

    const req = {
      query: {},
    } as unknown as Request;

    await getAllTasks(req, res, next);

    expect(taskService.getAllTasks).toHaveBeenCalledWith('createdAt', 'asc');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([singleMockTask]);
  });

  it('should sort tasks by status', async () => {
    const req = {
      query: { sortBy: 'status', sortOrder: 'desc' },
    } as unknown as Request;

    (taskService.getAllTasks as jest.Mock).mockResolvedValue([singleMockTask]);

    await getAllTasks(req, res, next);

    expect(taskService.getAllTasks).toHaveBeenCalledWith('status', 'desc');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([singleMockTask]);
  });

  it('should sort tasks by dueDate', async () => {
    const req = {
      query: { sortBy: 'dueDate', sortOrder: 'asc' },
    } as unknown as Request;

    (taskService.getAllTasks as jest.Mock).mockResolvedValue([singleMockTask]);

    await getAllTasks(req, res, next);

    expect(taskService.getAllTasks).toHaveBeenCalledWith('dueDate', 'asc');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([singleMockTask]);
  });

  it('should return a task by ID', async () => {
    const req = {
      params: { id: '123' },
    } as unknown as Request;

    (taskService.getTaskById as jest.Mock).mockResolvedValue(singleMockTask);

    await getTaskById(req, res, next);

    expect(taskService.getTaskById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(singleMockTask);
  });

  it('should create a new task', async () => {
    const req = {
      body: singleMockTask,
    } as unknown as Request;

    (taskService.createTask as jest.Mock).mockResolvedValue(singleMockTask);

    await createTask(req, res, next);

    expect(taskService.createTask).toHaveBeenCalledWith(singleMockTask);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(singleMockTask);
  });

  it('should update a task', async () => {
    const req = {
      params: { id: '123' },
      body: { title: 'Updated Task' },
    } as unknown as Request;

    (taskService.updateTask as jest.Mock).mockResolvedValue(singleMockTask);

    await updateTask(req, res, next);

    expect(taskService.updateTask).toHaveBeenCalledWith('123', { title: 'Updated Task' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(singleMockTask);
  });

  it('should delete a task', async () => {
    const req = {
      params: { id: '123' },
    } as unknown as Request;

    (taskService.deleteTask as jest.Mock).mockResolvedValue(singleMockTask);

    await deleteTask(req, res, next);

    expect(taskService.deleteTask).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(204);
  });
  it('should default to createdAt if sortBy is invalid', async () => {
    (taskService.getAllTasks as jest.Mock).mockResolvedValue([singleMockTask]);

    const req = {
      query: { sortBy: 'invalidValue' },
    } as unknown as Request;

    await getAllTasks(req, res, next);

    expect(taskService.getAllTasks).toHaveBeenCalledWith('createdAt', 'asc');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([singleMockTask]);
  });
  it('should sort by status if sortBy=status', async () => {
    (taskService.getAllTasks as jest.Mock).mockResolvedValue([singleMockTask]);

    const req = {
      query: { sortBy: 'status', sortOrder: 'desc' },
    } as unknown as Request;

    await getAllTasks(req, res, next);

    expect(taskService.getAllTasks).toHaveBeenCalledWith('status', 'desc');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([singleMockTask]);
  });
  it('should sort by dueDate if sortBy=dueDate', async () => {
    (taskService.getAllTasks as jest.Mock).mockResolvedValue([singleMockTask]);

    const req = {
      query: { sortBy: 'dueDate', sortOrder: 'asc' },
    } as unknown as Request;

    await getAllTasks(req, res, next);

    expect(taskService.getAllTasks).toHaveBeenCalledWith('dueDate', 'asc');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([singleMockTask]);
  });
});
