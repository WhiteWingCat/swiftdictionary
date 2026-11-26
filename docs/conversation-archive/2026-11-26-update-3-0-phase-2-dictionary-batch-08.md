# U3.0 Phase 2 — Malay Dictionary batch 08 (corrected)

Date: 2026-11-26

## Outcome

Batch 08 is corrected to **181 new unique Malaysian Standard Malay headwords**. The complete package now contains **627 unique headwords, 649 contextual senses and 1,298 per-sense English/Simplified Chinese support-translation records**. Package revision: `u3-ms-dict-0.8.0`.

The earlier draft count of 650 entries was inaccurate: it included 23 repeated headwords (22 terms already present in earlier batches and one repeated `pekerja` record). Those duplicate records were removed. Two search-alias collisions were also resolved: `arahan` is retained as its own headword rather than an alias of `arah`, and `penghantaran` is retained as its own headword rather than an alias of `hantar`. The catalogue has 627 unique headwords, below the lower 650 target boundary; do not add marginal words merely to meet the count.

Coverage includes communication and digital life, administration and commerce, transport, sport, health and anatomy, food, household appliances, geography, weather, environmental care, community and function words. Entries use original-authored Malay draft definitions and contextual examples, per-sense English and Simplified Chinese machine-assisted draft translations, stable IDs and item-level provenance.

## Repository changes

Application branch: `feature/update-3.0-phase-0-audit`

- `data/languages/malay-dictionary.js` — removed repeated records, corrected all entry content versions to `u3-ms-dict-0.8.0`, and removed colliding aliases.
- `content/languages/ms/manifest.json` — corrected to 627 unique headwords and 649 senses.
- `tests/u3-phase2-malay-dictionary.test.mjs` — corrected unique headword and 1,298 translation assertions.

Current content/test/manifest head: `e8096149fed9bbe4c6aea8e4948ea8dce41a1a06`.

## Validation state

An earlier architecture run identified three issues: stale/inaccurate count assertions, duplicate headwords, and alias collisions. The duplicate entries and conflicting aliases have been corrected. Final-head U3.0 architecture regression and English Dictionary QA are running; this archive must be updated with their final conclusions before batch 08 is signed off. Do not treat earlier workflow runs as final-head validation.

## Editorial, legal and activation status

All 627 records remain original-authored drafts. All 1,298 support translations remain machine-assisted drafts. Competent human Malaysian Standard Malay review, independent translation review, source verification and item-level rights clearance remain outstanding. Medical, technical, administrative and environmental vocabulary needs subject-matter review. Automated checks do not replace professional editorial validation.

No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysia PDPA and broader international privacy/legal review remain required before public launch.

The `ms` package remains planned/inactive and unselectable. No Malay Lessons, Daily Learning, Quiz or Flashcards content was added. No Supabase schema/data/Auth/RLS changes or migrations, staging preview, main merge, production deployment or ZIP occurred.

## Next actions

1. Confirm final-head architecture regression and English Dictionary QA.
2. Inspect any remaining failures and correct structural, count, alias, translation or runtime regressions.
3. Run whole-catalogue example-quality and lexical review, especially technical and medical terms.
4. Expand further only with useful, distinct Malaysian Standard Malay headwords; do not pad to 650.
5. Keep Malay inactive until all U3.0 activation gates are satisfied.
