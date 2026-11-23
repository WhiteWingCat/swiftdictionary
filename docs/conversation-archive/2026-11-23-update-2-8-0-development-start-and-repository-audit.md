# 2026-11-23 — Update 2.8.0 development start and repository audit correction

## Owner instruction

The owner requested that the latest Master Development Record and relevant conversation archive be read, the U2.8.0 plan updated, and development begun. This is the separate explicit start instruction required by the earlier planning hold. Application work is authorised on the existing U2.8.0 feature branch. Merge, production database migrations and production deployment remain separately gated.

## Repository baseline

- Production `main`: `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`.
- U2.8.0 branch: `feature/update-2-8-0-chinese-quiz-flashcards`.
- Audited feature head: `888d7c4e6bada45b2e09e23b449d49d1c71843a9`.
- GitHub compare reports 94 commits ahead and zero behind `main`.
- PR #16, “WIP: SwiftDictionary Update 2.8.0 — Chinese Quiz and Flashcards”, is open/draft and targets `main`.
- The earlier planning record said the branch was untouched at the initial handover. This later audit discovered substantial implementation already present; this archive supersedes the old “untouched” status. Do not reset or discard existing branch work.

## Implementation inventory observed

- Chinese Quiz draft question bank and Chinese curriculum/objective map.
- Chinese Flashcard draft bank with character, vocabulary and phrase categories.
- Four distinct Chinese recall modes (Word, Definition, Translation and Sentence) while retaining Mixed Recall as a separate composite mode.
- Language-aware Chinese Flashcard and Quiz runtime/session capture.
- Immutable per-card Flashcard review snapshots and owner-checked read-only review RPC.
- Dashboard four-tab layout, allowance cards and timezone-filtered Daily History.
- Lesson and Daily Learning first-attempt/retry metrics and Practice Insights aggregation.
- Daily Learning current-local-day filtering.
- Four U2.8.0 SQL migrations on the feature branch.

Content remains draft pending independent linguistic, answer-key, distractor, translation and anti-overlap QA. Structural validators are not linguistic sign-off.

## Database and deployment boundary

- Four U2.8.0 migrations exist in source control.
- None has been applied to staging or production.
- Cloudflare Pages preview check passed for the audited feature head. This is not a production deployment.
- No merge, production migration or production deployment was performed or authorised by the start instruction.
- Preserve production learner data. Destructive tests must use disposable local/CI or synthetic staging accounts only.

## CI evidence at audited head 888d7c4

- Cloudflare Pages preview: passed.
- U2.8.0 Quiz DB foundation: passed.
- Supabase CLI local Auth compatibility: passed.
- Local Supabase Auth/RPC integration: failed because the synthetic SQL fixture inserted an in-progress Flashcard session with nonzero counters, violating the existing `flashcard_sessions_counts_check`.
- PostgreSQL 17 migration/allowance checks: failed; inspect and remediate each failure without weakening invariants.
- Chromium smoke tests: 49 passed, 3 failed, 13 skipped. Failures included Dashboard/Practice Insights, historical Daily Learning review, and signed-out Flashcards auth-card visibility.
- U2.7.0 static/Chromium check failed on an assertion expecting an older Daily Learning source expression; verify semantics before changing the assertion.
- Cloudflare build-routing check failed on a cache-version/source-pattern assertion; preserve environment isolation and verify actual asset cache busting.
- U2.6.0 ACL regression failed; investigate separately and do not relax ACL/RLS.
- The separate `Workers Builds: swiftdictionary-testing` check failed for the retired Worker and is unrelated to the successful Pages preview.

## Remediation started

The SQL fixture was corrected on the feature branch in commit `81d379a4b3f74c99e23c33aa3f5b76737fd54643`: the in-progress session now starts with zero counters, and final counts are written only when transitioning to completed. CI rerun is pending at archive creation time.

## Immediate next steps

1. Re-run the SQL integration workflow after the fixture correction.
2. Inspect PostgreSQL/ACL failures and fix actual schema or test defects without weakening production constraints.
3. Fix Dashboard/Practice Insights and historical Daily Learning browser regressions.
4. Restore signed-out Flashcards banner/auth-panel visibility.
5. Reconcile U2.7.0 static and Cloudflare cache assertions against actual behaviour.
6. Run full cross-version CI and document intentional skips separately.
7. Continue independent Chinese Quiz/Flashcard linguistic and anti-overlap review.
8. Review RLS, RPC grants, account deletion and learning-history deletion paths in disposable local Supabase.
9. Complete Malaysia/international privacy, retention, cross-border and licensing review before release. Formal legal clearance remains outstanding.

## Documentation and recovery point

- Updated `docs/UPDATE-2.8.0-DEVELOPMENT-PLAN.md` to reflect the start instruction, actual branch/PR state, initial audit and CI failures.
- Updated `docs/MASTER-DEVELOPMENT-RECORD.md` to supersede the stale untouched-branch status.
- Added this archive and indexed it in `docs/conversation-archive/README.md`.
- Documentation changes are on `docs/master-development-record`; no documentation has been placed on production `main`.
- Recovery point: feature branch head `888d7c4e6bada45b2e09e23b449d49d1c71843a9`, followed by fixture correction commit `81d379a4b3f74c99e23c33aa3f5b76737fd54643`.
