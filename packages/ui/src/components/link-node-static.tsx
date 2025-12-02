'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const LinkElementStatic = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a ref={ref} className={cn('text-blue-600 underline', className)} {...props}>
    {children}
  </a>
));
LinkElementStatic.displayName = 'LinkElementStatic';
