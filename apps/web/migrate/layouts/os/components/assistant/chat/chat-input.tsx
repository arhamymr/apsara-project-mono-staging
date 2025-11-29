'use client';

import {
  ChatInput,
  ChatInputEditor,
  ChatInputGroupAddon,
  ChatInputSubmitButton,
  useChatInput,
} from '@/components/ui/chat-input';
import { useChatContext } from './ChatContext';

export function ChatInputComp() {
  const { sendChat, isLoading } = useChatContext();

  const { value, onChange, handleSubmit } = useChatInput({
    onSubmit: async (parsed) => {
      if (parsed.content.trim()) {
        await sendChat(parsed.content);
      }
    },
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full">
        <ChatInput
          onSubmit={handleSubmit}
          value={value}
          onChange={onChange}
          disabled={isLoading}
        >
          <ChatInputEditor
            placeholder={isLoading ? 'Processing...' : 'Type a message...'}
          />
          <ChatInputGroupAddon align="block-end">
            <ChatInputSubmitButton disabled={isLoading} />
          </ChatInputGroupAddon>
        </ChatInput>
      </div>
    </div>
  );
}
