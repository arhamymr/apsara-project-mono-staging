'use client';

import * as React from 'react';

export const ImageElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
ImageElementStatic.displayName = 'ImageElementStatic';
