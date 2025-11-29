import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { marked } from 'marked';
import * as React from 'react';
import { isValidElement, memo, Suspense, useMemo, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

const DEFAULT_PRE_BLOCK_CLASS =
  'my-3 overflow-x-auto w-fit rounded-xs bg-zinc-950 text-zinc-50 dark:bg-zinc-900 border border-border p-3 text-[10px]';

const extractTextContent = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }
  if (isValidElement(node)) {
    return extractTextContent(
      (node.props as { children?: React.ReactNode }).children,
    );
  }
  return '';
};

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
}

const HighlightedPre = memo(
  ({ children, className, language, ...props }: HighlightedPreProps) => {
    const [highlighted, setHighlighted] = React.useState<React.ReactNode>(null);

    React.useEffect(() => {
      const highlight = async () => {
        try {
          const { codeToTokens, bundledLanguages } = await import('shiki');
          const code = extractTextContent(children);

          if (!(language in bundledLanguages)) {
            setHighlighted(
              <pre
                {...props}
                className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}
              >
                <code className="whitespace-pre-wrap">{children}</code>
              </pre>,
            );
            return;
          }

          const { tokens } = await codeToTokens(code, {
            lang: language as keyof typeof bundledLanguages,
            themes: {
              light: 'github-dark',
              dark: 'github-dark',
            },
          });

          setHighlighted(
            <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
              <code className="break-all whitespace-pre-wrap">
                {tokens.map((line, lineIndex) => (
                  <span
                    key={`line-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
                      lineIndex
                    }`}
                  >
                    {line.map((token, tokenIndex) => {
                      const style =
                        typeof token.htmlStyle === 'string'
                          ? undefined
                          : token.htmlStyle;

                      return (
                        <span
                          key={`token-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
                            tokenIndex
                          }`}
                          style={style}
                        >
                          {token.content}
                        </span>
                      );
                    })}
                    {lineIndex !== tokens.length - 1 && '\n'}
                  </span>
                ))}
              </code>
            </pre>,
          );
        } catch (error) {
          console.error('Syntax highlighting failed:', error);
          setHighlighted(
            <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
              <code className="whitespace-pre-wrap">{children}</code>
            </pre>,
          );
        }
      };

      highlight();
    }, [children, className, language, props]);

    return (
      highlighted || (
        <pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
          <code className="whitespace-pre-wrap">{children}</code>
        </pre>
      )
    );
  },
);

HighlightedPre.displayName = 'HighlightedPre';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
}

const CodeBlock = ({
  children,
  language,
  className,
  ...props
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const code = extractTextContent(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <Accordion type="single" collapsible className="my-2 w-full">
      <AccordionItem value="code" className="rounded-lg border">
        <AccordionTrigger className="px-3 py-1.5 text-xs hover:no-underline">
          <div className="flex w-full items-center justify-between pr-2">
            <span className="text-muted-foreground text-xs font-medium">
              {language || 'Code'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="h-6 px-2 text-[10px]"
            >
              {copied ? (
                <>
                  <Check size={12} className="mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} className="mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <Suspense
            fallback={
              <pre
                {...props}
                className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}
              >
                <code className="whitespace-pre-wrap">{children}</code>
              </pre>
            }
          >
            <HighlightedPre language={language} {...props}>
              {children}
            </HighlightedPre>
          </Suspense>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

CodeBlock.displayName = 'CodeBlock';

const components: Partial<Components> = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-2 scroll-m-20 text-lg font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-6 scroll-m-20 border-b pb-1.5 text-base font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-3 scroll-m-20 text-sm font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mt-3 scroll-m-20 text-sm font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className="mt-3 scroll-m-20 text-xs font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className="mt-3 scroll-m-20 text-xs font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h6>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-xs leading-5 break-all not-first:mt-3" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium break-all whitespace-pre-wrap underline underline-offset-4"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-3 ml-5 list-decimal text-xs" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-3 ml-5 list-disc text-xs" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="mt-1.5 text-xs break-all" {...props}>
      {children}
    </li>
  ),
  blockquote: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-3 border-l-2 pl-4 text-xs italic" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-y-auto">
      <table
        className="relative w-full overflow-hidden border-none text-xs"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:border-b-none m-0 border-b" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-3 py-1.5 text-left text-xs font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-3 py-1.5 text-left text-xs [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/performance/noImgElement: Required for image
    <img className="rounded-md" alt={alt} {...props} />
  ),
  code: ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    if (match && match[1]) {
      return (
        <CodeBlock language={match[1]} className={className} {...props}>
          {children}
        </CodeBlock>
      );
    }
    return (
      <code
        className={cn(
          'bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-[10px] break-all',
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
  if (!markdown) {
    return [];
  }
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

interface MarkdownBlockProps {
  content: string;
  className?: string;
}

const MemoizedMarkdownBlock = memo(
  ({ content, className }: MarkdownBlockProps) => {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) {
      return false;
    }
    return true;
  },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent = memo(
  ({ content, className }: MarkdownContentProps) => {
    const blocks = useMemo(
      () => parseMarkdownIntoBlocks(content || ''),
      [content],
    );

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock
        content={block}
        className={className}
        key={`block_${
          // biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
          index
        }`}
      />
    ));
  },
);

MarkdownContent.displayName = 'MarkdownContent';
