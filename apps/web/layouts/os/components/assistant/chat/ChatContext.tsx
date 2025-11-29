import { ReactNode, createContext, useContext } from 'react';
import { ChatMessage, useChat } from './useChat';

type ChatContextType = {
  messages: ChatMessage[];
  sendChat: (
    text: string,
    opts?: { speak?: (t: string) => void },
  ) => Promise<void>;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  onOpenApp,
}: {
  children: ReactNode;
  onOpenApp?: (appId: string) => void;
}) {
  const chat = useChat(onOpenApp);

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
}
