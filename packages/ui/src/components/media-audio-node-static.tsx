'use client';

import * as React from 'react';

export const AudioElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
AudioElementStatic.displayName = 'AudioElementStatic';
