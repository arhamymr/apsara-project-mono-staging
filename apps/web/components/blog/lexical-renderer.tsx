import React from 'react';

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

/**
 * Render Lexical JSON content with proper styling matching the editor
 */
export function LexicalRenderer({ content }: { content: string | object }) {
  let state: LexicalState;

  try {
    if (typeof content === 'string') {
      state = JSON.parse(content);
    } else {
      state = content as LexicalState;
    }
  } catch (error) {
    console.error('Error parsing Lexical content:', error);
    return <div>Error rendering content</div>;
  }

  if (!state.root) {
    return <div>No content</div>;
  }

  return <div className="space-y-4">{renderNode(state.root)}</div>;
}

function renderNode(node: LexicalNode, key?: string): React.ReactNode {
  if (!node) return null;

  const baseKey = key || `${node.type}-${Math.random()}`;

  switch (node.type) {
    case 'text':
      return renderText(node, baseKey);

    case 'paragraph':
      return (
        <p key={baseKey} className="leading-7 [&:not(:first-child)]:mt-6">
          {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
        </p>
      );

    case 'heading':
      const level = node.detail || 1;
      const headingClasses = {
        1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
        4: 'scroll-m-20 text-xl font-semibold tracking-tight',
        5: 'scroll-m-20 text-lg font-semibold tracking-tight',
        6: 'scroll-m-20 text-base font-semibold tracking-tight',
      };
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={baseKey} className={headingClasses[level as keyof typeof headingClasses] || ''}>
          {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
        </HeadingTag>
      );

    case 'list':
      const isOrdered = node.detail === 1;
      const ListTag = isOrdered ? 'ol' : 'ul';
      const listClasses = isOrdered
        ? 'm-0 p-0 list-decimal [&>li]:mt-2'
        : 'm-0 p-0 list-outside [&>li]:mt-2';
      return (
        <ListTag key={baseKey} className={listClasses}>
          {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
        </ListTag>
      );

    case 'listitem':
      return (
        <li key={baseKey} className="mx-8">
          {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
        </li>
      );

    case 'quote':
      return (
        <blockquote key={baseKey} className="mt-6 border-l-2 pl-6 italic">
          {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
        </blockquote>
      );

    case 'code':
    case 'codeblock':
      return (
        <pre key={baseKey} className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
          </code>
        </pre>
      );

    case 'linebreak':
      return <br key={baseKey} />;

    case 'root':
      return (
        <div key={baseKey}>
          {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
        </div>
      );

    default:
      // For unknown types, try to render children
      if (node.children && node.children.length > 0) {
        return (
          <div key={baseKey}>
            {(node.children || []).map((child, i) => renderNode(child, `${baseKey}-${i}`))}
          </div>
        );
      }
      return null;
  }
}

function renderText(node: LexicalNode, key: string): React.ReactNode {
  let text = node.text || '';
  const format = node.format || 0;

  // Apply text formatting
  // Format flags: 1 = bold, 2 = italic, 4 = strikethrough, 8 = underline, 16 = code
  if (format & 16) {
    // Code format
    return (
      <code key={key} className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-sm">
        {text}
      </code>
    );
  }

  let element: React.ReactNode = text;

  if (format & 1) {
    element = <strong key={`${key}-bold`}>{element}</strong>;
  }
  if (format & 2) {
    element = <em key={`${key}-italic`}>{element}</em>;
  }
  if (format & 4) {
    element = <s key={`${key}-strike`}>{element}</s>;
  }
  if (format & 8) {
    element = <u key={`${key}-underline`}>{element}</u>;
  }

  return element;
}
