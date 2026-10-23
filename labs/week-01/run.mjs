import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2];
if (!['guided', 'variation', 'incident'].includes(mode)) {
  console.error('Usage: node run.mjs guided|variation|incident');
  process.exit(1);
}
const configPath = path.join(root, `${mode}.json`);
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
if (
  !['webPort', 'apiPort', 'upstreamPort'].every(
    (k) => Number.isInteger(config[k]) && config[k] >= 1024 && config[k] <= 65535,
  ) ||
  config.webPort === config.apiPort
) {
  console.error('Choose separate valid web/API ports from 1024 to 65535.');
  process.exit(1);
}
console.log(`Starting ${mode}. Both listeners bind only to 127.0.0.1. Press Ctrl+C to stop both processes.`);
const children = ['api.mjs', 'web.mjs'].map((file) =>
  spawn(process.execPath, [path.join(root, file), configPath], { cwd: root, stdio: 'inherit' }),
);
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM');
  if (process.connected) process.disconnect();
  process.exitCode = code;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
process.on('message', (message) => {
  if (message === 'shutdown') stop();
});
for (const child of children) {
  child.on('error', (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping) stop(code ?? 1);
  });
}
