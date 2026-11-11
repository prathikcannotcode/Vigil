# Score: blind audit of tamarind-lend

Assessment `2026-11-11-tamarind-lend-full`, 23 findings and 6 sector entries. Scored on 11 November 2026 against `examples/tamarind-lend.expected.json` and the run sheet on branch `claude/epic-wiles-e7f118`. The key's sha256 is `81ff4d9384b738f4e652fbd5a6c2b2d696b16acd5a84bc63d594c8fd5e395e1b`.

The scorer did not write the fixture or the report, and opened the key only for scoring. `report.json` has the same sha256 before and after scoring: `cbd59050e1414976235534aa444dea7298c41229cc4af5d756b4f25e0ad96543`. `summary.md` is `154b74bead5881efafa696517852f11ea7f2bfc9c9dd0bed015ca279f60889d9`.

This folder holds the run's `report.json` and `summary.md`. There is no `findings.sarif` for this run. `score-check.mjs` reproduces the mechanical checks:

```bash
node examples/tamarind-lend.run-1/score-check.mjs examples/tamarind-lend examples/tamarind-lend.expected.json
```

## The run

- **Vigil under test.** Commit `d335bd1` on this branch, which adds the fixture on top of `731a3f9`, plus an uncommitted guardrail diff from the main checkout's working tree (base `f8ed9c4`, sha256 `a46e9fbe9974a8451c184d8bf9dfab2d357f8188b15ef308e956a85a18057cff`). The diff applied cleanly. It adds the clause validator, the "Sector obligations" routing in `/audit` step 7 and `AGENTS.md`, and a reviewer note at the top of each sector guide. The run tested guardrails that are not committed anywhere, and this worktree does not contain them.
- **Who audited.** A fresh general-purpose subagent of the session that wrote the fixture (Claude Opus 5.5), not a separate top-level session, because the bundled Claude Code CLI was not logged in. It started with no context from that session. It read Vigil and the app only from an export outside the repo: a `git archive` of `d335bd1` with keys and run sheets removed, then the guardrail diff applied. It read the skills as files, not through the Skill tool, so `/onboard`, `/audit` and `/add-dir` were never invoked.
- **Where it wrote.** The session's write-guard blocks writes outside this worktree, so the subagent wrote to the gitignored `company-profile/tamarind-lend/` and `assessments/2026-11-11-tamarind-lend-full/` here, then copied them into the export and ran the export's stricter validator: `npm run validate -- --strict`, 0 errors; `npm test` passed. 48 tool uses, about 17 minutes.
- **summary.md.** The harness refused the subagent's write ("Subagents should return findings as text, not write report files"). The fixture author saved the returned text verbatim. The scorer cannot check that it is verbatim, only that the sha256 matches the stated one and the copy in the assessment folder.
- **Re-validated here.** `npm run validate -- --strict` in this worktree, which lacks the guardrail's clause validator, checks 38 data files with 0 errors, including the run's outputs.

## Result

| Measure | Score |
|---|---|
| Expected items found | 13 of 13 |
| Partly found or missed | 0 |
| Misfiled | 1 of 4 sector-only items (P6) |
| Sector instrument named | 8 of 8 items with a sector rule |
| Sector paragraph named, top level | 4 of 7 items whose rule has one |
| Citation right, run-sheet rule | 9 of 9 report items with a clause |
| Citation anchors, exact or more specific | 17 of 17 |
| Citation anchors, at section or rule level | 17 of 17 |
| Should-not-flag violations, by the key | 5 of 12, 3 of them arguably key defects |
| Other findings: real unplanted gaps / disputed / false positive | 3 / 5 / 2 |
| DPDP findings that read as current violations | 0 of 23 |
| Sector duties described as starting in 2027 | 0 |
| Files containing a credential, fixture or config value | 0 of 12 |
| Findings with a missing path or a line past the end | 0 of 23 |
| Clauses outside DPDP sections 1-44 and rules 1-23 | None |
| Instruments outside the catalog, the fintech guide and the key's sources | 3 |

## Blindness

The fixture author checked the subagent's transcript; the scorer did not see it. Every tool call read only the export, apart from one `ls` of this worktree's `company-profile` and `assessments` folders, which listed only sample-co folders. No tool call opened the key or the run sheet. Both were deleted from disk for the run and restored afterwards with the same sha256.

The harness injected this worktree's git status into the subagent's context. It named the two deleted files and showed the commit subject "Add tamarind-lend, a fintech fixture with sector-rule gaps". By the letter of the run sheet that is a hit: `expected.json`, `run-sheet` and `tamarind-lend.` were in what the session read. The rule exists to keep the key's contents from the auditor, and none of them reached it. File names say nothing about any item.

The subject line is a real leak, and it bears on what this fixture measures. It tells the auditor that sector-rule gaps exist, though not which, where or under which instrument. The README already says Tamarind is an RBI-registered NBFC, and the catalog and the guardrail under test already send an NBFC audit to RBI and CERT-In duties, so the hint adds little the tools did not. **The leak qualifies the run; it does not void it.** P9 to P13 stand at full weight. Read the landing of P5 to P8 and the sector columns for P1 to P8 as a likely upper bound.

The leak came from running the audit as a subagent whose working directory was a checkout holding the fixture. The run sheet's own setup, a new session started in the export, would not have shown it. For the next fixture, use a commit subject that says nothing about the planted issues.

## Expected items

| ID | Item | Where | Verdict | Sector rule named | Clause check |
|---|---|---|---|---|---|
| P1 | Address book and call log uploaded; contacts texted and sent to the agency | F-0002, F-0003, F-0010 | Found | Digital Lending Directions, para 12, contact and call-log bar, "Applies" (F-0002) | Both exact |
| P2 | Background location every 6 hours, used for field visits | F-0004 | Found. Filed on `PermissionsStep.kt`; names `LocationSyncWorker.kt:28-33` | Directions, para 12, one-time location | Both exact |
| P3 | Hand-off sends every column and five contacts; clause 9 keeps data three years | F-0010, F-0011 | Found | Directions named, hedged "might apply; verify". No lending service provider status, no basic-data rule, no paragraph | Both exact |
| P4 | Aadhaar number left on stored images | F-0005 | Found. Asks for masking, not only encryption | KYC Master Direction with the redaction rule itself, no paragraph | Both exact |
| P5 | CERT-In row: 24 hours from confirmation | Sector entry 1 | Found, right place | CERT-In Directions 2022 | No clause |
| P6 | Daily database copy to Singapore | F-0013 | Found, **misfiled** | Directions, para 13, "applies today" | No clause |
| P7 | Policy does not name SDK partners | Sector entry 3 | Found, right place | Directions, para 14 | No clause |
| P8 | KYC purged after one year, not five | Sector entry 2 | Found, right place | KYC Master Direction, no paragraph | No clause |
| P9 | Rejected-application purge matches no rows | F-0009 | Found. Names the schedule, not the policy | None expected | Exact |
| P10 | Top-up scoring reads every borrower's AA statements | F-0007, F-0008 | Found | None expected | Both exact |
| P11 | Decrypted AA payload logged at WARNING | F-0006 | Found | None expected | Both exact |
| P12 | Live Verilane key in the APK | F-0001 | Found. Key value not copied | None expected | Both exact |
| P13 | Agency console role reads KYC, statements and contacts | F-0012 | Found. Misreads "provisioned by the vendor manager" as vendor-provisioned | None expected | Both exact |

Every report item points at the key's file except P2, whose finding names the key's file in its text. F-0010 serves both P1 (contacts sent to the agency) and P3. Spot checks of the line references inside the issue texts and sector entries all landed on the cited lines.

## How the sector-only duties were handled

The run followed the guardrail on purpose. Line 73 of the summary explains why the contact, call-log and location limits sit in F-0002 and F-0004 and localisation in F-0013: a DPDP clause carries each of them. That is right for P1 and P2 and wrong for P6.

- **P5, CERT-In.** Entry 1 names both faults, the clock starting at the security lead's confirmation instead of noticing and 24 hours instead of 6, and points the fix at the noticed time the runbook already records (line 7). It does not mention FAQ 30's partial first report. No report finding stands in; F-0014 on the same file is a different point.
- **P6, Singapore backup.** F-0013 cites s.16(2) and says "the RBI requirement applies today". The run reads s.16(2) as carrying the RBI rule into DPDP. As the scorer reads the Act, s.16(2) is a savings clause: it keeps stricter Indian transfer laws in force but places no duty of its own on a Data Fiduciary, so breaking the RBI rule does not break s.16(2). The key cannot settle this by citation, because its sources and the catalog give s.16 without its sub-sections, and the scorer's reading was not checked against the Gazette. It supports the key's "misfiled". The run flagged its own s.16(2) wording as unverified. F-0013 also adds Rs 50 crore to the per-finding penalty under a provision that may carry none.
- **P7, privacy policy.** Entry 3 quotes "trusted technology partners" and names Signalgrid and Pulsemetric among the parties to disclose. It states the rule as naming every third party that receives borrower data; the key's source says third parties allowed to collect personal information through the app. So it over-asks (cloud, bureaus, agency), and the entry does not cite `android/app/build.gradle` or `docs/vendors/register.md`. F-0017 cites both for the SDKs' direct collection. Scored found, as kadamba's P8 was found without one file.
- **P8, KYC retention.** Entry 2 has the mechanism: `config/retention.yaml:2` sets 365 days and `jobs/retention.py:18-28` purges records and images, against the five years the schedule, notice and erasure response promise. The posture note routes it to the summary too. It adds the PML Rules 2005, which none of the three sources name. The KYC Direction alone carries the duty, so the addition is unverified, not wrong.

Three entries are not in the key:

- **Entry 4, RBI Cybersecurity Directions 2026 and Recoverline's 24-hour notice.** Disputed. The RBI part is unsettled: the key did not open those Directions. The CERT-In part is wrong by the key's sources. Direction (ii) runs from noticing or being told, so Tamarind's 6 hours start when Recoverline tells it, and FAQ 25 makes Recoverline a body corporate with its own 6-hour duty. Shortening the vendor window is still sensible.
- **Entry 5, card-on-file rules and the expiry columns.** The key cannot settle it: its `unverified` list says the tokenisation circulars were not found. The migration does not say whether `expiry_month` and `expiry_year` hold the card's expiry or the token's. The entry is hedged and does not claim stored card numbers, so it does not violate the should-not-flag note.
- **Entry 6, IT Act s.43A and SPDI Rules until 13 May 2027.** Matches the catalog. It is a framing note, not a gap: it marks F-0001, F-0005, F-0006 and F-0012 as current exposures. The catalog lists the instrument without its definitions, so calling bank data and the liveness selfie sensitive rests on the run's reading.

Instruments the run names that the catalog, the fintech guide and the key's sources do not: the PML Rules 2005 (F-0005, entry 2), RBI fair practices and recovery-agent rules (F-0003, F-0010) and RBI card-on-file tokenisation rules (entry 5). The KYC Direction is missing from the catalog but is in the guide and the key's sources.

## Should-not-flag

Scored by aspect, as for kadamba, because `services/rights.py` carries three findings on different points.

| File | Verdict |
|---|---|
| `db/migrations/0006_repayment_mandates.sql` | Clean on the key's point: nothing reports stored card numbers. F-0018 names it to show a payment aggregator exists. Entry 5 is covered above |
| `docs/runbooks/incident-response.md` | **Violated** by F-0014, which faults the borrower row. Key defect |
| `deploy/logging.yaml` | Clean. F-0006 names its readers and retention for P11 |
| `jobs/collections_reminders.py` | Clean, never mentioned |
| `jobs/offer_push.py` | Clean. F-0007 credits its opt-in check |
| `config/env.example` | Clean, never mentioned |
| `tests/fixtures/borrowers.json` | **Violated** by F-0023. Run error |
| `.../onboarding/SelfieStep.kt` | Clean, never mentioned |
| `services/rights.py` (erasure) | **Violated** by F-0016's first point, refusal while a loan is open. Key defect in part. F-0020 and F-0021 are other aspects |
| `config/support.yaml` | **Violated** by F-0022, which faults the escalation note. Run error |
| `config/app.yaml` | Clean. No GDPR finding and no s.9 finding. F-0002 says the contact graph may hold children's numbers, which is about contacts, not borrowers |
| `web/privacy-policy.html` | **Violated** by F-0017's claim that the notice leaves out screen analytics. Key defect. The other mentions are evidence for P1, P2 and P10 or credit the notice |

Three of the five look like key defects:

- **F-0014.** s.8(6) and Rule 7(1) require intimation to each affected Data Principal. Tamarind also holds rejected applicants (kept indefinitely, P9), every address book contact (P1), references and nominees. "Every borrower affected" leaves them all out. Proposed key change: limit the runbook note to the Board row and the content of the notice, and add the borrower-only row to `known_gaps`.
- **F-0016.** The key's own reason ties refusal to "data that a law or the specified purpose still requires". The notice gives non-reference contacts no purpose beyond picking two references and location none beyond confirming the city at KYC, so an open loan does not need them under s.12(3). Proposed key change: replace "and everything while a loan is still open" with "and data the open loan still needs", and add consent-only data kept while a loan is open to `known_gaps`. F-0016's other two points are real unplanted gaps: `erase()` keeps the nominee, employer, income, AA handle, applications and mandates without listing them in `RETAINED`, and it sends no erasure instruction to processors (s.8(7)(b)).
- **F-0017.** `docs/vendors/register.md:10` says Pulsemetric collects screen events, and `android/app/build.gradle:41` calls it screen analytics. The notice's data row (`web/privacy-policy.html:22`) lists device model, identifiers, IP address and network type; "measure app performance" appears only in the sharing paragraph. The notice does not itemise screen events, so the key's "itemises the data and purposes" is not quite true. Proposed key change: add Pulsemetric's screen events to `known_gaps`, or, in a later fixture, describe Pulsemetric as crash and performance data only.

Two are run errors:

- **F-0022.** s.13(3) makes the Data Principal exhaust grievance redressal before going to the Board. It puts no duty on Tamarind to name the Board in the escalation note, and the notice already names it, as F-0022 itself says.
- **F-0023.** README line 5 says every value is synthetic and invalid, and the finding admits the values look like placeholders. A s.8(5) finding on a test fixture with no evidence of real data is a false positive. It also adds Rs 250 crore to the per-finding penalty.

## Other findings

Ten findings fall outside the expected items. The five disputed ones are the should-not-flag violations above.

| Verdict | Findings |
|---|---|
| Real unplanted gap, checked against the code | F-0015, F-0018, F-0021 |
| Disputed | F-0014, F-0016, F-0017 (key defects); F-0022, F-0023 (run errors) |
| False positive | F-0019, F-0020 |

- **F-0015.** `api/settings.py` withdraws only offers. Permission consents are recorded (`PermissionsStep.kt:24`) but nothing withdraws them, and revoking the Android permission leaves the stored contact graph and locations in use for collections. The notice promises withdrawal of any consent (line 35).
- **F-0018.** The register gives processing terms for every vendor except the SMS gateway (line 11), and `pa_token_ref` shows a payment aggregator the register leaves out. The finding hedges correctly.
- **F-0021.** `EXPORT_TABLES` leaves out `preapproved_offers`, which `ERASE` includes. Minor.
- **F-0019.** A wildcard admin role with a console-audit stream is ordinary. The finding admits it does not know who holds the role: an open question, like kadamba's F-0040.
- **F-0020.** It says name, date of birth and mobile have no correction route. The notice offers correction by email to the privacy address (line 36), and `config/support.yaml:7-9` sets a 30-day rights channel.

Two mapped findings also carry real unplanted points: F-0008 notes that nothing handles AA consent revocation or expiry (`aa_consents.status` never becomes revoked or expired), and F-0016's points above.

## Timing and values

All 23 findings are DPDP findings and every one says it is a readiness gap until 13 May 2027. No sector duty is described as starting in 2027. The three 2027 mentions in sector text (F-0001 and F-0006 cross-references, entry 6) give the date s.43A ends, which matches the catalog. Two cross-references hedge duties the key says apply today: F-0003 and F-0010 say "might apply".

No file in this folder or in the run's gitignored outputs contains the Verilane key, the `env.example` database URL or any of the 14 fixture strings: 0 of 12 files. F-0001 describes the key without copying it.

## The audit session's guess points

| # | Point | Verdict |
|---|---|---|
| 1 | `scope` is `["DPDP"]`; the id keeps "full" | Right. The key agrees GDPR does not reach Tamarind. The id is cosmetic |
| 2 | Registered address from the README's entity line, listed as unknown | Right. The line names the entity and an address, not the registered office. Judgement call |
| 3 | `processes_children_data` removed and listed unknown | Defensible. The key rules out child borrowers, not child contacts, and no s.9 finding was filed. Real schema gap: one boolean cannot say "borrowers no, contacts unknown" |
| 4 | `processes_sensitive_data` true through the SPDI Rules | Right under the catalog. Schema gap: the field does not say whose category, and DPDP has none |
| 5 | Turnover in EUR left out | Right. Real schema gap, minor: there is no INR field |
| 6 | Data-map enums are GDPR-shaped | Real schema gap. `transfer_mechanism` is kadamba's point 11 again; `legal_obligation` and `special_category` as stand-ins are new cases |
| 7 | Posture has no readiness value | Real schema gap. Every DPDP status before 13 May 2027 is readiness, and the enum cannot say so |
| 8 | One penalty number in `posture.json` | Arithmetic right: 7 x Rs 250 crore + Rs 200 crore + 15 x Rs 50 crore is Rs 2,700 crore; one per entry is Rs 500 crore. Format gap: one field. The per-finding figure includes Rs 650 crore from F-0013, F-0019, F-0020, F-0022 and F-0023 |
| 9 | DPIA `is_necessary` left out, `proportionate` false, no sign-off | Right. `is_necessary` is ambiguous between the processing and the DPIA: a wording gap. No DPO, so no sign-off |
| 10 | Legal points from outside the catalog flagged "verify" | Right to flag. The key's sources confirm four: the contact and call-log bar and the one-time location rule (para 12(i)), Aadhaar redaction (KYC Direction para 16) and the paragraph numbers at top level. Card-on-file and s.16(2) stay unsettled. Real catalog gap: its Digital Lending row omits para 12(i)'s limits, and it has no KYC Direction row |
| 11 | Coverage counts are its own | Judgement call, by design. They add up: 11 sections and 10 rules, less Rules 10, 11 and 23, is 18 of 21 |
| 12 | Process slips: one `ls`, and a shell `cp` before an Edit | The `ls` showed only sample-co folders. The copy was harmless: both `data-map.json` copies have the same sha256 and both validators pass. Real guard gap: the write-guard hooks Write, Edit and MultiEdit only, so a shell copy lands a file it never sees |

## Comparison with kadamba-fit

Kadamba-fit found 16 of 16 with 45 of 48 exact anchors and 3 of 13 should-not-flag violations, two of them arguably key defects. Tamarind found 13 of 13 with 17 of 17 exact anchors and 5 of 12 violations, three arguably key defects. The new measure is placement: three of four sector-only duties landed in the summary, and the fourth was filed under a DPDP savings clause.

## Limits

- One model wrote the fixture, ran the audit as a subagent of the fixture's session, and scored it, so shared blind spots could inflate recall.
- The commit subject leak qualifies the sector results, as set out under Blindness.
- The guardrails tested exist only as an uncommitted diff with a recorded sha256. The run cannot be reproduced from git until that diff is committed.
- The scorer did not see the transcript and relies on the fixture author's account of it, and of `summary.md` being verbatim.
- The s.16(2) reading and the card-on-file point rest on the scorer's and the run's knowledge of the texts. Neither was checked against an official source in this session.
- Tuning skills on this score ends tamarind-lend's blindness. Another blind measure needs a new fixture.
- The scorer did not commit. The fixture author committed this folder after rerunning `score-check.mjs` and checking the hashes above. The run's `posture.json`, `data-map.json`, DPIA draft and company profile stay in the gitignored assessment and profile folders.
