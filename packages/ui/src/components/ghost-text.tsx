'use client';

import * as React from 'react';

export const GhostText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
GhostText.displayName = 'GhostText';
