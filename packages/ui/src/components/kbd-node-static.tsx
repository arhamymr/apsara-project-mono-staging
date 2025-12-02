'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const KbdLeafStatic = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      'bg-muted border-border rounded border px-1.5 py-0.5 font-mono text-sm shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </kbd>
));
KbdLeafStatic.displayName = 'KbdLeafStatic';
