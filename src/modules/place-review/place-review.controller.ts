/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ResponseHelper } from '@app/lib/response-handler';
import { stringToBoolean } from '@app/lib/string-to-boolean';
import { formatValidationError } from '@app/lib/validation-error';
import { AuthenticatedRequest } from '@app/middlewares/require-auth';
import { placeReviewService } from './place-review.service';
import { PlaceReviewCreateSchema } from './place-review.types';
import { placeService } from '../place/place.service';

export async function getReviewByPlace(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const place = placeService.getById(parseId);
    if (!place) {
      return ResponseHelper.notFound(res);
    }

    const items = await placeReviewService.getByPlace(parseId);
    return ResponseHelper.success(res, items);
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function createReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return ResponseHelper.badRequest(res, 'Invalid place ID');

    const reviewData = { ...req.body };

    if (reviewData.isActive !== undefined) {
      reviewData.isActive =
        reviewData.isActive === stringToBoolean('true') || reviewData.isActive === true;
    }

    if (reviewData.rating !== undefined) {
      reviewData.rating = parseInt(reviewData.rating.toString());
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      reviewData.attachments = req.files.map((file: any) => ({
        imageFile: file.filename,
        imageSize: file.size,
        imagePath: `uploads/${file.filename}`,
      }));
    } else if (req.file) {
      reviewData.attachments = [
        {
          imageFile: req.file.filename,
          imageSize: req.file.size,
          imagePath: `uploads/${req.file.filename}`,
        },
      ];
    }

    const parsed = PlaceReviewCreateSchema.safeParse(reviewData);
    if (!parsed.success) {
      await cleanupUploadedFiles(req);
      const errors = formatValidationError(parsed);
      return ResponseHelper.validationError(res, errors!);
    }

    const userId = req.user?.userId ?? '';
    const data = await placeReviewService.createReview(parseId, userId, parsed.data);
    return ResponseHelper.created(res, data);
  } catch (e) {
    await cleanupUploadedFiles(req);

    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

async function cleanupUploadedFiles(req: AuthenticatedRequest) {
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    for (const file of req.files) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  if (req.file) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
