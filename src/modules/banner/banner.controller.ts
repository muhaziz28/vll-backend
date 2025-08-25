import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { bannerService } from './banner.service';
import { BannerCreateSchema, BannerUpdateSchema } from './banner.types';
import fs from 'fs';
import path from 'path';

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
    const parse = BannerCreateSchema.safeParse(req.body);
    if (!parse.success) return next(createError(400, parse.error.message));
    
    const created = await bannerService.create(parse.data);
    res.status(201).json(created);
  } catch (error) {
    return next(createError(500, 'Failed to create banner'));
  }
}

export async function updateBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(createError(400, 'Invalid banner ID'));
    
    const parse = BannerUpdateSchema.safeParse(req.body);
    if (!parse.success) return next(createError(400, parse.error.message));
    
    const updated = await bannerService.update(id, parse.data);
    res.json(updated);
  } catch (error) {
    return next(createError(404, 'Banner not found'));
  }
}

export async function deleteBanner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(createError(400, 'Invalid banner ID'));
    
    // Get banner info before deletion to remove file
    const banner = await bannerService.getById(id);
    if (!banner) return next(createError(404, 'Banner not found'));
    
    // Delete the file if it exists
    if (banner.imagePath) {
      const filePath = path.join(process.cwd(), 'public', banner.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await bannerService.remove(id);
    res.status(204).send();
  } catch (error) {
    return next(createError(404, 'Banner not found'));
  }
}

export async function getActiveBanners(_req: Request, res: Response) {
  const items = await bannerService.getActiveBanners();
  res.json({ items });
}

export async function uploadBannerImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return next(createError(400, 'No file uploaded'));
    }

    const file = req.file;
    const fileSize = file.size;
    const fileName = file.filename || `${Date.now()}-${file.originalname}`;
    const filePath = `uploads/${fileName}`;

    res.json({
      imageFile: fileName,
      imageSize: fileSize,
      imagePath: filePath,
    });
  } catch (error) {
    return next(createError(500, 'Failed to upload file'));
  }
}