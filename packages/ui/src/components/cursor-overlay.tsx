'use client';

import * as React from 'react';

export const CursorOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
CursorOverlay.displayName = 'CursorOverlay';
