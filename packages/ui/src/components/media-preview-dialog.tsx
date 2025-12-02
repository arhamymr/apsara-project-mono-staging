'use client';

import * as React from 'react';

export const MediaPreviewDialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
MediaPreviewDialog.displayName = 'MediaPreviewDialog';
