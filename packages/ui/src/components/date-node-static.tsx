'use client';

import * as React from 'react';

export const DateElementStatic = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
DateElementStatic.displayName = 'DateElementStatic';
