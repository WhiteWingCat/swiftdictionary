
- [U3.0 Phase 2 Malay Dictionary batch 08](2026-11-26-update-3-0-phase-2-dictionary-batch-08.md) — records 204 additional unique headwords, 650 total headwords/672 senses/1,344 en/zh draft translations, duplicate and alias-collision remediation, package revision 0.8.0, and passing final-head architecture (39/39) plus English Dictionary QA.
- [U3.0 Phase 2 Malay Dictionary batch 07](2026-11-26-update-3-0-phase-2-dictionary-batch-07.md) — records 110 additional unique Malaysian Standard Malay headwords, 446 total headwords/468 senses/936 support-translation drafts, package revision 0.7.0 and corrected 39-test architecture/content validation.
- [U3.0 Phase 2 Malay Dictionary batch 06](2026-11-26-update-3-0-phase-2-dictionary-batch-06.md) — records 110 additional unique Malaysian Standard Malay headwords, 336 total headwords/358 senses/716 support-translation drafts, the new 100+ headwords-per-batch direction, and final 39/39 architecture/content test success.
- [U3.0 Phase 2 Malay Dictionary batch 05](2026-11-26-update-3-0-phase-2-dictionary-batch-05.md) — records 49 additional unique Malaysian Standard Malay headwords, 226 total headwords/248 senses/496 support-translation drafts, correction of the `perjalanan`/`jalan` search-alias collision and final 39/39 architecture/content test success.
- [U3.0 Phase 2 Malay Dictionary batch 04](2026-11-26-update-3-0-phase-2-dictionary-batch-04.md) — records 54 additional unique Malaysian Standard Malay headwords, 177 total headwords/199 senses/398 support-translation drafts, CI alias-collision corrections and final 39/39 architecture/content test success; Malay remains inactive and human review is pending.
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

- [2026-11-26 — Update 2.9.0 whole-folder drag feedback and final polish](2026-11-26-update-2-9-0-whole-folder-drag-feedback.md) — Records direct folder-heading dragging, removal of the old controls, Dashboard disclosure/loading refinements, modernized CI workflows, passing browser and local Supabase Auth/RPC checks, latest Pages preview, and the separate outstanding Cloudflare Workers Builds failure.


- [2026-11-26 — Update 2.9.0 merge, Live Supabase migration and Cloudflare Workers Builds retirement](2026-11-26-update-2-9-0-merge-live-supabase-and-retire-workers-builds.md) — records owner-approved PR #18 squash merge, all eight U2.9.0 migrations applied and verified on Live Supabase, preserved production user data, Cloudflare Pages as the sole active build/deployment path, retired Workers Builds classification, advisor findings and final production Pages verification boundary.

- [2026-11-26 — Update 2.9.1 Dashboard Collections Pages-loader fix](2026-11-26-update-2-9-1-dashboard-collections-pages-loader-fix.md) — Records the missing Dashboard "Your Collections" incident, Cloudflare build-time overwrite root cause, explicit script-tag fix, regression guard, PR #19 merge, successful Pages preview and production deployment, and confirmation that no Live Supabase migration was required.
- [2026-11-26 — Multilingual platform development direction and future translation strategy](2026-11-26-multilingual-platform-development-direction.md) — records the owner's decision for independently authored curricula in every language, the shared-platform/language-package architecture, learning/support-language separation, stable IDs and translation registry, content pipeline and three-level QA, and a staged background translation strategy for future support languages such as Japanese and Korean. Update 3.0 scope and implementation remain unapproved.
- [2026-11-26 — Language roadmap and mandatory development workflow rules](2026-11-26-language-roadmap-and-workflow-rules.md) — records the planned U3.0 Malay, U4.0 Japanese and U5.0 Korean expansions, moderate updates between majors, and five standing rules for README accuracy, Live Supabase migration sequencing, verified staging handoffs, website-built prompts/dropdowns and consistent feature UI.
- [2026-11-26 — Update 3.1 Fill-in-the-Blank scope confirmation](2026-11-26-update-3-1-fill-in-the-blank-scope-confirmation.md) — records the owner's confirmation that typing questions belong in U3.1, appear in both Lessons and Quiz, begin with one missing word per question, and must support English, Simplified Chinese and planned Malay through shared UI with language-specific validation. Records open design questions and confirms that implementation has not started.

- [2026-11-26 — Update 3.2 Games page and Wordmine concept](2026-11-26-update-3-2-games-and-wordmine-concept.md) — records the Games navigation rename, retained Flashcards activity, Wordmine rules/difficulties/no-repeat question requirement, shared Games allowance and planning-only legal/technical safeguards.

- [Update 3.0 planning finalisation](2026-11-26-update-3-0-planning-finalisation.md) — records the owner-approved Malaysian Standard Malay standard, English/Chinese legacy modernisation, Phase 3 staging-preview gate, complete post-Phase-3 work and final U3.0 scope.

- [Update 3.0 Phase 0 audit](2026-11-26-update-3-0-phase-0-audit.md) — records the read-only frontend/data, production/staging Supabase, migration-history, security, content provenance and Malaysia privacy/legal audit; Phase 0 complete, Phase 1 next.

- [2026-11-26 — U3.0 Phase 1 foundation checkpoint](2026-11-26-update-3-0-phase-1-foundation.md): initial multilingual registry, content contracts, tests and remaining integration work.

- [2026-11-26 — U3.0 Phase 1 integration checkpoint](2026-11-26-update-3-0-phase-1-integration.md): shared architecture integration, content parity checks, Quiz validation and remaining Phase 1 exit gates.

| 2026-11-26 | [Update 3.0 Phase 1 regression and migration compatibility](2026-11-26-update-3-0-phase-1-regression-and-migration-compatibility.md) | Records read-only production/staging schema and migration drift, current test evidence versus unexecuted full regression, account/history/allowance parity gates, hosting-check interpretation, and the decision to block Phase 2 pending evidence. |
| 2026-11-26 | [Update 3.0 Phase 1 validation complete](2026-11-26-update-3-0-phase-1-validation-complete.md) | Final evidence: 114 passing Node/Playwright tests, local Supabase migration/RPC/security rehearsal, read-only production/staging integrity results and drift inventory; Phase 1 complete and Phase 2 ready but not started. |

- [2026-11-26 — U3.0 Phase 2 Malay Dictionary initial batches](2026-11-26-update-3-0-phase-2-dictionary-initial-batches.md) — records the first 54 Malay headwords/76 senses, per-sense en/zh machine-assisted draft translations, explicit morphology/search adapter, 39 passing architecture/content tests, provenance and legal safeguards, and the inactive/no-database-change Phase 2 boundary.

| 2026-11-26 | [Update 3.0 Phase 2 Malay Dictionary initial batches](2026-11-26-update-3-0-phase-2-dictionary-initial-batches.md) | Initial Phase 2 implementation checkpoint: 54 headwords, 76 senses, 152 draft translations, adapter/package work and 39 passing Node tests; Malay remains inactive and Phase 2 continues. |

- [2026-11-26 — U3.0 Phase 2 Malay Dictionary batch 03](2026-11-26-update-3-0-phase-2-dictionary-batch-03.md) — records the owner-approved ~700-headword target (650–750), batch 03's 69 additions, 123 headwords/145 senses/290 draft translations, 39 passing architecture tests, legacy QA and the continuing inactive/no-database-change boundary.

| 2026-11-26 | [Update 3.0 Phase 2 Malay Dictionary batch 03](2026-11-26-update-3-0-phase-2-dictionary-batch-03.md) | Expands the Malay Dictionary goal to around 700 headwords; batch 03 brings the catalogue to 123 headwords, 145 senses and 290 support translation records, with 39 Node tests and legacy QA passing. |


## 2026-11-26 — Update 3.0 Phase 2 closeout

- [Malay Dictionary closeout validation checkpoint](2026-11-26-update-3-0-phase-2-closeout-validation.md) — 650-headword package, additional provenance/translation-registry tests, CI results and outstanding human editorial/rights review gates.

- [2026-11-27 — Phase 2 Malay editorial review preparation](2026-11-27-update-3-0-phase-2-editorial-review-preparation.md) — 650-row headword review worksheet, review instructions and outstanding human review gates.


- [2026-11-27 — U3.0 Phase 3 initial Malay learning implementation](2026-11-27-update-3-0-phase-3-initial-implementation.md) — records Phase 3 authorisation before human review, initial Malay Lessons/Daily Learning content, 45 passing regression tests and outstanding database/staging gates.

| 2026-11-27 | [Update 3.0 Phase 3 initial Malay learning implementation](2026-11-27-update-3-0-phase-3-initial-implementation.md) | Initial 9-lesson Malay curriculum, 3 Daily Topic, 3 Daily Application and 93-item Daily Discovery rotation; 45/45 U3.0 tests pass; DB/staging migration remains unapproved. |


- [2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 02](2026-11-27-update-3-0-phase-3-malay-lessons-batch-02.md) — expands the draft curriculum to 18 lessons (6 per difficulty) and records 45/45 passing U3.0 structural/content tests.

| 2026-11-27 | [U3.0 Phase 3 Malay Lessons expansion, Batch 02](2026-11-27-update-3-0-phase-3-malay-lessons-batch-02.md) | Adds 9 topics across Beginner, Intermediate and Advanced; total 18 lessons; 45/45 U3.0 tests pass; human review remains scheduled for staging. |


- [2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 03](2026-11-27-update-3-0-phase-3-malay-lessons-batch-03.md) — expands the draft curriculum to 27 lessons (9 per difficulty); 45/45 U3.0 structural/content tests pass.

| 2026-11-27 | [U3.0 Phase 3 Malay Lessons expansion, Batch 03](2026-11-27-update-3-0-phase-3-malay-lessons-batch-03.md) | Adds family, directions, shopping, comparison, complex sentences, paraphrasing and critical reading topics; 27 lessons total; 45/45 tests pass. |

- [2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 04](2026-11-27-update-3-0-phase-3-malay-lessons-batch-04.md) — expands the draft curriculum to 36 lessons (12 per difficulty); automated validation is pending.

| 2026-11-27 | [U3.0 Phase 3 Malay Lessons expansion, Batch 04](2026-11-27-update-3-0-phase-3-malay-lessons-batch-04.md) | Adds weather, transport, appointments, reported speech, modal expressions, relative clauses, register, editing and proposal-writing topics; 36 lessons total; automated validation pending. |

- [2026-11-27 — U3.0 Phase 3 Malay Lessons expansion, Batch 05](2026-11-27-update-3-0-phase-3-malay-lessons-batch-05.md) — expands the draft curriculum to 45 lessons (15 per difficulty); automated validation is pending.

| 2026-11-27 | [U3.0 Phase 3 Malay Lessons expansion, Batch 05](2026-11-27-update-3-0-phase-3-malay-lessons-batch-05.md) | Adds home, school, feelings, conditional sentences, classifiers, cause and effect, data reporting, formal correspondence and inclusive-language topics; 45 lessons total; automated validation pending. |


- [2026-11-27 — U3.0 Malay Quiz full regression and staging migration preparation](2026-11-27-u3-malay-quiz-full-regression-and-staging-migration-preparation.md) — records the 240-question draft bank, secure server-side runtime migration review, full green cross-version regression matrix, read-only hosted staging preflight and the explicit no-apply/no-production boundary.

- [2026-11-27 — U3.0 Malay Quiz staging release and preview](2026-11-27-u3-malay-quiz-staging-release-and-preview.md) — records owner-authorized staging-only release of 240 approved questions, both applied Supabase migrations, authenticated transaction-rolled-back smoke tests, preview deployment, current CI status and production isolation.

- [2026-11-27 — U3.0 Malay feedback fixes and Flashcards staging](2026-11-27-u3-malay-feedback-and-flashcards-staging.md) — records the structured-question renderer fix, Malay Daily Discovery catalogue reconciliation, 650-entry Malay Flashcards foundation, 73 English and 124 Chinese Malay support glosses, lesson translation coverage and remaining Quiz target-language gaps.

- [2026-11-27 — U3.0 continuation and latest CI recovery point](2026-11-27-u3-continuation-latest-ci-recovery.md) — records the outdated U2.7 test assertion diagnosis and test-only correction, latest workflow evidence/reruns, remaining Malay translation gaps, staging/production boundaries and exact next actions.
