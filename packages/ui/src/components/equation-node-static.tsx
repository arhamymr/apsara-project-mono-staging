'use client';

import * as React from 'react';

export const EquationElementStatic = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
EquationElementStatic.displayName = 'EquationElementStatic';

export const InlineEquationElementStatic = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
InlineEquationElementStatic.displayName = 'InlineEquationElementStatic';
