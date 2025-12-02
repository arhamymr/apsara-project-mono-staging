'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export const HrElement = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn('my-4 border-t', className)} {...props} />
));
HrElement.displayName = 'HrElement';
