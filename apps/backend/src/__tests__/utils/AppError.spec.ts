import { AppError } from '../../utils/AppError';

describe('AppError', () => {
  it('should create an error with message and default status code', () => {
    const err = new AppError('Something went wrong');

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Something went wrong');
    expect(err.statusCode).toBe(500);
    expect(err.stack).toBeDefined();
  });

  it('should use custom status code', () => {
    const err = new AppError('Not found', 404);
    expect(err.statusCode).toBe(404);
  });
});
