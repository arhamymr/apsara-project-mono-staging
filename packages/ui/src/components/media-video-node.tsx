'use client';

import * as React from 'react';

export const VideoElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
VideoElement.displayName = 'VideoElement';
