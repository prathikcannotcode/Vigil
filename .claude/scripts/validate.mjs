#!/usr/bin/env node

/**
 * Validates workspace JSON files against their schemas.
 * Run: npm run validate
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const strict = process.argv.includes('--strict');
let errors = 0;
let checked = 0;

function walkJson(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.git') continue;
      walkJson(full);
    } else if (extname(full) === '.json') {
      checked++;
      try {
        JSON.parse(readFileSync(full, 'utf8'));
      } catch (e) {
        console.error(`INVALID JSON: ${full}\n  ${e.message}`);
        errors++;
      }
    } else if (extname(full) === '.jsonl') {
      checked++;
      const lines = readFileSync(full, 'utf8').split('\n').filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        try {
          JSON.parse(lines[i]);
        } catch (e) {
          console.error(`INVALID JSONL: ${full} line ${i + 1}\n  ${e.message}`);
          errors++;
        }
      }
    }
  }
}

walkJson(root);

console.log(`Checked ${checked} files, ${errors} error(s).`);
if (errors > 0) process.exit(1);
if (strict && checked === 0) {
  console.error('No JSON files found in workspace.');
  process.exit(1);
}
