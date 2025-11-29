'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useDashboardStrings } from '@/i18n/dashboard';
import { Database, Plug, Shield, Sliders, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { ChatbotHeader } from './components/chatbot-header';
import { GuardrailsSettingsTab } from './components/guardrails-settings-tab';
import { ModelSettingsTab } from './components/model-settings-tab';
import { PlaygroundPanel, PlayMessage } from './components/playground-panel';
import { PresetsTab } from './components/presets-tab';
import { SourcesSettingsTab } from './components/sources-settings-tab';
import { ToolsSettingsTab } from './components/tools-settings-tab';

type GuardrailState = {
  profanity: boolean;
  pii: boolean;
  jailbreak: boolean;
  toxic: boolean;
};

type RateLimitState = {
  rpm: number;
  rpd: number;
};

type SourcesState = {
  faq: boolean;
  docs: boolean;
  kb: boolean;
};

export default function AIChatbotSettingsDashboard() {
  const s = useDashboardStrings();
  const [saving, setSaving] = useState(false);
  const [temperature, setTemperature] = useState<number[]>([0.6]);
  const [topP, setTopP] = useState<number[]>([1]);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Apsara Assistant — helpful, concise, and friendly. Answer in English by default, but mirror the user's language when possible.",
  );
  const [toolSearch, setToolSearch] = useState(true);
  const [toolRetrieval, setToolRetrieval] = useState(true);
  const [toolWeb, setToolWeb] = useState(false);
  const [guardrails, setGuardrails] = useState<GuardrailState>({
    profanity: true,
    pii: true,
    jailbreak: true,
    toxic: true,
  });
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    rpm: 120,
    rpd: 5000,
  });
  const [sources, setSources] = useState<SourcesState>({
    faq: true,
    docs: true,
    kb: false,
  });
  const [playMessages, setPlayMessages] = useState<PlayMessage[]>([
    {
      role: 'system',
      content: 'Playground connected. Messages here are not persisted.',
    },
    { role: 'user', content: 'Hi! What can you do?' },
    {
      role: 'assistant',
      content:
        'I can answer questions about your product and help with onboarding.',
    },
  ]);
  const [draftUserMsg, setDraftUserMsg] = useState('');

  const handleDisable = () => {
    // Placeholder for disable action
  };

  const handleReset = () =>
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  const handleSend = () => {
    if (!draftUserMsg.trim()) return;
    const userMessage: PlayMessage = {
      role: 'user',
      content: draftUserMsg.trim(),
    };
    const assistantMessage: PlayMessage = {
      role: 'assistant',
      content: `Temp=${temperature[0].toFixed(2)}, TopP=${topP[0].toFixed(
        2,
      )}. (Demo reply) ${draftUserMsg.trim()}`,
    };
    setPlayMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraftUserMsg('');
  };

  const handleClearMessages = () => setPlayMessages([]);

  const onSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
  };

  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <ChatbotHeader
          saving={saving}
          onSave={onSave}
          onDisable={handleDisable}
          onReset={handleReset}
        />

        <div className="mt-6 flex gap-6">
          <Tabs defaultValue="model" className="mt-6 flex-1">
            <div className="relative">
              <TabsList className="overflow-x-auto">
                <TabsTrigger value="model" className="gap-2">
                  <Sliders className="size-4" /> {s.chatbot.tabs.model}
                </TabsTrigger>
                <TabsTrigger value="tools" className="gap-2">
                  <Plug className="size-4" /> {s.chatbot.tabs.tools}
                </TabsTrigger>
                <TabsTrigger value="guardrails" className="gap-2">
                  <Shield className="size-4" /> {s.chatbot.tabs.guardrails}
                </TabsTrigger>
                <TabsTrigger value="sources" className="gap-2">
                  <Database className="size-4" /> {s.chatbot.tabs.sources}
                </TabsTrigger>
                <TabsTrigger value="presets" className="gap-2">
                  <Sparkles className="size-4" /> {s.chatbot.tabs.presets}
                </TabsTrigger>
              </TabsList>
            </div>

            <ModelSettingsTab
              temperature={temperature}
              setTemperature={setTemperature}
              topP={topP}
              setTopP={setTopP}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
            />
            <ToolsSettingsTab
              toolSearch={toolSearch}
              setToolSearch={setToolSearch}
              toolRetrieval={toolRetrieval}
              setToolRetrieval={setToolRetrieval}
              toolWeb={toolWeb}
              setToolWeb={setToolWeb}
            />
            <GuardrailsSettingsTab
              guardrails={guardrails}
              setGuardrails={setGuardrails}
              rateLimit={rateLimit}
              setRateLimit={setRateLimit}
            />
            <SourcesSettingsTab sources={sources} setSources={setSources} />
            <PresetsTab
              setTemperature={setTemperature}
              setTopP={setTopP}
              setMaxTokens={setMaxTokens}
            />
          </Tabs>

          <PlaygroundPanel
            temperature={temperature}
            topP={topP}
            maxTokens={maxTokens}
            messages={playMessages}
            draft={draftUserMsg}
            setDraft={setDraftUserMsg}
            onSend={handleSend}
            onClear={handleClearMessages}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
