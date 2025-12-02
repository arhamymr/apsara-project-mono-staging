'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const ParagraphElementStatic = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn('mb-2', className)} {...props}>
    {children}
  </p>
));
ParagraphElementStatic.displayName = 'ParagraphElementStatic';
