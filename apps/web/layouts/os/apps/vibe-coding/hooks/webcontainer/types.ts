'use client';

export type SandboxStatus = 'idle' | 'booting' | 'ready' | 'installing' | 'running' | 'error';

export interface UseWebContainerOptions {
  files: Record<string, string>;
  enabled?: boolean;
  onLog?: (log: string) => void;
}

export interface UseWebContainerReturn {
  status: SandboxStatus;
  previewUrl: string | null;
  logs: string[];
  error: string | null;
  restart: (forceReinstall?: boolean) => Promise<void>;
  // Terminal functionality
  runCommand: (command: string) => Promise<void>;
  spawnShell: () => Promise<{
    write: (data: string) => void;
    onData: (callback: (data: string) => void) => void;
    kill: () => void;
  } | null>;
}

export type FileSystemTree = Record<
  string,
  { file: { contents: string } } | { directory: FileSystemTree }
>;
