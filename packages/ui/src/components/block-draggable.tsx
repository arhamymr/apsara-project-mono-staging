'use client';

import * as React from 'react';

export const BlockDraggable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
BlockDraggable.displayName = 'BlockDraggable';
