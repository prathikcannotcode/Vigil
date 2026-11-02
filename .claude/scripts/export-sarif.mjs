#!/usr/bin/env node

/**
 * Export Vigil findings as SARIF 2.1.0.
 *
 * Usage: node .claude/scripts/export-sarif.mjs --input assessments/<id>/report.json --output findings.sarif
 *        node .claude/scripts/export-sarif.mjs --company <id> --output findings.sarif
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}

const inputFile = flag('input');
const company = flag('company');
const outputFile = flag('output') || 'findings.sarif';

function loadFindings() {
  if (inputFile) {
    return JSON.parse(readFileSync(inputFile, 'utf8')).findings || [];
  }
  if (company) {
    const dir = join('assessments');
    if (!existsSync(dir)) return [];
    const files = [];
    for (const entry of readdirSync(dir, { recursive: true })) {
      if (entry.endsWith('.json')) {
        try {
          const data = JSON.parse(readFileSync(join(dir, entry), 'utf8'));
          if (data.findings) files.push(...data.findings);
        } catch { /* skip */ }
      }
    }
    return files;
  }
  console.error('Provide --input <file> or --company <id>');
  process.exit(1);
}

function severityToLevel(sev) {
  switch (sev) {
    case 'critical': case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'note';
    default: return 'note';
  }
}

function clauseToRuleId(clause, framework) {
  if (!clause) return 'unknown';
  const prefix = framework === 'GDPR' || framework === 'UK-GDPR' ? 'GDPR' : 'DPDP';
  const normalised = clause.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
  return `${prefix}-${normalised}`;
}

const findings = loadFindings();
const rules = new Map();

for (const f of findings) {
  const ruleId = clauseToRuleId(f.clause, f.framework);
  if (!rules.has(ruleId)) {
    rules.set(ruleId, {
      id: ruleId,
      shortDescription: { text: f.clause || 'Unknown clause' },
      fullDescription: { text: `${f.framework || 'Unknown'} ${f.clause || ''}` },
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
        version: '0.1.0',
        rules: [...rules.values()],
      },
    },
    results: findings.map(f => {
      const result = {
        ruleId: clauseToRuleId(f.clause, f.framework),
        level: severityToLevel(f.severity),
        message: { text: f.issue || '' },
      };

      if (f.file) {
        result.locations = [{
          physicalLocation: {
            artifactLocation: { uri: f.file },
            ...(f.line ? { region: { startLine: f.line } } : {}),
          },
        }];
      }

      if (f.recommendation) {
        result.fixes = [{
          description: { text: f.recommendation },
        }];
      }

      return result;
    }),
  }],
};

writeFileSync(outputFile, JSON.stringify(sarif, null, 2));
console.log(`SARIF 2.1.0 exported: ${findings.length} findings -> ${outputFile}`);
