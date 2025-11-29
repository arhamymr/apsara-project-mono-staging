import * as z from 'zod';

export const articleFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z
    .object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Category must have at least one property',
    }),
  description: z.string().min(1, 'Content is required'),
  status: z.string().min(1, 'Status is required'),
  image_url: z.string().min(1, 'Image is required'),
  author: z.any(),
  website_slugs: z.array(z.string()).optional(),
});

export type ArticleFormData = z.infer<typeof articleFormSchema>;
