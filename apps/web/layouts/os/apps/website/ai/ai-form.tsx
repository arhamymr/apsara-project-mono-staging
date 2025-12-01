'use client';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';
import * as React from 'react';

export function PromptView({
  onSend,
}: {
  onSend?: (model: string, prompt: string) => void;
}) {
  const [model, setModel] = React.useState('gpt-5-mini');
  const [prompt, setPrompt] = React.useState('');
  const router = useRouter();

  function handleSubmit() {
    if (!prompt.trim()) return;
    onSend?.(model, prompt);
    setPrompt('');
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-muted-foreground mx-auto mb-5 max-w-xl text-center text-5xl leading-tight font-semibold">
        Generate Your Website With AI
      </h1>
      <Card className="mx-auto w-full max-w-2xl rounded-xl p-4">
        <CardContent className="flex flex-col gap-3 p-0">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="min-h-[100px] w-full rounded-md"
          />
          <div className="flex items-center justify-between gap-3">
            <Button
              size="sm"
              variant={'ghost'}
              onClick={() => router.push('/dashboard/website/create')}
            >
              Create Manually
            </Button>
            <div className="flex gap-2">
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-[160px] border-none text-xs">
                  <SelectValue placeholder="Choose model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5-mini">OpenAI GPT-5 Mini</SelectItem>
                  <SelectItem value="gemini-2.5-flash">
                    Google Gemini Flash
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleSubmit}
                className="flex items-center gap-2"
              >
                <Bot className="h-6 w-6" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
