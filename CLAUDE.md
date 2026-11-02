# Vigil

Read AGENTS.md before doing anything. It is the operating contract.

## Project

Open-source DPDP + GDPR compliance workspace agent. Skills run on Claude Code.

## Structure

- `.claude/skills/<name>/SKILL.md`: 20 skills. `dpdp-*` for the DPDP Act 2023 and Rules 2025, `gdpr-*` for EU and UK GDPR, the rest are cross-framework tools and the four workflows (`onboard`, `audit`, `remediate`, `refresh`)
- `.claude/schemas/`: JSON Schemas, plus `layout.json`, which lists every writable path and its schema
- `.claude/scripts/`: hooks (`write-guard`, `validate-on-write`), validation, exporters, KPIs, headless runner, tests
- `company-profile/{id}/`: per-organisation compliance data (`sample-co` is a synthetic demo)
- `assessments/{id}/`: point-in-time audit reports

## Rules

1. Only write files matching paths in `.claude/schemas/layout.json`. The write-guard hook enforces this.
2. Every JSON/JSONL file must satisfy the schema its layout rule names. The post-write hook validates it.
3. Never store actual personal data in findings. Reference by file path and line number only.
4. Breach log and rights log are append-only. Never modify or delete existing entries.
5. Always cite the regulatory clause (DPDP section or rule, GDPR article) for every finding.
6. Check commencement in `/dpdp-catalog` before calling a DPDP gap a violation: most obligations apply from 13 May 2027.
7. This is compliance tooling, not legal advice. Always include the disclaimer for high-stakes matters.

## Validation

```
npm run validate
npm test
```
