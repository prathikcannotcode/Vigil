import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLayout, matchRule, checkFile, validate, loadFindings } from '../lib.mjs';

const scripts = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(scripts, '..', '..');

function run(script, { cwd = repo, input, args = [] } = {}) {
  return spawnSync(process.execPath, [join(scripts, script), ...args], {
    cwd, input: input && JSON.stringify(input), encoding: 'utf8',
  });
}

// A throwaway workspace with the real layout and schemas and one breach log.
function workspace() {
  const dir = mkdtempSync(join(tmpdir(), 'vigil-'));
  mkdirSync(join(dir, '.claude/schemas'), { recursive: true });
  for (const f of ['layout.json', 'finding.schema.json', 'report.schema.json', 'breach-entry.schema.json']) {
    copyFileSync(join(repo, '.claude/schemas', f), join(dir, '.claude/schemas', f));
  }
  mkdirSync(join(dir, 'company-profile/acme'), { recursive: true });
  writeFileSync(join(dir, 'company-profile/acme/breach-log.jsonl'), '{"a":1}\n{"b":2}\n');
  return dir;
}

test('sample workspace passes schema validation', () => {
  const r = run('validate.mjs', { args: ['--strict'] });
  assert.equal(r.status, 0, r.stderr);
});

test('layout matches data paths and rejects strays', () => {
  const layout = loadLayout(repo);
  assert.equal(matchRule(layout, 'company-profile/acme/details.json').schema, 'company-details.schema.json');
  assert.equal(matchRule(layout, 'company-profile/acme/breach-log.jsonl').append_only, true);
  assert.equal(matchRule(layout, 'company-profile/acme/notes.txt'), undefined);
  assert.equal(matchRule(layout, 'src/app.js'), undefined);
});

test('validator catches schema violations', () => {
  const finding = JSON.parse(readFileSync(join(repo, '.claude/schemas/finding.schema.json'), 'utf8'));
  assert.deepEqual(validate(finding, { id: 'F-0001', severity: 'high', framework: 'DPDP', clause: 's.8(5)', issue: 'x', recommendation: 'y' }, '$', repo), []);
  const errors = validate(finding, { id: 'F-1', severity: 'severe', framework: 'DPDP', issue: 'x', recommendation: 'y', extra: 1 }, '$', repo);
  assert.equal(errors.length, 4, errors.join('\n')); // bad id, bad severity, missing clause, unexpected property
  assert.throws(() => validate({ oneOf: [] }, 1), /Unsupported schema keyword/);
});

test('report $ref validates nested findings', () => {
  const dir = workspace();
  mkdirSync(join(dir, 'assessments/a1'), { recursive: true });
  writeFileSync(join(dir, 'assessments/a1/report.json'), JSON.stringify({
    assessment_id: 'a1', company_id: 'acme', scope: ['DPDP'], started_at: '2026-10-19T10:00:00Z',
    findings: [{ id: 'F-0001', severity: 'high', framework: 'DPDP', issue: 'x', recommendation: 'y' }],
  }));
  assert.match(checkFile('assessments/a1/report.json', dir).join(), /findings\[0\]: missing required "clause"/);
  rmSync(dir, { recursive: true });
});

test('write-guard enforces layout, append-only logs and secrets', () => {
  const dir = workspace();
  const guard = input => run('write-guard.mjs', { cwd: dir, input }).status;
  const log = 'company-profile/acme/breach-log.jsonl';

  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'README.md', content: 'hi' } }), 0);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'src/app.js', content: 'hi' } }), 2);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: '../elsewhere/x.md', content: 'hi' } }), 2);

  assert.equal(guard({ tool_name: 'Edit', tool_input: { file_path: log, old_string: '{"b":2}\n', new_string: '{"b":2}\n{"c":3}\n' } }), 0);
  assert.equal(guard({ tool_name: 'Edit', tool_input: { file_path: log, old_string: '{"a":1}', new_string: '{"a":9}' } }), 2);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: log, content: '{"a":1}\n{"b":2}\n{"c":3}\n' } }), 0);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: log, content: '{"b":2}\n' } }), 2);
  assert.equal(guard({ tool_name: 'MultiEdit', tool_input: { file_path: log, edits: [{ old_string: '{"b":2}', new_string: '' }] } }), 2);

  const fakeKey = 'AKIA' + 'Q'.repeat(16);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'README.md', content: `key ${fakeKey}` } }), 2);
  rmSync(dir, { recursive: true });
});

test('validate-on-write exits 2 so the agent sees schema errors', () => {
  const dir = workspace();
  writeFileSync(join(dir, 'company-profile/acme/breach-log.jsonl'), '{"breach_id":"BR-0001"}\n');
  const r = run('validate-on-write.mjs', { cwd: dir, input: { tool_input: { file_path: 'company-profile/acme/breach-log.jsonl' } } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /missing required "event"/);
  rmSync(dir, { recursive: true });
});

test('exports filter findings by company', () => {
  assert.equal(loadFindings('sample-co', repo).length, 9);
  assert.equal(loadFindings('nobody', repo).length, 0);
});

test('run-headless rejects unsafe arguments', () => {
  assert.equal(run('run-headless.mjs', { args: ['--workflow', 'audit', '--company', 'acme"; rm -rf ~', '--dry-run'] }).status, 1);
  const ok = run('run-headless.mjs', { args: ['--workflow', 'audit', '--company', 'acme-tech', '--dry-run'] });
  assert.equal(ok.status, 0);
  assert.match(ok.stdout, /Use the \/audit skill/);
});
