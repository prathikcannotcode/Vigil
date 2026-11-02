---
name: posture
description: Unified DPDP and GDPR compliance posture across six dimensions, saved as a posture snapshot. Use for "compliance posture", "how compliant are we", "privacy health check", "gaps".
---

# Privacy Compliance Posture Dashboard

## Trigger

"compliance posture", "privacy status", "how compliant are we", "posture dashboard", "compliance score", "privacy health check"

## Purpose

Generate a unified compliance posture view across DPDP and GDPR. Shows what's covered, what's missing, and what needs attention, in one snapshot.

## Posture dimensions

### 1. Governance
- DPO appointed and registered (DPDP Section 10(2)(a) / GDPR Art. 37)
- Privacy policy published and current
- Board reporting in place
- Training programme active

### 2. Lawful processing
- All processing activities have a documented lawful basis
- Consent records maintained where consent is the basis
- Legitimate interest assessments documented (GDPR Art. 6(1)(f))
- Purpose limitation verified

### 3. Data Principal / Subject rights
- Rights request mechanism published
- SLA compliance for open requests
- Grievance redressal mechanism active (DPDP Section 13)

### 4. Security
- Encryption at rest and in transit
- Access controls with least privilege
- Breach detection and response capability
- DPIA completed for high-risk processing

### 5. Third parties
- DPAs in place for all processors
- Vendor risk assessments current
- Cross-border transfer mechanisms documented

### 6. Retention
- Retention schedule defined per purpose
- Deletion/anonymisation mechanism operational
- Backups included in retention policy

## Scoring

Each dimension: compliant (green), partially compliant (amber), non-compliant (red), not assessed (grey).

Overall posture: the lowest-scoring dimension sets the ceiling. One red dimension means overall red.

## Dual-framework view

For organisations subject to both DPDP and GDPR, show each dimension's status per framework:

```
| Dimension | DPDP | GDPR | Notes |
|---|---|---|---|
| Governance | green | amber | No DPO registered with supervisory authority |
| Lawful processing | green | green | |
| Rights | amber | green | DPDP grievance SLA overdue for 2 requests |
| Security | green | green | |
| Third parties | red | amber | Missing DPAs for 3 vendors |
| Retention | grey | amber | DPDP retention not assessed |
```

Output: posture snapshot saved to `company-profile/{id}/posture.json`.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/posture` | Generate compliance posture dashboard |
| `/posture dpdp` | DPDP-only posture view |
| `/posture gdpr` | GDPR-only posture view |
| `/posture gaps` | List gaps across both frameworks |
