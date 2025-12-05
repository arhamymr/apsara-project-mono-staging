const { spawnSync, execSync } = require('child_process');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 1323;

// Kill any process using the port (Windows)
function killProcessOnPort(port) {
  try {
    // Find PID using the port
    const result = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const lines = result.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    });
    
    pids.forEach(pid => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`Killed process ${pid} on port ${port}`);
      } catch (e) {
        // Process might already be dead
      }
    });
  } catch (e) {
    // No process found on port, which is fine
    console.log(`Port ${port} is available`);
  }
}

// Kill existing process on port before starting
killProcessOnPort(PORT);

// Set Go environment variables if not already set
if (!process.env.GOCACHE) {
  process.env.GOCACHE = path.join(os.homedir(), 'go-cache');
}
if (!process.env.LOCALAPPDATA) {
  process.env.LOCALAPPDATA = path.join(os.homedir(), 'AppData', 'Local');
}

console.log('GOCACHE:', process.env.GOCACHE);
console.log('LOCALAPPDATA:', process.env.LOCALAPPDATA);
console.log(`Starting server on port ${PORT}...`);

const result = spawnSync('go', ['run', '.'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
  cwd: __dirname
});

process.exit(result.status || 0);
