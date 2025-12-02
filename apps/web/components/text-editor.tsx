'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onChange?: (value: string) => void;
}

export default function TextEditor({ value, onChange, className, ...props }: TextEditorProps) {
  return (
    <div className={cn('min-h-[200px] w-full rounded-md border p-4', className)} {...props}>
      <textarea
        className="min-h-[180px] w-full resize-none border-none bg-transparent outline-none"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Start writing..."
      />
    </div>
  );
}
