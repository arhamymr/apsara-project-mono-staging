'use client';

import * as React from 'react';

export const SlashInputElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
SlashInputElement.displayName = 'SlashInputElement';
