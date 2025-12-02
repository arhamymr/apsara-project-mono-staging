'use client';

import * as React from 'react';

export const BlockListStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
BlockListStatic.displayName = 'BlockListStatic';
