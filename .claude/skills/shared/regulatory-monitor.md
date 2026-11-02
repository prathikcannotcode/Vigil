# Regulatory Monitor

## Trigger

"regulatory update", "has the law changed", "new DPDP rules", "GDPR update", "regulatory monitoring", "compliance news"

## Purpose

Track regulatory changes across DPDP and GDPR that affect the organisation's compliance programme. Assess impact and recommend updates.

## Sources to monitor

### DPDP (India)

| Source | What to monitor |
|---|---|
| MeITY Official Gazette | DPDP Rules amendments, SDF designations, permissible country list |
| DPBI (when constituted) | Orders, guidance notes, circulars |
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

## Known upcoming changes (as of knowledge cutoff)

| Change | Status | Expected impact |
|---|---|---|
| DPBI constitution and operationalisation | Pending | Enforcement begins; complaint mechanism active |
| DPDP permissible countries list | Pending | Cross-border transfer restrictions |
| SDF designation notifications | Ongoing | New organisations gain SDF obligations |
| EU Digital Omnibus | Proposal (Nov 2025) | RoPA threshold, AI as LI, cookie rules |
| CJEU DPF appeal (C-703/25 P) | Pending | Could invalidate EU-US transfers again |
| ePrivacy Regulation | Withdrawn (folding into GDPR via Omnibus) | Cookie consent rules may change |

## Commands

| Command | Action |
|---|---|
| /reg-monitor | Check for regulatory updates affecting the organisation |
| /reg-alert | Generate a regulatory alert for a specific change |
| /reg-impact | Assess impact of a regulatory change on compliance posture |
| /reg-timeline | Show upcoming regulatory deadlines and milestones |
