import { z } from 'zod';

export const cardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z
    .string()
    .max(2000, 'Description too long')
    .optional()
    .nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  assignee_id: z.number().nullable().optional(),
});

export const columnSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

export const boardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
});

export type CardFormData = z.infer<typeof cardSchema>;
export type ColumnFormData = z.infer<typeof columnSchema>;
export type BoardFormData = z.infer<typeof boardSchema>;
