'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const CodeBlockElementStatic = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement>
>(({ className, children, ...props }, ref) => (
  <pre ref={ref} className={cn('bg-gray-100 p-4 rounded', className)} {...props}>
    {children}
  </pre>
));
CodeBlockElementStatic.displayName = 'CodeBlockElementStatic';

export const CodeLineElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props}>
    {children}
  </div>
));
CodeLineElementStatic.displayName = 'CodeLineElementStatic';

export const CodeSyntaxLeafStatic = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn('', className)} {...props}>
    {children}
  </span>
));
CodeSyntaxLeafStatic.displayName = 'CodeSyntaxLeafStatic';
