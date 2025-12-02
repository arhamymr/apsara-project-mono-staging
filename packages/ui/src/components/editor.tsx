'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const EditorContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('relative w-full', className)} {...props}>
    {children}
  </div>
));
EditorContainer.displayName = 'EditorContainer';

export const Editor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: string }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'min-h-[200px] w-full p-4',
      variant === 'fullWidth' && 'max-w-none',
      className
    )}
    {...props}
  />
));
Editor.displayName = 'Editor';
