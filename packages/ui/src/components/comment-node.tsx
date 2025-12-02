'use client';

import * as React from 'react';

export const CommentLeaf = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
CommentLeaf.displayName = 'CommentLeaf';
