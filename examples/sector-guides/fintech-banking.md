# Sector Guide: Fintech and Banking

> Background for an audit. Sector counsel has not reviewed this guide, and nothing in Vigil validates the sector instruments it names. A finding cites the DPDP or GDPR clause that carries the duty and names the sector rule in `cross_reference`. A duty with no such clause goes in the assessment summary.

## Applicable frameworks

| Framework | Why it applies |
|---|---|
| DPDP Act 2023 + Rules 2025 | Any entity processing personal data in India |
| RBI Cybersecurity Directions, 2026 | Banks, NBFCs, payment system operators |
| RBI Outsourcing Directions, 2025 | Outsourcing of IT services by regulated entities |
| SEBI CSCRF, 2024 | Brokers, depositories, market infrastructure |
| CERT-In Directions, 2022 | All entities (6-hour incident reporting) |
| GDPR | If serving EU/UK customers or processing EU personal data |
| PCI DSS 4.0.1 | If handling card payment data |

## Key data types in fintech

| Data type | Classification | Special handling |
|---|---|---|
| KYC data (Aadhaar, PAN, passport) | Government ID, personal data | Aadhaar Act restrictions apply; never store Aadhaar number in plain text |
| Bank account and card numbers | Financial personal data | PCI DSS scope; tokenise or mask |
| Transaction history | Personal data | Retention per RBI/SEBI requirements |
| Credit scores and reports | Personal data | Purpose limitation: only for credit assessment |
| Biometric (fingerprint, face for KYC) | Special category (GDPR) / personal data (DPDP) | Encrypt, limit retention, explicit consent |
| UPI IDs | Personal data | Can identify individuals; treat as PII |
| Location data (from mobile banking) | Personal data | Consent for collection; minimise precision |

## Fintech-specific DPDP obligations

### Significant Data Fiduciary (SDF) designation
Banks, NBFCs, and large fintechs processing high volumes of financial data are likely to be designated as SDFs under DPDP Section 10. SDF obligations:
- Appoint a DPO based in India (Section 10(2)(a))
- Appoint an independent data auditor (Section 10(2)(b))
- Conduct a DPIA and data audit every 12 months (Section 10(2)(c), Rule 13)
- Process certain categories of data only in India

### Consent in financial services
- KYC: lawful basis is usually legal obligation (RBI KYC directions), not consent
- Marketing and cross-selling: requires explicit consent, separate from service consent
- Data sharing with credit bureaus: governed by Credit Information Companies Act
- Account aggregator framework: consent artefact per RBI AA framework

### Breach notification
- DPDP: notify DPBI per Rule 7
- RBI: notify RBI within 6 hours (cyber incident)
- CERT-In: notify within 6 hours
- SEBI: notify within 6 hours (for market participants)
- PCI DSS: notify card brands per PCI incident response plan

Multiple parallel notifications may be required for a single breach.

### Cross-border transfers
- DPDP Section 16: transfers permitted except to restricted countries
- RBI data localisation: payment system data must be stored in India (RBI circular 2018, reinforced 2024)
- SEBI: certain data must remain in India
- GDPR: adequacy decision, SCCs, or BCRs required for EU data

### Retention
- KYC records: 5 years after business relationship ends (RBI)
- Transaction records: 10 years (RBI for banks)
- Audit trail: as per SEBI/RBI retention schedule
- Balance with DPDP erasure rights: statutory retention overrides erasure requests

## Checklist for fintech companies

- [ ] Identify all personal data in your systems (PII scan)
- [ ] Map data flows including third-party integrations
- [ ] Assess SDF designation likelihood
- [ ] Appoint DPO if SDF or proactively
- [ ] Implement consent management for optional processing (marketing, cross-sell)
- [ ] Ensure KYC data is processed under legal obligation basis
- [ ] Review payment data handling against PCI DSS
- [ ] Verify RBI data localisation compliance
- [ ] Set up parallel breach notification to DPBI, RBI, CERT-In
- [ ] Document retention periods per regulator
- [ ] If serving EU customers: full GDPR compliance stack
