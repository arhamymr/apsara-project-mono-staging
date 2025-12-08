'use client';

import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { Code2, Loader2, Plus, Send } from 'lucide-react';
import type { AgentMessage } from '@/types/agent';

interface ChatPanelProps {
  messages: AgentMessage[];
  inputMessage: string;
  isStreaming: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onNewChat: () => void;
}

export function ChatPanel({
  messages,
  inputMessage,
  isStreaming,
  scrollRef,
  onInputChange,
  onSendMessage,
  onNewChat,
}: ChatPanelProps) {
  return (
    <div className="w-[40%] max-w-[450px] min-w-[250px] flex flex-col border-r text-xs">
      {/* Chat Header */}
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 p-3">
            {messages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                  <Code2 className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">Start Building</h3>
                <p className="text-muted-foreground mt-2 text-xs max-w-xs">
                  Describe what you want to build and I&apos;ll help you create it.
                </p>
              </div>
            ) : (
              /* Messages */
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div className="text-muted-foreground mt-1 text-[10px] opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isStreaming && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-muted max-w-[85%] rounded-lg px-3 py-2 text-xs">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Scroll anchor */}
            <div ref={scrollRef} className="h-0" />
          </div>
        </ScrollArea>
      </div>

      {/* Chat Input */}
      <div className="bg-muted/50 border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="max-h-[200px] min-h-[60px] flex-1 resize-none text-xs"
            disabled={isStreaming}
            rows={3}
          />
          <Button
            onClick={onSendMessage}
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={isStreaming || !inputMessage.trim()}
          >
            {isStreaming ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
