'use client';

import * as React from 'react';

export const TocElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
TocElementStatic.displayName = 'TocElementStatic';
