'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Terminal, Trash2, Play } from 'lucide-react';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';

interface SandboxTerminalProps {
  logs: string[];
  status: string;
  onRunCommand?: (command: string) => Promise<void>;
  onClear?: () => void;
}

export function SandboxTerminal({
  logs,
  status,
  onRunCommand,
  onClear,
}: SandboxTerminalProps) {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRunCommand = async () => {
    if (!command.trim() || !onRunCommand || isRunning) return;

    const cmd = command.trim();
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommand('');
    setIsRunning(true);

    try {
      await onRunCommand(cmd);
    } finally {
      setIsRunning(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'installing':
      case 'booting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const isReady = status === 'running' || status === 'ready';
  const canRun = isReady && !!onRunCommand; // Can only run when ready

  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return 'Generate some code first to start the sandbox';
      case 'booting':
        return 'Booting WebContainer...';
      case 'installing':
        return 'Installing dependencies...';
      case 'ready':
        return 'Starting server...';
      case 'running':
        return 'Ready. Enter commands below.';
      case 'error':
        return 'Error occurred. Check logs above.';
      default:
        return `Status: ${status}`;
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
          <span className="text-sm font-medium">Terminal</span>
          <span className={`text-xs ${getStatusColor()}`}>
            ({status})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={logs.length === 0}
        >
          <Trash2 size={14} />
          <span className="ml-2">Clear</span>
        </Button>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-black p-4 font-mono text-sm text-green-400"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500">
            <p>WebContainer Terminal</p>
            <p className="mt-2">{getStatusMessage()}</p>
          </div>
        ) : (
          <div className="space-y-0.5 whitespace-pre-wrap">
            {logs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command Input */}
      <div className="bg-black border-t border-gray-800 p-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm ${canRun ? 'text-green-400' : 'text-gray-500'}`}>$</span>
          <Input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={canRun ? 'Enter command... (e.g., ls, npm run build)' : getStatusMessage()}
            disabled={isRunning}
            className="flex-1 bg-transparent border-none text-green-400 font-mono text-sm placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRunCommand}
            disabled={!canRun || isRunning || !command.trim()}
            className="text-green-400 hover:text-green-300 hover:bg-gray-800"
          >
            <Play size={14} />
          </Button>
        </div>
        <div className="text-xs text-gray-600 mt-1 px-4">
          {canRun ? 'Press Enter to run • ↑↓ for history' : 'Waiting for sandbox to be ready...'}
        </div>
      </div>
    </TabsContent>
  );
}
