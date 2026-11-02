# Operating Rules

These rules bind all agents (AI and human contributors) working in this repository.

## Layout

Only write files matching the paths defined in `.claude/schemas/layout.json`. A new file type needs a rule in that layout and a corresponding schema.

## Structured data

- Every `.json` file must be valid JSON and conform to its schema.
- Every `.jsonl` file must have one valid JSON object per line.
- Run `npm run validate` before committing.

## Append-only logs

`breach-log.jsonl` and `rights-log.jsonl` are append-only. Never modify or delete existing entries. New entries go at the end.

## Findings

Every compliance finding must:
- Follow `.claude/schemas/finding.schema.json`
- Cite the specific regulatory clause (DPDP section number or GDPR article)
- Have a severity level (critical / high / medium / low)
- Include a concrete recommendation

## Personal data

Never store actual personal data in this repository. Findings reference file paths and line numbers, not data values. Test fixtures use synthetic data only.

## Frameworks

- **DPDP**: Digital Personal Data Protection Act, 2023 and Rules, 2025 (India)
- **GDPR**: General Data Protection Regulation 2016/679 (EU) and UK GDPR as amended by DUAA 2025

When a finding applies to both frameworks, note both clause references.

## Disclaimer

This project provides compliance tooling and informational guidance. It does not constitute legal advice. For binding compliance decisions, consult qualified legal counsel.

## Contributing

1. Keep to the layout.
2. Edit skills in `.claude/skills/` only.
3. Run `npm run validate` before opening a PR.
4. One skill per file. Name the file after the capability.
5. Every skill needs: trigger, purpose, legal basis with clause references, capabilities, guardrails, and commands.
