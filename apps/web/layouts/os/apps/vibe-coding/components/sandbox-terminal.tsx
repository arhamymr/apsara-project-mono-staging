'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Terminal, Trash2, Play } from 'lucide-react';
import { useEffect, useRef, useState, useCallback, useMemo, memo, KeyboardEvent } from 'react';

interface SandboxTerminalProps {
  logs: string[];
  status: string;
  onRunCommand?: (command: string) => Promise<void>;
  onClear?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  running: 'text-green-400',
  error: 'text-red-400',
  installing: 'text-yellow-400',
  booting: 'text-yellow-400',
};

const STATUS_MESSAGES: Record<string, string> = {
  idle: 'Generate some code first to start the sandbox',
  booting: 'Booting WebContainer...',
  installing: 'Installing dependencies...',
  ready: 'Starting server...',
  running: 'Ready. Enter commands below.',
  error: 'Error occurred. Check logs above.',
};

// Memoized log line component to prevent re-renders
const LogLine = memo(({ content }: { content: string }) => (
  <div className="leading-relaxed">{content}</div>
));
LogLine.displayName = 'LogLine';

// Memoized logs container to prevent re-renders when other state changes
const LogsContainer = memo(({ logs }: { logs: string[] }) => (
  <div className="space-y-0.5 whitespace-pre-wrap">
    {logs.map((log, index) => (
      <LogLine key={index} content={log} />
    ))}
  </div>
));
LogsContainer.displayName = 'LogsContainer';

export function SandboxTerminal({
  logs,
  status,
  onRunCommand,
  onClear,
}: SandboxTerminalProps) {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when logs change (using RAF for smooth scrolling)
  useEffect(() => {
    if (scrollRef.current && logs.length > 0) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      });
    }
  }, [logs.length]);

  const handleRunCommand = useCallback(async () => {
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
  }, [command, onRunCommand, isRunning]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        const newIndex = prev < commandHistory.length - 1 ? prev + 1 : prev;
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
        return newIndex;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex((prev) => {
        if (prev > 0) {
          const newIndex = prev - 1;
          setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
          return newIndex;
        } else if (prev === 0) {
          setCommand('');
          return -1;
        }
        return prev;
      });
    }
  }, [handleRunCommand, commandHistory]);

  const statusColor = useMemo(() => STATUS_COLORS[status] || 'text-gray-400', [status]);
  
  const isReady = status === 'running' || status === 'ready';
  const canRun = isReady && !!onRunCommand;
  
  const statusMessage = useMemo(() => STATUS_MESSAGES[status] || `Status: ${status}`, [status]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  }, []);

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
          <span className={`text-xs ${statusColor}`}>
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
            <p className="mt-2">{statusMessage}</p>
          </div>
        ) : (
          <LogsContainer logs={logs} />
        )}
      </div>

      {/* Command Input */}
      <div className="bg-black border-t border-gray-800 p-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm ${canRun ? 'text-green-400' : 'text-gray-500'}`}>$</span>
          <Input
            ref={inputRef}
            value={command}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={canRun ? 'Enter command... (e.g., ls, npm run build)' : statusMessage}
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
