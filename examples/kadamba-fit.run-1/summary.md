# Kadamba Fit: full DPDP and GDPR audit

Assessment `2026-11-05-kadamba-cold-full`, company `kadamba-cold`. Audited `examples/kadamba-fit` at commit `b6d1c44` with Vigil 0.2.0 on Claude Opus 5.5. Law as at 2 November 2026, the "Last verified" date of both catalogs. This was a static read: the code does not run and modules such as `kadamba.models`, `crm`, `offer_feed` and `db` are not in the repository.

This is compliance tooling, not legal advice. Take binding decisions to qualified counsel. Several findings below need that, and it is urgent for the Art. 9 basis, the US transfer and any breach assessment of past exports.

## Result

Overall posture: non-compliant. 40 findings: 9 critical, 15 high, 12 medium, 4 low.

Before 13 May 2027 most DPDP gaps are readiness gaps, and each finding says so. GDPR and the CERT-In Directions apply today, so the EU findings below are current exposure. The GDPR upper tier caps at EUR 20 million here, because 4% of EUR 6 million turnover is only EUR 240,000. DPDP caps reach Rs 250 crore for s.8(5), and Rs 200 crore each for s.8(6) and s.9, from 13 May 2027.

The documents are better than the code. The schedule, partner agreement and notice promise deletion, a three-field share and SCCs, and the jobs and config do something else (F-0002, F-0001, F-0007).

## Fix first

1. **Stop the Harbourline export** (F-0001). It sends email, date of birth and health averages to an insurer against the agreement and the consent text.
2. **Stop EU analytics to us-east-1** (F-0007, F-0012). No transfer tool, no processor terms, and the Irish controller is not a party.
3. **Turn off middleware DEBUG and stop the staging refresh** (F-0005, F-0004, F-0016). Bodies, tokens and health data sit in logs and in staging with contractor access.
4. **Rotate the committed database credential and fix field encryption** (F-0006, F-0015).
5. **Fix the purge job** (F-0002, F-0019). Health and cycle data are never deleted, and a parent with a dependant stops the whole nightly run.
6. **Give health data a basis and fix children's processing** (F-0003, F-0008, F-0009, F-0010).
7. **Rewrite the breach matrix** (F-0020 to F-0023, F-0026). Art. 33 applies today and the current clock and thresholds would miss it.

## Findings

| ID | Severity | Clause | Issue | Location |
|---|---|---|---|---|
| F-0001 | Critical | Art. 5(1)(c), 9(1); s.6(1) | Export to insurer exceeds Schedule A and consent | `jobs/partner_export.py:8` |
| F-0002 | Critical | Art. 5(1)(e), 17(1); s.8(7) | Health and cycle data never erased | `jobs/purge_closed.py:6` |
| F-0003 | Critical | Art. 9(2)(a); s.4, s.6, s.7(a) | No Art. 9(2) condition for health data | `docs/ropa.md:9` |
| F-0004 | Critical | Art. 32(1)(b); s.8(5) | Unmasked production data in staging | `scripts/refresh_staging.sh:6` |
| F-0005 | Critical | Art. 32(1)(a); Rule 6(1)(a) | Headers and bodies in production logs | `api/middleware.py:11` |
| F-0006 | Critical | Art. 32(1)(b); Rule 6(1)(b) | Production DB credential committed | `deploy/secrets.yaml:7` |
| F-0007 | Critical | Art. 44, 46(1) | EU analytics to US with no transfer tool | `config/production.yaml:7` |
| F-0008 | Critical | s.9(3); Art. 25(1) | Children get targeted offers: `is_minor` unset | `services/family.py:6` |
| F-0009 | Critical | s.9(1), Rule 10; Art. 8(2) | No verifiable parental consent | `services/family.py:4` |
| F-0010 | High | Art. 7(4); s.6(1) | Insurer consent forced at signup | `config/app.yaml:14` |
| F-0011 | High | Art. 7(3); s.6(6) | Marketing withdrawal ignored by CRM sync | `jobs/campaign_sync.py:6` |
| F-0012 | High | Art. 28(3); s.8(2) | Quantlytics has no processor terms, own-use grant | `docs/vendors/quantlytics-order-form.md:15` |
| F-0013 | High | Art. 5(1)(b), 6(1); s.4 | Undisclosed sponsored-offer profiling | `services/offers.py:9` |
| F-0014 | High | s.4, s.6, s.9(3) | Analytics: no DPDP ground, tracks children | `services/analytics.py:6` |
| F-0015 | High | Art. 32(1)(a); Rule 6(1)(a) | Coach tax and bank data plaintext as deployed | `utils/fieldcrypt.py:11` |
| F-0016 | High | Art. 25(1); Rule 6(1)(a) | Masking script covers only four columns | `scripts/mask_staging.sql:1` |
| F-0017 | High | Art. 15, 20; s.11 | Export omits health data and recipients | `services/rights.py:4` |
| F-0018 | High | Art. 19; s.8(7) | Erasure and withdrawal do not reach Harbourline | `jobs/purge_closed.py:12` |
| F-0019 | High | s.8(7), s.9; Art. 17 | Dependants left active, foreign key stops purge | `jobs/purge_closed.py:14` |
| F-0020 | High | Art. 33(1); Rule 7(2)(b) | 72 hours counted from declaration | `docs/runbooks/severity-matrix.md:5` |
| F-0021 | High | Rule 7(2)(a) | No initial Board intimation | `docs/runbooks/severity-matrix.md:5` |
| F-0022 | High | Rule 7(1); Art. 34(1) | Member notice optional and after review | `docs/runbooks/severity-matrix.md:5` |
| F-0023 | High | s.8(6); Art. 33(1), (5) | Sev 2 and 3 never notify, count-only severity | `docs/runbooks/severity-matrix.md:6` |
| F-0024 | High | Rule 6(1)(e), 8(3); CERT-In | Logs kept 30 days, schedule says 12 months | `deploy/logging.yaml:9` |
| F-0025 | Medium | Art. 5(1)(c), 6(1)(f), 21 | Email and IP in analytics, no assessment found | `services/analytics.py:9` |
| F-0026 | Medium | s.8(6), Rule 7; Art. 33 | No awareness time or personal data step | `docs/runbooks/incident-response.md:2` |
| F-0027 | Medium | Rule 14(3), s.13(2) | Grievance limit 120 days, period not published | `config/support.yaml:4` |
| F-0028 | Medium | Art. 13(2)(b), 21(4) | Notice omits restriction, portability, objection | `web/privacy-notice.html:29` |
| F-0029 | Medium | Art. 13; Rule 3(b) | Notice omits data, recipients, retention, coaches | `web/privacy-notice.html:10` |
| F-0030 | Medium | Art. 12(1); s.5(3) | No German notice, no Eighth Schedule option | `web/privacy-notice.html:5` |
| F-0031 | Medium | Art. 30(1) | RoPA lacks fields and activities | `docs/ropa.md:5` |
| F-0032 | Medium | Art. 28(1), 30(1)(d); s.8(2) | Recipients missing from vendor register | `docs/vendors/register.md:3` |
| F-0033 | Medium | Art. 5(2), 7(1); s.6(10) | Consent proof can go before 3 years after closure | `jobs/purge_closed.py:24` |
| F-0034 | Medium | Art. 5(1)(e); s.8(7) | No period for coach data, dormant accounts, raw samples | `docs/retention-schedule.md:5` |
| F-0035 | Medium | Art. 35(1) | DPIA not reviewed, other processing not covered | `README.md:19` |
| F-0036 | Medium | Art. 16, 19; s.12 | Corrections not sent on, dob edit skips age rules | `services/rights.py:19` |
| F-0037 | Low | Art. 6(3) | Irish invoices justified by Indian statutes | `docs/retention-schedule.md:9` |
| F-0038 | Low | Art. 7(3), 12(2); s.6(4) | Settings hides consent state, no erasure link | `web/settings.html:3` |
| F-0039 | Low | Art. 5(1)(c); s.6(1) | Cycle notes and device serial have no stated need | `services/cycle.py:6` |
| F-0040 | Low | Art. 13(2)(f), 22 | Open question: is the tier an automated decision? | `docs/vendors/harbourline-partner-agreement.md:5` |

## Steps run

Every step ran except the sector check. The sub-skills were read and applied inline in this one run.

| Step | Skill | Outcome |
|---|---|---|
| 1 | `/pii-scan` | All 52 files in the app folder read. Fixture checked, no finding (see below) |
| 2 | `/gdpr-data-flows` | 22 flows in `data-map.json` |
| 3 | `/dpdp-consent` | F-0008 to F-0011, F-0014, F-0030 |
| 4 | `/dpdp-rights audit` | F-0017, F-0018, F-0027, F-0028, F-0036, F-0038 |
| 5 | `/dpdp-dpia screen` | Art. 35 triggers met (health, children, monitoring, profiling). s.10(2)(c) does not apply: not an SDF. Draft written for the processing outside the reported DPIA's stated scope: `company-profile/kadamba-cold/dpias/dpia-2026-11-partner-children-offers.json` |
| 6 | `/dpdp-breach readiness` | F-0020 to F-0024, F-0026. Nothing written to the breach log |
| 7 | Sector check | **Skipped: not triggered.** `details.json` lists no RBI, SEBI or IRDAI and the company is not financial. The partner is an insurer, so IRDAI is left as an unknown |
| 8 | `/gdpr-audit` | Security, retention and basis findings |
| 9 | `/gdpr-draft review` | Table below |
| 10 | `/gdpr-audit transfers` | F-0007. Other transfers credited below |
| 11 | `/posture` | `posture.json`, overall non-compliant |
| 12 | Report | `report.json` |

## Document review

| Document | Status | Note |
|---|---|---|
| Privacy notice | Incomplete | F-0007, F-0028, F-0029, F-0030 |
| Signup and consent text | Incomplete | F-0010 |
| Mailwren DPA | Present | Covers the Art. 28(3) terms |
| Nimbusline terms | Present | Covers the duties. It does not list data types or categories of people, which I did not raise as a finding on this excerpt |
| Quantlytics order form | Incomplete | F-0012 |
| Harbourline agreement | Present | Clear and limited. The code does not follow it (F-0001) |
| Cadencehive DPA | Not found in the reviewed material | Register says signed 2 November 2024, held by Legal |
| Intra-group agreement, SCCs, transfer impact assessment | Not found in the reviewed material | Listed in the register |
| Retention schedule | Incomplete | F-0034, F-0037 |
| Rights procedure | Not found in the reviewed material | Only `config/support.yaml` and the services |
| DPIA | Not found in the reviewed material | README says the DPO holds it |
| Legitimate interests assessment | Not found in the reviewed material | F-0025 |
| Incident runbook and severity matrix | Incomplete | F-0020 to F-0023, F-0026 |

## Checked and no finding

- `tests/fixtures/members.json`: reserved `example.test` addresses, zero-filled phone numbers and placeholder names. These cannot be real, so I did not treat them as realistic-format identifiers.
- `config/env.example` holds only placeholders. `production.yaml` and the CRM key use references.
- Consent ledger: append-only design, notice version and source recorded, latest row wins. The reminder and partner jobs read it correctly.
- Signup boxes are not pre-ticked. One switch per purpose in Settings.
- OTP: `secrets` module, 5-minute TTL, masked phone in logs. `auth_sessions` stores hashes. Payment data is a PSP token, brand and last four digits only.
- `rights_request` at 600 hours (25 days) is inside one month. `first_response` matches the 48-hour house standard.
- Invoices surviving erasure, and consent events kept after closure, are allowed in principle. Only the Irish basis (F-0037) and the date used (F-0033) are raised.
- Transfers: India disaster recovery in Singapore is allowed under s.16 with no restriction in the catalog. EU disaster recovery stays in Dublin. Mailwren Inc. access runs under SCC Module 3 with a transfer impact assessment. Bengaluru support is listed under SCC Module 2 with one.
- DPO based in Dublin: the India-based DPO rule in s.10(2)(a) binds only an SDF.
- Snapshots at 35 days match the schedule and are encrypted per cluster.
- CERT-In 6-hour step and evidence preservation are in the runbook. Nomination and grievance routes exist. The notice has the Board and supervisory authority routes.

## Could not verify

- That the "synthetic" database credential and the README's claims about it are true (F-0006).
- Whether a key reaches `FIELDCRYPT_KEY` outside the manifests (F-0015).
- Which events call `track()`, what `offer_feed` does with a segment, and how `activity_tier` is derived. No code for these is in the repository.
- Staging's location, contractors' location, and whether the database connection uses TLS (the URL sets no `sslmode`).
- Whether a plan exists for the s.5(2) notice to members who consented before commencement.
- Cross-border status of the CRM, SMS, push, payment and ad partner flows.

## Controls

Counted at top-level section, rule or article. The denominator is my own count from this organisation's facts, so do not compare it across runs.

**Applicable: 51. Examined: 45.**

- **DPDP sections (11, all examined):** s.4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16.
- **DPDP rules (10, 9 examined):** Rules 3, 6, 7, 8, 9, 10, 12, 14, 15. Not examined: Rule 11 (no material on guardians of persons with disability). Rule 12 and Rule 15 and s.16 were checked against the catalog only: no exemption or country restriction is claimed or listed.
- **GDPR (30, 25 examined):** Art. 5, 6, 7, 8, 9, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 25, 28, 30, 32, 33, 34, 35, 37, 44, 46. Not examined: Art. 14 (indirect collection, such as nominee and dependant data), 24 (policies), 36 (needs the DPIA), 38 and 39 (DPO position and tasks).
- **Related instruments checked, not counted:** CERT-In Directions 2022, CCPA Dark Patterns Guidelines 2023.
- **Excluded as not applicable:** s.10 and Rule 13 (not designated an SDF), Rule 4 (no Consent Manager in the material), Rules 5 and 16, Art. 10, 26, 27, 45, 47, 49.

## Schema stand-ins

- `details.json`: `legal_name` and `registered_address` hold two entities in one string. `dpo` holds only the mailbox.
- `data-map.json`: `lawful_basis` takes one value, so claimed bases that the evidence does not support are `none_identified` with the claim in `notes`. Basis values for backup and support flows follow the source data. DF-22 uses `legal_obligation` as a stand-in. `transfer_mechanism` has no DPDP value, so India flows use `null` and explain it in `notes`.
- `report.json`: one `file` and `line` per finding, so other locations are in the issue text. SARIF shows only the first.
- CERT-In and the CCPA guidelines appear only in `cross_reference`, because `framework` takes DPDP, GDPR or UK-GDPR.
