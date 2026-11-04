---
name: dpdp-breach
description: "Personal data breach response under DPDP s.8(6) and Rule 7: assess, contain, notify the Data Protection Board (72-hour report) and every affected Data Principal, run parallel CERT-In and sector reporting, then review. Use for \"data breach\", \"breach notification\", \"notify the Board\", \"incident response\"."
---

# DPDP Breach Response

## Trigger

"data breach", "breach notification", "personal data breach", "incident response DPDP", "notify DPBI", "notify the Board", "breach log"

## Purpose

Handle personal data breaches under the DPDP Act 2023 and Rules 2025: detection, assessment, containment, intimation to the Data Protection Board of India and to every affected Data Principal, parallel regulatory reporting, and post-incident review.

DPDP has no harm threshold. Every personal data breach is intimated, unlike GDPR Art. 33(1), which excuses breaches "unlikely to result in a risk". Breach intimation obligations apply from 13 May 2027; before then, run this skill as a drill and still report to CERT-In and sector regulators, whose rules already apply.

## Legal basis

| Requirement | Reference |
|---|---|
| Reasonable security safeguards to prevent breaches | s.8(5), Rule 6 |
| Intimate the Board and each affected Data Principal | s.8(6) |
| Data Principals: without delay, through their user account or registered contact | Rule 7(1) |
| Board: without delay, an initial description | Rule 7(2)(a) |
| Board: within 72 hours of becoming aware (or longer if the Board allows on written request), a detailed report | Rule 7(2)(b) |
| CERT-In: report cyber incidents within 6 hours of noticing them | CERT-In Directions 2022 |
| RBI-regulated entities: report to RBI within 6 hours | RBI Cybersecurity Directions 2026 |
| Same incident under GDPR: supervisory authority within 72 hours | GDPR Art. 33(1) |

## Capabilities

### 1. Detection and assessment

When a potential breach is reported:
1. Confirm whether personal data was involved
2. Record `aware_at`: the moment the organisation became aware. It starts the 72-hour clock.
3. Classify: confidentiality (unauthorised disclosure), integrity (unauthorised alteration), availability (loss of access)
4. Assess scope: approximate number of Data Principals, categories of data
5. Rate severity: low (limited data, few people) to critical (sensitive data, large scale, children)
6. Identify the root cause, or record that it is unknown

Output: a `detected` and an `assessed` line appended to `company-profile/{id}/breach-log.jsonl` (schema: `breach-entry.schema.json`). Each later step is a new line with the same `breach_id`.

### 2. Containment

1. Isolate affected systems
2. Revoke compromised credentials
3. Preserve evidence: logs, access records (Rule 8(3) already requires one year of logs)
4. Engage forensics if needed

Never destroy evidence. Never hold back intimation to "investigate further": the initial Board intimation goes without delay, and the detail follows in the 72-hour report.

### 3. Intimation to the Board

**Without delay (Rule 7(2)(a)):** a description of the breach, including its nature, extent, timing and location of occurrence, and the likely impact.

**Within 72 hours (Rule 7(2)(b)):**
- Updated and detailed information on the description above
- The broad facts, circumstances and reasons leading to the breach
- Measures implemented or proposed to mitigate risk
- Any findings about the person who caused the breach
- Remedial measures taken to prevent recurrence
- A report on the intimations given to affected Data Principals

If 72 hours is not enough, request an extension from the Board in writing before the deadline. Log each intimation as a `notified_board` line with the deadline and reference number.

### 4. Intimation to Data Principals

Intimate each affected Data Principal without delay, in clear and plain language, through their user account or the mode of communication they registered (Rule 7(1)):
- Description of the breach: nature, extent, timing and location
- Consequences relevant to them
- Mitigation measures implemented or being implemented
- Safety measures they can take
- Business contact information of a person who can answer their questions

DPDP has no public-notice substitute for individual intimation (that is a GDPR Art. 34(3)(c) concept). If some Data Principals cannot be reached, record why and what was attempted.

### 5. Parallel reporting

| Recipient | When | Trigger |
|---|---|---|
| CERT-In | 6 hours | Cyber security incident (CERT-In Directions 2022) |
| RBI | 6 hours | Regulated entity cyber incident (RBI Directions 2026) |
| SEBI / IRDAI | Per CSCRF / IRDAI guidelines | Regulated entity |
| EU / UK supervisory authority | 72 hours | EU or UK data subjects affected (GDPR Art. 33) |

### 6. Post-incident review

1. Root cause analysis
2. Control failures, mapped to Rule 6 safeguards
3. Remediation, tracked as findings through `/remediate`
4. Update the breach response plan
5. Brief the Board of Directors

Output: post-incident report with findings and corrective actions, and a `reviewed` line in the breach log.

### 7. Readiness check

For `/audit` or a drill, with no live incident. Compare the runbook with the steps below and raise a finding for each one missing. Write nothing to the breach log.

| Step the runbook needs | Clause | Applies |
|---|---|---|
| Personal data assessment, recording `aware_at` | s.8(6), Rule 7 | 13 May 2027 |
| CERT-In within 6 hours | CERT-In Directions 2022 | Today |
| RBI within 6 hours, if a regulated entity | RBI Cybersecurity Directions 2026 | Today |
| Board without delay, then the detailed report within 72 hours | Rule 7(2) | 13 May 2027 |
| Each affected Data Principal without delay | Rule 7(1) | 13 May 2027 |
| EU or UK supervisory authority within 72 hours, and affected people if the risk is high | GDPR Art. 33(1), 34(1) | Today |
| Logs kept for one year, and ICT logs for 180 days in India | Rule 6(1)(e); CERT-In Directions 2022 | 13 May 2027; today |

## Guardrails

- Never apply a materiality threshold to DPDP intimation. Every breach is intimated.
- Never miss the 72-hour Board report. Ask for an extension in writing before it lapses.
- Never suppress or downplay severity.
- Never write personal data into the breach log. Counts and categories only.
- Always preserve evidence before containment.
- Log every breach, including near misses, in the append-only breach log. Corrections are new lines.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/dpdp-breach assess` | Assess a potential personal data breach |
| `/dpdp-breach notify-board` | Prepare the Board intimation and 72-hour report |
| `/dpdp-breach notify-principals` | Prepare the Data Principal intimation |
| `/dpdp-breach review` | Conduct post-incident review |
| `/dpdp-breach readiness` | Check a runbook against the required steps, with no live incident |
