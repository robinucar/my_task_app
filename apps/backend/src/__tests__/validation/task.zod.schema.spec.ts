import { createTaskSchema, updateTaskSchema } from '../../validation/task.zod.schema';

describe('createTaskSchema', () => {
  it('validates a complete and correct payload', () => {
    const input = {
      title: 'Call Hospital',
      description: 'Call the hospital to confirm appointment',
      dueDate: '2025-06-10',
      status: 'IN_PROGRESS',
    };
    const result = createTaskSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dueDate).toBeInstanceOf(Date);
    }
  });

  it('fails when title is missing', () => {
    const result = createTaskSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title');
    }
  });

  it('coerces dueDate string to Date object', () => {
    const result = createTaskSchema.parse({
      title: 'Date coercion test',
      dueDate: '2025-12-31',
    });
    expect(result.dueDate).toBeInstanceOf(Date);
  });
});

describe('updateTaskSchema', () => {
  it('validates partial update with title only', () => {
    const result = updateTaskSchema.safeParse({ title: 'Updated title' });
    expect(result.success).toBe(true);
  });

  it('validates partial update with status only', () => {
    const result = updateTaskSchema.safeParse({ status: 'COMPLETED' });
    expect(result.success).toBe(true);
  });

  it('fails with invalid status value', () => {
    const result = updateTaskSchema.safeParse({ status: 'DONE' });
    expect(result.success).toBe(false);
  });

  it('fails if title is an empty string', () => {
    const result = updateTaskSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });
});
