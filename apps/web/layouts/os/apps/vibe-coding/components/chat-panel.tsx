import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { Loader2, Plus, Send } from 'lucide-react';
import { useChat } from '../hooks/use-chat';
import { ChatEmptyState } from './chat-empty-state';
import { ChatMessage } from './chat-message';
import { ChatStreamingMessage } from './chat-streaming-message';

interface ChatPanelProps {
  sessionId: string | null;
  initialMessage?: string;
  onNewChat?: () => void;
  onSessionCreated?: (sessionId: string) => void;
}

export function ChatPanel({
  sessionId,
  initialMessage,
  onNewChat,
  onSessionCreated,
}: ChatPanelProps) {
  const {
    messages,
    inputMessage,
    isStreaming,
    streamingContent,
    streamingTools,
    scrollRef,
    setInputMessage,
    handleSendMessage,
  } = useChat({ sessionId, initialMessage, onSessionCreated });

  return (
    <div className="flex h-full w-full flex-col border-r text-xs">
      {/* Header */}
      <ChatHeader onNewChat={onNewChat} isStreaming={isStreaming} />

      {/* Messages */}
      <ChatMessages
        messages={messages}
        streamingContent={streamingContent}
        streamingTools={streamingTools}
        isStreaming={isStreaming}
        scrollRef={scrollRef}
      />

      {/* Input */}
      <ChatInput
        inputMessage={inputMessage}
        isStreaming={isStreaming}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

interface ChatHeaderProps {
  onNewChat?: () => void;
  isStreaming: boolean;
}

function ChatHeader({ onNewChat, isStreaming }: ChatHeaderProps) {
  return (
    <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
      {onNewChat && (
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
      )}
    </div>
  );
}

interface ChatMessagesProps {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  streamingContent: string;
  streamingTools: string[];
  isStreaming: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

function ChatMessages({
  messages,
  streamingContent,
  streamingTools,
  isStreaming,
  scrollRef,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-3 p-3">
          {messages.length === 0 && !streamingContent && <ChatEmptyState />}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isStreaming && streamingContent && (
            <ChatStreamingMessage
              content={streamingContent}
              activeTools={streamingTools}
            />
          )}

          {/* Scroll anchor - invisible element at the bottom */}
          <div ref={scrollRef} className="h-0" />
        </div>
      </ScrollArea>
    </div>
  );
}

interface ChatInputProps {
  inputMessage: string;
  isStreaming: boolean;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
}

function ChatInput({
  inputMessage,
  isStreaming,
  onInputChange,
  onSendMessage,
}: ChatInputProps) {
  return (
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
  );
}
