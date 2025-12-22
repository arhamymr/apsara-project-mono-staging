import type { SerializedEditorState } from 'lexical';

export const initialEditorState = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

/**
 * Extract plain text from Lexical editor state for excerpt
 */
export function extractTextFromLexical(state: SerializedEditorState, maxLength = 200): string {
  const texts: string[] = [];

  function traverse(node: unknown) {
    if (!node || typeof node !== 'object') return;
    const n = node as Record<string, unknown>;

    if (n.type === 'text' && typeof n.text === 'string') {
      texts.push(n.text);
    }

    if (Array.isArray(n.children)) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }

  traverse(state.root);
  const fullText = texts.join(' ').replace(/\s+/g, ' ').trim();

  if (fullText.length <= maxLength) return fullText;
  return fullText.slice(0, maxLength).trim() + '...';
}

/**
 * Convert title to URL-friendly slug
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
