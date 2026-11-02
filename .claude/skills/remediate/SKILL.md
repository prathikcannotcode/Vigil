---
name: remediate
description: Turn audit findings into a remediation plan ranked by penalty exposure, with owners, due dates, code fixes and verification. Use for "remediation plan", "fix findings", "close gaps".
---

# Remediation Workflow

## Trigger

"fix findings", "remediation plan", "address violations", "resolve compliance gaps", "implement fixes"

## Purpose

Turn audit findings into a prioritised remediation plan with owners, deadlines, and verification steps. Tracks progress from finding to closure.

## Workflow

### Step 1: Load findings

Read findings from the most recent assessment or from `company-profile/{id}/posture.json`. Filter to open findings.

### Step 2: Prioritise

Rank by:
1. **Penalty exposure** (`/penalty prioritise`): highest financial risk first
2. **Severity**: critical > high > medium > low
3. **Quick wins**: low-effort fixes that close high-severity findings
4. **Dependencies**: some fixes unblock others (e.g., DPO appointment enables DPIA oversight)

### Step 3: Generate remediation plan

For each finding:
- **Finding ID and description**
- **Regulatory clause** (DPDP section / GDPR article)
- **Remediation action** (specific, actionable)
- **Owner** (role, not person: DPO, Engineering Lead, Legal, CISO), written to the finding's `owner`
- **Deadline** (critical = 7 days, high = 30 days, medium = 90 days, low = next quarter), written to `due_date`. For DPDP readiness gaps, never later than 13 May 2027.
- **Verification**: how to confirm the fix works

### Step 4: Track progress

Update the finding in `assessments/{id}/report.json` (the post-write hook re-validates it):
- `open` -> `in_progress` -> `remediated` (set `remediated_at`) -> verified by re-running the check
- `open` -> `accepted` (risk accepted with justification and Board sign-off)
- `open` -> `disputed` (finding contested with evidence)

### Step 5: Suggest code fixes

For code-related findings (PII in logs, missing encryption, hardcoded data):
- Generate a diff or code suggestion
- Explain what the change does and which clause it addresses
- Note if the fix has side effects to test

### Step 6: Verify

After fixes are applied:
- Re-run the relevant skill (PII scan, GDPR audit, consent audit)
- Confirm the finding no longer appears
- Update posture dashboard

## Output

Remediation plan document with:
- Prioritised finding list
- Action items with owners and deadlines
- Code fix suggestions where applicable
- Verification checklist

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/remediate` | Generate remediation plan from findings |
| `/remediate status` | Check remediation progress |
| `/remediate verify` | Re-run checks to verify fixes |
| `/remediate code` | Generate code fix suggestions |
