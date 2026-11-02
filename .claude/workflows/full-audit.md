# Full Privacy Audit Workflow

## Trigger

"full audit", "privacy audit", "compliance audit", "audit my app", "run full check"

## Purpose

Run a complete privacy compliance audit covering both DPDP and GDPR. Orchestrates the specialist skills in sequence, produces a unified report.

## Workflow

### Phase 1: Discovery

1. **PII scan** (shared/pii-scanner): scan the codebase, database schemas, and API definitions for personal data.
2. **Data flow mapping** (gdpr/data-flow-review): map how personal data flows through the system.

### Phase 2: DPDP assessment

3. **Consent audit** (dpdp/consent-management): review consent collection, notices, and dark patterns.
4. **Rights mechanisms** (dpdp/rights-management): verify grievance and rights request mechanisms.
5. **DPIA check** (dpdp/dpia): determine if DPIA is needed; conduct if required.
6. **Breach readiness** (dpdp/breach-response): verify breach detection and notification capability.

### Phase 3: GDPR assessment

7. **Code audit** (gdpr/code-audit): audit code and systems against GDPR requirements.
8. **Document review** (gdpr/document-drafting): check privacy policy, DPAs, consent notices for completeness.
9. **Transfer review** (gdpr/code-audit step 6): verify cross-border transfer mechanisms.

### Phase 4: Synthesis

10. **Posture dashboard** (shared/posture-dashboard): generate unified compliance posture.
11. **Report**: compile all findings into a single audit report sorted by severity.

## Output

Assessment report saved to `assessments/{assessment_id}/`:
- `report.json`: structured findings per `.claude/schemas/finding.schema.json`
- `posture.json`: compliance posture snapshot
- `data-map.json`: personal data inventory
- `summary.md`: human-readable executive summary

## Commands

| Command | Action |
|---|---|
| /audit-full | Run full DPDP + GDPR audit |
| /audit-dpdp | Run DPDP-only audit (phases 1 + 2) |
| /audit-gdpr | Run GDPR-only audit (phases 1 + 3) |
