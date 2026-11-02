---
name: reg-monitor
description: Track DPDP and GDPR regulatory changes, deadlines and their impact on the organisation. Use for "has the law changed", "regulatory update", "upcoming deadlines", "what is in force".
---

# Regulatory Monitor

## Trigger

"regulatory update", "has the law changed", "new DPDP rules", "GDPR update", "regulatory monitoring", "compliance news"

## Purpose

Track regulatory changes across DPDP and GDPR that affect the organisation's compliance programme. Assess impact and recommend updates.

## Sources to monitor

### DPDP (India)

| Source | What to monitor |
|---|---|
| Gazette of India / MeitY | Rules amendments, commencement changes, SDF designations, restricted-country notifications (s.16), Removal of Difficulties orders |
| Data Protection Board of India | Orders, guidance, Consent Manager registrations |
| Parliament (Lok Sabha / Rajya Sabha) | Amendments to DPDP Act |
| Sectoral regulators (RBI, SEBI, IRDAI, TRAI) | Data-related circulars |
| CERT-In | Cybersecurity directions affecting personal data |
| Supreme Court / High Courts | Privacy jurisprudence |

### GDPR (EU/UK)

| Source | What to monitor |
|---|---|
| European Data Protection Board (EDPB) | Guidelines, opinions, consistency decisions |
| Court of Justice of the EU (CJEU) | Rulings on GDPR interpretation |
| European Commission | Adequacy decisions, SCC updates, legislative proposals |
| UK ICO | Guidance, enforcement actions |
| UK Parliament | DUAA 2025 secondary legislation |
| National supervisory authorities | Enforcement actions, sector-specific guidance |

## Impact assessment

When a regulatory change is identified:

1. **Classify**: new obligation / amended obligation / repealed obligation / guidance (non-binding)
2. **Applicability**: does this affect the organisation? Check sector, size, processing activities.
3. **Impact level**: high (requires immediate action) / medium (requires programme update) / low (informational)
4. **Gap analysis**: compare the change against current compliance posture
5. **Recommendation**: specific actions to achieve compliance with the change

## Output

Regulatory alert with:
- Change summary
- Effective date or compliance deadline
- Impact assessment
- Recommended actions
- Updated posture impact (which dimensions change)

## Known dates and pending changes (last verified 2 Nov 2026)

| Date | Change | Status | Impact |
|---|---|---|---|
| 13 Nov 2026 | DPDP Consent Manager regime (Rule 4) | In force from this date | Consent Managers can register; accept their signals |
| 13 May 2027 | DPDP substantive obligations (Rules 3, 5-16, 22, 23) | Scheduled | Notice, consent, security, breach intimation, rights, SDF duties, penalties |
| 13 May 2027 | IT Act s.43A omitted (DPDP s.44(2)) | Scheduled | SPDI Rules 2011 stop applying |
| Pending | Compress the DPDP 18-month phase to 12 months | MeitY consultation, Jan 2026; not gazetted | Could move obligations earlier, especially for SDFs |
| Pending | Restricted-country list under s.16 | Not notified | Cross-border transfer restrictions |
| Ongoing | SDF designations under s.10(1) | Not yet notified | Designated entities gain DPO, DPIA, audit duties |
| 5 Oct 2026 | DPDP (Removal of Difficulties) Order 2026 | Issued | Wording fixes to s.9(1) and s.10(2)(c)(ii); no new duties |
| 31 Jul 2026 | RBI Cybersecurity Directions 2026 | In force | 6-hour incident reporting for banks and NBFCs |
| Pending | CJEU appeal on the EU-US DPF (C-703/25 P, Latombe) | Pending | Could invalidate EU-US transfers again; keep SCCs ready |
| Pending | EU Digital Omnibus (Nov 2025 proposal) | Proposal | RoPA threshold, AI and legitimate interests, cookie rules into GDPR |

Re-verify every row against the source before acting on it.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/reg-monitor` | Check for regulatory updates affecting the organisation |
| `/reg-monitor alert` | Generate a regulatory alert for a specific change |
| `/reg-monitor impact` | Assess impact of a regulatory change on compliance posture |
| `/reg-monitor timeline` | Show upcoming regulatory deadlines and milestones |
