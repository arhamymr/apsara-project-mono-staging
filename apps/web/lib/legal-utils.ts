/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Generate table of contents items from DOM headings
 * Note: This function uses browser APIs and should only be called in client components
 */
export function generateTOCFromDOM(): Array<{
  id: string;
  title: string;
  level: number;
}> {
  // SSR safety check
  if (typeof document === 'undefined') {
    return [];
  }

  const sections = document.querySelectorAll('section[id]');
  const tocItems: Array<{ id: string; title: string; level: number }> = [];

  sections.forEach((section) => {
    const heading = section.querySelector('h2, h3');
    if (heading && section.id) {
      const level = heading.tagName === 'H2' ? 1 : 2;
      tocItems.push({
        id: section.id,
        title: heading.textContent || '',
        level,
      });
    }
  });

  return tocItems;
}
