'use client';

import { memo, useMemo } from 'react';
import { CheckCircle2, FileCode } from 'lucide-react';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

const FILE_LIST_REGEX = /📁 \*\*Files Created(?:\/Updated)?:\*\*\n([\s\S]*?)$/;

interface ParsedContent {
  textContent: string;
  files: string[];
}

function parseFileList(content: string): ParsedContent | null {
  const match = content.match(FILE_LIST_REGEX);
  if (!match || match.index === undefined) return null;

  const textContent = content.slice(0, match.index).trim();
  const fileLines = (match[1] || '').trim().split('\n');
  const files = fileLines
    .map((line) => line.replace(/^\s*•\s*/, '').trim())
    .filter(Boolean);

  return { textContent, files };
}

const FileItem = memo(function FileItem({ file }: { file: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
      <span className="font-mono text-[11px] truncate">{file}</span>
    </div>
  );
});

export const MessageContent = memo(function MessageContent({ content, isUser }: MessageContentProps) {
  const parsed = useMemo(
    () => (!isUser ? parseFileList(content) : null),
    [content, isUser]
  );

  if (parsed) {
    return (
      <div className="space-y-2">
        {parsed.textContent && (
          <div className="whitespace-pre-wrap break-words">{parsed.textContent}</div>
        )}
        {parsed.files.length > 0 && (
          <div className="pt-2">
            <div className="text-muted-foreground text-[10px] uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <FileCode className="h-3 w-3" />
              Files Created
            </div>
            <div className="space-y-1">
              {parsed.files.map((file) => (
                <FileItem key={file} file={file} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div className="whitespace-pre-wrap break-words">{content}</div>;
});
