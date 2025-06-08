import { Prisma } from '@prisma/client';

/**
 * Mocks a PrismaClientKnownRequestError for testing purposes.
 * Allows to simulate known Prisma errors (like P2025) in unit tests.
 */
export class MockPrismaClientKnownRequestError extends Error {
  /**
   * The Prisma error code (e.g., 'P2025').
   */
  code: string;

  /**
   * Constructs a mock PrismaClientKnownRequestError.
   *
   * @param code - The Prisma error code to simulate
   * @param message - The error message
   */
  constructor(code: string, message: string) {
    super(message);
    this.code = code;

    // Make instanceof Prisma.PrismaClientKnownRequestError pass in tests
    Object.setPrototypeOf(this, Prisma.PrismaClientKnownRequestError.prototype);
  }
}
