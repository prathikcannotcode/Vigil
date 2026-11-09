# Score: cold audit of kadamba-fit

Assessment `2026-11-05-kadamba-cold-full`, 40 findings, run on master at `259d7e0` against the app from `b6d1c44`. Scored on 8 November 2026 against `examples/kadamba-fit.expected.json` and the run sheet on branch `claude/trusting-wilbur-d90e22`. The key and app are identical at `b6d1c44` and `3c9e897`. After this score, `a2083c0` corrected the key and run sheet; the app is unchanged. These figures use the earlier key.

The scorer did not write the report, and opened the key only for scoring. `report.json` has the same sha256 before and after scoring: `751bc5a92f9fcb550cf9e8701f0a295d6f1774d6e85a97b96a70efb1cebabb34`.

This folder holds the run's `report.json` and `summary.md`, copied from the gitignored assessment folder. The exports and company profile were not copied. `score-check.mjs` reproduces the mechanical checks:

```bash
node examples/kadamba-fit.run-1/score-check.mjs examples/kadamba-fit examples/kadamba-fit.expected.json
```

Run against the corrected key, it prints the same planted-issue and value checks; the should-not-flag notes have changed.

## Result

| Measure | Score |
|---|---|
| Planted issues found | 16 of 16 |
| Partly found or missed | 0 |
| Citation right, run-sheet rule | 16 of 16 |
| Citation anchors, exact or more specific | 45 of 48 |
| Citation anchors, at section, rule or article level | 47 of 48 |
| Should-not-flag violations, by the key | 3 of 13 |
| Other findings: real unplanted gaps / disputed / false positive | 14 / 3 / 1 |
| DPDP findings that read as current violations | 0 |
| Files containing a fixture or config value | 0 of 11 |
| Findings with an absolute or missing path | 0 of 40 |
| Clauses outside the catalogs | None |

## Blindness

The transcript never mentions the kadamba-fit key or run sheet. The only hits for `expected.json` are git status lines naming the acme-demo key.

The run did not follow the run sheet's setup. It audited a `git archive` of the app folder from inside the main checkout, not from an exported copy of Vigil, and it used company id `kadamba-cold`. The key sat on disk in `.claude/worktrees/trusting-wilbur-d90e22/` throughout and was never opened. Before starting, the run confirmed that its working tree matched PR #2's head.

## Planted issues

| ID | Issue | Findings | Verdict | Clause check |
|---|---|---|---|---|
| P1 | Purge skips the three `member_ref` tables | F-0002 | Found | All 4 exact |
| P2 | EU analytics to a US endpoint, no mechanism or DPA | F-0007, F-0012 | Found | All 3 exact |
| P3 | Campaign sync ignores withdrawal | F-0011 | Found | Both exact |
| P4 | Insurer sharing required at signup | F-0010 | Found | Both exact |
| P5 | Dependants never marked minor, so they get ad offers | F-0008 | Found | s.9(3) exact; GDPR Art. 8(1) not cited |
| P6 | Severity thresholds and the 72-hour clock | F-0020, F-0021, F-0022, F-0023, F-0026 | Found | All 5 exact |
| P7 | Middleware logs bodies at DEBUG in production | F-0005 | Found | All 3 exact |
| P8 | Export omits tables and recipients | F-0017 | Found, though it doesn't name `docs/vendors/register.md` | Both exact |
| P9 | `seal()` stores plaintext without its key | F-0015 | Found | All 3 exact |
| P10 | Base64 database URL in `deploy/secrets.yaml` | F-0006 | Found, though it doesn't name `config/production.yaml` | All 3 exact |
| P11 | Unmasked production data in staging | F-0004, F-0016 | Found | All 5 exact |
| P12 | Logs kept 30 days | F-0024 | Found | Both exact |
| P13 | No Art. 9(2) condition for health data | F-0003 | Found | Both exact |
| P14 | Partner export sends the whole row | F-0001 | Found | 3 exact; Art. 5(1)(b) only at article level |
| P15 | Grievance clock of 120 days | F-0027 | Found | Both exact |
| P16 | Dependant added with no parental consent | F-0009 | Found | 3 exact; Art. 8(1) only at article level, through Art. 8(2) |

Every found item points at the file the key names.

## Should-not-flag

These are scored by aspect, because `config/support.yaml` is both P15 and a should-not-flag item.

| File | Verdict |
|---|---|
| `services/otp.py` | Clean. F-0005 says the middleware defeats its masking, which is true |
| `db/migrations/0005_billing.sql` | Clean |
| `docs/vendors/mailwren-dpa.md` | Clean on the key's points. F-0018 says Mailwren has no per-member deletion path, which is weak because DPA clause 5 covers help with requests |
| `docs/vendors/register.md` | Clean. F-0032 flags missing vendors, not the Bengaluru SCCs |
| `docs/retention-schedule.md` | **Violated** by F-0037, which faults the nine-year invoice row for the Irish entity |
| `db/migrations/0002_consent_events.sql` | Clean. F-0033 reports the opposite problem, deletion too early |
| `deploy/backup.yaml` | Clean, never mentioned |
| `config/env.example` | Clean. F-0006 says it needs no change |
| `jobs/reminder_push.py` | Clean. F-0011 credits it |
| `web/settings.html` | **Violated** by F-0038, which cites Art. 7(3) and s.6(4) on the switches |
| `config/support.yaml` (rights clock) | Clean. F-0027 says 600 hours is fine |
| `tests/fixtures/members.json` | Clean, no finding |
| `web/privacy-notice.html` | **Violated** by F-0028, which reports rights missing from the notice. F-0025 repeats the objection point |

Two of the three violations look like key defects:

- **F-0028:** the notice omits restriction and objection, which Art. 13(2)(b) requires. The key's blanket "rights" protection is too broad.
- **F-0037:** the schedule justifies nine years with Indian statutes only, and Art. 17(3)(b) and Art. 6(3) need EU or Member State law for the Irish controller.

The third is a real false positive. F-0038's withdrawal claim assumes the switches render without the member's current state, but the file is a static fixture and the finding admits that state may be filled elsewhere. Its separate erasure-link point is a real gap: the notice promises erasure in Settings and the page doesn't offer it.

## Other findings

18 findings fall outside the planted issues. The 3 disputed ones are F-0028, F-0037 and F-0038, covered above.

| Verdict | Findings |
|---|---|
| Real unplanted gap, checked against the code | F-0013, F-0014, F-0018, F-0019, F-0025, F-0029, F-0030, F-0031, F-0032, F-0033, F-0034, F-0035, F-0036, F-0039 |
| False positive | F-0040: an open Art. 22 question with no evidence of a solely automated decision |

Three of the real gaps are code defects the key's author missed:

- **F-0019:** `guardian_id` has no cascade, so erasing a parent fails, and the purge loop has no error handling, so one failure ends the nightly run.
- **F-0033:** consent proof is deleted by `created_at`, so it can go about 30 days after closure instead of three years later. The key's should-not-flag note claims the purge waits for the end of the period, which is wrong for older consents.
- **F-0036:** a corrected email leaves the old contact in the CRM, where the erasure call cannot find it.

## The audit session's guess points

| # | Point | Verdict |
|---|---|---|
| 1 | One `legal_name` and address for two entities | Real schema gap |
| 2 | `dpo` holds only a mailbox | Real schema gap, minor |
| 3 | Whether README claims count as posture evidence | Judgement call |
| 4 | UK and IRDAI left unknown | Judgement call |
| 5 | Meaning of "realistic-format" in `/pii-scan` | Wording gap. The outcome was right: zero-filled phones are valid format but plainly synthetic |
| 6 | Production credential marked synthetic, rated by risk | Judgement call, and the right one |
| 7 | A DPIA reported but not supplied | Real skill gap: the absence rule doesn't cover it |
| 8 | Sector check ignores an insurer partner | Real skill gap, low impact |
| 9 | Breach readiness has no rule for a step that is present but wrong | Real skill gap. It drove P6, and the run handled it anyway |
| 10 | "Always high" for dark patterns | Wording gap: it should say "at least high" |
| 11 | One `lawful_basis` value; `transfer_mechanism` has no DPDP value | Real schema gap for the second; the first is handled by `none_identified` |
| 12 | One `file` and `line` per finding | Real format gap. SARIF could carry related locations |
| 13 | Own coverage count; one posture dimension per finding | Judgement call, by design |
| 14 | Sub-skills applied inline | Process note, not a gap |

## Comparison with acme-demo

Acme-demo, self-scored on a fixture whose comments named its bugs, found 9 of 10 with 23 of 27 exact anchors. Kadamba-fit, scored by a separate session on a fixture with no telltale comments, found 16 of 16 with 45 of 48 exact anchors. It also violated 3 of 13 should-not-flag items, two of them arguably defects in the key.

## Limits

- A Claude session wrote the fixture, another ran the audit and a third scored it, so shared blind spots could inflate recall.
- The skill fixes from the acme-demo score were in the skills this run used. Fixing skills from this score would end kadamba-fit's blindness, and another blind measure would need a new fixture.
- The run sheet asks for the score and audit output to be committed under `examples/kadamba-fit.run-<n>/`. That wasn't done, because this scoring brief said not to commit.
