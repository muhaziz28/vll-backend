import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { PlaceImage } from '@app/generated/prisma';
import { ResponseHelper } from '@app/lib/response-handler';
import { formatValidationError } from '@app/lib/validation-error';
import { placeImageDTOMapper, placeImagesDTOMapper } from './place-image.mapper';
import { placeImageService } from './place-image.service';
import { PlaceImageCreateSchema } from './place-image.types';
import { placeService } from '../place/place.service';

export async function listPlaceImages(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const place = placeService.getById(id);
    if (!place) {
      return ResponseHelper.notFound(res);
    }

    const items = await placeImageService.list(id);
    return ResponseHelper.success(res, placeImagesDTOMapper(items));
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function createPlaceImage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const place = await placeService.getById(id);
    if (!place) {
      return ResponseHelper.notFound(res);
    }

    const placeData: PlaceImage = { ...req.body };

    if (req.file) {
      placeData.imageFile = req.file.filename;
      placeData.imageSize = req.file.size;
      placeData.imagePath = `uploads/${req.file.filename}`;
    }

    const parsed = PlaceImageCreateSchema.safeParse(placeData);
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

    const data = await placeImageService.create(id, parsed.data);
    return ResponseHelper.created(res, placeImageDTOMapper(data));
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

export async function deletePlaceImage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid place image ID');

    const placeImage = await placeImageService.getById(id);
    if (!placeImage) return ResponseHelper.notFound(res, 'Place image not found');

    if (placeImage.imagePath) {
      const filePath = path.join(process.cwd(), 'public', placeImage.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await placeImageService.remove(id);

    return ResponseHelper.success(res, null, 'Place image deleted succesfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}
