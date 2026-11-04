#!/usr/bin/env node

/**
 * Run a Vigil workflow headlessly via Claude Code or OpenCode.
 *
 * Usage:
 *   node .claude/scripts/run-headless.mjs --workflow audit --company acme-tech [--dry-run]
 *   node .claude/scripts/run-headless.mjs --workflow onboard --company acme-tech
 *   node .claude/scripts/run-headless.mjs --workflow refresh --company acme-tech
 *   node .claude/scripts/run-headless.mjs --workflow remediate --company acme-tech
 *
 * Options:
 *   --workflow <name>       audit, onboard, remediate or refresh
 *   --company <id>          Company profile ID (lowercase letters, digits, hyphens)
 *   --target <dir>          Codebase to read (claude-code only). Without it, only this workspace is in reach.
 *   --framework <name>      dpdp, gdpr, or both (default: both)
 *   --harness <name>        claude-code (default) or opencode
 *   --model <id>            Model override for opencode (e.g., provider/model)
 *   --dry-run               Print the prompt without executing
 *   --output <dir>          Output directory for session transcript (default: kpis/data/raw/sessions/<harness>)
 */

import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return undefined;
  return args[i + 1];
}
function hasFlag(name) { return args.includes(`--${name}`); }

function die(message) {
  console.error(message);
  process.exit(1);
}

const workflow = flag('workflow');
const company = flag('company');
const target = flag('target');
const framework = flag('framework') || 'both';
const harness = flag('harness') || 'claude-code';
const model = flag('model');
const dryRun = hasFlag('dry-run');
const outputDir = flag('output') || `kpis/data/raw/sessions/${harness}`;

// Every value below ends up in a shell command, so each is checked against a strict shape.
if (!workflow || !company) {
  die('Usage: node .claude/scripts/run-headless.mjs --workflow <name> --company <id>\n\nWorkflows: audit, onboard, remediate, refresh');
}
if (!/^[a-z0-9-]+$/.test(company)) die(`Invalid --company "${company}": use lowercase letters, digits and hyphens.`);
if (!['dpdp', 'gdpr', 'both'].includes(framework)) die(`Invalid --framework "${framework}": use dpdp, gdpr or both.`);
if (!['claude-code', 'opencode'].includes(harness)) die(`Invalid --harness "${harness}": use claude-code or opencode.`);
if (model && !/^[\w.:/-]+$/.test(model)) die(`Invalid --model "${model}".`);
if (target) {
  if (!/^[\w.:/\\ -]+$/.test(target)) die(`Invalid --target "${target}": use letters, digits, spaces, dots, hyphens and path separators.`);
  if (!existsSync(target)) die(`--target not found: ${target}`);
  if (harness !== 'claude-code') die('--target only works with --harness claude-code.');
}

const scopeOf = fw => (fw === 'both' ? 'DPDP and GDPR' : fw.toUpperCase());
const NO_QUESTIONS = 'This is a headless run: do not ask questions. Where information is missing, record it as not assessed and list the open questions in your final message.';

const WORKFLOWS = {
  audit: (co, fw) =>
    `Run a full privacy audit on ${co} covering ${scopeOf(fw)}. Use the /audit skill. Save findings to assessments/ and update the posture dashboard. ${NO_QUESTIONS}`,
  onboard: co =>
    `Onboard the company ${co}. Use the /onboard skill. ${NO_QUESTIONS}`,
  remediate: co =>
    `Generate a remediation plan for ${co} based on the latest audit findings. Use the /remediate skill. Prioritise by penalty exposure. ${NO_QUESTIONS}`,
  refresh: (co, fw) =>
    `Refresh the compliance context for ${co} covering ${scopeOf(fw)}. Use the /refresh skill. Check for regulatory updates, re-scan for PII, and update the posture dashboard. ${NO_QUESTIONS}`,
};

if (!WORKFLOWS[workflow]) die(`Unknown workflow: ${workflow}\nAvailable: ${Object.keys(WORKFLOWS).join(', ')}`);

const prompt = WORKFLOWS[workflow](company, framework) + (target ? ` The codebase to read is at ${target}; record file paths relative to its root.` : '');

if (dryRun) {
  console.log('Prompt that would be sent:');
  console.log('---');
  console.log(prompt);
  console.log('---');
  console.log(`Harness: ${harness}`);
  if (target) console.log(`Target: ${target}`);
  if (model) console.log(`Model: ${model}`);
  process.exit(0);
}

mkdirSync(outputDir, { recursive: true });

const startedAt = new Date();
const sessionFile = join(outputDir, `${workflow}_${company}_${startedAt.toISOString().replace(/[:.]/g, '-')}.json`);

// acceptEdits lets the run write its reports; the write-guard hook still limits where.
const cmd = harness === 'opencode'
  ? `opencode run "${prompt}"${model ? ` --model ${model}` : ''}`
  : `claude --print --output-format json --permission-mode acceptEdits${target ? ` --add-dir "${target}"` : ''} "${prompt}"`;

const saveSession = (output, error) => writeFileSync(sessionFile, JSON.stringify({
  workflow,
  company,
  framework,
  harness,
  model: model || null,
  target: target || null,
  started_at: startedAt.toISOString(),
  completed_at: new Date().toISOString(),
  ...(error ? { error } : {}),
  output,
}, null, 2));

console.log(`Running ${workflow} for ${company} (${framework})...`);
console.log(`Harness: ${harness}`);
console.log(`Output: ${sessionFile}`);
console.log('');

try {
  const output = execSync(cmd, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'inherit'],
    timeout: 7_200_000,
    maxBuffer: 64 * 1024 * 1024,
  });

  saveSession(output);
  console.log(`Session saved to ${sessionFile}`);
  console.log('Run npm run validate, then npm run kpis to compute metrics from this session.');
} catch (e) {
  saveSession(e.stdout ?? '', e.message);
  die(`Workflow failed: ${e.message}\nPartial transcript saved to ${sessionFile}`);
}
