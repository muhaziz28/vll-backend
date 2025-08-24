import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '@app/config/env';

export function userAgentGuard(req: Request, res: Response, next: NextFunction) {
  const ua = (req.headers['user-agent'] || '').toString().toLowerCase();
  if (!ua) return next();
  if (env.uaDenylist.some((bad) => ua.includes(bad))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

export function apiKeyGuard(req: Request, res: Response, next: NextFunction) {
  // Only enforce for mutating methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  if (env.apiKeys.length === 0) return next();
  const apiKey = req.header('x-api-key') || '';
  if (!env.apiKeys.includes(apiKey)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export const writeRateLimiter = rateLimit({
  windowMs: env.writeRateLimitWindowMs,
  max: env.writeRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => !['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method),
});