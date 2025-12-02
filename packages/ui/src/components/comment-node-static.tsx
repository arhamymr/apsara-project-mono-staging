'use client';

import * as React from 'react';

export const CommentLeafStatic = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
CommentLeafStatic.displayName = 'CommentLeafStatic';
