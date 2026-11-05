# Privacy audit: sample-co (baseline)

> Synthetic demo. Sample Co is a made-up Indian lending app with EU customers. Every file path below points at a codebase that does not exist. This is what `/audit` writes to `assessments/{id}/summary.md`.

| | |
|---|---|
| Assessment | `2026-10-19-sample-co-baseline` |
| Scope | DPDP Act 2023 + Rules 2025, EU GDPR |
| Run | 19 Oct 2026, 41 minutes |
| Coverage | 39 of 46 applicable controls examined (85%) |
| Overall posture | Non-compliant |
| Open findings | 1 critical, 3 high, 3 medium, 1 low (1 more already remediated) |

## Posture

| Dimension | DPDP | GDPR | Why |
|---|---|---|---|
| Governance | 🟡 partial | 🟢 compliant | DPO appointed; board reporting not running yet |
| Lawful processing | 🔴 non-compliant | 🟡 partial | Marketing consent bundled into ToS; withdrawal needs an email |
| Rights | 🟡 partial | 🟢 compliant | Grievance response period not published |
| Security | 🔴 non-compliant | 🔴 non-compliant | Plaintext Aadhaar; no 72-hour notification step |
| Third parties | 🟢 compliant | 🔴 non-compliant | US helpdesk with no transfer mechanism; analytics DPA missing |
| Retention | 🔴 non-compliant | 🔴 non-compliant | No deletion job; credit data kept indefinitely |

## Findings

| ID | Severity | Clause | Issue | Where |
|---|---|---|---|---|
| F-0001 | Critical | DPDP s.8(5), Rule 6(1)(a) · GDPR Art. 32(1)(a) | Aadhaar numbers stored in plaintext | `db/migrations/0007_kyc.sql:14` |
| F-0002 | High | DPDP s.6(1), Rule 3(b) · GDPR Art. 7(2) | Marketing consent bundled into the ToS checkbox | `web/src/pages/signup.tsx:88` |
| F-0003 | High | DPDP s.8(6), Rule 7(2)(b) · GDPR Art. 33(1) | Incident runbook has no Board or supervisory authority step, no 72-hour clock | `docs/runbooks/incident-response.md` |
| F-0004 | High | GDPR Art. 44, 46(2)(c) | EU support tickets go to a US helpdesk with no transfer mechanism | data flow DF-04 |
| F-0005 | Medium | DPDP s.8(7), Rule 8 · GDPR Art. 5(1)(e) | No deletion job; credit data has no retention period | `services/accounts/retention.py:22` |
| F-0006 | Medium | DPDP s.6(4) · GDPR Art. 7(3) | One tap to consent, an email to withdraw | `web/src/pages/settings/privacy.tsx:31` |
| F-0007 | Medium | GDPR Art. 28(3) | Analytics vendor has no signed DPA | data flow DF-05 |
| F-0008 | ~~Medium~~ | DPDP s.8(5), Rule 6(1)(a) · GDPR Art. 32(1)(b) | ~~Full mobile numbers in INFO logs~~ Remediated 24 Oct | `services/notify/sms.py:57` |
| F-0009 | Low | DPDP Rule 14(3) | Grievance page does not publish a response period | `web/src/pages/grievance.tsx:12` |

Full detail, owners and due dates: [`report.json`](report.json).

## Penalty exposure (maximum theoretical)

**DPDP: Rs 650 crore** (prospective; these obligations apply from 13 May 2027)

| Finding | Schedule entry | Cap |
|---|---|---|
| F-0001 | Security safeguards, s.8(5) | Rs 250 crore |
| F-0003 | Breach intimation, s.8(6) | Rs 200 crore |
| F-0002, F-0005, F-0006, F-0009 | Any other provision | 4 x Rs 50 crore |

**GDPR: EUR 90M** (fixed caps apply below EUR 500M turnover; linked operations capped at the gravest infringement, Art. 83(3))

| Processing operation | Findings | Gravest tier | Cap |
|---|---|---|---|
| Signup and consent | F-0002, F-0006 | Art. 83(5) | EUR 20M |
| Customer support | F-0004 | Art. 83(5) | EUR 20M |
| Account lifecycle | F-0005 | Art. 83(5) | EUR 20M |
| KYC storage | F-0001 | Art. 83(4) | EUR 10M |
| Incident handling | F-0003 | Art. 83(4) | EUR 10M |
| Product analytics | F-0007 | Art. 83(4) | EUR 10M |

Caps, not predictions. Regulators weigh gravity, duration, intent, mitigation and cooperation.

## Fix first

1. **F-0001** Move Aadhaar into an encrypted vault. Highest DPDP cap, and the fix is one migration. (In progress, due 26 Oct)
2. **F-0003** Add Board, supervisory authority, CERT-In (6h) and RBI (6h) steps to the incident runbook. The October incident (BR-0002) showed the team can hit 72 hours; the runbook should say so.
3. **F-0004** Put SCCs or DPF certification in place for the helpdesk before the next EU ticket lands there.

## Logs at a glance

- Breach log: 1 near miss, 1 incident (BR-0002) reported to CERT-In in 5h 25m and to the EU supervisory authority in 44h 10m.
- Rights log: 1 access request fulfilled in 13 days; 1 DPDP grievance acknowledged, due 20 Nov.

---

*Compliance tooling, not legal advice. Verify against official sources and consult qualified counsel for binding decisions.*
