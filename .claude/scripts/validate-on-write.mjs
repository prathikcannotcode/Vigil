#!/usr/bin/env node

/**
 * Post-write validation hook. Validates JSON/JSONL files after every write.
 * Used as a PostToolUse hook on Edit and Write tools.
 * Exits 1 on invalid JSON to surface the error.
 */

import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    const filePath = event.tool_input?.file_path;
    if (!filePath) process.exit(0);

    const ext = extname(filePath);
    if (ext === '.json') {
      try {
        JSON.parse(readFileSync(filePath, 'utf8'));
      } catch (e) {
        console.error(`Validation failed: ${filePath} is not valid JSON: ${e.message}`);
        process.exit(1);
      }
    } else if (ext === '.jsonl') {
      const lines = readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        try {
          JSON.parse(lines[i]);
        } catch (e) {
          console.error(`Validation failed: ${filePath} line ${i + 1} is not valid JSON: ${e.message}`);
          process.exit(1);
        }
      }
    }
    process.exit(0);
  } catch {
    process.exit(0);
  }
});
