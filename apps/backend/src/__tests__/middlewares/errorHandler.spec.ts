import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { AppError } from '../../utils/AppError';
import { MockPrismaClientKnownRequestError } from '../../__tests__/__mocks__/prismaKnown.mock';

describe('errorHandler middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockReq = {};
    mockRes = {
      status: mockStatus,
    };
  });

  it('should handle AppError with custom status and message', () => {
    const err = new AppError('Not Found', 404);

    errorHandler(err, mockReq as Request, mockRes as Response, {} as NextFunction);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Not Found',
    });
  });

  it('should handle generic Error with default 500 status', () => {
    const err = new Error('Something went wrong');

    errorHandler(err, mockReq as Request, mockRes as Response, {} as NextFunction);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
    });
  });

  it('should handle Prisma P2025 error as 404', () => {
    const err: Error = new MockPrismaClientKnownRequestError('P2025', 'Record not found');

    errorHandler(err, mockReq as Request, mockRes as Response, {} as NextFunction);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Resource not found in the database',
    });
  });

  it('should handle unknown Prisma error as 500', () => {
    const err: Error = new MockPrismaClientKnownRequestError('P9999', 'Unknown error');

    errorHandler(err, mockReq as Request, mockRes as Response, {} as NextFunction);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Database operation failed',
    });
  });
});
