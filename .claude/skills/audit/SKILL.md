---
name: audit
description: "Run a full DPDP and GDPR privacy audit: PII discovery, data flows, consent, rights, DPIA, breach readiness, code and document review, then a posture snapshot and a schema-valid report. Use for \"full audit\", \"privacy audit\", \"audit my app\"."
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
4. **Rights mechanisms** (`/dpdp-rights audit`): verify grievance and rights request mechanisms.
5. **DPIA check** (`/dpdp-dpia screen`): determine if a DPIA is needed. If it is, write a `draft` with `/dpdp-dpia full`.
6. **Breach readiness** (`/dpdp-breach readiness`): compare the runbook with the required steps.
7. **Sector check**: if `details.json` lists `RBI`, `SEBI` or `IRDAI`, or the company is financial and its regulated status is unknown, check the matching rows of `/dpdp-catalog` under "Related Indian instruments". File a finding under the DPDP clause that carries the same duty, name the instrument in `cross_reference`, and say whether it applies or only might. When no DPDP clause carries it (CERT-In's 6-hour report runs on its own clock), list it under "Sector obligations" in `summary.md` instead. The validator rejects a `clause` that is not a DPDP or GDPR reference.

### Phase 3: GDPR assessment

8. **Code audit** (`/gdpr-audit`): audit code and systems against GDPR requirements.
9. **Document review** (`/gdpr-draft review`): check privacy policy, DPAs, consent notices for completeness.
10. **Transfer review** (`/gdpr-audit transfers`): verify cross-border transfer mechanisms.

### Phase 4: Synthesis

11. **Posture dashboard** (`/posture`): generate unified compliance posture.
12. **Report**: compile all findings into a single audit report sorted by severity.

If a step can't run, follow "When something is missing or blocked" in `AGENTS.md`, finish the rest, and name the skipped step in `summary.md`. If the evidence answers an unknown from onboarding, such as under-18 users in the code, update `details.json`.

## Rules for findings

- Before 13 May 2027 most DPDP obligations are not yet in force. Report DPDP gaps as readiness findings and say so in the issue text of any finding that cites DPDP, whether as `framework` or in `cross_reference`; check `/dpdp-catalog` for each clause.
- Severity measures the risk, not the date. A readiness gap can still be critical, and the issue text carries the timing.
- If the only evidence is an absence, write "not found in the reviewed material" and rate it medium at most. A DPIA or RoPA rarely lives in a code repository.
- Number findings `F-0001` upwards within the report.
- Every finding cites a clause, and a `cross_reference` when the same gap breaches the other framework.
- Set `found_at`. Leave `owner` and `due_date` for `/remediate` unless the user gave them.
- Reference code by `file` and `line`. `file` is relative to the root of the audited codebase, never absolute, so SARIF maps onto that repository. Leave it out for a gap with no file, such as a missing contract. Never copy personal data into a finding.
- Count applicable and examined controls and record them in `coverage`. One control is one section, rule or article at its top-level number, so s.8(5) and s.8(7) count once as s.8. List them in `summary.md`, with the ones you did not examine. The denominator is your own count, so do not present it as comparable across runs.

## Output

Assessment report saved to `assessments/{assessment_id}/`. Use `YYYY-MM-DD-{company_id}-{scope}` as the id, where `{scope}` is `full`, `dpdp` or `gdpr` to match the command. That is only a label: the `scope` field in `report.json` is the list of frameworks, such as `["DPDP", "GDPR"]`.
- `report.json`: `assessment_id`, `company_id`, `scope`, `started_at`, `completed_at`, `coverage` and `findings`, per `.claude/schemas/report.schema.json`. Also record `target` (repo and commit audited), `model`, `vigil_version` and `law_as_at` (the older "Last verified" date of the catalogs used) so someone can check the run later
- `posture.json`: compliance posture snapshot. Also write it to `company-profile/{id}/posture.json`, the company's current view
- `data-map.json`: personal data inventory. Also write it to `company-profile/{id}/data-map.json`
- `summary.md`: human-readable executive summary

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/audit` | Run full DPDP + GDPR audit |
| `/audit dpdp` | Run DPDP-only audit (phases 1 + 2) |
| `/audit gdpr` | Run GDPR-only audit (phases 1 + 3) |
