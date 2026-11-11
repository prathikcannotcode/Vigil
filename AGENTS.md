# Operating Rules

These rules bind all agents (AI and human contributors) working in this repository.

## Layout

Only write files matching the paths defined in `.claude/schemas/layout.json`. A new file type needs a rule in that layout and a corresponding schema. Agents do not edit `.claude/scripts`, `.claude/schemas` or `.claude/settings.json`; a human changes those by hand.

## Structured data

- Every `.json` file must be valid JSON and conform to the schema its layout rule names.
- Every `.jsonl` file must have one valid JSON object per line, each conforming to its schema.
- The post-write hook validates on every write. Run `npm run validate` and `npm test` before committing.

## Append-only logs

`breach-log.jsonl` and `rights-log.jsonl` are append-only. Never modify or delete existing entries. New entries go at the end. A correction or status change is a new line with the same `breach_id` or `request_id`. The write-guard hook rejects any write whose result does not start with the existing file.

## Findings

Every compliance finding must:
- Follow `.claude/schemas/finding.schema.json`
- Cite the specific regulatory clause in `clause`: DPDP sections and rules or GDPR articles, separated by commas, such as `s.8(5), Rule 6(1)(a)` or `Art. 32(1)(a)`. The validator rejects a number the framework doesn't have. Other instruments (CERT-In, RBI, SEBI) go in `cross_reference`, which nothing checks.
- Have a severity level (critical / high / medium / low)
- Include a concrete recommendation

## Personal data

Never store actual personal data in this repository. Findings reference file paths and line numbers, not data values. Test fixtures use synthetic data only.

## Frameworks

- **DPDP**: Digital Personal Data Protection Act, 2023 and Rules, 2025 (India). Phased: Board provisions from 13 Nov 2025, Consent Managers from 13 Nov 2026, everything else from 13 May 2027.
- **GDPR**: General Data Protection Regulation 2016/679 (EU) and UK GDPR as amended by DUAA 2025

When a finding applies to both frameworks, note both clause references.

## When something is missing or blocked

A run should end with a partial result and a list of what it skipped. It should not stall.

- **Nobody can answer a question** (headless run, side session, no reply): take the answer from the material you have and carry on. Never write `false`, `0` or a guess for something you don't know. Leave an optional field out and name it in the output.
- **A schema has no value for what you found**: use the closest allowed value, say in a text field that it is a stand-in, and report the gap. Do not edit the schema. Findings are the exception: a duty that only CERT-In, RBI or another sector rule imposes goes in the assessment summary, not `report.json`. A DPDP finding standing in for it reads as a DPDP gap it isn't.
- **A hook blocks a write**: do not route around it through the shell or another tool. Put the content at the nearest path the layout allows, usually `assessments/{id}/`, and report the block.
- **A skill has no mode for the step**: use its legal-basis table as the checklist and cite the clauses it lists.
- **The only evidence is an absence**: if a document or control is merely missing from the material you were given, write "not found in the reviewed material" and rate it medium at most. Go higher when the code or a document itself shows the gap.

## Disclaimer

This project provides compliance tooling and informational guidance. It does not constitute legal advice. For binding compliance decisions, consult qualified legal counsel.

## Contributing

1. Keep to the layout.
2. Edit skills in `.claude/skills/` only.
3. Run `npm run validate -- --strict` and `npm test` before opening a PR.
4. One skill per directory: `.claude/skills/<name>/SKILL.md`, with `name` and `description` frontmatter. Prefix framework-specific skills `dpdp-` or `gdpr-`.
5. Every skill needs: trigger, purpose, legal basis with clause references, capabilities, guardrails, and commands.
6. Every legal claim traces to an official source (Gazette, EUR-Lex, legislation.gov.uk, regulator site).
