# Vigil KPIs

Six KPIs track audit quality from cost to outcome. `npm run kpis` computes them from session transcripts and workspace state.

## 1. Cost of audit

**What:** USD spent per audit run.
**How:** Sum token usage at list price from session transcripts, plus human review time (if logged).
**Target:** Decreasing over successive runs as the agent reuses prior context.

## 2. Coverage

**What:** Share of applicable controls examined in the audit period.
**How:** `coverage.examined` and `coverage.applicable` from each company's latest report. The assessor counts both; there is no fixed control list, so don't compare the figure across runs.
**Formula:** `examined / applicable`
**Target:** 100% for critical controls; 80%+ overall.

## 3. Actionability

**What:** Share of findings that have a concrete remediation plan.
**How:** Count findings where the remediation field is non-empty, has an owner (from the remediation workflow), a deadline, and a regulatory reference.
**Formula:** `actionable_findings / total_findings`
**Target:** 95%+.

## 4. Time to remediation

**What:** Days from finding creation to status changing to `remediated`.
**How:** `remediated_at - found_at` for each finding, median and p90.
**Target:** Critical: 7 days. High: 30 days. Medium: 90 days.

## 5. Posture trend

**What:** Direction of compliance posture over time.
**How:** Compare posture snapshots across assessments. Count dimensions that improved, regressed, or stayed the same.
**Target:** No regressions; at least one improvement per quarter.

## 6. Penalty exposure trend

**What:** Direction of maximum penalty exposure over time.
**How:** Run penalty calculator on each assessment's findings. Track the total over time.
**Target:** Decreasing quarter-over-quarter.
