'use client';

import * as React from 'react';

export const AudioElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
AudioElement.displayName = 'AudioElement';
