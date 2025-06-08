import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * Middleware to validate the request body using a Zod schema.
 *
 * @template T - The expected shape of the request body as a Zod schema.
 * @param schema - A Zod schema that defines and validates the shape of the request body.
 * @returns An Express middleware function that validates the request body.
 *
 * If validation passes, the parsed data is assigned to `req.body` and `next()` is called.
 * If validation fails, a 400 Bad Request response is returned with error details.
 */
export const validate = <T extends ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }

    req.body = result.data;
    next();
  };
};
