'use client';

import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { Loader2, Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  isStreaming: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export function ChatInput({
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
  );
}
