#!/usr/bin/env node
/*
 * Build a conservative inventory of literal dialogue strings.
 * This does not modify game code: dynamic/concatenated text is intentionally
 * left for a later pass so the catalog never contains sentence fragments.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const scanRoot = path.join(root, 'scripts');
const output = path.join(root, 'l10n', 'extraction-inventory.json');
const files = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else if (item.isFile() && item.name.endsWith('.js')) files.push(full);
  }
}

function decodeQuoted(raw) {
  if (raw[0] === '"') return JSON.parse(raw);
  // Decode the escapes used in ordinary single-quoted JavaScript strings.
  return raw.slice(1, -1).replace(/\\([\\'"nrtbfv])/g, (_, ch) => ({
    '\\': '\\', "'": "'", '"': '"', n: '\n', r: '\r', t: '\t',
    b: '\b', f: '\f', v: '\v'
  })[ch]);
}

walk(scanRoot);
const catalog = {};
let considered = 0;
let skippedDynamic = 0;

for (const file of files.sort()) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Dialogue property values only; intentionally excludes other UI/data fields.
    const match = line.match(/^\s*(?:text|"text"|'text')\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*(,|}|$)/);
    if (!match) {
      if (/^\s*(?:text|"text"|'text')\s*:/.test(line)) skippedDynamic++;
      continue;
    }
    considered++;
    const value = decodeQuoted(match[1]);
    if (!value.trim()) continue;
    catalog[value] = value;
  }
}

fs.mkdirSync(path.dirname(output), { recursive: true });
const sortedCatalog = Object.fromEntries(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(output, `${JSON.stringify(sortedCatalog, null, 2)}\n`, 'utf8');
console.log(`Scanned ${files.length} JavaScript files.`);
console.log(`Collected ${considered} literal dialogue occurrences (${Object.keys(catalog).length} unique strings).`);
console.log(`Skipped ${skippedDynamic} text properties that are dynamic or concatenated.`);
console.log(`Wrote ${path.relative(root, output).split(path.sep).join('/')}.`);
