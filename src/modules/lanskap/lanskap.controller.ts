import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ResponseHelper } from '@app/lib/response-handler';
import { formatValidationError } from '@app/lib/validation-error';
import { lanskapDTOMapper, lanskapListDTOMapper } from './lanskap.mapper';
import { lanskapService } from './lanskap.service';
import { LanskapCreateSchema, LanskapUpdateSchema } from './lanskap.type';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await lanskapService.getAll();

    return ResponseHelper.success(res, lanskapListDTOMapper(result));
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const lanskapData = { ...req.body };

    if (req.file) {
      lanskapData.file = req.file.filename;
      lanskapData.fileSize = req.file.size;
      lanskapData.filePath = `uploads/${req.file.filename}`;
    }

    const parsed = LanskapCreateSchema.safeParse(lanskapData);
    if (!parsed.success) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      const errors = formatValidationError(parsed);
      return ResponseHelper.validationError(res, errors!);
    }

    const data = await lanskapService.create(parsed.data);
    return ResponseHelper.created(res, lanskapDTOMapper(data));
  } catch (e) {
    if (req.file) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid lanskap ID');

    const existingLanskap = await lanskapService.getById(id);
    if (!existingLanskap) return ResponseHelper.notFound(res, 'Lanskap not found');

    const updateData = { ...req.body };

    if (req.file) {
      updateData.file = req.file.filename;
      updateData.fileSize = req.file.size;
      updateData.filePath = `uploads/${req.file.filename}`;
    }

    const parsed = LanskapUpdateSchema.safeParse(updateData);
    if (!parsed.success) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      const errors = formatValidationError(parsed);
      return ResponseHelper.validationError(res, errors!);
    }

    const updated = await lanskapService.update(id, parsed.data);

    if (req.file && existingLanskap.filePath) {
      const oldFilePath = path.join(process.cwd(), 'public', existingLanskap.filePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    return ResponseHelper.success(res, lanskapDTOMapper(updated));
  } catch (e) {
    if (req.file) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid lanskap ID');

    const lanskap = await lanskapService.getById(id);
    if (!lanskap) return ResponseHelper.notFound(res, 'Lanskap not found');

    if (lanskap.filePath) {
      const filePath = path.join(process.cwd(), 'public', lanskap.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await lanskapService.remove(id);

    return ResponseHelper.success(res, null, 'Lanskap deleted succesfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}
