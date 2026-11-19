# Update 2.5.0 — staging validation and production release gate (2026-11-19)

## Scope and owner instruction

The owner instructed completion of the Quiz local Supabase Auth/runtime workflow, verification and migration of the two new permanent lessons into the staging catalogue, staging validation of the Flashcards database migrations, and then merge to `main`. The owner had also said no additional manual Mock User testing was needed. The final branch push automatically ran the repository's existing CI workflows.

## Final implementation

- Feature branch: `feature/update-2-5-0-flashcards`.
- Current head: `1c6e5e779d154195652014150a6225a2ee1ddc9c`.
- PR #12: open, mergeable, target `main`; 192 commits, 28 changed files, no review submissions.
- Earlier UI fixes remain in place: localized Lessons library refresh and route-independent first-entry Quiz/Flashcards guides.
- Quiz test fixture was corrected so synthetic question topics match their catalogue entries for each difficulty; the Chinese prompt in the definition fixture is genuinely Simplified Chinese. The fixture asserts minimum question count, topic diversity and catalogue linkage.

## Staging migrations

Staging project: `SwiftDictionary Indie Staging` (`ivatvkfrtifgfheeaelj`, ap-southeast-1). Applied migrations:

1. `20261118090000` — Flashcards foundation.
2. `20261118100415` — Mixed Recall and review history.
3. `20261118100736` — review-history deletion.
4. `20261119094011` — 60/120-second challenge duration.
5. `20261119094122` — active catalogue entries for `b-greetings-polite-expressions` and `b-places-getting-around`.
6. `20261119094253` — preserve Quiz deletion in the shared learning-history cleanup.
7. `20261119094558` — restore deletion of Flashcards Weak Memory review items after the Quiz-preservation replacement.
8. `20261119095730` — index `private.flashcard_review_items.last_session_id`.

The migration history was reconciled to the exact version/name pairs recorded by staging. The CI workflow and static Flashcards checker now apply and validate those canonical filenames in order.

## Staging validation

- Both new Beginner lesson IDs exist as active `permanent_lesson` catalogue entries with topic `everyday-vocabulary` and difficulty `beginner`.
- Rollback-only authenticated progress inserts for each new lesson passed the catalogue guard.
- `private.flashcard_sessions.duration_seconds` is a non-null integer defaulting to 60; RPC validates only 60/120 seconds.
- All five Flashcards private tables have RLS enabled and no direct browser-role table grants.
- Authenticated Flashcards RPC SQL tests passed using rollback-safe execution.
- The corrected synthetic Quiz runtime fixture passed a staging dry-run inside a transaction and rolled back. Read-back confirmed zero synthetic Quiz rows, runtime catalogue rows or test lesson-progress rows remain.
- The shared deletion function requires recent authentication, serializes with the per-user advisory lock, deletes Quiz sessions and Flashcards sessions/mastery/review items, and preserves existing lesson/daily history deletion.
- The review-session foreign-key index exists. The advisor no longer reports this new FK as unindexed.

## Final CI

All PR-triggered workflows passed on the current feature head:

- Quiz database foundation and local Supabase Auth/RPC workflow #44501212949: passed; 11 authenticated Chromium Quiz tests.
- Flashcards workflow #44501212878: passed; static syntax/page integration, 25/25 mock regression tests, 14/14 Chromium Flashcards tests.
- 2.3.x regression workflow #44501212882: passed; PostgreSQL 17 migration/allowance checks, local Auth compatibility and 37/37 Chromium regression tests.

Cloudflare Pages checks succeeded for both `swiftdictionary-testing` and `swiftdictionary`. Separate Cloudflare Workers Build checks failed with `Preview creation failed: This Worker does not exist on your account` for the Worker preview target; these are distinct from the successful Cloudflare Pages builds.

## Security and performance review

- No security-advisor errors. Eight INFO findings identify private-schema tables with RLS enabled and no policies; direct browser-role grants are intentionally absent.
- Two existing SECURITY DEFINER warnings remain for `public.is_personal_learning_test_access()` and `public.record_completed_lesson_practice_result(...)`. Source review confirmed empty `search_path`, current-user scoping via `auth.uid()`, and approved-catalogue/ownership checks.
- Existing unindexed foreign-key and RLS init-plan warnings remain elsewhere. The new Flashcards review-session FK warning was resolved by migration `20261119095730`; the index is reported unused while staging has sparse review-history data.

## Production release and merge decision

Production project `SwiftDictionary` (`pzymiesazmpyvnfvsbsc`, ap-northeast-1) is currently migrated through the 2.4.1 Quiz translation-language fix. It does not yet have any of the eight 2.5.0 migrations listed above.

Cloudflare Pages is configured with `main` as its production branch and automatic production deployments enabled. Therefore, merging PR #12 publishes the frontend to the public site. The feature's new RPCs/tables and new lesson catalogue entries must exist in production before that frontend deployment.

**Decision: hold PR #12 open until the owner explicitly approves the eight validated 2.5.0 migrations on production.** The owner has already requested the merge; the outstanding approval is specifically the production database migration set needed to avoid publishing a frontend whose Flashcards backend schema is absent. No production migration, production data operation, PR merge or production deployment has occurred.

## Legal and privacy

No new personal-data category, processor, analytics event, raw-answer telemetry or retention period was added. Existing account-scoped history and deletion controls remain. Continue Malaysia PDPA and applicable international/16+ privacy review before wider public/commercial expansion. This is planning, not legal advice or compliance certification. Human bilingual accuracy review of the 199 Quiz questions remains deferred, not waived.

## Recovery

Continue from `feature/update-2-5-0-flashcards` at `1c6e5e779d154195652014150a6225a2ee1ddc9c`. PR #12 remains open and unmerged. Keep project documentation on `docs/master-development-record`.
