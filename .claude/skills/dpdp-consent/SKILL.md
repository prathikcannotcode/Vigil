---
name: dpdp-consent
description: "DPDP consent lifecycle: notices (s.5, Rule 3), valid consent (s.6), withdrawal, Consent Managers (Rule 4), dark-pattern review, and verifiable parental consent (s.9, Rule 10). Use for \"consent notice\", \"consent audit\", \"withdraw consent\", \"dark patterns\", \"children's consent\"."
---

# DPDP Consent Management

## Trigger

"consent management", "consent notice", "withdraw consent", "DPDP consent", "notice requirements", "consent audit", "dark patterns", "consent manager"

## Purpose

Manage the full consent lifecycle under the DPDP Act 2023 and Rules 2025: notice, collection, recording, withdrawal and audit. Consent must be free, specific, informed, unconditional and unambiguous, given by a clear affirmative action, and limited to the personal data necessary for the specified purpose (s.6(1)). Any part of a consent that infringes the Act is invalid to that extent (s.6(2)).

DPDP has no legitimate-interests ground. Processing needs consent (s.6) or one of the closed list of legitimate uses in s.7. Check `/dpdp-catalog` for commencement: notice and consent obligations apply from 13 May 2027; Consent Manager rules from 13 Nov 2026.

## Legal basis

| Requirement | Reference |
|---|---|
| Notice with or before the request for consent: data, purpose, how to exercise rights, how to complain to the Board | s.5(1) |
| Notice for consent given before the Act commenced, as soon as reasonably practicable | s.5(2) |
| Option to read the notice in English or any Eighth Schedule language | s.5(3) |
| Notice is standalone, plain language, itemised data and purpose, with a withdrawal link | Rule 3 |
| Valid consent: free, specific, informed, unconditional, unambiguous, clear affirmative action | s.6(1) |
| Consent request in clear and plain language, with DPO or contact details | s.6(3) |
| Withdraw at any time, with ease comparable to giving consent | s.6(4) |
| Stop processing (and have processors stop) within a reasonable time after withdrawal | s.6(6) |
| Consent Managers: registered with the Board, interoperable platform | s.6(7)-(9), Rule 4 |
| Data Fiduciary must prove notice and consent were given | s.6(10) |
| Children (under 18): verifiable consent of a parent or lawful guardian | s.9(1), Rule 10 |
| No tracking, behavioural monitoring or targeted advertising directed at children | s.9(3) |
| Dark patterns in consumer interfaces | CCPA Guidelines for Prevention and Regulation of Dark Patterns, 2023 |

## Capabilities

### 1. Privacy notice drafting

Given the organisation's processing activities, draft a notice that:
1. Stands alone, separate from terms of service (Rule 3(a))
2. Gives an itemised description of the personal data and the specified purpose for each item (Rule 3(b))
3. Explains how to withdraw consent, with a link or option as easy as the one used to give it (Rule 3(c)(i))
4. Explains how to exercise rights under the Act and how to complain to the Data Protection Board (s.5(1), Rule 3(c))
5. Names the DPO or contact person (s.6(3), Rule 9)

Plain language. Offer English and Hindi at minimum, and the option of any Eighth Schedule language on request (s.5(3)). Templates live in `examples/consent-notices/`.

Output: notice document with [PLACEHOLDER] markers for organisation details.

### 2. Consent record management

For each consent event, record:
- Data Principal identifier (pseudonymised)
- Purpose consented to
- Timestamp of consent
- Version of the notice shown
- Method of collection (checkbox, toggle, signed form, Consent Manager)
- Consent Manager reference, if any
- Withdrawal timestamp (if withdrawn)

Save records to `company-profile/{id}/consent-records/` and validate against `.claude/schemas/consent-record.schema.json`. These records are the evidence s.6(10) puts the burden on you to produce.

### 3. Consent withdrawal

When a Data Principal withdraws consent:
1. Record the withdrawal timestamp
2. Stop processing for that purpose within a reasonable time, and make processors stop too (s.6(6))
3. Erase data held only on that consent unless law requires retention (s.8(7))
4. Confirm the withdrawal to the Data Principal

Withdrawal must be as easy as giving consent (s.6(4)). One click to give means one click to withdraw. Withdrawal does not make earlier processing unlawful (s.6(5)).

### 4. Consent Managers (from 13 Nov 2026)

If the organisation receives consent through a registered Consent Manager:
- Verify the Consent Manager's registration with the Board (Rule 4, First Schedule)
- Accept consent, review and withdrawal signals from the Consent Manager platform
- Record the Consent Manager reference against the consent record

### 5. Dark pattern audit

Review consent interfaces for patterns that defeat "free" and "unambiguous" consent (s.6(1)) and those listed in the CCPA Dark Patterns Guidelines 2023:
- Pre-ticked boxes
- Consent bundled with terms of service
- "Accept all" prominent, "Reject" hidden or absent
- Confirm-shaming copy ("No, I don't care about my security")
- Asymmetric choices (large Accept button, small Reject link)
- Forced action (service gated on non-essential consent)
- Nagging or repeated prompts after refusal
- Trick questions and double negatives

Flag each instance with severity and remediation.

### 6. Children's consent

For processing personal data of anyone under 18:
1. Verify a parental or guardian consent mechanism exists and that it is verifiable (s.9(1), Rule 10: reliable identity and age details, or a virtual token from an authorised entity such as DigiLocker)
2. Verify no tracking, behavioural monitoring or targeted advertising directed at children (s.9(3))
3. Verify no processing likely to cause a detrimental effect on the child's well-being (s.9(2))
4. Check whether a Fourth Schedule exemption applies (s.9(4), Rule 12), and record which one

## Guardrails

- Never treat bundled consent as valid. Each purpose needs its own consent.
- Never design a consent flow where withdrawal is harder than collection.
- Never claim a legitimate-interests basis under DPDP. If s.7 does not cover it, it needs consent.
- Always flag dark patterns as high severity.
- Always require verifiable parental consent for children's data.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/dpdp-consent notice` | Draft a DPDP-compliant privacy notice |
| `/dpdp-consent audit` | Audit consent collection practices |
| `/dpdp-consent withdraw` | Process a consent withdrawal |
| `/dpdp-consent dark-patterns` | Review interface for dark patterns |
| `/dpdp-consent children` | Review children's consent mechanism |
