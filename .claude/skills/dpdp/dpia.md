# DPDP Data Protection Impact Assessment

## Trigger

"DPIA", "data protection impact assessment", "privacy impact assessment", "high risk processing", "DPDP impact assessment"

## Purpose

Conduct Data Protection Impact Assessments under DPDP Act 2023. Required for Significant Data Fiduciaries (Section 10(2)(b)) and recommended before any high-risk processing.

## Legal basis

| Requirement | Reference |
|---|---|
| SDF must undertake DPIA | Section 10(2)(b) |
| Periodic DPIA audits | Section 10(2)(c) |
| DPIA must assess risk to Data Principal rights | Section 10(2)(b) |

## Capabilities

### 1. Pre-screening

Determine whether a full DPIA is required:
- Is the organisation a Significant Data Fiduciary? (mandatory)
- Does the processing involve: large-scale profiling, automated decision-making, sensitive personal data, children's data, new technology, systematic monitoring of public spaces?
- Would a breach of this data cause significant harm?

If any trigger is met, proceed to full DPIA.

### 2. Full DPIA

Structured assessment:

**A. Processing description**
- Nature, scope, context, and purpose of processing
- Categories of personal data and Data Principals
- Data flows (collection, storage, sharing, deletion)

**B. Necessity and proportionality**
- Is processing necessary for the stated purpose?
- Could the purpose be achieved with less data?
- Is there a valid lawful basis?

**C. Risk identification**
- Risk to confidentiality (unauthorised access/disclosure)
- Risk to integrity (unauthorised modification)
- Risk to availability (loss of access)
- Risk to Data Principal rights (discrimination, financial loss, reputational damage)
- Risk from third-party processing or cross-border transfer

**D. Risk assessment**
For each risk: likelihood (low/medium/high) x impact (low/medium/high) = risk level.

**E. Mitigations**
For each medium or high risk, propose mitigations:
- Technical: encryption, pseudonymisation, access controls, audit logging
- Organisational: policies, training, DPAs, retention schedules
- Legal: consent mechanisms, contractual safeguards

**F. Residual risk**
After mitigations, assess residual risk. If residual risk is critical, escalate to Board and consider consulting DPBI before processing.

Output: DPIA report saved to `company-profile/{id}/dpias/`.

### 3. Periodic review

DPIAs are not one-time. Trigger re-assessment when:
- Processing scope or purpose changes
- New technology is introduced
- A breach occurs in the assessed system
- Regulatory guidance changes
- At least annually for SDFs

## Guardrails

- Never approve processing with critical residual risk without Board sign-off.
- Never skip a DPIA for an SDF.
- Always document the decision whether or not to proceed, with reasons.

## Commands

| Command | Action |
|---|---|
| /dpia-screen | Pre-screen whether a full DPIA is needed |
| /dpia-full | Conduct a full DPIA |
| /dpia-review | Review and update an existing DPIA |
