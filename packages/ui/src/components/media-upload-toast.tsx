'use client';

import * as React from 'react';

export const MediaUploadToast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
MediaUploadToast.displayName = 'MediaUploadToast';
