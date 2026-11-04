---
name: gdpr-catalog
description: "Reference registry for EU GDPR, UK GDPR and the Data (Use and Access) Act 2025: article map, penalty tiers, transfer mechanisms, recent CJEU and EDPB developments. Use to cite the right article or check UK divergence."
---

# GDPR Regulatory Catalog

## Trigger

"GDPR instruments", "GDPR regulatory registry", "which GDPR articles apply", "UK GDPR reference", "GDPR penalty reference"

## Purpose

Registry of EU GDPR and UK GDPR instruments, key articles, penalty framework, and recent regulatory developments. Reference for all GDPR skills.

## Instrument Registry

### Primary legislation

| Instrument | Jurisdiction | Status |
|---|---|---|
| General Data Protection Regulation (2016/679) | EU/EEA | In force since 25 May 2018 |
| UK GDPR (retained EU law) | UK | In force, amended by DUAA 2025 |
| Data (Use and Access) Act 2025 | UK | Royal Assent 19 Jun 2025 |
| ePrivacy Directive (2002/58/EC) | EU | In force (ePrivacy Regulation withdrawn Feb 2025) |

### GDPR article map

| Articles | Subject |
|---|---|
| 1-4 | Scope, definitions |
| 5 | Principles (lawfulness, purpose limitation, minimisation, accuracy, storage limitation, integrity, accountability) |
| 6 | Lawful basis for processing |
| 7-8 | Consent conditions, children's consent |
| 9-10 | Special categories, criminal data |
| 12-14 | Transparency, information to provide |
| 15-22 | Data subject rights (access, rectification, erasure, restriction, portability, objection, automated decisions) |
| 24-25 | Controller responsibility, privacy by design/default |
| 26 | Joint controllers |
| 28 | Processor obligations and DPA requirements |
| 30 | Records of processing activities |
| 32 | Security of processing |
| 33-34 | Breach notification (72 hours to SA, without undue delay to data subjects) |
| 35-36 | DPIA and prior consultation |
| 37-39 | Data Protection Officer |
| 44-49 | International transfers |
| 77-84 | Remedies, liability, penalties |

### UK GDPR divergence (DUAA 2025)

| Change | Detail |
|---|---|
| Recognised Legitimate Interests | New lawful basis Art. 6(1)(ea): a statutory list (national security, crime prevention, safeguarding, emergencies, public-task disclosures) with no balancing test |
| International transfers | "Not materially lower" protection standard (not "essentially equivalent") |
| Automated decision-making | New Art. 22A-22D: solely automated significant decisions allowed with safeguards (information, human review, contest); stricter where special category data is involved |
| Data subject requests | Searches need only be reasonable and proportionate; the clock stops while awaiting clarification |
| Complaints | Controllers must run a complaints process and acknowledge complaints within 30 days |
| PECR | Some analytics cookies exempt from consent; PECR fines raised to UK GDPR levels |
| DPO | Unchanged. The "Senior Responsible Individual" proposal was in the DPDI Bill, which fell in 2024, and is not in DUAA 2025 |

DUAA provisions commence in stages by regulations. Check commencement for each provision before relying on it.

### Transfer mechanisms

| Mechanism | Status |
|---|---|
| EU adequacy decisions | Commission list (includes the UK, Japan, Korea, Switzerland, Canada for commercial organisations, and the US for DPF-certified organisations since July 2023) |
| EU-US Data Privacy Framework | Valid but CJEU appeal C-703/25 P pending; PCLOB oversight suspended |
| UK adequacy for EU | Renewed Dec 2025, valid through Dec 2031 |
| Standard Contractual Clauses (2021) | Current; new module in development for Art. 3(2) entities |
| Binding Corporate Rules | Art. 47 |

### Penalty framework (Art. 83)

| Tier | Maximum | Violations |
|---|---|---|
| Lower tier | EUR 10M or 2% worldwide turnover | Controller/processor obligations, certification body, monitoring body |
| Upper tier | EUR 20M or 4% worldwide turnover | Principles, lawful basis, consent, data subject rights, international transfers |

### Key regulatory developments (2024-2026)

| Development | Impact |
|---|---|
| EDPB Opinion 28/2024 on AI Models | AI models not automatically anonymous; LI basis possible for training; unlawful training data taints deployment |
| CJEU SRB ruling (pseudonymisation) | Relative personal data: pseudonymised data may not be personal for a specific recipient |
| CJEU Russmedia ruling | Marketplace operators are controllers for special category data in user content |
| CEF 2025 Right to Erasure | Widespread failures in erasure procedures found across EU |
| Digital Omnibus (Nov 2025 proposal) | RoPA threshold 750 employees; AI as LI; cookie rules into GDPR; not yet law |
| EDPB Guidelines 1/2024 on LI | New balancing test guidance replacing WP29 opinion |

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/gdpr-catalog` | Show the full GDPR instrument registry |
| `/gdpr-catalog article` | Look up a specific GDPR article |
| `/gdpr-catalog penalties` | Show the penalty framework |
| `/gdpr-catalog transfers` | Show transfer mechanism status |
| `/gdpr-catalog uk` | Show UK GDPR differences |
