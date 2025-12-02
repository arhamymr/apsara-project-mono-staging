import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';
import { useTheme } from '@/layouts/dark-mode/useTheme';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { toast } from 'sonner';

interface MarkdownMessageProps {
  content: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const highlightCode = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language || 'plaintext',
          theme: theme === 'dark' ? 'github-dark' : 'github-light',
        });
        if (isMounted) {
          setHighlightedCode(html);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Syntax highlighting failed, using fallback:', error);
        // If language is not supported, fall back to plain text
        if (isMounted) {
          setHighlightedCode('');
          setIsLoading(false);
        }
      }
    };

    highlightCode();

    return () => {
      isMounted = false;
    };
  }, [code, language, theme]);

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
    <Accordion type="single" collapsible className="my-1.5 w-full">
      <AccordionItem value="code" className="rounded-lg border">
        <AccordionTrigger className="px-3 py-2 text-xs hover:no-underline">
          <div className="flex w-full items-center justify-between pr-2">
            <span className="text-muted-foreground font-medium">
              {language || 'Code'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="h-6 px-2 text-xs"
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
        <AccordionContent className="pb-0">
          <div className="max-w-full overflow-hidden">
            {isLoading ? (
              <pre className="overflow-x-auto px-3 pb-3">
                <code className="block text-[11px] break-all whitespace-pre-wrap">
                  {code}
                </code>
              </pre>
            ) : highlightedCode ? (
              <div
                className="shiki-wrapper text-[11px] [&_code]:break-all [&_code]:whitespace-pre-wrap [&_pre]:!m-0 [&_pre]:overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!p-3"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            ) : (
              <pre className="overflow-x-auto px-3 pb-3">
                <code className="block text-[11px] break-all whitespace-pre-wrap">
                  {code}
                </code>
              </pre>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  // Parse markdown content
  const parts: Array<{
    type: 'text' | 'code';
    content: string;
    language?: string;
  }> = [];

  // Regex to match code blocks with optional language
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }

    // Add code block
    parts.push({
      type: 'code',
      content: (match[2] ?? '').trim(),
      language: match[1] || undefined,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  // If no code blocks found, treat entire content as text
  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }

  return (
    <div className="space-y-1">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={part.content}
              language={part.language}
            />
          );
        }

        // Render text with basic markdown support
        return (
          <div key={index} className="text-xs whitespace-pre-wrap">
            {part.content.split('\n').map((line, lineIndex) => {
              // Handle inline code
              const inlineCodeRegex = /`([^`]+)`/g;
              const lineParts: Array<{
                type: 'text' | 'inline-code';
                content: string;
              }> = [];
              let lastIdx = 0;
              let inlineMatch: RegExpExecArray | null;

              while ((inlineMatch = inlineCodeRegex.exec(line)) !== null) {
                if (inlineMatch.index > lastIdx) {
                  lineParts.push({
                    type: 'text',
                    content: line.slice(lastIdx, inlineMatch.index),
                  });
                }
                lineParts.push({
                  type: 'inline-code',
                  content: inlineMatch[1],
                });
                lastIdx = inlineMatch.index + inlineMatch[0].length;
              }

              if (lastIdx < line.length) {
                lineParts.push({
                  type: 'text',
                  content: line.slice(lastIdx),
                });
              }

              if (lineParts.length === 0) {
                lineParts.push({ type: 'text', content: line });
              }

              return (
                <div key={lineIndex}>
                  {lineParts.map((linePart, partIndex) => {
                    if (linePart.type === 'inline-code') {
                      return (
                        <code
                          key={partIndex}
                          className="bg-muted rounded px-1 py-0.5 font-mono text-[11px]"
                        >
                          {linePart.content}
                        </code>
                      );
                    }
                    return <span key={partIndex}>{linePart.content}</span>;
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
