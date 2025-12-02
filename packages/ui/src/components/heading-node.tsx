'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const H1Element = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h1 ref={ref} className={cn('text-4xl font-bold', className)} {...props}>
    {children}
  </h1>
));
H1Element.displayName = 'H1Element';

export const H2Element = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-3xl font-bold', className)} {...props}>
    {children}
  </h2>
));
H2Element.displayName = 'H2Element';

export const H3Element = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-2xl font-bold', className)} {...props}>
    {children}
  </h3>
));
H3Element.displayName = 'H3Element';

export const H4Element = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h4 ref={ref} className={cn('text-xl font-bold', className)} {...props}>
    {children}
  </h4>
));
H4Element.displayName = 'H4Element';

export const H5Element = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5 ref={ref} className={cn('text-lg font-bold', className)} {...props}>
    {children}
  </h5>
));
H5Element.displayName = 'H5Element';

export const H6Element = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h6 ref={ref} className={cn('text-base font-bold', className)} {...props}>
    {children}
  </h6>
));
H6Element.displayName = 'H6Element';
