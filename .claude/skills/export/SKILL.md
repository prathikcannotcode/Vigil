---
name: export
description: Export findings as SARIF 2.1.0 (GitHub code scanning), OSCAL Assessment Results or OCSF Compliance Finding events. Use for "export SARIF", "OSCAL", "send findings to SIEM".
---

# Output Format Conversion (OSCAL, SARIF, OCSF)

## Trigger

"export OSCAL", "export SARIF", "convert findings", "OSCAL output", "SARIF output", "OCSF output", "standard format", "interop with Maxwell"

## Purpose

Convert Vigil findings and posture data into open standard formats for interoperability with other compliance tools, SIEMs, and reporting systems.

## Supported formats

### SARIF 2.1.0 (Static Analysis Results Interchange Format)

For code-related findings (PII in code, missing encryption, dark patterns in UI).

Maps to:
- `result.ruleId` -> finding clause (e.g., "GDPR-Art-32-1-a")
- `result.level` -> severity (critical/high -> error, medium -> warning, low -> note)
- `result.message.text` -> finding issue description
- `result.locations[].physicalLocation` -> file path and line number
- `result.fixes[].description` -> finding recommendation
- `run.tool.driver.rules[]` -> regulatory clauses as rule definitions

Use case: import into GitHub Code Scanning, VS Code SARIF Viewer, or any SARIF-compatible tool.

### OSCAL (Open Security Controls Assessment Language)

For control assessments and compliance posture.

Maps to:
- Assessment Results model:
  - `result.findings[]` -> findings with regulatory clause references
  - `result.observations[]` -> evidence from PII scans and data flow reviews
  - `control-selection` -> applicable DPDP sections and GDPR articles
- Component Definition model:
  - Organisation as a system component
  - Framework controls as implemented requirements

Use case: import into GovReady, Compliance-as-Code pipelines, or Maxwell's control ledger.

### OCSF 1.9 (Open Cybersecurity Schema Framework)

For runtime and breach findings.

Maps to:
- Compliance Finding (class 2003):
  - `finding_info.title` -> finding issue
  - `finding_info.uid` -> finding ID
  - `compliance.requirements[]` -> regulatory clauses
  - `severity_id` -> severity level
  - `remediation.desc` -> recommendation

Use case: feed into SIEM/SOAR systems, integrate with security operations.

## Conversion rules

### Finding ID mapping

Vigil finding IDs (`F-0001`) map to framework-specific rule IDs:
- DPDP: `DPDP-S{section}` (e.g., `DPDP-S8-5` for Section 8(5))
- GDPR: `GDPR-Art-{article}` (e.g., `GDPR-Art-32-1-a`)

### Severity mapping

| Vigil | SARIF level | OCSF severity_id |
|---|---|---|
| critical | error | 5 (Critical) |
| high | error | 4 (High) |
| medium | warning | 3 (Medium) |
| low | note | 2 (Low) |

### Framework mapping

| Vigil framework | OSCAL catalog |
|---|---|
| DPDP | Custom catalog: DPDP Act 2023 |
| GDPR | Custom catalog: EU GDPR 2016/679 |
| UK-GDPR | Custom catalog: UK GDPR + DUAA 2025 |

## Maxwell interop

To feed findings into a Maxwell workspace:
1. Export as OSCAL Assessment Results
2. Copy to Maxwell's `company-profile/{id}/soc/` directory
3. Maxwell's ledger protocol ingests the OSCAL findings

To import Maxwell findings:
1. Read Maxwell's SARIF output from its assessment
2. Convert SARIF rule IDs to Vigil finding format
3. Import as findings with `framework` set based on the rule prefix

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/export sarif` | Export code findings as SARIF 2.1.0 |
| `/export oscal` | Export posture and findings as OSCAL |
| `/export ocsf` | Export breach/runtime findings as OCSF |
| `/export all` | Export all formats |
| `/export import-sarif` | Import findings from a SARIF file |
