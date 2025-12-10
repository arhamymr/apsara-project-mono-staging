'use client';

import { WebContainer } from '@webcontainer/api';
import { useCallback, useEffect, useRef, useState } from 'react';

export type SandboxStatus = 'idle' | 'booting' | 'ready' | 'installing' | 'running' | 'error';

interface UseWebContainerOptions {
  files: Record<string, string>;
  enabled?: boolean;
  onLog?: (log: string) => void;
}

interface UseWebContainerReturn {
  status: SandboxStatus;
  previewUrl: string | null;
  logs: string[];
  error: string | null;
  restart: () => Promise<void>;
}

// Singleton WebContainer instance (only one allowed per page)
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;
let bootFailed = false;

async function getWebContainer(): Promise<WebContainer> {
  // If we already have an instance, return it
  if (webcontainerInstance) return webcontainerInstance;
  
  // If boot already failed, don't retry
  if (bootFailed) {
    throw new Error('WebContainer boot previously failed. Refresh the page to retry.');
  }
  
  // If boot is in progress, wait for it
  if (bootPromise) {
    return bootPromise;
  }
  
  // Start booting
  bootPromise = WebContainer.boot()
    .then((instance) => {
      webcontainerInstance = instance;
      return instance;
    })
    .catch((err) => {
      bootFailed = true;
      bootPromise = null;
      throw err;
    });
  
  return bootPromise;
}

export function useWebContainer({ 
  files, 
  enabled = true,
  onLog 
}: UseWebContainerOptions): UseWebContainerReturn {
  const [status, setStatus] = useState<SandboxStatus>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<WebContainer | null>(null);
  const serverProcessRef = useRef<{ kill: () => void } | null>(null);
  const filesHashRef = useRef<string>('');
  const isBootingRef = useRef(false);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-100), logEntry]); // Keep last 100 logs
    onLog?.(logEntry);
  }, [onLog]);

  // Convert files to WebContainer format
  const convertToWebContainerFiles = useCallback((files: Record<string, string>) => {
    type FileSystemTree = Record<string, { file: { contents: string } } | { directory: FileSystemTree }>;
    const result: FileSystemTree = {};
    
    for (const [path, content] of Object.entries(files)) {
      const parts = path.split('/').filter(Boolean);
      let current: FileSystemTree = result;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]!;
        const isFile = i === parts.length - 1;
        
        if (isFile) {
          current[part] = { file: { contents: content } };
        } else {
          if (!current[part]) {
            current[part] = { directory: {} };
          }
          const node = current[part];
          if ('directory' in node) {
            current = node.directory;
          }
        }
      }
    }
    
    return result;
  }, []);

  // Generate a hash of files to detect changes
  const getFilesHash = useCallback((files: Record<string, string>) => {
    return JSON.stringify(Object.entries(files).sort());
  }, []);

  // Check if project has package.json
  const hasPackageJson = useCallback((files: Record<string, string>) => {
    return Object.keys(files).some(f => f === 'package.json' || f.endsWith('/package.json'));
  }, []);

  // Validate and fix package.json if needed
  const validateAndFixFiles = useCallback((files: Record<string, string>): Record<string, string> => {
    const result = { ...files };
    
    // Find package.json files and validate them
    for (const [path, content] of Object.entries(result)) {
      if (path === 'package.json' || path.endsWith('/package.json')) {
        try {
          JSON.parse(content);
        } catch {
          // Try to create a minimal valid package.json
          console.warn(`Invalid package.json at ${path}, creating minimal version`);
          result[path] = JSON.stringify({
            name: 'preview-app',
            version: '1.0.0',
            scripts: {
              dev: 'vite',
              start: 'vite preview',
              build: 'vite build'
            },
            dependencies: {}
          }, null, 2);
        }
      }
    }
    
    return result;
  }, []);



  const startSandbox = useCallback(async () => {
    if (!enabled || Object.keys(files).length === 0) return;
    
    const currentHash = getFilesHash(files);
    if (currentHash === filesHashRef.current) {
      return; // No changes, skip restart
    }
    
    // Prevent concurrent boot attempts
    if (isBootingRef.current) {
      return;
    }
    
    try {
      isBootingRef.current = true;
      setError(null);
      setStatus('booting');
      addLog('Booting WebContainer...');
      
      const container = await getWebContainer();
      containerRef.current = container;
      
      // Kill existing server process
      if (serverProcessRef.current) {
        serverProcessRef.current.kill();
        serverProcessRef.current = null;
      }
      
      setStatus('installing');
      addLog('Mounting files...');
      
      // Validate and fix files before mounting
      const validatedFiles = validateAndFixFiles(files);
      
      // Mount files
      const webContainerFiles = convertToWebContainerFiles(validatedFiles);
      await container.mount(webContainerFiles);
      filesHashRef.current = currentHash;
      
      addLog(`Mounted ${Object.keys(validatedFiles).length} files`);

      // Check if this is a Node.js project
      if (hasPackageJson(files)) {
        addLog('Installing dependencies...');
        
        const installProcess = await container.spawn('npm', ['install']);
        
        installProcess.output.pipeTo(new WritableStream({
          write(data) {
            addLog(data);
          }
        }));
        
        const installExitCode = await installProcess.exit;
        
        if (installExitCode !== 0) {
          throw new Error(`npm install failed with exit code ${installExitCode}`);
        }
        
        addLog('Dependencies installed successfully');
        addLog('Starting dev server...');
        
        // Try common dev server commands
        const devCommands: [string, string[]][] = [
          ['npm', ['run', 'dev']],
          ['npm', ['run', 'start']],
          ['npm', ['start']],
          ['npx', ['vite']],
          ['npx', ['next', 'dev']],
        ];
        
        let serverStarted = false;
        
        for (const [cmd, args] of devCommands) {
          try {
            const process = await container.spawn(cmd, args);
            serverProcessRef.current = process;
            
            process.output.pipeTo(new WritableStream({
              write(data) {
                addLog(data);
              }
            }));
            
            serverStarted = true;
            break;
          } catch {
            continue;
          }
        }
        
        if (!serverStarted) {
          // Fallback: serve static files
          addLog('No dev script found, serving static files...');
          const serveProcess = await container.spawn('npx', ['serve', '-l', '3000']);
          serverProcessRef.current = serveProcess;
          
          serveProcess.output.pipeTo(new WritableStream({
            write(data) {
              addLog(data);
            }
          }));
        }
      } else {
        // Static HTML project - use simple HTTP server
        addLog('Static project detected, starting HTTP server...');
        
        // Create a simple package.json for serve
        await container.fs.writeFile('/package.json', JSON.stringify({
          name: 'preview',
          scripts: { start: 'npx serve -l 3000' }
        }));
        
        const serveProcess = await container.spawn('npx', ['serve', '-l', '3000']);
        serverProcessRef.current = serveProcess;
        
        serveProcess.output.pipeTo(new WritableStream({
          write(data) {
            addLog(data);
          }
        }));
      }
      
      // Listen for server-ready event
      container.on('server-ready', (port, url) => {
        addLog(`Server ready on port ${port}: ${url}`);
        setPreviewUrl(url);
        setStatus('running');
      });
      
      setStatus('ready');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start sandbox';
      setError(message);
      setStatus('error');
      addLog(`Error: ${message}`);
    } finally {
      isBootingRef.current = false;
    }
  }, [files, enabled, addLog, convertToWebContainerFiles, getFilesHash, hasPackageJson, validateAndFixFiles]);


  // Start sandbox when enabled and files change
  useEffect(() => {
    if (enabled && Object.keys(files).length > 0) {
      startSandbox();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, getFilesHash(files)]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (serverProcessRef.current) {
        serverProcessRef.current.kill();
      }
    };
  }, []);

  const restart = useCallback(async () => {
    filesHashRef.current = ''; // Force restart
    await startSandbox();
  }, [startSandbox]);

  return {
    status,
    previewUrl,
    logs,
    error,
    restart,
  };
}
