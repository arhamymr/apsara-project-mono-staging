'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const ColumnGroupElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex gap-4', className)} {...props}>
    {children}
  </div>
));
ColumnGroupElementStatic.displayName = 'ColumnGroupElementStatic';

export const ColumnElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1', className)} {...props}>
    {children}
  </div>
));
ColumnElementStatic.displayName = 'ColumnElementStatic';
