'use client';

import * as React from 'react';

export const FileElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
FileElementStatic.displayName = 'FileElementStatic';
