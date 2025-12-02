'use client';

import * as React from 'react';

export interface TComment {
  id: string;
  userId: string;
  value: string;
  createdAt: number;
  isResolved?: boolean;
}

export const Comment = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
Comment.displayName = 'Comment';
