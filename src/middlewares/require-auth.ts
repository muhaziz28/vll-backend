import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '@app/lib/jwt';

export type AuthenticatedRequest = Request & { user?: { userId: string; email?: string } };

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(createError(401, 'Missing or invalid authorization header'));
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.sub, email: payload.email };
    return next();
  } catch (_e) {
    return next(createError(401, 'Invalid or expired token'));
  }
}