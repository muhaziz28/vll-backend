import { z } from 'zod';

export const PlaceImageCreateSchema = z.object({
  imageFile: z.string().min(1, 'Image file is required'),
  imageSize: z.number().positive('Image size must be positive'),
  imagePath: z.string().min(1, 'Image path is required'),
});

export const PlaceImageUpdateSchema = z.object({
  imageFile: z.string().min(1, 'Image file is required').optional(),
  imageSize: z.number().positive('Image size must be positive').optional(),
  imagePath: z.string().min(1, 'Image path is required').optional(),
});

export type PlaceImageCreateInput = z.infer<typeof PlaceImageCreateSchema>;
export type PlaceImageUpdateInput = z.infer<typeof PlaceImageUpdateSchema>;
