#!/usr/bin/env node

/**
 * Write-guard hook. Blocks:
 * 1. Writes outside the workspace layout
 * 2. Content containing secret-shaped strings (API keys, passwords, tokens)
 *
 * Used as a PreToolUse hook on Edit and Write tools.
 * Reads the event from stdin, exits 2 to block with a message.
 */

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = process.cwd();

const ALLOWED_PREFIXES = [
  '.claude/',
  'company-profile/',
  'assessments/',
  'examples/',
  'kpis/',
  'README.md',
  'CLAUDE.md',
  'AGENTS.md',
  'LICENSE',
  'package.json',
  'package-lock.json',
  '.gitignore',
  '.editorconfig',
];

const SECRET_PATTERNS = [
  /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i,
  /(?:secret|password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{8,}/i,
  /(?:bearer|token)\s+[A-Za-z0-9_\-\.]{20,}/i,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /ghp_[A-Za-z0-9]{36}/,
  /sk-[A-Za-z0-9]{32,}/,
];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(input);
    const filePath = event.tool_input?.file_path;
    if (!filePath) process.exit(0);

    const rel = relative(root, resolve(root, filePath)).replace(/\\/g, '/');

    if (rel.startsWith('..') || resolve(root, filePath).indexOf(root) !== 0) {
      console.error(JSON.stringify({ decision: 'block', reason: `Write blocked: path outside workspace: ${rel}` }));
      process.exit(2);
    }

    const allowed = ALLOWED_PREFIXES.some(p =>
      p.endsWith('/') ? rel.startsWith(p) : rel === p
    );
    if (!allowed) {
      console.error(JSON.stringify({ decision: 'block', reason: `Write blocked: path not in workspace layout: ${rel}` }));
      process.exit(2);
    }

    const content = event.tool_input?.content || event.tool_input?.new_string || '';
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        console.error(JSON.stringify({ decision: 'block', reason: 'Write blocked: content looks like it contains a secret (API key, password, or token). Store secrets in environment variables or encrypted references.' }));
        process.exit(2);
      }
    }

    process.exit(0);
  } catch {
    process.exit(0);
  }
});
