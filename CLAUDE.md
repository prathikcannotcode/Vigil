# Vigil

Read AGENTS.md before doing anything. It is the operating contract.

## Project

Open-source DPDP + GDPR compliance workspace agent. Skills and workflows run on Claude Code.

## Structure

- `.claude/skills/dpdp/` -- DPDP Act 2023 / Rules 2025 skills
- `.claude/skills/gdpr/` -- EU GDPR / UK GDPR skills
- `.claude/skills/shared/` -- Cross-framework skills (PII scanner, posture dashboard)
- `.claude/workflows/` -- Multi-step audit workflows
- `.claude/schemas/` -- JSON Schemas for all structured data
- `company-profile/` -- Per-organisation compliance data
- `assessments/` -- Point-in-time audit reports

## Rules

1. Only write files matching paths in `.claude/schemas/layout.json`.
2. Validate every JSON/JSONL file against its schema before writing.
3. Never store actual personal data in findings. Reference by file path and line number only.
4. Breach log and rights log are append-only. Never modify or delete existing entries.
5. Always cite the regulatory clause (DPDP section or GDPR article) for every finding.
6. This is compliance tooling, not legal advice. Always include the disclaimer for high-stakes matters.

## Validation

```
npm run validate
```
