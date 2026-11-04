#!/usr/bin/env node

/**
 * Export Vigil findings as SARIF 2.1.0.
 *
 * Usage: node .claude/scripts/export-sarif.mjs --input assessments/<id>/report.json --output findings.sarif
 *        node .claude/scripts/export-sarif.mjs --company <id> --output findings.sarif
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { loadFindings, requireReport, packageVersion } from './lib.mjs';

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}

const inputFile = flag('input');
const company = flag('company');
const outputFile = flag('output') || 'findings.sarif';

if (!inputFile && !company) {
  console.error('Provide --input <report.json> or --company <id>');
  process.exit(1);
}

if (!inputFile) requireReport(company);

const all = inputFile
  ? JSON.parse(readFileSync(inputFile, 'utf8')).findings ?? []
  : loadFindings(company);

// Code scanning needs a location to display a result, and a closed finding is not a live alert.
const closed = all.filter(f => ['remediated', 'accepted'].includes(f.status));
const unlocated = all.filter(f => !f.file && !closed.includes(f));
const findings = all.filter(f => f.file && !closed.includes(f));

function severityToLevel(sev) {
  switch (sev) {
    case 'critical': case 'high': return 'error';
    case 'medium': return 'warning';
    default: return 'note';
  }
}

function clauseToRuleId(clause, framework) {
  if (!clause) return 'unknown';
  const prefix = framework === 'GDPR' || framework === 'UK-GDPR' ? framework : 'DPDP';
  const normalised = clause.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${prefix}-${normalised}`;
}

const rules = new Map();
for (const f of findings) {
  const ruleId = clauseToRuleId(f.clause, f.framework);
  if (!rules.has(ruleId)) {
    rules.set(ruleId, {
      id: ruleId,
      shortDescription: { text: `${f.framework || 'Unknown'} ${f.clause || 'unknown clause'}` },
      fullDescription: { text: `Possible gap against ${f.framework || 'Unknown'} ${f.clause || 'unknown clause'}. Each result states the issue and a recommendation.` },
      help: { text: 'Compliance tooling, not legal advice. Check the clause with /dpdp-catalog or /gdpr-catalog before relying on it.' },
      defaultConfiguration: { level: severityToLevel(f.severity) },
    });
  }
}

const sarif = {
  $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json',
  version: '2.1.0',
  runs: [{
    tool: {
      driver: {
        name: 'Vigil',
        informationUri: 'https://github.com/prathikcannotcode/Vigil',
        version: packageVersion(),
        rules: [...rules.values()],
      },
    },
    results: findings.map(f => ({
      ruleId: clauseToRuleId(f.clause, f.framework),
      level: severityToLevel(f.severity),
      // SARIF `fixes` require concrete artifactChanges, so the recommendation travels in the message.
      message: { text: f.recommendation ? `${f.issue} Recommendation: ${f.recommendation}` : f.issue || '' },
      locations: [{
        physicalLocation: {
          artifactLocation: { uri: f.file.replace(/\\/g, '/') },
          ...(f.line ? { region: { startLine: f.line } } : {}),
        },
      }],
      properties: { id: f.id, severity: f.severity, status: f.status ?? 'open', clause: f.clause },
    })),
  }],
};

writeFileSync(outputFile, JSON.stringify(sarif, null, 2));
console.log(`SARIF 2.1.0 exported: ${findings.length} findings -> ${outputFile}`);
if (unlocated.length) console.log(`Left out, no file to point at: ${unlocated.map(f => f.id).join(', ')}. They stay in report.json, OSCAL and OCSF.`);
if (closed.length) console.log(`Left out, remediated or accepted: ${closed.map(f => f.id).join(', ')}.`);
