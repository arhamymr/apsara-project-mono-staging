'use client';

import {
  ChatMessage,
  ChatMessageAuthor,
  ChatMessageAvatar,
  ChatMessageAvatarFallback,
  ChatMessageContainer,
  ChatMessageContent,
  ChatMessageHeader,
  ChatMessageMarkdown,
  ChatMessageTimestamp,
} from '@workspace/ui/components/chat-message';
import {
  ChatMessageArea,
  ChatMessageAreaContent,
  ChatMessageAreaScrollButton,
} from '@workspace/ui/components/chat-message-area';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useChatContext } from './ChatContext';

export function ChatMessageAreaComp() {
  const { messages, isLoading } = useChatContext();

  return (
    <div className="h-full w-full space-y-4">
      <div className="h-[320px] overflow-y-auto rounded-md border p-2">
        <ScrollArea className="h-full w-full">
          <ChatMessageArea>
            <ChatMessageAreaContent>
              {messages.length === 0 && (
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  <p>Start a conversation with the assistant...</p>
                </div>
              )}

              {messages.map((message, index) => (
                <ChatMessage key={index}>
                  <ChatMessageAvatar>
                    <ChatMessageAvatarFallback>
                      {message.role === 'user' ? 'U' : 'A'}
                    </ChatMessageAvatarFallback>
                  </ChatMessageAvatar>

                  <ChatMessageContainer>
                    <ChatMessageHeader>
                      <ChatMessageAuthor>
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </ChatMessageAuthor>
                      <ChatMessageTimestamp createdAt={new Date()} />
                    </ChatMessageHeader>

                    <ChatMessageContent>
                      <ChatMessageMarkdown content={message.content} />
                    </ChatMessageContent>
                  </ChatMessageContainer>
                </ChatMessage>
              ))}

              {isLoading && (
                <ChatMessage>
                  <ChatMessageAvatar>
                    <ChatMessageAvatarFallback>A</ChatMessageAvatarFallback>
                  </ChatMessageAvatar>

                  <ChatMessageContainer>
                    <ChatMessageHeader>
                      <ChatMessageAuthor>Assistant</ChatMessageAuthor>
                      <ChatMessageTimestamp createdAt={new Date()} />
                    </ChatMessageHeader>

                    <ChatMessageContent>
                      <div className="text-muted-foreground">Thinking...</div>
                    </ChatMessageContent>
                  </ChatMessageContainer>
                </ChatMessage>
              )}
            </ChatMessageAreaContent>
            <ChatMessageAreaScrollButton />
          </ChatMessageArea>
        </ScrollArea>
      </div>
    </div>
  );
}
