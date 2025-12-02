'use client';

import * as React from 'react';

export const FloatingToolbarButtons = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
FloatingToolbarButtons.displayName = 'FloatingToolbarButtons';
