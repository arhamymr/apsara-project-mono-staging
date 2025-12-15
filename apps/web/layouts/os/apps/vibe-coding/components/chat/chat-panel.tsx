'use client';

import { memo, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import type { ChatPanelProps } from './types';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { EmptyState } from './empty-state';
import { MessageBubble } from './message-bubble';
import { StreamingMessage } from './streaming-message';

const MemoizedMessageBubble = memo(MessageBubble);
const MemoizedStreamingMessage = memo(StreamingMessage);

export const ChatPanel = memo(function ChatPanel({
  messages,
  inputMessage,
  isStreaming,
  isLoadingMessages = false,
  streamingContent,
  loadingFile,
  activityLog = [],
  scrollRef,
  onInputChange,
  onSendMessage,
  onNewChat,
}: ChatPanelProps) {
  const hasContent = messages.length > 0 || isStreaming;
  const hasStreamingMessage = useMemo(
    () => messages.some((m) => m.isStreaming),
    [messages]
  );
  const showStreamingMessage = isStreaming && !hasStreamingMessage;

  return (
    <div className="bg-background w-[40%] max-w-[450px] min-w-[250px] flex flex-col border-r text-xs">
      <ChatHeader isStreaming={isStreaming} onNewChat={onNewChat} />

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 p-3">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !hasContent ? (
              <EmptyState />
            ) : (
              <>
                {messages.map((message) => (
                  <MemoizedMessageBubble key={message.id} message={message} />
                ))}

                {showStreamingMessage && (
                  <MemoizedStreamingMessage
                    streamingContent={streamingContent}
                    loadingFile={loadingFile}
                    activityLog={activityLog}
                  />
                )}
              </>
            )}
            <div ref={scrollRef} className="h-0" />
          </div>
        </ScrollArea>
      </div>

      <ChatInput
        inputMessage={inputMessage}
        isStreaming={isStreaming}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
});
