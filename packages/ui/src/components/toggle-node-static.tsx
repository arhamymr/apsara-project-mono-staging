'use client';

import * as React from 'react';

export const ToggleElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
ToggleElementStatic.displayName = 'ToggleElementStatic';
