'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const BlockquoteElementStatic = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, children, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn('border-l-4 border-gray-300 pl-4 italic', className)}
    {...props}
  >
    {children}
  </blockquote>
));
BlockquoteElementStatic.displayName = 'BlockquoteElementStatic';
