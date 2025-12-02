'use client';

import * as React from 'react';

export const FixedToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
FixedToolbar.displayName = 'FixedToolbar';
