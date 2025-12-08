'use client';

import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Terminal, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConsoleLog {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

interface TerminalTabProps {
  artifact?: {
    files: Record<string, string>;
  } | null;
}

export function TerminalTab({ artifact }: TerminalTabProps) {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);

  // Listen for console messages from the preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        const newLog: ConsoleLog = {
          id: crypto.randomUUID(),
          type: event.data.level || 'log',
          message: event.data.message || '',
          timestamp: new Date(),
        };
        setLogs((prev) => [...prev, newLog]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Clear logs when artifact changes
  useEffect(() => {
    setLogs([]);
  }, [artifact]);

  const handleClear = () => {
    setLogs([]);
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-green-400';
    }
  };

  const getLogPrefix = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return '[ERROR]';
      case 'warn':
        return '[WARN]';
      case 'info':
        return '[INFO]';
      default:
        return '[LOG]';
    }
  };

  return (
    <TabsContent
      value="terminal"
      className="m-0 flex flex-1 flex-col overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium">Console</span>
          {logs.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({logs.length} {logs.length === 1 ? 'log' : 'logs'})
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={logs.length === 0}
        >
          <Trash2 size={14} />
          <span className="ml-2">Clear</span>
        </Button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-auto bg-black p-4 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-muted-foreground">
            <p>No console logs yet.</p>
            <p className="mt-2">
              Console logs from the preview will appear here.
            </p>
            <p className="mt-4 text-xs">
              Try: <span className="text-green-400">console.log(&quot;Hello&quot;)</span>
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="text-gray-500 text-xs">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span className={`${getLogColor(log.type)} font-semibold`}>
                  {getLogPrefix(log.type)}
                </span>
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
}
