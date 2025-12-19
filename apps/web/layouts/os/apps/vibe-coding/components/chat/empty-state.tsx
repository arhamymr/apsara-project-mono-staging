'use client';

import { Code2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <Code2 className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">Start Building</h3>
      <p className="text-muted-foreground mt-2 text-xs max-w-xs">
        Describe what you want to build and I&apos;ll help you create it.
      </p>
    </div>
  );
}
