import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
// JS modules are also the actual standalone lab runtime, not mocked replicas.
import { startApi } from '../labs/week-01/api.mjs';
import { startWeb } from '../labs/week-01/web.mjs';
test('real API/proxy: request identity, 404, volatile restart, file persistence and broken target', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'academy-week01-test-'));
  const config = { apiPort: 0, webPort: 0, upstreamPort: 0, dataFile: 'data/sample.json' };
  let api = await startApi(config, root);
  const apiPort = api.address().port;
  config.upstreamPort = apiPort;
  const web = await startWeb(config, path.resolve('labs/week-01'));
  const webPort = web.address().port;
  const url = `http://127.0.0.1:${webPort}`;
  try {
    assert.equal((await fetch(url)).status, 200);
    assert.equal((await fetch(url + '/missing.html')).status, 404);
    const direct = await (await fetch(`http://127.0.0.1:${apiPort}/api/status`)).json();
    const proxied = await (await fetch(url + '/api/status')).json();
    assert.equal(direct.pid, proxied.pid);
    assert.equal(proxied.port, apiPort);
    await fetch(url + '/api/counter', { method: 'POST' });
    await fetch(url + '/api/counter', { method: 'POST' });
    assert.equal((await (await fetch(url + '/api/status')).json()).counter, 2);
    await fetch(url + '/api/sample', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: 'Persisted test phrase' }),
    });
    api.close();
    await once(api, 'close');
    api = await startApi({ ...config, apiPort }, root);
    assert.equal((await (await fetch(url + '/api/status')).json()).counter, 0);
    assert.equal((await (await fetch(url + '/api/sample')).json()).text, 'Persisted test phrase');
    config.upstreamPort = 0;
    assert.equal((await fetch(url + '/api/status')).status, 502);
    assert.equal((await fetch(`http://127.0.0.1:${apiPort}/api/status`)).status, 200);
  } finally {
    web.close();
    api.close();
    await Promise.all([once(web, 'close'), once(api, 'close')]);
    // Remove only the exact files/directories created under this verified temporary root.
    assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep));
    await fs.unlink(path.join(root, 'data/sample.json'));
    await fs.rmdir(path.join(root, 'data'));
    await fs.rmdir(root);
  }
});
test('downloadable ZIP is self-contained and contains real prebuilt React assets', async () => {
  const zip = await fs.readFile('public/labs/week-01-workload.zip');
  const names: string[] = [];
  let offset = 0;
  while (zip.readUInt32LE(offset) === 0x04034b50) {
    assert.equal(zip.readUInt16LE(offset + 8), 0);
    const length = zip.readUInt32LE(offset + 18),
      nameLength = zip.readUInt16LE(offset + 26),
      extra = zip.readUInt16LE(offset + 28);
    const name = zip.subarray(offset + 30, offset + 30 + nameLength).toString();
    assert.equal(path.basename(name), name);
    names.push(name);
    if (name === 'browser.js') assert.ok(length > 20000);
    offset += 30 + nameLength + extra + length;
  }
  for (const name of [
    'index.html',
    'browser.js',
    'api.mjs',
    'web.mjs',
    'run.mjs',
    'guided.json',
    'variation.json',
    'incident.json',
    'REACT-LICENSE.txt',
    'REACT-DOM-LICENSE.txt',
  ])
    assert.ok(names.includes(name), name);
  assert.equal(zip.readUInt32LE(offset), 0x02014b50);
  assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50);
});
