# SwiftDictionary U3.0 — Phase 2 editorial review preparation

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Dictionary package:** `u3-ms-dict-0.8.0`

## Why this work was done

The owner directed work to proceed after the Phase 2 Batch 08 checkpoint. The U3.0 plan still requires human Malaysian Standard Malay editorial review, independent English and Simplified Chinese translation review, source verification and item-level rights clearance before Phase 2 can exit. Automated tests cannot supply those human approvals.

## Deliverables

- [650-row headword review worksheet](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/review/malay-dictionary-editorial-review-worksheet.csv)
- [Review instructions and decision conventions](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/review/README.md)

The worksheet was generated from the language-owned dictionary package and the inventory was checked before export: **650 unique entry IDs and 650 unique normalized headwords**. It contains fields for Malay spelling, POS, senses, examples, search/morphology, English and Simplified Chinese support translation review, source verification, rights clearance, specialist review, reviewer identity/date, decision and notes.

The worksheet is one row per headword. It is not one row per sense or translation. Reviewers must inspect all **672 senses** and all **1,344 translation records** under each parent entry before marking the entry reviewed. No reviewer identity, date, source, rights decision or approval state has been invented or prefilled.

## Required review handling

- Confirm Malaysian Standard Malay spelling, grammar, register, POS, definitions and natural examples.
- Review each contextual sense separately.
- Independently review each English and Simplified Chinese translation against its Malay source sense.
- Verify actual consulted sources and record edition/version/access date; distinguish verification from permission to reuse.
- Resolve rights/licensing per item or quarantine uncertain content.
- Route specialist terminology to competent subject-matter reviewers.
- Keep all items pending until real review evidence is available.

## Phase status and boundaries

Phase 2 authoring target is reached; automated structural/architecture checks are recorded; human/editorial/provenance closeout remains open. Phase 3 implementation remains gated. No Malay activation, Supabase change/migration, staging preview, production merge or deployment occurred. Malaysian PDPA and international privacy/legal review remain required before public launch.

**Plan:** [Update 3.0 Development Plan](../UPDATE-3.0-DEVELOPMENT-PLAN.md).
