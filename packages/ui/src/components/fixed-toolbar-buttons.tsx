'use client';

import * as React from 'react';

export const FixedToolbarButtons = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
FixedToolbarButtons.displayName = 'FixedToolbarButtons';
