'use client';

import * as React from 'react';

export const MediaEmbedElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
MediaEmbedElement.displayName = 'MediaEmbedElement';
