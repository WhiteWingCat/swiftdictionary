# Malay Dictionary editorial review worksheet

**Package:** `u3-ms-dict-0.8.0`  
**Source:** `data/languages/malay-dictionary.js`  
**Target standard:** Malaysian Standard Malay (`ms-MY`)  
**Status:** All entries and translations are drafts. This worksheet is a tracking aid, not evidence that review has happened.

## Files

- `malay-dictionary-editorial-review-worksheet.csv` — one row for each of the 650 unique headwords. Review every sense attached to that entry, not just its headword-level definition.

## Review inventory

- 650 unique headwords.
- 672 contextual senses.
- 1,344 support translations: one English and one Simplified Chinese draft per sense.

The worksheet is generated from the current language-owned dictionary package and includes stable entry IDs. Use each entry ID to locate the entry and inspect its complete `senses[]` array in the source file. Each sense has its own stable ID. Do not treat an entry as reviewed until all of its senses and their examples have been checked.

## Required review sequence

1. **Malay editorial review:** verify spelling, Malaysian usage, part of speech, definitions, sense distinctions, grammar, register, naturalness and contextual examples. Avoid Indonesian-only vocabulary or conventions unless explicitly labelled as contrastive.
2. **Search/morphology review:** check canonical headword, explicit search forms, affixation, reduplication and any possible false positives or missing common forms. Aliases must not create extra grid cards.
3. **English support translation:** independently verify every sense's contextual meaning and natural phrasing. Do not flatten multiple senses into one translation.
4. **Simplified Chinese support translation:** independently verify every sense and use natural Simplified Chinese. Keep sense distinctions aligned with the Malay source.
5. **Source/provenance review:** record the source actually consulted, edition/version, access date and the purpose of consultation. A source consulted for verification is not permission to reproduce its text.
6. **Rights review:** confirm original authorship or a documented licence/permission compatible with public redistribution. Quarantine uncertain items. DBP/PRPM/Kamus Dewan material must not be copied or scraped without written permission/licensing.
7. **Specialist review:** flag medical, technical, legal/administrative, environmental and other specialist terms for an appropriately competent reviewer.
8. **Decision:** use `approved` only after all required reviews are complete and the reviewer is identifiable. Use `needs_revision`, `quarantined` or `not_applicable` where appropriate. Keep unresolved items pending.

## CSV field conventions

- `pending`: not yet reviewed.
- `assess`: determine whether specialist review is needed.
- `approved`: human reviewer has completed the relevant review; enter reviewer ID and date.
- `needs_revision`: changes are required; describe them in issues/notes.
- `quarantined`: source, accuracy or rights uncertainty prevents publication.
- `not_applicable`: explain why the check does not apply.

Do not fill reviewer IDs, review dates, source records or approval decisions on behalf of a reviewer. Do not change package editorial or translation statuses until actual review is complete and the review evidence is retained.

## Limitations and release gate

The worksheet does not independently verify linguistic correctness, translation quality, source history, licensing, legal compliance or responsive behaviour. It cannot replace a competent Malaysian Standard Malay editor, independent English and Chinese reviewers, specialist reviewers or legal advice.

Phase 2 remains open until human review and provenance/rights closeout are recorded. Malay remains planned/inactive. No Phase 3 implementation, staging preview, database activation, production merge or deployment is authorised by creating this worksheet.
