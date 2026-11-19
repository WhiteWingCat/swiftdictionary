# Update 2.6.0 — Phase C initial least-privilege database hardening

**Date:** 19 November 2026  
**Implementation branch:** `feature/update-2-6-0-legal-privacy-security`  
**Documentation branch:** `docs/master-development-record`  
**Production status:** Unchanged; no production migration or deployment.

## Summary

The first Update 2.6.0 technical remediation was applied to the isolated Singapore staging project, then verified with read-only privilege checks and rollback-only SQL probes. The migration hardens Daily Learning session access and the default privileges applied to future objects created by the `postgres` role.

## Findings that motivated the change

- Production `public.daily_activity_sessions` had all table privileges granted to `anon` and `authenticated`, although its RLS policies were authenticated-only and owner-scoped.
- Staging already had the intended narrower table grants: anon had no privileges; authenticated could SELECT/INSERT/UPDATE but not DELETE.
- Production's default privileges for objects created by `postgres` in `public` granted broad table CRUD, sequence privileges and function EXECUTE to API roles. This can recreate over-grants in future migrations.
- Two trigger-only guard functions had unnecessary direct EXECUTE grants to PUBLIC/anon/authenticated.
- The two SECURITY DEFINER RPCs were separately inspected and retained: both use empty search_path and derive identity from auth.uid(); the personal learning test bypass is required and remains intact.

## Migration applied to staging

Version: `20261119112433`  
Name: `swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions`

Repository file created on the implementation branch:

`supabase/migrations/20261119112433_swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions.sql`

Changes:
1. Revoke all table privileges on `public.daily_activity_sessions` from anon.
2. Revoke direct DELETE from authenticated while preserving SELECT/INSERT/UPDATE.
3. For future objects created by postgres in public, revoke default table privileges from anon/authenticated.
4. Revoke default sequence USAGE/SELECT from anon/authenticated, leaving UPDATE.
5. Revoke global default function EXECUTE from PUBLIC and public-schema default EXECUTE from anon/authenticated.
6. Revoke direct EXECUTE from PUBLIC/anon/authenticated on the two trigger-only guard functions.

## Tests and evidence

- Staging migration history records version 20261119112433 with the expected migration name.
- Staging table privilege read-back: anon has no SELECT/INSERT/UPDATE/DELETE; authenticated has SELECT/INSERT/UPDATE and no DELETE.
- Staging trigger-function privilege read-back: anon/authenticated cannot directly execute either guard.
- Rollback-only test created temporary tables/triggers, assumed the authenticated role and confirmed both trigger functions still run and reject an untrusted completion transition with the expected guard error. This validates that removing direct EXECUTE does not break the existing triggers.
- Rollback-only probe created a temporary public table, bigserial sequence and function, confirming new postgres-owned objects do not inherit anon/authenticated table CRUD, sequence USAGE/SELECT or function EXECUTE. The probe was rolled back.
- Staging security advisor still shows eight private-schema RLS-enabled/no-policy INFO findings (intentional private RPC-only tables) and two authenticated SECURITY DEFINER WARN findings (reviewed and retained). No new advisor finding was introduced.
- No production user rows or message contents were read.

## Important caveats

- Production remains unchanged and still has the old Daily Learning table grants and postgres defaults. Do not assume this remediation has reached live users.
- Supabase's current documentation says the `supabase_admin` default privileges are platform-managed and cannot be changed by project SQL; the Data API default exposure control changes the `postgres` defaults. The migration intentionally addresses objects created by `postgres` migrations; ownership and grants of future objects must still be inspected.
- Existing production sequence grants and other pre-existing object grants were not globally changed.
- No signed-in browser Mock User smoke test has yet been performed against staging. Test Daily Learning start/resume/complete/abandon, learning-history deletion, Lessons completion, Quiz and Flashcards regression before production approval.
- Leaked-password protection remains an Auth-dashboard verification item. The visible application sign-in path uses Google OAuth; do not interpret the advisor warning as evidence of a password login surface without checking enabled providers.

## Repository / branch state

- Created `feature/update-2-6-0-legal-privacy-security` from `main` commit `7a5fcdae44e4ccfa8490f812f5bfad73f426e01f`.
- Added the migration file above.
- Existing three recent implementation branches remain; this makes four implementation branches until the oldest completed branch is retired. The available GitHub integration has no branch-delete action, so no existing branch was deleted.
- Documentation remains isolated on `docs/master-development-record`.

## Next actions

1. Run authenticated Mock User staging smoke tests for all Daily Learning lifecycle operations and regressions across Lessons, Quiz, Flashcards and account switching.
2. Verify Google OAuth-only provider configuration and leaked-password protection applicability in the Supabase Auth dashboard.
3. Reassess whether additional existing production sequence grants should be removed, and inventory other direct grants before expanding the production migration.
4. Review account deletion design and provider retention schedule.
5. Obtain explicit owner approval before applying any migration to production.
