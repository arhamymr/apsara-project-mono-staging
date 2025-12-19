'use client';

import { Button } from '@workspace/ui/components/button';
import { Plus } from 'lucide-react';
import { ShareWithOrgButton } from '../../../organizations/components/share-with-org-button';

interface ChatHeaderProps {
  sessionId: string;
  sessionTitle?: string;
  isStreaming: boolean;
  onNewChat: () => void;
}

export function ChatHeader({ sessionId, sessionTitle, isStreaming, onNewChat }: ChatHeaderProps) {
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
      <ShareWithOrgButton
        resourceType="chatSession"
        resourceId={sessionId}
        resourceName={sessionTitle || 'Vibe Coding Session'}
        variant="ghost"
        size="sm"
        className="h-7 text-xs"
      />
    </div>
  );
}
