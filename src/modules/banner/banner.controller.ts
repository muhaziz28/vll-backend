import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import createError from 'http-errors';
import path from 'path';
import { bannerService } from './banner.service';
import { BannerCreateSchema, BannerUpdateSchema } from './banner.types';

export async function listBanners(_req: Request, res: Response) {
  const items = await bannerService.list();
  res.json({ items });
}

export async function getBanner(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(createError(400, 'Invalid banner ID'));

  const item = await bannerService.getById(id);
  if (!item) return next(createError(404, 'Banner not found'));

  res.json(item);
}

export async function createBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const bannerData = { ...req.body };

    if (bannerData.isActive !== undefined) {
      bannerData.isActive = bannerData.isActive === 'true' || bannerData.isActive === true;
    }

    if (bannerData.order !== undefined && typeof bannerData.order === 'string') {
      bannerData.order = parseInt(bannerData.order);
    }

    if (req.file) {
      bannerData.imageFile = req.file.filename;
      bannerData.imageSize = req.file.size;
      bannerData.imagePath = `uploads/${req.file.filename}`;
      bannerData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const parse = BannerCreateSchema.safeParse(bannerData);
    if (!parse.success) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return next(createError(400, parse.error.message));
    }

    const created = await bannerService.create(parse.data);
    res.status(201).json(created);
  } catch (_e) {
    if (req.file) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return next(createError(500, 'Failed to create banner'));
  }
}

export async function updateBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(createError(400, 'Invalid banner ID'));

    const existingBanner = await bannerService.getById(id);
    if (!existingBanner) return next(createError(404, 'Banner not found'));

    const updateData = { ...req.body };

    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    if (updateData.order !== undefined && typeof updateData.order === 'string') {
      updateData.order = parseInt(updateData.order);
    }

    if (req.file) {
      updateData.imageFile = req.file.filename;
      updateData.imageSize = req.file.size;
      updateData.imagePath = `uploads/${req.file.filename}`;
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const parse = BannerUpdateSchema.safeParse(updateData);
    if (!parse.success) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return next(createError(400, parse.error.message));
    }

    const updated = await bannerService.update(id, parse.data);

    if (req.file && existingBanner.imagePath) {
      const oldFilePath = path.join(process.cwd(), 'public', existingBanner.imagePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.json(updated);
  } catch (_e) {
    if (req.file) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return next(createError(500, 'Failed to update banner'));
  }
}

export async function deleteBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(createError(400, 'Invalid banner ID'));

    const banner = await bannerService.getById(id);
    if (!banner) return next(createError(404, 'Banner not found'));

    if (banner.imagePath) {
      const filePath = path.join(process.cwd(), 'public', banner.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await bannerService.remove(id);
    res.status(204).send();
  } catch (_e) {
    return next(createError(404, 'Banner not found'));
  }
}

export async function getActiveBanners(_req: Request, res: Response) {
  const items = await bannerService.getActiveBanners();
  res.json({ items });
}
