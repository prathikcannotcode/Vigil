---
name: export
description: "Export findings as SARIF 2.1.0 (GitHub code scanning), OSCAL Assessment Results or OCSF Compliance Finding events. Use for \"export SARIF\", \"OSCAL\", \"send findings to SIEM\"."
---

# Output Format Conversion (OSCAL, SARIF, OCSF)

## Trigger

"export OSCAL", "export SARIF", "convert findings", "OSCAL output", "SARIF output", "OCSF output", "standard format"

## Purpose

Convert Vigil findings and posture data into open standard formats for interoperability with other compliance tools, SIEMs, and reporting systems. Run the matching script; do not write these files by hand. Each export uses the company's latest report only.

## Supported formats

### SARIF 2.1.0 (Static Analysis Results Interchange Format)

`npm run export:sarif -- --company <id> --output findings.sarif`

For code-related findings (PII in code, missing encryption, dark patterns in UI). Findings with no `file` and findings that are `remediated` or `accepted` are left out, because code scanning has nowhere to display them or would show them as live alerts. The script names what it left out; tell the user.

Maps to:
- `result.ruleId` -> finding clause (e.g., "GDPR-Art-32-1-a")
- `result.level` -> severity (critical/high -> error, medium -> warning, low -> note)
- `result.message.text` -> finding issue and recommendation
- `result.locations[].physicalLocation` -> file path and line number
- `run.tool.driver.rules[]` -> regulatory clauses as rule definitions

Use case: import into GitHub Code Scanning, VS Code SARIF Viewer, or any SARIF-compatible tool.

### OSCAL 1.1.2 (Open Security Controls Assessment Language)

`npm run export:oscal -- --company <id> --output results.oscal.json`

For control assessments and compliance posture. All findings, as an Assessment Results document.

Maps to:
- `result.findings[]` -> findings, with the clause as a `target-id` token and a `clause` prop
- `result.observations[]` -> file evidence for findings that have a `file`
- `reviewed-controls` -> include-all, because Vigil has no OSCAL control catalog

Use case: import into GovReady or Compliance-as-Code pipelines.

### OCSF 1.3.0 (Open Cybersecurity Schema Framework)

`npm run export:ocsf -- --company <id> --output findings.ocsf.jsonl`

For security operations. All findings, one event per line.

Maps to:
- Compliance Finding (class 2003):
  - `finding_info.title` -> finding issue
  - `finding_info.uid` -> assessment and finding ID
  - `compliance.requirements[]` -> regulatory clauses
  - `severity_id` -> severity level
  - `status_id` -> open 1 (New), in progress or disputed 2 (In Progress), accepted 3 (Suppressed), remediated 4 (Resolved)
  - `remediation.desc` -> recommendation

Use case: feed into SIEM/SOAR systems, integrate with security operations.

## Severity mapping

| Vigil | SARIF level | OCSF severity_id |
|---|---|---|
| critical | error | 5 (Critical) |
| high | error | 4 (High) |
| medium | warning | 3 (Medium) |
| low | note | 2 (Low) |

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/export sarif` | Export code findings as SARIF 2.1.0 |
| `/export oscal` | Export posture and findings as OSCAL |
| `/export ocsf` | Export findings as OCSF |
| `/export all` | Export all formats |
