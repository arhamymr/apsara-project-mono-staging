'use client';

import { Key, BookOpen, BarChart3, FlaskConical } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

type TabType = 'overview' | 'keys' | 'docs' | 'testing';

interface ApiHubHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  stats: {
    activeKeys: number;
  };
}

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'keys', label: 'API Keys', icon: <Key className="h-4 w-4" /> },
  { id: 'docs', label: 'API Docs', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'testing', label: 'Testing', icon: <FlaskConical className="h-4 w-4" /> },
];

export function ApiHubHeader({ activeTab, onTabChange, stats }: ApiHubHeaderProps) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">API Hub</h1>
            <p className="text-xs text-muted-foreground">Manage integrations & external access</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {stats.activeKeys} active keys
          </span>
        </div>
      </div>
      
      <div className="flex gap-1 px-4 pb-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'gap-2 rounded-lg',
              activeTab === tab.id && 'bg-muted'
            )}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
