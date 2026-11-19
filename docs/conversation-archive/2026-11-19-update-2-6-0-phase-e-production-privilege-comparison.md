# Update 2.6.0 — Phase E production privilege comparison

**Date:** 19 November 2026  
**Mode:** Read-only ACL audit; no SQL changes in this phase.

## Production findings

1. `public.daily_activity_sessions` is owned by postgres and has ALL privileges granted to anon and authenticated. This includes all DML plus TRUNCATE, REFERENCES, TRIGGER and PostgreSQL 17 MAINTAIN. Production has not received the Phase C migration.
2. anon has USAGE/SELECT/UPDATE on four public sequences: `learning_activity_log_id_seq`, `lesson_practice_results_id_seq`, `lesson_practice_results_id_seq1`, and `lesson_progress_id_seq`. anon has no access on `saved_words_id_seq`.
3. anon SELECT on `languages` and `learning_plan_limits` is intentional public configuration access and should not be removed without app review.
4. anon EXECUTE is limited to `guard_daily_activity_session_update()` and `guard_lesson_progress_update()`, which are trigger-only functions. Phase C removes these grants in staging; production remains unchanged.
5. Existing authenticated RPC EXECUTE grants match for the reviewed public functions. The two required SECURITY DEFINER RPCs remain authenticated-only.
6. Production postgres default privileges in public still broadly grant table, sequence and function privileges to API roles. Phase C tightens future postgres-created objects in staging only.

## Staging comparison

- Phase C staging migration has been applied; the effective Daily Activity grants are anon none, authenticated SELECT/INSERT/UPDATE and no DELETE.
- CI run #44514979573 passed both jobs, including full local schema application, migration tests, authenticated RPC tests, Chromium runtime tests and local security-advisor checks.
- Some bootstrap-created staging public tables still have non-DML privileges (TRUNCATE, REFERENCES, TRIGGER, PostgreSQL 17 MAINTAIN). Review object-by-object before describing the entire schema as least-privilege.
- Supabase platform-owned supabase_admin defaults cannot be changed through the project's SQL. Inspect owner and ACL on future objects.
- Staging currently has zero Auth users and no Edge Functions. Google OAuth configuration and redirect URLs were not exposed by the connected project tools.

## Follow-up work

1. Create a migration to revoke unnecessary anon sequence privileges, preserving proven authenticated sequence paths.
2. Reset daily_activity_sessions privileges completely, then grant only authenticated SELECT/INSERT/UPDATE.
3. Remove trigger-only direct EXECUTE grants in production only after explicit rollout approval.
4. Review non-DML grants table by table; preserve public configuration SELECT.
5. Verify staging Google OAuth callback and Cloudflare preview points to the staging project before browser tests.
6. Do not touch production until owner approval and successful staging regression.

No production database changes were made.
