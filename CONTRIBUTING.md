# Contributing to Vigil

[AGENTS.md](AGENTS.md) is the contract. It binds human and AI contributors alike. This page is the practical version.

## Setup

```bash
git clone https://github.com/prathikcannotcode/Vigil.git
cd Vigil
npm run validate -- --strict
npm test
```

No `npm install`. Everything runs on Node 22+ built-ins.

## Most wanted

| Area | Examples |
|---|---|
| Regulatory updates | A new MeitY notification, a CJEU judgment, an EDPB guideline. Open a [regulatory change issue](https://github.com/prathikcannotcode/Vigil/issues/new?template=regulatory-change.yml) or a PR against the matching `*-catalog` skill. |
| Sector guides | Insurance (IRDAI), telecom (TRAI), gaming, HR tech, adtech |
| Consent notices | More Eighth Schedule languages (Tamil, Bengali, Marathi, Telugu...) |
| Frameworks | Singapore PDPA, Brazil LGPD, US state laws, as new `<prefix>-*` skills |
| PII patterns | Detection heuristics for identifiers we miss |

## Rules of the road

1. **Cite the official source.** Gazette of India, EUR-Lex, legislation.gov.uk, a regulator's own site. Commentary helps, but never as the only source. If the date or clause is uncertain, say so in the skill.
2. **Keep to the layout.** A new file type needs a rule in `.claude/schemas/layout.json` and, for JSON, a schema. The write-guard hook will stop you otherwise, which is the point. Hooks, schemas and settings are off limits to agents, so edit those by hand.
3. **One skill per directory.** `.claude/skills/<name>/SKILL.md` with `name` (matching the directory) and `description` frontmatter. Sections: trigger, purpose, legal basis, capabilities, guardrails, commands.
4. **No real personal data.** Not in fixtures, issues, screenshots or test output. Use `sample-co` style synthetic data.
5. **Append-only logs stay append-only.** Even in examples.

## Pull requests

- `npm run validate -- --strict` and `npm test` pass (CI runs both).
- One topic per PR. A rules update and a refactor are two PRs.
- Say which clauses you changed and link the source.

## Disclaimer

Contributions are compliance tooling, not legal advice. Phrase skills as guidance and keep the disclaimer in high-stakes flows.
