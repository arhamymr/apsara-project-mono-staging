'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import type { MarkdownRendererProps } from '../types';

/**
 * MarkdownRenderer Component
 * 
 * Renders markdown content with proper formatting including:
 * - Headings (h1-h6)
 * - Paragraphs
 * - Lists (ordered and unordered)
 * - Links
 * - Code blocks with copy functionality
 * - Inline code
 * - Blockquotes
 * - Tables (via remark-gfm)
 * - Horizontal rules
 * - Bold and italic text
 * 
 * Requirements: 1.3
 */
export function MarkdownRenderer({ content, onCopyCode }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium mt-4 mb-2">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium mt-3 mb-1">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium mt-3 mb-1 text-muted-foreground">{children}</h6>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="mb-4 ml-4 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-4 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground/90">{children}</li>
          ),
          
          // Code - handle both inline and block
          code: ({ className, children, ...props }) => {
            // Check if this is a code block (has language class) or inline code
            const match = /language-(\w+)/.exec(className || '');
            const isCodeBlock = match || (className && className.includes('language-'));
            
            // For inline code (no language class and not in a pre tag)
            if (!isCodeBlock) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            // For code blocks, extract the code content
            const codeContent = String(children).replace(/\n$/, '');
            const language = match ? match[1] : undefined;
            
            return (
              <CodeBlock
                code={codeContent}
                language={language}
                onCopy={onCopyCode}
              />
            );
          },
          
          // Pre tag - just pass through, CodeBlock handles the styling
          pre: ({ children }) => <>{children}</>,
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline underline-offset-2 hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground mb-4">
              {children}
            </blockquote>
          ),
          
          // Horizontal rules
          hr: () => <hr className="my-6 border-border" />,
          
          // Bold
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          
          // Italic
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          
          // Tables (GFM)
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-sm font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm">{children}</td>
          ),
          
          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-md max-w-full h-auto my-4"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
