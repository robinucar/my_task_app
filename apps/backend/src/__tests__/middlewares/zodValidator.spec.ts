import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/zodValidator';

describe('validate middleware', () => {
  const mockSchema = z.object({
    title: z.string().min(1),
    dueDate: z.coerce.date().optional(),
  });

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next and attach parsed data on valid input', () => {
    req.body = { title: 'Test Task', dueDate: '2025-06-30' };

    const middleware = validate(mockSchema);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ title: 'Test Task', dueDate: new Date('2025-06-30') });
  });

  it('should return 400 response on invalid input', () => {
    req.body = { title: '' };

    const middleware = validate(mockSchema);
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Object),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
