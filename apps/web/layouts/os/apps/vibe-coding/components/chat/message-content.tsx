'use client';

import { CheckCircle2, FileCode } from 'lucide-react';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

export function MessageContent({ content, isUser }: MessageContentProps) {
  const fileListMatch = content.match(
    /📁 \*\*Files Created(?:\/Updated)?:\*\*\n([\s\S]*?)$/
  );

  if (fileListMatch && !isUser && fileListMatch.index !== undefined) {
    const textContent = content.slice(0, fileListMatch.index).trim();
    const fileLines = (fileListMatch[1] || '').trim().split('\n');
    const files = fileLines
      .map((line) => line.replace(/^\s*•\s*/, '').trim())
      .filter(Boolean);

    return (
      <div className="space-y-2">
        {textContent && (
          <div className="whitespace-pre-wrap break-words">{textContent}</div>
        )}
        {files.length > 0 && (
          <div className="pt-2">
            <div className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <FileCode className="h-3 w-3" />
              Files Created
            </div>
            <div className="space-y-1">
              {files.map((file) => (
                <div key={file} className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="font-mono text-[11px] truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div className="whitespace-pre-wrap break-words">{content}</div>;
}
