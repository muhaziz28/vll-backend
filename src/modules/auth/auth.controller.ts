import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '@app/lib/response-handler';
import { formatValidationError } from '@app/lib/validation-error';
import { AuthenticatedRequest } from '@app/middlewares/require-auth';
import { authService } from './auth.service';
import { GoogleSignInSchema, LoginSchema, RefreshSchema, RegisterSchema } from './auth.types';

export async function register(req: Request, res: Response, next: NextFunction) {
  const parsed = RegisterSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = formatValidationError(parsed);
    return ResponseHelper.validationError(res, errors!);
  }

  try {
    const { email, password, name } = parsed.data;
    const result = await authService.register(email, password, name);

    return ResponseHelper.created(res, result, 'User registered successfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const parsed = LoginSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = formatValidationError(parsed);
    return ResponseHelper.validationError(res, errors!);
  }

  try {
    const { email, password } = parsed.data;
    const result = await authService.login(email, password);

    return ResponseHelper.created(res, result, 'User login successfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const parsed = RefreshSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = formatValidationError(parsed);
    return ResponseHelper.validationError(res, errors!);
  }

  try {
    const result = await authService.refresh(parsed.data.refreshToken);
    res.json(result);

    return ResponseHelper.success(res, result, 'Token refresh successfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function googleSignIn(req: Request, res: Response, next: NextFunction) {
  const parsed = GoogleSignInSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = formatValidationError(parsed);
    return ResponseHelper.validationError(res, errors!);
  }

  try {
    const result = await authService.googleSignIn(parsed.data.idToken);

    return ResponseHelper.created(res, result, 'User login successfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  return ResponseHelper.created(
    res,
    { userId: req.user?.userId, email: req.user?.email },
    'User login successfully',
  );
}
