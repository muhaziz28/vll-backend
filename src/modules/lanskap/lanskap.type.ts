import { z } from 'zod';

export interface ILanskap {
  id: number;
  name: string;
  description?: string | null;
  file: string;
  fileSize: number;
  filePath: string;
}

export const LanskapCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Decription is required'),
  file: z.string().min(1, 'File is required'),
  fileSize: z.number().positive('File size must be positive'),
  filePath: z.string().min(1, 'File path is required'),
});

export const LanskapUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Decription is required').optional(),
  file: z.string().min(1, 'File file is required').optional(),
  fileSize: z.number().positive('File size must be positive').optional(),
  filePath: z.string().min(1, 'File path is required').optional(),
});

export type LanskapCreateInput = z.infer<typeof LanskapCreateSchema>;
export type LanskapUpdateInput = z.infer<typeof LanskapUpdateSchema>;
