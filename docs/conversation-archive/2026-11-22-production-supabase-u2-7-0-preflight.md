# Production Supabase U2.7.0 rollout preflight

**Date:** 2026-11-22  
**Scope:** Read-only production database investigation following the live Lessons “waiting for server update” message.  
**Production project:** `SwiftDictionary` (`pzymiesazmpyvnfvsbsc`, ap-northeast-1)  
**Staging project:** `SwiftDictionary Indie Staging` (`ivatvkfrtifgfheeaelj`, ap-southeast-1)

## Owner instruction and safety boundary

The owner asked to proceed with the production rollout investigation. The prior handover explicitly required a read-only preflight and presentation of the exact migration plan before any production changes. This session performed read-only checks only. No production SQL, migration, grant, schema, function or data changes were made.

## Findings

- Both Supabase projects report `ACTIVE_HEALTHY`.
- Production migration history ends at the U2.5.0 Flashcards migrations. It does not contain the two U2.6.0 least-privilege migrations or the three U2.7.0 migrations.
- Staging contains the two U2.6.0 migrations and all three U2.7.0 migrations.
- Production lacks `learning_language` on `public.lesson_progress` and `public.lesson_practice_results`, has no language-aware practice RPC, has no lesson-start allowance trigger/function, and has zero active Chinese learning-catalogue rows.
- Staging has both language columns, the language-aware practice RPC, the lesson-start trigger/function, and 123 active Chinese catalogue entries, including 93 Chinese Daily Discovery entries.
- Production already has the active `zh` language row, the shared allowance ledger, learning catalogue, daily sessions and the base learning schema.
- Production has 14 lesson-progress rows, 1 practice-result row, 12 daily-session rows and 8 allowance-ledger rows. No duplicate lesson-progress or practice-result keys were found that would block the U2.7.0 language-aware unique indexes.
- Production's active discovery rotation orders have no duplicates within a language. The same numeric order is intentionally reused across languages in staging.
- The U2.7.0 language-aware migration's required `private.is_approved_learning_content` signature already exists in production.
- Production's current lesson-progress trigger set is the pre-U2.7.0 completion flow. Staging has the post-U2.7.0 first-start allowance trigger.
- Production currently grants `anon` broad privileges on `public.daily_activity_sessions` and grants `authenticated` DELETE plus non-DML privileges. Staging restricts this table to authenticated INSERT/SELECT/UPDATE and gives anon no table privileges.
- Production default privileges for postgres-created public tables, sequences and functions still grant broad rights to anon/authenticated. Staging has the U2.6.0 least-privilege defaults in place. This confirms the two U2.6.0 migrations must be included before the U2.7.0 functions are created.
- Supabase security advisors on both environments report the same existing private-schema RLS-without-policies informational findings, two SECURITY DEFINER RPC warnings, and leaked-password-protection warning. These are pre-existing advisor findings and were not modified in this session.

## Exact proposed migration order

1. `20261119112433_swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions.sql` — remove broad default privileges and tighten Daily Learning session/function access.
2. `20261120023718_update_2_6_0_remove_residual_api_privileges.sql` — remove residual API-role privileges from legacy public tables and sequences.
3. `20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql` — add language-scoped lesson progress/results, replace lesson completion RPCs and seed the 17 Chinese permanent lessons.
4. `20261122123000_update_2_7_0_chinese_daily_learning_catalog.sql` — add the Chinese Daily Topic, Application and 93-item Discovery catalogue.
5. `20261122143000_update_2_7_0_lesson_start_allowance.sql` — enforce first-start permanent lesson allowance atomically.

The hosted staging migration ledger records these same logical migrations under version identifiers that differ from some source filenames. Production migration application should use the reviewed source SQL and record fresh production migration versions, with the resulting ledger verified after each step.

## Validation and remaining gates

Before applying, confirm the owner authorises this exact five-migration production sequence. Apply sequentially, checking migration history and the relevant schema/function/privilege state after each migration. Then run read-only verification for language columns, catalogue counts, allowance trigger/RPC, table grants, default privileges, RLS and migration history. Finally, reload the live site and test signed-in English and Chinese Lessons, progress separation, completion, review, allowance behaviour and Daily Learning.

No backup/restore point was created or modified in this read-only session. Formal Malaysia/international privacy review remains outstanding as recorded in the MDDR; this database rollout does not certify legal compliance.
