# SwiftDictionary U3.0 Phase 2 — Malay Dictionary closeout validation checkpoint

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Application commit:** `1d0ac17d5166e32ab59c9d29b0a35afeecdacf3c`  
**Dictionary package:** `u3-ms-dict-0.8.0`

## Owner-approved scope and current package

The eight Malay Dictionary authoring batches now contain **650 unique Malaysian Standard Malay headwords, 672 contextual senses and 1,344 English/Simplified Chinese per-sense support translations**. This reaches the lower boundary of the owner's approved 650–750 target band. Batch 08 contributed 204 unique headwords.

The package remains draft and `ms` remains planned/inactive and unselectable. No Malay Lessons, Daily Learning, Quiz or Flashcards content was implemented.

## Additional automated closeout work

Added two tests to `tests/u3-phase2-malay-dictionary.test.mjs`:

1. Full-package learner-facing metadata and provenance assertions: each entry has Malaysian POS, category, headword examples, original-authorship declaration, explicit no-copy flag, draft editorial status, pending rights status and no reviewer falsely recorded. Every sense has Malay definition, English and Chinese support text, and contextual examples.
2. Exact translation-registry mapping: each of the 672 senses maps to exactly one `ms→en` and one `ms→zh` record, giving 1,344 unique records. Both revisions, machine-assisted draft status and provenance must be present.

## Validation

- U3.0 architecture, adapter, translation and content parity workflow passed on the final test commit: [workflow 45849090462](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45849090462).
- English dictionary QA passed on the same commit: [workflow 45849090452](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45849090452).
- The previously recorded Batch 08 final content validation remains: 650 unique headwords, 672 senses, 1,344 translations, no duplicate headwords or alias collisions, package version consistency and inactive-language gating ([workflow 45837848040](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837848040)).

These are automated checks. They do not establish competent Malaysian Standard Malay editorial review, independent translation review, source verification, item-level rights clearance or manual responsive/language QA.

## Outstanding Phase 2 exit requirements

- Competent human review of all Malay headwords, senses, examples, POS and Malaysian usage/register.
- Independent human review of English and Simplified Chinese support translations.
- Verification of sources consulted and item-level provenance/rights status; quarantine uncertain records.
- Subject-matter review of medical, technical, administrative and environmental terminology.
- Manual search/UI verification and a recorded responsive acceptance result.
- Updated review/approval states only after actual review; never convert machine-assisted drafts to approved by automation.

## Boundaries

No Supabase schema/data/Auth/RLS change or migration, Malay activation, staging preview, production `main` merge, production deployment or ZIP was made. No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysian PDPA and broader international privacy/legal review remain mandatory before public activation.

**Next:** Complete the human/editorial and provenance work above. Phase 3 (Malay Lessons and all four Daily Learning activities) remains next in the U3.0 sequence but must not be treated as started or preview-ready until Phase 2 exit is documented.
