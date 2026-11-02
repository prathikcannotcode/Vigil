#!/usr/bin/env node

/**
 * Run a Vigil workflow headlessly via Claude Code or OpenCode.
 *
 * Usage:
 *   node .claude/scripts/run-headless.mjs --workflow full-audit --company acme-tech [--dry-run]
 *   node .claude/scripts/run-headless.mjs --workflow onboarding --company acme-tech
 *   node .claude/scripts/run-headless.mjs --workflow context-refresh --company acme-tech
 *   node .claude/scripts/run-headless.mjs --workflow remediation --company acme-tech
 *
 * Options:
 *   --workflow <name>       Workflow to run (full-audit, onboarding, remediation, context-refresh)
 *   --company <id>          Company profile ID
 *   --framework <name>      Limit to framework: dpdp, gdpr, or both (default: both)
 *   --harness <name>        claude-code (default) or opencode
 *   --model <id>            Model override for opencode (e.g., provider/model)
 *   --dry-run               Print the prompt without executing
 *   --output <dir>          Output directory for session transcript (default: kpis/data/raw/sessions/)
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

const workflow = flag('workflow');
const company = flag('company');
const framework = flag('framework') || 'both';
const harness = flag('harness') || 'claude-code';
const model = flag('model');
const dryRun = hasFlag('dry-run');
const outputDir = flag('output') || 'kpis/data/raw/sessions/claude-code';

if (!workflow || !company) {
  console.error('Usage: node .claude/scripts/run-headless.mjs --workflow <name> --company <id>');
  console.error('');
  console.error('Workflows: full-audit, onboarding, remediation, context-refresh');
  process.exit(1);
}

const WORKFLOWS = {
  'full-audit': (co, fw) => {
    const scope = fw === 'both' ? 'DPDP and GDPR' : fw.toUpperCase();
    return `Run a full privacy audit on ${co} covering ${scope}. Use the full-audit workflow. Save findings to assessments/ and update the posture dashboard.`;
  },
  'onboarding': (co) =>
    `Onboard the company ${co}. Use the onboarding workflow. Ask me any questions needed to set up the company profile.`,
  'remediation': (co) =>
    `Generate a remediation plan for ${co} based on the latest audit findings. Use the remediation workflow. Prioritise by penalty exposure.`,
  'context-refresh': (co, fw) => {
    const scope = fw === 'both' ? 'DPDP and GDPR' : fw.toUpperCase();
    return `Refresh the compliance context for ${co} covering ${scope}. Use the context-refresh workflow. Check for regulatory updates, re-scan for PII, and update the posture dashboard.`;
  },
};

if (!WORKFLOWS[workflow]) {
  console.error(`Unknown workflow: ${workflow}`);
  console.error(`Available: ${Object.keys(WORKFLOWS).join(', ')}`);
  process.exit(1);
}

const prompt = WORKFLOWS[workflow](company, framework);

if (dryRun) {
  console.log('Prompt that would be sent:');
  console.log('---');
  console.log(prompt);
  console.log('---');
  console.log(`Harness: ${harness}`);
  if (model) console.log(`Model: ${model}`);
  process.exit(0);
}

mkdirSync(outputDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const sessionFile = join(outputDir, `${workflow}_${company}_${timestamp}.json`);

let cmd;
if (harness === 'opencode') {
  cmd = `opencode --prompt "${prompt.replace(/"/g, '\\"')}"`;
  if (model) cmd += ` --model ${model}`;
} else {
  cmd = `claude --print --output-format json "${prompt.replace(/"/g, '\\"')}"`;
}

console.log(`Running ${workflow} for ${company} (${framework})...`);
console.log(`Harness: ${harness}`);
console.log(`Output: ${sessionFile}`);
console.log('');

try {
  const output = execSync(cmd, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'inherit'],
    timeout: 600_000,
  });

  const session = {
    workflow,
    company,
    framework,
    harness,
    model: model || null,
    started_at: new Date(Date.now() - 600_000).toISOString(),
    completed_at: new Date().toISOString(),
    output,
  };

  writeFileSync(sessionFile, JSON.stringify(session, null, 2));
  console.log(`Session saved to ${sessionFile}`);
  console.log('Run npm run kpis to compute metrics from this session.');
} catch (e) {
  console.error(`Workflow failed: ${e.message}`);
  process.exit(1);
}
