# SwiftDictionary Update 3.0.0 — Phase 1 validation completed

**Date:** 2026-11-26  
**Production baseline:** Update 2.9.1  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Validated feature commit:** `c2dfc3bd1887c4ee1d4b821520f305726303922c`  
**Documentation branch:** `docs/master-development-record`  
**Decision:** **Phase 1 validation complete. Ready to begin Phase 2.** Phase 2 has not been started.

## 1. Final automated test evidence

All three relevant GitHub Actions runs completed successfully:

1. [U3.0 architecture regression](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45785145735) — 29 Node tests passed, 0 failed.
2. [U2.9.0 English Dictionary QA](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45787061528) — all dictionary, category, translation, whole-catalogue and Quiz-content validators passed; 29 Mock Quiz/Flashcards tests passed; 20 Chromium browser tests passed.
3. [Quiz database foundation and local Supabase integration](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45787063396) — both jobs succeeded. Local Supabase migrations, Auth/RPC integration, Quiz runtime, Flashcards, Daily Learning, Chinese Dictionary, grants and security-advisor checks passed.

### Browser test breakdown

| Browser area | Passed |
|---|---:|
| English Dictionary, English categories, Collections, account isolation and responsive behaviour | 20 |
| Authenticated Quiz runtime and Dashboard history | 22 |
| Flashcards and Preferences | 7 |
| Daily Learning completion and midnight allowance reset | 2 |
| Chinese Dictionary pinyin/category/course switching | 5 |
| **Total** | **56** |

Across the architecture, mock and browser suites, **114 Node/Playwright test cases passed** (29 + 29 + 56), with no failures in the final successful runs. SQL migration/integration assertions also completed successfully.

### Test and validator corrections made

The broader run exposed stale U2.9 checks that still expected Dictionary and Lessons content to be embedded in `index.html`. U3.0 extracts these into language-owned files. The validators and tests now read the authoritative language packages:
- English expansion baseline and runtime wiring validator.
- English topic-category and Chinese translation coverage validator.
- Whole-catalogue editorial audit.
- Flashcards' lesson-linked English vocabulary checks.
- Mock Flashcards Chinese-bank assertions now verify adapter-based resolution.
- Collections' isolated browser fixture now loads the U3.0 language registry and adapters, matching the real application dependency chain.

The two architecture-wiring test false negatives were also corrected: actual script elements are inspected, and migration design gate wording is matched case-insensitively.

## 2. Local migration and backend compatibility rehearsal

The successful disposable local Supabase workflow:
- created a clean staging-style application baseline with CI-only legacy fixtures;
- applied the Update 2.3.x prerequisite migrations and the existing Quiz, Preferences, Flashcards, U2.6 security, U2.7 language-aware Lessons, U2.8 Chinese review and U2.9 Collections migrations;
- verified explicit grants;
- ran authenticated Quiz RPC and session-lifecycle assertions;
- validated and imported draft Quiz content and the owner-authorised 199-question release;
- seeded disposable synthetic approved Quiz content for browser tests;
- passed 22 authenticated Chromium Quiz tests, 7 Flashcards/Preferences tests, 2 Daily Learning tests and 5 Chinese Dictionary tests;
- passed Supabase security-advisor checks; and
- stopped the disposable local Supabase services.

The separate PostgreSQL Quiz database foundation job also passed.

This validates the existing U2.9.1-compatible application/database baseline in a disposable local environment. It is not a U3.0 schema migration rehearsal: no U3.0 SQL migration exists or is needed for Phase 2's content-authoring work.

## 3. Production and staging read-only integrity checks

Both connected Supabase environments were inspected without writing to either:
- Production: `pzymiesazmpyvnfvsbsc`, Tokyo, PostgreSQL 17.11.0.003.
- Staging: `ivatvkfrtifgfheeaelj`, Singapore, PostgreSQL 17.12.0.000.

Each environment has 27 inspected public/private tables, all with RLS enabled. The following checks returned zero in **both** environments:
- duplicate saved-word owner/course/word keys;
- duplicate collection ordering and collection membership;
- duplicate lesson-progress identities;
- duplicate allowance user/activity keys;
- duplicate Quiz question revisions;
- duplicate Flashcard mastery keys and session positions; and
- unknown language references in saved words, progress, practice results, activity logs, Daily Learning sessions, content catalogue, Quiz learning/answer languages and Flashcard cards.

Direct SELECT is denied to both anon and authenticated roles on private Quiz question-bank, Flashcard-card and allowance tables. The inspected protected RPCs are executable by authenticated users and not by anon.

These are aggregate and metadata checks only; no production personal data was copied to staging or to CI.

## 4. Environment-specific schema drift — recorded, not mutated

Production has 71 migration records; staging has 63. They are not interchangeable by migration count or filename.

Confirmed differences:
- Five table-definition differences across `saved_words`, `languages`, `profiles`, `learning_activity_log` and `lesson_progress`. Staging lacks `saved_words.created_at`; its `languages` table lacks `name`, `native_name` and `created_at`; profile timestamp/validation metadata differs; activity-log and lesson-progress defaults differ.
- Production has 87 functions and staging 85. The only production-only helper functions are `public.set_updated_at()` and `public.validate_user_preferences_timezone()`. Seven common functions had different raw hashes, but their bodies matched after comments and whitespace were normalised; no staging-only functions were found.
- Production has 23 triggers and staging 20. Production-only triggers are profile/preferences timestamp and timezone-validation triggers. Two other trigger names differ while using the same underlying guard/allowance functions.
- Both environments have 34 policies. Most name differences have matching predicates. The meaningful policy difference is `learning_plan_limits`: production permits anon/authenticated reads of enabled limits; staging permits authenticated reads with a `true` predicate.
- Production has 83 indexes and staging 79; four indexes are production-only. The saved-word unique index uses a different name in staging but covers the same columns.

### Phase 2 impact and future migration rule

Phase 2 is Malay Dictionary content authoring and does not require changing the Supabase schema or activating Malay. The existing English/Chinese application is compatible with the current environments under the tests and read-only checks above.

Therefore the recorded environment drift does **not** block Phase 2. It remains a mandatory reconciliation gate before any U3.0 database migration, Malay database registration/activation, or frontend release that depends on new database fields/RPCs. Do not blindly copy migrations between environments or modify production/staging to force parity. Build environment-specific forward migrations only when a later phase actually needs them, then rehearse those migrations in disposable/local and staging environments with data-reference parity checks.

## 5. Release and safety decision

**Phase 1 exit criteria are satisfied; Phase 2 may begin.**

- Phase 0: complete.
- Phase 1 architecture, content mapping, regression and current-baseline migration compatibility: complete.
- Phase 2 Malay Dictionary: ready, not started.
- `ms` remains planned/inactive until its language content and later feature gates are met.
- No U3.0 SQL migration was created or applied.
- No production/staging schema, data, Auth, RLS, functions, triggers or indexes were changed.
- No merge to production `main`, production deployment or staging-preview handoff occurred.
- No preview URL is to be given to the owner before Phase 3 is complete.
- Cloudflare Pages remains the only active deployment platform; Workers Builds remains retired.
- Existing English/Chinese provenance and translation-review cautions remain release gates. New Malay content must have documented authorship/source/licence, and Malaysia/general privacy/legal planning must continue before public activation.

**Next permitted work:** begin Phase 2 on the existing feature branch. Do not automatically start it as part of this validation close-out.
