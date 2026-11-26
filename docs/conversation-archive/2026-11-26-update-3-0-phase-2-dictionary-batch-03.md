# SwiftDictionary U3.0 — Phase 2 Malay Dictionary batch 03

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated application commit:** `353979dff00489f00c36af083d141a10e4219dfa`  
**Documentation branch:** `docs/master-development-record`  
**Status:** Batch 03 implemented and validated; Phase 2 remains in progress.

## 1. Owner's expanded scope

The owner requested a Malay Dictionary of approximately **700 unique headwords**, with an acceptable target band of **650–750**. This is a coverage target, not a quota. Lexical quality, natural Malaysian Standard Malay, sense accuracy, useful examples, careful morphology, unique headword identity and rights/provenance traceability take priority over raw count.

## 2. Batch 03 content

Added 69 new original-authored draft headwords covering:
- family and people;
- numbers and time;
- common actions and communication;
- home, rooms and everyday objects;
- transport and public places;
- food and household materials;
- body and health;
- nature, weather, plants and animals;
- descriptions, colours, quantities and core function words.

The package now contains:
- **123 unique headwords**;
- **145 contextual senses**;
- **290 English/Simplified Chinese support translation records** (one record per target language per sense).

The shared package revision is `u3-ms-dict-0.3.0`. The manifest, known content counts and automated test expectations were updated. All entries retain stable IDs, explicit language and content revisions, item-level original-authoring/provenance metadata, draft editorial status and pending rights review. All support translations remain `machine_assisted_draft`.

Batch 03 includes explicit morphological metadata only where a useful form is curated. Search aliases are checked for collisions against other headwords and aliases. Predictable inflections are not separate cards.

## 3. Validation

The successful [U3.0 architecture/content regression run 45798641246](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641246) passed **39/39 Node tests**, including:
- stable identity and unique headwords/senses;
- required per-sense English and Chinese draft translations;
- shared Dictionary contract validation;
- Malay explicit-form search and alias-collision checks;
- Unicode normalisation and morphology metadata;
- package adaptation, inactive-language gating and English/Chinese regression behaviour;
- exclusion of same-language translation pairs.

The [legacy U2.9.0 English Dictionary QA run 45798641233](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641233) also passed its English/Chinese content validators, Mock Quiz/Flashcards regressions and Chromium browser smoke tests on the same application commit.

## 4. Provenance, translation and review status

The lexical records are independently authored drafts; no DBP/PRPM/Kamus Dewan dictionary text, definitions or examples were copied or scraped. The English and Simplified Chinese support translations are machine-assisted drafts and are not approved. Automated structural/search tests do not replace a competent Malaysian Malay linguistic review, independent translation review, source verification or rights review.

DBP/PRPM and Kamus Dewan may be consulted to verify Malaysian spelling, usage and senses, but reproducing protected material requires the appropriate written permission or a compatible licence. Public access is not a reuse licence. Unclear-provenance material remains quarantined.

## 5. Current boundaries

- Phase 2 remains in progress; the target is approximately 700 headwords (650–750), and 123 are currently present.
- `ms` remains `planned` and is not loaded into the live course selector.
- No Malay Lessons, Daily Learning, Quiz or Flashcards work has started.
- No Supabase schema/data/Auth/RLS changes or migrations occurred.
- No staging-preview handoff before Phase 3; no production merge or deployment.
- Phase 1 production/staging schema drift remains a future database migration/activation gate.
- The Malaysian PDPA and general privacy/legal review remain required before public activation, including current phased commencement/guidance and the Tokyo/Singapore cross-border processing facts.
- No intermediate ZIP or preview is supplied.

**Next:** continue small, domain-balanced lexical batches toward the target range. Validate every batch before moving to the next; do not promote draft content without human review.
