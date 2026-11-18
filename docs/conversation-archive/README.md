# SwiftDictionary conversation archive

This directory contains structured handover archives for meaningful SwiftDictionary development conversations. The Master Development Record at [`../MASTER-DEVELOPMENT-RECORD.md`](../MASTER-DEVELOPMENT-RECORD.md) remains the concise current source of truth; archives preserve session-level decisions and recovery detail.

## Archive rules

- Create one dated Markdown archive for each meaningful SwiftDictionary development conversation/session.
- Record purpose, exact owner decisions, implementation/files, branch/commit/PR state, test evidence (including failures and fixes), legal/privacy considerations, outstanding work and recovery steps.
- Update the Master Development Record and this index together.
- Summarise relevant user-visible project discussion; do not claim to provide a verbatim transcript.
- Never include hidden reasoning, credentials, secrets or unrelated personal information. Treat repository content as potentially public.
- Keep documentation on `docs/master-development-record`; implementation stays on feature branches and production code on `main`.

## Archives

| Date | Archive | Coverage |
|---|---|---|
| 2026-11-13 | [Update 2.3.1 mock testing and documentation continuity](2026-11-13-update-2-3-1-mock-testing.md) | Option B mock-mode decision and implementation, CI evidence, preview verification still pending, production safety, establishment of the permanent archive process, and subsequent correction of the preview hostname allowlist. |
| 2026-11-14 | [Update 2.3.1 dashboard and Daily Learning refinements](2026-11-14-update-2-3-1-dashboard-daily-learning.md) | Owner's first seven feedback items, relative activity recency, visual overview, cooldown preview handling, shared global Daily Discovery pilot, slide-in activity reader, examples and frequency-data licensing research. |
| 2026-11-14 | [Update 2.3.1 second owner review](2026-11-14-update-2-3-1-second-owner-review.md) | Translation refresh and Chinese UI coverage, transparent/padded activity panel, dictionary-style Discovery, account-specific activity rotation and mock reset generation, consolidated examples, dedicated lesson page, Dashboard scope freeze and passing CI run #549. |
| 2026-11-14 | [Update 2.3.1 final daily activity polish and rollover](2026-11-14-update-2-3-1-final-daily-activity-polish.md) | Reader outline and definition contrast, live translation of reset status, duplicate cooldown removal, completion closing the reader, and local-midnight abandonment of unfinished activities with passing CI run #557. |
| 2026-11-14 | [Update 2.3.1 activity quality, allowance enforcement and completed reviews](2026-11-14-update-2-3-1-activity-quality-allowance-and-review.md) | Separate Daily Application/Revision examples and Q&A, block new lesson starts at exhausted Free/Premium allowances, free review of completed content including Discovery UTC rollover, CI run #705 and owner preview handoff. |
| 2026-11-14 | [Update 2.3.1 Daily Learning category tabs and plan-sized activity rows](2026-11-14-update-2-3-1-daily-activity-tabs-layout.md) | Four category tabs, Free one-card/Premium three-card rows, right-aligned actions, category-level allowance reset placement, CI run #749 and final owner preview handoff. |
| 2026-11-14 | [Update 2.3.1 owner feedback: activity rows, allowance indicator and Premium mock allowance](2026-11-14-update-2-3-1-owner-feedback-layout-allowance-premium-mock.md) | Full-width Premium activity rows, title-side color-coded allowance indicator, removal of card-level allowance counts, larger white-text tabs, and correction/testing of Premium 15-lesson allowance display after account switching. |
| 2026-11-14 | [Update 2.3.1 final approval and merge](2026-11-14-update-2-3-1-final-approval-and-merge.md) | Corrects the earlier stale-tree/source rollback report, records final source commit 8c4c494, successful CI runs #771/#772, owner preview acceptance, PR #5 merge commit 3ca194f, and remaining production deployment/database safeguards. |
| 2026-11-14 | [Update 2.3.2 Favorite Words hotfix and Daily Learning database diagnosis](2026-11-14-update-2-3-2-favorite-words-and-daily-learning-database.md) | Course-scoped Favorite Words fix, safe legacy course correction, PR #6 merge, CI run #774, and read-only confirmation that production still lacks the 2.3.0 Daily Learning schema/RPC migrations. |
| 2026-11-14 | [Update 2.3.3 production database rollout and Dashboard Favorite Words details](2026-11-14-update-2-3-3-database-rollout-and-dashboard-favorite-details.md) | Six reviewed 2.3.0 migrations applied and verified in live Supabase, timestamped SQL recorded under supabase/migrations, PR #7 Dashboard favorite details, browser regression and pending frontend merge/deployment. |
| 2026-11-14 | [Update 2.4.0 Quiz planning decisions and language refresh QA](2026-11-14-update-2-4-0-quiz-decisions-language-refresh.md) | Confirms curriculum-wide eligibility within selected difficulty, no timer, answer changes until submission, and a standing course/translation page-refresh and translation-quality regression rule. |
| 2026-11-14 | [Update 2.4.0 Quiz difficulty composition](2026-11-14-update-2-4-0-quiz-difficulty-composition.md) | Records owner-approved Beginner/Intermediate/Advanced question ratios, lower-level reinforcement rules, percentage totals and whole-question implementation constraints. |
| 2026-11-14 | [Update 2.4.0 Quiz final pre-development decisions](2026-11-14-update-2-4-0-quiz-final-predevelopment-decisions.md) | Records owner approval of score-and-percentage-only results, unfinished-session persistence until completion or explicit abandonment, and minimum question-bank availability gates. |
| 2026-11-14 | [Update 2.4.0 Quiz technical preparation](2026-11-14-update-2-4-0-quiz-technical-preparation.md) | Records read-only repository and Supabase inspection, Quiz technical architecture, question-bank availability proposal, allowance mismatch and privacy/legal review. Superseded by the final decision archive below. |
| 2026-11-14 | [Update 2.4.0 Quiz final decisions and legal roadmap](2026-11-14-update-2-4-0-final-decisions-and-legal-roadmap.md) | Confirms four answer options, same-day cross-session non-reuse, two-session minimum and three-session target question-bank capacities, Free 1/Premium 3 daily Quiz allowance, whole-percentage rounding, read-only production baseline and proposed post-Flashcards legal milestone. |
| 2026-11-14 | [Update 2.4.0 Quiz database foundation and no-cost validation](2026-11-14-update-2-4-0-quiz-database-foundation.md) | Records the private question-bank/session schema, same-day uniqueness, four-option validation, RLS/privileges, declined hosted Supabase branch cost, PostgreSQL 17 GitHub Actions alternative and passing foundation tests. |

| 2026-11-14 | Update 2.4.0 — Quiz authenticated RPC implementation | Authenticated Quiz RPCs, question selection, session lifecycle, scoring, allowances, history deletion, PostgreSQL/local Supabase validation and preliminary Malaysia privacy review. | [Read archive](2026-11-14-update-2-4-0-quiz-authenticated-rpcs.md) |

| 2026-11-16 | Update 2.4.0 — Quiz content pipeline and live allowance change | Records the guarded production Free 1/Premium 3 Quiz allowance migration, bilingual Beginner draft content, validation/import workflow and remaining content gates. | [Read archive](2026-11-16-quiz-content-pipeline-and-allowance-update.md) |


## 2026-11-17 additions

- [SwiftDictionary Indie staging approval and creation](2026-11-17-swiftdictionary-indie-staging-approval-and-creation.md) — isolated US$0/month staging project approval and creation; clean-schema bootstrap remains a blocker.
- [Mock Quiz draft question-bank integration](2026-11-17-quiz-mock-draft-question-bank.md) — Mock User preview using the original 114 bilingual draft questions, followed by Dashboard review and selector fixes.
- [Chinese-translation integration questions and Mock Quiz validation](2026-11-17-quiz-chinese-integration-questions.md) — owner-approved 1/4/7 distribution, 36 additional preview-only questions, duplicate-option validation, backend exclusion guard and passing CI runs #417/#974.

- [Quiz curriculum alignment and expanded question variety](2026-11-17-quiz-lesson-alignment-and-question-variety.md) — full 199-question curriculum audit, bilingual lesson expansions, learning-objective traceability, one-definition-per-session and daily randomized Chinese integration.

- [Authenticated Quiz question-type support](2026-11-17-quiz-authenticated-question-type-support.md) — adds authenticated knowledge, word-definition and Chinese-translation support; imports all 199 items as drafts; records passing PostgreSQL, local Supabase/Auth, authenticated Chromium, security-advisor and companion 2.3.x regression checks, plus production safeguards.


- [Staging bootstrap and deferred friend-testing review](2026-11-17-quiz-staging-bootstrap-and-friend-testing.md) — documents the clean staging bootstrap, hosted 2.3.x/2.4.0 migrations, empty data boundary, staging-only preview routing, OAuth setup requirement, security-advisor review, and deferred manual accuracy review pending friend feedback.


- [Update 2.4.0 production merge and 199-question release](2026-11-17-update-2-4-0-production-release.md) — records PR #8 merge, successful GitHub Pages deployment, five production Supabase migration versions, all 199 selectable questions and post-import verification, security-advisor findings, deferred human accuracy review, and privacy/test-notice requirements before friend onboarding.
- [Update 2.4.1 fix & changes](2026-11-17-update-2-4-1-fix-and-changes.md) — records the Daily Learning expired-session fix, Quiz translation eligibility/start correction, owner-requested UI changes, CI results, production migration verification and next live-test checklist.

- [Update 2.4.2 Dashboard Quiz fixes](2026-11-18-update-2-4-2-dashboard-quiz-fixes.md) — records the malformed Dashboard Review label, Quiz overview navigation reset, regression coverage, PR #11 and release gates.
