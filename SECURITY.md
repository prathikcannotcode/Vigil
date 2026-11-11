# Security policy

## Reporting a vulnerability

Report security issues privately through [GitHub security advisories](https://github.com/prathikcannotcode/Vigil/security/advisories/new). Do not open a public issue.

Include what you found, how to reproduce it, and the impact.

## In scope

- Bypasses of the write-guard hook (writing outside `layout.json`, rewriting an append-only log, smuggling a secret past the patterns)
- Schema validation bypasses
- Command injection in `run-headless.mjs` or the exporters
- Any path where Vigil copies personal data into findings, logs or exports

## Known limits

The hooks and the validator catch mistakes an agent makes through Claude Code's file tools. They are not a security boundary, and a file that passes them is well formed, not legally checked.

### Write paths the guard never sees

The write-guard runs on Write, Edit, MultiEdit and NotebookEdit. It does not see:

- shell commands through the Bash or PowerShell tool (`>`, `sed -i`, `node -e`, `git checkout`)
- MCP tools that write files
- another harness, such as `run-headless.mjs --harness opencode`
- a person with an editor

Claude Code's permission system is what stands in front of the shell. `.claude/settings.json` pre-approves only the validate and test commands, and `run-headless.mjs` runs with `--permission-mode acceptEdits`, which approves file edits but not shell commands. A session in auto mode, or started with `--dangerously-skip-permissions`, can write anything the shell can. For unattended runs, use a container, or make `.claude/scripts`, `.claude/schemas`, `.claude/settings.json` and both logs read-only at the OS level.

`npm run validate -- --strict` in CI re-checks schemas and clause numbers however a file was written. It cannot tell that an old log line changed, so read log diffs in review.

### Hook input

The guard blocks an event it cannot parse, one with no `tool_name` or `tool_input`, and a file tool with no path. An event from a tool that writes no file, such as TodoWrite caught by a loose matcher, passes. The post-write validator reports an event it cannot parse instead of skipping it.

### Personal data

The guard blocks three formats in `company-profile/` and `assessments/`: Aadhaar numbers that pass the Verhoeff check, PAN, and +91 mobile numbers. Everything else gets through, including email addresses, dates of birth, card and bank account numbers, ABHA numbers and medical text. Some of those look exactly like data a profile or report is meant to hold, such as a DPO's email or a due date. Card and ABHA numbers are simply not covered yet. Treat the filter as a tripwire for the commonest Indian identifiers. It is not data-loss prevention.

It also has no say over what the model reads. Files Claude Code opens go to your model provider.

### Clause references

The validator checks that each reference in a finding's `clause` names a section (1-44) or rule (1-23) for DPDP, or an article (1-99) for GDPR and UK GDPR, in the finding's own framework. "Section 999 of the Imaginary Act" fails. It does not check that a sub-clause such as Art. 32(9) exists, that the clause says what the finding claims, or that it applies to the organisation, and it never reads `cross_reference`. A licensed attorney still checks every finding.

### Sector rules

The finding schema knows three frameworks: DPDP, GDPR and UK GDPR. CERT-In, RBI, SEBI, IRDAI, health and education rules appear only as text, in `cross_reference`, the [sector guides](examples/sector-guides) and skill prose. Nothing validates them, sector counsel has not reviewed the guides, and no test measures whether an audit finds sector-specific gaps. A sector duty with no DPDP or GDPR clause behind it goes in the assessment summary, not `report.json`.

### Platform

- `onFailure: block` needs Claude Code 2.1.295 or newer. On older versions, a hook that cannot start at all does not block the write.
- The hook command looks for the guard under `${CLAUDE_PROJECT_DIR}`, the folder a session started in, then relative to the working directory. A session that moved here from elsewhere and then changed into a subdirectory can't find it, so writes are blocked until it returns to the repo root.
- On Windows without Git Bash, Claude Code runs hooks in PowerShell, which can't parse this command. The write-guard then blocks every write, and post-write validation does not run. Install Git for Windows.

## Your data

Vigil runs locally on your machine and your model provider. It has no server and no telemetry. Company profiles and assessments you create stay in your clone and are gitignored by default. If you fork publicly, keep them out of the fork.
