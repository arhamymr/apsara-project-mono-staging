'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const HighlightLeafStatic = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <mark
    ref={ref}
    className={cn('bg-yellow-200 dark:bg-yellow-800', className)}
    {...props}
  >
    {children}
  </mark>
));
HighlightLeafStatic.displayName = 'HighlightLeafStatic';
