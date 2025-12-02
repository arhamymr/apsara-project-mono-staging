'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const H1ElementStatic = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h1 ref={ref} className={cn('text-4xl font-bold', className)} {...props}>
    {children}
  </h1>
));
H1ElementStatic.displayName = 'H1ElementStatic';

export const H2ElementStatic = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-3xl font-bold', className)} {...props}>
    {children}
  </h2>
));
H2ElementStatic.displayName = 'H2ElementStatic';

export const H3ElementStatic = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-2xl font-bold', className)} {...props}>
    {children}
  </h3>
));
H3ElementStatic.displayName = 'H3ElementStatic';

export const H4ElementStatic = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h4 ref={ref} className={cn('text-xl font-bold', className)} {...props}>
    {children}
  </h4>
));
H4ElementStatic.displayName = 'H4ElementStatic';

export const H5ElementStatic = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5 ref={ref} className={cn('text-lg font-bold', className)} {...props}>
    {children}
  </h5>
));
H5ElementStatic.displayName = 'H5ElementStatic';

export const H6ElementStatic = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h6 ref={ref} className={cn('text-base font-bold', className)} {...props}>
    {children}
  </h6>
));
H6ElementStatic.displayName = 'H6ElementStatic';
