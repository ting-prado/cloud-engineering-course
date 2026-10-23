import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export async function startWeb(config, root = path.dirname(fileURLToPath(import.meta.url))) {
  const files = {
    '/': ['index.html', 'text/html'],
    '/browser.js': ['browser.js', 'text/javascript'],
    '/style.css': ['style.css', 'text/css'],
  };
  const server = http.createServer(async (request, response) => {
    console.log(`[web ${process.pid}] ${request.method} ${request.url}`);
    if (request.url.startsWith('/api/')) {
      const proxy = http.request(
        {
          host: '127.0.0.1',
          port: config.upstreamPort,
          path: request.url,
          method: request.method,
          headers: { 'content-type': request.headers['content-type'] || 'application/json' },
          timeout: 2000,
        },
        (upstream) => {
          response.writeHead(upstream.statusCode, {
            'content-type': upstream.headers['content-type'] || 'application/json',
            'cache-control': 'no-store',
          });
          upstream.pipe(response);
        },
      );
      proxy.on('timeout', () => proxy.destroy(new Error('Upstream timeout')));
      proxy.on('error', (error) => {
        console.error(
          `[web ${process.pid}] upstream 127.0.0.1:${config.upstreamPort}: ${error.code || error.message}`,
        );
        if (!response.headersSent) {
          response.writeHead(502, { 'content-type': 'application/json', 'cache-control': 'no-store' });
          response.end(
            JSON.stringify({
              error: 'Upstream request failed. Inspect the listener and web-process evidence.',
            }),
          );
        } else response.end();
      });
      request.pipe(proxy);
      return;
    }
    const file = files[request.url];
    if (!file) {
      response.writeHead(404, { 'content-type': 'text/plain' });
      response.end('No such static file');
      return;
    }
    try {
      const body = await fs.readFile(path.join(root, file[0]));
      response.writeHead(200, {
        'content-type': file[1],
        'cache-control': 'no-store',
        'content-security-policy':
          "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'",
      });
      response.end(body);
    } catch {
      response.writeHead(500);
      response.end('Workload asset missing. Use the complete downloaded package.');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(config.webPort, '127.0.0.1', resolve);
  });
  console.log(`[web ${process.pid}] Listening http://127.0.0.1:${server.address().port}`);
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));
  const server = await startWeb(config);
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}
