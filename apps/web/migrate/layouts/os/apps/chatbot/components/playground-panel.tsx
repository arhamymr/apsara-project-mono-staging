'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import * as React from 'react';

export type PlayMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type PlaygroundPanelProps = {
  temperature: number[];
  topP: number[];
  maxTokens: number;
  messages: PlayMessage[];
  onSend: () => void;
  onClear: () => void;
  draft: string;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
};

export function PlaygroundPanel({
  temperature,
  topP,
  maxTokens,
  messages,
  onSend,
  onClear,
  draft,
  setDraft,
}: PlaygroundPanelProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" /> Playground
        </CardTitle>
        <CardDescription>
          Test replies with current settings (local only).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="max-h-64 overflow-auto rounded-xl border p-3">
            {messages.map((message, index) => (
              <div key={index} className="mb-2 flex items-start gap-2">
                <div
                  className={`mt-1 size-6 shrink-0 rounded-full ${
                    message.role === 'assistant'
                      ? 'bg-primary/10'
                      : message.role === 'system'
                        ? 'bg-muted'
                        : 'bg-secondary'
                  } flex items-center justify-center`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="size-3" />
                  ) : message.role === 'system' ? (
                    <Sparkles className="size-3" />
                  ) : (
                    <MessageSquare className="size-3" />
                  )}
                </div>
                <div className="leading-relaxed">
                  <div className="text-muted-foreground text-xs">
                    {message.role}
                  </div>
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-muted-foreground text-sm">
                No messages yet. Send one to preview the response.
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a user message…"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && onSend()}
            />
            <Button onClick={onSend}>
              <Sparkles className="mr-2 size-4" />
              Send
            </Button>
            <Button variant="ghost" onClick={onClear}>
              <Trash2 className="mr-2 size-4" />
              Clear
            </Button>
          </div>
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="tabular-nums">
              Temp {temperature[0].toFixed(2)}
            </span>
            <span className="tabular-nums">Top-P {topP[0].toFixed(2)}</span>
            <span className="tabular-nums">Max {maxTokens}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
