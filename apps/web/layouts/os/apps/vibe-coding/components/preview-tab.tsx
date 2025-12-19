'use client';

import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Globe, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import type { SandboxStatus } from '../hooks/use-webcontainer';

interface PreviewTabProps {
  artifact?: {
    files: Record<string, string>;
    metadata?: {
      framework?: string;
    };
  } | null;
  isActive?: boolean;
  // Shared webcontainer state from parent
  sandboxStatus?: SandboxStatus;
  previewUrl?: string | null;
  sandboxError?: string | null;
  onRestart?: () => Promise<void>;
}

export function PreviewTab({ 
  artifact, 
  sandboxStatus,
  previewUrl,
  sandboxError,
  onRestart,
}: PreviewTabProps) {
  const files = artifact?.files || {};
  const hasFiles = Object.keys(files).length > 0;
  
  // Use passed props or defaults
  const status = sandboxStatus || 'idle';
  const error = sandboxError || null;

  const handleRefresh = () => {
    onRestart?.();
  };

  const getStatusText = (status: SandboxStatus) => {
    switch (status) {
      case 'booting': return 'Booting sandbox...';
      case 'installing': return 'Installing dependencies...';
      case 'ready': return 'Starting server...';
      case 'running': return previewUrl || 'Running';
      case 'error': return 'Error';
      default: return 'Idle';
    }
  };

  const isLoading = status === 'booting' || status === 'installing' || status === 'ready';

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
          disabled={!hasFiles || isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </Button>
        
        <div className="bg-background flex flex-1 items-center gap-2 rounded-md border px-3 py-1.5">
          {isLoading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
          {status === 'error' && <AlertCircle size={12} className="text-destructive" />}
          {status === 'running' && <Globe size={14} className="text-green-500" />}
          {status === 'idle' && <Globe size={14} className="text-muted-foreground" />}
          <span className="text-muted-foreground flex-1 truncate text-xs">
            {getStatusText(status)}
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {!hasFiles ? (
          <EmptyState />
        ) : (
          <SandboxPreview 
            status={status} 
            previewUrl={previewUrl ?? null} 
            error={error}
          />
        )}
      </div>
    </TabsContent>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md text-center">
        <Globe className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">No Preview Available</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Ask the agent to create a component or web page to see a live preview.
        </p>
        <div className="bg-muted mt-4 rounded-lg p-4 font-mono text-xs">
          &quot;Create a simple React counter component&quot;
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          The preview will render automatically when code is generated.
        </p>
      </div>
    </div>
  );
}

interface SandboxPreviewProps {
  status: SandboxStatus;
  previewUrl: string | null;
  error: string | null;
}

function SandboxPreview({ status, previewUrl, error }: SandboxPreviewProps) {
  const isLoading = status === 'booting' || status === 'installing' || status === 'ready';
  
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="text-destructive mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">Sandbox Error</h3>
          <p className="text-muted-foreground mt-2 text-sm">{error}</p>
          <p className="text-muted-foreground mt-4 text-xs">
            Check the Terminal tab for more details
          </p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-4 text-sm">
            {status === 'booting' && 'Booting WebContainer...'}
            {status === 'installing' && 'Installing dependencies...'}
            {status === 'ready' && 'Starting dev server...'}
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            This may take a moment for first-time setup
          </p>
        </div>
      </div>
    );
  }
  
  if (previewUrl) {
    return (
      <iframe
        src={previewUrl}
        className="h-full w-full border-0"
        title="Sandbox Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    );
  }
  
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Globe className="text-muted-foreground mx-auto h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">Waiting for Server</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          The sandbox is running but no server URL detected yet.
        </p>
        <p className="text-muted-foreground mt-4 text-xs">
          Check the Terminal tab for logs
        </p>
      </div>
    </div>
  );
}
