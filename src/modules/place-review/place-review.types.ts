import { z } from 'zod';

const PlaceReviewAttachmentSchema = z.object({
  imageFile: z.string().min(1, 'Image file is required'),
  imageSize: z.number().positive('Image size must be positive'),
  imagePath: z.string().min(1, 'Image path is required'),
});

export const PlaceReviewCreateSchema = z.object({
  rating: z.number().min(0).max(5).optional(),
  comment: z.string().min(0).optional(),
  attachments: z.array(PlaceReviewAttachmentSchema).optional().default([]),
});

export const PlaceReviewUpdateSchema = z.object({
  rating: z.number().min(0).max(5).optional(),
  comment: z.string().min(0).optional(),
  attachments: z.array(PlaceReviewAttachmentSchema).optional(),
});

export type PlaceReviewCreateInput = z.infer<typeof PlaceReviewCreateSchema>;
export type PlaceReviewUpdateInput = z.infer<typeof PlaceReviewUpdateSchema>;
