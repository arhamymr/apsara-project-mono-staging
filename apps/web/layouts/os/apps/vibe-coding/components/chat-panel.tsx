'use client';

import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Code2,
  FileCode,
  Loader2,
  Plus,
  Send,
  CheckCircle2,
  Bot,
  User,
} from 'lucide-react';
import type { AgentMessage } from '@/types/agent';

interface ActivityLogItem {
  id: string;
  type: 'tool-start' | 'tool-end' | 'file-created' | 'text' | 'thinking';
  message: string;
  timestamp: Date;
  filePath?: string;
}

interface ChatPanelProps {
  messages: AgentMessage[];
  inputMessage: string;
  isStreaming: boolean;
  isLoadingMessages?: boolean;
  streamingContent?: string;
  loadingFile?: string | null;
  activityLog?: ActivityLogItem[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onNewChat: () => void;
}

/**
 * Parse and render message content with file list formatting
 */
function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  // Check if message contains file list
  const fileListMatch = content.match(/📁 \*\*Files Created(?:\/Updated)?:\*\*\n([\s\S]*?)$/);
  
  if (fileListMatch && !isUser && fileListMatch.index !== undefined) {
    const textContent = content.slice(0, fileListMatch.index).trim();
    const fileLines = (fileListMatch[1] || '').trim().split('\n');
    const files = fileLines
      .map(line => line.replace(/^\s*•\s*/, '').trim())
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

/**
 * Renders a single chat message bubble
 * Handles both regular messages and streaming messages from Convex
 */
function MessageBubble({ message }: { message: AgentMessage }) {
  const isUser = message.role === 'user';
  const isStreamingFromConvex = message.isStreaming && !isUser;

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-3 h-3 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        {/* Show streaming indicator for messages still being streamed (e.g., after page refresh) */}
        {isStreamingFromConvex ? (
          <div className="space-y-2">
            {message.content ? (
              <div className="whitespace-pre-wrap break-words">
                {message.content}
                <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5 align-middle" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-muted-foreground">Streaming...</span>
              </div>
            )}
          </div>
        ) : (
          <MessageContent content={message.content} isUser={isUser} />
        )}
        <div
          className={`mt-1 text-[10px] opacity-70 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <User className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

/**
 * Renders a single activity item
 */
function ActivityItem({ item }: { item: ActivityLogItem }) {
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

/**
 * Renders the streaming assistant message with stacked activity items
 */
function StreamingMessage({
  streamingContent,
  loadingFile,
  activityLog,
}: {
  streamingContent?: string;
  loadingFile?: string | null;
  activityLog: ActivityLogItem[];
}) {
  return (
    <div className="flex gap-2 justify-start">
      {/* Avatar */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-3 h-3 text-primary" />
      </div>

      <div className="bg-muted max-w-[80%] rounded-lg px-3 py-2 text-xs space-y-2">
        {/* Activity Log - stacked items */}
        {activityLog.length > 0 && (
          <div className="border-b border-border/50 pb-2 mb-2 space-y-0.5 max-h-[200px] overflow-y-auto">
            {activityLog.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Show file being created */}
        {loadingFile && (
          <div className="flex items-center gap-2 text-muted-foreground pb-2 border-b border-border/50 mb-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-[11px]">
              Creating:{' '}
              <span className="text-primary font-mono">{loadingFile}</span>
            </span>
          </div>
        )}

        {/* Streaming text content */}
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

export function ChatPanel({
  messages,
  inputMessage,
  isStreaming,
  isLoadingMessages = false,
  streamingContent,
  currentToolCall,
  loadingFile,
  activityLog = [],
  scrollRef,
  onInputChange,
  onSendMessage,
  onNewChat,
}: ChatPanelProps) {
  // Show content if we have messages OR if we're streaming
  const hasContent = messages.length > 0 || isStreaming;

  return (
    <div className="bg-background w-[40%] max-w-[450px] min-w-[250px] flex flex-col border-r text-xs">
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
            {isLoadingMessages ? (
              /* Loading State */
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !hasContent ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                  <Code2 className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">Start Building</h3>
                <p className="text-muted-foreground mt-2 text-xs max-w-xs">
                  Describe what you want to build and I&apos;ll help you create
                  it.
                </p>
              </div>
            ) : (
              /* Messages */
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                {/* Streaming message with stacked activity - only show if actively streaming locally
                    and there's no streaming message from Convex yet (to avoid duplicates) */}
                {isStreaming && !messages.some(m => m.isStreaming) && (
                  <StreamingMessage
                    streamingContent={streamingContent}
                    loadingFile={loadingFile}
                    activityLog={activityLog}
                  />
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
            onClick={() => onSendMessage()}
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
