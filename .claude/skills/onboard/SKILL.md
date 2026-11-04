---
name: onboard
description: "Onboard an organisation into Vigil: gather details, write the company profile, detect which frameworks apply, take a first posture snapshot and recommend next steps. Use for \"add my company\", \"set up company profile\", \"onboard\"."
---

# Organisation Onboarding Workflow

## Trigger

"add my company", "onboard organisation", "set up company profile", "new company", "register organisation"

## Purpose

Set up a new organisation in Vigil. Creates the company profile, identifies applicable frameworks, and runs an initial assessment.

## Workflow

### Step 1: Gather organisation details

Ask for:
1. Organisation name and legal name
2. Registered address and jurisdiction(s)
3. Industry sector (fintech, healthtech, edtech, SaaS, e-commerce, other)
4. Approximate number of users/customers, and worldwide annual turnover in euros if known (for the GDPR Art. 83 percentage caps)
5. Does it process data of individuals in India? (DPDP applicability)
6. Does it process data of individuals in the EU/UK? (GDPR applicability)
7. Is it designated as a Significant Data Fiduciary? (or likely to be)
8. Does it process children's data?
9. Does it process health, biometric, or other sensitive data?
10. If financial: is it an RBI-regulated entity (bank, NBFC), a lending service provider to one, or neither?

If nobody can answer (a headless run, a side session, material with gaps), take what you can from the material and carry on. Do not stop to wait. Record each gap this way:

| Field | When unknown |
|---|---|
| `legal_name` (required) | Best known name plus "(registered legal name unknown)" |
| `registered_address` | `"unknown"` |
| `approx_users`, `annual_turnover_eur` | Leave out. Never `0` |
| `sdf_status` | `"unknown"` |
| `processes_children_data`, `processes_sensitive_data` | Leave out. Never `false` as a guess |
| `dpo` | Leave out. `null` means none is appointed |

### Step 2: Create company profile

Write `company-profile/{company_id}/details.json`:
```json
{
  "id": "<slug>",
  "legal_name": "",
  "registered_address": "",
  "approx_users": 0,
  "annual_turnover_eur": 0,
  "jurisdiction": [],
  "sector": "",
  "frameworks": ["DPDP", "GDPR"],
  "sdf_status": "not_designated | designated | likely | unknown",
  "processes_children_data": false,
  "processes_sensitive_data": false,
  "created_at": ""
}
```

### Step 3: Determine applicable frameworks

Based on the answers:
- India data processing? -> DPDP Act + Rules
- EU/UK data processing? -> GDPR (and/or UK GDPR)
- Financial sector? -> Add `RBI`, `SEBI` or `IRDAI` to `frameworks` only for the regulator that applies. A regulated lender or its lending service provider gets `RBI`. If that is unknown, leave it out and list it as an unknown; `/audit` still runs its sector check
- Health sector? -> Special category handling, DPIA required
- Children's data? -> DPDP s.9 and Rule 10, GDPR Art. 8
- SDF? -> DPO, DPIA, audit obligations

### Step 4: Initial posture assessment

Run the posture dashboard skill with the information gathered:
- Which governance structures exist?
- Is there a DPO?
- Is there a published privacy policy?
- Are there consent mechanisms?
- Are there breach response procedures?

Output: initial `posture.json`. Set a dimension to `not_assessed` unless you were given evidence for it, which on a first run means most of them.

### Step 5: Recommend next steps

Based on gaps:
1. If no DPO: recommend DPO governance setup
2. If no privacy policy: recommend document drafting
3. If no consent mechanism: recommend consent management setup
4. If applicable: recommend DPIA
5. Always: recommend a full PII scan of connected codebases
6. Always: list every unknown from Step 1, so `/audit` or a person can fill it in

## Output

- `company-profile/{company_id}/details.json`
- `company-profile/{company_id}/posture.json`
- Recommended action plan in chat

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/onboard` | Start organisation onboarding |
| `/onboard status` | Check onboarding completion status |
