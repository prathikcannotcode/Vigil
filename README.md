# Vigil

A self-hostable, open-source data privacy compliance workspace agent for DPDP and GDPR. Runs headlessly on Claude Code.

Skills and workflows that audit codebases, manage consent, handle breach response, track data subject rights, calculate penalty exposure, and generate compliance posture dashboards. Write-guard hooks and JSON Schema validation constrain the agent: only the workspace layout may exist, every file is validated as it is written, and breach and rights logs are append-only.

Built for any organisation handling personal data under India's DPDP Act 2023 or the EU/UK GDPR.

## Contents

- [What it does](#what-it-does)
- [Quick start](#quick-start)
- [Use cases to try](#use-cases-to-try)
- [Skills](#skills)
- [Workflows](#workflows)
- [Consent notice library](#consent-notice-library)
- [Sector guides](#sector-guides)
- [Regulatory coverage](#regulatory-coverage)
- [Workspace layout](#workspace-layout)
- [Guardrails](#guardrails)
- [Contributing](#contributing)
- [License](#license)

## What it does

**DPDP Act 2023 / Rules 2025 (India)**
- DPO governance setup, charter, and board reporting
- Consent lifecycle management with dark pattern detection
- Data Principal rights handling with SLA tracking
- Breach detection, DPBI notification, and post-incident review
- Data Protection Impact Assessments
- Regulatory catalog with full penalty schedule
- Regulatory monitoring for Act/Rules amendments, DPBI orders, and sectoral updates

**GDPR (EU) / UK GDPR**
- Code and system audits with article-level citations
- Privacy policy, DPA, and consent notice drafting
- Data flow mapping and RoPA verification
- Compliance Q&A with CJEU/EDPB case law tracking
- Regulatory catalog with transfer mechanism status and UK GDPR divergence
- Penalty tier calculation

**Cross-framework**
- PII scanner for codebases, database schemas, and configs
- Unified posture dashboard (DPDP + GDPR side by side)
- Penalty exposure calculator
- Regulatory monitor across both jurisdictions
- Organisation onboarding with framework auto-detection
- Remediation workflow with prioritisation by penalty exposure
- Context refresh for periodic re-assessment

## Quick start

You need Node.js 22+ and Claude Code (or OpenCode).

```bash
git clone https://github.com/prathikcannotcode/Vigil.git
cd Vigil
npm run validate
```

Then open Claude Code:

```bash
claude
```

Start by adding your organisation:

```
Add my company acme-tech, a SaaS company processing data in India and the EU.
```

Then try any of the use cases below.

## Use cases to try

**Compliance officer**
```
What's our compliance posture?
```
```
Which frameworks apply to acme-tech, and what are the penalty caps?
```
```
Run a full privacy audit on our application.
```

**Data Protection Officer**
```
Set up DPO governance for acme-tech.
```
```
Prepare the quarterly DPO board report.
```
```
Has DPDP or GDPR changed anything that affects us?
```

**Engineering / DevSecOps**
```
Scan this codebase for personal data.
```
```
Are there any dark patterns in our consent flow?
```
```
Review our data flows for GDPR compliance.
```

**Legal / Privacy counsel**
```
Draft a GDPR-compliant privacy policy for our SaaS product.
```
```
Is storing IP addresses in access logs GDPR compliant?
```
```
What's our penalty exposure for the open findings?
```
```
Draft a Data Processing Agreement for our cloud vendor.
```

**After a breach**
```
We've had a data breach. Walk me through the response.
```

## Skills

### DPDP (6 skills)

| Skill | File | Key commands |
|---|---|---|
| DPO Governance | `.claude/skills/dpdp/dpo-governance.md` | `/dpo-setup`, `/dpo-monitoring`, `/dpo-board-report` |
| Consent Management | `.claude/skills/dpdp/consent-management.md` | `/consent-notice`, `/consent-audit`, `/dark-pattern-check` |
| Breach Response | `.claude/skills/dpdp/breach-response.md` | `/breach-assess`, `/breach-notify-dpbi` |
| DPIA | `.claude/skills/dpdp/dpia.md` | `/dpia-screen`, `/dpia-full` |
| Rights Management | `.claude/skills/dpdp/rights-management.md` | `/rights-intake`, `/rights-sla` |
| Regulatory Catalog | `.claude/skills/dpdp/regulatory-catalog.md` | `/reg-catalog`, `/reg-penalties`, `/reg-applicability` |

### GDPR (5 skills)

| Skill | File | Key commands |
|---|---|---|
| Code Audit | `.claude/skills/gdpr/code-audit.md` | `/gdpr-audit`, `/gdpr-pii-scan`, `/gdpr-security` |
| Compliance Q&A | `.claude/skills/gdpr/compliance-qa.md` | `/gdpr-qa`, `/gdpr-basis`, `/gdpr-updates` |
| Data Flow Review | `.claude/skills/gdpr/data-flow-review.md` | `/data-flow-map`, `/ropa-check` |
| Document Drafting | `.claude/skills/gdpr/document-drafting.md` | `/gdpr-privacy-policy`, `/gdpr-dpa` |
| Regulatory Catalog | `.claude/skills/gdpr/regulatory-catalog.md` | `/gdpr-catalog`, `/gdpr-penalties`, `/gdpr-uk-divergence` |

### Shared (5 skills)

| Skill | File | Key commands |
|---|---|---|
| Posture Dashboard | `.claude/skills/shared/posture-dashboard.md` | `/posture`, `/posture-gaps` |
| PII Scanner | `.claude/skills/shared/pii-scanner.md` | `/pii-scan`, `/pii-scan-db` |
| Penalty Calculator | `.claude/skills/shared/penalty-calculator.md` | `/penalty-calc`, `/penalty-prioritise` |
| Regulatory Monitor | `.claude/skills/shared/regulatory-monitor.md` | `/reg-monitor`, `/reg-alert`, `/reg-timeline` |
| Output Formats | `.claude/skills/shared/output-formats.md` | `/export-sarif`, `/export-oscal`, `/export-ocsf` |

## Workflows

| Workflow | File | Commands |
|---|---|---|
| Full Audit | `.claude/workflows/full-audit.md` | `/audit-full`, `/audit-dpdp`, `/audit-gdpr` |
| Onboarding | `.claude/workflows/onboarding.md` | `/onboard` |
| Remediation | `.claude/workflows/remediation.md` | `/remediate`, `/remediate-verify` |
| Context Refresh | `.claude/workflows/context-refresh.md` | `/refresh` |

## Consent notice library

Ready-to-use DPDP-compliant consent notice templates in `examples/consent-notices/`:

| Template | File |
|---|---|
| E-Commerce Checkout | `e-commerce-checkout.md` |
| Mobile App Onboarding | `mobile-app-onboarding.md` |
| Employee HR Data | `employee-hr-data.md` |
| Health Data Collection | `health-data-collection.md` |
| Marketing Opt-In | `marketing-opt-in.md` |
| Parental Consent (Children) | `parental-consent-children.md` |
| E-Commerce Checkout (Hindi) | `e-commerce-checkout-hindi.md` |

Each template covers both DPDP and GDPR requirements with `[PLACEHOLDER]` markers for organisation-specific details.

## Sector guides

Sector-specific compliance guidance in `examples/sector-guides/`:

| Guide | Covers |
|---|---|
| [Fintech and Banking](examples/sector-guides/fintech-banking.md) | DPDP + RBI + SEBI + PCI DSS + GDPR |
| [Healthtech and Healthcare](examples/sector-guides/healthtech-healthcare.md) | DPDP + GDPR Art. 9 + health-specific retention |
| [Edtech and Education](examples/sector-guides/edtech-education.md) | DPDP Section 9 (children) + GDPR Art. 8 |

## Regulatory coverage

| Framework | Jurisdiction | Key references |
|---|---|---|
| DPDP Act, 2023 | India | 18 sections mapped with penalty schedule |
| DPDP Rules, 2025 | India | 14 rules: consent, dark patterns, children, breach, SDF |
| GDPR (2016/679) | EU | All 99 articles, EDPB guidelines, CJEU rulings |
| UK GDPR + DUAA 2025 | UK | Recognised LI, SRI, transfer standard divergence |
| Related instruments | Various | RBI, SEBI, IRDAI, CERT-In, PCI DSS, ePrivacy |

## Workspace layout

```
Vigil/
├── .claude/
│   ├── skills/
│   │   ├── dpdp/              # 6 DPDP Act skills
│   │   ├── gdpr/              # 5 GDPR skills
│   │   └── shared/            # 5 cross-framework skills
│   ├── schemas/               # 8 JSON Schemas
│   ├── workflows/             # 4 orchestration workflows
│   ├── scripts/               # Hooks and validation
│   └── settings.json          # Hooks and permissions
├── company-profile/           # Per-organisation compliance data
│   └── {company_id}/
│       ├── details.json       # Organisation details
│       ├── data-map.json      # Personal data inventory
│       ├── consent-records/   # Consent collection records
│       ├── dpias/             # Impact assessments
│       ├── breach-log.jsonl   # Append-only breach log
│       ├── rights-log.jsonl   # Append-only rights request log
│       └── posture.json       # Compliance posture snapshot
├── assessments/               # Point-in-time audit reports
├── kpis/                      # KPI definitions, data, and metrics
│   ├── measurement/           # KPI definitions
│   ├── data/raw/sessions/     # Session transcripts from headless runs
│   └── metrics.json           # Computed KPIs
├── examples/
│   ├── consent-notices/       # 7 consent notice templates
│   └── sector-guides/        # 3 sector guides
├── CLAUDE.md
├── AGENTS.md
└── LICENSE                    # Apache 2.0
```

## Headless mode

Run workflows without an interactive session:

```bash
node .claude/scripts/run-headless.mjs --workflow full-audit --company acme-tech
```

```bash
node .claude/scripts/run-headless.mjs --workflow full-audit --company acme-tech --framework dpdp --dry-run
```

Add `--harness opencode --model <provider/model>` to run on OpenCode. The run commits nothing: check the result with `npm run validate`.

## KPIs

Six metrics track audit quality from cost to outcome. `npm run kpis` computes them from session transcripts and workspace state.

| KPI | What it measures |
|---|---|
| Cost of audit | USD per run from token usage |
| Coverage | Share of applicable controls examined |
| Actionability | Share of findings with owner, deadline, and clause |
| Time to remediation | Days from finding to fix (median) |
| Posture trend | Compliance direction over time |
| Penalty exposure trend | Financial risk direction over time |

Definitions: `kpis/measurement/kpi-definitions.md`. Data: `kpis/data/`. Output: `kpis/metrics.json`.

## Output formats

Export findings to open standards for interoperability:

```bash
npm run export:sarif -- --company acme-tech --output findings.sarif
```

```bash
npm run export:oscal -- --company acme-tech --output results.oscal.json
```

| Format | Standard | Use case |
|---|---|---|
| SARIF 2.1.0 | OASIS | GitHub Code Scanning, VS Code, CI/CD |
| OSCAL | NIST | GovReady, Compliance-as-Code, Maxwell interop |
| OCSF 1.9 | OCSF | SIEM/SOAR integration |

## Guardrails

- **Write guard:** hooks block writes outside the workspace layout and content containing secret-shaped strings (API keys, passwords, tokens).
- **Validation on write:** every JSON and JSONL file is validated after each write.
- **Append-only logs:** breach and rights logs cannot be modified or deleted, only appended to.
- **Schema enforcement:** 7 JSON Schemas covering findings, consent records, company details, data maps, DPIAs, posture snapshots, and workspace layout.
- **Regulatory citations:** every finding must cite the specific clause (DPDP section or GDPR article).
- **No personal data in findings:** findings reference file paths and line numbers, never actual data values.

## Contributing

1. Read [AGENTS.md](AGENTS.md). Everything in it binds all contributors.
2. Keep to the layout. A new file type needs a rule in `.claude/schemas/layout.json` and a schema.
3. One skill per file. Every skill needs: trigger, purpose, legal basis, capabilities, guardrails, and commands.
4. Run `npm run validate` before opening a PR.
5. Cite regulatory clauses. "Section 8(5)" not "security requirements".

## Disclaimer

This project provides compliance tooling and informational guidance. It does not constitute legal advice. Verify current requirements against official sources and consult qualified counsel for binding compliance decisions.

## License

Apache License 2.0. See [LICENSE](LICENSE).
