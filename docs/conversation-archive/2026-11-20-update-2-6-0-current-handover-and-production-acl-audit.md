# Update 2.6.0 — current handover, PR correction and production ACL audit

Date: 2026-11-20

## Scope and source of truth

Read the current `docs/MASTER-DEVELOPMENT-RECORD.md`, the latest November 20 Phase L and U2.6.0 conversation archives, the legal/privacy plan and current branch/PR state before continuing.

The active application repository is `WhiteWingCat/swiftdictionary` (not the similarly named older `wordbook` repository). The authoritative documentation branch is `docs/master-development-record`. The active application branch is `feature/update-2-6-0-legal-privacy-security`; PR #13 targets `main`.

## Owner update

The owner confirmed that GitHub has been disconnected from the Cloudflare `SwiftDictionary-testing` project and that this project is no longer used.

Treat the old separate Worker build check for `SwiftDictionary-testing` as obsolete. Do not reconnect it, deploy to it, or treat its failure as a blocker for the active `swiftdictionary` Cloudflare Pages application. The Pages preview and GitHub Actions checks remain separate.

The owner has not yet tested account deletion in the current staging preview. Older archive wording that reports successful staging account deletion refers to an earlier test/history point and must not be treated as evidence that the current deletion flow has passed. The owner explicitly confirmed in the current conversation that deletion remains untested.

## Current GitHub state

- Active feature branch: `feature/update-2-6-0-legal-privacy-security`.
- Feature head: `bf93bf925c489433f4cfde0add3748d992f25dd2`.
- Draft PR #13: https://github.com/WhiteWingCat/swiftdictionary/pull/13
- Base branch: `main`.
- PR is open, draft, mergeable and unmerged.
- PR body was corrected during this session to:
  - report only confirmed passing checks;
  - remove any implication that the current account-deletion flow has passed owner testing;
  - record that the separate Cloudflare `SwiftDictionary-testing` Worker is retired;
  - retain the legal/privacy deferral and production safety boundary.
- No merge, production deployment, production migration or production Edge Function change was performed.

## CI verification on current feature head

GitHub Actions on `bf93bf925c489433f4cfde0add3748d992f25dd2` returned success for:
- Cloudflare build routing guard — PR run `44733764948`.
- Quiz database foundation — PR run `44733764841`.
- 2.3.x allowance/dashboard regression workflow — PR run `44733764944`.
- Flashcards checks — PR run `44733765083`.

The recorded full local Supabase/Auth/RPC integration, PostgreSQL 17 migration/allowance tests, authenticated Quiz runtime, signed-out Flashcards/Preferences checks, Lessons allowance-notification regression and disposable local Supabase Security Advisor also passed. Local advisor output was `No issues found`. These are CI/disposable-local results, not a production security certification.

## Owner-reported staging checks

- Google sign-in works on the Singapore staging preview for the two test accounts.
- Test-account saved data/progress remains isolated.
- The current account-deletion path has not been manually tested by the owner. Do not use the owner's personal account for destructive validation. Use a disposable synthetic staging account and synthetic browser profile.

## Read-only production/staging ACL audit

Both Supabase projects were ACTIVE_HEALTHY and PostgreSQL 17. Production is Tokyo (17.11); staging is Singapore (17.12). The owner confirmed both are Free plan.

Staging has the two U2.6.0 ACL migrations:
- `20261119112433` — least-privilege defaults and Daily Learning sessions.
- `20261120023718` — residual API privilege removal.

Production has not applied these migrations. Read-only comparison confirmed:
- RLS is enabled on all inspected public application tables in both projects; account-owner policies exist in both, though some policy names differ.
- Production still has broad anon and authenticated privileges on `daily_activity_sessions`; staging has no anon table grant and authenticated only INSERT/SELECT/UPDATE.
- Production grants anon SELECT on `learning_plan_limits`; staging does not grant anon access.
- Production still grants EXECUTE on the two trigger-only guard functions to PUBLIC/anon/authenticated; staging revokes those client grants. The existing first U2.6.0 migration includes the revoke.
- Production grants anon sequence privileges on `learning_activity_log_id_seq`, `lesson_progress_id_seq` and the production-owned `lesson_practice_results_id_seq1`; staging has no anon sequence grants. The existing follow-up migration revokes UPDATE only, so residual SELECT/USAGE may remain in production after it is applied.
- Production contains an apparently orphaned `lesson_practice_results_id_seq` without an ownership dependency; the owned production sequence is `lesson_practice_results_id_seq1`. Staging's owned sequence is `lesson_practice_results_id_seq`. Do not drop the production orphan in this update; a separate dependency audit is required.
- Production's `postgres` default privileges still broadly grant tables/sequences/functions to anon/authenticated and functions to PUBLIC. Staging's `postgres` default privileges have the client grants revoked. The existing first U2.6.0 migration includes the intended default-privilege correction.
- `supabase_admin` default ACLs are broad in both projects; they were not modified and should not be changed as part of this application patch.

A dedicated unapproved remediation note with a proposed SQL follow-up and controlled rollout checklist was created at `docs/reference/UPDATE-2.6.0-PRODUCTION-ACL-REMEDIATION-DRAFT.md`. It is a documentation draft only; no production ACL was changed.

## Hosted Security Advisor

Production and staging currently report:
- Eight INFO findings for private-schema tables with RLS enabled but no policies; this is intentional for unexposed private tables accessed only through narrow RPCs.
- Two WARN findings for authenticated execution of intentional SECURITY DEFINER lesson-testing/practice-summary RPCs. Keep ownership checks and search-path protections covered by tests.
- One WARN for leaked-password protection disabled. The app currently uses Google OAuth; review this setting if password authentication is introduced.
These advisor results are not a clean bill of health or legal compliance sign-off.

## Legal/privacy status

The owner cannot currently arrange external legal review and has asked to defer formal legal/privacy review for this update. Record this as **deferred, not completed, waived or approved**. The internal bilingual Privacy Notice and Terms drafts remain unpublished. The public Terms page is a non-binding placeholder and does not collect acceptance. Do not invent operator identity or publish an unverified contact address. Malaysia PDPA applicability, controller identity/capacity, 16–17-year-old safeguards, lawful basis, international transfers, DPO/DPIA applicability, provider/subprocessor terms, retention periods, final Terms wording and contact verification remain open.

## Supabase platform changes checked

The current Supabase changelog was reviewed before the ACL work:
- On October 30, 2026, the new default for public-schema Data API exposure is enforced across existing projects; newly created public tables require explicit grants. Grants and RLS are separate layers.
- Supabase CLI v3 (released November 2, 2026) is local-by-default and changes hosted confirmation behaviour. Future CI/CLI upgrades must explicitly target remote projects and pass required confirmation options; do not upgrade the project's CLI workflow casually.
- Both projects report PostgreSQL 17.11/17.12, beyond the 17.11.0.003 minimum mentioned in the October 30 timezone bugfix note.

Sources:
- https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- https://supabase.com/changelog?next=Y3Vyc29yOnYyOpK0MjAyNS0wMS0xM1QyMDo1OTowOFrOAHdWlQ%3D%3D&restPage=2
- https://supabase.com/changelog?tags=database

## Recovery point and next actions

1. Continue on `feature/update-2-6-0-legal-privacy-security` for application code. Keep internal planning and session records on `docs/master-development-record`.
2. Do not merge PR #13 until the owner explicitly approves.
3. Do not change production Supabase. Review the production ACL remediation draft and plan a separately approved rollout only after the feature release gate.
4. Before treating account deletion as complete, have the owner create/use a disposable synthetic Singapore staging account and test fresh-auth success/rejection, refresh-session revocation, all cascade deletions, final Auth absence, browser sign-out, success toast, error/retry path and optional local-word clearing.
5. Keep the Terms placeholder and internal legal drafts unpublished. Legal review remains deferred, not cleared.
6. Preserve all production data, configuration and deployment state until explicit owner approval.

No production data, schema, grants, OAuth configuration, Edge Function, Cloudflare Pages configuration or deployment was changed in this session.
