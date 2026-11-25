# 2026-11-25 — SwiftDictionary Update 2.9.0 Phase 2 completion

## Owner instruction

The owner requested completion of the remaining Phase 2 work. The standing boundary remains unchanged: do not create or provide a staging preview until Phase 4 is implemented and internally validated.

## Phase 2 outcome

Phase 2 is complete on `feature/update-2-9-0-english-dictionary-collections`.

### English expansion

- Candidate inventory: 660 headwords; 506 authored and selected; 154 left as candidates rather than added as numerical padding.
- Seven source batches: 20, 20, 21, 19, 20, 177 and 229 entries.
- 506 unique new headwords; zero duplicates across batches; zero overlap with the 810-entry baseline.
- Final projected English dictionary: 1,316 unique headwords.
- 766 sense records across the 506 new entries.
- 183 multi-POS expansion entries now have distinct POS-specific sense records. No combined multi-POS sense labels remain.
- A focused POS-semantic audit found 38 further noun/verb records where one sense definition, translation or example still mixed the two grammatical meanings. These were corrected in Batch 06 and the consolidated runtime dataset.
- All new entries have required fields, valid slash-delimited pronunciation notation, at least two general examples, non-empty Simplified Chinese definitions, complete sense records and approved categories. The cross-file validator reports no duplicate headwords/examples, incomplete senses, missing POS mappings or runtime mismatches.

### Existing English baseline

The latest feature-branch `index.html` was parsed again and the baseline audit file refreshed:

- 810 unique headwords; zero duplicate headwords.
- 302 entries with 657 explicit sense records.
- 508 entries without explicit sense arrays; all 508 are single-POS entries. A missing sense array is not treated as an error when a clear primary sense is represented.
- All 176 multi-POS baseline entries have sense records covering every declared POS.
- All 810 baseline entries have at least two contextual general examples.
- Twenty additional high-frequency single-POS entries received 40 distinct sense records: active, adapt, afford, borrow, boundary, confidence, confuse, context, create, curious, decision, depend, difference, discover, discuss, effective, effort, encourage, evidence and expect.
- The refreshed machine-readable baseline report is `data/english-baseline-qa-audit.json`.

### Automated and browser verification

Latest full successful GitHub Actions run: **45537066279**, commit `399ad92e06cd93bcc9f1cc6eabb7a7222c22d45c`.

All steps passed:
1. Baseline-aware Node validator.
2. Seven-batch source/runtime equality and script load-order validation.
3. Playwright test-runner and Chromium setup.
4. Browser smoke test for the 1,316-entry English catalogue and headword-only search.
5. Browser smoke test for the new-entry detail drawer.
6. Browser smoke test confirming the Chinese character-only catalogue remains isolated and unchanged.

### Linguistic review limitation

Internal model-assisted editorial review and structural validation are complete. This is not independent professional/native-speaker certification of every lexical nuance, pronunciation accent variant or Chinese translation. The limitation is explicitly retained for release review; no claim of certified linguistic review is made.

## Phase status and boundaries

- Phase 1: complete.
- Phase 2: complete.
- Phase 3 — English categories and translation QA: not started.
- Phase 4 — Favorite collections: not started.
- Staging preview: withheld until Phase 4 implementation and internal validation are complete.
- No Supabase schema/data/policy writes, production merge/deployment, Premium activation, payment integration or entitlement enforcement occurred.
- Dictionary search remains free and unlimited.
- Proposed Free 16-folder / Premium 40-folder capacities remain planning only and are not enforced in U2.9.0.

## Recovery point

- Application branch: `feature/update-2-9-0-english-dictionary-collections`.
- Latest application commit: `399ad92e06cd93bcc9f1cc6eabb7a7222c22d45c`.
- Latest successful full QA run: `45537066279`.
- Updated implementation progress: `docs/U2.9.0-IMPLEMENTATION-PROGRESS.md` on the feature branch.
- Updated development plan and Master Development Record: `docs/master-development-record`.
