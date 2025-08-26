import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Place } from '@app/generated/prisma';
import { ResponseHelper } from '@app/lib/response-handler';
import { stringToBoolean } from '@app/lib/string-to-boolean';
import { formatValidationError } from '@app/lib/validation-error';
import { placesDTOMapper } from './place.mapper';
import { placeService } from './place.service';
import { PlaceCreateSchema, PlaceUpdateSchema } from './place.type';

export async function listPlaces(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive = 'true',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    if (isNaN(pageNum) || pageNum < 1) {
      return ResponseHelper.badRequest(res, 'Invalid page number');
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return ResponseHelper.badRequest(res, 'Invalid limit (1-100)');
    }

    const result = await placeService.list({
      page: pageNum,
      limit: limitNum,
      search: search as string,
      sortBy: sortBy as string,
      isActive: stringToBoolean(isActive as string),
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    return ResponseHelper.successWithPagination(
      res,
      placesDTOMapper(result.items),
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      'Places retrieved successfully',
    );
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);
    return next(e);
  }
}

export async function createPlace(req: Request, res: Response, next: NextFunction) {
  try {
    const placeData: Place = { ...req.body };

    if (placeData.isActive !== undefined) {
      placeData.isActive =
        placeData.isActive === stringToBoolean('true') || placeData.isActive === true;
    }

    if (placeData.latitude && !isNaN(Number(placeData.latitude))) {
      placeData.latitude = parseFloat(placeData.latitude.toString());
    }
    if (placeData.longitude && !isNaN(Number(placeData.longitude))) {
      placeData.longitude = parseFloat(placeData.longitude.toString());
    }

    if (req.file) {
      placeData.imageFile = req.file.filename;
      placeData.imageSize = req.file.size;
      placeData.imagePath = `uploads/${req.file.filename}`;
    }

    const parsed = PlaceCreateSchema.safeParse(placeData);
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

    const data = await placeService.create(parsed.data);
    return ResponseHelper.created(res, data);
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

export async function updatePlace(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const existingPlace = await placeService.getById(id);
    if (!existingPlace) return ResponseHelper.notFound(res, 'Place not found');

    const updateData: Place = { ...req.body };

    if (updateData.isActive !== undefined) {
      updateData.isActive =
        updateData.isActive === stringToBoolean('true') || updateData.isActive === true;
    }

    if (updateData.latitude && !isNaN(Number(updateData.latitude))) {
      updateData.latitude = parseFloat(updateData.latitude.toString());
    }
    if (updateData.longitude && !isNaN(Number(updateData.longitude))) {
      updateData.longitude = parseFloat(updateData.longitude.toString());
    }

    if (req.file) {
      updateData.imageFile = req.file.filename;
      updateData.imageSize = req.file.size;
      updateData.imagePath = `uploads/${req.file.filename}`;
    }

    const parsed = PlaceUpdateSchema.safeParse(updateData);
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

    const updated = await placeService.update(id, parsed.data);

    if (req.file && existingPlace.imagePath) {
      const oldFilePath = path.join(process.cwd(), 'public', existingPlace.imagePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    return ResponseHelper.success(res, updated);
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

export async function getPlace(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const place = await placeService.getById(id);
    if (!place) {
      return ResponseHelper.notFound(res);
    }
    return ResponseHelper.success(res, place);
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);
    return next(e);
  }
}

export async function deletePlace(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const banner = await placeService.getById(id);
    if (!banner) return ResponseHelper.notFound(res, 'Place not found');

    if (banner.imagePath) {
      const filePath = path.join(process.cwd(), 'public', banner.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await placeService.remove(id);

    return ResponseHelper.success(res, null, 'Place deleted succesfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}
