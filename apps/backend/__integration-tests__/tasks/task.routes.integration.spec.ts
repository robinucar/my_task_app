import request from 'supertest';
import { app } from '../../src/main';
import prisma from '../../src/client';

/**This file contains integration tests for the task management API */
beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/tasks', () => {
  it('should create a task when valid data is sent', async () => {
    const newTask = {
      title: 'Integration Test Task',
      description: 'This is a test task',
      dueDate: new Date().toISOString(),
      status: 'PENDING',
    };

    const res = await request(app).post('/api/tasks').send(newTask).expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newTask.title);
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({}).expect(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if title is an empty string', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '' }).expect(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if title exceeds max length', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'a'.repeat(101),
      })
      .expect(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if description exceeds max length', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Valid Title',
        description: 'a'.repeat(501),
      })
      .expect(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if dueDate is invalid', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test',
        dueDate: 'invalid-date',
      })
      .expect(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if status is invalid', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test',
        status: 'INVALID',
      })
      .expect(400);
    expect(res.body.error).toBeDefined();
  });

  it('should create task with only required fields', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Only Required',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Only Required');
  });
});

describe('GET /api/tasks', () => {
  it('should return all tasks', async () => {
    await prisma.task.createMany({
      data: [{ title: 'Task 1' }, { title: 'Task 2', status: 'IN_PROGRESS' }],
    });

    const res = await request(app).get('/api/tasks').expect(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('title');
  });
});

describe('PUT /api/tasks/:id', () => {
  let taskId: string;

  beforeEach(async () => {
    const task = await prisma.task.create({
      data: { title: 'Old Title' },
    });
    taskId = task.id;
  });

  it('should update task with valid data', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Title', status: 'COMPLETED' })
      .expect(200);

    expect(res.body.title).toBe('Updated Title');
    expect(res.body.status).toBe('COMPLETED');
  });

  it('should return 400 for invalid update data', async () => {
    const res = await request(app).put(`/api/tasks/${taskId}`).send({ title: '' }).expect(400);

    expect(res.body.error).toBeDefined();
  });

  it('should return 404 if task does not exist', async () => {
    const res = await request(app)
      .put('/api/tasks/nonexistent-id')
      .send({ title: 'New' })
      .expect(404);

    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe('Task not found');
  });
});

describe('DELETE /api/tasks/:id', () => {
  let taskId: string;

  beforeEach(async () => {
    const task = await prisma.task.create({
      data: { title: 'To be deleted' },
    });
    taskId = task.id;
  });

  it('should delete the task', async () => {
    await request(app).delete(`/api/tasks/${taskId}`).expect(204);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    expect(task).toBeNull();
  });

  it('should return 404 if task does not exist', async () => {
    await request(app).delete('/api/tasks/nonexistent-id').expect(404);
  });
});
