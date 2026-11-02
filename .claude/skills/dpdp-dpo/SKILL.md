---
name: dpdp-dpo
description: Set up and run the Data Protection Officer function under the DPDP Act 2023 and Rules 2025 (India): DPO charter, independence check, monitoring calendar, quarterly board report. Use for "set up DPO", "DPO charter", "board report", "grievance officer".
---

# DPDP Data Protection Officer Governance

## Trigger

"set up DPO", "DPO governance", "appoint DPO", "DPO charter", "DPDP DPO", "privacy officer setup", "grievance officer"

## Purpose

Set up and run the Data Protection Officer function under the DPDP Act 2023 and Rules 2025. Covers appointment, charter, governance structure, independence, and board reporting.

## Legal basis

| Obligation | Reference |
|---|---|
| Significant Data Fiduciaries must appoint a DPO | s.10(2)(a) |
| The DPO represents the SDF under the Act | s.10(2)(a)(i) |
| The DPO is based in India | s.10(2)(a)(ii) |
| The DPO is an individual responsible to the Board of Directors or similar governing body | s.10(2)(a)(iii) |
| The DPO is the point of contact for the grievance redressal mechanism | s.10(2)(a)(iv) |
| Every Data Fiduciary publishes business contact information of its DPO, or of a person who can answer Data Principals' questions | s.8(9), Rule 9 |
| Every Data Fiduciary runs an effective grievance redressal mechanism | s.8(10), Rule 14(3) |
| GDPR equivalent, where EU data is in scope | GDPR Art. 37-39 |

A Data Fiduciary that is not an SDF does not have to appoint a DPO, but it must still publish a contact person (s.8(9)) and run grievance redressal (s.8(10)). A senior Privacy Officer or Grievance Officer usually fills both roles.

## Capabilities

### 1. DPO charter and governance setup

1. Draft the DPO Charter: scope, authority, reporting line (to the Board of Directors, s.10(2)(a)(iii)), resources, access rights, protection from penalty for performing duties.
2. Establish the governance structure: Board of Directors > DPO > Privacy Team, Legal, CISO, IT/Engineering, HR.
3. Set up contact channels: dedicated mailbox (dpo@org), published on the website and in the privacy notice (Rule 9), and an internal reporting channel.
4. Record the DPO in `company-profile/{id}/details.json` (`dpo` field).
5. Brief the Board of Directors on DPDP obligations, the phased commencement dates, and the DPO role.

Output: DPO Charter document, governance structure, published contact details.

### 2. Compliance monitoring programme

Annual calendar:
- Q1: privacy notice and policy review; data map update
- Q2: consent audit (sample-based); processor contract review
- Q3: DPIA programme review; training completion audit
- Q4: rights and grievance SLA review; breach and incident review
- Ongoing: sign-off for new processing, regulatory monitoring (`/reg-monitor`)

For each activity: define scope and method, execute or oversee, document findings, issue corrective actions, track them through `/remediate`.

### 3. Board reporting

Quarterly report:
- Compliance status by dimension (from `/posture`)
- Rights requests received and fulfilled within SLA
- Grievances received and resolved within the published period (90-day ceiling, Rule 14(3))
- Breaches detected and intimated
- DPIAs conducted
- Processor audits completed
- Training completion rate
- Regulatory updates and upcoming commencement dates
- Top three privacy risks with mitigations
- Open critical findings and overdue actions

### 4. Independence and conflicts of interest

DPDP does not list conflicting roles, but a DPO who sets the purposes and means of processing cannot also review them credibly. Treat as conflicting: CEO, CTO, CISO, Head of Marketing, Head of HR. Compatible: Chief Privacy Officer, a privacy-focused Compliance Head, an external DPO.

Document the assessment. Where a conflict exists, recommend a structural change or an external DPO.

## Guardrails

- The DPO reports to the Board of Directors, not through Legal or IT.
- Never approve a DPIA with unacceptable residual risk to meet a launch date.
- Always document advisory opinions in writing.
- Never accept a DPO appointment with an unresolved conflict of interest.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/dpdp-dpo setup` | Set up governance structure and charter |
| `/dpdp-dpo monitoring` | Run compliance monitoring programme |
| `/dpdp-dpo board-report` | Prepare quarterly board report |
| `/dpdp-dpo independence` | Assess conflict of interest |
