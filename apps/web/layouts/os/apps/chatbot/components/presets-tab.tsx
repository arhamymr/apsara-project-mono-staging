'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Sparkles, Wand2 } from 'lucide-react';
import * as React from 'react';

type PresetsTabProps = {
  setTemperature: React.Dispatch<React.SetStateAction<number[]>>;
  setTopP: React.Dispatch<React.SetStateAction<number[]>>;
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>;
};

const PRESETS = [
  { name: 'Concise Q&A', t: 0.2, p: 1, max: 800 },
  { name: 'Creative Help', t: 0.8, p: 1, max: 1200 },
  { name: 'Support Tone', t: 0.5, p: 0.95, max: 900 },
] as const;

export function PresetsTab({
  setTemperature,
  setTopP,
  setMaxTokens,
}: PresetsTabProps) {
  return (
    <TabsContent value="presets" className="mt-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5" /> Quick Presets
          </CardTitle>
          <CardDescription>Swap parameter bundles fast.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              size="sm"
              onClick={() => {
                setTemperature([preset.t]);
                setTopP([preset.p]);
                setMaxTokens(preset.max);
              }}
            >
              <Wand2 className="mr-2 size-4" /> {preset.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
