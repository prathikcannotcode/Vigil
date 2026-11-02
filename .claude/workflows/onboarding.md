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
4. Approximate number of users/customers
5. Does it process data of individuals in India? (DPDP applicability)
6. Does it process data of individuals in the EU/UK? (GDPR applicability)
7. Is it designated as a Significant Data Fiduciary? (or likely to be)
8. Does it process children's data?
9. Does it process health, biometric, or other sensitive data?

### Step 2: Create company profile

Write `company-profile/{company_id}/details.json`:
```json
{
  "id": "<slug>",
  "legal_name": "",
  "jurisdiction": [],
  "sector": "",
  "frameworks": ["DPDP", "GDPR"],
  "sdf_status": "not_designated | designated | likely",
  "processes_children_data": false,
  "processes_sensitive_data": false,
  "created_at": ""
}
```

### Step 3: Determine applicable frameworks

Based on the answers:
- India data processing? -> DPDP Act + Rules
- EU/UK data processing? -> GDPR (and/or UK GDPR)
- Financial sector? -> Add RBI/SEBI/IRDAI obligations
- Health sector? -> Special category handling, DPIA required
- Children's data? -> DPDP Section 9, GDPR Art. 8
- SDF? -> DPO, DPIA, audit obligations

### Step 4: Initial posture assessment

Run the posture dashboard skill with the information gathered:
- Which governance structures exist?
- Is there a DPO?
- Is there a published privacy policy?
- Are there consent mechanisms?
- Are there breach response procedures?

Output: initial `posture.json` (mostly "not assessed" on first run).

### Step 5: Recommend next steps

Based on gaps:
1. If no DPO: recommend DPO governance setup
2. If no privacy policy: recommend document drafting
3. If no consent mechanism: recommend consent management setup
4. If applicable: recommend DPIA
5. Always: recommend a full PII scan of connected codebases

## Output

- `company-profile/{company_id}/details.json`
- `company-profile/{company_id}/posture.json`
- Recommended action plan in chat

## Commands

| Command | Action |
|---|---|
| /onboard | Start organisation onboarding |
| /onboard-status | Check onboarding completion status |
