'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { WebContainer } from '@webcontainer/api';

import type { SandboxStatus, UseWebContainerOptions, UseWebContainerReturn } from './types';
import { getWebContainer } from './singleton';
import { convertToWebContainerFiles, getFilesHash, hasPackageJson } from './utils';
import { validateAndFixFiles, debugLogFiles } from './file-validator';
import { installDependencies, startDevServer, startStaticServer } from './dev-server';
import { mergeWithBoilerplate, needsBoilerplate } from './boilerplate';

/**
 * Strip ANSI escape codes and clean terminal output
 */
function cleanOutput(data: string): string | null {
  // eslint-disable-next-line no-control-regex
  const cleaned = data.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '').trim();
  
  // Filter out spinner frames and empty lines
  if (!cleaned || cleaned.length === 0) return null;
  if (/^[|/\-\\]+$/.test(cleaned)) return null;
  if (cleaned === '[1G' || cleaned === '[0K') return null;
  
  return cleaned;
}

export function useWebContainer({
  files,
  enabled = true,
  onLog,
}: UseWebContainerOptions): UseWebContainerReturn {
  const [status, setStatus] = useState<SandboxStatus>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<WebContainer | null>(null);
  const serverProcessRef = useRef<{ kill: () => void } | null>(null);
  const mountedFilesRef = useRef<Record<string, string>>({});
  const isBootingRef = useRef(false);
  const isServerRunningRef = useRef(false);
  const installedPackageJsonRef = useRef<string | null>(null); // Cache package.json to skip reinstall

  const addLog = useCallback(
    (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${message}`;
      setLogs((prev) => [...prev.slice(-100), logEntry]);
      onLog?.(logEntry);
    },
    [onLog]
  );

  /**
   * Write only changed files to the container (for HMR)
   * Returns true if package.json changed (needs reinstall)
   */
  const updateChangedFiles = useCallback(async (
    container: WebContainer,
    newFiles: Record<string, string>
  ): Promise<boolean> => {
    const changedFiles: string[] = [];
    let packageJsonChanged = false;
    
    for (const [path, content] of Object.entries(newFiles)) {
      if (mountedFilesRef.current[path] !== content) {
        changedFiles.push(path);
        
        // Track if package.json changed
        if (path === 'package.json') {
          packageJsonChanged = true;
        }
        
        try {
          // Ensure parent directories exist
          const parts = path.split('/').filter(Boolean);
          if (parts.length > 1) {
            const dirPath = '/' + parts.slice(0, -1).join('/');
            try {
              await container.fs.mkdir(dirPath, { recursive: true });
            } catch {
              // Directory might already exist
            }
          }
          await container.fs.writeFile('/' + path, content);
          mountedFilesRef.current[path] = content;
        } catch (err) {
          console.error(`[Sandbox] Failed to write file ${path}:`, err);
        }
      }
    }

    if (changedFiles.length > 0) {
      addLog(`HMR: Updated ${changedFiles.length} file(s)`);
      console.log('[Sandbox Debug] HMR updated files:', changedFiles);
      
      // If package.json changed, reinstall dependencies
      if (packageJsonChanged) {
        addLog('package.json changed, reinstalling dependencies...');
        await installDependencies(container, addLog);
        installedPackageJsonRef.current = newFiles['package.json'] || '';
      }
    }
    
    return packageJsonChanged;
  }, [addLog]);

  const startSandbox = useCallback(async () => {
    if (!enabled) {
      console.log('[Sandbox Debug] Skipping - not enabled');
      return;
    }

    // Merge with boilerplate if needed (empty files or missing package.json)
    const useBoilerplate = needsBoilerplate(files);
    const mergedFiles = mergeWithBoilerplate(files, useBoilerplate);

    if (useBoilerplate) {
      console.log('[Sandbox Debug] Using React+Vite boilerplate template');
    }

    // If server is already running, just update changed files (HMR)
    if (isServerRunningRef.current && containerRef.current) {
      await updateChangedFiles(containerRef.current, mergedFiles);
      return;
    }

    if (isBootingRef.current) {
      console.log('[Sandbox Debug] Skipping - boot already in progress');
      return;
    }

    try {
      isBootingRef.current = true;
      setError(null);
      setStatus('booting');
      addLog('Booting WebContainer...');

      debugLogFiles(mergedFiles, 'Input Files');

      const container = await getWebContainer();
      containerRef.current = container;

      if (serverProcessRef.current) {
        serverProcessRef.current.kill();
        serverProcessRef.current = null;
        isServerRunningRef.current = false;
      }

      setStatus('installing');
      addLog('Mounting files...');

      const validatedFiles = validateAndFixFiles(mergedFiles);
      debugLogFiles(validatedFiles, 'Validated Files (after fixes)');

      const webContainerFiles = convertToWebContainerFiles(validatedFiles);
      console.log(
        '[Sandbox Debug] WebContainer file tree:',
        JSON.stringify(webContainerFiles, null, 2).slice(0, 2000)
      );

      await container.mount(webContainerFiles);
      // Track mounted files for HMR comparison
      mountedFilesRef.current = { ...validatedFiles };

      addLog(`Mounted ${Object.keys(validatedFiles).length} files`);

      if (hasPackageJson(mergedFiles)) {
        // Check if package.json changed - only reinstall if dependencies changed
        const currentPackageJson = validatedFiles['package.json'] || '';
        const needsInstall = installedPackageJsonRef.current !== currentPackageJson;
        
        if (needsInstall) {
          await installDependencies(container, addLog);
          installedPackageJsonRef.current = currentPackageJson;
        } else {
          addLog('Dependencies cached, skipping npm install');
        }
        
        addLog('Starting dev server...');

        const serverProcess = await startDevServer(container, addLog);
        if (serverProcess) {
          serverProcessRef.current = serverProcess;
        } else {
          serverProcessRef.current = await startStaticServer(container, addLog);
        }
      } else {
        addLog('Static project detected, starting HTTP server...');
        console.log('[Sandbox Debug] No package.json found, serving static files');

        await container.fs.writeFile(
          '/package.json',
          JSON.stringify({
            name: 'preview',
            scripts: { start: 'npx -y serve -l 3000' },
          })
        );

        serverProcessRef.current = await startStaticServer(container, addLog);
      }

      container.on('server-ready', (port, url) => {
        addLog(`Server ready on port ${port}: ${url}`);
        setPreviewUrl(url);
        setStatus('running');
        isServerRunningRef.current = true;
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
  }, [files, enabled, addLog, updateChangedFiles]);

  useEffect(() => {
    if (enabled) {
      startSandbox();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, getFilesHash(files)]);

  useEffect(() => {
    return () => {
      if (serverProcessRef.current) {
        serverProcessRef.current.kill();
      }
      isServerRunningRef.current = false;
    };
  }, []);

  const restart = useCallback(async (forceReinstall = false) => {
    // Force full restart by resetting server state
    isServerRunningRef.current = false;
    mountedFilesRef.current = {};
    if (forceReinstall) {
      installedPackageJsonRef.current = null; // Clear cache to force reinstall
    }
    if (serverProcessRef.current) {
      serverProcessRef.current.kill();
      serverProcessRef.current = null;
    }
    await startSandbox();
  }, [startSandbox]);

  // Run a single command and get output
  const runCommand = useCallback(async (command: string) => {
    const container = containerRef.current;
    if (!container) {
      addLog('Error: WebContainer not ready');
      return;
    }

    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    if (!cmd) return;

    try {
      addLog(`$ ${command}`);
      const process = await container.spawn(cmd, args);
      
      process.output.pipeTo(
        new WritableStream({
          write(data) {
            const cleaned = cleanOutput(data);
            if (cleaned) {
              addLog(cleaned);
            }
          },
        })
      );

      const exitCode = await process.exit;
      if (exitCode !== 0) {
        addLog(`Process exited with code ${exitCode}`);
      }
    } catch (err) {
      addLog(`Error: ${err instanceof Error ? err.message : 'Command failed'}`);
    }
  }, [addLog]);

  // Spawn an interactive shell for xterm
  const spawnShell = useCallback(async () => {
    const container = containerRef.current;
    if (!container) {
      console.log('[WebContainer] Cannot spawn shell - container not ready');
      return null;
    }

    try {
      const shellProcess = await container.spawn('jsh', {
        terminal: {
          cols: 80,
          rows: 24,
        },
      });

      const input = shellProcess.input.getWriter();
      const callbacks: ((data: string) => void)[] = [];

      // Pipe output to callbacks
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            callbacks.forEach((cb) => cb(data));
          },
        })
      );

      return {
        write: (data: string) => {
          input.write(data);
        },
        onData: (callback: (data: string) => void) => {
          callbacks.push(callback);
        },
        kill: () => {
          shellProcess.kill();
        },
      };
    } catch (err) {
      console.error('[WebContainer] Failed to spawn shell:', err);
      return null;
    }
  }, []);

  return {
    status,
    previewUrl,
    logs,
    error,
    restart,
    runCommand,
    spawnShell,
  };
}
