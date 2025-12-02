'use client';

import * as React from 'react';

export const ToggleElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
ToggleElement.displayName = 'ToggleElement';
