'use client';

import { Separator } from '@/components/ui/separator';

interface AuthSeparatorProps {
  text?: string;
}

export function AuthSeparator({ text = 'or continue with' }: AuthSeparatorProps) {
  return (
    <div className="relative my-6">
      <Separator />
      <span className="bg-background text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
        {text}
      </span>
    </div>
  );
}
