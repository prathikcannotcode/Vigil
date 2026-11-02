# DPDP Regulatory Catalog

## Trigger

"regulatory catalog", "DPDP instruments", "which regulations apply", "regulatory registry", "applicable laws", "DPDP rules reference"

## Purpose

Maintain a registry of regulatory instruments relevant to data privacy in India. Maps each instrument to its issuer, version, applicability, and key obligations. Used by other skills to cite the correct clause and check for updates.

## Instrument Registry

### Primary legislation

| Instrument | Issuer | Status | Key dates |
|---|---|---|---|
| Digital Personal Data Protection Act, 2023 | Parliament of India | Enacted | Assented 11 Aug 2023 |
| Digital Personal Data Protection Rules, 2025 | MeITY / Central Government | Notified | Gazetted 14 Nov 2025 |

### Key DPDP Act sections

| Section | Subject |
|---|---|
| 2 | Definitions (personal data, Data Fiduciary, Data Principal, Data Processor, SDF) |
| 4 | Applicability (digital personal data processed in India, or outside India if offering goods/services to India) |
| 5 | Notice requirements before or at collection |
| 6 | Consent: free, specific, informed, unconditional, unambiguous, clear affirmative action |
| 7 | Certain legitimate uses (without consent) |
| 8 | Obligations of Data Fiduciary (accuracy, security, retention, breach notification) |
| 9 | Children's data (under 18): verifiable parental consent, no tracking/targeting |
| 10 | Significant Data Fiduciary obligations (DPO, DPIA, audit, Indian data processing) |
| 11 | Rights of Data Principal (access) |
| 12 | Rights of Data Principal (correction and erasure) |
| 13 | Grievance redressal (30-day resolution, right to approach DPBI) |
| 14 | Right to nominate |
| 16 | Cross-border transfer (permitted except to restricted countries) |
| 18 | Penalties (up to Rs 250 crore per instance) |
| 19 | Data Protection Board of India (DPBI) establishment and powers |

### Key DPDP Rules 2025

| Rule | Subject |
|---|---|
| 3 | Consent manager registration, dark pattern prohibition |
| 4 | Privacy notice content and language requirements |
| 5 | Consent withdrawal mechanism |
| 7 | Breach notification form and manner |
| 8 | Rights request response timeframe |
| 10 | Verifiable parental consent mechanism for children |
| 12 | SDF designation criteria |
| 13 | DPIA requirements for SDFs |
| 14 | Periodic audit requirements |

### Related Indian instruments

| Instrument | Issuer | Relevance |
|---|---|---|
| Information Technology Act, 2000 (Section 43A, 72A) | Parliament | Data protection provisions (pre-DPDP, partially superseded) |
| CERT-In Directions, 2022 (Section 70B(6)) | CERT-In | 6-hour incident reporting, log retention |
| SEBI CSCRF, 2024 | SEBI | Cybersecurity framework for market participants |
| RBI Cybersecurity Directions, 2026 | RBI | Technology risk for regulated entities |
| IRDAI Cyber Security Guidelines, 2023 | IRDAI | Insurance sector cybersecurity |

### Global frameworks (for cross-border context)

| Instrument | Jurisdiction | Relevance to DPDP |
|---|---|---|
| GDPR (2016/679) | EU | Comparison framework; many orgs subject to both |
| UK GDPR + DUAA 2025 | UK | UK-specific divergence from EU GDPR |
| PDPA 2012 | Singapore | Regional comparison |
| PIPA | South Korea | Regional comparison |
| LGPD | Brazil | Global South comparison |

## Penalty schedule (DPDP Act Section 18)

| Violation | Maximum penalty |
|---|---|
| Non-compliance with children's data provisions (Section 9) | Rs 200 crore |
| Failure to implement security safeguards (Section 8(5)) | Rs 250 crore |
| Failure to notify breach (Section 8(6)) | Rs 200 crore |
| Non-compliance with additional SDF obligations (Section 10) | Rs 150 crore |
| Breach of any other DPDP provision | Rs 50 crore |
| Data Principal breach of duties (Section 15) | Rs 10,000 |

Penalties are per instance. DPBI may impose penalty after inquiry.

## How to use this catalog

1. When assessing an organisation, identify which instruments apply based on jurisdiction, sector, and processing activities.
2. Map each processing activity to the relevant section/rule.
3. Use the section references in findings (e.g., "Section 8(5)" not "security requirements").
4. Check this catalog for updates when the regulatory monitor flags a change.

## Commands

| Command | Action |
|---|---|
| /reg-catalog | Show the full regulatory instrument registry |
| /reg-lookup | Look up a specific section or rule |
| /reg-penalties | Show the penalty schedule |
| /reg-applicability | Determine which instruments apply to an organisation |
