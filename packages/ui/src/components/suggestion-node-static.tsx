'use client';

import * as React from 'react';

export const SuggestionLeafStatic = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
SuggestionLeafStatic.displayName = 'SuggestionLeafStatic';
