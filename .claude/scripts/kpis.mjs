#!/usr/bin/env node

/**
 * Compute Vigil KPIs from session transcripts and workspace state.
 *
 * Usage: npm run kpis
 *
 * Reads:
 *   - kpis/data/raw/sessions/   (session transcripts from headless runs)
 *   - assessments/*\/report.json (findings, coverage)
 *   - assessments/*\/posture.json and company-profile/*\/posture.json (posture snapshots)
 *
 * Writes:
 *   - kpis/metrics.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listFiles, loadReports } from './lib.mjs';

const root = process.cwd();
const DAY = 24 * 60 * 60 * 1000;

function readJson(rel) {
  try { return JSON.parse(readFileSync(join(root, rel), 'utf8')); }
  catch { return null; }
}

function percentile(sorted, p) {
  return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] : null;
}

// 1. Cost of audit: `claude --print --output-format json` reports total_cost_usd.
const sessions = listFiles(join(root, 'kpis/data/raw/sessions')).filter(f => f.endsWith('.json'))
  .map(f => readJson(join('kpis/data/raw/sessions', f))).filter(Boolean);
let costUsd = 0;
let measuredRuns = 0;
for (const s of sessions) {
  try {
    const out = JSON.parse(s.output);
    if (typeof out.total_cost_usd === 'number') { costUsd += out.total_cost_usd; measuredRuns++; }
  } catch { /* harness without cost data */ }
}

const reports = loadReports(root).sort((a, b) => a.started_at.localeCompare(b.started_at));
const findings = reports.flatMap(r => r.findings);

// 2. Coverage: latest report per company that recorded coverage.
const latestCoverage = new Map();
for (const r of reports) if (r.coverage) latestCoverage.set(r.company_id, r.coverage);
const applicable = [...latestCoverage.values()].reduce((n, c) => n + c.applicable, 0);
const examined = [...latestCoverage.values()].reduce((n, c) => n + c.examined, 0);

// 3. Actionability: recommendation, clause, owner and deadline all present.
const actionable = findings.filter(f => f.recommendation && f.clause && f.owner && f.due_date);

// 4. Time to remediation, in days.
const days = findings.filter(f => f.found_at && f.remediated_at)
  .map(f => Math.max(0, Math.round((Date.parse(f.remediated_at) - Date.parse(f.found_at)) / DAY)))
  .sort((a, b) => a - b);

// 5 + 6. Posture and penalty exposure trends from every snapshot, per company.
const RANK = { non_compliant: 0, partially_compliant: 1, compliant: 2 };
const snapshots = new Map();
for (const rel of listFiles(root).filter(f => /^(assessments|company-profile)\/[^/]+\/posture\.json$/.test(f))) {
  const p = readJson(rel);
  if (!p) continue;
  const list = snapshots.get(p.company_id) ?? [];
  if (!list.some(s => s.assessed_at === p.assessed_at)) list.push(p);
  snapshots.set(p.company_id, list);
}
const posture = {};
for (const [company, list] of snapshots) {
  list.sort((a, b) => a.assessed_at.localeCompare(b.assessed_at));
  const trend = { snapshots: list.length, improved: 0, regressed: 0, unchanged: 0 };
  const [prev, last] = list.slice(-2);
  if (list.length > 1) {
    for (const d of last.dimensions) {
      const before = prev.dimensions.find(x => x.name === d.name);
      for (const fw of ['dpdp_status', 'gdpr_status']) {
        const a = RANK[before?.[fw]];
        const b = RANK[d[fw]];
        if (a === undefined || b === undefined) continue;
        trend[b > a ? 'improved' : b < a ? 'regressed' : 'unchanged']++;
      }
    }
  }
  posture[company] = {
    ...trend,
    penalty_exposure: list.filter(s => s.penalty_exposure).map(s => ({ assessed_at: s.assessed_at, ...s.penalty_exposure })),
  };
}

const open = findings.filter(f => !['remediated', 'accepted'].includes(f.status ?? 'open'));
const openBySeverity = { critical: 0, high: 0, medium: 0, low: 0 };
for (const f of open) openBySeverity[f.severity]++;

const metrics = {
  computed_at: new Date().toISOString(),
  cost_of_audit: {
    sessions: sessions.length,
    sessions_with_cost: measuredRuns,
    total_usd: Number(costUsd.toFixed(4)),
    usd_per_run: measuredRuns ? Number((costUsd / measuredRuns).toFixed(4)) : null,
  },
  coverage: {
    applicable_controls: applicable,
    examined_controls: examined,
    rate_percent: applicable ? Number((examined / applicable * 100).toFixed(1)) : null,
  },
  actionability: {
    total_findings: findings.length,
    actionable_findings: actionable.length,
    rate_percent: findings.length ? Number((actionable.length / findings.length * 100).toFixed(1)) : null,
  },
  time_to_remediation: {
    remediated_count: days.length,
    median_days: percentile(days, 0.5),
    p90_days: percentile(days, 0.9),
  },
  posture_trend: posture,
  open_findings_by_severity: openBySeverity,
};

const outPath = join(root, 'kpis/metrics.json');
writeFileSync(outPath, JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));
console.log(`\nMetrics written to ${outPath}`);
