# Sector Guide: Edtech and Education

## Applicable frameworks

| Framework | Why it applies |
|---|---|
| DPDP Act 2023 + Rules 2025 | Any entity processing personal data in India |
| DPDP Section 9 | Children's data (students under 18) |
| Right to Education Act, 2009 | Schools and educational institutions |
| NEP 2020 / UGC regulations | Higher education institutions |
| CERT-In Directions, 2022 | All entities |
| GDPR | If serving EU/UK students |
| COPPA (if US users) | Children under 13 in the US |

## Key data types in edtech

| Data type | Classification | Special handling |
|---|---|---|
| Student name, age, class | Personal data, children's data | Parental consent required (DPDP Section 9) |
| Parent/guardian contact details | Personal data | Used for consent verification and communication |
| Academic records and grades | Personal data | Purpose-limited to education |
| Attendance records | Personal data | Minimise retention |
| Learning analytics (time on platform, quiz scores) | Personal data, behavioural | No profiling or targeting of children |
| Webcam/audio (live classes) | Personal data, biometric potential | Consent; delete after class unless recorded |
| Chat/messaging content | Personal data | Monitor for safety; retention policy needed |
| Payment data (parent's) | Financial personal data | PCI DSS; not children's data |
| Aadhaar/APAAR (student ID) | Government ID | Aadhaar Act restrictions |

## Edtech-specific DPDP obligations

### Children's data (the big one)
DPDP Section 9 applies to all students under 18. This covers most K-12 and many higher education students.

**Required:**
- Verifiable parental/guardian consent before collecting any data (Section 9, Rule 10)
- No behavioural monitoring or targeted advertising directed at children (Section 9(3))
- No processing detrimental to the child's well-being (Section 9(2))
- No tracking beyond what is necessary for the educational service

**Prohibited:**
- Profiling students for non-educational purposes
- Selling or sharing student data with advertisers
- Gamification designed to increase addictive usage patterns
- Using student data to train AI models without explicit consent

### Consent flow for edtech
1. Student signs up (or parent signs up for younger children)
2. Age gate: determine if under 18
3. If under 18: redirect to parental consent flow
4. Parent verifies identity (Rule 10 method)
5. Parent reviews and consents to specific data collection
6. Student can use the service
7. Parent can review, correct, or delete child's data at any time

### Learning analytics
- Collect only what improves the educational outcome
- Anonymise analytics used for platform improvement
- Never use learning analytics for advertising
- Show analytics to students/parents (transparency)
- Retention: end of academic year or course completion, then anonymise

### Live classes
- Inform students and parents before recording
- Consent for recording (can be via terms for the class)
- Delete recordings within [defined period] unless needed for review
- No facial recognition on class recordings
- Mute/camera-off must be available without penalty

### Breach notification
- DPDP: notify DPBI and parents/guardians (not just students)
- Children's data breaches carry higher severity
- Communicate in plain language that parents can understand

### GDPR considerations for international edtech
- If serving EU students: full GDPR compliance required
- GDPR Art. 8: children's consent age varies by Member State (13-16)
- GDPR has a higher bar for consent management in children's services
- DPIA required for large-scale processing of children's data

## Checklist for edtech companies

- [ ] Implement age verification at signup
- [ ] Build parental consent flow with verifiable mechanism
- [ ] Disable behavioural tracking and targeted ads for under-18 users
- [ ] Ensure no processing detrimental to child well-being
- [ ] Collect only educationally necessary data
- [ ] Show learning analytics to students and parents
- [ ] Set retention: delete or anonymise at end of course/academic year
- [ ] If live classes: consent for recording; auto-delete policy
- [ ] Never share student data with advertisers
- [ ] Breach notification must reach parents, not just students
- [ ] If AI/ML: explicit consent for training on student data
- [ ] DPIA for any large-scale student data processing
