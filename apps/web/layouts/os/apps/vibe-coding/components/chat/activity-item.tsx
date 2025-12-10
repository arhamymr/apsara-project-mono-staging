'use client';

import { CheckCircle2, Code2, FileCode, Loader2 } from 'lucide-react';
import type { ActivityLogItem } from './types';

interface ActivityItemProps {
  item: ActivityLogItem;
}

export function ActivityItem({ item }: ActivityItemProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'file-created':
        return <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />;
      case 'tool-start':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500 flex-shrink-0" />;
      case 'tool-end':
        return <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />;
      default:
        return <Code2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />;
    }
  };

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
