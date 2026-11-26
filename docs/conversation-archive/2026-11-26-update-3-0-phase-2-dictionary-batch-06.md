# SwiftDictionary U3.0 — Phase 2 Malay Dictionary batch 06

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated application commit:** `9ac14ca9732eef61be625e7a89573e9168ef059e`  
**Documentation branch:** `docs/master-development-record`  
**Status:** Batch 06 authored; architecture/content regression passed; Phase 2 remains in progress.

## 1. Owner direction on batch size

The owner requested batches of **100+ new unique headwords** rather than the previous 49–54 entry batches. Future batches should aim for approximately 100–120 new unique headwords where quality and validation permit. This is a batch-size expectation, not a quota that permits duplicate, marginal or weak entries.

## 2. Batch 06 content

Batch 06 added **110 unique Malaysian Standard Malay headwords**. The package now contains:

- **336 unique headwords**
- **358 contextual senses**
- **716 English/Simplified Chinese per-sense support-translation records**

New coverage includes family and people, education, food and meals, household objects, descriptions and emotions, function words and grammar, public administration, communication, health, everyday actions and general learner vocabulary.

The package and manifest revision is `u3-ms-dict-0.6.0`. Entries use the existing language-owned `makeEntry` helper and the established schema, stable IDs, Malay definitions and examples, per-sense English/Chinese support text, explicit machine-assisted draft translation status, and original-authorship/provenance metadata. Search aliases remain empty by default; no mechanical stemming or unreviewed morphology expansion was added.

## 3. Validation

The final [U3.0 architecture/content regression run 45813318122](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45813318122) passed **39/39 tests** on commit `9ac14ca9732eef61be625e7a89573e9168ef059e`.

The tests cover package identity and counts, stable/unique headwords and sense IDs, required fields, per-sense en/zh support translations and draft status, provenance and rights metadata, shared Dictionary schema, Malay explicit-form/headword-only search, search alias collisions, Unicode handling, inactive-language gating, and English/Chinese adapter regressions.

An intermediate workflow on the content-only commit failed two count assertions because the test file still expected the prior 226 entries and 496 translations. The manifest and test expectations were then updated to 336 entries, 358 senses and 716 translation records; the subsequent final run passed. The intermediate failure is recorded as a failed attempt, not counted as validation success.

The separate English Dictionary QA and Quiz database foundation workflows were still running when this archive was authored and must be inspected separately. No U3.0 database migration was created or applied.

## 4. Review, provenance and legal status

All 336 Malay entries remain draft; all 716 support translations remain machine-assisted drafts. Automated tests do not constitute competent Malaysian Malay linguistic review, independent translation review, source verification or rights clearance.

The entries are original-authored. No DBP/PRPM/Kamus Dewan protected text, definitions or examples were copied or scraped. Item-level source and rights review remain pending. Malaysia PDPA and international privacy/cross-border review remain release-planning requirements; this static dictionary batch adds no personal-data processing or external dictionary API.

## 5. Boundaries and next work

- Phase 0 and Phase 1 remain complete; Phase 2 remains in progress.
- `ms` remains planned/inactive and is not selectable.
- No Malay Lessons, Daily Learning, Quiz or Flashcards implementation has begun.
- No Supabase schema/data/Auth/RLS changes or migrations occurred.
- No staging-preview handoff before Phase 3; no production merge or deployment.
- No intermediate ZIP is supplied.
- Future batches must contain 100+ new unique headwords, aiming for approximately 100–120 where content quality and validation permit.

**Next:** continue sequential batches toward 650–750 unique headwords while preserving distinct lexical value, Malaysian Standard Malay usage, natural examples, translation status, provenance and regression checks.
