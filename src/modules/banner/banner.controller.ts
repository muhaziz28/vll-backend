import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { Banner } from '@app/generated/prisma';
import { ResponseHelper } from '@app/lib/response-handler';
import { stringToBoolean } from '@app/lib/string-to-boolean';
import { formatValidationError } from '@app/lib/validation-error';
import { bannerDTOMapper, bannersDTOMapper } from './banner.mapper';
import { bannerService } from './banner.service';
import { BannerCreateSchema, BannerUpdateSchema } from './banner.types';

export async function listBanners(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await bannerService.list();

    return ResponseHelper.success(res, bannersDTOMapper(items));
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function getBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid banner ID');

    const item = await bannerService.getById(id);
    if (!item) return ResponseHelper.notFound(res, 'Banner not found');

    return ResponseHelper.success(res, bannerDTOMapper(item));
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function createBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const bannerData: Banner = { ...req.body };

    if (bannerData.isActive !== undefined) {
      bannerData.isActive =
        bannerData.isActive === stringToBoolean('true') || bannerData.isActive === true;
    }

    if (req.file) {
      bannerData.imageFile = req.file.filename;
      bannerData.imageSize = req.file.size;
      bannerData.imagePath = `uploads/${req.file.filename}`;
    }

    const parsed = BannerCreateSchema.safeParse(bannerData);
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

    const data = await bannerService.create(parsed.data);
    return ResponseHelper.created(res, bannerDTOMapper(data));
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

export async function updateBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid banner ID');

    const existingBanner = await bannerService.getById(id);
    if (!existingBanner) return ResponseHelper.notFound(res, 'Banner not found');

    const updateData: Banner = { ...req.body };

    if (updateData.isActive !== undefined) {
      updateData.isActive =
        updateData.isActive === stringToBoolean('true') || updateData.isActive === true;
    }

    if (req.file) {
      updateData.imageFile = req.file.filename;
      updateData.imageSize = req.file.size;
      updateData.imagePath = `uploads/${req.file.filename}`;
    }

    const parsed = BannerUpdateSchema.safeParse(updateData);
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

    const updated = await bannerService.update(id, parsed.data);

    if (req.file && existingBanner.imagePath) {
      const oldFilePath = path.join(process.cwd(), 'public', existingBanner.imagePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return ResponseHelper.success(res, bannerDTOMapper(updated));
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

export async function deleteBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return ResponseHelper.badRequest(res, 'Invalid banner ID');

    const banner = await bannerService.getById(id);
    if (!banner) return ResponseHelper.notFound(res, 'Banner not found');

    if (banner.imagePath) {
      const filePath = path.join(process.cwd(), 'public', banner.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await bannerService.remove(id);

    return ResponseHelper.success(res, null, 'Banner deleted succesfully');
  } catch (e) {
    if (e instanceof Error) return ResponseHelper.forbidden(res, e.message);

    return next(e);
  }
}

export async function getActiveBanners(_req: Request, res: Response) {
  const items = await bannerService.getActiveBanners();
  return ResponseHelper.success(res, bannersDTOMapper(items));
}
