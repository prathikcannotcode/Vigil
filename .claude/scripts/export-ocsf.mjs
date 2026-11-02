#!/usr/bin/env node

/**
 * Export Vigil findings as OCSF Compliance Finding events (class 2003), one JSON object per line.
 *
 * Usage: node .claude/scripts/export-ocsf.mjs --company <id> --output findings.ocsf.jsonl
 */

import { writeFileSync } from 'node:fs';
import { loadFindings, packageVersion } from './lib.mjs';

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}

const company = flag('company');
const outputFile = flag('output') || 'findings.ocsf.jsonl';

if (!company) {
  console.error('Usage: node .claude/scripts/export-ocsf.mjs --company <id> --output <file>');
  process.exit(1);
}

const SEVERITY_ID = { low: 2, medium: 3, high: 4, critical: 5 };
const findings = loadFindings(company);
const version = packageVersion();

const events = findings.map(f => ({
  class_uid: 2003,
  category_uid: 2,
  activity_id: 1,
  type_uid: 200301,
  severity_id: SEVERITY_ID[f.severity] ?? 0,
  status_id: f.status === 'remediated' ? 3 : 1,
  time: Date.parse(f.found_at ?? '') || Date.now(),
  metadata: {
    version: '1.3.0',
    product: { name: 'Vigil', vendor_name: 'Vigil contributors', version },
  },
  finding_info: { uid: `${f.assessment_id}/${f.id}`, title: f.issue, desc: f.issue },
  compliance: {
    standards: [f.framework],
    requirements: [f.clause, f.cross_reference].filter(Boolean),
    status: f.status === 'remediated' ? 'Pass' : 'Fail',
  },
  remediation: { desc: f.recommendation },
  ...(f.file ? { resources: [{ type: 'file', name: f.line ? `${f.file}:${f.line}` : f.file }] } : {}),
}));

writeFileSync(outputFile, events.map(e => JSON.stringify(e)).join('\n') + (events.length ? '\n' : ''));
console.log(`OCSF Compliance Finding events exported: ${events.length} findings -> ${outputFile}`);
