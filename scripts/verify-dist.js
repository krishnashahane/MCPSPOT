import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = ['package.json', 'server.js', 'index.js'];

for (const relative of required) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) {
    console.error(`Missing required runtime file: ${relative}`);
    process.exit(1);
  }
}

console.log('MCPSpot runtime verification passed.');
