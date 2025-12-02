'use client';

import * as React from 'react';

export const BlockList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
BlockList.displayName = 'BlockList';
