'use client';

import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Globe, RefreshCw } from 'lucide-react';
import { LivePreview } from './live-preview';
import { useState } from 'react';

interface PreviewTabProps {
  artifact?: {
    files: Record<string, string>;
    metadata?: {
      framework?: string;
    };
  } | null;
}

export function PreviewTab({ artifact }: PreviewTabProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const hasPreview = artifact && Object.keys(artifact.files).length > 0;

  return (
    <TabsContent
      value="preview"
      className="m-0 flex flex-1 flex-col overflow-hidden"
    >
      {/* Browser-like Title Bar */}
      <div className="bg-muted/50 flex items-center gap-2 border-b px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleRefresh}
          disabled={!hasPreview}
        >
          <RefreshCw size={14} />
        </Button>
        <div className="bg-background flex flex-1 items-center gap-2 rounded-md border px-3 py-1.5">
          <Globe size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground flex-1 truncate text-xs">
            {hasPreview ? 'Live Preview' : 'No preview available'}
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {hasPreview ? (
          <LivePreview
            key={refreshKey}
            files={artifact.files}
            framework={artifact.metadata?.framework}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <Globe className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                No Preview Available
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Ask the agent to create a component or web page to see a live preview.
              </p>
              <div className="bg-muted mt-4 rounded-lg p-4 font-mono text-xs">
                &quot;Create a simple React counter component&quot;
              </div>
              <p className="text-muted-foreground mt-4 text-xs">
                The preview will render automatically without needing a sandbox.
              </p>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
