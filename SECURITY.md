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

- Hooks guard Claude Code's Write, Edit and MultiEdit tools. A shell command run through the Bash tool is not intercepted; keep Bash permissions narrow (`.claude/settings.json` allows only the validate and test commands by default).
- The secret patterns catch common key formats. They are a tripwire, not a scanner.

## Your data

Vigil runs locally on your machine and your model provider. It has no server and no telemetry. Company profiles you create stay in your clone. If you fork publicly, keep real company profiles out of the fork.
