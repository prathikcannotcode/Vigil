# Tamarind run sheet

`examples/tamarind-lend` measures what Vigil finds when a gap turns on a sector rule: RBI's Digital Lending Directions and KYC Direction, and CERT-In's directions. Its key is `examples/tamarind-lend.expected.json`. As with kadamba-fit, one session audits and never opens the key, and a second session scores.

Four of the planted items are sector-only duties with no DPDP or GDPR clause behind them. A run can only place those correctly if its `/audit` sends such duties to a "Sector obligations" section of `summary.md` instead of filing a DPDP finding for them, so test a revision whose `AGENTS.md` and `/audit` step 7 say that.

## Audit session: cold, never opens the key

Export a committed revision, so uncommitted skill text can't help the audit. From the repo root, with `<commit>` set to the revision under test:

```bash
BLIND="$HOME/vigil-blind-tamarind"
mkdir -p "$BLIND/vigil" "$BLIND/tamarind-lend"
git archive <commit> | tar -x -C "$BLIND/vigil"
git archive <commit> examples/tamarind-lend | tar -x --strip-components=2 -C "$BLIND/tamarind-lend"
rm -rf "$BLIND"/vigil/examples/tamarind-lend* "$BLIND"/vigil/examples/kadamba-fit* "$BLIND"/vigil/examples/*.expected.json
```

Start a new session in `$BLIND/vigil`, with no other session's context, notes or transcripts, then:

1. Add the app with `/add-dir` and the path to `$BLIND/tamarind-lend`.
2. Run `/onboard` with company id `tamarind-lend`. Answer only from the company facts in the app's README.
3. Run `/audit` on the app. Do not open the original repo or use the web.
4. Run `npm run validate -- --strict` in `$BLIND/vigil`.
5. Hand over `assessments/<assessment_id>/` and the transcript. Do not score.

## Scoring session: separate, reads the key

Compare `report.json` and `summary.md` with the key.

- **Blindness.** Search the transcript for `expected.json`, `run-sheet` and `tamarind-lend.`. A hit in anything the audit session read voids the run.
- **Each `expected` item.** Found: the finding or summary entry names the mechanism, including the other files the issue text points to. Partial: right topic, mechanism missing or wrong. Missed: neither.
- **Landing.** For `lands: report`, the item should be a finding in `report.json`. For `lands: summary`, it should be under "Sector obligations" in `summary.md`; a `report.json` finding standing in for it counts as found but misfiled. For `lands: either`, both places are right.
- **Sector rule.** Record whether the finding's `cross_reference` or the summary entry names the instrument in the item's `sector` field, at instrument level. Record any instrument the run names that the catalog, the fintech guide and the key's `sources` do not.
- **Citation.** For report items, right if the finding or its `cross_reference` cites a key clause at section, rule or article level.
- **Timing.** Count DPDP findings that read as current violations instead of readiness gaps, and sector duties described as starting in 2027 instead of applying today.
- **Each `should_not_flag` item.** Violated if a finding or summary entry treats it as a gap. A neutral mention is clean.
- **Other findings.** A finding that matches a `known_gaps` item is a real gap. Check the rest against the code and call each a real unplanted gap or a false positive. GDPR findings are out of scope for this company.
- **Values.** Count files that copy a credential or identifier value from the app, including the Verilane key in `android/app/build.gradle`.

Report found, partial and missed out of the `expected` count, misfiled items, should-not-flag violations out of its count, and the other tallies. Commit the score with the audit output under `examples/tamarind-lend.run-<n>/`.

Tuning skills on a scored run ends this fixture's blindness. Say so in any later score; another blind measurement needs a new fixture.

## Key changes

None yet.
