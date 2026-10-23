import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function startApi(config, root = path.dirname(fileURLToPath(import.meta.url))) {
  const directory = path.resolve(root, 'data');
  const dataPath = path.resolve(root, config.dataFile);
  if (!dataPath.startsWith(directory + path.sep))
    throw new Error('Data file must stay inside this workload’s data directory.');
  await fs.mkdir(directory, { recursive: true });
  try {
    await fs.writeFile(dataPath, JSON.stringify({ text: 'A persisted dummy sample' }), { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  let counter = 0;
  const server = http.createServer((request, response) => {
    const json = (status, value) => {
      response.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      response.end(JSON.stringify(value));
    };
    async function handle() {
      console.log(`[api ${process.pid}] ${request.method} ${request.url}`);
      if (request.method === 'GET' && request.url === '/api/status')
        return json(200, {
          pid: process.pid,
          port: server.address().port,
          uptimeSeconds: Math.floor(process.uptime()),
          memoryBytes: process.memoryUsage().rss,
          counter,
        });
      if (request.method === 'POST' && request.url === '/api/counter')
        return json(200, { counter: ++counter });
      if (request.url === '/api/sample' && request.method === 'GET')
        return json(200, JSON.parse(await fs.readFile(dataPath, 'utf8')));
      if (request.url === '/api/sample' && request.method === 'PUT') {
        let body = '';
        for await (const chunk of request) {
          body += chunk;
          if (body.length > 1024) return json(413, { error: 'Use a dummy sample under 1 KB.' });
        }
        let input;
        try {
          input = JSON.parse(body);
        } catch {
          return json(400, { error: 'Expected JSON.' });
        }
        if (typeof input.text !== 'string' || input.text.length > 200)
          return json(400, { error: 'Use a short dummy text.' });
        await fs.writeFile(dataPath, JSON.stringify({ text: input.text }));
        return json(200, { saved: true });
      }
      return json(404, { error: 'No such API route' });
    }
    handle().catch((error) => {
      console.error(`[api ${process.pid}] ${error.message}`);
      if (!response.headersSent) json(500, { error: 'Data operation failed; inspect the API log.' });
      else response.end();
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(config.apiPort, '127.0.0.1', resolve);
  });
  console.log(
    `[api ${process.pid}] Listening http://127.0.0.1:${server.address().port}; file ${config.dataFile}`,
  );
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));
  const server = await startApi(config);
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
