# DPDP Breach Response

## Trigger

"data breach", "breach notification", "personal data breach", "incident response DPDP", "notify DPBI", "breach log"

## Purpose

Handle personal data breaches under DPDP Act 2023 and Rules 2025: detection, assessment, containment, notification to the Data Protection Board of India (DPBI) and affected Data Principals, and post-incident review.

## Legal basis

| Requirement | Reference |
|---|---|
| Notify DPBI of personal data breach | Section 8(6) |
| Notify affected Data Principals | Section 8(6) |
| Notification in prescribed form and manner | Rule 7 |
| Reasonable security safeguards to prevent breaches | Section 8(5) |

## Capabilities

### 1. Breach detection and assessment

When a potential breach is reported:
1. Confirm whether personal data was involved
2. Classify the breach: confidentiality (unauthorised disclosure), integrity (unauthorised alteration), availability (loss of access)
3. Assess scope: number of Data Principals affected, types of personal data compromised
4. Determine severity: low (limited data, limited individuals) to critical (sensitive data, large-scale)
5. Identify root cause

Output: Breach assessment record appended to `company-profile/{id}/breach-log.jsonl`.

### 2. Containment

Immediate actions:
1. Isolate affected systems
2. Revoke compromised credentials
3. Preserve evidence (logs, access records)
4. Engage forensics if needed

Do not destroy evidence. Do not delay notification to "investigate further" beyond what is necessary for initial assessment.

### 3. DPBI notification

Prepare notification to DPBI per Rule 7:
- Description of the breach
- Types of personal data affected
- Approximate number of Data Principals affected
- Likely consequences
- Measures taken or proposed to address the breach
- Contact details of the DPO or point of contact

File within the prescribed timeframe. Log the notification in the breach log.

### 4. Data Principal notification

Notify affected Data Principals:
- Nature of the breach in plain language
- Types of their personal data affected
- What the organisation is doing about it
- Steps they can take to protect themselves
- DPO contact details

Use the communication channel most likely to reach them (email, SMS, in-app notification). If individual notification is disproportionate, use a public notice on the organisation's website.

### 5. Post-incident review

After containment and notification:
1. Conduct root cause analysis
2. Identify control failures
3. Recommend and implement remediation
4. Update security measures
5. Update the breach response plan
6. Brief the Board

Output: Post-incident report with findings and corrective actions.

## Guardrails

- Never delay DPBI notification beyond the prescribed timeframe.
- Never suppress or downplay breach severity.
- Always preserve evidence before containment.
- Always notify Data Principals in plain language they can act on.
- Log every breach, including near-misses, in the append-only breach log.

## Commands

| Command | Action |
|---|---|
| /breach-assess | Assess a potential personal data breach |
| /breach-notify-dpbi | Prepare DPBI notification |
| /breach-notify-principals | Prepare Data Principal notification |
| /breach-review | Conduct post-incident review |
