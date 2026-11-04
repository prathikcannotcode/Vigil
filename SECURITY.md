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
- The secret and personal-data patterns catch common formats. They are a tripwire, not a scanner.
- `onFailure: block` needs Claude Code 2.1.295 or newer. On older versions, a hook that cannot start at all does not block the write.
- The hook command runs from `${CLAUDE_PROJECT_DIR}`, the folder a session started in. A session that moves into this repo after starting elsewhere cannot find the guard, so every write is blocked until you start a new session here.

## Your data

Vigil runs locally on your machine and your model provider. It has no server and no telemetry. Company profiles and assessments you create stay in your clone and are gitignored by default. If you fork publicly, keep them out of the fork.
