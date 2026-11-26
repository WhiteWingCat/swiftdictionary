# SwiftDictionary U3.0 — Phase 2 Malay Dictionary batch 05

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated application commit:** `f419789937478c8d32e48c2da9bf739e0f9f81e2`  
**Documentation branch:** `docs/master-development-record`  
**Status:** Batch 05 authored and architecture/content regression passed; Phase 2 remains in progress.

## 1. Content checkpoint

Batch 05 added **49 unique Malaysian Standard Malay headwords**, bringing the catalogue to:

- **226 unique headwords**
- **248 contextual senses**
- **496 English/Simplified Chinese support-translation records**

The new vocabulary covers transport and travel, places and public spaces, nature and geography, food, housing and household objects, clothing and hygiene, and everyday actions/communication. The batch favours common learner vocabulary and Malaysian usage rather than specialist terms.

The package revision is `u3-ms-dict-0.5.0`. The manifest records 226 headwords and 248 senses. New entries have stable IDs, one independently authored draft sense each, original Malay definitions/examples, English/Chinese machine-assisted draft translations, and item-level provenance/rights-review metadata. Search aliases are left empty for new entries unless a form has been individually reviewed.

## 2. Validation

The final [U3.0 architecture regression run 45801371395](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45801371395) passed **39/39 Node tests** on commit `f419789937478c8d32e48c2da9bf739e0f9f81e2`, including package identity/counts, sense/translation coverage, shared schema, Malay search and alias-collision validation, Unicode handling, inactive-language gating and English/Chinese adapter regressions.

The first batch 05 test attempt found that the existing `jalan` entry listed `perjalanan` as a search alias while `perjalanan` is now an independent headword. The alias was removed from `jalan`'s search forms (the related-word association remains); the final 39/39 run then passed. The failed attempt is retained as failure evidence, not counted as a pass.

The English Dictionary browser QA and Quiz database foundation workflows were triggered separately on the same feature branch. Their results must be inspected independently; neither is required for the static Malay Dictionary content test to pass. No U3.0 schema migration was created or applied.

## 3. Review and safety status

All 226 Malay entries remain draft. All 496 support translations remain machine-assisted drafts. Automated tests do not replace competent Malaysian Malay linguistic review, independent translation review, source verification or rights clearance.

The records are original-authored and no DBP/PRPM/Kamus Dewan protected text, definitions or examples were copied or scraped. Source/rights review remains pending. The standing Malaysia PDPA and international privacy/cross-border assessment remains required before public activation; this static-content batch adds no personal-data processing or external dictionary API.

## 4. Boundaries and next work

- Phase 0 and Phase 1 are complete; Phase 2 remains in progress.
- `ms` remains planned/inactive and is not selectable.
- No Malay Lessons, Daily Learning, Quiz or Flashcards implementation has started.
- No Supabase schema/data/Auth/RLS changes or migrations occurred.
- No staging-preview handoff before Phase 3; no production merge or deployment.
- No intermediate ZIP is supplied.

**Next:** continue small, sequential batches toward the 650–750 unique-headword target, with balanced coverage and batch-level validation. Preserve the distinction between automated validation and human linguistic/licensing approval.
