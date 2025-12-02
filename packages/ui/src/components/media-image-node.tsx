'use client';

import * as React from 'react';

export const ImageElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
ImageElement.displayName = 'ImageElement';
