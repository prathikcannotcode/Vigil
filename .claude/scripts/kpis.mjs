#!/usr/bin/env node

/**
 * Compute Vigil KPIs from session transcripts and workspace state.
 *
 * Usage: npm run kpis
 *
 * Reads:
 *   - kpis/data/raw/sessions/  (session transcripts from headless runs)
 *   - assessments/              (audit reports)
 *   - company-profile/          (posture snapshots)
 *
 * Writes:
 *   - kpis/metrics.json         (computed KPIs)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();

function walkJson(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkJson(full));
    } else if (extname(full) === '.json') {
      try {
        results.push({ path: full, data: JSON.parse(readFileSync(full, 'utf8')) });
      } catch { /* skip invalid */ }
    }
  }
  return results;
}

// 1. Cost of audit: count sessions and estimate from transcript size
const sessions = walkJson(join(root, 'kpis/data/raw/sessions'));
const sessionCount = sessions.length;
let totalTokensEstimate = 0;
for (const s of sessions) {
  const output = s.data.output || '';
  totalTokensEstimate += Math.ceil(output.length / 4);
}
const estimatedCostUsd = totalTokensEstimate * 0.000015;

// 2. Coverage: count findings vs applicable controls
const assessments = walkJson(join(root, 'assessments'));
const findings = assessments
  .filter(a => a.data.findings)
  .flatMap(a => a.data.findings || []);
const findingsByClause = new Map();
for (const f of findings) {
  findingsByClause.set(f.clause, (findingsByClause.get(f.clause) || 0) + 1);
}
const coveredControls = findingsByClause.size;

// 3. Actionability: findings with recommendation, clause, and severity
const actionable = findings.filter(f => f.recommendation && f.clause && f.severity);
const actionabilityRate = findings.length > 0
  ? (actionable.length / findings.length * 100).toFixed(1)
  : 'N/A';

// 4. Time to remediation: median days for remediated findings
const remediated = findings.filter(f => f.status === 'remediated' && f.found_at);
const remediationDays = remediated.map(f => {
  const found = new Date(f.found_at);
  const now = new Date();
  return Math.ceil((now - found) / (1000 * 60 * 60 * 24));
});
remediationDays.sort((a, b) => a - b);
const medianRemediation = remediationDays.length > 0
  ? remediationDays[Math.floor(remediationDays.length / 2)]
  : 'N/A';

// 5. Posture trend: load latest posture files
const postures = [];
if (existsSync(join(root, 'company-profile'))) {
  for (const co of readdirSync(join(root, 'company-profile'))) {
    const pf = join(root, 'company-profile', co, 'posture.json');
    if (existsSync(pf)) {
      try {
        postures.push(JSON.parse(readFileSync(pf, 'utf8')));
      } catch { /* skip */ }
    }
  }
}

// 6. Finding severity distribution
const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
for (const f of findings) {
  if (severityCounts[f.severity] !== undefined) severityCounts[f.severity]++;
}

const metrics = {
  computed_at: new Date().toISOString(),
  cost_of_audit: {
    sessions: sessionCount,
    estimated_tokens: totalTokensEstimate,
    estimated_cost_usd: estimatedCostUsd.toFixed(2),
  },
  coverage: {
    controls_with_findings: coveredControls,
    note: 'Run a full audit to populate coverage data',
  },
  actionability: {
    total_findings: findings.length,
    actionable_findings: actionable.length,
    rate_percent: actionabilityRate,
  },
  time_to_remediation: {
    remediated_count: remediated.length,
    median_days: medianRemediation,
  },
  posture: {
    companies_assessed: postures.length,
  },
  finding_severity: severityCounts,
};

const outPath = join(root, 'kpis/metrics.json');
writeFileSync(outPath, JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));
console.log(`\nMetrics written to ${outPath}`);
