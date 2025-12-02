'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const CodeBlockElement = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement>
>(({ className, children, ...props }, ref) => (
  <pre ref={ref} className={cn('bg-gray-100 p-4 rounded', className)} {...props}>
    {children}
  </pre>
));
CodeBlockElement.displayName = 'CodeBlockElement';

export const CodeLineElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props}>
    {children}
  </div>
));
CodeLineElement.displayName = 'CodeLineElement';

export const CodeSyntaxLeaf = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn('', className)} {...props}>
    {children}
  </span>
));
CodeSyntaxLeaf.displayName = 'CodeSyntaxLeaf';
