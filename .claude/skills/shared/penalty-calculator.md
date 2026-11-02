# Penalty Exposure Calculator

## Trigger

"penalty calculator", "fine exposure", "what's the maximum penalty", "penalty risk", "DPDP penalty", "GDPR fine"

## Purpose

Calculate maximum penalty exposure under DPDP and GDPR based on the organisation's violations, size, and jurisdiction. Helps prioritise remediation by showing financial risk.

## DPDP penalty schedule (Section 18, Schedule)

| Violation | Max penalty per instance |
|---|---|
| Failure to take reasonable security safeguards (Section 8(5)) | Rs 250 crore (~EUR 27M / ~USD 30M) |
| Failure to notify DPBI of breach (Section 8(6)) | Rs 200 crore (~EUR 22M / ~USD 24M) |
| Non-compliance with children's data provisions (Section 9) | Rs 200 crore (~EUR 22M / ~USD 24M) |
| Non-compliance with SDF obligations (Section 10) | Rs 150 crore (~EUR 16M / ~USD 18M) |
| Breach of any other DPDP provision | Rs 50 crore (~EUR 5.5M / ~USD 6M) |
| Data Principal breach of duties (Section 15) | Rs 10,000 (~EUR 1,100 / ~USD 1,200) |

Penalties are per instance. Multiple violations in a single incident can compound.

## GDPR penalty tiers (Art. 83)

### Lower tier: max EUR 10M or 2% worldwide annual turnover (whichever is higher)
- Controller/processor obligations (Art. 8, 11, 25-39, 42, 43)
- Certification body obligations (Art. 42, 43)
- Monitoring body obligations (Art. 41(4))

### Upper tier: max EUR 20M or 4% worldwide annual turnover (whichever is higher)
- Processing principles (Art. 5)
- Lawful basis and consent (Art. 6, 7, 9)
- Data subject rights (Art. 12-22)
- International transfers (Art. 44-49)
- Member State law obligations
- Non-compliance with SA orders

## Calculator

Given an organisation's findings, compute exposure:

### Input
- List of open findings with their DPDP section / GDPR article
- Organisation's worldwide annual turnover (for GDPR %)
- Number of instances per violation type
- Jurisdiction(s): India only, EU only, both

### Calculation

**DPDP exposure:**
For each finding, look up the penalty cap from the schedule. Multiply by instance count. Sum all.

**GDPR exposure:**
For each finding, determine the tier (lower or upper). Take the higher of:
- Fixed amount (EUR 10M or 20M)
- Percentage of turnover (2% or 4%)
Multiply by instance count. Sum all.

**Combined exposure:**
DPDP + GDPR totals. Note that the same incident can attract penalties under both frameworks if the organisation is subject to both.

### Output

```
PENALTY EXPOSURE SUMMARY
========================

DPDP Exposure:
  Security safeguard failures (Section 8(5)): 2 instances x Rs 250 crore = Rs 500 crore
  Children's data violation (Section 9): 1 instance x Rs 200 crore = Rs 200 crore
  Total DPDP: Rs 700 crore

GDPR Exposure (turnover: EUR 50M):
  Consent violation (Art. 7): upper tier = EUR 20M (> 4% of EUR 50M = EUR 2M)
  Security measures (Art. 32): lower tier = EUR 10M (> 2% of EUR 50M = EUR 1M)
  Total GDPR: EUR 30M

Combined maximum: Rs 700 crore + EUR 30M

PRIORITY: Fix children's data and consent violations first (highest penalty per finding).
```

### Caveats
- These are maximum theoretical penalties. Actual fines depend on:
  - Nature, gravity, and duration of the infringement
  - Intentional or negligent character
  - Mitigation measures taken
  - Degree of cooperation with the authority
  - Categories of personal data affected
  - Previous infringements
- DPBI is not yet operational (as of knowledge cutoff); enforcement practice is unknown
- GDPR enforcement varies by supervisory authority

## Commands

| Command | Action |
|---|---|
| /penalty-calc | Calculate penalty exposure from current findings |
| /penalty-dpdp | DPDP-only penalty exposure |
| /penalty-gdpr | GDPR-only penalty exposure |
| /penalty-prioritise | Rank findings by penalty exposure to prioritise remediation |
