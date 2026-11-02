#!/usr/bin/env node

/**
 * Export Vigil findings as SARIF 2.1.0.
 *
 * Usage: node .claude/scripts/export-sarif.mjs --input assessments/<id>/report.json --output findings.sarif
 *        node .claude/scripts/export-sarif.mjs --company <id> --output findings.sarif
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { loadFindings, packageVersion } from './lib.mjs';

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

const findings = inputFile
  ? JSON.parse(readFileSync(inputFile, 'utf8')).findings ?? []
  : loadFindings(company);

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
      ...(f.file ? {
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: f.file },
            ...(f.line ? { region: { startLine: f.line } } : {}),
          },
        }],
      } : {}),
      properties: { id: f.id, severity: f.severity, status: f.status ?? 'open', clause: f.clause },
    })),
  }],
};

writeFileSync(outputFile, JSON.stringify(sarif, null, 2));
console.log(`SARIF 2.1.0 exported: ${findings.length} findings -> ${outputFile}`);
