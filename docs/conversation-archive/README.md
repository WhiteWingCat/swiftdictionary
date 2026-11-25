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

- [Production Supabase U2.7.0 rollout](2026-11-22-production-supabase-u2-7-0-rollout.md) — records owner approval, successful application and verification of all five U2.6.0/U2.7.0 migrations, and the owner's confirmation that English and Chinese learning content appears on the live website; U2.7.0 is marked complete.
- [Production Supabase U2.7.0 rollout preflight](2026-11-22-production-supabase-u2-7-0-preflight.md) — read-only comparison of production and staging migrations, schema, lesson RPCs, catalogue, allowance trigger and ACLs; proposes the ordered two U2.6.0 plus three U2.7.0 migrations, with production execution still awaiting explicit approval.
- [Update 2.7.0 — implementation audit and QA checkpoint](2026-11-21-update-2-7-0-implementation-audit.md) — records the 725-character dictionary, 17/112 Chinese Lessons, language-aware progress migration, pinyin QA corrections, third-party licence notices and remaining staging/manual-review gates.

- [Update 2.7.0 dictionary expansion and Chinese Lessons progress](2026-11-21-update-2-7-0-dictionary-and-chinese-lessons-progress.md) — records 519 new Chinese characters, 725 total, the 17-lesson/112-question Chinese course, language-aware migration CI and remaining QA gates.

- [Update 2.7.0 planning finalization and development handover](2026-11-21-update-2-7-0-planning-finalization.md) — records the approved Chinese dictionary expansion, Pinyin A–Z/category filters, strict character-above-pinyin layout, Chinese Lessons scope, feature branch and Phase 0 audit starting point.
- [Update 2.7.0 linguistic QA and staging gate](2026-11-21-update-2-7-0-linguistic-qa-and-staging-gate.md) — records the current feature-branch audit, 519-character data checks, Chinese lesson dataset review, verified pronunciation corrections, latest commit and explicit Singapore staging-migration approval gate.
- [Update 2.7.0 Singapore staging migration and preview](2026-11-21-update-2-7-0-singapore-staging-migration-and-preview.md) — records owner approval, successful Singapore staging migration and post-checks, draft PR #14, stale regression assertion correction, latest CI state and Cloudflare Pages preview status.


| 2026-11-20 | [Update 2.6.0 account deletion auth freshness fix](2026-11-20-update-2-6-0-account-deletion-auth-freshness-fix.md) | Corrects the unsupported auth_time freshness gate to use Supabase AMR timestamps (excluding token refresh), hardens visible 401/no-navigation feedback, records Singapore staging Edge Function v3 and passing account-deletion guard, and preserves synthetic-only destructive testing and production/legal gates. |
| Date | Archive | Coverage |
|---|---|---|
| 2026-11-19 | [Update 2.5.0 owner feedback round 4](2026-11-19-update-2-5-0-owner-feedback-round-4.md) | Records inline Dictionary filters, centred Flashcards help, Accuracy-first results, Lessons Chinese banner translation, corrected test assertions, 13/13 Chromium Mock User tests passing, verified testing preview and pre-polishing handoff. |
| 2026-11-18 | [Update 2.5.0 Flashcards foundation implementation](2026-11-18-update-2-5-0-flashcards-foundation.md) | Records approved timer rules, Flash Recall modes, collections/custom cards, private account-scoped schema/RPCs, staging-only migration and authenticated SQL test, Mock User/CI checks, legal/privacy notes and remaining owner browser tests. |
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

- [Update 2.4.2 Dashboard Quiz fixes](2026-11-18-update-2-4-2-dashboard-quiz-fixes.md) — records both Dashboard fixes, PR #11 merge (`65d0a35`), passing CI workflows #44229322995/#44229322963 and successful GitHub Pages deployment #44230831943.


- [Master Development Record correction and branch hygiene review](2026-11-18-master-record-and-branch-hygiene.md) — closes the stale 2.3.0 gate wording, marks 2.4.0/2.4.1/2.4.2 released, confirms 2.5.0 as the next milestone, and records the agreed separation between production `main`, the documentation branch and temporary feature branches. Includes the repository branch/PR audit and safe cleanup requirements.

- [Rolling three-branch implementation policy](2026-11-18-rolling-three-branch-policy.md) — records the owner's decision to keep three recent implementation branches, retire the oldest when starting new work, and protect unfinished unique changes.

- [Live Supabase staging synchronization](2026-11-18-live-supabase-staging-synchronization.md) — records the staging-only 2.4.0 Quiz content and 2.4.1 translation migration rollout, migration-history reconciliation, exact production/staging content and function checksum parity, clean learner-data boundary and remaining staging test-account setup.

- [Update 2.5.0 Flashcards foundation implementation](2026-11-18-update-2-5-0-flashcards-foundation.md) — records the first implementation, staging authenticated RPC validation, Mock User support, passing CI, production safety boundary, privacy planning and manual testing gates.

- [Update 2.5.0 Flashcards follow-up: preflight validation](2026-11-18-update-2-5-0-flashcards-preflight-validation.md) — records the gameplay startup audit, preflight validation before server-session creation, stale round-state reset, regression coverage and remaining CI/manual browser validation.
- [Update 2.5.0 Flashcards implementation hardening and automated Mock User validation](2026-11-18-update-2-5-0-flashcards-implementation-hardening.md) — records round-target preflight, stable dictionary-card mastery identity, collection and session lifecycle fixes, English-course messaging, and passing workflow #77 with four Chromium Mock User browser tests; Cloudflare preview reachability and owner testing remain outstanding.

- [Update 2.5.0 Flashcards redesign and Mixed Recall](2026-11-18-update-2-5-0-flashcards-redesign-and-mixed-recall.md) — records the redesigned recall home/setup/game/result UI, Mixed Recall, mode-specific Weak Memory history, staging-only migrations, privacy deletion coverage and passing CI workflow #89 with four Chromium Mock User tests.

- [Update 2.5.0 owner feedback round 2](2026-11-19-update-2-5-0-owner-feedback-round-2.md) — records duplicate-question prevention, Simplified Chinese Flashcards UI/prompts, 60/120-second challenges, the Time's Up transition, Dashboard Flashcard statistics and Weak Memory, Lessons/Quiz banners, shared navigation styling, Dictionary Filters overlay, automated validation and the staging/production safety boundary.

- [Update 2.5.0 owner feedback round 3](2026-11-19-update-2-5-0-owner-feedback-round-3.md) — records the nine UI/behaviour fixes, duration-pill relocation, translation-panel regression guard, Weak Memory scroll and unanswered-timeout handling, test-failure diagnosis and corrections, all 13 Chromium Mock User browser tests passing in workflow #44483060698, and the verified Cloudflare testing preview handoff.
- [Update 2.5.0 Flashcards polishing stage](2026-11-19-update-2-5-0-polishing-stage.md) — records the first-entry Quiz/Flashcards introduction fix, refreshed bilingual help, Answer now/Next controls, normalized cross-mode question deduplication, 18 new lesson-linked vocabulary entries, two permanent Beginner lessons, catalogue draft updates and automated validation.

- [Update 2.5.0 owner final review fixes and release-readiness gate](2026-11-19-update-2-5-0-final-review-and-release-readiness.md) — records Lessons Chinese title/summary refresh, route-independent first-entry Quiz/Flashcards guides, current CI evidence, Supabase source review and the decision to hold PR #12 pending complete checks and migration approval.

- [Update 2.5.0 staging validation and production release gate](2026-11-19-update-2-5-0-staging-validation-and-production-release-gate.md) — records the final Quiz/Flashcards/2.3.x CI passes, staging migration history and catalogue validation, RLS/grants/advisor review, Cloudflare Pages checks, and the production migration approval gate before merging PR #12.

- [Update 2.6.0 legal, privacy, safety and security baseline audit](2026-11-19-update-2-6-0-legal-privacy-security-baseline-audit.md) — records the Malaysia-first legal research, international/16+ screening, current data inventory, read-only production/staging Supabase audit, identified least-privilege issue, privacy/account-deletion gaps, remediation priorities and docs-only blueprint commit.

- [Update 2.6.0 Phase F — provider data flows and cross-border review](2026-11-19-update-2-6-0-phase-f-provider-data-flows.md) — records Supabase regional and out-of-region processing, Cloudflare metadata/IP handling, Google OAuth attributes and outstanding DPA/retention checks.

- [Update 2.6.0 Phase E — production privilege comparison](2026-11-19-update-2-6-0-phase-e-production-privilege-comparison.md) — records residual production grants, staging ACL caveats, and the next least-privilege migration scope.

- [Update 2.6.0 Phase D — feedback inbox proposal and staging verification](2026-11-19-update-2-6-0-phase-d-feedback-and-staging.md) — documents the private, GitHub-free feedback proposal, privacy safeguards, existing Singapore staging project, CI success and the outstanding Cloudflare preview configuration.

- [Update 2.6.0 account deletion and retention design](2026-11-19-update-2-6-0-account-deletion-and-retention-design.md) — records the proposed server-side Auth Admin deletion workflow, JWT/session caveats, cascade and local-state requirements, and the retention schedule framework without inventing periods.

- [Update 2.6.0 Phase C — initial least-privilege database hardening](2026-11-19-update-2-6-0-phase-c-least-privilege-hardening.md) — records the staging-only migration, table/default privilege changes, trigger validation, advisor results, production hold and remaining authenticated Mock User tests.

- [Update 2.6.0 Phase B — provider and cross-border data-flow review](2026-11-19-update-2-6-0-phase-b-provider-and-cross-border-review.md) — records Supabase region versus out-of-region processing, Cloudflare Pages, Google OAuth, jsDelivr and GitHub feedback data flows, unverified tenant settings/retention, and the owner's Terms footer-placement decision.

- [Update 2.6.0 Phase A — operator and age-gate clarification](2026-11-19-update-2-6-0-phase-a-age-gate-and-operator-clarification.md) — records the owner's confirmation that SwiftDictionary is individually operated, the proposed low-data 16+ self-declaration flow, the Malaysian under-18 parental-consent issue under Regulation 3(3), and the post-cleanup retained branch set.


- [Update 2.6.0 Phase G — ACL re-verification and staging gap analysis](2026-11-19-update-2-6-0-phase-g-acl-reverification.md) — confirms the staging daily-session grants, finds residual anonymous UPDATE on three staging sequences, identifies PUBLIC EXECUTE as part of the production trigger-guard issue, and records remaining bootstrap-table ACL review and migration/production gates.

- [Update 2.6.0 Phase H — Cloudflare Pages identification and safe backend routing](2026-11-19-update-2-6-0-phase-h-cloudflare-routing.md) — identifies the `swiftdictionary` Pages project, records the fail-closed production/staging build router, shell tests and passing CI run #44518836358, and lists the outstanding dashboard/OAuth configuration.


- [Update 2.6.0 — Tuta contact setup and staging account-deletion audit](2026-11-20-update-2-6-0-tuta-contact-and-account-deletion-audit.md) — records the unverified Tuta mailbox status, read-only Singapore staging account-deletion audit, cascading ownership relationships, absence of an account-deletion Edge Function/Storage buckets, security-advisor snapshot and remaining owner/legal decisions.


- [Update 2.6.0 — Phase K: provider retention evidence and account-deletion UX](2026-11-20-update-2-6-0-phase-k-provider-retention-and-deletion-ux.md) — records the owner's approved Profile → Preferences deletion-warning flow, required security safeguards, provider-published retention facts versus unverified tenant settings, public GitHub repository status and remaining legal/privacy gates.

- [Update 2.6.0 — Phase L: owner dashboard inspection](2026-11-20-update-2-6-0-phase-l-owner-dashboard-inspection.md) — records owner-reported production/staging Supabase backup and Auth settings, Cloudflare Pages deployment/preview configuration, unconfigured Web Analytics, and the careful distinction between dashboard visibility and provider logging/retention.


- [Update 2.6.0 — Phase L retention confirmation and remaining-work handover](2026-11-20-update-2-6-0-phase-l-retention-confirmation-and-status.md) — records owner confirmation of both Supabase Free plans, current Supabase Auth/API log-history limits, Cloudflare Observability Usage and HTTP request-log findings, retention caveats, and the remaining technical/legal gates.

- [Update 2.6.0 — Account-deletion foundation implementation](2026-11-20-update-2-6-0-account-deletion-foundation.md) — records the owner's approved optional local saved-word clearing behaviour, the isolated anonymous-storage implementation, server-side Auth Admin deletion safeguards, staging Edge Function version 2, CI checks, verified cascade relationships and outstanding synthetic end-to-end validation.

- [Update 2.6.0 owner feedback: deletion clarity and signed-out Flashcards banner](2026-11-20-update-2-6-0-owner-feedback-ui-fixes.md) — records the distinct Delete Account/Learning history controls, in-site history confirmation, retained optional anonymous-saved-word checkbox semantics, signed-out Flashcards banner restoration, branch/test status and production safety boundary.

- [Update 2.6.0 owner feedback round 2: sign-in, deletion UI and Terms page](2026-11-20-update-2-6-0-owner-feedback-round-2-auth-deletion-terms.md) — records first-click Google sign-in timing, deterministic account-deletion module loading, in-site learning-history prompt verification, Terms publication placeholder and remaining legal/staging checks.


- [Update 2.6.0 owner feedback round 3: learning auth UI and preview regressions](2026-11-20-update-2-6-0-owner-feedback-round-3-learning-auth-ui-and-preview-regressions.md) — records the signed-out Lessons gate, shared Lessons/Quiz sign-in design, immediate Flashcards sign-out rendering, static Delete Account visibility, in-site Learning History browser test, Terms-link test, cache-busted scripts, preview deployment and current validation status.

- [Update 2.6.0 — account-deletion dialog preview regression](2026-11-20-update-2-6-0-account-deletion-dialog-preview-regression.md) — records the staging sign-in improvement, diagnosis of the account-deletion dialog's hidden-state CSS override, feature-branch fix, regression assertion and required preview/browser verification.

- [Update 2.6.0 — account-deletion success toast and allowance notification verification](2026-11-20-update-2-6-0-deletion-success-toast-and-allowance-notifications.md) — records the owner's successful Singapore-staging deletion/sign-out test, the post-sign-out five-second success-toast fix, verification of five-second Lessons/Quiz/Flashcards exhaustion notifications and current CI status.

- [Update 2.6.0 — allowance notification CI compatibility and legal-review deferral](2026-11-20-update-2-6-0-allowance-ci-fix-and-legal-review-deferral.md) — records the native-Promise test-adapter diagnosis and fix, Cloudflare Pages preview deployment, remaining CI status, owner-requested deferral of formal legal/privacy review, and the unchanged production boundary.


- [Update 2.6.0 — current handover, PR correction and production ACL audit](2026-11-20-update-2-6-0-current-handover-and-production-acl-audit.md) — records the owner's retirement of the separate Cloudflare testing Worker, corrected PR #13 status, latest CI results, current account-deletion test gap, read-only production/staging ACL differences, proposed production remediation draft and continued legal/privacy deferral.


- [Update 2.6.0 — account deletion confirmation and ACL second review](2026-11-20-update-2-6-0-current-handover-and-production-acl-audit.md) — follow-up: owner-confirmed staging account deletion, sequence-name drift discovery, corrective ACL migration/test/workflow, and outstanding production default-privilege impact review.

- [Update 2.6.0 — ACL regression passed and merge approval received](2026-11-20-update-2-6-0-current-handover-and-production-acl-audit.md) — follow-up: records owner approval to merge PR #13 after validation, passing PostgreSQL 17 ACL drift regression, the production-shaped identity-sequence test, successful ancillary checks and the separate production rollout boundary.

- [Update 2.6.0 — PR #13 merged to main](2026-11-20-update-2-6-0-current-handover-and-production-acl-audit.md) — follow-up: records owner-approved squash merge, merge commit, passing final CI suite, and the separate unapproved production ACL rollout boundary.

- [Update 2.7.0 — Lessons UI redesign and content pause](2026-11-21-update-2-7-0-lessons-ui-redesign.md) — records the owner-approved temporary pause on further Chinese expansion, shared English/Chinese Lessons redesign, moved activity preferences, accessibility/contrast improvements, preview deployment, regression fixes and current release gates.

- [Update 2.7.0 — Lessons UI redesign and owner feedback round 1](2026-11-21-update-2-7-0-lessons-ui-redesign.md) — follow-up: records expandable lesson content, revised practice answer layout, restored page order, document-level Daily Activities drawer, non-scrolling responsive tabs, redesigned activity allowance UI, and expanded browser verification.

- [Update 2.7.0 — owner feedback round 2: Daily Learning, Chinese pinyin and lesson emphasis](2026-11-22-update-2-7-0-owner-feedback-round-2.md) — records the seven new owner feedback fixes, course-aware and replay-safe Daily Learning behaviour, shared sentence emphasis, the discovered language initialization regression, current validation status and unchanged production boundary.

- [Update 2.7.0 — owner feedback round 3: Daily Learning, allowance timing and Chinese examples](2026-11-22-update-2-7-0-owner-feedback-round-3.md) — records the drawer transition and completed-review fixes, removal of the allowance description, topic-focused white highlights, first-start permanent lesson allowance confirmation/database enforcement, Chinese zero/pinyin and Chinese example name corrections, staging-only migration and current CI/preview boundary.

- [Update 2.7.0 — owner feedback round 4: scoped highlighting and Daily Learning review](2026-11-22-update-2-7-0-owner-feedback-round-4.md) — records the exact root causes for broad highlighting, missing completed Chinese Daily Activity review and the blocked drawer transition; curated content-only topic highlights, language-correct review resolution, hidden-state/motion fixes, bilingual pinyin preservation, full regression results and successful Cloudflare Pages staging deployment.


- [Update 2.7.0 — owner feedback round 5: shared allowance explanation, drawer motion and English Daily Discovery](2026-11-22-update-2-7-0-owner-feedback-round-5.md) — records the shared cross-course allowance clarification, transform-only slide transition, English Discovery exhausted-state fix, regression results, staging deployment and unchanged production boundary.


- [Update 2.7.0 — release-polishing pass and README refresh](2026-11-22-update-2-7-0-release-polishing-pass.md) — records the owner-approved staging state, feature-by-feature audit, README rewrite, feature-branch synchronization with main history, latest cross-version CI and Pages deployment, and the unchanged production/legal boundary.

- [Update 2.7.0 — owner-approved merge to main](2026-11-22-update-2-7-0-merge-to-main.md) — records owner approval, PR #14 merge commit, verified `main` head, automatic Pages deployment still in progress at record time, staging-only Supabase migrations and outstanding legal review.

## 2026-11-23

- [Update 2.8.0 — final planning approval and documentation handover](2026-11-23-update-2-8-0-final-planning-approval.md) — owner-approved Chinese Quiz/Flashcards expansion, distinct recall-mode rules, Practice Insights, Dashboard/Daily History requirements, and explicit no-development-yet status.


- [Update 2.8.0 — development start and repository audit correction](2026-11-23-update-2-8-0-development-start-and-repository-audit.md) — records the owner's separate development-start authorisation, discovery of substantial pre-existing feature-branch implementation, PR #16/94-commit divergence, current CI failures, fixture correction and unchanged staging/production migration boundary.


- [Update 2.8.0 — staging feedback remediation](2026-11-23-update-2-8-0-staging-feedback-remediation.md) — records the Quiz landing/test redesign, Dashboard tab visibility fix, English/Chinese Flashcard mode swap, and in-place review for every Daily History activity type.


- [Update 2.8.0 — second owner feedback remediation](2026-11-23-update-2-8-0-second-owner-feedback-remediation.md) — records the 12-point Quiz, Flashcards and Dashboard feedback round, Chinese answer-leak audit across both prompt languages, start-based Quiz allowance, staging SQL migrations, RLS performance fix, validation status and unchanged production boundary.

## 2026-11-24


- [Update 2.9.0 — development Phase 1 and Phase 2 content expansion](2026-11-24-update-2-9-0-development-phase-1-and-phase-2-content-expansion.md) — records the 810-entry baseline audit, 506 authored English additions, zero duplicate overlap, structural validation, outstanding linguistic QA/runtime integration, legal/privacy checks, feature branch and explicit no-staging-before-Phase-4 boundary.
- [Update 2.9.0 — planning approval and Premium collection-limit decision](2026-11-24-update-2-9-0-planning-approval-and-premium-collection-limits.md) — records the owner-approved English dictionary expansion, full definition/grammar audit, mixed-language Favorite collections, English filters, Chinese translation QA, visual-only Premium preparation, optional English learning-content expansion, approved development sequence, and proposed Free 16/Premium 40 collection-folder capacities with future enforcement and downgrade safeguards.


## 2026-11-25

- [Update 2.9.0 — theme clarification, active collection capacity and Phase 6 start](2026-11-25-update-2-9-0-theme-capacity-phase-6.md) — records the dark/deep-blue UI correction, enforced Free 16/Premium 40 folder caps through a transactional Supabase RPC, preserved folders on downgrade, English collection card sizing, 15 new bilingual Quiz draft questions, staging SQL validation and remaining CI/preview gates.

- [Update 2.9.0 — Phase 4 final feedback and Phase 5 Premium Plan](2026-11-25-update-2-9-0-phase-4-final-feedback-and-phase-5-premium-plan.md) — records the horizontal full-width folder rows, detail-panel-only membership removal, Favorite words surface matching, dedicated Free/Premium comparison page, verified allowance values, 15 passing browser tests, successful staging Pages deployment and remaining live Realtime/regression/legal gates.

- [Update 2.9.0 — Phase 2 content audit and validator hardening](2026-11-25-update-2-9-0-phase-2-content-audit-and-validator-hardening.md) — records the seven-batch 506-entry expansion, baseline-wide structural audit, POS/example/definition corrections, baseline-aware Node validator, successful GitHub Actions and Playwright checks, outstanding semantic/translation QA, and the no-staging-before-Phase-4 boundary.


- [Update 2.9.0 — Phase 2 completion](2026-11-25-update-2-9-0-phase-2-completion.md) — records the completed 506-entry expansion, 766 sense records, 38 POS-semantic corrections, baseline enrichment to 302 entries/657 senses, refreshed audit, successful full CI and Playwright smoke tests, documented linguistic-review limitation, and the no-staging-before-Phase-4 boundary.

- [2026-11-25 Update 2.9.0 Phase 3 category filters and translation QA](2026-11-25-update-2-9-0-phase-3-category-filters-and-translation-qa.md) — records the ten English topic filters, 1,316-entry category coverage, baseline and expansion Simplified Chinese translation inventory, corrected browser-test assumptions, passing CI run 45540254655, legal/privacy check and remaining editorial/responsive QA gates.

- [2026-11-25 — Update 2.9.0 Phase 4 Favorite Collections foundation](2026-11-25-update-2-9-0-phase-4-favorite-collections-foundation.md) — records the Phase 4 kickoff, account-owned collection/membership schema, staging-only RLS migration and schema checks, initial frontend module, mocked browser/SQL regression additions, outstanding adversarial authorization and UI validation, and the no-preview-before-Phase-4-completion boundary.

- [Update 2.9.0 — owner feedback closeout and staging review](2026-11-25-update-2-9-0-owner-feedback-closeout-and-staging-review.md) — records fixed Favorite/Collections grid geometry, persistent accessible folder ordering, reduced-motion-aware disclosure animations, three new bilingual permanent lessons, the 229-question Quiz source with 30 draft-only additions, 25 curated English Flashcard expressions, staging-only migrations, complete passing CI/regression matrix, legal/privacy planning, and the latest successful Cloudflare Pages preview.
