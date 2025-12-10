'use client';

import { Button } from '@workspace/ui/components/button';
import { Plus } from 'lucide-react';

interface ChatHeaderProps {
  isStreaming: boolean;
  onNewChat: () => void;
}

export function ChatHeader({ isStreaming, onNewChat }: ChatHeaderProps) {
  return (
    <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onNewChat}
        disabled={isStreaming}
        className="h-7 text-xs"
      >
        <Plus size={14} className="mr-1.5" />
        New Chat
      </Button>
    </div>
  );
}
