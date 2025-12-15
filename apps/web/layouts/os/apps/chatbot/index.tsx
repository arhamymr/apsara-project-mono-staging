'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Kbd } from '@workspace/ui/components/kbd';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Slider } from '@workspace/ui/components/slider';
import { Switch } from '@workspace/ui/components/switch';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { Badge } from '@workspace/ui/components/badge';
import { Bot, MessageSquare, Sparkles, Trash2, Wand2 } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';

type ChatbotStatus = 'active' | 'disabled';

type PlayMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export default function AIChatbotSettingsDashboard() {
  const [status, setStatus] = useState<ChatbotStatus>('active');
  const [isSaving, setIsSaving] = useState(false);

  // Model settings
  const [model, setModel] = useState('gpt-5o-mini');
  const [responseStyle, setResponseStyle] = useState('concise');
  const [temperature, setTemperature] = useState<number[]>([0.6]);
  const [topP, setTopP] = useState<number[]>([1]);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [language, setLanguage] = useState('auto');
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Apsara Assistant — helpful, concise, and friendly. Answer in English by default, but mirror the user's language when possible."
  );

  // Tools
  const [toolSearch, setToolSearch] = useState(true);
  const [toolRetrieval, setToolRetrieval] = useState(true);
  const [toolWeb, setToolWeb] = useState(false);

  // Guardrails
  const [profanityFilter, setProfanityFilter] = useState(true);
  const [piiFilter, setPiiFilter] = useState(true);
  const [jailbreakFilter, setJailbreakFilter] = useState(true);

  // Playground
  const [playMessages, setPlayMessages] = useState<PlayMessage[]>([
    { role: 'system', content: 'Playground connected. Messages here are not persisted.' },
    { role: 'user', content: 'Hi! What can you do?' },
    { role: 'assistant', content: 'I can answer questions about your product and help with onboarding.' },
  ]);
  const [draftUserMsg, setDraftUserMsg] = useState('');

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Chatbot settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  const handleSend = () => {
    if (!draftUserMsg.trim()) return;
    const userMessage: PlayMessage = { role: 'user', content: draftUserMsg.trim() };
    const assistantMessage: PlayMessage = {
      role: 'assistant',
      content: `Temp=${temperature[0]?.toFixed(2)}, TopP=${topP[0]?.toFixed(2)}. (Demo reply) ${draftUserMsg.trim()}`,
    };
    setPlayMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraftUserMsg('');
  };

  const handleClearMessages = () => setPlayMessages([]);

  return (
    <TooltipProvider>
      <div className="text-foreground flex h-full flex-col">
        {/* Header */}
        <div className="bg-card sticky top-0 z-10 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 inline-flex size-8 items-center justify-center rounded-lg">
              <Bot className="size-4" />
            </div>
            <h2 className="text-base font-semibold">AI Chatbot Settings</h2>
            <Badge variant="outline" className="rounded-full text-xs">v1</Badge>
            <Select value={status} onValueChange={(v) => setStatus(v as ChatbotStatus)}>
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
            <Kbd className="text-primary-900 bg-black/20">S</Kbd>
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Sidebar - Settings */}
            <aside className="space-y-4">
              <p className="text-muted-foreground text-xs">
                Configure your AI chatbot behavior, model, and safety settings.
              </p>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="text-xs">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999]">
                    <SelectItem value="gpt-5o-mini">GPT-5o Mini (fast)</SelectItem>
                    <SelectItem value="gpt-5o">GPT-5o (balanced)</SelectItem>
                    <SelectItem value="gpt-5-turbo">GPT-5 Turbo (quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Response Style */}
              <div className="space-y-2">
                <Label className="text-xs">Response Style</Label>
                <Select value={responseStyle} onValueChange={setResponseStyle}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999]">
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Temperature</Label>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {temperature[0]?.toFixed(2)}
                  </span>
                </div>
                <Slider min={0} max={1} step={0.01} value={temperature} onValueChange={setTemperature} />
              </div>

              {/* Top-P */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Top-P</Label>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {topP[0]?.toFixed(2)}
                  </span>
                </div>
                <Slider min={0} max={1} step={0.01} value={topP} onValueChange={setTopP} />
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <Label className="text-xs">Max Tokens</Label>
                <Input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value || '0', 10))}
                  className="h-9"
                />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label className="text-xs">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999]">
                    <SelectItem value="auto">Auto (mirror user)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="jp">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tools Section */}
              <div className="border-t pt-4">
                <Label className="text-xs font-medium">Tools</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Search</span>
                    <Switch checked={toolSearch} onCheckedChange={setToolSearch} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Retrieval</span>
                    <Switch checked={toolRetrieval} onCheckedChange={setToolRetrieval} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Web Browse</span>
                    <Switch checked={toolWeb} onCheckedChange={setToolWeb} />
                  </div>
                </div>
              </div>

              {/* Guardrails Section */}
              <div className="border-t pt-4">
                <Label className="text-xs font-medium">Guardrails</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Profanity Filter</span>
                    <Switch checked={profanityFilter} onCheckedChange={setProfanityFilter} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">PII Detection</span>
                    <Switch checked={piiFilter} onCheckedChange={setPiiFilter} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Jailbreak Protection</span>
                    <Switch checked={jailbreakFilter} onCheckedChange={setJailbreakFilter} />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content - System Prompt & Playground */}
            <div className="space-y-4 md:col-span-2">
              {/* System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-xs">
                    <Wand2 className="size-3" /> System Prompt
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="cursor-help rounded-full text-xs">
                        Tips
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm">
                      Keep instructions short. Define tone, scope, and what to avoid.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-28 resize-none"
                  placeholder="Define your chatbot's personality and behavior..."
                />
              </div>

              {/* Playground */}
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4" />
                    <span className="text-sm font-medium">Playground</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    <span className="tabular-nums">Temp {temperature[0]?.toFixed(2)}</span>
                    <span className="tabular-nums">Top-P {topP[0]?.toFixed(2)}</span>
                    <span className="tabular-nums">Max {maxTokens}</span>
                  </div>
                </div>

                <div className="mb-3 max-h-64 overflow-auto rounded-lg border p-3">
                  {playMessages.map((message, index) => (
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
                        <div className="text-muted-foreground text-xs">{message.role}</div>
                        <div className="text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {playMessages.length === 0 && (
                    <div className="text-muted-foreground text-sm">
                      No messages yet. Send one to preview the response.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a user message…"
                    value={draftUserMsg}
                    onChange={(e) => setDraftUserMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="h-9"
                  />
                  <Button size="sm" onClick={handleSend}>
                    <Sparkles className="mr-1 size-3" />
                    Send
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleClearMessages}>
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
