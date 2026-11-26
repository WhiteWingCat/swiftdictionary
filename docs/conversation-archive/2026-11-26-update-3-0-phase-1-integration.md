# SwiftDictionary Update 3.0.0 — Phase 1 Integration Checkpoint

**Date:** 2026-11-26  
**Feature branch:** `feature/update-3.0-phase-0-audit`  
**Status:** Architecture and legacy-modernisation implementation is in place; formal Phase 1 exit remains open.

## Implementation integrated

- Runtime language registry: English and Simplified Chinese active; Malaysian Standard Malay (`ms`, `ms-MY`) registered as planned and not selectable.
- Language-specific adapters preserve English word/IPA behaviour, Chinese single-Han/Pinyin/stroke-order behaviour, and a separate Malay affix-aware search contract.
- Shared content contracts, package registry, translation registry and legacy bootstrap.
- Version-controlled manifests for `en`, `zh`, and `ms`.
- English and Chinese Dictionary source data extracted into language-owned files; English Lessons extracted into its own language-owned file.
- Application bootstrap order updated to load registry/contracts/translation registry/adapters/package registry before package bootstrap.
- Daily Learning resolves content by language package and rejects unsupported language content instead of silently falling back to English.
- Flashcards requires a registered language adapter and does not silently treat every non-Chinese course as English.
- Saved-word parsing, Collections and anonymous account-deletion paths use registered language codes.
- English and Chinese Quiz validators share generic language-pair and question-envelope checks while retaining their curriculum-specific and linguistic safeguards.
- Database migration design documents the en/zh-only constraints, RPC/trigger inventory, schema drift and expand/migrate/verify/contract approach. It is design only; no migration was applied.

Legacy English lesson translations are registered as `legacy_unverified` until their review provenance is confirmed. This status is not equivalent to reviewed or approved.

## Validation evidence

- 22 core Node architecture/integration tests passed locally.
- Application script dependency order and language manifest activation states were checked against the feature branch.
- English Dictionary: 810 baseline + 506 expansion = 1,316 unique word/POS records.
- Chinese Dictionary: 206 baseline + 519 expansion = 725 unique character records.
- English Lessons: 17 base + 3 expansion = 20.
- Chinese Lessons: 17 lessons and 112 practice questions.
- Chinese Daily Learning: 6 topics, 7 applications, 93 discovery items.
- Chinese Flashcards: 519 character + 904 vocabulary + 24 expression cards = 1,447; draft status remains unchanged.
- Generic Quiz question-envelope checks found no errors in the 229 English-learning or 145 Chinese-learning draft questions.
- Additional bootstrap-wiring and content-parity tests were added to the repository but were not included in the 22-test local run.

## Outstanding Phase 1 exit gates

The formal Phase 1 exit criteria are not yet met. Full browser/device regression remains outstanding across Dictionary, Lessons, Daily Learning, Quiz, Flashcards, Dashboard/Profile, translation switching, saved-word/collection behaviour, account switching, progress/history and allowance boundaries. Account/progress/allowance history parity and environment-specific Supabase migration compatibility also require evidence.

No production or staging Supabase schema/data, Auth settings, production main branch, deployment or staging preview was changed. No staging preview may be provided before Phase 3 completion. Phase 2 must not begin until the remaining Phase 1 exit evidence is complete.
