'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const ColumnGroupElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex gap-4', className)} {...props}>
    {children}
  </div>
));
ColumnGroupElement.displayName = 'ColumnGroupElement';

export const ColumnElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1', className)} {...props}>
    {children}
  </div>
));
ColumnElement.displayName = 'ColumnElement';
