# SwiftDictionary U3.0 — Phase 2 Malay Dictionary batch 04

**Date:** 2026-11-26  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated application commit:** `729b4305db6ad7d87c08896b01eff89b05729b3e`  
**Documentation branch:** `docs/master-development-record`  
**Status:** Batch 04 authored and architecture/content regression passed; Phase 2 remains in progress.

## 1. Scope and owner direction

Continue the Malaysian Standard Malay Dictionary toward approximately 700 unique headwords (acceptable band 650–750). This is a quality-led coverage target, not a quota. Do not pad the catalogue with predictable inflections, duplicates or weak entries.

## 2. Batch 04 content

Added **54 unique headwords**, bringing the package totals to:

- **177 unique headwords**
- **199 contextual senses**
- **398 English/Simplified Chinese support-translation records** (one record per target language per sense)

New coverage includes employment and workplaces, salary and money, prices and payment, buying and selling, shops and markets, banking, customers and services, healthcare, public safety and emergency services, public institutions, education, computers and communication, weather and natural hazards, and general concepts such as purpose, reasons, opportunity, success and failure.

All new entries use stable IDs, Malaysian part-of-speech labels, independently authored Malay definitions and examples, separate English/Chinese sense support text, explicit draft translation states and item-level provenance/rights-review metadata. Pronunciation is left unspecified rather than invented. Search aliases are not added without a specific lexical review.

The package and manifest revision is now `u3-ms-dict-0.4.0`. The manifest records 177 headwords and 199 senses; the Malay package remains `planned` and inactive.

## 3. Validation and corrections

The final [U3.0 architecture regression run 45801008034](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45801008034) passed **39/39 Node tests**, including:
- stable entry and sense IDs, unique headwords and required fields;
- per-sense English/Chinese translation presence and draft status;
- shared Dictionary schema and package adaptation;
- Malay explicit-form search, Unicode normalisation and alias-collision validation;
- preservation of English and Chinese adapter behaviour;
- planned/inactive language gating and no same-language translation pairs.

The first CI attempt found that some newly added lemmas overlapped with existing headwords and that existing search aliases for `kerja` and `bayar` collided with the canonical headwords `pekerja`, `pekerjaan` and `bayaran`. Those collisions were corrected by removing the overlapping new records and restricting the old entries' search aliases. A subsequent run still identified the `pekerjaan` alias collision; that was also corrected. The final 39/39 run passed on commit `729b4305db6ad7d87c08896b01eff89b05729b3e`. Failed runs are retained as failure evidence, not counted as successful validation.

The English Dictionary browser QA and Quiz database foundation workflows were triggered for the same application branch. Their final results must be checked separately before claiming broader non-regression or database validation. No U3.0 database migration was created or applied.

## 4. Editorial, translation and legal status

All 177 lexical entries remain draft. The 398 support translations remain machine-assisted drafts. Automated validation does not constitute professional Malaysian Malay linguistic review, independent translation review, source verification or rights clearance.

The content was independently authored; no DBP/PRPM/Kamus Dewan dictionary text, definitions or examples were copied or scraped. Those sources may be consulted for linguistic verification only, unless appropriate reuse permission/licensing is obtained. Item-level rights review and human editorial review remain pending.

The phase adds static lexical content and local search only. It adds no personal-data processing, tracking or external dictionary API. The standing Malaysian PDPA, international privacy, cross-border processing and intended 16+ safeguards remain release planning requirements, not legal clearance.

## 5. Boundaries and recovery point

- Phase 0 and Phase 1 remain complete; Phase 2 remains in progress.
- `ms` remains planned/inactive and is not selectable.
- No Malay Lessons, Daily Learning, Quiz or Flashcards implementation has begun.
- No Supabase schema/data/Auth/RLS changes or migrations occurred.
- No staging-preview handoff before Phase 3; no merge to production `main` or deployment.
- The Phase 1 production/staging schema drift remains a future migration/activation gate.
- No intermediate ZIP is supplied.

**Next:** continue small, sequential and domain-balanced batches toward the 650–750 unique-headword target. Validate each batch, then consolidate. Maintain the separation between automated checks and human linguistic/licensing review.
