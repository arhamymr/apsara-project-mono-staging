'use client';

import { Badge } from '@workspace/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Slider } from '@workspace/ui/components/slider';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { Sliders, Wand2 } from 'lucide-react';
import * as React from 'react';

type ModelSettingsTabProps = {
  temperature: number[];
  setTemperature: React.Dispatch<React.SetStateAction<number[]>>;
  topP: number[];
  setTopP: React.Dispatch<React.SetStateAction<number[]>>;
  maxTokens: number;
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>;
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export function ModelSettingsTab({
  temperature,
  setTemperature,
  topP,
  setTopP,
  maxTokens,
  setMaxTokens,
  systemPrompt,
  setSystemPrompt,
}: ModelSettingsTabProps) {
  return (
    <TabsContent value="model" className="mt-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="size-5" /> Model &amp; Behavior
              </CardTitle>
              <CardDescription>
                Pick a model and tune generation parameters.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full">
              Core
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue="gpt-5o-mini">
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5o-mini">
                    GPT-5o Mini (fast, cost-effective)
                  </SelectItem>
                  <SelectItem value="gpt-5o">GPT-5o (balanced)</SelectItem>
                  <SelectItem value="gpt-5-turbo">
                    GPT-5 Turbo (quality)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Response Style</Label>
              <Select defaultValue="concise">
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {(temperature[0] ?? 0).toFixed(2)}
                </span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.01}
                value={temperature}
                onValueChange={setTemperature}
              />
              <p className="text-muted-foreground text-xs">
                Lower is deterministic, higher is creative.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="topP">Top-P</Label>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {(topP[0] ?? 0).toFixed(2)}
                </span>
              </div>
              <Slider
                id="topP"
                min={0}
                max={1}
                step={0.01}
                value={topP}
                onValueChange={setTopP}
              />
              <p className="text-muted-foreground text-xs">
                Nucleus sampling; keep near 1 unless you know why.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                inputMode="numeric"
                value={maxTokens}
                onChange={(e) =>
                  setMaxTokens(parseInt(e.target.value || '0', 10))
                }
              />
              <p className="text-muted-foreground text-xs">
                Hard cap for each assistant reply.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Language Preference</Label>
              <Select defaultValue="auto">
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (mirror user)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="jp">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="systemPrompt" className="flex items-center gap-2">
                <Wand2 className="size-4" /> System Prompt
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help rounded-full">
                    Tips
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  Keep instructions short. Define tone, scope, and what to
                  avoid. Use bullet points for rules.
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-28"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
