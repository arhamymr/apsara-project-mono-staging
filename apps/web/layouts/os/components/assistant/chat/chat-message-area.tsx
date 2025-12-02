'use client';

import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@/lib/utils';
import { useChatContext } from './ChatContext';

export function ChatMessageAreaComp() {
  const { messages, isLoading } = useChatContext();

  return (
    <div className="h-full w-full space-y-4">
      <div className="h-[320px] overflow-y-auto rounded-md border p-2">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-4 p-2">
            {messages.length === 0 && (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                <p>Start a conversation with the assistant...</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.role === 'user' ? 'U' : 'A'}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="text-muted-foreground text-sm">Thinking...</div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
