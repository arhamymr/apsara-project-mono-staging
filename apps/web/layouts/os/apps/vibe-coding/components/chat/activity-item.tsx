'use client';

import { useState } from 'react';
import { Brain, CheckCircle2, ChevronDown, ChevronRight, Code2, FileCode, Loader2 } from 'lucide-react';
import type { ActivityLogItem } from './types';

interface ActivityItemProps {
  item: ActivityLogItem;
}

export function ActivityItem({ item }: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'file-created':
        return <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />;
      case 'tool-start':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500 flex-shrink-0" />;
      case 'tool-end':
        return <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />;
      case 'thinking':
        return <Brain className="h-3 w-3 text-purple-500 flex-shrink-0" />;
      default:
        return <Code2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />;
    }
  };

  // Thinking items are collapsible
  if (item.type === 'thinking') {
    return (
      <div className="text-xs py-0.5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 w-full text-left hover:bg-muted/50 rounded px-1 -mx-1"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}
          {getIcon()}
          <span className="text-purple-500 text-[11px]">Thinking</span>
        </button>
        {isExpanded && (
          <div className="ml-6 mt-1 text-[11px] text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded p-2 max-h-[150px] overflow-y-auto">
            {item.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs py-0.5">
      {getIcon()}
      {item.filePath ? (
        <div className="flex items-center gap-1">
          <FileCode className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-[11px] truncate">{item.filePath}</span>
        </div>
      ) : (
        <span className="text-muted-foreground truncate">{item.message}</span>
      )}
    </div>
  );
}
