# DPDP Data Principal Rights Management

## Trigger

"data subject rights", "Data Principal rights", "right to access", "right to erasure", "right to correction", "grievance", "nomination", "rights request"

## Purpose

Handle Data Principal rights requests under DPDP Act 2023: access, correction, erasure, grievance redressal, and nomination. Track requests in an append-only log with SLA enforcement.

## Legal basis

| Right | Reference |
|---|---|
| Right to access information about processing | Section 11(1) |
| Right to correction and erasure | Section 12(1) |
| Right to grievance redressal | Section 13 |
| Right to nominate (in case of death/incapacity) | Section 14 |
| Respond within prescribed timeframe | Rule 8 |
| Grievance must be resolved or responded to within 30 days | Section 13(2) |
| Right to approach DPBI if unsatisfied | Section 13(3) |

## Capabilities

### 1. Rights request intake

When a Data Principal submits a request:
1. Log the request in `company-profile/{id}/rights-log.jsonl`
2. Classify: access / correction / erasure / grievance / nomination
3. Verify identity of the Data Principal
4. Acknowledge receipt within 48 hours
5. Start the SLA clock

### 2. Access requests (Section 11)

Provide the Data Principal with:
- Summary of personal data being processed
- Purposes of processing
- Categories of personal data
- Identity of Data Processors and third parties data has been shared with
- Any other information prescribed by Rules

Format: clear, readable, in a commonly used electronic format.

### 3. Correction and erasure (Section 12)

**Correction:** update inaccurate or incomplete personal data across all systems, including backups where feasible.

**Erasure:** delete personal data when:
- Purpose for which it was collected is no longer being served
- Consent is withdrawn
- Data Principal requests erasure

Exceptions: retention required by law; data needed for legal claims.

Notify all processors and third parties who received the data to correct/erase their copies.

### 4. Grievance redressal (Section 13)

1. Appoint a Grievance Officer (or DPO acts as one)
2. Publish grievance mechanism on the website
3. Acknowledge grievance within 48 hours
4. Investigate and resolve within 30 days (Section 13(2))
5. Communicate outcome with reasons
6. Inform the Data Principal of right to approach DPBI if unsatisfied (Section 13(3))

### 5. Nomination (Section 14)

Allow Data Principals to nominate another person to exercise their rights in case of death or incapacity:
1. Accept nomination through a secure mechanism
2. Verify nominator's identity
3. Record nomination details
4. On trigger event (death/incapacity), allow nominee to exercise rights

### 6. SLA tracking

Track every request against prescribed SLA:
- Acknowledgement: 48 hours
- Grievance resolution: 30 days
- Access/correction/erasure: per Rule 8 timeframe

Flag overdue requests. Report SLA compliance to DPO and Board quarterly.

## Guardrails

- Never refuse a valid request without documenting the legal basis for refusal.
- Never charge a fee for exercising rights under DPDP (no fee provision in the Act).
- Always inform the Data Principal of their right to approach DPBI.
- Log every request, including refused ones, in the append-only rights log.

## Commands

| Command | Action |
|---|---|
| /rights-intake | Log and classify a new rights request |
| /rights-access | Process an access request |
| /rights-correct | Process a correction request |
| /rights-erase | Process an erasure request |
| /rights-grievance | Handle a grievance |
| /rights-sla | Check SLA compliance for open requests |
