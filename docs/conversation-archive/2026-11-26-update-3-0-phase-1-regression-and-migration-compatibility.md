# SwiftDictionary Update 3.0.0 — Phase 1 regression and migration-compatibility checkpoint

**Date:** 2026-11-26  
**Production baseline:** U2.9.1  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Documentation branch:** `docs/master-development-record`  
**Status:** Phase 1 exit remains blocked. Phase 2 must not begin.

## Purpose and owner instruction

The owner asked to read the latest Master Development Record and U3.0 conversation archive, update/reconfirm the U3.0 plan, and complete the remaining regression and migration-compatibility checks before Phase 2.

Standing decisions remain:
- English and Simplified Chinese code and data structures must be modernised alongside Malay.
- Malay follows Malaysian Standard Malay (Bahasa Melayu Malaysia).
- No staging-preview handoff before Phase 3 is complete.
- Phase 3 preview does not end U3.0; Phases 4–7 remain mandatory.
- Preserve existing content, user records, learning progress, allowances, histories, saved words, collections, account ownership and language-specific behaviour.
- No Live schema/data mutation, merge or production deployment without explicit owner approval.
- Dictionary search remains free and unlimited.

## Reviewed source of truth and prior records

Reviewed:
- `docs/MASTER-DEVELOPMENT-RECORD.md`
- `docs/UPDATE-3.0-DEVELOPMENT-PLAN.md`
- `docs/UPDATE-3.0-PHASE-0-AUDIT.md`
- U3.0 planning, Phase 0, Phase 1 foundation and Phase 1 integration conversation archives dated 2026-11-26.

The final plan defines Phase 1 exit as English/Chinese running through the shared architecture, existing data mapped and validated, and existing features passing regression. Phase 2 is explicitly gated on those checks.

## Current Phase 1 implementation inspected

Feature branch head at inspection: `65d388818630d20d0ff8e66d9e0df42e63b73cf6`.

Present on the branch:
- Shared language registry, capability declarations and planned/active states.
- Versioned content contracts, content-package registry and translation registry.
- English, Chinese and planned Malay manifests.
- English/Chinese Dictionary source extraction and English Lessons source extraction.
- English/Chinese language adapters and legacy bootstrap.
- Registry-aware saved-word, Collections and account-deletion paths.
- Daily Learning package resolution and generic Quiz question-envelope validation.
- Phase 1 migration design document; no executable U3.0 migration file is present.

Previously reported validation:
- 22 core Node architecture/integration tests passed in the earlier local run.
- Inventory/parity counts were recorded in the Phase 1 integration checkpoint.
- Additional tests for architecture wiring and language content parity were added after that 22-test run and were not part of it.

The seven relevant current test files contain 25 test cases in total (4 architecture wiring, 4 content packages, 3 translation integration, 3 language adapters, 3 content parity, 5 multilingual architecture, 3 translation registry). Their current full suite has not been executed in this review environment. Do not report all 25 as passed.

## Read-only Supabase compatibility inspection

Connected environments:
- Production project `pzymiesazmpyvnfvsbsc`, Tokyo (`ap-northeast-1`), PostgreSQL 17.11.0.003.
- Staging project `ivatvkfrtifgfheeaelj`, Singapore (`ap-southeast-1`), PostgreSQL 17.12.0.000.

Migration history:
- Production: 71 records.
- Staging: 63 records.
- The environments have different version/name mappings and staging bootstrap history. Their migrations are not interchangeable by count or name.

Schema inventory:
- 27 public/private tables were inspected in each environment; all 27 in each report RLS enabled.
- Five table-definition differences were confirmed: `public.saved_words` (staging lacks `created_at`), `public.languages` (staging lacks name/native_name/created_at and code-format check), `public.profiles` (staging lacks created/updated timestamps and display-name/avatar checks), `public.learning_activity_log` (language default differs), and `public.lesson_progress` (status default differs).
- Further metadata comparisons confirmed differing function definitions and policy naming/semantics. Function inventory returned 87 production and 85 staging functions. At least nine function definitions differ or are environment-only; these include allowance enforcement, lesson progress guards, collection ordering, and collection-change broadcasting.
- Policy inventory returned 34 each, but several policy sets differ. Production exposes active learning limits to anon/authenticated; staging has a differently named authenticated-only policy. Saved-word and lesson-progress policy names differ, although inspected ownership predicates remain user-scoped.
- Index inventory returned 83 production and 79 staging indexes. Production-only indexes include language/activity and lesson progress/practice lookup indexes; the saved-word unique index has a different name in staging but the same indexed columns.
- Trigger inventory returned 23 production and 20 staging triggers. Production has additional profile/preferences timestamp and timezone validation triggers; lesson-progress and allowance trigger names differ.

Production aggregate row counts recorded for key tables:
- saved_words 46; profiles 5; user_preferences 5.
- lesson_progress 22; lesson_practice_results 8; learning_activity_log 58; daily_activity_sessions 24.
- learning_allowance_usage 19; learning_content_catalog 289.
- quiz_question_bank 477; quiz_sessions 2; quiz_session_questions 20.
- flashcard_mastery 54; flashcard_sessions 6; flashcard_session_items 8; flashcard_review_items 14.
- favorite_collections 4; favorite_collection_items 4.

Staging is a separate test environment with different synthetic/test data and row counts. Do not copy production personal records into staging and do not treat row-count differences as data loss. These counts are read-only baselines, not before/after migration parity evidence.

Language values in production currently include English and Chinese only. Production records include 32 saved words in the initial table summary, but a later aggregate query returned 46 total (16 en, 30 zh); use the later aggregate query as the consistent count. Progress: 20 en / 2 zh. Lesson practice: 7 en / 1 zh. Activity log: 48 en / 10 zh. Daily sessions: 17 en / 7 zh. Quiz bank: 199 en-learning / 278 zh-learning; answer language: 129 en / 348 zh. These are aggregate baselines only.

The database still contains en/zh-only CHECK constraints in saved words, lesson progress/results, private learning catalogue, lesson practice attempts, Quiz answer/snapshot languages and Flashcard card/session languages. RPC/trigger definitions also contain language-specific assumptions. The existing design inventory is useful but not sufficient by itself; every deployed signature, grant, RLS predicate and trigger must be compared before migration.

No SQL was applied. No schema, data, Auth setting, RLS policy, function, trigger or index was modified in either environment.

## Regression review and findings

The current feature branch includes meaningful architecture integration, but full Phase 1 exit is not proven.

1. **Browser/device regression not executed:** no real-browser/device evidence in this review for Dictionary, Lessons, Daily Learning, Quiz, Flashcards, Dashboard/Profile, translation switching, saved words, Collections, sign-in/out, account switching, cross-device sync, progress/history, allowance boundaries, mobile layouts, keyboard/accessibility and reduced-motion behaviour.
2. **Full automated suite not executed:** the 25 tests listed above were inspected, but the current full test suite was not run in this environment. The earlier 22-test result remains historical evidence only.
3. **Database parity not proven:** schema drift is confirmed; no disposable/local or staging migration was run, and there is no before/after record-reference parity report.
4. **Function/RLS parity not proven:** definitions and policies differ between environments; their effects must be reconciled, not blindly overwritten.
5. **Runtime still contains English/Chinese-specific assumptions:** current active-language behaviour is protected by adapters, but several UI/Quiz/lesson paths still use explicit en/zh branches. This is acceptable only where the language-specific capability is deliberate; each remaining branch needs classification and regression evidence before sign-off.
6. **Content-governance discrepancies remain:** English Quiz source has 229 questions with 199 previously approved and 30 draft-only; Chinese Quiz source is marked draft while production has 145 approved; Chinese Flashcards contain 1,447 draft-marked cards currently used by legacy runtime. Do not silently change approval states.
7. **Translation provenance:** legacy English lesson translations are registered `legacy_unverified`; this must not be treated as reviewed or approved.
8. **Legacy content licensing/provenance gaps:** retain Phase 0 warnings for original Chinese and English dictionary/lesson materials. This is a content/legal release gate.

## Hosting/check status

The Cloudflare Pages check for feature commit `65d3888` reported a successful branch deployment and generated a branch preview automatically. The preview URL was not handed to the owner and is not to be used as a staging-preview handoff before Phase 3. The separate Workers Builds check failed; Workers Builds is retired and is not an active release gate. Cloudflare Pages remains the only active deployment platform.

A Pages build success proves deployment/build completion only; it does not prove browser regression or Supabase compatibility.

## Decision and recovery point

**Do not start Phase 2.** Phase 1 remains open until:
1. The full 25-test architecture/parity suite and all relevant existing regression tests are run against the exact feature commit, with failures fixed and evidence recorded.
2. A real-browser/device regression matrix passes for English and Chinese and the shared account workflows.
3. Production/staging differences are reconciled in a migration compatibility matrix, including constraints, FKs, indexes, triggers, function bodies/signatures, grants, policies and data defaults.
4. A disposable/local and then staging migration rehearsal proves idempotence/restartability, old-client compatibility, stable-ID mapping and aggregate/reference parity without production data copying.
5. Progress, Quiz/Flashcard session snapshots/history, saved words/Collections, preferences, account isolation and shared allowance ledgers are shown unchanged by migration rehearsal.
6. Remaining en/zh branches are classified as intentional language-specific adapters or converted to capability-driven shared behaviour.
7. Content approval/provenance discrepancies are explicitly resolved or retained as clearly non-approved and excluded from launch.

No migration, staging handoff, Phase 2 implementation, production merge or deployment is authorised by this checkpoint. Keep all application work on `feature/update-3.0-phase-0-audit` and documentation on `docs/master-development-record`.


## Final validation correction and superseding decision — 2026-11-26

The earlier "blocked" decision in this checkpoint was correct at the time, but has been superseded by [the final Phase 1 validation record](2026-11-26-update-3-0-phase-1-validation-complete.md). Phase 1 is now complete and Phase 2 is ready, not started.

Corrections from the deeper metadata comparison:
- The complete architecture Node suite contains **29** tests (the earlier 25-case count omitted four cases from `tests/validation-core.test.mjs`).
- Of the seven common function definitions with different raw hashes, the hashes match after stripping comments and whitespace. The only production-only functions are `public.set_updated_at()` and `public.validate_user_preferences_timezone()`; there are no staging-only functions.
- The meaningful `learning_plan_limits` policy difference is exact: production allows anon/authenticated SELECT where `is_enabled = true`; staging allows authenticated SELECT with `true`. Other saved-word/lesson-progress policy differences are naming-only with matching predicates.
- Production-only triggers are `profiles_set_updated_at`, `preferences_set_updated_at` and `preferences_validate_timezone`. Two trigger names differ between environments while calling the same allowance/progress guard functions.
- Final CI completed successfully: 29 architecture tests, 29 Mock Quiz/Flashcards tests, and 56 Chromium browser tests (20 English/Collections, 22 Quiz, 7 Flashcards/Preferences, 2 Daily Learning, 5 Chinese Dictionary), for 114 passing Node/Playwright cases. Local Supabase migration/RPC/security tests also passed.

No production/staging database changes were made. The environment differences remain a gate before any later U3.0 SQL migration or Malay database activation, but do not block Phase 2 content authoring, which requires no schema change.
