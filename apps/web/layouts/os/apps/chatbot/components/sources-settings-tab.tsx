'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { Switch } from '@workspace/ui/components/switch';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Database } from 'lucide-react';
import * as React from 'react';

type SourcesState = {
  faq: boolean;
  docs: boolean;
  kb: boolean;
};

type SourcesSettingsTabProps = {
  sources: SourcesState;
  setSources: React.Dispatch<React.SetStateAction<SourcesState>>;
};

export function SourcesSettingsTab({
  sources,
  setSources,
}: SourcesSettingsTabProps) {
  return (
    <TabsContent value="sources" className="mt-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Database className="size-5" /> Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SourceToggle
            label="FAQ"
            description="Short Q&A for common issues."
            checked={sources.faq}
            onCheckedChange={(value) =>
              setSources((prev) => ({ ...prev, faq: value }))
            }
          />
          <SourceToggle
            label="Docs"
            description="Product docs and API references."
            checked={sources.docs}
            onCheckedChange={(value) =>
              setSources((prev) => ({ ...prev, docs: value }))
            }
          />
          <SourceToggle
            label="Knowledge Base"
            description="Articles, tutorials, and internal notes."
            checked={sources.kb}
            onCheckedChange={(value) =>
              setSources((prev) => ({ ...prev, kb: value }))
            }
          />
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="url">Sitemap / URL (optional)</Label>
            <Input
              id="url"
              placeholder="https://docs.yoursite.com/sitemap.xml"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

type SourceToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

function SourceToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: SourceToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
