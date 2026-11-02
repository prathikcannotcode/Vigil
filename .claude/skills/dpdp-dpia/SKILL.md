---
name: dpdp-dpia
description: Data Protection Impact Assessments under DPDP s.10(2)(c) and Rule 13: screen, assess, mitigate, record residual risk and review annually. Use for "DPIA", "privacy impact assessment", "high-risk processing", "SDF assessment".
---

# DPDP Data Protection Impact Assessment

## Trigger

"DPIA", "data protection impact assessment", "privacy impact assessment", "high risk processing", "DPDP impact assessment", "SDF assessment"

## Purpose

Conduct Data Protection Impact Assessments under the DPDP Act 2023. Mandatory for Significant Data Fiduciaries (s.10(2)(c)(i)), once every twelve months (Rule 13). Recommended before any high-risk processing by any Data Fiduciary, and required by GDPR Art. 35 where EU data is in scope.

## Legal basis

| Requirement | Reference |
|---|---|
| SDF must carry out periodic DPIAs | s.10(2)(c)(i) |
| DPIA covers the rights of Data Principals, the purpose of processing, and the assessment and management of risk to those rights | s.10(2)(c)(i) |
| SDF must appoint an independent data auditor | s.10(2)(b) |
| SDF must undergo periodic data audits | s.10(2)(c)(ii) (wording per Removal of Difficulties Order 2026) |
| DPIA and audit every 12 months; significant observations reported to the Board | Rule 13(1)-(2) |
| Due diligence that algorithmic software does not risk Data Principals' rights | Rule 13(3) |
| Localisation of personal data specified by the Central Government | Rule 13(4) |
| EU equivalent | GDPR Art. 35-36 |

## Capabilities

### 1. Screening

Determine whether a full DPIA is required:
- Is the organisation a Significant Data Fiduciary, designated or likely? (mandatory)
- Does the processing involve: large-scale profiling, automated decisions about people, children's data, health or financial data, new technology, systematic monitoring?
- Would a breach of this data cause significant harm?

If any trigger is met, run the full DPIA. Record the screening decision either way.

### 2. Full DPIA

**A. Processing description**
- Nature, scope, context and purpose of processing
- Categories of personal data and Data Principals
- Data flows (collection, storage, sharing, deletion)

**B. Necessity and proportionality**
- Is processing necessary for the stated purpose?
- Could the purpose be achieved with less data?
- Is there a valid ground: consent (s.6) or a legitimate use (s.7)?

**C. Risk identification**
- Confidentiality (unauthorised access or disclosure)
- Integrity (unauthorised modification)
- Availability (loss of access)
- Rights of Data Principals (discrimination, financial loss, reputational harm)
- Third-party processing and cross-border transfer
- Algorithmic decisions (Rule 13(3))

**D. Risk assessment**
For each risk: likelihood (low/medium/high) x impact (low/medium/high) = risk level.

**E. Mitigations**
For each medium or high risk:
- Technical: encryption, pseudonymisation, access controls, audit logging (Rule 6)
- Organisational: policies, training, processor contracts, retention schedules
- Legal: consent mechanisms, contractual safeguards

**F. Residual risk**
After mitigations, assess residual risk. Critical residual risk goes to the Board of Directors before processing starts.

Output: `company-profile/{id}/dpias/{dpia-id}.json` (schema: `dpia.schema.json`), with an optional narrative `.md` report alongside.

### 3. Periodic review

Re-assess when:
- Processing scope or purpose changes
- New technology is introduced
- A breach occurs in the assessed system
- Regulatory guidance changes
- Twelve months pass, for SDFs (Rule 13)

## Guardrails

- Never approve processing with critical residual risk without Board of Directors sign-off.
- Never skip a DPIA for an SDF.
- Always document the decision whether or not to proceed, with reasons.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/dpdp-dpia screen` | Pre-screen whether a full DPIA is needed |
| `/dpdp-dpia full` | Conduct a full DPIA |
| `/dpdp-dpia review` | Review and update an existing DPIA |
