'use client';

import * as React from 'react';

export const SuggestionBelowNodes = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
SuggestionBelowNodes.displayName = 'SuggestionBelowNodes';

export const SuggestionLeaf = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
SuggestionLeaf.displayName = 'SuggestionLeaf';

export const SuggestionLineBreak = React.forwardRef<
  HTMLBRElement,
  React.HTMLAttributes<HTMLBRElement>
>((props, ref) => <br ref={ref} {...props} />);
SuggestionLineBreak.displayName = 'SuggestionLineBreak';
