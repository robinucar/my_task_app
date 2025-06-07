import request from 'supertest';
import express from 'express';
import taskRoutes from '../../routes/task.routes';
import * as taskController from '../../controllers/task.controller';

jest.mock('../../controllers/task.controller');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

describe('Task Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/tasks should call getAllTasks controller', async () => {
    const mockGetAllTasks = taskController.getAllTasks as jest.Mock;
    mockGetAllTasks.mockImplementation((req, res) => res.status(200).json([]));

    await request(app).get('/api/tasks');

    expect(mockGetAllTasks).toHaveBeenCalled();
  });

  it('GET /api/tasks/:id should call getTaskById controller', async () => {
    const mockGetTaskById = taskController.getTaskById as jest.Mock;
    mockGetTaskById.mockImplementation((req, res) => res.status(200).json({}));

    await request(app).get('/api/tasks/123');

    expect(mockGetTaskById).toHaveBeenCalled();
  });

  it('POST /api/tasks should call createTask controller', async () => {
    const mockCreateTask = taskController.createTask as jest.Mock;
    mockCreateTask.mockImplementation((req, res) => res.status(201).json({}));

    await request(app).post('/api/tasks').send({
      title: 'New Task',
    });

    expect(mockCreateTask).toHaveBeenCalled();
  });

  it('PUT /api/tasks/:id should call updateTask controller', async () => {
    const mockUpdateTask = taskController.updateTask as jest.Mock;
    mockUpdateTask.mockImplementation((req, res) => res.status(200).json({}));

    await request(app).put('/api/tasks/123').send({
      title: 'Updated Task',
    });

    expect(mockUpdateTask).toHaveBeenCalled();
  });

  it('DELETE /api/tasks/:id should call deleteTask controller', async () => {
    const mockDeleteTask = taskController.deleteTask as jest.Mock;
    mockDeleteTask.mockImplementation((req, res) => res.status(200).json({}));

    await request(app).delete('/api/tasks/123');

    expect(mockDeleteTask).toHaveBeenCalled();
  });
});
