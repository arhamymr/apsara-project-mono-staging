'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const CalloutElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 border-l-4 border-blue-500 bg-blue-50', className)} {...props}>
    {children}
  </div>
));
CalloutElementStatic.displayName = 'CalloutElementStatic';
