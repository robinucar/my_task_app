/**
 * Custom application error that includes an HTTP status code.
 * Extends the built-in Error object for centralized error handling.
 */
export class AppError extends Error {
  /** HTTP status code to send in the response (e.g., 404, 500). */
  statusCode: number;

  /**
   * Constructs a new AppError instance.
   *
   * @param message - A descriptive error message
   * @param statusCode - HTTP status code to associate with the error (defaults to 500)
   */
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
