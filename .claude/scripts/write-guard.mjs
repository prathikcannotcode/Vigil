#!/usr/bin/env node

/**
 * Write-guard hook. Blocks:
 * 1. Writes outside the workspace layout (.claude/schemas/layout.json)
 * 2. Rewrites of append-only logs (breach-log.jsonl, rights-log.jsonl)
 * 3. Content containing secret-shaped strings (API keys, passwords, tokens)
 * 4. Identifiers in company or assessment data (Aadhaar, PAN, +91 mobile numbers)
 *
 * Used as a PreToolUse hook on Write, Edit, MultiEdit and NotebookEdit.
 * Reads the event from stdin, exits 2 to block with a message. An event it
 * cannot read blocks too. Shell commands never reach it: see SECURITY.md.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { loadLayout, matchRule, workspaceRoot, realPath } from './lib.mjs';

const SECRET_PATTERNS = [
  /(?:api[_-]?key|apikey)["']?\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i,
  // A quoted or assigned value, or a bare `key: value` with a digit or symbol, so "password: hardcoded" in prose passes.
  /(?:secret|password|passwd|pwd)["']?\s*(?:[:=]\s*["'][^\s"']{8,}|=\s*[^\s"']{8,}|:\s*(?=[^\s"']*[\d!@#$%^&*])[^\s"']{8,})/i,
  /(?:bearer|token)\s+[A-Za-z0-9_\-\.]{20,}/i,
  /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{36}/,
  /github_pat_[A-Za-z0-9_]{22,}/,
  /\bsk-[A-Za-z0-9_\-]{32,}/,
];

const VERHOEFF_D = ['0123456789', '1234067895', '2340178956', '3401289567', '4012395678', '5987604321', '6598710432', '7659821043', '8760932154', '9876543210'];
const VERHOEFF_P = ['0123456789', '1576283094', '5803796142', '8916043527', '9453126870', '4286573901', '2793806415', '7046913258'];

// Aadhaar numbers carry a Verhoeff check digit, which keeps large penalty amounts from matching.
function isAadhaar(digits) {
  let c = 0;
  [...digits].reverse().forEach((n, i) => { c = Number(VERHOEFF_D[c][Number(VERHOEFF_P[i % 8][Number(n)])]); });
  return c === 0;
}

function hasPersonalData(text) {
  const aadhaar = [...text.matchAll(/\b[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}\b/g)].some(m => isAadhaar(m[0].replace(/\D/g, '')));
  return aadhaar || /\b[A-Z]{3}[ABCFGHJLPT][A-Z]\d{4}[A-Z]\b/.test(text) || /\+91[ -]?[6-9]\d{9}\b/.test(text);
}

function block(reason) {
  console.error(`Write blocked: ${reason}`);
  process.exit(2);
}

function editsOf(input) {
  if (Array.isArray(input.edits)) return input.edits;
  if (input.old_string !== undefined) return [input];
  return [];
}

const FILE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit']);

// The file content after the tool runs, so append-only checks see the real result.
// Anything that is not an edit counts as a full replacement, so an unfamiliar tool can't slip past the append-only check.
function contentAfter(before, toolName, input) {
  if (toolName !== 'Edit' && toolName !== 'MultiEdit') return input.content ?? input.new_source ?? '';
  let text = before;
  for (const { old_string: from, new_string: to, replace_all } of editsOf(input)) {
    if (replace_all) text = text.split(from).join(to);
    else {
      const i = text.indexOf(from);
      if (i !== -1) text = text.slice(0, i) + to + text.slice(i + from.length);
    }
  }
  return text;
}

const lf = text => text.replace(/\r\n/g, '\n');

function guard(event) {
  const input = event?.tool_input;
  if (typeof event?.tool_name !== 'string' || !input || typeof input !== 'object') block('malformed hook event: no tool_name or tool_input');
  const filePath = input.file_path ?? input.notebook_path;
  // A matcher like "Write" may also catch a tool that writes no file, such as TodoWrite.
  if (filePath === undefined && !FILE_TOOLS.has(event.tool_name)) return;
  if (typeof filePath !== 'string' || !filePath) block(`${event.tool_name} event names no file path`);

  // The event's cwd follows Claude; the others cover a cwd this platform can't read.
  const start = [event.cwd, process.cwd(), process.env.CLAUDE_PROJECT_DIR].find(dir => dir && workspaceRoot(dir));
  if (!start) block('no workspace layout found at or above the working directory');
  const root = realPath(workspaceRoot(start));

  const abs = realPath(resolve(start, filePath));
  const rel = relative(root, abs).replace(/\\/g, '/');
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel)) block(`path outside workspace: ${filePath}`);

  const rule = matchRule(loadLayout(root), rel);
  if (!rule) block(`path not in workspace layout: ${rel}. Agents may not write here; a maintainer can change the layout by hand.`);

  if (rule.append_only && existsSync(abs)) {
    const before = readFileSync(abs, 'utf8');
    if (!lf(contentAfter(before, event.tool_name, input)).startsWith(lf(before))) {
      block(`${rel} is append-only. Add new entries at the end; never modify or delete existing ones.`);
    }
  }

  const content = [input.content, input.new_source, ...editsOf(input).map(e => e.new_string)].filter(Boolean).join('\n');
  if (SECRET_PATTERNS.some(p => p.test(content))) {
    block('content looks like it contains a secret (API key, password, or token). Store secrets in environment variables or encrypted references.');
  }
  // shortcut: three Indian formats with low false-positive rates. Emails and dates look like legitimate profile
  // data and pass; card and ABHA numbers have their own shape but are not covered yet. See SECURITY.md.
  if (/^(company-profile|assessments)\//.test(rel) && hasPersonalData(content)) {
    block('content looks like it contains personal data (Aadhaar, PAN or a +91 mobile number). Reference it by file and line instead.');
  }
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  // Only exit 2 blocks, so unreadable input or an unexpected error must not let the write through.
  try { guard(JSON.parse(raw)); }
  catch (e) { block(`guard error: ${e.message}`); }
  process.exit(0);
});
