import { Button } from '@workspace/ui/components/button';
import React from 'react';

export function GradientButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={`relative overflow-hidden ${props.className ?? ''}`}
    >
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-[conic-gradient(at_50%_-20%,hsl(var(--primary)/.35),transparent_30%,transparent_70%,hsl(var(--primary)/.35))] opacity-60" />
      {props.children}
    </Button>
  );
}
