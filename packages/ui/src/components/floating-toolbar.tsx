'use client';

import * as React from 'react';

export const FloatingToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
FloatingToolbar.displayName = 'FloatingToolbar';
