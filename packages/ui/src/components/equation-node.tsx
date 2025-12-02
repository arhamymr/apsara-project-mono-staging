'use client';

import * as React from 'react';

export const EquationElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
EquationElement.displayName = 'EquationElement';

export const InlineEquationElement = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
InlineEquationElement.displayName = 'InlineEquationElement';
