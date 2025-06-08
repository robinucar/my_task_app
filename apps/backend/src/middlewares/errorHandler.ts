import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

/**
 * Global error handler middleware for Express.
 */
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found in the database';
        break;
      case 'P2002':
        statusCode = 409;
        // We might add user authentication in the future, so we can use a more specific message
        message = 'Unique constraint violation';
        break;
      // assigning a task to a user who doesn't exist in the future
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;
      default:
        statusCode = 500;
        message = 'Database operation failed';
        break;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid Prisma input data';
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
