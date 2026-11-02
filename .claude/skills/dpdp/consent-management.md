# DPDP Consent Management

## Trigger

"consent management", "consent notice", "withdraw consent", "DPDP consent", "notice requirements", "consent audit", "dark patterns"

## Purpose

Manage the full consent lifecycle under DPDP Act 2023: collection, notice, recording, withdrawal, and audit. Consent under DPDP must be free, specific, informed, unconditional, unambiguous, and with clear affirmative action (Section 6).

## Legal basis

| Requirement | Reference |
|---|---|
| Consent: free, specific, informed, unconditional, unambiguous, clear affirmative action | Section 6(1)-(2) |
| Itemised consent for each purpose | Section 6(3) |
| Consent withdrawal must be as easy as giving consent | Section 6(6) |
| Privacy notice before or at point of collection | Section 5(1) |
| Notice must state: purposes, data types, rights, grievance mechanism | Section 5(1)(a)-(d) |
| Notice in English and 22 scheduled languages | Section 5(2) |
| No dark patterns in consent interfaces | Section 6, Rule 3 |
| Parental/guardian consent for children (under 18) | Section 9 |
| Verifiable parental consent mechanism | Rule 10 |

## Capabilities

### 1. Privacy notice drafting

Given an organisation's processing activities, draft a DPDP-compliant notice covering:
1. Identity and contact details of the Data Fiduciary
2. Personal data being collected and purposes for each
3. Rights of the Data Principal (access, correction, erasure, grievance, nomination)
4. Grievance mechanism and contact details
5. How to withdraw consent

The notice must be in plain language. Offer versions in English and Hindi at minimum.

Output: Privacy notice document with [PLACEHOLDER] markers for org-specific details.

### 2. Consent record management

For each consent event, record:
- Data Principal identifier (pseudonymised)
- Purpose consented to
- Timestamp of consent
- Version of the notice shown
- Method of collection (checkbox, toggle, signed form)
- Withdrawal timestamp (if withdrawn)

Validate records against `.claude/schemas/consent-record.schema.json`.

### 3. Consent withdrawal

When a Data Principal withdraws consent:
1. Record withdrawal timestamp
2. Cease processing for that purpose within the timeframe specified in the notice
3. Trigger data erasure workflow for data held solely on that consent basis
4. Notify processors/third parties who received the data
5. Confirm withdrawal to the Data Principal

Withdrawal must be as easy as giving consent (Section 6(6)). If consent was a single click, withdrawal must be too.

### 4. Dark pattern audit

Review consent interfaces for dark patterns (Rule 3):
- Pre-ticked boxes
- Consent bundled with terms of service
- "Accept all" prominent, "Reject" hidden or absent
- Confusing double negatives
- Asymmetric choices (large Accept button, tiny Reject link)
- Forced consent (service gated on non-essential consent)
- Nagging or repeated prompts after refusal

Flag each instance with severity and remediation.

### 5. Children's consent

For processing children's data (under 18):
1. Verify that parental/guardian consent mechanism exists
2. Check that consent is verifiable (Rule 10)
3. Verify no behavioural tracking or targeted advertising directed at children (Section 9(3))
4. Ensure no processing detrimental to the child's well-being

## Guardrails

- Never treat bundled consent as valid. Each purpose needs its own consent.
- Never design a consent flow where withdrawal is harder than collection.
- Always flag dark patterns as high severity.
- Always require verifiable parental consent for children's data.

## Commands

| Command | Action |
|---|---|
| /consent-notice | Draft a DPDP-compliant privacy notice |
| /consent-audit | Audit consent collection practices |
| /consent-withdraw | Process a consent withdrawal |
| /dark-pattern-check | Review interface for dark patterns |
| /child-consent | Review children's consent mechanism |
