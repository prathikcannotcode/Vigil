---
name: penalty
description: "Maximum penalty exposure under the DPDP Schedule (s.33) and GDPR Art. 83 for open findings, ranked to prioritise remediation. Use for \"penalty exposure\", \"fine risk\", \"what is the maximum penalty\"."
---

# Penalty Exposure Calculator

## Trigger

"penalty calculator", "fine exposure", "what's the maximum penalty", "penalty risk", "DPDP penalty", "GDPR fine"

## Purpose

Calculate maximum penalty exposure under DPDP and GDPR based on the organisation's violations, size, and jurisdiction. Helps prioritise remediation by showing financial risk.

## DPDP penalty Schedule (s.33 and the Schedule)

| Breach | Penalty may extend to |
|---|---|
| Failure to take reasonable security safeguards (s.8(5)) | Rs 250 crore |
| Failure to intimate the Board or affected Data Principals of a breach (s.8(6)) | Rs 200 crore |
| Additional obligations for children (s.9) | Rs 200 crore |
| Additional obligations of a Significant Data Fiduciary (s.10) | Rs 150 crore |
| Data Principal duties (s.15) | Rs 10,000 |
| Breach of a voluntary undertaking (s.32) | Up to the amount for the original breach |
| Any other provision of the Act or Rules | Rs 50 crore |

Caps are fixed rupee amounts per breach the Board finds after an inquiry (s.33(1)). There is no turnover percentage. These obligations apply from 13 May 2027; until then, report DPDP exposure as prospective.

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
- Organisation's worldwide annual turnover (for GDPR %), from `annual_turnover_eur` in `details.json`. If it is missing, say the fixed caps are a floor.
- Number of instances per violation type
- Jurisdiction(s): India only, EU only, both

### Calculation

**DPDP exposure:**
For each distinct breach (finding), look up the Schedule cap. Breaches of different provisions add up; the same provision breached in separate incidents can attract separate penalties. Report two totals: per finding (sum every finding's cap) and per provision (count each Schedule entry once). The per-finding total grows with how finely the audit split its findings, so never show it alone. Label both "maximum theoretical": s.33(2) requires the Board to weigh proportionality.

**GDPR exposure:**
For each finding, determine the tier: Art. 83(4) (lower) or Art. 83(5)-(6) (upper). The cap is the higher of the fixed amount (EUR 10M or 20M) and the turnover percentage (2% or 4% of total worldwide annual turnover of the preceding year).

Group findings by processing operation. Under Art. 83(3), infringements arising from the same or linked processing operations are capped at the amount for the gravest one, so take the highest cap per group, not the sum. Unrelated processing operations add up.

**Combined exposure:**
Report DPDP (INR) and GDPR (EUR) separately; never convert and add. The same incident can attract penalties under both frameworks.

### Output

```
PENALTY EXPOSURE SUMMARY
========================

DPDP exposure (prospective until 13 May 2027):
  F-0001 Security safeguards, s.8(5) ................. Rs 250 crore
  F-0004 Children's data, s.9(3) ..................... Rs 200 crore
  Maximum theoretical, per finding ................... Rs 450 crore
  Maximum theoretical, per provision ................. Rs 450 crore

GDPR exposure (turnover: EUR 50M):
  Checkout processing (linked: F-0002 Art. 7, F-0003 Art. 32)
    gravest = Art. 7, upper tier: max(EUR 20M, 4% x 50M) = EUR 20M
  Marketing analytics (F-0005 Art. 6(1))
    upper tier: EUR 20M
  Maximum theoretical total .......................... EUR 40M

PRIORITY: F-0001 and F-0004 (highest DPDP caps), then F-0002 (gravest GDPR group).
```

### Caveats
- These are maximum theoretical penalties. Actual fines depend on:
  - Nature, gravity, and duration of the infringement
  - Intentional or negligent character
  - Mitigation measures taken
  - Degree of cooperation with the authority
  - Categories of personal data affected
  - Previous infringements
- The Data Protection Board has no published enforcement record yet; DPDP fines in practice are unknown
- Penalties attach only to obligations in force (see `/dpdp-catalog` commencement table)
- GDPR enforcement varies by supervisory authority

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/penalty` | Calculate penalty exposure from current findings |
| `/penalty dpdp` | DPDP-only penalty exposure |
| `/penalty gdpr` | GDPR-only penalty exposure |
| `/penalty prioritise` | Rank findings by penalty exposure to prioritise remediation |
