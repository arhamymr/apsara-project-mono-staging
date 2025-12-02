'use client';

import * as React from 'react';

export const EmojiInputElement = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
EmojiInputElement.displayName = 'EmojiInputElement';
