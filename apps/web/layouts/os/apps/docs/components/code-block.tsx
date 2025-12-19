'use client';

import { Button } from '@workspace/ui/components/button';
import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';

/**
 * Props for the CodeBlock component
 */
export interface CodeBlockProps {
  /** The code content to display */
  code: string;
  /** Optional language for syntax highlighting hints */
  language?: string;
  /** Callback when code is copied */
  onCopy?: (code: string) => void;
}

/**
 * CodeBlock Component
 * 
 * Renders code blocks with syntax highlighting and copy functionality.
 * Displays a copy button that provides visual feedback when clicked.
 * 
 * Requirements: 7.1, 7.2, 7.3
 */
export function CodeBlock({ code, language, onCopy }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [code, onCopy]);

  return (
    <div className="group relative mb-4">
      <pre className="rounded-md bg-muted p-4 overflow-x-auto">
        <code
          className={`block text-sm font-mono ${language ? `language-${language}` : ''}`}
        >
          {code}
        </code>
      </pre>
      
      {/* Copy button - visible on hover or when copied */}
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 ${
          copied ? 'opacity-100' : ''
        }`}
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
