---
name: dpdp-rights
description: "Data Principal rights under DPDP ss.11-14 and Rule 14: access, correction and erasure, grievance redressal (90-day ceiling), nomination, with an append-only rights log and SLA tracking. Use for \"rights request\", \"right to erasure\", \"grievance\", \"nomination\", \"DSAR\"."
---

# DPDP Data Principal Rights Management

## Trigger

"data subject rights", "Data Principal rights", "right to access", "right to erasure", "right to correction", "grievance", "nomination", "rights request", "DSAR"

## Purpose

Handle Data Principal rights requests under the DPDP Act 2023 and Rules 2025: access, correction and erasure, grievance redressal, and nomination. Track every request in an append-only log with SLA tracking. Rights obligations apply from 13 May 2027.

## Legal basis

| Right or duty | Reference |
|---|---|
| Access: summary of personal data and processing activities | s.11(1)(a) |
| Access: identities of other Data Fiduciaries and Processors it was shared with, and what was shared | s.11(1)(b) |
| Correction, completion, updating and erasure | s.12 |
| Readily available grievance redressal | s.13(1) |
| Respond to grievances within the prescribed period | s.13(2) |
| Exhaust grievance redressal before approaching the Board | s.13(3) |
| Nominate another person for death or incapacity | s.14 |
| Publish how to make a request, and any identifiers needed | Rule 14(1) |
| Respond to grievances within a period not exceeding 90 days, published on the website or app | Rule 14(3) |
| Nomination mechanism | Rule 14(4) |
| GDPR equivalent: one month, extendable by two | GDPR Art. 12(3) |

## Capabilities

### 1. Request intake

1. Append a `received` line to `company-profile/{id}/rights-log.jsonl` (schema: `rights-entry.schema.json`)
2. Classify: access / correction / completion / updating / erasure / grievance / nomination
3. Verify identity using the identifiers published under Rule 14(1)
4. Acknowledge receipt (house standard: 48 hours; DPDP sets no acknowledgement deadline)
5. Set `due_at` from the published response period

Each later step is a new line with the same `request_id`. Never edit an earlier line.

### 2. Access requests (s.11)

Provide:
- A summary of the personal data being processed and the processing activities
- The identities of all other Data Fiduciaries and Data Processors it was shared with, and a description of what was shared
- Any other information the Rules prescribe

Format: clear, readable, commonly used electronic format.

### 3. Correction and erasure (s.12)

**Correction:** correct, complete or update inaccurate or incomplete data across all systems, including backups where feasible.

**Erasure:** erase when:
- Consent is withdrawn (s.6(6), s.8(7))
- The specified purpose is no longer being served (s.8(7), Rule 8)
- The Data Principal requests it (s.12(3))

Exception: retention necessary for compliance with law (s.8(7)). Tell every processor and Data Fiduciary that received the data to correct or erase their copies.

### 4. Grievance redressal (s.13)

1. Name a Grievance Officer (the DPO for an SDF, s.10(2)(a)(iv))
2. Publish the grievance mechanism and the response period on the website or app (Rule 14(3))
3. Acknowledge the grievance
4. Investigate and respond within the published period, never more than 90 days
5. Communicate the outcome with reasons
6. Tell the Data Principal they may complain to the Data Protection Board once this route is exhausted (s.13(3))

### 5. Nomination (s.14)

1. Accept nominations through a secure mechanism (Rule 14(4))
2. Verify the nominator's identity
3. Record the nomination
4. On death or incapacity, let the nominee exercise the rights

### 6. SLA tracking

Track every request against its `due_at`:
- Grievances: the published period, at most 90 days (Rule 14(3))
- Access, correction, erasure: the period published under Rule 14(1); for EU or UK data subjects, one month (GDPR Art. 12(3))

Flag overdue requests. Report SLA compliance to the DPO and the Board of Directors quarterly.

## Guardrails

- Never refuse a valid request without recording the legal basis in `refusal_basis`.
- Never charge a fee. DPDP has no fee provision.
- Always tell the Data Principal about the route to the Board.
- Log every request, including refused ones, in the append-only rights log. Use pseudonymised identifiers only.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/dpdp-rights intake` | Log and classify a new rights request |
| `/dpdp-rights access` | Process an access request |
| `/dpdp-rights correct` | Process a correction request |
| `/dpdp-rights erase` | Process an erasure request |
| `/dpdp-rights grievance` | Handle a grievance |
| `/dpdp-rights sla` | Check SLA compliance for open requests |
