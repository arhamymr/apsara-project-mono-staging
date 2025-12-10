'use client';

import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Globe, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useWebContainer, SandboxStatus } from '../hooks/use-webcontainer';
import { useState, useEffect } from 'react';

interface PreviewTabProps {
  artifact?: {
    files: Record<string, string>;
    metadata?: {
      framework?: string;
    };
  } | null;
  isActive?: boolean;
}

export function PreviewTab({ artifact, isActive = false }: PreviewTabProps) {
  const files = artifact?.files || {};
  const hasFiles = Object.keys(files).length > 0;
  
  const {
    status,
    previewUrl,
    logs,
    error,
    restart,
  } = useWebContainer({
    files,
    enabled: isActive && hasFiles,
  });

  const handleRefresh = () => {
    restart();
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
            previewUrl={previewUrl} 
            error={error}
            logs={logs}
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
  logs: string[];
}

function SandboxPreview({ status, previewUrl, error, logs }: SandboxPreviewProps) {
  const isLoading = status === 'booting' || status === 'installing' || status === 'ready';
  
  if (error) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center">
            <AlertCircle className="text-destructive mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-semibold">Sandbox Error</h3>
            <p className="text-muted-foreground mt-2 text-sm">{error}</p>
          </div>
        </div>
        <LogsPanel logs={logs} />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-center justify-center">
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
        <LogsPanel logs={logs} />
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
    <div className="flex h-full flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Globe className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-semibold">Waiting for Server</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            The sandbox is running but no server URL detected yet.
          </p>
        </div>
      </div>
      <LogsPanel logs={logs} />
    </div>
  );
}

function LogsPanel({ logs }: { logs: string[] }) {
  const [height, setHeight] = useState(128);
  const [isResizing, setIsResizing] = useState(false);
  
  useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new height based on mouse position from bottom
      const container = document.getElementById('logs-panel-container');
      if (!container) return;
      
      const containerRect = container.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      const newHeight = containerRect.bottom - e.clientY;
      // Clamp between 50px and 400px
      setHeight(Math.max(50, Math.min(400, newHeight)));
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  if (logs.length === 0) return null;
  
  return (
    <div 
      id="logs-panel-container"
      className="border-t bg-black overflow-auto flex flex-col"
      style={{ height }}
    >
      {/* Resize handle */}
      <div
        className="h-1 w-full cursor-ns-resize bg-zinc-700 hover:bg-zinc-500 transition-colors flex-shrink-0"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      />
      <div className="p-2 font-mono text-xs text-green-400 flex-1 overflow-auto">
        {logs.slice(-50).map((log, i) => (
          <div key={i} className="whitespace-pre-wrap">{log}</div>
        ))}
      </div>
    </div>
  );
}
