# Privacy audit: Tamarind Finserv (full)

> Tamarind is a synthetic fixture. Paths are relative to the root of the audited `tamarind-lend` codebase.

| | |
|---|---|
| Assessment | `2026-11-11-tamarind-lend-full` |
| Scope | DPDP Act 2023 and Rules 2025. GDPR was checked for applicability under Art. 3 and does not apply |
| Target | `tamarind-lend`, a local copy with no git history, so no commit is recorded |
| Run | 11 Nov 2026, 12:26 to 13:15 IST, headless |
| Coverage | 18 of 21 applicable DPDP controls examined. Our own count, not comparable across runs |
| Overall posture | Non-compliant (DPDP readiness) |
| Findings | 4 critical, 9 high, 5 medium, 5 low |

Most DPDP duties apply from 13 May 2027, so every finding in `report.json` is a readiness gap and says so. The RBI, CERT-In and IT Act duties under "Sector obligations" apply today, and four of the security findings are live exposures under IT Act s.43A now.

## Why GDPR is out of scope

Tamarind has no establishment, staff or customers outside India, and all 350,000 applicants and borrowers live in India (README). Nothing in the code offers the service to people in the EU or UK or monitors them there, so Art. 3(1) and 3(2) are not met. The GDPR code audit, Art. 13/14 document review and Art. 44 to 49 transfer review were therefore not run, and every GDPR posture value is `not_applicable`. The address book upload will pick up some foreign numbers, but collecting a contact is not targeting or monitoring that person under Art. 3(2).

## Posture

| Dimension | DPDP | Why |
|---|---|---|
| Governance | Partial | Not an SDF, so no DPO duty. Contact and grievance officer published. No DPIA before this audit |
| Lawful processing | Non-compliant | Address book and call log upload, SMS to contacts, background tracking for field visits, bank data reused for offers |
| Rights | Partial | All five routes exist; erasure stalls while a loan is open and never reaches processors |
| Security | Non-compliant | Live KYC vendor key in the APK, unredacted Aadhaar images, bank payloads in logs |
| Third parties | Non-compliant | Agency gets every borrower column plus contacts, may reuse data for three years; database copied abroad daily |
| Retention | Non-compliant | Bank statements never purged; the rejected-application purge deletes nothing |

## Findings

| ID | Severity | Clause | Issue | Where |
|---|---|---|---|---|
| F-0001 | Critical | s.8(5), Rule 6(1)(b) | Live Verilane key in the APK reads every past KYC verification | `android/app/build.gradle:19` |
| F-0002 | Critical | s.4(1), s.5(1), s.6(1), Rule 3(b) | Whole address book and 90-day call log uploaded to pick two references | `android/.../onboarding/ReferencesStep.kt:22` |
| F-0003 | Critical | s.4(1), s.6(1) | Daily SMS to up to five contacts naming the overdue borrower | `jobs/collections_escalation.py:34` |
| F-0004 | Critical | s.5(1), s.6(1), Rule 3(b) | Background location every 6 hours, sold as security, used to route field agents | `android/.../onboarding/PermissionsStep.kt:18` |
| F-0005 | High | s.8(5), Rule 6(1)(a) | Full Aadhaar numbers in stored document images | `services/kyc.py:24` |
| F-0006 | High | s.8(5), Rule 6(1)(a) | Decrypted bank payloads logged on parse failure | `services/aa_client.py:53` |
| F-0007 | High | s.5(1), s.6(1), Rule 3(b) | Top-up scoring profiles every borrower from bank data, opt-in or not | `jobs/offer_scoring.py:9` |
| F-0008 | High | s.6(6), s.8(7), Rule 8 | Bank statements kept past the 1-month AA data life; no revocation handling | `jobs/retention.py:14` |
| F-0009 | High | s.8(7), Rule 8 | Rejected-application purge matches no rows | `jobs/retention.py:33` |
| F-0010 | High | s.6(1), s.8(2) | Hand-off CSV sends every borrower column, the nominee and five contacts | `jobs/collections_handoff.py:12` |
| F-0011 | High | s.8(2), s.8(7) | Agency may keep data three years and train its own models on it | `docs/vendors/recoverline-agreement.md:21` |
| F-0012 | High | s.8(5), Rule 6(1)(b) | Agency console role reads KYC, statements and contacts for all overdue accounts | `config/rbac.yaml:17` |
| F-0013 | High | s.16(2) | Daily database copy kept 35 days in ap-southeast-1 | `deploy/backup.yaml:17` |
| F-0014 | Medium | s.8(6), Rule 7(1) | Breach runbook intimates borrowers only | `docs/runbooks/incident-response.md:18` |
| F-0015 | Medium | s.6(4), s.6(6) | No way to withdraw contacts, call log or location consent | `api/settings.py:13` |
| F-0016 | Medium | s.8(7), s.12(3) | Erasure blocked while a loan is open, incomplete, not sent to processors | `services/rights.py:50` |
| F-0017 | Medium | s.5(1), s.6(1), Rule 3(b) | Device SDKs run with no recorded consent; screen analytics not in the notice | `android/app/build.gradle:42` |
| F-0018 | Medium | s.8(2), s.8(5), Rule 6(1)(f) | SMS gateway and payment aggregator without processing terms in the material | `docs/vendors/register.md:11` |
| F-0019 | Low | s.8(5), Rule 6(1)(b) | `risk_admin` holds every grant | `config/rbac.yaml:21` |
| F-0020 | Low | s.12(2), Rule 14(1) | No correction route for name, date of birth or mobile | `services/rights.py:42` |
| F-0021 | Low | s.11(1)(a) | Access export leaves out top-up scores | `services/rights.py:5` |
| F-0022 | Low | s.13(3) | Grievance escalation note omits the Board | `config/support.yaml:5` |
| F-0023 | Low | s.8(5), Rule 6(1)(a) | Fixture with identifier-shaped values, synthetic claim not verified | `tests/fixtures/borrowers.json:2` |

Detail and recommendations: [`report.json`](report.json). Data flows DF-01 to DF-20: [`data-map.json`](data-map.json).

## Sector obligations

These duties come from instruments with no DPDP clause carrying them, so they stay out of `report.json`. `details.json` lists RBI because Tamarind is an RBI-registered NBFC.

1. **CERT-In Directions 2022, applies now.** Cyber incidents go to CERT-In within 6 hours of noticing them. The runbook allows 24 hours from the security lead's confirmation (`docs/runbooks/incident-response.md:15`), so the clock starts late and runs four times too long. Move it to 6 hours from the time noticed, which the runbook already records (line 7).
2. **RBI KYC Master Direction and PML Rules 2005, applies now.** KYC records must be kept at least five years after the relationship ends. The schedule, the notice and the erasure response all promise five years, but `config/retention.yaml:2` sets `kyc_after_closure_days: 365`, so `jobs/retention.py:18-28` deletes KYC records and images one year after the last loan closes. Set it to five years.
3. **RBI (Digital Lending) Directions 2025, privacy policy (para 14 in the May 2025 text), applies now.** The policy must name the third parties that receive borrower data. `web/privacy-policy.html:28` gives categories only ("our KYC verification partner", "trusted technology partners"). Name Stratacloud, Verilane, Ledgerbridge, Recoverline, Signalgrid, Pulsemetric, the SMS gateway, the credit bureaus and the payment aggregator.
4. **RBI Cybersecurity Directions 2026, might apply.** The runbook meets RBI's 6-hour report (line 16), but Recoverline only has to tell Tamarind within 24 hours (`docs/vendors/recoverline-agreement.md:15`). An incident at the agency could put the 6-hour RBI and CERT-In reports out of reach. Shorten the vendor notice period.
5. **RBI card-on-file tokenisation rules, might apply.** Entities other than card issuers and networks may keep the last four digits and the issuer name. `repayment_mandates` also stores expiry month and year (`db/migrations/0006_repayment_mandates.sql:7-8`). Check against RBI's current tokenisation circulars.
6. **IT Act 2000 s.43A and SPDI Rules 2011, apply until 13 May 2027.** Bank data and the liveness selfie are sensitive personal data under the SPDI Rules, so reasonable security practices and written consent are required today. F-0001, F-0005, F-0006 and F-0012 are current exposures under s.43A, not only DPDP readiness gaps.

The RBI digital lending limits on contacts, call logs and location sit in the `cross_reference` of F-0002 and F-0004, and data localisation in F-0013, because a DPDP clause carries each of them.

## Penalty exposure (maximum theoretical, prospective until 13 May 2027)

| Schedule entry | Findings | Cap each | Subtotal |
|---|---|---|---|
| Security safeguards, s.8(5) | F-0001, F-0005, F-0006, F-0012, F-0018, F-0019, F-0023 | Rs 250 crore | Rs 1,750 crore |
| Breach intimation, s.8(6) | F-0014 | Rs 200 crore | Rs 200 crore |
| Any other provision | the other 15 findings | Rs 50 crore | Rs 750 crore |

Per finding: **Rs 2,700 crore**. Per provision, each Schedule entry counted once: **Rs 500 crore**, the figure stored in `posture.json`. The per-finding total grows with how finely the audit split its findings. s.33(2) makes the Board weigh gravity, duration and mitigation, and it has no enforcement record yet. No GDPR exposure: GDPR does not apply.

## DPIA screening

Tamarind is not an SDF, so s.10(2)(c) does not require a DPIA. The screen still says run one: financial data on 350,000 people, credit and top-up profiling, systematic location monitoring, biometric KYC and third-party contact data at scale. A draft is at `company-profile/tamarind-lend/dpias/dpia-0001.json` with status `draft` and no sign-off, since nobody holds a DPO role. It rates four risks critical before mitigation.

## Fix first

1. **F-0001** today: rotate the Verilane key and pull Verilane's `/verifications` access logs. If anyone walked the references, this is a breach and the CERT-In and RBI 6-hour clocks are already running.
2. **F-0002 and F-0003**: stop the address book upload and the contact SMS job, then delete the non-reference rows. Together they reach every applicant's contacts, with no notice to anyone.
3. **F-0004**: ship an app update that drops background location and cancels the worker.
4. Sector items 1 and 2: both are one-line changes that apply today.

## Coverage

Applicable (21): s.4, s.5, s.6, s.7, s.8, s.9, s.11, s.12, s.13, s.14, s.16; Rules 3, 6, 7, 8, 9, 10, 11, 14, 15, 23.

Examined (18): all of the above except Rule 10 (no flow collects children's data on purpose; the contact graph risk is noted under F-0002), Rule 11 (guardian consent for persons with disability) and Rule 23 (calling for information).

Not applicable: s.10 and Rule 13 (not an SDF); Rule 4 (no registered Consent Manager is used; the account aggregator is an RBI entity, not a DPDP Consent Manager); Rules 5, 12, 16 and 17 to 22 (State processing, children's exemptions, research, Board and appeals); s.15 and s.17.

## Onboarding follow-up

From `/onboard` step 5:

- **DPO.** None appointed and none required (not an SDF). Name the data protection contact as the person answering Data Principals' questions (s.8(9), Rule 9) with a reporting line to the board, as `/dpdp-dpo setup` describes.
- **Privacy policy.** Published, but it misstates location, references and analytics (F-0002, F-0004, F-0017) and names no third parties (sector item 3). Rewrite after the fixes land.
- **Consent.** Signup and offers consents are separate and unticked. Withdrawal exists for offers only (F-0015).
- **DPIA.** Draft written; finish it once the critical fixes are scoped.
- **PII scan.** Done in this audit.
- **Unknowns for a person to fill in** (`details.json`): turnover in euros (not needed while GDPR does not apply), whether the address given is the registered office, PCI DSS scope for card data, and whether children's data is processed (the contact graph makes it likely but unconfirmed).

## Skipped or limited

- GDPR steps 8 to 10 reduced to the Art. 3 applicability check above.
- Document review covered the privacy notice, retention schedule, runbook, vendor register and the Recoverline extract. The Stratacloud, Verilane, Signalgrid, Pulsemetric, SMS gateway and Ledgerbridge contracts are not in the material, so their terms were taken from the register's one-line descriptions.
- The `tamarind.*` modules the code imports (`db`, `storage`, `sms`, `vendors.register` and others) are not in the repository. Whether `bank_statements` is encrypted at rest, what `register.recipients()` returns and how the SDKs are initialised could not be checked.
- No live system, database, APK or log content was reviewed. No rights log, breach log or consent records were written; the mechanism audits do not write them.
- Rules 10, 11 and 23 not examined.

## Points to verify

- RBI paragraph numbers are from the May 2025 Digital Lending text as summarised in `/dpdp-catalog`. The bar on reading contacts and call logs, the one-time location rule, the Aadhaar redaction rule and the card-on-file limits come from outside the catalog and need checking against RBI's current Master Directions.
- s.16(2) is cited from the Act's text; the catalog summarises s.16 without its sub-sections.
- The report's `scope` lists DPDP only, because GDPR does not apply; the assessment id keeps `full` to match the command that was run.

---

*Compliance tooling, not legal advice. Verify against official sources and consult qualified counsel before relying on any of this for a binding decision.*
