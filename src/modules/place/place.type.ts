import { z } from 'zod';

export interface IPlace {
  id: number;
  title: string;
  description_id: string;
  description_mi: string;
  description_en: string;
  address: string;
  imageFile: string;
  imageSize: number;
  imagePath: string;
  latitude: number;
  longitude: number;
  reviewSummary: {
    totalReviews: number;
    totalValidRatings: number;
    totalRating: number;
    averageRating: number;
  };
  city: string;
  province: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const PlaceCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description_id: z.string().min(1, 'Decription ID is required'),
  description_mi: z.string().min(1, 'Decription MI is required'),
  description_en: z.string().min(1, 'Decription EN is required'),
  address: z.string().min(1, 'Address is required'),
  imageFile: z.string().min(1, 'Image file is required'),
  imageSize: z.number().positive('Image size must be positive'),
  imagePath: z.string().min(1, 'Image path is required'),
  latitude: z.number().min(1, 'Latitude is required'),
  longitude: z.number().min(1, 'Longitude is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  isActive: z.boolean().default(true),
});

export const PlaceUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description_id: z.string().min(1, 'Decription ID is required').optional(),
  description_mi: z.string().min(1, 'Decription MI is required').optional(),
  description_en: z.string().min(1, 'Decription EN is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  imageFile: z.string().min(1, 'Image file is required').optional(),
  imageSize: z.number().positive('Image size must be positive').optional(),
  imagePath: z.string().min(1, 'Image path is required').optional(),
  latitude: z.number().min(1, 'Latitude is required').optional(),
  longitude: z.number().min(1, 'Longitude is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  province: z.string().min(1, 'Province is required').optional(),
  isActive: z.boolean().optional(),
});

export type PlaceCreateInput = z.infer<typeof PlaceCreateSchema>;
export type PlaceUpdateInput = z.infer<typeof PlaceUpdateSchema>;
