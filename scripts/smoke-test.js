import assert from 'node:assert/strict';
import fs from 'node:fs';

assert.equal(fs.existsSync(new URL('../server.js', import.meta.url)), true);
assert.equal(fs.existsSync(new URL('../package.json', import.meta.url)), true);

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(pkg.type, 'module');
assert.equal(typeof pkg.scripts.start, 'string');
assert.equal(pkg.scripts.start, 'node server.js');

console.log('MCPSpot smoke test passed.');
