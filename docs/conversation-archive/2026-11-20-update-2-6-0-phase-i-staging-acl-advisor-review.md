# Update 2.6.0 — Phase I: staging ACL follow-up and live advisor review

**Date:** 20 November 2026  
**Implementation branch:** `feature/update-2-6-0-legal-privacy-security`  
**Documentation branch:** `docs/master-development-record`  
**Target audited:** Singapore staging Supabase project `ivatvkfrtifgfheeaelj`

## Safety boundary

This phase used read-only Supabase queries against staging. No production project was queried or changed, no learner rows were read, and no database writes or migrations were executed. TinyFish was not used. Cloudflare and Google OAuth dashboard settings remain owner-operated.

## Staging ACL findings

The effective ACL query confirmed that eight legacy/bootstrap-created public tables, owned by `postgres`, still grant both `anon` and `authenticated` TRUNCATE, REFERENCES, TRIGGER and MAINTAIN:

- `languages`
- `learning_activity_log`
- `learning_plan_limits`
- `lesson_practice_results`
- `lesson_progress`
- `profiles`
- `user_entitlements`
- `user_preferences`

The anonymous role retains UPDATE (sequence `setval`) on three sequences:

- `learning_activity_log_id_seq`
- `lesson_practice_results_id_seq`
- `lesson_progress_id_seq`

These were direct grants from `postgres`, not inherited from PUBLIC. Preserve public SELECT on `languages` and `learning_plan_limits`, all normal DML grants needed by the application, and existing RLS policies.

## Draft artifacts committed to implementation branch

- `docs/UPDATE-2.6.0-STAGING-ACL-FOLLOW-UP-DRAFT.sql` — narrowly revokes only the identified extra table privileges and anonymous sequence UPDATE.
- `supabase/tests/update_2_6_0_staging_acl_followup.sql` — asserts those privileges are absent and intentional public SELECT grants remain.

These are draft/review artifacts, not an applied migration. The permanent migration must be generated using `supabase migration new`. The Supabase CLI, Docker and local PostgreSQL client were unavailable in the execution environment, so the draft was not locally executed. Do not apply to staging or production until generated, reviewed, and validated.

## Live Security Advisor review

Staging Security Advisor returned two WARN findings for authenticated execution of SECURITY DEFINER functions:

1. `public.is_personal_learning_test_access()` requires `auth.uid()` to be non-null and checks only that same user against `private.learning_limit_exemptions`.
2. `public.record_completed_lesson_practice_result(...)` requires authentication, validates input and approved lesson identity, locks by the authenticated user's ID, requires that user's lesson completion, and inserts only that user's replay summary.

Both functions are owned by `postgres`, set an empty search_path, deny anonymous EXECUTE and have no PUBLIC EXECUTE grant. Authenticated EXECUTE is part of the current application design. Do not revoke it just to silence the generic warning; keep the checks and document the intentional privileged RPC surface.

The Advisor also reports eight informational RLS-enabled/no-policy findings for private-schema tables. They are intended to be inaccessible directly through browser roles and reached only through controlled functions; confirm schema exposure and grants remain restricted. Performance findings (unindexed foreign keys, RLS initplan suggestions and unused indexes) are separate optimisation work. Do not drop indexes solely because synthetic staging tests have not used them.

## Repository and CI status

- Branch `feature/update-2-6-0-legal-privacy-security` remains the implementation branch.
- No open PR to main.
- Cloudflare routing guard workflow passed on `2544083fe67773512f528f2ec941b16d13cf55c8`.
- Phase I artifacts were committed separately on the feature branch.
- Documentation plan updated on `docs/master-development-record`.

## Next steps

1. Generate the permanent migration with the Supabase CLI in a suitable local development environment.
2. Review its exact SQL and confirm the listed objects exist; preserve required grants and RLS.
3. Add the migration and follow-up assertion file to the disposable local Supabase CI workflow.
4. Run the full authenticated Quiz, Flashcards, learning-history deletion and frontend regression suites.
5. Only then apply to Singapore staging and verify effective ACLs and advisors again.
6. Keep production untouched until the owner explicitly approves a separately reviewed rollout.

Malaysia legal review remains required for Act 709 applicability, consent for users aged 16–17, DPO screening, cross-border transfers, retention and the public controller contact route. This technical phase is not legal advice or a compliance certification.
