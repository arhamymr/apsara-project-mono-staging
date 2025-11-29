import * as z from 'zod';

export const websiteFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Title is required')
    .regex(/^[^0-9]*$/, 'Name cannot contain numbers'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
  structure: z.any(),
  currentSlug: z.string().optional(),
});

export type WebsiteFormData = z.infer<typeof websiteFormSchema>;
