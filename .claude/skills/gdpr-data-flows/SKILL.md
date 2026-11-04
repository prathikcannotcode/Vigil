---
name: gdpr-data-flows
description: "Map personal data flows and check them against the Record of Processing Activities (Art. 30), lawful basis, processors and transfers. Use for \"data mapping\", \"RoPA\", \"where does personal data go\", \"data inventory\"."
---

# GDPR Data Flow and PII Review

## Trigger

"data flow review", "data mapping", "PII review", "record of processing", "RoPA", "data inventory GDPR", "where does personal data go"

## Purpose

Review data flows, data mapping, and PII handling practices for GDPR compliance. Map how personal data moves through systems and verify each flow has proper documentation, lawful basis, and safeguards.

## Data flow analysis

For each data flow, evaluate:

1. **What** personal data moves (Art. 4(1))
2. **Why**: purpose and lawful basis (Art. 5(1)(b), Art. 6)
3. **Where**: source > processor(s) > destination, including third countries
4. **Who** has access: roles, contractors, sub-processors (Art. 28(2))
5. **How long** it is retained (Art. 5(1)(e))
6. **How** it is protected in transit and at rest (Art. 32)

## RoPA alignment (Art. 30)

Check whether each data flow is captured in a Record of Processing Activities:

- Controller name and contact details (Art. 30(1)(a))
- Purposes of processing (Art. 30(1)(b))
- Categories of data subjects and personal data (Art. 30(1)(c))
- Recipients including processors (Art. 30(1)(d))
- Third-country transfers and safeguards (Art. 30(1)(e))
- Retention periods (Art. 30(1)(f))
- Security measures description (Art. 30(1)(g))

## PII handling checklist

For each system or service:

- [ ] Data classified by sensitivity (ordinary vs. special category)
- [ ] Collection limited to stated purpose (Art. 5(1)(b)-(c))
- [ ] Consent or other lawful basis recorded (Art. 7(1))
- [ ] Data subject rights mechanism in place (Art. 15-22)
- [ ] Processor contracts (DPAs) in place for all third parties (Art. 28)
- [ ] International transfer mechanism documented (Art. 44-49)
- [ ] Retention schedule defined and enforced (Art. 5(1)(e))
- [ ] Breach response procedure documented (Art. 33-34)
- [ ] DPIA conducted if high risk (Art. 35)

## Output

Data flow map: a structured representation showing each flow with its lawful basis, safeguards, and gaps. Findings for gaps follow `.claude/schemas/finding.schema.json`.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/gdpr-data-flows map` | Map personal data flows through a system |
| `/gdpr-data-flows ropa` | Verify RoPA completeness against actual processing |
| `/gdpr-data-flows checklist` | Run the PII handling checklist |
