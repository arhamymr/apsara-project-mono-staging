'use client';

import type { WebContainer } from '@webcontainer/api';

type ProcessRef = { kill: () => void } | null;

/**
 * Strip ANSI escape codes from terminal output
 */
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');
}

/**
 * Clean terminal output - strip ANSI codes and filter noise
 */
function cleanOutput(data: string): string | null {
  const cleaned = stripAnsi(data).trim();
  
  // Filter out spinner frames and empty lines
  if (!cleaned || cleaned.length === 0) return null;
  if (/^[|/\-\\]+$/.test(cleaned)) return null; // Spinner characters only
  if (cleaned === '[1G' || cleaned === '[0K') return null; // Cursor control
  
  return cleaned;
}

const DEV_COMMANDS: [string, string[]][] = [
  ['npm', ['run', 'dev']],
  ['npm', ['run', 'start']],
  ['npm', ['start']],
  ['npx', ['-y', 'vite']],
  ['npx', ['-y', 'next', 'dev']],
];

/**
 * Start a dev server using common commands
 */
export async function startDevServer(
  container: WebContainer,
  addLog: (msg: string) => void
): Promise<ProcessRef> {
  for (const [cmd, args] of DEV_COMMANDS) {
    try {
      console.log(`[Sandbox Debug] Trying command: ${cmd} ${args.join(' ')}`);
      addLog(`Trying: ${cmd} ${args.join(' ')}`);

      const process = await container.spawn(cmd, args);

      process.output.pipeTo(
        new WritableStream({
          write(data) {
            const cleaned = cleanOutput(data);
            if (cleaned) {
              addLog(cleaned);
              console.log(`[Sandbox Output] ${cleaned}`);
            }
          },
        })
      );

      console.log(`[Sandbox Debug] Server started with: ${cmd} ${args.join(' ')}`);
      return process;
    } catch (cmdError) {
      console.log(`[Sandbox Debug] Command failed: ${cmd} ${args.join(' ')}`, cmdError);
      continue;
    }
  }

  return null;
}

/**
 * Start a static file server as fallback
 */
export async function startStaticServer(
  container: WebContainer,
  addLog: (msg: string) => void
): Promise<ProcessRef> {
  addLog('No dev script found, serving static files...');
  console.log('[Sandbox Debug] Falling back to static file server');

  const serveProcess = await container.spawn('npx', ['-y', 'serve', '-l', '3000']);

  serveProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        const cleaned = cleanOutput(data);
        if (cleaned) {
          addLog(cleaned);
          console.log(`[Sandbox Output] ${cleaned}`);
        }
      },
    })
  );

  return serveProcess;
}

/**
 * Install npm dependencies
 */
export async function installDependencies(
  container: WebContainer,
  addLog: (msg: string) => void
): Promise<void> {
  addLog('Installing dependencies...');

  const installProcess = await container.spawn('npm', ['install']);

  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        const cleaned = cleanOutput(data);
        if (cleaned) {
          addLog(cleaned);
        }
      },
    })
  );

  const installExitCode = await installProcess.exit;

  if (installExitCode !== 0) {
    throw new Error(`npm install failed with exit code ${installExitCode}`);
  }

  addLog('Dependencies installed successfully');
}
