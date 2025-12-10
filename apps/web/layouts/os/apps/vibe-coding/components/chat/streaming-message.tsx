'use client';

import { Bot, Loader2 } from 'lucide-react';
import type { ActivityLogItem } from './types';
import { ActivityItem } from './activity-item';

interface StreamingMessageProps {
  streamingContent?: string;
  loadingFile?: string | null;
  activityLog: ActivityLogItem[];
}

export function StreamingMessage({
  streamingContent,
  loadingFile,
  activityLog,
}: StreamingMessageProps) {
  return (
    <div className="flex gap-2 justify-start">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-3 h-3 text-primary" />
      </div>

      <div className="bg-muted max-w-[80%] rounded-lg px-3 py-2 text-xs space-y-2">
        {activityLog.length > 0 && (
          <div className="border-b border-border/50 pb-2 mb-2 space-y-0.5 max-h-[200px] overflow-y-auto">
            {activityLog.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {loadingFile && (
          <div className="flex items-center gap-2 text-muted-foreground pb-2 border-b border-border/50 mb-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-[11px]">
              Creating:{' '}
              <span className="text-primary font-mono">{loadingFile}</span>
            </span>
          </div>
        )}

        {streamingContent ? (
          <div className="whitespace-pre-wrap break-words">
            {streamingContent}
            <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5 align-middle" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-muted-foreground">Thinking...</span>
          </div>
        )}
      </div>
    </div>
  );
}
