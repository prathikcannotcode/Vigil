---
name: gdpr-audit
description: "Audit code, database schemas and system configuration against EU GDPR and UK GDPR with article-level findings: personal data discovery, lawful basis, minimisation, security (Art. 25, 32), retention and transfers. Use for \"GDPR audit\", \"is this GDPR compliant\", \"GDPR code review\"."
---

# GDPR Code and System Audit

## Trigger

"GDPR audit", "GDPR code review", "is this GDPR compliant", "personal data in code", "PII scan", "GDPR system audit"

## Purpose

Audit code, database schemas, architecture, and system configurations for GDPR compliance. Produces a structured finding report with article citations, severity levels, and remediation steps.

## Scope

EU GDPR (Regulation 2016/679) and UK GDPR as amended by the Data (Use and Access) Act 2025. Always flag UK-specific questions for UK-specific analysis.

## Audit steps

### Step 1: Identify personal data

Scan for personal data (Art. 4(1)) and special category data (Art. 9):
- Direct identifiers: name, email, IP address, device ID, cookies (Art. 4(1), Recital 30)
- Special categories: health, biometric, racial/ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, sexual orientation (Art. 9(1))
- Inferred data that could re-identify individuals
- Pseudonymised data (still personal data under GDPR)

Search patterns: database column names, API request/response fields, log outputs, environment variables, configuration files, form inputs.

### Step 2: Assess lawful basis

For each processing activity, verify a lawful basis exists (Art. 6(1)):
- **(a) Consent:** meets Art. 7 requirements (freely given, specific, informed, unambiguous, withdrawable)
- **(b) Contract:** necessary for contract performance
- **(c) Legal obligation:** required by EU/Member State law
- **(d) Vital interests:** life-or-death situations only
- **(e) Public task:** public authority functions
- **(f) Legitimate interests:** passes the three-part LIA (purpose, necessity, balancing)

For special category data, verify an Art. 9(2) condition is met in addition.

### Step 3: Data minimisation and purpose limitation

- Art. 5(1)(c): Is only the minimum necessary data collected?
- Art. 5(1)(b): Is data used only for the stated purpose?
- Flag: fields collected but unused, data reused for undisclosed purposes, over-broad collection

### Step 4: Security and technical measures

Evaluate against Art. 25 (Privacy by Design) and Art. 32 (Security):
- Encryption at rest and in transit (Art. 32(1)(a))
- Pseudonymisation where feasible (Art. 25(1))
- Access controls with least privilege
- Audit logging for accountability (Art. 5(2))
- Breach detection capability (Art. 33-34)
- Input validation and injection prevention

### Step 5: Retention and deletion

- Art. 5(1)(e): Is there a defined retention period?
- Is there an automated or manual deletion/anonymisation mechanism?
- Are backups included in the retention policy?
- Is there a retention schedule documented?

### Step 6: Third parties and transfers

- Art. 28: Are processors bound by a Data Processing Agreement?
- Art. 30: Is there a Record of Processing Activities entry?
- Art. 44-49: For cross-border transfers, verify one of:
  - Adequacy decision (Art. 45), including EU-US Data Privacy Framework (note: CJEU appeal C-703/25 P pending, maintain SCC fallback)
  - Standard Contractual Clauses (Art. 46(2)(c))
  - Binding Corporate Rules (Art. 47)
  - Derogations (Art. 49)

## Output format

Findings follow the schema in `.claude/schemas/finding.schema.json`:

```
| # | Severity | Article | Issue | Recommendation |
|---|----------|---------|-------|----------------|
```

Severity: critical (direct violation risk), high (significant gap), medium (gap needing remediation), low (best-practice improvement).

## Guardrails

- Always cite the specific GDPR article for every finding.
- Flag genuinely ambiguous areas. Recommend a qualified DPO or lawyer for high-stakes decisions.
- This is compliance guidance, not legal advice.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/gdpr-audit` | Run a full GDPR audit on code or system |
| `/gdpr-audit pii` | Scan code for personal data |
| `/gdpr-audit security` | Audit security measures against Art. 25 and 32 |
| `/gdpr-audit transfers` | Review cross-border data transfer mechanisms |
