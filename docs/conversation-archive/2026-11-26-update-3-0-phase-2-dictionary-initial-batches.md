# SwiftDictionary U3.0 — Phase 2 Malay Dictionary initial batches

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated application commit:** `0bba05d70dd8646a0d31f7bbe21bb143bb05a8f7`  
**Documentation branch:** `docs/master-development-record`  
**Status:** Phase 2 in progress; initial batches and adapter foundation implemented. Not a Phase 2 completion or release approval.

## 1. Work completed

The owner authorised Phase 2 on 2026-11-26. The phase execution contract was added in [U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md](../U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md), and the main development plan and MDR were updated.

Two sequential original-authored Malaysian Standard Malay Dictionary batches are now present in `data/languages/malay-dictionary.js`:
- 54 unique headwords;
- 76 contextual senses;
- 152 English/Simplified Chinese per-sense support translation records;
- categories, related terms, curated inflected search forms and morphology notes;
- stable entry/sense IDs, content revision and item-level provenance/editorial metadata.

The package currently prioritises common daily vocabulary, people and family, actions, places, education, food/drink, descriptions, time and common function words. It is an initial vocabulary foundation, not a complete dictionary catalogue.

## 2. Shared architecture and search work

- Added the planned Malay package manifest at `content/languages/ms/manifest.json`; it remains `planned`.
- Extended the Malay adapter to expose explicit morphology/search forms and to match only the canonical headword plus curated forms. No blind suffix stripping or automatic stemming is used.
- Search normalisation is case-insensitive and Unicode-normalised while preserving meaningful orthographic distinctions. Definitions and example sentences are not searched.
- Extended shared Dictionary package adaptation to preserve authored IDs, search forms, morphology, provenance and editorial status.
- Added per-sense Dictionary translation registration in the shared translation registry. The 152 Malay support translations are `machine_assisted_draft`; same-language source/target pairs are skipped.
- Existing English word-grid/IPA and Simplified Chinese single-character/Pinyin behaviours remain covered by regression tests.

The Malay package is intentionally not loaded by the live application bootstrap, not selectable in the course selector, and not activated. The existing registry status remains `planned`.

## 3. Validation

The successful [U3.0 architecture/content regression run 45790689541](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45790689541) passed **39/39 Node tests**:
- 29 existing U3.0 architecture/integration tests;
- 10 Malay Dictionary tests covering stable identity, duplicate headwords/senses, per-sense translation workflow metadata, shared content schema validation, explicit prefix/suffix/circumfix/reduplication metadata, morphology/search behaviour, alias collisions, Unicode normalisation, package adaptation, inactive-language gating, English/Chinese adapter behaviour and same-language translation exclusion.

The legacy [U2.9.0 English Dictionary QA run 45790689624](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45790689624) also passed all English/Chinese content validators, Mock Quiz/Flashcards regression tests and Chromium browser smoke tests on the same application commit. The test suite was updated to the actual 54-headword/76-sense package before the final successful run; no unresolved test failure is being treated as a pass.

Automated checks do not constitute professional linguistic review, source verification, copyright clearance or educational approval.

## 4. Provenance, copyright and legal planning

The entries are original drafts. No DBP/PRPM/Kamus Dewan dictionary text, definition or example was copied or scraped into the data. Each entry records original-authoring status, no copied source text, a pending rights-review state, draft editorial status and no reviewer identity. Translation fields are machine-assisted drafts and are not approved.

DBP/PRPM and Kamus Dewan may be consulted for checking Malaysian spelling, usage and senses, but DBP's official copyright notice states that reproducing its site content requires prior written permission: https://dbp.gov.my/hak-cipta/. Public access to a dictionary or search result is not a reuse licence. Do not bulk-import or mirror protected dictionary data.

The phase adds static lexical data and local search only; it adds no new personal-data collection, telemetry or external dictionary API. Before public activation, review the amended Malaysian PDPA, the phased commencement of Act A1727, current Commissioner circulars/guidelines, actual controller/processor roles, privacy notice, retention/deletion and Tokyo/Singapore cross-border processing facts. This is planning, not legal advice or compliance clearance. Official Commissioner information: https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024/.

## 5. Current boundaries and next work

- Phase 2 is in progress; more content batches, linguistic review, translation review, coverage and quality checks remain.
- `ms` remains planned/inactive and not selectable.
- No Malay Lessons, Daily Learning, Quiz or Flashcards work has started.
- No Supabase schema/data/Auth/RLS changes or SQL migrations occurred.
- No staging-preview handoff before Phase 3; no production merge or deployment.
- Phase 1 production/staging schema drift remains a mandatory reconciliation gate before later database migration, Malay database registration/activation or a release dependent on new schema/RPC behaviour.
- No ZIP or staging preview is provided at this intermediate checkpoint.

**Next:** continue small sequential content batches, refine the morphology/search test matrix, and conduct competent Malaysian Malay linguistic and rights review before Phase 2 closeout.
