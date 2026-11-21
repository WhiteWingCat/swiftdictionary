# Update 2.6.0 — Production ACL remediation draft

Date: 2026-11-20  
Status: **Read-only findings and proposed SQL only. Not approved or applied.**  
Target: Tokyo production Supabase project  
Comparison baseline: Singapore staging after the two Update 2.6.0 ACL migrations

## Safety boundary

This is a review document, not a migration. Do not run the SQL below against production until the owner explicitly approves a production change window, the complete migration set is reviewed, and a fresh backup/export and recovery plan are confirmed. Both Supabase projects are on the Free plan; no paid backup or PITR capability should be assumed. Do not change production as part of the current feature PR.

No learner rows were selected or modified during this audit. The comparison used read-only queries against effective grants, RLS flags, policies, trigger function metadata, default privileges, migration history and sequence ownership.

## Environment and migration state

- Production: Tokyo, PostgreSQL 17.11, ACTIVE_HEALTHY.
- Staging: Singapore, PostgreSQL 17.12, ACTIVE_HEALTHY.
- Both projects were confirmed by the owner to be on Supabase Free.
- Staging has applied:
  - `20261119112433` — `swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions`
  - `20261120023718` — `update_2_6_0_remove_residual_api_privileges`
- Production has not applied either Update 2.6.0 migration.
- Both environments have RLS enabled on the inspected public application tables. The inspected account-owner policies are present in both; several policy names differ, but the user ownership predicates and intended DML scope are materially aligned.

## Confirmed production/staging differences

### 1. Daily activity sessions

Production grants `anon` broad table privileges (including SELECT/INSERT/UPDATE/DELETE and non-DML privileges). Production also grants `authenticated` DELETE, REFERENCES, TRIGGER and TRUNCATE in addition to INSERT/SELECT/UPDATE.

Staging grants no table privileges to `anon`; `authenticated` has only INSERT, SELECT and UPDATE. Its RLS policies constrain all three operations to the authenticated owner. Learning-history deletion is handled through the controlled RPC path, not direct table DELETE.

The first U2.6.0 migration revokes all privileges from `anon` and DELETE from `authenticated`, but it does not explicitly revoke the remaining non-DML privileges from `authenticated`. A production follow-up should remove those remaining privileges to match staging.

### 2. Learning plan limits

Production has an anonymous SELECT grant and a policy permitting active plan-limit rows. Staging has no anonymous grant and its policy is authenticated-only. The current second U2.6.0 migration does not revoke this anonymous SELECT grant. Confirm that no signed-out page needs this table; the current signed-out learning gates and dictionary-only public experience do not appear to require it.

### 3. Sequences

Production has anonymous privileges on:
- `learning_activity_log_id_seq`
- `lesson_progress_id_seq`
- `lesson_practice_results_id_seq1` (the sequence actually owned by `lesson_practice_results.id` in production)

Staging has no anonymous privileges on those sequences. The existing follow-up migration revokes only UPDATE from anon, leaving SELECT/USAGE potentially granted; it does not fully match staging.

Production also contains `lesson_practice_results_id_seq`, an apparently orphaned sequence with no ownership dependency and no matching column default observed. Staging instead has `lesson_practice_results_id_seq` as the owned sequence for its table. Do not drop the production orphan as part of this ACL patch. A separate dependency/reference audit is required before any cleanup. The safe immediate least-privilege action is to revoke API-role privileges from the orphan while retaining the object.

Authenticated sequence privileges on the sequences actually used by identity columns are present in both environments and should be preserved.

### 4. Trigger-only functions

Production grants EXECUTE to PUBLIC, anon and authenticated on:
- `public.guard_daily_activity_session_update()`
- `public.guard_lesson_progress_update()`

Staging has no client-role EXECUTE grants on these trigger-only functions. The first U2.6.0 migration already includes the required revokes; production should receive that migration rather than an unrelated hand-edited function change.

### 5. Default privileges

For objects created by role `postgres` in schema `public`, production default privileges still grant broad table, sequence and function privileges to anon/authenticated (and function EXECUTE to PUBLIC). Staging's postgres defaults revoke these client-role defaults and leave only postgres/service_role privileges.

The first U2.6.0 migration includes the intended default-privilege changes. The `supabase_admin` default ACLs are broad in both environments and were not modified in staging; do not alter those platform-role defaults as part of this application migration.

## Proposed production-only follow-up SQL

This SQL is deliberately limited to the observed residual differences that the current two U2.6.0 migrations do not fully remove. It is not a substitute for applying and validating the two reviewed U2.6.0 migrations first.

```sql
-- Do not run until separately approved for Tokyo production.

-- Match staging: authenticated users may INSERT/SELECT/UPDATE their own
-- daily activity sessions through RLS, but may not DELETE, TRUNCATE,
-- create references or attach triggers.
REVOKE DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON TABLE public.daily_activity_sessions
  FROM authenticated;

-- Match staging: plan limits are not exposed to anonymous visitors.
REVOKE ALL PRIVILEGES
  ON TABLE public.learning_plan_limits
  FROM anon;

-- Match staging: no anonymous access to identity sequences.
REVOKE ALL PRIVILEGES
  ON SEQUENCE
    public.learning_activity_log_id_seq,
    public.lesson_progress_id_seq,
    public.lesson_practice_results_id_seq1
  FROM anon;

-- Retain the apparently orphaned legacy sequence for now, but remove
-- direct API-role access. Do not DROP it without a separate dependency audit.
REVOKE ALL PRIVILEGES
  ON SEQUENCE public.lesson_practice_results_id_seq
  FROM anon, authenticated;
```

Note: PostgreSQL/Supabase versions may expose additional privilege types. Re-run the grant comparison after applying the existing migrations and this approved follow-up; compare the exact role ACLs rather than relying only on this abbreviated SQL.

## Existing security-advisor findings

Both production and staging currently report the same broad categories:

- Eight INFO findings for private-schema tables with RLS enabled and no policies. This is intentional because the private schema is not exposed to anon/authenticated and access is through narrowly granted RPCs.
- Two WARN findings for authenticated execution of `public.is_personal_learning_test_access()` and `public.record_completed_lesson_practice_result(...)`. These are existing intentional SECURITY DEFINER RPCs; keep their owner checks, fixed search paths and explicit grants under regression coverage rather than revoking them solely to silence the generic advisor.
- One WARN for leaked-password protection being disabled. Google OAuth is the current sign-in route; assess the dashboard setting if password-based sign-in is enabled in future.
- No health-lint conclusion is implied by this document.

The current local CI security advisor for the U2.6.0 branch reported no issues in its disposable local Supabase environment. That result is not the same as a clean hosted-project advisor report.

## Recommended production rollout sequence (future, owner approval required)

1. Confirm current production migration history and compare it to the expected 2.5.0 baseline.
2. Export schema and available data, record the Free-plan backup limitation, and confirm a tested recovery path. Do not assume point-in-time recovery.
3. Review the two existing U2.6.0 migrations and this residual-grant SQL together.
4. Apply the exact reviewed migrations and follow-up SQL in a controlled production window only after explicit owner approval.
5. Re-run table/sequence/function grants, default ACL, RLS and policy queries.
6. Run production Security Advisor and inspect all findings; distinguish intentional private-schema/SECURITY DEFINER findings from new issues.
7. Run read-only application smoke checks and verify Google sign-in, saved words, learning progress, Quiz, Flashcards and account switching.
8. Keep production account deletion disabled until the Edge Function is deliberately deployed and separately verified against production configuration.

## Sources and limitations

- Current Supabase Data API access model: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- Supabase's October 30, 2026 Data API exposure rollout: new public tables require explicit grants; RLS remains a separate control.
- Supabase CLI v3 changed hosted/local targeting and confirmation behavior on November 4, 2026: https://supabase.com/changelog?next=Y3Vyc29yOnYyOpK0MjAyNS0wMS0xM1QyMDo1OTowOFrOAHdWlQ%3D%3D&restPage=2 . Any future CLI rollout must explicitly target the hosted project and include the required confirmation flags; do not casually upgrade the existing CI CLI workflow.
- This audit did not inspect user rows, execute a production migration, alter grants, change Auth/Edge Function configuration or modify provider settings.


## Second technical review — corrections required before rollout (2026-11-21)

The proposed SQL above remains a draft. A second review of both existing migrations against the observed production/staging schema found additional rollout hazards:

1. **Sequence-name drift affects migration portability.** Staging's `lesson_practice_results.id` uses `lesson_practice_results_id_seq`; production's column uses `lesson_practice_results_id_seq1`. The second migration revokes anonymous UPDATE on `lesson_practice_results_id_seq`. In production that name identifies the apparent orphan, not the sequence owned by the identity column. Applying the migration unchanged would therefore fail to remove UPDATE from the actual production-owned sequence. Resolve this with a schema-aware migration that discovers the sequence using `pg_get_serial_sequence('public.lesson_practice_results','id')` (and validates the result), or a carefully reviewed environment-specific migration. Do not rename or drop either sequence as part of this fix.

2. **Second migration preserves an anonymous plan-limit read contrary to the staging comparison.** Its header says it preserves authenticated-only SELECT on `learning_plan_limits`, but the SQL does not revoke anon SELECT. The production/staging comparison confirms anon SELECT exists in production and no anon table grant exists in staging. The proposed production follow-up revokes it; add a regression assertion so the drift cannot recur.

3. **Daily-session authenticated non-DML privileges are not fully revoked by migration one.** It removes authenticated DELETE, but the production comparison found residual REFERENCES, TRIGGER and TRUNCATE. The follow-up SQL revokes those privileges. Include them in a common migration or production follow-up and assert the final role ACLs.

4. **Orphan sequence handling must remain conservative.** The production `lesson_practice_results_id_seq` appears unowned, but this alone does not prove there are no dynamic SQL, external scripts or application references. Retain it; revoke client access only after checking all dependencies and confirming no runtime path requires it. Do not drop it in this release.

5. **Global function default-privilege revoke needs impact review.** Migration one uses `ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC` without an `IN SCHEMA` clause. This changes defaults for future functions created by `postgres` across schemas, not only `public`. That may be intentional to prevent PostgreSQL's default PUBLIC EXECUTE, but inventory other postgres-owned schemas and expected RPCs before production rollout. Explicitly grant EXECUTE to intended client-callable functions and test them after applying the change. Do not replace this with a schema-scoped revoke and assume it overrides a global grant; PostgreSQL default-privilege semantics do not work that way.

### Revised recommendation

Do not run the current proposed SQL verbatim. First revise the feature migrations so they are safe against the known sequence-name drift, remove the anonymous `learning_plan_limits` grant, and remove all unintended non-DML `daily_activity_sessions` grants. Add CI assertions for the exact final table, sequence, function and default ACLs. Review the global default-function change across schemas. Then apply and verify the same migration set on staging before preparing a separate, owner-approved production rollout.

No production or staging changes were made during this second review.


## 2026-11-21 second-review implementation status

A second technical review identified the production/staging identity-sequence naming difference and the residual anonymous plan-limit/session grants. The feature branch now contains:

- `supabase/migrations/20261121090000_update_2_6_0_acl_drift_correction.sql`: removes anon access to Daily Learning sessions and plan limits; removes authenticated non-DML privileges from Daily Learning sessions; dynamically resolves the practice-results identity sequence with `pg_get_serial_sequence` and removes anon privileges from the actual owned sequence. It does not rename or drop any sequence.
- `supabase/tests/update_2_6_0_acl_drift_correction.sql`: asserts those effective grants.
- `.github/workflows/update-2-6-0-acl-test.yml`: runs the full migration chain and ACL tests on disposable local Supabase/PostgreSQL.

The new workflow has not yet been observed passing at the time of this document update. Do not apply the migrations to staging or production until the CI run is green and the owner approves the staging test sequence. The global default-function EXECUTE revoke in the first U2.6.0 migration still needs cross-schema impact review.

The owner confirmed account deletion works on Singapore staging on 2026-11-21. This does not imply production deletion has been deployed or tested.


## 2026-11-21 schema-wide default-privilege impact review

A read-only schema/function inventory in both hosted environments found the same relevant schema layout:

| Schema | Owner | Functions owned by postgres |
|---|---|---:|
| `extensions` | postgres | 49 |
| `private` | postgres | 32 |
| `public` | pg_database_owner | 31 production / 29 staging |
| `supabase_migrations` | postgres | 0 |
| `auth`, `graphql`, `graphql_public`, `realtime`, `storage`, `vault` | supabase_admin | 0 postgres-owned functions |

This confirms that the global `ALTER DEFAULT PRIVILEGES FOR ROLE postgres REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC` affects future postgres-created functions beyond the application `public` schema, especially `extensions` (49 existing postgres-owned functions) and `private` (32). Existing functions' ACLs are not retroactively changed by a default-privilege command, but future extension functions could lose the historical PUBLIC EXECUTE default and break extension compatibility.

The corrective migration now adds a schema-specific default grant for `extensions`:

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA extensions
  GRANT EXECUTE ON FUNCTIONS TO PUBLIC;
```

This preserves the previous default for future extension-schema functions while retaining the intended restricted defaults for application functions in `public` and internal functions in `private`. A CI regression test creates temporary functions in both schemas and verifies the respective behavior. This is a compatibility-preserving choice based on the current observed schema inventory; re-check it if extension ownership/schema configuration changes.

## Current feature-branch implementation and CI status

- New migration: `supabase/migrations/20261121090000_update_2_6_0_acl_drift_correction.sql`.
- New ACL assertions: `supabase/tests/update_2_6_0_acl_drift_correction.sql`.
- Disposable synthetic pre-migration fixture: `tests/update-2-6-0/acl-drift-baseline.sql`.
- Production-shape identity sequence rename fixture: `tests/update-2-6-0/rename-practice-sequence-to-production-shape.sql`.
- Dedicated workflow: `.github/workflows/update-2-6-0-acl-test.yml`.

The first attempt at a local CI workflow tried to replay the entire historical migration chain and failed in an older Update 2.2.0 reconciliation migration before reaching U2.6.0. This is an unrelated pre-existing fixture/chain issue, not evidence of a failure in the new ACL migration. The workflow was isolated from that historical chain: it now builds the synthetic application baseline, applies the two existing U2.6.0 migrations, verifies their baseline grants, renames the practice-results sequence to mimic production, applies the corrective migration and tests the final ACLs/defaults.

The isolated workflow is currently running. No result should be treated as passing until the final run completes successfully.


## 2026-11-21 isolated ACL regression — passed

The dedicated PostgreSQL 17 ACL regression now passes on the current Update 2.6.0 feature head. GitHub Actions results:

- Pull-request run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44854645412 — success.
- Feature-branch push run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44854640598 — success.

The disposable test environment reproduced the audited Singapore staging baseline, then overlaid the known production-shaped ACL differences. It applied the two existing U2.6.0 ACL migrations, renamed the practice-results identity sequence to production's lesson_practice_results_id_seq1 shape, applied the corrective migration, and passed assertions for:

- No anonymous access to daily_activity_sessions or learning_plan_limits.
- Authenticated session access limited to SELECT/INSERT/UPDATE, with DELETE/TRUNCATE/REFERENCES/TRIGGER/MAINTAIN removed.
- Anonymous access removed from all three identity sequences, including the dynamically resolved practice-results sequence.
- New public functions remain non-executable by anon/authenticated by default, while new extensions functions retain the historical PUBLIC EXECUTE default.

Two earlier attempts exposed test-fixture modelling issues (fixture ordering and Supabase-local default grants); those were corrected. The final run passed. This is CI validation against a disposable local PostgreSQL 17/Supabase environment, not a hosted staging or production migration. No hosted database was changed. The production rollout remains a separate, unapproved task.

The owner has explicitly approved merging PR #13 to main after remaining release checks pass. That approval does not authorize applying SQL to Tokyo production or manually deploying a production Edge Function/database change.
