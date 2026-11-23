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


## Owner follow-up — staging authorization, database activation and preview handover

The owner explicitly approved changes to the isolated Supabase staging database.

### Supabase staging target

- Project: SwiftDictionary Indie Staging
- Ref: `ivatvkfrtifgfheeaelj`
- Region: `ap-southeast-1`
- PostgreSQL 17.12
- Status: active and healthy

### Migrations applied

The six core U2.8.0 migrations were applied successfully: Chinese review foundation; Flashcard language and snapshots; Chinese Quiz runtime; Daily practice attempt metrics; Quiz source composition guard; and security-invoker wrappers.

Three supplemental migration files were added and applied:
- Flashcard review response compatibility: include both `mode` and `recall_mode`.
- Chinese Quiz question bank seed: 145 Chinese-course questions mapped to 17 Chinese permanent lessons.
- Foreign-key supporting indexes: 11 indexes for newly relevant relationship paths.

A one-off Flashcard review hotfix was also applied immediately before the canonical migration file was committed. The canonical migration reapplies the same function definition; staging migration history records both operations. No production migration or content change was performed.

### Chinese Quiz content activation

The committed question-bank migration inserts all 145 questions as `draft` by default. Staging-only promotion changed those 145 rows to `approved` to make the preview Quiz runtime usable; this did not approve production content.

Validation on staging:
- 145 Chinese Quiz questions present.
- Zero invalid correct-answer references.
- Zero missing lesson mappings.
- 17 translation questions intentionally have no prompt Pinyin because their prompt text is English; Chinese-language prompts include Pinyin.

### Authenticated RPC smoke checks

Rollback-only transactions using an existing staging test profile verified:
- Chinese Quiz availability: Beginner, Intermediate and Advanced are available.
- Beginner Quiz start returned 10 Chinese questions with Pinyin and four answer options.
- 60-second Chinese Word Recall Flashcard session creation returned a valid session and language snapshot.
- The test transactions were rolled back, so no usage or sessions were retained.

### Preview environment routing

Feature-branch `supabase-config.js` routes Cloudflare Pages preview hosts (`*.pages.dev`, excluding the production `swiftdictionary.pages.dev` host) to the staging project URL and publishable key. Non-preview and production hosts retain the Production Supabase configuration.

Latest Pages deployment at feature head `79ae67d7aef0bc6cca97a2a1024a3e18b51f5532` succeeded:
- Preview: https://fce59d48.swiftdictionary.pages.dev
- Stable branch preview: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev

### Validation state

Passed on recent feature heads: Cloudflare Pages deployment; Cloudflare build routing; Flashcards structural checks; PostgreSQL 17 migration/allowance tests; ACL regression; U2.7 lesson-start regression; Chromium smoke tests; Chinese dictionary checks; and signed-out Flashcards browser checks.

The earlier authenticated browser workflow exposed a mismatch between review payload field `recall_mode` and the test contract's `mode`. The function now returns both fields. Latest-head authenticated Supabase/Auth/RPC and remaining regression workflows were still running at the last inspection; final conclusions must be checked before claiming all CI green.

The separate retired Workers Builds service `swiftdictionary-testing` remains unrelated to the successful Pages deployment.

### Supabase advisor results

- No health advisor findings.
- Private-schema tables with RLS enabled and no policies are intentionally deny-by-default; access is via authenticated RPC wrappers rather than direct Data API table access.
- The leaked-password-protection warning remains; assess if password authentication is enabled (the app's current sign-in flow is Google OAuth).
- Added supporting indexes for the foreign-key paths flagged by the advisor. Remaining performance warnings are pre-existing RLS init-plan warnings on `learning_page_introduction_preferences` and unused-index notices for indexes not yet exercised by preview traffic.
- No critical/high-severity advisor finding was returned.

### Malaysia and international legal/privacy planning

Malaysia's Personal Data Protection Regulations require parental/guardian consent for data subjects under 18. The intended 16+ audience therefore requires a specific approach for 16–17-year-old users before public launch. Cross-border processing (Supabase staging in Singapore and globally distributed hosting/auth providers), privacy notice, DPO applicability, breach notification and retention/deletion procedures need a documented legal/privacy review. This is a risk-planning note, not legal advice or legal clearance.

Official references:
- Malaysian PDP Department, [Personal Data Protection (Amendment) Act 2024](https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024/)
- [Personal Data Protection Regulations 2013](https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2024/07/Peraturan-peraturan-Perlindungan-Data-Peribadi.pdf)
- [Data Protection by Design Guideline](https://www.pdp.gov.my/wp-content/uploads/2026/04/Data-Protection-By-Design-Guideline-DPbD.pdf)

### Production boundary

A documentation-only archive file was briefly created on the default branch by the GitHub file-creation action. It was immediately deleted. The resulting Production `main` tree hash was verified identical to the pre-action baseline tree (`c9d2d763a992ca121455565d9da5a93884ef9fbc`). No application code, database or production deployment was changed. The archive and Master Development Record remain on the documentation branch.

PR #16 remains draft/open. No merge, production migration or production deployment is authorized.
