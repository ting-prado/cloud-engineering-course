import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fork } from 'node:child_process';
import { once } from 'node:events';
const files = [
  'api.mjs',
  'web.mjs',
  'run.mjs',
  'guided.json',
  'variation.json',
  'incident.json',
  'index.html',
  'browser.js',
  'style.css',
  'README.md',
  'REACT-LICENSE.txt',
  'REACT-DOM-LICENSE.txt',
];
export async function extractWorkload() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'academy-week01-browser-'));
  const zip = await fs.readFile('public/labs/week-01-workload.zip');
  let offset = 0;
  while (zip.readUInt32LE(offset) === 0x04034b50) {
    const size = zip.readUInt32LE(offset + 18),
      length = zip.readUInt16LE(offset + 26),
      extra = zip.readUInt16LE(offset + 28),
      name = zip.subarray(offset + 30, offset + 30 + length).toString();
    if (!files.includes(name)) throw new Error('Unexpected package path');
    const start = offset + 30 + length + extra;
    await fs.writeFile(path.join(root, name), zip.subarray(start, start + size));
    offset = start + size;
  }
  return root;
}
export async function freePort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  server.close();
  await once(server, 'close');
  return port;
}
export async function startWorkload(root, config, mode = 'guided') {
  await fs.writeFile(path.join(root, mode + '.json'), JSON.stringify(config));
  const child = fork(path.join(root, 'run.mjs'), [mode], { cwd: root, silent: true, execArgv: [] });
  let logs = '';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Workload startup timed out: ' + logs)), 5000);
    const observe = (chunk) => {
      logs += chunk;
      if (/\[api \d+\] Listening/.test(logs) && /\[web \d+\] Listening/.test(logs)) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on('data', observe);
    child.stderr.on('data', observe);
    child.once('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error('Workload exited ' + code + ': ' + logs));
    });
  });
  return {
    child,
    logs,
    url: `http://127.0.0.1:${config.webPort}`,
    apiUrl: `http://127.0.0.1:${config.apiPort}`,
  };
}
export async function stopWorkload(instance) {
  if (!instance || instance.child.exitCode !== null) return;
  const ended = once(instance.child, 'exit');
  instance.child.send('shutdown');
  await ended;
}
export async function cleanupWorkload(root) {
  if (!path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep + 'academy-week01-browser-'))
    throw new Error('Unexpected cleanup target');
  for (const name of files) await fs.unlink(path.join(root, name));
  try {
    for (const name of await fs.readdir(path.join(root, 'data'))) {
      if (path.basename(name) !== name) throw new Error('Unexpected data path');
      await fs.unlink(path.join(root, 'data', name));
    }
    await fs.rmdir(path.join(root, 'data'));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  await fs.rmdir(root);
}
