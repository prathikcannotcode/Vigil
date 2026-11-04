---
name: gdpr-qa
description: "Answer GDPR and UK GDPR questions with article citations, CJEU and EDPB developments, and UK DUAA 2025 divergence. Use for \"what does GDPR say about\", \"lawful basis\", \"is this allowed under GDPR\"."
---

# GDPR Compliance Q&A

## Trigger

"GDPR question", "is this GDPR compliant", "what does GDPR say about", "data protection question", "lawful basis", "data subject rights GDPR", "DPA question", "cross-border transfer"

## Purpose

Answer GDPR compliance questions with authoritative article citations. Every compliance claim references the specific GDPR article. Adapted for both developers and legal/DPO professionals.

## Response structure

1. Direct answer first
2. Supporting article citation(s)
3. For complex questions: Rule > Article > Exception > Practical implication
4. Flag Member State derogations where relevant
5. Flag UK GDPR/DUAA 2025 divergence where relevant

## Quick reference

| Topic | Articles |
|---|---|
| Definitions | Art. 4 |
| Lawful basis | Art. 6 |
| Special categories | Art. 9-10 |
| Consent | Art. 7-8 |
| Transparency and notices | Art. 12-14 |
| Data subject rights | Art. 15-22 |
| Controller obligations | Art. 24-25, 28-31 |
| Security | Art. 32 |
| Breach notification | Art. 33-34 |
| DPIA | Art. 35-36 |
| DPO | Art. 37-39 |
| International transfers | Art. 44-49 |
| Supervisory authority | Art. 51-59 |
| Remedies and penalties | Art. 77-84 |

## Key regulatory updates (material for 2024-2026)

- **EDPB Opinion 28/2024 on AI Models:** AI models are not automatically anonymous; legitimate interests can be lawful basis for AI training; unlawful training data can taint deployment.
- **CJEU SRB ruling on pseudonymisation:** pseudonymised data may not be personal in the hands of a specific recipient ("relative personal data").
- **CJEU Russmedia ruling:** online marketplace operators are controllers for special category data in user-generated content.
- **UK Data (Use and Access) Act 2025:** Recognised Legitimate Interests (statutory list without balancing test), "not materially lower" transfer standard, new Art. 22A-22D on automated decisions, proportionate DSAR searches, mandatory complaints handling. The DPO role is unchanged: the Senior Responsible Individual idea died with the DPDI Bill.
- **EU-US Data Privacy Framework:** valid but CJEU appeal (C-703/25 P) registered, PCLOB oversight suspended. Maintain SCC fallback.
- **ePrivacy Regulation withdrawn Feb 2025:** Digital Omnibus proposes folding cookie rules into GDPR (still a proposal).
- **CEF 2025 Right to Erasure:** coordinated enforcement found widespread failures in erasure procedures.

## Escalation

For high-stakes matters (fines risk, special category data, cross-border enforcement, employee monitoring, children's data, AI training on personal data), always include:

> This guidance is informational and based on the GDPR text and established regulatory guidance. It does not constitute legal advice. For matters involving significant compliance risk, consult a qualified data protection lawyer or your DPO.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/gdpr-qa` | Answer a GDPR compliance question |
| `/gdpr-qa basis` | Determine the appropriate lawful basis |
| `/gdpr-qa rights` | Explain data subject rights for a scenario |
| `/gdpr-qa updates` | Summarise recent regulatory developments |
