---
name: audit
description: Run a full DPDP and GDPR privacy audit: PII discovery, data flows, consent, rights, DPIA, breach readiness, code and document review, then a posture snapshot and a schema-valid report. Use for "full audit", "privacy audit", "audit my app".
---

# Full Privacy Audit Workflow

## Trigger

"full audit", "privacy audit", "compliance audit", "audit my app", "run full check"

## Purpose

Run a complete privacy compliance audit covering both DPDP and GDPR. Orchestrates the specialist skills in sequence, produces a unified report.

## Workflow

### Phase 1: Discovery

1. **PII scan** (`/pii-scan`): scan the codebase, database schemas, and API definitions for personal data.
2. **Data flow mapping** (`/gdpr-data-flows`): map how personal data flows through the system.

### Phase 2: DPDP assessment

3. **Consent audit** (`/dpdp-consent`): review consent collection, notices, and dark patterns.
4. **Rights mechanisms** (`/dpdp-rights`): verify grievance and rights request mechanisms.
5. **DPIA check** (`/dpdp-dpia`): determine if DPIA is needed; conduct if required.
6. **Breach readiness** (`/dpdp-breach`): verify breach detection and notification capability.

### Phase 3: GDPR assessment

7. **Code audit** (`/gdpr-audit`): audit code and systems against GDPR requirements.
8. **Document review** (`/gdpr-draft`): check privacy policy, DPAs, consent notices for completeness.
9. **Transfer review** (`/gdpr-audit transfers`): verify cross-border transfer mechanisms.

### Phase 4: Synthesis

10. **Posture dashboard** (`/posture`): generate unified compliance posture.
11. **Report**: compile all findings into a single audit report sorted by severity.

## Rules for findings

- Before 13 May 2027 most DPDP obligations are not yet in force. Report DPDP gaps as readiness findings and say so in the issue text; check `/dpdp-catalog` for each clause.
- Number findings `F-0001` upwards within the report.
- Every finding cites a clause, and a `cross_reference` when the same gap breaches the other framework.
- Set `found_at`. Leave `owner` and `due_date` for `/remediate` unless the user gave them.
- Reference code by `file` and `line`. Never copy personal data into a finding.
- Count applicable and examined controls (sections, rules, articles) and record them in `coverage`.

## Output

Assessment report saved to `assessments/{assessment_id}/` (use `YYYY-MM-DD-{company_id}-{scope}` as the id):
- `report.json`: `assessment_id`, `company_id`, `scope`, `started_at`, `completed_at`, `coverage` and `findings`, per `.claude/schemas/report.schema.json`
- `posture.json`: compliance posture snapshot
- `data-map.json`: personal data inventory
- `summary.md`: human-readable executive summary

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/audit` | Run full DPDP + GDPR audit |
| `/audit dpdp` | Run DPDP-only audit (phases 1 + 2) |
| `/audit gdpr` | Run GDPR-only audit (phases 1 + 3) |
