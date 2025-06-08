import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

/**
 * Express middleware to handle errors thrown in routes and controllers.
 * Sends a consistent JSON response with status code and error message.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found in the database';
        break;
      default:
        statusCode = 500;
        message = 'Database operation failed';
        break;
    }
  }

  //log in non-production environments to see debug info
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
