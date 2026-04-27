import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  if (!existsSync(filePath)) filePath = join(__dirname, 'index.html');

  try {
    const content = readFileSync(filePath);
    const ct = mime[extname(filePath)] || 'text/plain';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end('Server error');
  }
}).listen(PORT, () => {
  console.log(`\n✅  VibeCheck Me → http://localhost:${PORT}\n`);
});
