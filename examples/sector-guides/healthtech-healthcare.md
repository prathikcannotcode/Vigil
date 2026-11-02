# Sector Guide: Healthtech and Healthcare

## Applicable frameworks

| Framework | Why it applies |
|---|---|
| DPDP Act 2023 + Rules 2025 | Any entity processing personal data in India |
| Clinical Establishments Act, 2010 | Hospitals, clinics, diagnostic centres |
| Indian Medical Council regulations | Medical record retention |
| Telemedicine Practice Guidelines, 2020 | Telemedicine platforms |
| CERT-In Directions, 2022 | All entities |
| GDPR | If serving EU/UK patients or processing EU health data |

## Key data types in healthcare

| Data type | Classification | Special handling |
|---|---|---|
| Medical history and diagnosis | Health data, special category (GDPR Art. 9) | Explicit consent; encrypted; restricted access |
| Prescriptions and treatment records | Health data | Statutory retention applies |
| Lab results and imaging | Health data | Minimise sharing; patient portal preferred |
| Biometric (for patient ID) | Special category (GDPR) | Purpose-limited; short retention |
| Genetic data | Special category (GDPR Art. 9) | Highest sensitivity; explicit consent always |
| Mental health records | Health data | Additional confidentiality protections |
| Insurance claims data | Financial + health data | Share with insurer only with consent |
| Aadhaar (for ABHA ID linking) | Government ID | Aadhaar Act restrictions |

## Healthcare-specific DPDP obligations

### Consent
- Treatment: may rely on DPDP Section 7(d) (medical emergency) or Section 7(a) (voluntary health service) for core treatment
- Research: explicit consent under Section 6; separate from treatment consent
- Insurance sharing: separate consent per insurer
- Marketing: explicit consent; never use health data for marketing
- Telemedicine: consent before consultation and data collection

### Children's health data
- DPDP Section 9: parental consent required for under-18
- Exception may apply for emergency medical treatment
- Never use children's health data for profiling or targeting

### Data minimisation in healthcare
- Collect only what is clinically necessary
- Diagnostic results: share only what the referring clinician needs
- Research data: anonymise or pseudonymise before analysis
- Insurance: share only the minimum needed for claims

### Breach notification
- DPDP: notify DPBI and affected patients
- Health data breaches are almost always high severity
- Patients must be told what health data was exposed and what steps to take

### Retention
- Medical records: varies by state and type of facility
- General guidance: 3-5 years minimum for OPD, longer for surgical/inpatient
- Medico-legal cases: retain until case resolution + statutory period
- GDPR: retention must be justified per purpose

### Cross-border
- Telemedicine with international patients: DPDP + patient's home jurisdiction may apply
- Health data transfers to EU: GDPR Art. 9 conditions + Art. 44-49 transfer mechanisms
- Cloud storage: verify data residency; health data should stay in-jurisdiction where possible

## Checklist for healthtech companies

- [ ] Classify all health data as special category / high sensitivity
- [ ] Implement explicit consent for all non-emergency health data processing
- [ ] Separate consent for treatment, research, insurance, and marketing
- [ ] Encrypt health data at rest and in transit (non-negotiable)
- [ ] Restrict access to clinically necessary minimum (role-based access)
- [ ] Audit log all access to health records
- [ ] Conduct DPIA for all large-scale health data processing
- [ ] Implement patient-facing data access (portal or request mechanism)
- [ ] Define retention per record type and facility regulations
- [ ] If using AI/ML on health data: DPIA required; training data consent required
- [ ] Telemedicine: ensure consent before video/audio recording
