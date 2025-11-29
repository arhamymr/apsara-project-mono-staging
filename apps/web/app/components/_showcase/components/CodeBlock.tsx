'use client';

import { Check, Copy } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CodeBlockProps } from '../types';

export function CodeBlock({
  code,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Validate code input and simulate loading
  React.useEffect(() => {
    if (!code || typeof code !== 'string') {
      setError('Invalid code content');
      setIsLoading(false);
    } else {
      setError(null);
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="bg-muted/30 dark:bg-muted/10 relative rounded-lg border shadow-sm">
      {/* Header with filename and copy button */}
      <div className="bg-muted/50 dark:bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        {filename && (
          <span className="text-muted-foreground font-mono text-sm font-medium">
            {filename}
          </span>
        )}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!!error}
            aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
            aria-pressed={copied}
            className="hover:bg-accent focus-visible:ring-ring h-7 w-7 transition-all focus-visible:ring-2"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Code content */}
      <div className="relative overflow-x-auto">
        {error ? (
          <div className="p-5">
            <div className="text-destructive text-sm">
              <p className="font-semibold">Error loading code</p>
              <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 p-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <pre
            className={cn(
              'bg-background dark:bg-background/50 m-0 overflow-x-auto p-5 text-sm',
              showLineNumbers && 'pl-12',
            )}
          >
            <code className="text-foreground font-mono leading-relaxed">
              {code}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
