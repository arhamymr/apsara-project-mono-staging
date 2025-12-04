const { spawnSync } = require('child_process');
const path = require('path');
const os = require('os');

// Set Go environment variables if not already set
if (!process.env.GOCACHE) {
  process.env.GOCACHE = path.join(os.homedir(), 'go-cache');
}
if (!process.env.LOCALAPPDATA) {
  process.env.LOCALAPPDATA = path.join(os.homedir(), 'AppData', 'Local');
}

console.log('GOCACHE:', process.env.GOCACHE);
console.log('LOCALAPPDATA:', process.env.LOCALAPPDATA);

const result = spawnSync('go', ['run', 'server.go'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
  cwd: __dirname
});

process.exit(result.status || 0);
