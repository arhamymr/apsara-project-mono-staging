'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { Switch } from '@workspace/ui/components/switch';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Database, Globe, Plug } from 'lucide-react';
import * as React from 'react';

type ToolsSettingsTabProps = {
  toolSearch: boolean;
  setToolSearch: React.Dispatch<React.SetStateAction<boolean>>;
  toolRetrieval: boolean;
  setToolRetrieval: React.Dispatch<React.SetStateAction<boolean>>;
  toolWeb: boolean;
  setToolWeb: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ToolsSettingsTab({
  toolSearch,
  setToolSearch,
  toolRetrieval,
  setToolRetrieval,
  toolWeb,
  setToolWeb,
}: ToolsSettingsTabProps) {
  return (
    <TabsContent value="tools" className="mt-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Plug className="size-5" /> Tools
          </CardTitle>
          <CardDescription>
            Enable capabilities the assistant may use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToolToggle
            label="In-App Search"
            description="Look up products, orders, or tickets inside your app via API."
            icon={<SearchIcon />}
            checked={toolSearch}
            onCheckedChange={setToolSearch}
          />
          <Separator />
          <ToolToggle
            label="Retrieval"
            description="Augment answers with your docs/FAQ using embeddings."
            icon={<Database className="size-4" />}
            checked={toolRetrieval}
            onCheckedChange={setToolRetrieval}
          />
          <Separator />
          <ToolToggle
            label="Web Browsing"
            description="Let the bot consult the public web for fresh info."
            icon={<Globe className="size-4" />}
            checked={toolWeb}
            onCheckedChange={setToolWeb}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

type ToolToggleProps = {
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

function ToolToggle({
  label,
  description,
  icon,
  checked,
  onCheckedChange,
}: ToolToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="flex items-center gap-2">
          {icon} {label}
        </Label>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
    >
      <path
        fillRule="evenodd"
        d="M10 2a8 8 0 105.293 14.293l3.707 3.707a1 1 0 001.414-1.414l-3.707-3.707A8 8 0 0010 2zm-6 8a6 6 0 1110.89 3.476.999.999 0 00-.217.217A6 6 0 014 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}
