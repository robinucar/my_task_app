import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

/**
 * Middleware to validate request data (body, query, or params) using a Zod schema.
 *
 * @template T - The expected Zod schema shape.
 * @param schema - A Zod schema to validate against.
 * @param target - Which part of the request to validate: 'body' | 'query' | 'params'. Defaults to 'body'.
 * @returns An Express middleware function for validation.
 */
export const zodValidator = <T extends ZodTypeAny>(
  schema: T,
  target: 'body' | 'query' | 'params' = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[target];
    const result = schema.safeParse(data);

    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }

    req[target] = result.data;
    next();
  };
};
