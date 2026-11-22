# Production Supabase U2.7.0 rollout

**Date:** 2026-11-22  
**Scope:** Owner-approved production application of the two U2.6.0 least-privilege migrations and three U2.7.0 Lessons/Daily Learning migrations.  
**Production project:** `SwiftDictionary` (`pzymiesazmpyvnfvsbsc`, ap-northeast-1)  
**Staging project:** `SwiftDictionary Indie Staging` (`ivatvkfrtifgfheeaelj`, ap-southeast-1)

## Owner approval and execution boundary

The owner explicitly approved the exact five-migration sequence documented in the production preflight. Only the Production Supabase project was changed. No application source, Cloudflare Pages deployment, staging database or unrelated production data was changed.

## Applied migrations

All five migrations returned success and were recorded in the Production migration ledger in the approved order:

| Order | Source migration | Production ledger version | Result |
|---:|---|---|---|
| 1 | `20261119112433_swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions.sql` | `20261122131709` | Applied and verified |
| 2 | `20261120023718_update_2_6_0_remove_residual_api_privileges.sql` | `20261122131726` | Applied and verified |
| 3 | `20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql` | `20261122131738` | Applied and verified |
| 4 | `20261122123000_update_2_7_0_chinese_daily_learning_catalog.sql` | `20261122131749` | Applied and verified |
| 5 | `20261122143000_update_2_7_0_lesson_start_allowance.sql` | `20261122131802` | Applied and verified |

Production migration ledger now contains all five new entries after the existing U2.5.0 entries.

## Post-migration verification

Read-only production checks confirmed:

- `public.lesson_progress.learning_language` exists; legacy rows retain the English default.
- `public.lesson_practice_results.learning_language` exists.
- Language-aware practice RPC `public.record_completed_lesson_practice_result_for_language(text,text,text,text,integer,integer)` exists.
- Active Chinese permanent lessons: **17**.
- Active Chinese Daily Topic entries: **6**.
- Active Chinese Daily Application entries: **7**.
- Active Chinese Daily Discovery entries: **93**, with all 93 scheduled rotation positions present.
- `private.record_lesson_start_allowance()` and `public.enforce_learning_daily_limit()` exist.
- Enabled `lesson_progress_charge_on_first_start` trigger exists on `public.lesson_progress`.
- Existing lesson completion, catalogue-validation and update-guard triggers remain enabled.
- Daily session grants now match the reviewed model: anon has no SELECT; authenticated has SELECT/INSERT/UPDATE but no DELETE.
- Anonymous UPDATE on the legacy lesson-progress sequence is revoked.
- Default table privileges no longer automatically grant table access to anon/authenticated; default function EXECUTE is revoked from PUBLIC and the API roles. Sequence default ACL retains UPDATE only, consistent with the migration's documented nextval design; USAGE/SELECT are revoked.

The database migration application and schema/ACL checks succeeded. No learner progress/session rows were intentionally inserted, modified or deleted as part of verification.

## Owner's live-site confirmation

On 2026-11-22, the owner confirmed that **both English and Chinese content appeared on the live website as intended** after the production database rollout. The owner approved marking Update 2.7.0 complete.

This closes the rollout blocker that had displayed “waiting for server update” and confirms the live site can retrieve the English and Chinese learning content. The confirmation is specifically about the content appearing; this archive does not infer that every lesson lifecycle, allowance edge case, account-switching path or Daily Learning interaction was freshly re-tested in this final check.

**Release status: COMPLETED.** No further production database or application changes are required for this update based on the reported result. Any future defects should be tracked as a separate follow-up or hotfix, not left as an open U2.7.0 release gate.

## Legal/privacy and recovery notes

The rollout applied previously reviewed security hardening and learning functionality; it does not constitute a legal compliance certification. Formal Malaysia/international legal and privacy review remains outstanding as recorded in the MDDR. No new retention period, payment flow or Premium entitlement was introduced by this rollout.

**Recovery point:** Production project `pzymiesazmpyvnfvsbsc`; latest applied migration version `20261122131802`. The five migrations were transactional where defined by their source SQL. Do not blindly rerun or reverse them. Diagnose any post-rollout issue against the current schema and migration ledger first.
