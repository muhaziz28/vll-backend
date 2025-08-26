import { z } from 'zod';

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export const RefreshSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

export const GoogleSignInSchema = z
  .object({
    idToken: z.string().min(1),
  })
  .strict();

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
export type GoogleSignInInput = z.infer<typeof GoogleSignInSchema>;
