import { IPageData } from './types';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const ensureUnique = (base: string, taken: Set<string>) => {
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
};

export const ensureUniquePath = (
  basePath: string,
  pages: Record<string, IPageData>,
) => {
  const taken = new Set(Object.values(pages).map((p) => p.path));
  if (!taken.has(basePath)) return basePath;
  let i = 2;
  while (taken.has(`${basePath}-${i}`)) i++;
  return `${basePath}-${i}`;
};
