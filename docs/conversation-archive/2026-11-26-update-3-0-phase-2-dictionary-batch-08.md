# U3.0 Phase 2 — Malay Dictionary batch 08 (final content)

Date: 2026-11-26

## Outcome

Batch 08 adds **204 new unique Malaysian Standard Malay headwords**. The complete package now contains **650 unique headwords, 672 contextual senses and 1,344 per-sense English/Simplified Chinese support-translation records**. Package revision: `u3-ms-dict-0.8.0`.

The initial batch-08 draft contained 23 repeated headwords (22 terms already present in earlier batches and one repeated `pekerja` record). Those duplicates were removed. To meet the owner's 100+ new unique headword batch requirement and enter the lower edge of the 650–750 target band without padding, 23 distinct and useful terms were added. Two alias collisions were also resolved: `arahan` remains its own headword rather than an alias of `arah`, and `penghantaran` remains its own headword rather than an alias of `hantar`. The subsequent architecture regression verifies unique headwords and search-alias ownership.

New coverage includes communication and digital life, administration and commerce, transport, sport, health and anatomy, food, household appliances, geography, weather, environmental care, community, household items, shopping and public navigation. Entries use original-authored Malay draft definitions and contextual examples, per-sense English and Simplified Chinese machine-assisted draft translations, stable IDs and item-level provenance.

## Repository changes

Application branch: `feature/update-3.0-phase-0-audit`

- `data/languages/malay-dictionary.js` — final 204-headword batch, package revision `u3-ms-dict-0.8.0`, duplicate cleanup, version consistency and alias-collision fixes.
- `content/languages/ms/manifest.json` — 650 unique headwords and 672 senses.
- `tests/u3-phase2-malay-dictionary.test.mjs` — 650 headword and 1,344 translation assertions.

Latest application content/test/manifest commit: `c02cf9f2841f872bd1a68fe10fb24a5732fff522`.

## Validation state

The preceding corrected 627-headword checkpoint passed the U3.0 architecture regression **39/39** on commit `95ec6ac2797913ab96b4a59a01af10b99aba3bc4`, workflow [45837310858](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837310858). Final-head validation passed on application commit c02cf9f2841f872bd1a68fe10fb24a5732fff522: U3.0 architecture regression **39/39** ([run 45837848040](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837848040)) and English Dictionary QA ([run 45837847935](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837847935)). The final regression confirms 650 unique Malay headwords, 672 senses, 1,344 en/zh translation records, consistent u3-ms-dict-0.8.0 versioning, no duplicate headwords or search-alias collisions, shared Dictionary contract compliance, and that Malay remains inactive/unselectable. The separate Quiz workflow is unrelated to Malay content validation and is not a release gate for this batch.

A whole-batch source scan found no generic repeated example templates in the new batch. Competent human review is still required for lexical accuracy, naturalness, translations and specialist vocabulary.

## Editorial, legal and activation status

All 650 records remain original-authored drafts. All 1,344 support translations remain machine-assisted drafts. Competent human Malaysian Standard Malay review, independent translation review, source verification and item-level rights clearance remain outstanding. Medical, technical, administrative and environmental vocabulary needs subject-matter review. Automated checks do not replace professional editorial validation.

No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysia PDPA and broader international privacy/legal review remain required before public launch.

The `ms` package remains planned/inactive and unselectable. No Malay Lessons, Daily Learning, Quiz or Flashcards content was added. No Supabase schema/data/Auth/RLS changes or migrations, staging preview, main merge, production deployment or ZIP occurred.

## Next actions

1. Confirm final-head architecture regression and English Dictionary QA.
2. Review Malaysian Standard Malay definitions and examples with a competent human editor.
3. Independently review English and Simplified Chinese translations.
4. Verify sources and rights for every content record.
5. Keep Malay inactive until all U3.0 activation gates are satisfied.
