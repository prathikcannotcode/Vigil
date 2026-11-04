# Changelog

## Unreleased

### Exports
- OSCAL: `target-id` is now a valid token. Every finding failed NIST's 1.1.2 schema before.
- SARIF: rules carry `fullDescription` and `help`. Findings with no file and closed findings are left out, because code scanning needs a location and would show them as live alerts. The exporter names what it left out.
- OCSF: a remediated finding is `status_id` 4 (Resolved), not 3 (Suppressed). In-progress findings are 2.
- Exporters use each company's latest report, so a re-audit no longer doubles the findings, and they exit 1 for a company with no report.

### Guardrails
- Hooks find the guard under `${CLAUDE_PROJECT_DIR}`, or relative to the working directory in a session that moved here from elsewhere, and find the workspace from the event's `cwd`. Before, a `cd` into a subdirectory made the hook crash with exit 1, which does not block, so writes went through.
- The write-guard fails closed: a broken layout blocks the write, and `onFailure: block` covers a hook that cannot start (Claude Code 2.1.295 or newer).
- `.claude/scripts`, `.claude/schemas` and `.claude/settings.json` are out of the writable layout. Agents could rewrite their own guards before.
- New: Aadhaar (with its check digit), PAN and +91 mobile numbers are blocked in company and assessment data.
- Secret patterns catch OpenSSH keys, `github_pat_` and `sk-ant-` keys, and JSON-style passwords. "password: hardcoded" in prose no longer blocks a write.
- The append-only check ignores CRLF differences.
- `npm run validate` rejects a skill description that is not valid YAML. All 20 are now quoted.

### Usability
- `examples/acme-demo`: a synthetic app with planted problems and a list of what an audit should find. The README no longer calls the hand-written `sample-co` files real output.
- `run-headless.mjs --target <dir>` points a headless run at a codebase. The timeout is 2 hours, up from 30 minutes, and a failed run saves its transcript.
- `npm run kpis -- --company <id>`. KPIs count each company's latest report only.
- `company-details` accepts the address, user count and turnover that `/onboard` asks for. `/penalty` reads the turnover.
- `report.json` can record the target repo and commit, model, Vigil version and law-as-at date. Finding `file` paths must be relative.
- `/penalty` reports DPDP exposure per finding and per provision, because the per-finding total grows with how finely an audit splits its findings.
- `/export` documents what the scripts do. The import, Component Definition and Maxwell sections described things that did not exist.
- Real company data is gitignored by default. `"private": true` in `package.json`, because `vigil` on npm is an unrelated package. Added `CITATION.cff`.

## 0.2.0 (2 November 2026)

### Skills are real slash commands now
- All 16 skills and 4 workflows moved to `.claude/skills/<name>/SKILL.md` with frontmatter. In 0.1.0 Claude Code never discovered them; it had to stumble on the files. Now `/audit`, `/posture`, `/dpdp-breach notify-board` and the rest show up in the slash menu.

### Guardrails do what the README said
- `npm run validate` and the post-write hook now validate every file against its schema. In 0.1.0 they only checked that the JSON parsed.
- Append-only enforcement for `breach-log.jsonl` and `rights-log.jsonl`. In 0.1.0 it was a rule in a markdown file; now the write-guard rejects any write whose result does not start with the existing log.
- `layout.json` is the single source of truth: the write-guard reads it instead of a hardcoded list, and each rule names its schema.
- The post-write hook exits 2, so the agent sees validation errors (exit 1 only reached the user).
- The path check uses `path.relative`, closing a prefix bypass (`/repo` vs `/repo-evil`). MultiEdit is guarded too.

### Legal accuracy
- DPDP section and rule numbers corrected throughout. Penalties are s.33 and the Schedule (not s.18); the Board is s.18 (not s.19); application is s.3 (not s.4); the Rules numbering now matches the notified text (notice is Rule 3, Consent Managers Rule 4, rights Rule 14).
- Breach: Rule 7(2)(b) 72-hour detailed report to the Board; no harm threshold; no public-notice substitute for individual intimation.
- Grievances: up to 90 days under Rule 14(3), not 30 days under s.13.
- DPO: s.10(2)(a) requires an individual responsible to the Board of Directors, not a Key Managerial Person.
- Dark patterns: sourced to the CCPA Guidelines 2023, not the DPDP Rules.
- Phased commencement table (13 Nov 2025, 13 Nov 2026, 13 May 2027), the Removal of Difficulties Order 2026, the RBI Cybersecurity Directions 2026, and MeitY's pending 12-month proposal.
- UK: DUAA 2025 keeps the DPO. The Senior Responsible Individual was a DPDI Bill idea and never became law.
- GDPR penalty calculator applies Art. 83(3): linked processing operations are capped at the gravest infringement, not summed.
- Example notices: s.7 legitimate uses relabelled correctly (employment is s.7(i), medical emergency s.7(f)); DPDP has no legitimate-interests ground.

### New
- Synthetic demo company `sample-co` with a full baseline audit: report, posture, summary, breach and rights logs, consent record, DPIA.
- `npm run export:ocsf` (documented in 0.1.0, missing until now).
- Schemas for assessment reports, breach log entries and rights log entries; findings gain `owner`, `due_date`, `remediated_at`, `cross_reference`.
- Test suite (`npm test`, Node's built-in runner, no dependencies) and GitHub Actions CI.

### Fixed
- `export:sarif --company` ignored the company. SARIF output is now valid 2.1.0 (no `fixes` without `artifactChanges`).
- OSCAL output includes the required `reviewed-controls` and links observations to findings.
- KPIs: real cost from Claude Code's `total_cost_usd`, remediation time from `remediated_at`, coverage with a denominator, posture and penalty trends.
- Headless runner: validates every argument before it reaches the shell, records the real start time, uses `opencode run`, and lets Claude Code write reports (`acceptEdits`, still fenced by the write-guard).

## 0.1.0

Initial release.
