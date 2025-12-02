'use client';

import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { useChatContext } from './ChatContext';

export function ChatInputComp() {
  const { sendChat, isLoading } = useChatContext();
  const [value, setValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      await sendChat(value);
      setValue('');
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isLoading ? 'Processing...' : 'Type a message...'}
          disabled={isLoading}
          className="min-h-[40px] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading || !value.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
