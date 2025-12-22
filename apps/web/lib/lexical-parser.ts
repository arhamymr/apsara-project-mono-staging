/**
 * Parse Lexical JSON editor state and convert to HTML
 */

interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  format?: number;
  style?: string;
  detail?: number;
  mode?: string;
  textFormat?: number;
  textStyle?: string;
  direction?: string | null;
  indent?: number;
  version?: number;
}

interface LexicalState {
  root?: LexicalNode;
}

function formatText(text: string, format: number): string {
  let result = text;
  
  // Format flags: 1 = bold, 2 = italic, 4 = strikethrough, 8 = underline, 16 = code
  if (format & 1) result = `<strong>${result}</strong>`;
  if (format & 2) result = `<em>${result}</em>`;
  if (format & 4) result = `<s>${result}</s>`;
  if (format & 8) result = `<u>${result}</u>`;
  if (format & 16) result = `<code>${result}</code>`;
  
  return result;
}

function parseNode(node: LexicalNode): string {
  if (!node) return '';

  switch (node.type) {
    case 'text':
      return formatText(node.text || '', node.format || 0);

    case 'paragraph':
      const paragraphContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<p>${paragraphContent}</p>`;

    case 'heading':
      const level = node.detail || 1;
      const headingContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<h${level}>${headingContent}</h${level}>`;

    case 'list':
      const listType = node.detail === 1 ? 'ol' : 'ul';
      const listContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<${listType}>${listContent}</${listType}>`;

    case 'listitem':
      const itemContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<li>${itemContent}</li>`;

    case 'quote':
      const quoteContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<blockquote>${quoteContent}</blockquote>`;

    case 'code':
      const codeContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<pre><code>${codeContent}</code></pre>`;

    case 'codeblock':
      const blockContent = (node.children || [])
        .map(parseNode)
        .join('');
      return `<pre><code>${blockContent}</code></pre>`;

    case 'root':
      return (node.children || [])
        .map(parseNode)
        .join('');

    case 'linebreak':
      return '<br />';

    default:
      // For unknown types, try to render children
      if (node.children && node.children.length > 0) {
        return (node.children || [])
          .map(parseNode)
          .join('');
      }
      return '';
  }
}

export function parseLexicalJSON(jsonString: string | object): string {
  try {
    let state: LexicalState;

    if (typeof jsonString === 'string') {
      state = JSON.parse(jsonString);
    } else {
      state = jsonString as LexicalState;
    }

    if (!state.root) {
      return '';
    }

    return parseNode(state.root);
  } catch (error) {
    console.error('Error parsing Lexical JSON:', error);
    return '';
  }
}

/**
 * Extract plain text from Lexical JSON (for excerpts, previews, etc.)
 */
export function extractPlainText(jsonString: string | object): string {
  try {
    let state: LexicalState;

    if (typeof jsonString === 'string') {
      state = JSON.parse(jsonString);
    } else {
      state = jsonString as LexicalState;
    }

    function extractText(node: LexicalNode): string {
      if (!node) return '';

      if (node.type === 'text') {
        return node.text || '';
      }

      if (node.children) {
        return node.children.map(extractText).join('');
      }

      return '';
    }

    if (!state.root) {
      return '';
    }

    return extractText(state.root);
  } catch (error) {
    console.error('Error extracting plain text:', error);
    return '';
  }
}
