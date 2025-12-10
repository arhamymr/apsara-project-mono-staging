'use client';

import { Bot, Loader2, User } from 'lucide-react';
import type { AgentMessage } from '@/types/agent';
import { MessageContent } from './message-content';

interface MessageBubbleProps {
  message: AgentMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isStreamingFromConvex = message.isStreaming && !isUser;

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
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

      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <User className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
