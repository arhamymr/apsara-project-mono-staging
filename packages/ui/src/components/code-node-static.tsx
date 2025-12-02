'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const CodeLeafStatic = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      'bg-muted rounded px-1.5 py-0.5 font-mono text-sm',
      className
    )}
    {...props}
  >
    {children}
  </code>
));
CodeLeafStatic.displayName = 'CodeLeafStatic';
