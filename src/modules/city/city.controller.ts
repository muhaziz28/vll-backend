import { NextFunction, Request, Response } from 'express';
import { ResponseHelper } from '@app/lib/response-handler';
import { cityService } from './city.service';

export async function listKecamatan(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await cityService.getAll();

    return ResponseHelper.success(res, result);
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}
