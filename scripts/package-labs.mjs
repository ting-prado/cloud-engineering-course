import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';
const root = path.resolve('labs/week-01');
await build({
  entryPoints: [path.join(root, 'client.jsx')],
  bundle: true,
  minify: true,
  platform: 'browser',
  format: 'iife',
  outfile: path.join(root, 'browser.js'),
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof',
});
await fs.copyFile('node_modules/react/LICENSE', path.join(root, 'REACT-LICENSE.txt'));
await fs.copyFile('node_modules/react-dom/LICENSE', path.join(root, 'REACT-DOM-LICENSE.txt'));
// Standard ZIP store entries: the student can extract with the OS, no runtime dependency.
const names = [
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
const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
};
const local = [],
  central = [];
let offset = 0;
for (const file of names) {
  const name = Buffer.from(file),
    body = await fs.readFile(path.join(root, file)),
    crc = crc32(body);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(33, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(body.length, 18);
  header.writeUInt32LE(body.length, 22);
  header.writeUInt16LE(name.length, 26);
  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50);
  entry.writeUInt16LE(20, 4);
  entry.writeUInt16LE(20, 6);
  entry.writeUInt16LE(0x0800, 8);
  entry.writeUInt16LE(33, 14);
  entry.writeUInt32LE(crc, 16);
  entry.writeUInt32LE(body.length, 20);
  entry.writeUInt32LE(body.length, 24);
  entry.writeUInt16LE(name.length, 28);
  entry.writeUInt32LE(offset, 42);
  local.push(header, name, body);
  central.push(entry, name);
  offset += header.length + name.length + body.length;
}
const directory = Buffer.concat(central),
  end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50);
end.writeUInt16LE(names.length, 8);
end.writeUInt16LE(names.length, 10);
end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
await fs.mkdir('public/labs', { recursive: true });
await fs.writeFile('public/labs/week-01-workload.zip', Buffer.concat([...local, directory, end]));
console.log('Packaged the standalone Week 1 React/Node workload.');
