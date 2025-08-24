import { z } from 'zod';

export const TodoCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const TodoUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type TodoCreateInput = z.infer<typeof TodoCreateSchema>;
export type TodoUpdateInput = z.infer<typeof TodoUpdateSchema>;