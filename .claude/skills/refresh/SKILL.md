---
name: refresh
description: Periodic re-assessment: regulatory changes, PII re-scan, data map and consent drift, and a before/after posture comparison. Use for "refresh context", "what changed", "re-assess", "quarterly review".
---

# Context Refresh Workflow

## Trigger

"refresh context", "update company profile", "what changed", "re-assess", "update posture"

## Purpose

Refresh the organisation's compliance context: re-scan for personal data, update the data map, check for regulatory changes, and update the posture dashboard. Run periodically or after significant changes.

## Workflow

### Step 1: Regulatory check

Run the regulatory monitor to identify any changes since the last assessment.

### Step 2: Re-scan for personal data

Run the PII scanner on connected codebases to identify new personal data.

### Step 3: Update data map

Compare the new PII scan results against the existing data map. Flag:
- New data types not previously mapped
- Data flows that no longer exist
- Changes in third-party processors

### Step 4: Re-assess consent

Check if any consent notices need updating due to:
- New processing purposes
- New data types collected
- Regulatory changes affecting consent requirements
- Changes in third-party sharing

### Step 5: Update posture

Re-run the posture dashboard with the updated context. Compare against the previous posture to show what improved and what regressed.

### Step 6: Report

Generate a context refresh report:
- Regulatory changes since last assessment
- New personal data identified
- Data map changes
- Consent notices needing update
- Posture comparison (before vs. after)
- Recommended actions

## Frequency

- Minimum: quarterly
- Recommended: after any significant code deployment, vendor change, or regulatory update
- Required: after any data breach

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/refresh` | Run full context refresh |
| `/refresh reg` | Regulatory changes only |
| `/refresh data` | Re-scan PII and update data map |
| `/refresh posture` | Update posture dashboard only |
