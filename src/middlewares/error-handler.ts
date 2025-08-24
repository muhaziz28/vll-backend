import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { logger } from '@app/lib/logger';

// Not found handler
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

// Error handler
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const httpErr = createError.isHttpError(err) ? err : createError(500, 'Internal Server Error');

  const status = httpErr.status || 500;
  const payload = {
    status,
    name: httpErr.name,
    message: httpErr.message,
  } as const;

  if (status >= 500) {
    logger.error({ err: httpErr }, 'Unhandled error');
  } else {
    logger.warn({ err: httpErr }, 'Client error');
  }

  res.status(status).json(payload);
};