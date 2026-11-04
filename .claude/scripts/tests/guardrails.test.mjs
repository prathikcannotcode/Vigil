import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLayout, matchRule, checkFile, validate, loadFindings, workspaceRoot, frontmatterErrors } from '../lib.mjs';

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

// A copy of the repo's data and package.json, for scripts that read the working directory.
function dataCopy() {
  const dir = mkdtempSync(join(tmpdir(), 'vigil-'));
  copyFileSync(join(repo, 'package.json'), join(dir, 'package.json'));
  mkdirSync(join(dir, 'kpis'));
  cpSync(join(repo, 'assessments'), join(dir, 'assessments'), { recursive: true });
  cpSync(join(repo, 'company-profile'), join(dir, 'company-profile'), { recursive: true });
  return dir;
}

function secondAudit(dir) {
  const report = JSON.parse(readFileSync(join(dir, 'assessments/2026-10-19-sample-co-baseline/report.json'), 'utf8'));
  mkdirSync(join(dir, 'assessments/2026-11-19-sample-co-refresh'));
  writeFileSync(join(dir, 'assessments/2026-11-19-sample-co-refresh/report.json'), JSON.stringify({
    ...report, assessment_id: '2026-11-19-sample-co-refresh', started_at: '2026-11-19T10:00:00+05:30', findings: report.findings.slice(0, 2),
  }));
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

test('agents cannot write the guards that bind them', () => {
  const layout = loadLayout(repo);
  for (const p of ['.claude/scripts/write-guard.mjs', '.claude/schemas/layout.json', '.claude/schemas/finding.schema.json', '.claude/settings.json', '.claude/settings.local.json']) {
    assert.equal(matchRule(layout, p), undefined, p);
  }
  assert.ok(matchRule(layout, '.claude/skills/audit/SKILL.md'));
});

test('validator catches schema violations', () => {
  const finding = JSON.parse(readFileSync(join(repo, '.claude/schemas/finding.schema.json'), 'utf8'));
  assert.deepEqual(validate(finding, { id: 'F-0001', severity: 'high', framework: 'DPDP', clause: 's.8(5)', issue: 'x', recommendation: 'y' }, '$', repo), []);
  const errors = validate(finding, { id: 'F-1', severity: 'severe', framework: 'DPDP', issue: 'x', recommendation: 'y', extra: 1 }, '$', repo);
  assert.equal(errors.length, 4, errors.join('\n')); // bad id, bad severity, missing clause, unexpected property
  assert.throws(() => validate({ oneOf: [] }, 1), /Unsupported schema keyword/);
});

test('finding file paths must be relative to the audited codebase', () => {
  const finding = JSON.parse(readFileSync(join(repo, '.claude/schemas/finding.schema.json'), 'utf8'));
  const base = { id: 'F-0001', severity: 'high', framework: 'DPDP', clause: 's.8(5)', issue: 'x', recommendation: 'y' };
  assert.deepEqual(validate(finding, { ...base, file: 'db/migrations/0003_kyc.sql' }, '$', repo), []);
  for (const file of ['C:\\Users\\me\\app\\x.sql', '/home/me/app/x.sql', '../app/x.sql']) {
    assert.equal(validate(finding, { ...base, file }, '$', repo).length, 1, file);
  }
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

  writeFileSync(join(dir, log), '{"a":1}\r\n{"b":2}\r\n');
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: log, content: '{"a":1}\n{"b":2}\n{"c":3}\n' } }), 0, 'CRLF checkout must not block a real append');
  rmSync(dir, { recursive: true });
});

test('write-guard catches key formats and leaves ordinary prose alone', () => {
  const dir = workspace();
  const guard = content => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path: 'README.md', content } } }).status;
  const secrets = [
    'key AKIA' + 'Q'.repeat(16),
    'ghp_' + 'a'.repeat(36),
    'github_pat_' + 'a'.repeat(40),
    'sk-ant-api03-' + 'a'.repeat(32),
    '-----BEGIN OPENSSH ' + 'PRIVATE KEY-----',
    '-----BEGIN RSA ' + 'PRIVATE KEY-----',
    'pass' + 'word=plainvalue',
    'DB_PASS' + 'WORD = "quotedvalue"',
    '{"pass' + 'word":"quotedvalue"}',
    'pass' + 'word: Sup3rvalue',
  ];
  for (const s of secrets) assert.equal(guard(s), 2, s);
  for (const s of ['Database pass' + 'word: hardcoded in config/settings.py', 'The task-tracker uses tokens sparingly']) assert.equal(guard(s), 0, s);
  rmSync(dir, { recursive: true });
});

test('write-guard keeps identifiers out of company and assessment data', () => {
  const dir = workspace();
  const guard = (file_path, content) => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path, content } } }).status;
  const report = 'assessments/a1/summary.md';
  assert.equal(guard(report, 'Aadhaar 9999 7165 8847 in logs'), 2); // synthetic: a UIDAI test number
  assert.equal(guard(report, 'Aadhaar 999971658847 in logs'), 2);
  assert.equal(guard(report, 'PAN ABCPE1234F in logs'), 2);
  assert.equal(guard(report, 'mobile +91 9000000000 in logs'), 2);
  assert.equal(guard(report, 'Exposure Rs 250000000000, stored in the aadhaar_number column'), 0, 'an amount that fails the check digit is not an Aadhaar number');
  assert.equal(guard('docs/guide.md', 'PAN format example ABCPE1234F'), 0, 'documentation is out of scope');
  rmSync(dir, { recursive: true });
});

test('hooks find the workspace from a subdirectory and block with exit 2', () => {
  const dir = workspace();
  mkdirSync(join(dir, 'docs/deep'), { recursive: true });
  const cwd = join(dir, 'docs/deep');
  assert.equal(workspaceRoot(cwd), workspaceRoot(dir));
  const blocked = run('write-guard.mjs', { cwd, input: { tool_name: 'Write', tool_input: { file_path: join(dir, 'src/app.js'), content: 'x' } } });
  assert.equal(blocked.status, 2, blocked.stderr);
  const viaEvent = run('write-guard.mjs', { cwd: tmpdir(), input: { cwd, tool_name: 'Write', tool_input: { file_path: join(dir, 'src/app.js'), content: 'x' } } });
  assert.equal(viaEvent.status, 2, viaEvent.stderr);
  const unreadable = run('write-guard.mjs', { cwd: dir, input: { cwd: '/no/such/dir', tool_name: 'Write', tool_input: { file_path: join(dir, 'README.md'), content: 'x' } } });
  assert.equal(unreadable.status, 0, unreadable.stderr);
  rmSync(dir, { recursive: true });
});

test('write-guard fails closed when the layout is broken', () => {
  const dir = workspace();
  writeFileSync(join(dir, '.claude/schemas/layout.json'), '{ not json');
  const r = run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path: 'README.md', content: 'x' } } });
  assert.equal(r.status, 2);
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

test('frontmatter must be valid YAML', () => {
  const skill = description => `---\nname: x\ndescription: ${description}\n---\n`;
  assert.deepEqual(frontmatterErrors(skill('Plain text. Use for things.'), 'x'), []);
  assert.deepEqual(frontmatterErrors(skill('"Quoted: with a colon and \\"inner\\" quotes."'), 'x'), []);
  assert.match(frontmatterErrors(skill('Bare: colon'), 'x').join(), /not valid YAML/);
  assert.match(frontmatterErrors(skill('"Broken "inner" quotes"'), 'x').join(), /not valid YAML/);
  assert.match(frontmatterErrors('---\nname: y\n---\n', 'x').join(), /needs "name: x".*needs a description/);
});

test('exports filter findings by company', () => {
  assert.equal(loadFindings('sample-co', repo).length, 9);
  assert.equal(loadFindings('nobody', repo).length, 0);
});

test('a second audit replaces the first in exports and KPIs', () => {
  const dir = dataCopy();
  secondAudit(dir);
  assert.equal(loadFindings('sample-co', dir).length, 2);
  const r = run('kpis.mjs', { cwd: dir });
  assert.equal(r.status, 0, r.stderr);
  const metrics = JSON.parse(readFileSync(join(dir, 'kpis/metrics.json'), 'utf8'));
  assert.equal(metrics.actionability.total_findings, 2);
  assert.equal(metrics.time_to_remediation.remediated_count, 1, 'a fix recorded in the earlier report still counts');
  rmSync(dir, { recursive: true });
});

test('KPIs can be scoped to one company', () => {
  const dir = dataCopy();
  const report = JSON.parse(readFileSync(join(dir, 'assessments/2026-10-19-sample-co-baseline/report.json'), 'utf8'));
  mkdirSync(join(dir, 'assessments/other'));
  writeFileSync(join(dir, 'assessments/other/report.json'), JSON.stringify({ ...report, assessment_id: 'other', company_id: 'other-co', findings: report.findings.slice(0, 1) }));
  const total = company => {
    const r = run('kpis.mjs', { cwd: dir, args: company ? ['--company', company] : [] });
    assert.equal(r.status, 0, r.stderr);
    return JSON.parse(readFileSync(join(dir, 'kpis/metrics.json'), 'utf8')).actionability.total_findings;
  };
  assert.equal(total(), 10);
  assert.equal(total('other-co'), 1);
  assert.equal(run('kpis.mjs', { cwd: dir, args: ['--company', 'typo'] }).status, 1);
  rmSync(dir, { recursive: true });
});

test('SARIF is ready for code scanning', () => {
  const dir = dataCopy();
  const out = join(dir, 'x.sarif');
  const r = run('export-sarif.mjs', { cwd: dir, args: ['--company', 'sample-co', '--output', out] });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /no file to point at: F-0004, F-0007/);
  assert.match(r.stdout, /remediated or accepted: F-0008/);
  const { tool, results } = JSON.parse(readFileSync(out, 'utf8')).runs[0];
  assert.equal(results.length, 6);
  for (const result of results) assert.ok(result.locations[0].physicalLocation.artifactLocation.uri);
  for (const rule of tool.driver.rules) assert.ok(rule.shortDescription.text && rule.fullDescription.text && rule.help.text, rule.id);
  rmSync(dir, { recursive: true });
});

test('OSCAL target-ids are valid tokens', () => {
  const dir = dataCopy();
  const out = join(dir, 'x.oscal.json');
  assert.equal(run('export-oscal.mjs', { cwd: dir, args: ['--company', 'sample-co', '--output', out] }).status, 0);
  const { findings } = JSON.parse(readFileSync(out, 'utf8'))['assessment-results'].results[0];
  assert.equal(findings.length, 9);
  for (const f of findings) assert.match(f.target['target-id'], /^(\p{L}|_)(\p{L}|\p{N}|[.\-_])*$/u); // pattern from the NIST schema
  rmSync(dir, { recursive: true });
});

test('OCSF maps a remediated finding to Resolved', () => {
  const dir = dataCopy();
  const out = join(dir, 'x.ocsf.jsonl');
  assert.equal(run('export-ocsf.mjs', { cwd: dir, args: ['--company', 'sample-co', '--output', out] }).status, 0);
  const events = readFileSync(out, 'utf8').trim().split('\n').map(line => JSON.parse(line));
  const status = id => events.find(e => e.finding_info.uid.endsWith(id)).status_id;
  assert.equal(status('F-0008'), 4); // remediated
  assert.equal(status('F-0001'), 2); // in progress
  assert.equal(status('F-0002'), 1); // open
  rmSync(dir, { recursive: true });
});

test('exporters refuse a company with no report', () => {
  for (const script of ['export-sarif.mjs', 'export-oscal.mjs', 'export-ocsf.mjs']) {
    const r = run(script, { args: ['--company', 'nobody', '--output', join(tmpdir(), 'vigil-nobody.out')] });
    assert.equal(r.status, 1, script);
    assert.match(r.stderr, /No report found/);
  }
  assert.equal(existsSync(join(tmpdir(), 'vigil-nobody.out')), false);
});

test('run-headless rejects unsafe arguments', () => {
  assert.equal(run('run-headless.mjs', { args: ['--workflow', 'audit', '--company', 'acme"; rm -rf ~', '--dry-run'] }).status, 1);
  const ok = run('run-headless.mjs', { args: ['--workflow', 'audit', '--company', 'acme-tech', '--dry-run'] });
  assert.equal(ok.status, 0);
  assert.match(ok.stdout, /Use the \/audit skill/);
});

test('run-headless can point at a codebase', () => {
  const dir = mkdtempSync(join(tmpdir(), 'vigil target-'));
  const args = ['--workflow', 'audit', '--company', 'acme-tech', '--dry-run'];
  const ok = run('run-headless.mjs', { args: [...args, '--target', dir] });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /record file paths relative to its root/);
  assert.equal(run('run-headless.mjs', { args: [...args, '--target', `${dir}"; rm -rf ~`] }).status, 1);
  assert.equal(run('run-headless.mjs', { args: [...args, '--target', join(dir, 'missing')] }).status, 1);
  assert.equal(run('run-headless.mjs', { args: [...args, '--target', dir, '--harness', 'opencode'] }).status, 1);
  rmSync(dir, { recursive: true });
});
