import { Request, Response, NextFunction } from 'express';
import { logger } from '@app/lib/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs)
    }, 'request completed');
  });
  next();
};