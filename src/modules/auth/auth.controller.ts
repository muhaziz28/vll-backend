import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { AuthenticatedRequest } from '@app/middlewares/require-auth';
import { authService } from './auth.service';
import { GoogleSignInSchema, LoginSchema, RefreshSchema, RegisterSchema } from './auth.types';

export async function register(req: Request, res: Response, next: NextFunction) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return next(createError(400, parsed.error.message));
  try {
    const { email, password, name } = parsed.data;
    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Registration failed';
    next(createError(400, msg));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return next(createError(400, parsed.error.message));
  try {
    const { email, password } = parsed.data;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid credentials';
    next(createError(401, msg));
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const parsed = RefreshSchema.safeParse(req.body);
  if (!parsed.success) return next(createError(400, parsed.error.message));
  try {
    const result = await authService.refresh(parsed.data.refreshToken);
    res.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid refresh token';
    next(createError(401, msg));
  }
}

export async function googleSignIn(req: Request, res: Response, next: NextFunction) {
  const parsed = GoogleSignInSchema.safeParse(req.body);
  if (!parsed.success) return next(createError(400, parsed.error.message));
  try {
    const result = await authService.googleSignIn(parsed.data.idToken);
    res.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Google sign-in failed';
    next(createError(401, msg));
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  res.json({ userId: req.user?.userId, email: req.user?.email });
}