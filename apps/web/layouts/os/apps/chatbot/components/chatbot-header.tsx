'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useDashboardStrings } from '@/i18n/dashboard';
import { Bot, PauseCircle, RotateCcw, Save } from 'lucide-react';

type ChatbotHeaderProps = {
  onDisable?: () => void;
  onReset?: () => void;
  onSave: () => Promise<void> | void;
  saving: boolean;
};

export function ChatbotHeader({
  onDisable,
  onReset,
  onSave,
  saving,
}: ChatbotHeaderProps) {
  const s = useDashboardStrings();
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 inline-flex size-9 items-center justify-center rounded-xl">
            <Bot className="size-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {s.chatbot.header.title}
          </h1>
          <Badge variant="outline" className="rounded-full">
            v1
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {s.chatbot.header.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onDisable}>
          <PauseCircle className="mr-2 size-4" /> {s.chatbot.header.disable}
        </Button>
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw className="mr-2 size-4" /> {s.chatbot.header.reset}
        </Button>
        <Button onClick={onSave} disabled={saving}>
          <Save className="mr-2 size-4" />
          {saving ? s.chatbot.header.saving : s.chatbot.header.save}
        </Button>
      </div>
    </div>
  );
}
