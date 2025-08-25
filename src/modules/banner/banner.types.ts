import { z } from 'zod';

export const BannerCreateSchema = z.object({
  bannerTitle: z.string().min(1, 'Banner title is required'),
  imageFile: z.string().min(1, 'Image file is required'),
  imageSize: z.number().positive('Image size must be positive'),
  imagePath: z.string().min(1, 'Image path is required'),
  isActive: z.boolean().default(true),
});

export const BannerUpdateSchema = z.object({
  bannerTitle: z.string().min(1, 'Banner title is required').optional(),
  imageFile: z.string().min(1, 'Image file is required').optional(),
  imageSize: z.number().positive('Image size must be positive').optional(),
  imagePath: z.string().min(1, 'Image path is required').optional(),
  isActive: z.boolean().optional(),
});

export type BannerCreateInput = z.infer<typeof BannerCreateSchema>;
export type BannerUpdateInput = z.infer<typeof BannerUpdateSchema>;