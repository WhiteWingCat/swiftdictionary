# SwiftDictionary Update 3.0.0 — Phase 3 Daily Topic and Daily Application Expansion (Batch 02)

**Date:** 2026-11-27  
**Status:** Implemented on the U3.0 feature branch; automated runtime and package-integration checks passed. Human linguistic review and staging review remain pending.

## Owner direction

The owner asked to complete the initial target of 30 Daily Topics and 30 Daily Applications in one substantial pass, rather than spreading that target over several small batches. The priority is justified by the recurring daily nature of these activities. Permanent Malay Lessons remain in the programme but are not to crowd out the daily categories.

## Work completed

Batch 02 added **18 Daily Topics** and **17 Daily Applications**, completing the initial target:

- Daily Topic: 12 → **30**
- Daily Application: 13 → **30**
- Daily Discovery: **93** (preserved)
- Daily Revision: adaptive and progress-driven; no fixed catalogue count
- Permanent Malay Lessons: **72** (24 Beginner, 24 Intermediate, 24 Advanced; unchanged in this batch)

The fixed Daily Learning inventory is now **153 records** (30 Topics + 30 Applications + 93 Discovery entries), excluding adaptive Revision.

### Topic coverage added

**Beginner (6):** household chores; school items; daily weather; clothing and uses; healthy routines; public places.

**Intermediate (5):** measurements and quantities; comparison and degree; conditional sentences; quoting and paraphrasing; transitions between paragraphs.

**Advanced (7):** tone and register; evaluating generalisations; synthesising multiple sources; counterarguments and rebuttals; interpreting data and limitations; editing ambiguous sentences; evidence-based recommendations.

### Application coverage added

**Beginner (5):** arrange a daily schedule; choose suitable clothing; ask for help at school; get help in a public place; describe a healthy habit.

**Intermediate (5):** choose measurement units; compare options; complete a conditional sentence; paraphrase without changing meaning; improve paragraph transitions.

**Advanced (7):** adapt register for an audience; check a general claim; synthesise source findings; respond fairly to a counterargument; explain data limitations; edit ambiguous sentences; build an assessable recommendation.

Each new Topic has Malay, English and Simplified Chinese titles, explanatory text and examples. Each new Application includes a multilingual prompt, four distinct choices with Malay/English/Simplified Chinese text, and a keyed answer. New Application records are linked to corresponding Topic IDs.

## Difficulty balance

Runtime verification found the final distribution to be exactly balanced:

| Category | Beginner | Intermediate | Advanced | Total |
|---|---:|---:|---:|---:|
| Daily Topic | 10 | 10 | 10 | 30 |
| Daily Application | 10 | 10 | 10 | 30 |

During verification, the time-and-duration Topic was reclassified as Intermediate so the final Topic distribution is balanced. This is a curriculum classification choice, not a claim of human linguistic approval.

## Implementation

- Updated `data/malay-daily-learning.js` on `feature/update-3.0-phase-0-audit`.
- Daily content version: `u3-ms-daily-0.3.0`.
- Updated `tests/u3-phase3-malay-learning.test.mjs` to require exactly 30 Topics and 30 Applications, balanced difficulty counts, multilingual content and options, and valid Topic references.
- The new records retain draft editorial/translation status. No new personal-data fields, tracking, external API dependency or database schema change was introduced.
- The 93 Discovery entries remain generated from the first 93 Malay dictionary records. Revision remains adaptive and is not converted into a finite catalogue.

## Validation

The updated dictionary, Lessons, expansion batches and Daily Learning source files were executed together in an isolated JavaScript runtime with the shared language registry, content contracts, translation registry, adapters and content-package loader.

**Results:**
- JavaScript source execution: passed.
- Malay dictionary inventory: 650 entries.
- Permanent Lessons inventory: 72.
- Daily Topic / Application / Discovery: 30 / 30 / 93.
- Topic and Application difficulty balance: 10 / 10 / 10 each.
- Topic IDs and Application IDs: unique (30 each).
- New Application questions: four options; answer indices valid; all question and option language fields populated.
- New Application-to-Topic references: valid.
- Shared content-package creation: active.
- Package daily counts: 30 / 30 / 93.
- Dictionary translation records: 1,344, all remain draft in the existing contract.

No full GitHub Actions 45-test run is claimed for this batch. The checks above are the isolated runtime and package-integration checks actually performed; they do not replace the full CI suite, browser/device acceptance or staging review.

## Legal, provenance and review safeguards

This batch consists of independently drafted educational prompts and examples; no external dictionary text or third-party source passages were copied into these records. No new collection or processing of personal data was introduced, so this content-only change creates no new PDPA data-processing surface. The existing Malaysia PDPA and international privacy planning gates remain in force for the product as a whole.

Human Malaysian Standard Malay editorial review, independent English/Simplified Chinese translation review, item-level source/provenance verification and rights clearance remain pending by the owner's staging-review decision. Do not mark any of this content human-reviewed or approved. Any unresolved rights/provenance item must be corrected or excluded before public activation.

## Release boundaries

- Do not provide a staging preview until all of Phase 3 is complete and internally verified.
- No merge to `main`, production deployment, production database mutation or staging handoff was performed or authorised by this batch.
- Phase 3 still includes the remaining Malay learning foundation and end-to-end verification; Phases 4–7 remain mandatory under the U3.0 plan.
