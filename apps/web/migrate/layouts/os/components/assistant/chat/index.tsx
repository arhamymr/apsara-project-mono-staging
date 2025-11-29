/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWindowContext } from '@/layouts/os/WindowContext';
import ChatHeader from './chat-header';
import { ChatInputComp } from './chat-input';
import { ChatMessageAreaComp } from './chat-message-area';
import { ChatProvider } from './ChatContext';

export default function ChatAssitant() {
  const { openAppById } = useWindowContext();

  return (
    <ChatProvider onOpenApp={openAppById}>
      <div className="bg-background flex flex-col gap-2 overflow-hidden border p-4">
        {/* HEADER (top) */}
        <ChatHeader />
        <ChatMessageAreaComp />
        <ChatInputComp />
      </div>
    </ChatProvider>
  );
}

// end
