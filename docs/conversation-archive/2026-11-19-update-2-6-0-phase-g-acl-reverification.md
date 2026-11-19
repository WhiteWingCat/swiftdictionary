# Update 2.6.0 — Phase G: ACL re-verification and staging gap analysis

**Date:** 19 November 2026  
**Branch:** `docs/master-development-record`  
**Implementation branch:** `feature/update-2-6-0-legal-privacy-security`  
**Scope:** Read-only re-check of live production and Singapore staging PostgreSQL ACLs after Phase C.

## What was checked

The production Supabase project (Tokyo) and staging project (Singapore) were queried directly for effective grants on `public.daily_activity_sessions`, public sequences and the two trigger guard functions. The check also revisited the outstanding ACL/default-privilege concerns. No row data was read and no database writes, migrations, settings changes or deployments were performed.

## Confirmed results

### Daily activity sessions

- **Production:** `anon` and `authenticated` still have broad table privileges, including DML and non-DML privileges. Production was not changed.
- **Staging:** the table has only `SELECT`, `INSERT` and `UPDATE` for `authenticated`; no `anon` table grants were returned. This confirms the Phase C staging change is in effect.

### Sequences

- **Production:** `anon` retains `SELECT`, `UPDATE` and `USAGE` on four sequences: `learning_activity_log_id_seq`, `lesson_practice_results_id_seq`, `lesson_practice_results_id_seq1` and `lesson_progress_id_seq`.
- **Staging:** anonymous `SELECT` and `USAGE` are absent from those sequences, but anonymous `UPDATE` remains on three: `learning_activity_log_id_seq`, `lesson_practice_results_id_seq` and `lesson_progress_id_seq`. The duplicate lesson-practice sequence does not show an anonymous grant in staging.
- Authenticated sequence privileges remain on the application sequences, including `saved_words_id_seq`; these should not be removed without validating the actual INSERT paths.

### Trigger-only guard functions

- **Production:** both `guard_daily_activity_session_update()` and `guard_lesson_progress_update()` still show `EXECUTE` for `PUBLIC`, `anon` and `authenticated`. The PUBLIC grant is important: revoking only explicit API-role grants would not prevent inherited PUBLIC execution.
- **Staging:** the targeted ACL check returned no PUBLIC, anon or authenticated EXECUTE grants for these two guard functions. Trigger operation remains a separate mechanism and should be covered by the staging regression test.

### Existing non-DML table grants and defaults

- Staging still has non-DML table privileges (`TRUNCATE`, `REFERENCES`, `TRIGGER`, `MAINTAIN`) on eight older/bootstrap-created public tables, including profile/preferences, entitlements, learning logs and public configuration tables. This is an ACL-cleanup item, not evidence that those tables have anonymous row visibility; RLS and policies remain separate controls.
- The current `postgres` default ACLs in staging no longer show the broad anon/authenticated table, sequence and function grants that were present in production. Platform-owned `supabase_admin` defaults remain and are not directly controlled by the project migration. New-object ownership must continue to be checked.

## Corrected remediation plan

1. Remove the residual anonymous `UPDATE` grants from the three staging sequences and all unnecessary anonymous sequence privileges in production. Preserve authenticated sequence access until the relevant write paths are proven not to need it.
2. For the two trigger-only guard functions in production, explicitly revoke from `PUBLIC` as well as `anon` and `authenticated`; verify triggers continue to execute after staging rollout.
3. Keep the staging `daily_activity_sessions` grant model as the target: authenticated SELECT/INSERT/UPDATE only, with no anon grants and no DELETE/TRUNCATE/REFERENCES/TRIGGER/MAINTAIN for API roles.
4. Review the eight staging bootstrap tables individually before removing non-DML privileges. Preserve the public SELECT use cases for `languages` and `learning_plan_limits`; do not apply blanket revokes that break the app.
5. Re-check default privileges and object ownership for future migrations. Do not attempt to change Supabase platform-owned `supabase_admin` defaults.
6. Create the next migration using the Supabase CLI's supported migration-generation command, then apply it to staging and run SQL, authenticated browser and trigger regression tests. The CLI is not available in the current execution environment, so no migration filename was fabricated and no follow-up migration was created.
7. Keep production unchanged until staging browser validation and explicit owner approval.

## Validation and limits

This phase is a read-only ACL verification. It does not establish that every policy or RPC is safe, and it is not a penetration test. The production advisor's two authenticated SECURITY DEFINER warnings remain a separate intentional-function review; the private-schema RLS-without-policy notices remain consistent with the RPC-only/no-browser-grant design and should not be “fixed” by adding broad policies.

## Handoff

The next technical gate is to prepare a CLI-generated follow-up migration and prove the exact privilege changes in staging. The separate live browser gate remains blocked on Cloudflare Pages preview configuration and staging Google OAuth callback/redirect settings. Do not point the production site at staging credentials.
