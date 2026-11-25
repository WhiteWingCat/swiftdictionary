# 2026-11-25 — Update 2.9.0 Phase 2 content audit and validator hardening

## Session purpose

Continue the owner-authorised Update 2.9.0 implementation after reading the latest Master Development Record, approved development plan and relevant 2026-11-24 archives. The owner explicitly instructed that no staging preview be prepared until Phase 4 is complete and internally validated.

## Authority and boundaries

- Approved scope and sequencing remain in `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`.
- Application work remains isolated on `feature/update-2-9-0-english-dictionary-collections`.
- No staging preview, production merge, production deployment, production database write, Supabase schema change, or payment/subscription implementation was performed.
- Dictionary search remains free and unlimited.
- Proposed Free 16-folder / Premium 40-folder capacities remain future planning only and are not enforced in U2.9.0.
- Phase 4 must not begin without a fresh schema/RLS/RPC/migration audit. The Supabase skill was read during this session; production and staging remain untouched.

## Phase 2 — English expansion

### Consolidated expansion

- The 506 new English entries remain organised in seven source batches: 20, 20, 21, 19, 20, 177 and 229 entries.
- All 506 entries have unique normalised headwords and zero overlap with the 810-entry baseline.
- The consolidated runtime dataset `data/english-expansion.js` matches the ordered source batches exactly and is loaded before the inline application dictionary state initialisation.
- Projected English dictionary size: 1,316 unique headwords.

### New-entry validation and editorial corrections

A fresh cross-file audit checked all seven batches:

- 506 entries / 506 unique normalised headwords.
- Zero duplicate batch headwords or baseline overlaps.
- Zero missing required word/POS/pronunciation/definition/Chinese definition/tip/course/category/example/sense fields.
- All entries have at least two non-empty general examples.
- All 686 sense records have an English definition, Simplified Chinese translation and contextual example(s).
- Zero missing declared POS-to-sense mappings.
- All category labels are from the approved ten-category set.
- Zero repeated general examples within an entry.
- Thirteen noun/verb records were rewritten where the two POS slots had duplicated the same definition and examples: order, place, position, price, reason, record, rule, sample, service, shape, sign, size and sound.
- Seven repeated examples across separate senses were replaced with context-appropriate examples: judge, pull, report, rescue, form, matter and name.

### Existing baseline review

The complete embedded English array was parsed from the feature-branch application source:

- 810 entries / 810 unique headwords.
- Zero missing core fields.
- Every entry has at least two non-empty general examples.
- Zero duplicate general examples within an entry.
- Zero definitions shorter than 20 characters after targeted improvements.
- 270 entries contain explicit sense arrays, with 593 total senses.
- All 176 multi-POS entries now have sense coverage for every declared POS. Five missing noun senses were added to miss, go, hold, leave and call.
- Five weak definitions, Simplified Chinese glosses and IPA transcriptions were improved: frequent, frequently, rarely, recently and similarly.
- 540 baseline entries do not have an explicit senses array; these are predominantly single-POS entries. Absence of a sense array is not automatically an error when one clear sense is represented.
- This broad structural and targeted editorial review is not professional/native-speaker certification of every lexical nuance or translation.

### Validator hardening and CI evidence

- Extended `scripts/dictionary/validate-english-expansion.mjs` to check the existing baseline as well as the new entries. It now fails on missing core fields, fewer than two non-empty general examples, invalid slash-delimited pronunciation notation, incomplete existing sense records and missing senses for declared multi-POS baseline entries.
- A first validator-enhancement CI run failed due to an over-escaped IPA regular expression. The Node syntax error was read from the workflow logs, corrected, and the next run passed.
- An earlier workflow run briefly failed because it began after a batch-file commit but before the subsequent runtime-sync commit. The runtime dataset was regenerated from the current source batches and the subsequent run passed.
- Latest successful full CI run: **45534072220**, commit `c88b637e8e9cb7042c7c7763ae41113cec2d1779`. The Node validator, runtime equality/load-order checks, Playwright setup, Chromium setup and all three browser smoke tests passed.
- Browser smoke tests cover the 1,316-entry English catalogue and headword-only search, the new-entry detail drawer, and preservation of the Chinese character-only catalogue.

## Phase status and next work

- Phase 1: complete.
- Phase 2: expansion authored, runtime integrated, baseline-aware automated validation and browser smoke tests passing. Full semantic/native-quality review of all 1,316 English entries and manual sense-level Simplified Chinese translation review remain outstanding; therefore Phase 2 is not being marked complete prematurely.
- Phase 3: not started. It must implement the English category filters and classify existing and new entries, while preserving headword-only search and Chinese course behaviour.
- Phase 4: not started. Before implementation, inspect current Supabase migrations, tables, constraints, indexes, RLS policies, grants, RPCs, saved-word identity, account switching and sync. Collections must support mixed English/Chinese words and remain account-owned.
- Staging preview must remain withheld until Phase 4 is implemented and internally validated.

## Legal, privacy and licensing

- Malaysia PDPA applicability remains fact-specific; obtain jurisdiction-appropriate advice before public onboarding or monetisation.
- The intended global 16+ audience still requires jurisdiction-specific child/teen privacy screening.
- Collection names and memberships are account-linked personal data and should be minimised, access-controlled and covered by retention/deletion policy.
- Reassess cross-border processing across Supabase, hosting, logs, backups and subprocessors.
- Review provenance/licensing for new definitions, translations and examples before public release or future monetisation.
- Premium payments, recurring billing, consumer disclosures, cancellation/refund terms and tax obligations are outside U2.9.0 and require a separate review before activation.

## Recovery point

- Application branch: `feature/update-2-9-0-english-dictionary-collections`.
- Latest relevant application/validator commit: `c88b637e8e9cb7042c7c7763ae41113cec2d1779`.
- Latest progress record on the feature branch: `docs/U2.9.0-IMPLEMENTATION-PROGRESS.md`.
- No PR was opened and no staging preview was created.
- Documentation for this session belongs only on `docs/master-development-record`; never merge internal planning/archives into production `main`.
