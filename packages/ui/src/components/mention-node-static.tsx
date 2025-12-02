'use client';

import * as React from 'react';

export const MentionElementStatic = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
MentionElementStatic.displayName = 'MentionElementStatic';
