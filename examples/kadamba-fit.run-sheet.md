# Kadamba Fit run sheet

`examples/kadamba-fit` measures what Vigil detects and what it wrongly flags. Its key is `examples/kadamba-fit.expected.json`. Two sessions do the work, because whoever has read the key cannot run the audit.

## Audit session: cold, never opens the key

Whoever prepares the run exports a committed revision, so uncommitted skill text cannot help the audit. From the repo root, with `<commit>` set to the revision under test:

```bash
BLIND="$HOME/vigil-blind-run"
mkdir -p "$BLIND/vigil" "$BLIND/kadamba-fit"
git archive <commit> | tar -x -C "$BLIND/vigil"
git archive <commit> examples/kadamba-fit | tar -x --strip-components=2 -C "$BLIND/kadamba-fit"
rm -rf "$BLIND/vigil/examples/kadamba-fit" "$BLIND"/vigil/examples/kadamba-fit.* "$BLIND"/vigil/examples/*.expected.json
```

Start a new session in `$BLIND/vigil`, with no other session's context, notes or transcripts, then:

1. Add the app with `/add-dir` and the path to `$BLIND/kadamba-fit`.
2. Run `/onboard` with company id `kadamba-fit`. Answer only from the company facts in the app's README.
3. Run `/audit` on the app. Do not open the original repo or use the web.
4. Run `npm run validate -- --strict` in `$BLIND/vigil`.
5. Hand over `assessments/<assessment_id>/` and the transcript. Do not score.

## Scoring session: separate, reads the key

Compare `report.json` with the key.

- **Blindness.** Search the transcript for `expected.json` and `run-sheet`. A hit in anything the audit session read voids the run.
- **Each `expected` item.** Found: the finding names the mechanism, including the other files the issue text points to. Partial: right topic, mechanism missing or wrong. Missed: neither.
- **Citation.** Right if the finding, or its `cross_reference`, cites a key clause at section, rule or article level. Record any clause the catalogs do not list.
- **Each `should_not_flag` item.** Violated if a finding treats it as a gap. A neutral mention is clean.
- **Other findings.** A finding that matches a `known_gaps` item is a real gap. Check the rest against the code and call each a real unplanted gap or a false positive.
- **Commencement.** Count DPDP findings that read as current violations instead of readiness gaps.
- **Values.** Count findings that copy a credential or identifier value.

Report found, partial and missed out of the `expected` count, should-not-flag violations out of its count, and the other tallies. Commit the score with the audit output under `examples/kadamba-fit.run-<n>/`.

Tuning skills on a scored run ends this fixture's blindness. Say so in any later score; another blind measurement needs a new fixture.

## Key changes

- **8 November 2026.** Changed after the first scored run (`assessments/2026-11-05-kadamba-cold-full`, scored against the key at `b6d1c44`). That run found real gaps the key had missed, and three of its should-not-flag breaches traced to notes that were too broad or wrong: the notice's rights list, the invoice basis for the Irish entity and the consent-event purge. Those notes are narrowed or corrected, and `known_gaps` records six real gaps. The app files are unchanged, and that score stands against the original key.
