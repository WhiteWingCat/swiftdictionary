# SwiftDictionary — Master Development Record

> Durable project handover and source-of-truth summary for future development conversations.
>
> **Repository:** https://github.com/WhiteWingCat/swiftdictionary  
> **Last consolidated:** 2026-11-26 (U2.9.0 merged and Live Supabase migrated; U2.9.1 emergency patch merged and deployed successfully to Cloudflare Pages production; Workers Builds retired.)
**Current baseline:** Update 2.9.1 — Dashboard "Your Collections" Cloudflare Pages loading fix — merged to `main` at `4ab30af1c9c1ef7eb2fe35cdf015755a5e87e16d`. Cloudflare Pages production deployment succeeded. Live Supabase remains on the verified U2.9.0 schema; U2.9.1 requires no database migration.  
**Current work:** U2.9.1 remains deployed. U3.0 Phase 0 and Phase 1 validation are complete. Phase 2 Malay Dictionary authoring is in progress toward approximately 700 headwords (target band 650–750); current count is 650 unique headwords and 672 senses after batch 08; 1,344 English/Simplified Chinese support translation records remain machine-assisted drafts. The owner requires 100+ new unique headwords per future batch (aim 100–120 when quality permits). Application work remains on `feature/update-3.0-phase-0-audit`; documentation remains on `docs/master-development-record`. The Collections module is explicitly loaded from `index.html` after the main application scripts, rather than relying on generated `supabase-config.js` that Cloudflare Pages overwrites at build time. Cloudflare Pages is the only active build/deployment platform; Workers Builds is retired.  
**Record status:** U2.9.0 and U2.9.1 implementation, merge and production Pages deployment are complete. U3.0 Phase 1 validation is complete and Phase 2 Malay Dictionary authoring is in progress. Dictionary word-grid search remains free and unlimited; Premium remains presentation-only. The 30 additional Quiz questions remain draft-only, with 199 approved questions.

## 1. Project identity and goals

SwiftDictionary is a personal vocabulary-learning project intended to be freely accessible to a global audience, with an intended age group of 16+. It currently supports English and Simplified Chinese dictionary and learning content.

- Repository: WhiteWingCat/swiftdictionary.
- Hosting: Cloudflare Pages (GitHub integration; `main` is the production branch and non-production branches generate previews).
- Application: Static, GitHub Pages-compatible web application; main application file is index.html.
- Backend: Supabase for authentication, account data, saved-word synchronisation and learning-related data.
- Authentication: Google sign-in through Supabase.
- Intended operating model: Personal project. Future revenue model remains undecided. A possible Premium plan is being explored, not treated as an established business commitment.
- Core principle: Dictionary word-grid search remains free and unlimited. Never put dictionary search behind a subscription.
- Tracking preference: Minimise personal data collection. Avoid raw practice answers and unnecessary word-level activity.

Prefer workflows that respect free-plan/service constraints and avoid unnecessary paid services.

## 2. Standing development rules

1. **Legal and privacy review is mandatory for planned expansions.** For every new feature or expansion, include a Malaysia-specific and general legal-risk check. Consider Malaysia's Personal Data Protection Act (PDPA) where applicable, international users, age-related obligations, cross-border processing, content licensing and consumer/payment rules as relevant. This is a planning safeguard, not legal advice or a compliance certification.
2. **Protect existing functionality.** Do not regress Supabase Google sign-in, sign-out, account switching, account-isolated saved words, cross-device synchronisation, language preferences, dictionary search or stroke-order functionality.
3. **Dictionary search remains free and unlimited.** Subscription allowances must not restrict dictionary word-grid lookup.
4. **Small, sequential analysis.** If a task requires heavy data analysis, divide it into manageable sequential steps and validate each step.
5. **One consolidated deliverable per phase.** Do not provide intermediate downloadable ZIPs after each small batch. Accumulate changes, complete the phase, validate the consolidated result, then provide one final package when requested.
6. **Respect free-plan constraints.** Prefer safe, low-cost or free workflows. Do not assume paid Supabase branching or paid infrastructure is available.
7. **No production deployment or destructive database action without explicit owner approval.** Review migrations and live schema first. Never expose Supabase service-role credentials or OAuth client secrets in browser code or repository files.
8. **Verify before claiming completion.** Separate static checks, automated tests, mocked browser tests, real browser tests, live Supabase validation and production deployment. Passing one does not imply the others passed.
9. **Release naming:** After existing v19, release ZIP names use “SwiftDictionary Update X.Y.Z”: X = major feature, Y = additions, Z = emergency quick patch. Existing v19 naming remains unchanged.
10. **Development-session records and branch separation are mandatory.** For every meaningful SwiftDictionary conversation or development session, update the Master Development Record and create a dated, structured Markdown archive in `docs/conversation-archive/` on `docs/master-development-record`; update the archive index there as well. Record owner decisions, scope, implementation/files, branch/commit/PR references, test evidence (including failures and corrections), outstanding risks and the exact recovery point. Archive only SwiftDictionary-relevant user-visible material; never include hidden reasoning, credentials, secrets or unrelated personal information. Treat repository content as potentially public. The `main` branch is the production website/source branch and must not receive the Master Development Record, conversation archives or internal planning notes. Documentation-only commits stay on `docs/master-development-record`; never open or merge a documentation PR into `main`. Application changes use one focused temporary feature branch per active task, created from current `main`; merge only after validation and explicit owner approval, then delete the merged feature branch when safe. Close obsolete draft PRs and remove stale branches only after confirming they contain no unmerged work.
11. **Course/translation selection refresh and translation QA are mandatory.** Whenever a user changes the learning-course language or translation language, verify that the relevant page and all dependent content refresh to reflect the new selection without requiring unrelated navigation or leaving stale text, labels, explanations, feedback or cached content visible. Test both selection controls and their interactions, including switching back and forth and changing selections from relevant learning pages. Verify that translations are complete, accurate, context-appropriate and consistent with the selected language pair; do not treat a changed language label or a partial string swap as proof. Include these checks in feature-specific regression testing for Lessons, Quiz, Flashcards and any future course/translation-aware feature.

## 3. Product and interface baseline

### Main navigation and pages

Five main pages: Dictionary, Lessons, Quiz, Flashcards and Profile. Dictionary is the default landing page. Direct hash routes include #dictionary, #lessons, #quiz, #flashcards and #profile.

### Dictionary

- English search matches words, not definitions or Chinese translations.
- Chinese search supports characters and pinyin, including pinyin without tone marks.
- Chinese word-grid cards display one character per square; multi-character terms belong in related-word/detail content.
- Pinyin appears beneath Chinese characters, not beside them.
- Detail panel supports translation-language switching.
- English details should not show Chinese pinyin, Chinese character-structure lessons or Chinese related-word sections.
- English definitions should cover common contextual meanings, with multiple senses where appropriate.
- Everyday-conversation example sentences were removed by owner preference.
- Dictionary search remains free and unlimited.

### Chinese learning and stroke order

- Chinese character structure and interactive stroke-order lessons are retained.
- Runtime stroke animation supports pause/resume, replay, previous/next stroke controls and progress display.
- Stroke-order interaction and checker were previously tested successfully.
- Review Hanzi Writer and stroke-data licensing before changing distribution or using content commercially. Consult the repository's third-party notices and Arphic licence materials.

### Account menu, Profile and preferences

- Top-right account menu provides relevant Sign in, Profile, Preferences, Switch account and Sign out actions.
- Account switching must remain available on shared devices.
- Signed-in Profile includes learning progress overview and expandable details.
- Preferences are managed in Profile.
- Signed-out users who select or directly open Profile are redirected to Dictionary.
- Learning course and translation language selections persist locally and, when signed in, synchronise to that account's preferences.
- Avatar selection is a preference, not identity verification.
- Account data and saved words must remain isolated between accounts.

## 4. Authentication, data and hosting safeguards

- Supabase Google authentication is enabled.
- Saved words synchronise through Supabase and are isolated by authenticated account.
- Signing out clears the active account's saved words from the interface; signing into another account loads that account's own words.
- Row Level Security must remain enabled and owner-scoped on user-owned tables.
- Only a Supabase publishable/anon key belongs in public browser configuration. Never expose a service-role key or Google OAuth client secret.
- Keep project-specific supabase-config.js and banner.svg intact when preparing website updates unless a separately reviewed change requires otherwise.
- GitHub Pages deployment is a separate action. A branch merge or archive creation is not a deployment unless deployment was performed and verified.
- Shared-device users must be able to switch accounts and sign out.

### Update 2.1.0 data foundation

The 2.1.0 foundation introduced tables for languages, profiles, preferences, entitlements, plan limits and learning activity. Existing saved_words data and policies were intended to remain unchanged. The quota enforcement foundation used database-side checks, user/category concurrency protection, validated IANA timezones and protection against client timestamp backdating.

Consult the repository README and Supabase migration history before re-applying any migration. Do not infer migration state from a local file alone.

## 5. Release history and confirmed decisions

### v19 and Update 1.1.0

- v19 consolidated Chinese linguistic review and interactive stroke-order lessons.
- At that stage the content baseline was recorded as 692 English entries and 106 Chinese entries.
- Update 1.1.0 expanded common English vocabulary by 100 entries and Chinese characters by 100, with expanded senses/examples and pinyin coverage.
- Later content QA prioritised common everyday English (for example greetings and gestures, places and school subjects) over excessive technical/scientific/historical vocabulary.
- Chinese content expansion and accuracy checks were part of the earlier content work.

### Update 2.1.0 — Profile and learning foundation

Introduced the five-page structure, signed-in Profile, preferences, progress overview, learning allowances and Coming Soon placeholders for unreleased learning experiences. Daily reset is based on each user's configured timezone, at local midnight.

### Update 2.2.0 — English Lessons Foundation

**Status: merged to main according to the November 10 development handover; the current main README also documents the 2.2.0 feature set.**

Recorded merge commit prefix: dd26e746.

Confirmed decisions and implementation:
- Beginner, Intermediate and Advanced difficulty levels.
- Permanent course library with independent progress for each difficulty.
- Grammar and combined-vocabulary lessons.
- Guided lesson reader and interactive practice.
- Selected translation language is used in lessons.
- Difficulty progress is remembered.
- Daily Learning structure decision for the 2.2 design was “all”.
- Daily Revision behaviour in the 2.2 design was “weak”.
- No timer or time pressure; a typical lesson may take around 5–10 minutes.
- Learners can choose their difficulty.
- Lesson completion is automatic only after practice is successfully completed and the completion update is saved.
- Answer options are shuffled while correct-answer mapping remains valid.
- Translation switching during practice should preserve current answers/progress.
- Starting a new lesson consumes an allowance; resuming an unfinished lesson and revisiting a completed lesson are free.
- Current catalogue recorded in README: 15 lessons (five per difficulty) and 52 original practice questions, with Simplified Chinese lesson content and practice prompts/options.
- Owner tested all lessons and reported Chinese translation switching, shuffled answers, completion saving and progress tracking behaving as intended.
- Quiz and Flashcards remained Coming Soon after 2.2.0.

### Update 2.3.0 — Daily Learning Expansion

**Status: COMPLETED as a development milestone and merged into main on 2026-11-13.** The owner subsequently tested the live website and reported follow-up issues now tracked under Update 2.3.1. See Section 13 for authoritative merge and follow-up details.

Owner-confirmed product decisions:
- Daily activities: **all four** categories are enabled for new accounts.
- Daily Revision: **adaptive**.
- Daily Discovery: **mixed**.
- Daily Learning includes Daily Topic, Daily Application, Daily Discovery and Daily Revision.
- New accounts must always have all four Daily Learning activities enabled. This was explicitly added to planning.
- Daily activities and preferences should synchronise with the account.
- Daily Revision prioritises weak topics using learning evidence, recognises improvement and adapts content.
- Daily Discovery uses mixed content.
- Daily Topic and Daily Application provide daily refreshed activities; Daily Revision helps avoid dependence on a finite permanent lesson library.
- Profile progress statistics should be expanded.

#### Latest approved allowance values

| Activity | Free | Premium (proposed) |
|---|---:|---:|
| Permanent lesson completions | 5 per local day | 15 per local day |
| Daily Topic completions | 1 per local day | 3 per local day |
| Daily Application completions | 1 per local day | 3 per local day |
| Daily Discovery completions | 1 per local day | 3 per local day |
| Daily Revision completions | 1 per local day | 3 per local day |
| Dictionary search | Unlimited | Unlimited |

- Only successful completion consumes an allowance.
- Starting, resuming or abandoning an activity is free.
- Daily reset follows the user's configured local timezone.
- A personal testing exemption exists in private database configuration and is lesson-only. Do not put its account identifier or private allowlist data in source control.
- Premium is a proposed entitlement tier; no payment/checkout flow should be assumed to exist.

#### Update 2.3.0 implementation and validation recorded in the November 10 handover

- Daily content expansion committed on the draft branch: Topic content 5 → 28; Application 5 → 25 sets; Discovery 6 → 27.
- Adaptive Revision covers 13 existing lesson topic identifiers and rotates through unused Application sets.
- Allowance timezone changes are deferred until the prior allowance day ends, preventing repeated timezone changes from moving the reset boundary.
- A private current-window allowance ledger backfills current-day completion counts and becomes the quota authority independently of deletable learning history.
- Learning-history deletion design uses a private SECURITY DEFINER implementation behind a SECURITY INVOKER public RPC wrapper. It derives the target user from auth.uid(), validates the JWT session against a recent existing non-expired auth.sessions row, serialises with completion operations and deletes only learning-history tables.
- Profile deletion UI requires explicit confirmation and explains that account data, saved words, preferences and current-day allowance usage remain.
- Aggregate first-attempt practice summaries are stored without raw answers.
- Privacy/deletion design and an English privacy-policy draft were prepared for review; the policy is not approved for publication.
- Latest reported CI run on commit 19967ad3c0df82866933c92359dcd5d516496068 passed PostgreSQL 17 and disposable local Supabase checks.
- A later reported GitHub Actions run 42954964345 passed Chromium, PostgreSQL 17 and disposable local Supabase Auth/migration/history-deletion checks.
- Six Playwright/Chromium tests passed against the local static app with a deterministic mocked Supabase client: dictionary search, lesson library/difficulty navigation, signed-out Daily Learning access, signed-out Profile redirect, Google OAuth request options/account-selection prompt, and account-switch state isolation.
- Mocked OAuth tests do not prove real Google OAuth callback handling. Real Google OAuth and cross-device saved-word synchronisation remain manual regression checks.

#### Current GitHub work observed during record creation

Repository branches observed:
- main
- feature/update-2-2-0-lessons
- feature/update-2-3-0-planning
- feature/update-2-3-0-allowance-foundation

Open pull requests observed:
- PR #2: **SwiftDictionary Update 2.3.0 — Daily Learning Expansion (Planning)**. It records the technical design, allowance rules, privacy-minimised practice tracking, schema findings, security and implementation order.
- PR #3: **SwiftDictionary Update 2.3.0 — Completion-Based Allowance Foundation (Draft)**. It targets feature/update-2-3-0-planning, not main. Its description records the completion-based allowance foundation, Daily Learning frontend, privacy/deletion work and validation.

Historical note: the PR state above describes the repository at the time of the earlier record consolidation. PR #3 was later retargeted to main and merged with explicit owner approval on 2026-11-13. See Section 13.

#### Historical 2.3.0 release gates — closed / superseded

The checklist below is retained only as historical planning context. **It is not an active 2.3.0 release gate. Update 2.3.0 was completed, and its later database rollout and follow-up work were delivered through Updates 2.3.1, 2.3.2 and 2.3.3.** The completion and production rollout evidence is recorded in Sections 13, 17 and 27 and the dated archives.

- Adaptive Daily Revision, Daily Learning browser regressions, account isolation, translation switching, timezone handling, history deletion and allowance preservation were implemented and covered by the later 2.3.x validation work.
- The ordered production database rollout was separately authorised, applied and verified as Update 2.3.3. Do not interpret the old “do not apply” planning warning as a current blocker; the normal rule against unapproved production database changes still applies.
- Account deletion remained distinct from learning-history deletion and was not silently included in 2.3.0.
- The privacy-notice, cross-border processing, age-appropriate safeguards and broader Malaysia/international legal review remain **separate public/friend-onboarding safeguards**, not unfinished 2.3.0 implementation gates.
- The Chinese learning curriculum question was resolved for the delivered scope: the learning course is English with Simplified Chinese translations; a separate Chinese learning curriculum is not part of the released 2.3.x scope.
- Google OAuth, account switching and cross-device saved-word synchronisation were tested in the established release/regression process. Continue to include them in relevant regression testing.



### Future roadmap

- **Update 2.4.0 — Quiz:** **COMPLETED and released.** PR #8 merged; the 199-question bank and Quiz experience are live. See Sections 34–41 and the 2026-11-17 production-release archive.
- **Update 2.4.1 — Fix & Changes:** **COMPLETED and released.** PR #10 merged; fixes and selector/translation improvements are live. See Section 42.
- **Update 2.4.2 — Dashboard Quiz fixes:** **COMPLETED, deployed and owner-verified.** PR #11 merged at `65d0a35`; Pages deployment #44230831943 succeeded, and the owner confirmed both fixes on the live site. See Sections 43–44 and the 2026-11-18 archive.
- **Update 2.5.0 — Flashcards:** **COMPLETED, merged and deployed on 2026-11-19.** PR #12 merged at `7a5fcdae44e4ccfa8490f812f5bfad73f426e01f`; all eight production Supabase migrations were applied and verified; Cloudflare Pages production deployment succeeded. See the 2026-11-19 release archive.
- **Update 2.6.0 — Account, Privacy, Safety & Security:** **IMPLEMENTATION COMPLETED on main** through U2.6.0/U2.6.1. Account-deletion and learning-history controls, auth/UI safeguards and ACL hardening are delivered. Formal Malaysia PDPA and general international legal/privacy review remain outstanding; do not describe the project as legally cleared.
- **Update 2.7.0 — Chinese Dictionary & Lessons Expansion:** **COMPLETED and live.** Owner-approved merge and production rollout are recorded in the dated release archives.
- **Update 2.8.0 — Chinese Course Quiz & Flashcards:** **COMPLETED and deployed live on 2026-11-24**, owner-confirmed. Final Chinese Quiz and Flashcard content QA is recorded in the 2026-11-24 archive.
- **Update 2.9.0 — English Dictionary Expansion & Dashboard Collections:** **IMPLEMENTATION IN PROGRESS as of 2026-11-25.** Phase 1 is complete. Phase 2 has 506 authored additions across seven source batches, with zero normalised duplicate overlaps against the 810-entry baseline. The expansion is integrated into the runtime dataset; baseline-aware Node validation and all three Playwright browser smoke tests pass. The baseline has 810 unique entries, 270 entries with explicit senses (593 sense records), and zero missing declared-POS mappings across its 176 multi-POS entries. Full semantic/native-quality review and manual sense-level Chinese translation QA remain outstanding. Current feature branch: `feature/update-2-9-0-english-dictionary-collections`. The owner requires the first staging preview to wait until Phase 4 is fully implemented and internally validated. Approved scope and sequence: [Update 2.9.0 Development Plan](UPDATE-2.9.0-DEVELOPMENT-PLAN.md).
- **Update 3.0.0 — Introduction to Malay course:** planned major milestone after 2.9.0.

Update 2.9.0 is the next planned development milestone. Its plan approval does not itself authorise implementation, staging changes, Supabase migrations, production changes or Premium activation. Update 3.0.0 remains planned after 2.9.0.

## 6. Privacy, legal and content licensing checklist

For each new feature and before public launch or monetisation, revisit:
- Malaysia PDPA applicability and obligations, including notice/consent, purpose limitation, security, retention, access/correction, processors and cross-border transfers where relevant.
- International privacy and child/teen requirements for a global audience aged 16+; do not assume one age threshold satisfies every jurisdiction.
- Whether collected data is necessary for the learning purpose. Prefer aggregate performance signals over raw answers or detailed behavioural logs.
- Clear user-facing explanation of allowances, reset timezone and Premium entitlements.
- Account-data and learning-history deletion semantics. Do not confuse deleting learning history with deleting an account.
- Third-party content, dictionary data, translation and stroke-data licences, attribution and restrictions on commercial use.
- Payment, subscription, tax, refund and consumer-protection obligations if Premium is introduced.
- Privacy notices should not be published as final until controller, provider, contact, retention and transfer details are verified.

## 7. Current known repository and deployment facts

- The default `main` branch README still describes **SwiftDictionary Update 2.2.0 — English Lessons Foundation** because U2.7.0 has not been merged. The U2.7.0 feature branch now contains a complete Update 2.7.0 release-candidate README describing added, changed, fixed and removed behaviour, current features, allowances, migrations, build/deployment safeguards, licensing, privacy notes and release history.
- README states that supabase-config.js and banner.svg are external project files and must be retained when preparing the Pages deployment.
- README instructs that deployment must wait for owner review and explicit approval.
- The 2.3.0 implementation was later merged into main; the owner has since reported live-site testing and identified follow-up improvements for Update 2.3.1.
- The live website and live Supabase schema were not inspected as part of creating this record. Re-check them before release actions.

## 8. How to resume work in a new ChatGPT conversation

Use this opening instruction:

> Continue SwiftDictionary development. First read the repository's docs/MASTER-DEVELOPMENT-RECORD.md and inspect the current GitHub branches, open pull requests and relevant source files. Treat the record as a handover, not proof that the current repository or production system has not changed. Confirm the current branch/PR and deployment status before editing. Preserve all standing rules and existing working features. Do not merge, deploy or apply production Supabase migrations without my explicit approval.

For detailed historical reasoning, refer to the original ChatGPT conversations by title when available:
- **Continue SwiftDictionary Development** — 2.3.0 implementation, technical validation, branches and PR handover (November 10, 2026).
- **Continue SwiftDictionary Lessons** — 2.2.0 lesson design, testing and readiness.
- **SwiftDictionary Learning Structure** — 2.1.0 architecture and implementation decisions.
- **Website Creation Guide** — earlier project setup, repository and hosting context.

A conversation title is a useful locator, but does not guarantee access to every historical message. If a decision is not present in this record or retrievable from the referenced conversation, verify it from repository history or ask the owner rather than guessing.

## 9. Record maintenance protocol

Update this file at meaningful milestones:
- When a feature's design is confirmed.
- When implementation is completed and tested.
- When a PR is opened, retargeted, merged or closed.
- When migrations are applied to a specific environment.
- When a release is approved and deployed.
- When a bug is found, fixed and regression-tested.

Every update must distinguish:
- Planned
- Implemented on a branch
- Automated tests passed
- Manual browser tests passed
- Production database migrated
- Merged
- Deployed

Do not collapse these into a single “completed” status. Keep dates, commit hashes, PR numbers and test-run links where available. Never include secrets, service-role keys, private account identifiers or personal allowlist values.


## 10. Audit and privacy-first decision addendum — 13 November 2026

### Owner decision

The owner selected **privacy-first practice-result integrity** for Update 2.3.0:
- Keep aggregate correct/question counts only; do not persist individual answers, answer selections or per-question event logs.
- Validate content IDs, topics, difficulty, learning language and activity source against an approved server-side catalogue.
- Treat accuracy as self-reported practice performance, not tamper-proof proof of mastery.
- Use these signals for personal progress and adaptive revision only; not for certification, billing or other high-stakes decisions.

See `docs/UPDATE-2.3.0-PRIVACY-FIRST-CATALOGUE-DECISION.md`.

### Implementation and validation

- Fixed a race between `record_completed_lesson_practice_result()` and learning-history deletion by taking the same per-user transaction advisory lock.
- Added `tests/update-2-3-0/test-history-replay-deletion-concurrency.sh`.
- Added `docs/UPDATE-2.3.0-CONTENT-CATALOG-MIGRATION-DRAFT.sql`, a private catalogue of 95 English IDs: 28 Daily Topics, 25 Daily Applications, 27 Daily Discoveries and 15 permanent lessons. It contains IDs and topic/difficulty/language metadata only, no question or answer content.
- Daily session start and permanent lesson completion/replay RPCs validate catalogue mappings. Lesson progress insertion is guarded against unknown lesson IDs.
- Added a frontend-to-SQL catalogue consistency checker, SQL security/mapping assertions and signed-in Daily Topic/Daily Application browser tests.
- GitHub Actions run [#346](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43382607103) passed all 3 jobs on the implementation branch: PostgreSQL 17 migrations/assertions/concurrency, disposable local Supabase Auth compatibility, and Chromium browser tests (8/8).
- Browser tests use a mocked Supabase client. They do not prove real Google OAuth callbacks, hosted account switching or cross-device sync.
- PR #3 remains **open and draft**, with base `feature/update-2-3-0-planning` and head `feature/update-2-3-0-allowance-foundation`. No merge, rebase, deployment or production migration was performed.

### Read-only production Supabase review

- Project is active and its primary database region is Tokyo, Japan.
- The production schema does not yet contain the Update 2.3.0 Daily Learning session table or the new private content catalogue. The 2.3.0 migration drafts remain unapplied.
- Existing application tables reviewed have RLS enabled and user-scoped policies. A full penetration test and independent Data API exposed-schema review remain outstanding.
- Production `lesson_practice_results` currently allows authenticated users to insert their own rows under an owner-scoped policy. This permits self-reported aggregate results to be fabricated by that user; it does not expose another user's rows. The 2.3.0 draft narrows direct writes through an RPC and validates lesson/topic identity, but deliberately does not claim to verify each answer.
- The security advisor flags `public.is_personal_learning_test_access()` as an authenticated-callable SECURITY DEFINER function. It returns only whether the caller's own UID has the personal test exemption; anonymous execution is denied. Review whether it should remain a public RPC or be moved to the private schema during a future hardening pass.
- The private learning-limit exemption table has RLS enabled and no client policies; this is intentional.
- The advisor also reports leaked-password protection disabled. The app's current sign-in flow uses Google OAuth; verify whether password-based sign-in is enabled or intended before changing this setting.
- No production settings, schema or data were modified.

### Legal and privacy planning

- Added `docs/SWIFTDICTIONARY-LEGAL-PRIVACY-REVIEW-2026-11.md`.
- The Malaysia PDPA scope is fact-specific: Act 709 regulates personal data in commercial transactions, and the statutory definition includes matters relating to the supply or exchange of goods/services. A free service is not automatically exempt. Obtain Malaysian legal advice on the project's actual status and activity.
- Screen the DPO criterion for regular/systematic monitoring because adaptive revision uses accumulated learner performance. Also complete DPIA screening, bilingual privacy notice, retention, rights/export/deletion procedures, processor inventory and cross-border transfer assessment.
- Because the intended audience is global, decide whether EU residents are intentionally included and complete GDPR applicability screening. The 16+ product threshold is not a blanket exemption from child-data obligations.
- This review is planning guidance, not legal advice. No final privacy notice has been approved.

### Remaining gates

1. Complete authenticated real-provider testing, especially Google OAuth callback, account switching and cross-device saved-word sync.
2. Complete the remaining read-only Supabase configuration/exposure review and decide how to address the exposed self-status SECURITY DEFINER RPC and unnecessary anonymous table grants.
3. Obtain legal review of PDPA scope, DPO/systematic-monitoring status, GDPR targeting, cross-border transfer basis and any registration class.
4. Finalise the bilingual privacy notice, retention schedule, deletion/export request handling and incident-response procedure.
5. Complete Update 2.3.0 release-candidate review and owner manual testing.

All production safeguards remain in force: no merge, deployment or production Supabase migration without explicit owner approval.


## 11. Saved-word least-privilege review — 13 November 2026

A further read-only production review found that `public.saved_words` and its identity sequence grant `anon` and `authenticated` more privileges than the browser uses. The table is protected by owner-scoped RLS, but anonymous table privileges (including TRUNCATE) and authenticated UPDATE/TRUNCATE/REFERENCES/TRIGGER plus excess sequence privileges are unnecessary.

A draft-only hardening migration now:
- Revokes all PUBLIC, anon and authenticated grants on the saved-word table and identity sequence.
- Grants authenticated users only table SELECT, INSERT and DELETE.
- Grants authenticated users sequence USAGE only.
- Preserves existing owner-scoped RLS policies.

The app was checked and uses only SELECT, INSERT/upsert with ignore-duplicates, and DELETE for saved words. No production grant was changed.

Validation: GitHub Actions run [#354](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43383331625) passed all 3 jobs, including the new saved-word table/sequence privilege assertions, catalogue-to-frontend consistency (95 entries), PostgreSQL 17 migration and concurrency tests, disposable local Supabase compatibility, and Chromium browser tests (8/8).

The 13 November legal review was refined to clarify the PDPA personal/household exemption and breach-notification thresholds. Those changes were documentation-only. The implementation remains draft on PR #3; PR #3 and PR #4 remain unmerged. No production Supabase changes, merge or deployment have occurred.


## 12. Staging and privacy-notice follow-up — 13 November 2026

- Added `docs/UPDATE-2.3.0-STAGING-MANUAL-VALIDATION-CHECKLIST.md` for real Google OAuth, account switching, cross-device saved-word sync, Daily Learning, aggregate-only data, timezone, deletion, RLS and privacy checks.
- The connected Supabase workspace currently exposes only the production SwiftDictionary project; no separate staging project was available. Real hosted OAuth and cross-device validation are therefore blocked pending a separate staging project. Production will not be used for Update 2.3.0 migration testing.
- Updated `PRIVACY-POLICY-DRAFT.md` to list GitHub Pages/GitHub and jsDelivr in addition to Google and Supabase. The app loads Supabase JS and Hanzi Writer from jsDelivr and requests per-character stroke-order JSON; the character appears in the CDN asset path. This is not an account identifier, but it is a third-party request and should be disclosed and considered for self-hosting.
- The privacy notice remains English-only draft with placeholders for controller identity, monitored contact, address, exact provider locations, subprocessors and retention. Prepare a Bahasa Malaysia version before publication if PDPA applies.
- Current validation baseline remains GitHub Actions run #354 (3/3 jobs, browser 8/8); subsequent changes in this section are documentation only.
- No staging project was created, no production data/settings were changed, and no merge or deployment was performed.

## 13. Update 2.3.0 completion and Update 2.3.1 handover — 13 November 2026

### Update 2.3.0 — completion record

- **Status:** Completed as a development milestone; merged to main on 2026-11-13.
- **Pull request:** [#3 — SwiftDictionary Update 2.3.0 — Completion-Based Allowance Foundation](https://github.com/WhiteWingCat/swiftdictionary/pull/3).
- **Merge commit:** 090f5f47ef7e596d987b8ab2f5a1eb996c8f22e6 (squash merge).
- **Main branch head confirmed:** 090f5f47ef7e596d987b8ab2f5a1eb996c8f22e6.
- **Automated validation before merge:** GitHub Actions runs [#398](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43386713881) and [#399](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43386720980) passed. They covered PostgreSQL 17 allowance/migration/concurrency checks, disposable local Supabase Auth/migration/deletion checks, Chromium browser regression tests and the local Supabase security advisor check.
- **Owner live testing:** the owner reports testing the live website after merge and identified follow-up issues now tracked under Update 2.3.1. These are post-merge findings, not evidence that the 2.3.0 merge failed.
- **Deployment:** a GitHub Pages workflow was observed starting after the merge. The owner subsequently confirmed live-site testing. Do not infer that every hosted integration check passed without checking current Actions status.
- **Production database:** no production Supabase migration or production data modification was performed as part of the merge. A read-only audit on 2026-11-13 later confirmed that the live project migration history still ends at the 2.2.0 reconciliation baseline (20261110041007).
- **Production schema finding:** the live project has no `public.daily_activity_sessions`, no `private.learning_allowance_usage`, no `event_type` column on `public.learning_activity_log`, no daily-activity preference fields, and none of the Daily Activity / allowance-ledger RPCs. Its `learning_plan_limits` table still contains only lesson, quiz and flashcard categories. A read-only function lookup returned no Daily Activity or allowance usage RPCs. This confirms that the merged 2.3.0 frontend and production database are currently out of sync.
- **Separate release gates:** hosted Google OAuth callback and cross-device sync verification, privacy-notice/legal finalisation, and real-account staging checks remain separate from the completed source-control milestone.

### Update 2.3.1 — Bug Fix & Changes

**Status:** New development branch created; implementation and validation in progress. No merge or deployment is authorised by this record.

- **Release label:** SwiftDictionary Update 2.3.1 — Bug Fix & Changes.
- **Branch:** feature/update-2-3-1-bug-fix-and-changes.
- **Base:** main at merge commit 090f5f47ef7e596d987b8ab2f5a1eb996c8f22e6.
- The requested display name contains spaces and an ampersand, which Git branch refs do not permit; the branch uses a valid slug while retaining the requested release label.

#### Owner-requested scope

1. **Integrate Daily Learning into Lessons.** Remove the separate top-level Daily Learning navigation destination. Show the daily activity section within Lessons, above Beginner / Intermediate / Advanced difficulty navigation. Audit and correct activity flows, content rotation, allowance display, start/resume/replay, completion, abandonment, adaptive revision and language compatibility. Daily activities must behave as part of Lessons, not as a detached page.
2. **Rename Profile to Dashboard.** Change user-facing labels and headings to Dashboard / Your Dashboard. Keep signed-in-only access and account isolation.
3. **Separate Preferences.** Move Account Preferences and Privacy and Data controls into a dedicated Preferences destination. The account-menu Preferences action must open that destination directly. It must not route to Dashboard or depend on scrolling inside Dashboard. Preserve display name, avatar, learning language, translation language and timezone settings; preserve learning-history deletion semantics.
4. **Visualise allowances on Dashboard.** Replace the plain text daily allowance summary with visual progress indicators consistent with the allowance presentation on Lessons. Show usage/remaining amounts per activity and plan, respecting local timezone and the server-side allowance source.
5. **Favorite words on Dashboard.** Add a Favorite words panel with expandable English and Chinese rows. Each row expands to show the signed-in user's saved words in the same card/grid presentation and course-specific ordering/format as the Dictionary. Reuse existing saved-word records; do not duplicate or weaken the saved-word data model. Keep content scoped to the authenticated user and ensure account switching/sign-out clears the view.
6. **Dashboard avatar and heading.** Place the selected large profile icon to the left of Your Dashboard, using the existing account profile avatar selection.
7. **Practice insights visualisation.** Improve visual prominence with a chart (bar or pie where semantically appropriate) based only on existing aggregate correct/question counts. Clearly identify specific topic(s) needing review and explain why they are recommended. Avoid inventing data or treating self-reported aggregate scores as verified mastery.

#### Technical and UX acceptance criteria

- Daily activities appear inside Lessons above difficulty tabs, with a clear way to switch between daily activity cards and the permanent lesson library without navigating away from Lessons.
- Daily activity preferences remain account-specific, persist through Supabase, and are editable in the integrated Lessons section.
- All enabled activities remain visible; disabled activities remain hidden; no enabled activities produces an understandable empty state.
- A successful completion consumes exactly one applicable allowance; starting, resuming or abandoning does not. Replays of completed content do not consume a second daily allowance. When today's allowance is exhausted, the UI must explain this and must not offer a misleading new-start action.
- Daily Topic / Discovery completion and scored Application / Revision completion are correctly distinguished. Aggregate practice results remain the only stored performance detail; no raw answer selections are persisted.
- Daily Revision uses actual available learning evidence and a defensible minimum-evidence threshold, avoids repeatedly serving the same topic on the same local day, and visibly explains the recommended topic/reason. New users with no practice history receive a clearly labelled introductory review, not a fabricated weak-topic diagnosis.
- Language availability is explicit. If Daily Learning content is English-only, show that limitation clearly and do not silently disable activities because the course selector differs. If bilingual content is implemented, ensure course language and translation language are handled separately and consistently.
- Dashboard allowance bars match the allowance totals used by the Lessons allowance UI and server-side completion ledger; no inconsistent client-only calculation.
- Favorite words use the existing saved_words table and owner-scoped RLS. English and Chinese lists are independently expandable, empty states are clear, and selecting a saved word opens the matching dictionary detail or equivalent accessible detail.
- The large avatar is read from the signed-in profile and updates when the avatar selection changes.
- Active learning languages are derived from real learning activity records and sorted by most recent activity. Do not use the saved preference as a proxy for actual activity. Show last active date/time with course language and account timezone where possible.
- Practice charts have accessible text equivalents, labels and denominators. Topic recommendations are derived from available practice data and explained. Empty/insufficient data is handled without misleading charts.
- Existing dictionary search, word-grid layout, saved-word sync, Google authentication, account switching, lessons, translation switching, stroke-order functionality and unlimited free dictionary search must pass regression testing.
- No raw answers, new tracking categories or unnecessary personal data are added.

#### Investigation findings at branch creation

- The current index.html has a separate top-level Daily Learning navigation button and a standalone dailyLearningPage; its route key is daily-learning.
- The current Profile page contains Learning progress, Practice insights, Account preferences, Privacy and data, and Account sections. The Preferences menu currently routes to Profile and scrolls to a nested card.
- daily-learning.js loads English daily content only and disables activity start when either the saved learning language or global course selector is not English. This is a likely source of confusing UX and must be resolved explicitly; do not claim Chinese daily activity support unless content is actually supplied.
- Current daily content selection rotates based on completed activity log events and session records. Inspect content reuse, current-day completion handling, allowance exhaustion, interrupted sessions and replay semantics before changing.
- The Dashboard currently derives Learning languages from distinct language_code values in completed activity rows, but does not show recency. Update it to show each actually active language ordered by latest activity.
- Practice insights currently aggregate up to 10 recent practice summaries and calculate due topics using a simplified threshold. Improve explainability and presentation without storing raw answers.
- The app's saved-word system already uses Supabase saved_words for signed-in accounts and has account-isolation protections. Reuse that source rather than copying saved words into a new table or shared local storage.

#### Legal, privacy and content review for 2.3.1

- Malaysia PDPA applicability remains fact-specific; a free public service is not automatically outside the Act. Obtain Malaysian legal advice on controller status, the commercial-transaction scope, notice/consent, retention, user rights and cross-border transfers.
- The new Dashboard is a more visible presentation of existing account-linked learning history, preferences and saved words. Keep it private to the authenticated owner; do not expose it through public URLs, shared caches, analytics or another account's session.
- Reuse existing aggregate practice data only. Do not introduce raw answer logging, new behavioural tracking, or a more intrusive profiling model. Explain adaptive-review recommendations in the interface.
- Saved words and language activity remain personal data when linked to an account. Preserve RLS and least-privilege grants; verify account switching and sign-out clearing.
- Charts and weak-topic displays must not be presented as certification, a formal assessment or proof of ability. They are learner-facing summaries based on self-reported aggregate practice outcomes.
- The intended audience remains 16+ and global. Screen relevant child/teen and international privacy obligations, including GDPR applicability if EU users are deliberately targeted.
- Review existing content and third-party source licences if Daily Learning content is expanded or reused. Do not copy protected exercises or source material without permission.
- No new user-data table is planned. The implementation does add an authenticated, read-only public RPC for current allowance counts because the underlying ledger is intentionally private. Its migration must be documented, tested locally, reviewed for RLS/grants/rollback, and separately approved before production application.

#### Implementation progress after initial branch review — 13 November 2026

- The requested branch was already present when this work resumed, with three initial commits based on the merged 2.3.0 main commit. Work has continued on that branch; no duplicate branch was created.
- Daily Learning is now embedded in the Lessons page above the permanent lesson difficulty navigation. The separate top-level Daily Learning navigation button has been removed. The existing route is retained as an alias to Lessons for backward compatibility.
- The Daily Learning loader no longer derives allowance usage from `learning_activity_log`. It reads the current-window counters from `public.get_my_learning_allowance_usage()`, then uses the server count to rotate daily content and calculate remaining allowance. Card states distinguish unavailable allowance data from an exhausted allowance; active sessions and free replays remain resumable.
- The Dashboard allowance bars use the same owner-scoped RPC and the existing `private.learning_allowance_usage` ledger. This is intentional: deleting learning history must not restore allowance. If the RPC is unavailable, the Dashboard reports usage as unavailable rather than displaying a false zero.
- The new RPC is added to the existing allowance-ledger migration draft. It is `SECURITY INVOKER`, revokes execution from `PUBLIC` and `anon`, grants execution to `authenticated`, and delegates each count to the existing private helper, which verifies `auth.uid()`. It does not expose direct browser access to the private ledger.
- Dashboard course recency is derived from completed activity records, ordered newest-first, and displayed in the user's preferred account timezone. The exact total activity count uses the database count result; the latest activity rows are used to determine each language's last-active timestamp.
- The Dashboard and Preferences pages, expandable English / Simplified Chinese Favorite words, large avatar heading, visual allowance bars, practice chart and topic-review list are present in the current branch implementation.
- The Dashboard now degrades gracefully against the live 2.2.0 schema: it retries the legacy `user_preferences` and `learning_activity_log` shapes, tolerates the not-yet-created `daily_activity_sessions` table, and shows allowance usage as unavailable rather than inventing zero usage. Daily Learning displays a clear “waiting for a server update” message when its required columns, tables or RPCs are missing. A browser regression test simulates this exact legacy database state.
- Additional browser coverage verifies that adaptive Daily Revision selects a weak topic from aggregate practice history, abandoning an activity consumes no allowance, Daily Discovery completes without a score, and completion/abandonment feedback remains visible after refreshing the cards.
- Regression coverage has been updated for the integrated Lessons navigation, signed-out access, Daily Topic / Application RPC flows, Dashboard favorite words, course recency, ledger-based allowances, practice insights and Preferences navigation. The frontend mock now applies the same row filters as Supabase so completed sessions are not incorrectly treated as active sessions.
- The branch-specific CI workflow now runs on pushes to this feature branch as well as the original 2.3.0 foundation branch. Several early runs exposed stale test selectors and fixtures; those test issues have been corrected. Do not mark validation complete until the latest run for the current head passes all three jobs.
- **Production database remains untouched.** The read-only audit confirms the live database is still at the 2.2.0 baseline and is missing the 2.3.0 Daily Learning / allowance schema and RPCs as well as the new 2.3.1 allowance-read RPC. The hosted Daily Learning and Dashboard allowance paths cannot be considered production-ready until the full, ordered 2.3.0 database migrations plus the 2.3.1 read RPC are reviewed, applied with explicit approval, and verified against the hosted site. Do not apply them without explicit approval.

#### Malaysia and global privacy-risk review for Update 2.3.1

- The Dashboard surfaces account-linked saved words, learning-language codes and last-completed timestamps, topic identifiers, and aggregate first-attempt correct/question counts. These records can identify a learner when linked to their account and should be treated as personal data. No raw answer choices, free-text answers, or third-party analytics are introduced by this update.
- Malaysia's PDPA 2010 is framed around personal data processed in respect of commercial transactions. SwiftDictionary is currently intended as a free personal learning project, while a Premium plan remains undecided; the operator, actual service model and commercial context must be reviewed before monetisation or broader launch. Do not assume that the free label alone resolves applicability.
- The 2024 PDPA amendments commenced in phases on 1 January, 1 April and 1 June 2025; the amended provisions are therefore in force as of this record date. The review must cover notice and choice, purpose limitation, data minimisation, security, retention, data integrity, access/correction, breach response and any applicable data-controller obligations.
- The connected Supabase project is hosted in `ap-northeast-1` (Tokyo). Review the Malaysia PDPA cross-border-transfer requirements and the processor/vendor arrangements for this hosting location. The Privacy Notice should identify relevant data categories, purposes, processors/recipients, transfer locations, retention, user rights and the learning-history deletion behaviour.
- The Act requires a written privacy notice in Bahasa Malaysia and English. A final notice should be prepared in both languages before public release; a Chinese course does not remove this statutory-language review.
- JPDP's published FAQ identifies regular and systematic monitoring (including online user-behaviour tracking) as a possible DPO-appointment trigger. Because course recency and practice performance are now tracked, assess DPO applicability against the actual scale and processing pattern rather than assuming it is or is not required. Also document a breach-notification process.
- The intended audience is 16+. Review treatment of 16–17-year-old users and any relevant guardian/representative requirements, plus child-privacy rules in other target jurisdictions. Global availability may trigger laws beyond Malaysia's PDPA.
- Keep the privacy design minimal: use aggregate practice counts, do not persist individual answer choices, keep allowance records separate from deletable learning history, enforce account-scoped RLS, and explain the retention exception for allowance usage. This is a planning review, not a legal opinion or compliance certification; obtain Malaysian legal advice before launch or monetisation.
- Official references: [Malaysia PDPA 2010 and 2026 reprint](https://pdp.gov.my/wp-content/uploads/2026/10/Akta-709-cetakan-semula-2026-BI.pdf), [PDPA Amendment Act 2024 commencement notice](https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024-appointment-of-date-of-coming-into-operation/), [JPDP FAQ](https://www.pdp.gov.my/en/faq/).

#### Validation and release discipline

- Implement on this feature branch only. Do not edit main.
- Use incremental analysis and consolidated validation; do not create intermediate ZIPs.
- Add regression tests for the seven requested areas and retained functionality.
- Distinguish static checks, automated browser tests, mocked Supabase tests, real hosted OAuth tests and owner live-site tests.
- No production Supabase writes/migrations, PR merge or GitHub Pages deployment without explicit owner approval.
- After implementation, prepare one consolidated Update 2.3.1 candidate and update this record with exact commit, PR, CI and test evidence.


## 14. Documentation continuity system — established 2026-11-13

**Authoritative documentation branch:** `docs/master-development-record`.

- The Master Development Record is the current concise handover and roadmap authority.
- Each meaningful SwiftDictionary development conversation/session is archived as a dated Markdown file under `docs/conversation-archive/`.
- `docs/conversation-archive/README.md` is the chronological archive index.
- Archives preserve the purpose, exact owner decisions, implementation/files, branches/commits/PRs, tests (including failures and fixes), legal/privacy considerations, outstanding work and recovery instructions.
- Archives are structured summaries of relevant user-visible project discussion, not unfiltered transcripts. Never store hidden reasoning, credentials, secrets or unrelated personal information. Assume repository contents may be public.
- Keep this branch documentation-only. Implement application changes on feature branches; `main` remains the production-code branch. Do not duplicate application implementation onto the documentation branch.
- At the end of each meaningful session, update both this record and the relevant dated archive/index entry. Record interruptions and the precise next recovery step.
- A future conversation should read this record and relevant archive(s), then independently verify live GitHub branch/PR/CI and deployment state before acting.

### Current handover — Update 2.3.1 mock testing (2026-11-13)

- **Feature branch:** `feature/update-2-3-1-bug-fix-and-changes`.
- **Pull request:** [#5](https://github.com/WhiteWingCat/swiftdictionary/pull/5), base `main`, head feature branch, open and unmerged at the latest recorded check.
- **Latest recorded feature commit:** `c55d05fe196811903f2c358f090eebed6893b3ff`.
- **Owner-approved direction:** Option B — isolated browser-only mock testing with fictional Test User A and Test User B, explicitly entered only on the dedicated Cloudflare Pages preview.
- **Implementation:** `mock-testing.js`, loaded by `index.html`; mock-specific tests under `tests/update-2-3-1/`; browser smoke coverage under `tests/browser/`; CI updates in the existing workflow.
- **Isolation design:** namespaced session storage per fictional identity; mock adapter intercepts app Supabase client creation only when the preview-host guard and `?swiftMock=1` are both satisfied; Google OAuth is unavailable in mock mode; scoped reset/exit; visible mock-mode indicator; production/unknown hosts fail closed.
- **CI evidence:** workflow run [#456](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43413625418) passed mock adapter syntax/unit tests, PostgreSQL 17 migration/allowance checks, Chromium browser regression and disposable local Supabase Auth compatibility checks.
- **Not yet verified:** actual Cloudflare preview-host manual test. Expected preview host is `feature-update-2-3-1-bug-fix-and-changes.swiftdictionary-testing.pages.dev`; append `/?swiftMock=1` to the actual preview URL. If the hostname differs, the exact-host guard will fail closed and must be reviewed before testing. Do not use a real account as a workaround.
- **Backend limitation:** the Cloudflare preview frontend still points to the production Supabase project. Do not run real-account or data-changing tests from preview until backend isolation is independently confirmed. Mock mode does not validate real OAuth/JWT/RLS/database functions/triggers or cross-device sync.
- **Production safety:** no production Supabase schema/data/settings/credentials were changed; no PR merge or production deployment was performed. Do not merge PR #5, apply migrations or deploy without explicit owner approval.
- **Next technical step:** verify the actual Cloudflare Pages preview hostname, then manually confirm the mock indicator, A/B identity isolation, scoped reset and exit, and absence of Supabase Auth/database/network calls while mock mode is active. Before claiming full app coverage, inspect every direct Supabase table/RPC/auth call and compare its query shape with the mock adapter.
- **Conversation archive:** see [2026-11-13 Update 2.3.1 mock testing and documentation continuity](conversation-archive/2026-11-13-update-2-3-1-mock-testing.md).



### 2026-11-13 preview-host correction

- The owner supplied the actual Cloudflare Pages preview URL: `https://feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev/#dictionary`.
- Investigation confirmed the mock adapter had allowlisted the wrong hostname: `feature-update-2-3-1-bug-fix-and-changes.swiftdictionary-testing.pages.dev`.- Corrected `mock-testing.js` on the Update 2.3.1 feature branch to allow only the actual owner-supplied preview hostname `feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev`, still requiring the explicit `?swiftMock=1` parameter.
- Updated `tests/update-2-3-1/mock-testing.test.mjs` to activate on the corrected host and explicitly reject the former incorrect hostname as an unknown host. Production/root Pages/other-host fail-closed tests remain.
- Commits: adapter correction `ca30d3394dcde2057d11b698f2e66bb15b1e55b4`; regression-test correction `54c11c221fb3199a655d849444182077e4b53e95`.
- CI status for these new commits has not yet been confirmed. The earlier passing run #456 predates this hostname correction and is not evidence for these changes.
- Next step: wait for/check the latest branch CI, then the owner can open `https://feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev/?swiftMock=1` (or add `&swiftMock=1` if the URL already contains another query parameter). Confirm the mock warning panel appears. Do not sign in with a real account or use the preview for real data changes.
- The Cloudflare preview still shares the production Supabase project configuration. While mock mode is active, verify no Supabase requests are made; do not run real-account/data-changing tests until backend isolation is confirmed.


## 15. Update 2.3.1 — owner feedback and dashboard / Daily Learning refinements (2026-11-14)

### Owner-approved requirements from the latest live preview review

1. Active learning course recency must use relative elapsed time (for example, “Last active 3 days ago”) rather than a full date/time string.
2. Dashboard Activity overview must become a visual summary rather than a text-only list of counts.
3. When a daily activity allowance is exhausted, do not reveal the next activity's content preview during the cooldown period.
4. Daily Discovery is a globally shared daily subject: every user sees the same word on the same global day. Daily Topic, Daily Application and Daily Revision remain account-personalised.
5. Daily Discovery should focus on dictionary-style recognition of less-common English vocabulary. The previous mixed grammar/facts discovery collection is retained in source as a future backlog candidate, not used by the new selector.
6. Daily activity readers should open in a left-side slide-in panel following the Dictionary detail-panel interaction pattern.
7. Add more examples across relevant daily activity readers.

### Implementation now on the feature branch

- **Feature branch:** `feature/update-2-3-1-bug-fix-and-changes`.
- **PR:** [#5](https://github.com/WhiteWingCat/swiftdictionary/pull/5), still intended to target `main`; no merge or production deployment authorised.
- **Latest recorded feature commit:** `c2f7ab612e1d3f773eb5322296b77240e8a36e24`.
- **Files changed:** `index.html` and `daily-learning.js`.
- Dashboard course recency now displays relative elapsed time in minutes, hours, days, weeks or months.
- Activity overview now displays a bar for each tracked activity category, with accessible text labels and completion counts. Bars are scaled against the largest category in the current account history; they are comparative counts, not a percentage-of-goal measure.
- Daily activity cards replace the next-content preview with a cooldown message when the next slot is blocked by an exhausted allowance. The already-completed content remains reviewable according to the existing free-replay rule.
- Daily Discovery now selects a deterministic vocabulary entry by UTC calendar date, so users see the same word regardless of account, preference or allowance timezone. The daily session remains per-user and existing per-user allowance enforcement is retained.
- The new shared-word pilot currently uses a curated set of 12 less-common words with original explanations/examples, translation text, part of speech and pronunciation. The UI explicitly says the frequency classification is curated, not a live conversational-corpus ranking. **Statistical spoken-frequency ranking is not yet implemented** and must not be claimed as complete.
- The prior mixed Daily Discovery array remains unused by the current selector and should be considered backlog material for possible future reuse in another activity.
- Daily activity readers now use a modal backdrop and left slide-in panel with back, close and backdrop-dismiss controls. The reader includes dictionary-style definition/part-of-speech/pronunciation presentation for Daily Discovery.
- Existing examples are expanded into individual examples where available; practice question blanks are also shown as completed example sentences. More authored examples can be added during content QA.
- Existing allowance semantics, adaptive revision, account preferences, aggregate-only practice summaries and daily local-time reset rules are intended to remain unchanged.

### Validation evidence and current limitation

- JavaScript syntax validation passed for `daily-learning.js` and the inline application script in `index.html` after the final JavaScript changes.
- Static assertions passed for relative timestamps, activity bars, UTC-shared discovery selection, cooldown preview suppression, drawer open/close controls, additional examples and dictionary-style discovery definition.
- An early syntax check caught an unescaped apostrophe in the cooldown message. It was corrected and syntax validation passed afterward.
- Latest GitHub Actions run observed: [run #486](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43549929803), triggered from the latest feature commit and still queued at the time of this record update. It contains Chromium browser regression, PostgreSQL 17 migration/allowance and disposable local Supabase Auth compatibility jobs. Do not claim CI passed until all three finish successfully.
- Owner has not yet tested these new changes. Do not mark Update 2.3.1 complete until owner preview testing and CI both pass.

### Frequency-data research and legal/content notes

- A candidate source for a future statistical spoken-frequency ranking is the OANC-derived spoken frequency list published by Lingevo. Lingevo states that its spoken list is counted from about 3.1 million words of Switchboard and Charlotte telephone/face-to-face conversation transcripts, and offers the derived lists for unrestricted use including commercial use, with credit to Lingevo and the Open American National Corpus.
- Source references: [Lingevo English word lists and licensing](https://lingevo.com/resources/), [Open American National Corpus](https://anc.org/data/oanc/), [OANC spoken corpus composition](https://anc.org/OANC/index.html).
- The OANC spoken data is a limited American-English conversation sample, not a universal measure of all spoken English. Any future label should explain the corpus and avoid implying a globally representative ranking.
- The current 12-word pilot is curated, not derived from those frequency counts. Before claiming statistical selection, obtain the frequency file, validate its fields and counts, select a defensible frequency band, document attribution and add source notices. Do not redistribute any data until its actual terms and attribution are checked.
- No new personal-data category or table was introduced for global discovery. The shared word is selected client-side by UTC date; each user's session, completion and allowance remain private and account-scoped.
- Malaysia PDPA and global privacy review remains required for the wider project, but this change does not add new learner profiling or raw-answer collection. Preserve RLS, aggregate-only practice data and the existing account isolation. This is planning, not legal advice or a compliance certification.

### Exact recovery point

1. Continue from `feature/update-2-3-1-bug-fix-and-changes`; do not recreate it.
2. Latest application commit recorded here: `562f9ad6c594083ddef064d3764d791681341170`.
3. Check the latest run #486 and inspect any failed job logs before proceeding.
4. Verify Cloudflare has rebuilt the preview for the latest branch commit. The owner-confirmed preview host remains `feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev`; use `?swiftMock=1` and fictional Test User A/B only.
5. Test relative active timestamps, activity overview bars, free and Premium cooldown states, same global Daily Discovery word across mock identities, personalised Topic/Application/Revision, drawer open/close/backdrop behavior, translation, examples, completion, replay and abandon.
6. The statistical frequency ranking remains an explicit content-quality follow-up; do not describe the curated pilot as corpus-ranked.
7. Wait for the owner's testing feedback before further application changes. Do not merge PR #5, apply production migrations, change production data/settings or deploy without explicit approval.


### Follow-up validation and server-catalogue correction — 2026-11-14

- A first CI attempt failed because `tests/update-2-3-0/check-frontend.mjs` still expected the old `dailyDiscoveries` array. The test was updated to validate `dailyDiscoveryVocabulary` and its dictionary metadata.
- Further review found that dynamically generated global discovery IDs would be rejected by the server-side approved content catalogue. Corrected this before owner testing:
  - Each of the 12 vocabulary entries now has a stable approved base ID.
  - Session IDs use `approved-word-id:YYYY-MM-DD`, with the date based on the shared UTC day.
  - The private validator accepts only a valid date suffix whose base ID is active in the private catalogue, with null topic and difficulty.
  - The content-catalogue migration draft replaces the old 27 discovery rows with 12 approved vocabulary IDs.
  - Catalogue checker expectations now total 80 entries (28 Topic + 25 Application + 12 Discovery + 15 permanent lessons).
  - SQL assertions test valid date-scoped IDs, unknown IDs, malformed dates and forged topic metadata. The allowance test fixture was updated to use a date-scoped ID.
- Latest PR #5 head confirmed: `c2f7ab612e1d3f773eb5322296b77240e8a36e24`.
- Latest CI run [#499](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43550190284) completed successfully: Chromium browser regression, PostgreSQL 17 migration/allowance tests and disposable local Supabase Auth compatibility all passed.
- The earlier run #495 failure was confined to the stale frontend checker expectation; run #499 includes the corrected checker, catalogue migration, date-scoped validator and updated allowance assertion.
- Static JavaScript syntax and catalogue matching checks also passed.
- This CI evidence does not replace owner preview testing. Cloudflare preview deployment for the latest commit has not been independently confirmed in this record.
- The current Daily Discovery set is still a curated pilot, not statistically ranked by spoken-corpus frequency. This remains a known content-quality limitation.


## 16. Update 2.3.1 — second owner preview review and refinement pass (2026-11-14)

### Owner's latest feedback and scope

The owner reviewed the prior Update 2.3.1 preview and requested:

1. Fix permanent-lesson translation refresh when changing translation language.
2. Improve Simplified Chinese translation coverage throughout Daily Learning while preserving English learning context (grammar prompts, example sentences and answer choices).
3. Remove the dark translucent backdrop behind the left-side activity panel and add sufficient inset spacing around the panel content.
4. Present Daily Discovery in dictionary-style detail layout, without previous/next navigation.
5. Make Daily Topic, Daily Application and Daily Revision more clearly personalised by account; switching mock identities must show distinct content, and resetting mock data must rotate the selections. Daily Discovery remains globally shared for the same UTC day.
6. Combine all relevant examples into one Examples box; remove the separate “More examples” treatment.
7. Open permanent lessons on a dedicated page instead of expanding the lesson reader inside the lesson library.

**Dashboard scope freeze:** the owner explicitly confirmed that the Dashboard is in a good place and requested no further Dashboard changes for now. No Dashboard layout, statistics or visualisation changes were made in this pass.

### Implementation on the existing feature branch

- **Branch:** `feature/update-2-3-1-bug-fix-and-changes`.
- **PR:** [#5](https://github.com/WhiteWingCat/swiftdictionary/pull/5), still open and unmerged; base remains `main`.
- **Latest application commit:** `d1af4357fdbca0b86765ebba22750457eb9b62a5`.
- **Files changed in this pass:** `index.html`, `daily-learning.js`, `mock-testing.js`, `tests/browser/update-2-3-0-smoke.spec.js`, `tests/update-2-3-0/check-frontend.mjs`, and `tests/update-2-3-1/mock-testing.test.mjs`.

#### Translation and Daily Learning

- Added a shared translation-view refresh path. Changing the top translation selector now refreshes the open dictionary entry, permanent lesson, Daily Learning cards and an open Daily Activity reader. Saving Profile preferences uses the same refresh path.
- Fixed an activity-reader state-reference error found during browser regression testing so checked answers and their English/Chinese explanations remain visible after switching languages.
- Added Chinese translations for all 28 Daily Topic titles and all 25 Daily Application titles, plus Daily Learning headings, preference labels, card metadata, status messages, reader controls and Daily Discovery usage notes.
- English sentence prompts, answer options, grammar terms and examples remain in English as learning context. Chinese explanations are shown alongside the relevant material or after answer checking.
- Daily Discovery retains its English headword and examples, while showing the Chinese definition and Chinese usage note when Simplified Chinese is selected.
- Daily Discovery start RPC arguments now explicitly send null topic and difficulty metadata, matching the approved server catalogue's global-word contract.

#### Activity reader and examples

- The activity backdrop is transparent; the left-side panel itself remains interactive and dismissible.
- Added internal panel padding and separate inset spacing for the dictionary-style Daily Discovery content.
- Daily Discovery now uses dictionary-style headword, pronunciation, part-of-speech, definition, examples and usage-note sections, without previous/next controls.
- Relevant examples are combined into one Examples box. The separate “More examples” treatment has been removed.

#### Personalised activity selection and mock reset

- Daily Topic, Daily Application and Daily Revision now include a stable account-derived selection offset, while Daily Discovery is selected solely by the global UTC date and remains identical across accounts on that date.
- Adaptive revision still prioritises the best-ranked weakness group; account-derived selection chooses within equally ranked candidates, including unseen topics for new accounts.
- Mock mode exposes a session-storage selection-generation counter. Resetting mock data increments the generation while preserving unrelated session-storage keys, then clears the mock user stores. The new generation rotates the personalised Topic/Application/Revision selection after reload.
- The selection-generation counter is test-only and stays in the exact-host, explicit-opt-in mock environment. It is not a new production preference, table or account-data field.

#### Permanent lesson navigation

- Moved the permanent lesson reader to a separate `lessonDetailPage` page panel.
- Opening a lesson now navigates away from the lesson library; the dedicated back control returns to Lessons. Browser hash handling recognises the lesson-detail route and safely falls back to Lessons when no active lesson is loaded.
- Translation changes rerender the active lesson from its source record while preserving practice state.

### Validation and CI evidence

- Latest GitHub Actions run: [run #549](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43553866219).
- **All three CI jobs passed**:
  - Chromium browser regression: 15 tests passed, including bilingual Daily Learning refresh, dictionary-style Discovery, transparent panel inset, and dedicated permanent lesson page.
  - PostgreSQL 17 migration and allowance tests passed, including frontend/RPC integration checks and mock-adapter unit tests.
  - Disposable local Supabase Auth compatibility and security-advisor checks passed.
- Earlier CI attempts exposed test/implementation issues which were corrected before run #549:
  - Mock reset tests now verify unrelated session-storage values remain intact while the generation counter advances.
  - Existing browser assertions were updated for Chinese UI text when the fixture preference is Simplified Chinese.
  - The translation-refresh feedback renderer now references the preserved reader state correctly.
  - Discovery padding assertions inspect the inner dictionary content panel, where the padding is applied.
  - The frontend timezone-helper test boundary was updated after adding the bilingual UI helpers.
- Static checks also confirmed all 28 Topic and 25 Application title translations exist, all 12 Discovery words have Chinese usage notes, mock A/B selection offsets differ for Topic/Application/Revision, and reset changes all three offsets.
- No production database migration, production data mutation, PR merge or production deployment was performed.

### Legal, privacy and data-safety review

- This pass adds no new production personal-data field, table, raw-answer collection or learner-profiling category.
- The account-derived offset is calculated client-side from the signed-in account identifier and is not persisted or sent as a new field. Keep it out of logs and analytics.
- The mock selection-generation counter is stored only in session storage within the explicitly enabled mock preview.
- Existing account isolation, RLS, aggregate-only practice results, allowance rules and global UTC Daily Discovery selection remain intact.
- The work is a UI/selection bug-fix pass, not a legal-compliance certification. Malaysia PDPA and global privacy/age obligations remain project-wide review requirements.

### Exact recovery and next testing point

1. Continue from `feature/update-2-3-1-bug-fix-and-changes`; do not recreate the branch.
2. Latest PR #5 head: `d1af4357fdbca0b86765ebba22750457eb9b62a5`.
3. CI run #549 passed all three jobs. The browser suite passed 15 tests.
4. The owner-confirmed Cloudflare preview host remains `feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev`. The latest Cloudflare deployment itself has not been independently confirmed; allow it to rebuild before owner testing.
5. Use `?swiftMock=1` and fictional Test User A/B only. The preview frontend still references the production Supabase configuration outside the mock adapter; do not use real accounts or real data-changing tests.
6. Owner retest priorities: switch translation while a permanent lesson is open; switch translation while a Daily Activity is open and after checking answers; verify English learning context remains English; inspect activity panel backdrop/insets; verify Discovery layout; compare A/B Topic/Application/Revision and shared Discovery; reset mock data and verify the personalised selections rotate; open/back from a permanent lesson page.
7. Dashboard is frozen unless the owner raises a new issue. Statistical spoken-frequency ranking for Daily Discovery remains future work; the current 12-word set is curated, not corpus-ranked.
8. Wait for owner testing feedback before any further app changes. Do not merge PR #5 or deploy without explicit approval.


## 17. Update 2.3.1 — final daily activity polish and rollover handling (2026-11-14)

### Owner feedback

The owner requested six final refinements before considering Update 2.3.1 ready for main: remove the activity reader outline; translate the Daily Learning reset/plan/context status when the translation language changes; remove duplicate cooldown text; improve definition contrast to white in Daily Discovery and lessons; ensure unfinished activities reset after the daily boundary; and close the reader after successful completion. The Dashboard remains explicitly out of scope.

### Implementation

All application work stayed on feature/update-2-3-1-bug-fix-and-changes, PR #5, targeting main.

- Removed the activity reader border while retaining its transparent backdrop, spacing, rounded outer corners and shadow.
- Added a shared renderDailyStatus() path. The reset timezone, plan, English-context note, deferred timezone-change notice and English-course guidance now refresh in the selected translation language whenever the global translation selector changes.
- Retained the cooldown preview and removed the second repeated allowance-exhaustion message.
- Set lesson definition text and Daily Discovery definition text to the primary foreground colour (var(--text)).
- After the server confirms complete_daily_activity_session, the reader closes immediately. The activity list and remaining allowance then refresh. Completion confirmation and refresh-error messages use the selected translation language.
- On Daily Learning load, each in-progress session's started_at timestamp is compared with the current allowance-day interval in the user's effective allowance timezone. Sessions outside that interval, including malformed timestamps, are marked abandoned through the existing abandon_daily_activity_session RPC before cards render. Only sessions started within the current allowance day remain resumable. Abandonment does not count as completion or consume allowance.

### Daily reset and allowance clarification

The reset is based on the configured allowance timezone, not on whether the learner completed the activity. At the next local midnight, a completed activity remains recorded as completed for its original day, while an unfinished session is marked abandoned on the next Daily Learning load. The user can then start the new day's activity without resuming yesterday's session. Only successful completion consumes the daily allowance.

This is a lazy rollover cleanup, not a background job at the exact stroke of midnight. If the user does not open Daily Learning, the old database row may remain in_progress until the next load; that load performs cleanup before rendering resumable sessions.

### Tests and validation

Latest application commit: 99dc69446ca56459c344915711ed2169c909b0c4.

Browser regression coverage now checks:
- Daily Learning status switching Chinese → English → Chinese while a reader is open.
- Reader border removal and primary-foreground definition colour.
- Reader closure after successful completion.
- Automatic abandonment of a previous-day unfinished session, followed by creation of a fresh session.

Latest GitHub Actions run: [run #557](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43556612276).

- Chromium browser regression: 16 tests passed.
- PostgreSQL 17 migration and allowance tests passed.
- Disposable local Supabase Auth compatibility and security-advisor checks passed.
- All three CI jobs passed on commit 99dc69446ca56459c344915711ed2169c909b0c4.

An earlier browser attempt failed only because an existing test expected an English completion confirmation while the fixture selected Simplified Chinese. The implementation correctly returned the Chinese confirmation; the assertion was corrected and the subsequent full CI run passed.

### Legal, privacy and data-safety review

- No new personal-data fields, tables, raw-answer collection, tracking or learner-profile categories were added; no database migration was introduced.
- Rollover cleanup changes only the status of the signed-in user's existing expired activity session through the existing account-scoped server RPC and access controls.
- No additional learner data is collected, exposed or logged.
- This is not a legal-compliance certification. Malaysia PDPA and applicable global privacy/age obligations remain project-wide review requirements.

### Current branch and recovery point

1. Feature branch: feature/update-2-3-1-bug-fix-and-changes.
2. PR #5: https://github.com/WhiteWingCat/swiftdictionary/pull/5 — open, targets main, not merged.
3. Latest feature head: 99dc69446ca56459c344915711ed2169c909b0c4.
4. CI run #557 passed all three jobs; browser suite passed 16 tests.
5. No production database migration, production data operation, PR merge or production deployment was performed.
6. The owner-confirmed Cloudflare preview host remains feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev. Confirm Cloudflare rebuilt the latest commit before testing. Use the explicit mock opt-in and fictional Test User A/B only; do not use real accounts or real data-changing tests.
7. Owner retest priorities: inspect the reader edge; switch translation while the Daily Learning status is visible; verify only one cooldown explanation; inspect definition contrast in Discovery and permanent lessons; leave an activity unfinished across local midnight and verify it is abandoned before a fresh session starts; complete an activity and confirm the reader closes.
8. Dashboard remains frozen unless the owner raises a new issue. Do not merge PR #5 or deploy without explicit owner approval.


## 18. Update 2.3.1 — Daily Discovery visibility and global rotation plan (2026-11-14)

### Owner decision

The owner explicitly selected **Option A** for Free-plan Daily Discovery visibility:

- The global schedule contains three distinct Daily Discovery entries per UTC day.
- Free users see and can complete only the first entry in that day's schedule.
- Premium users see and can complete all three entries.
- Do not show the second and third entries as locked cards or previews to Free users. They are not displayed in the Free experience.
- Existing completion allowances remain unchanged: Free = 1 completion/day; Premium = 3 completions/day.

### Global schedule and account isolation

- Daily Discovery remains globally shared: every user receives the same scheduled entries for a given UTC date, subject to plan visibility.
- The global schedule advances by UTC date, never according to any user's completion, account, timezone, or activity.
- A user's completion state and allowance remain account-scoped. One learner completing, abandoning, or skipping an entry must not change another learner's schedule or availability.
- Keep the existing allowance-day timezone behavior for per-user quota resets. Do not conflate the user's local allowance reset with the UTC global content assignment.
- Use stable approved content IDs and date-scoped session IDs. The server-side private catalogue validator must approve every scheduled entry.

### Backlog and rotation

- Expand the curated Daily Discovery vocabulary backlog from the current 12 entries to a target of at least 90 reviewed entries before enabling the full three-entry schedule.
- At three entries per UTC day, 90 entries provide a 30-day initial rotation without reusing an entry.
- Assign three distinct entries to each UTC date. Avoid repeats within a daily set and do not immediately repeat the previous rotation's final entries at the start of the next cycle.
- Rotation must be deterministic and versioned so that users opening the activity on different devices receive the same daily set.
- Adding or editing backlog content must not silently change assignments already published for a date. Any schedule revision must be explicit and versioned.
- If the approved backlog is temporarily insufficient, do not silently repeat or generate unapproved content. Keep the schedule within the available approved entries and surface an operational/content-readiness issue for review.
- The 90-entry target is a planning threshold, not a claim that the current 12-entry pilot already supports 30 days.

### Implementation sequence

1. Audit the current client-side UTC selector, daily Discovery rendering, stable IDs, allowance display, and server-side catalogue validation.
2. Prepare and editorially review the expanded vocabulary backlog, including accurate definitions, pronunciation, Chinese translations, examples, usage notes, and source/licensing review where external corpus data is used.
3. Implement a deterministic, UTC-date-based three-entry schedule with a versioned rotation and no per-user influence.
4. Update plan-aware rendering: Free receives only schedule position 1; Premium receives positions 1–3. Do not render locked placeholders for positions 2–3 to Free users.
5. Update the private approved-content catalogue and server validation so every scheduled stable ID is approved. Preserve null topic/difficulty metadata for Discovery and existing account-scoped completion RPCs.
6. Add automated tests for global schedule consistency across accounts, UTC date rollover, rotation uniqueness and boundary behavior, Free visibility of exactly one item, Premium visibility of exactly three items, per-user completion isolation, and allowance enforcement.
7. Run the existing browser, PostgreSQL and disposable local Supabase validation suites. Retest only with the explicit mock preview and fictional Test User A/B.
8. Update the Master Development Record and conversation archive with the final implementation, validation evidence, and any remaining content limitations.

### Non-regression and release boundaries

- Do not change Daily Topic, Daily Application, Daily Revision, the Dashboard, or the existing lesson experience as part of this work unless a directly related regression requires it and the owner approves the scope.
- Preserve aggregate-only practice outcomes, existing RLS/account isolation, and the privacy-first catalogue design. Do not introduce answer-level telemetry or a global user completion table.
- Do not claim statistically ranked spoken-frequency selection unless the corpus data, methodology, reuse terms and attribution have been verified. Curated content must continue to be labelled as curated.
- Perform the standing Malaysia and general legal/privacy review for any new data source, corpus reuse, or feature expansion. This planning decision does not constitute legal compliance certification.
- Continue on feature/update-2-3-1-bug-fix-and-changes and PR #5. The plan update does not authorize merging, production database changes, production data operations, or production deployment.


## 19. Update 2.3.1 — Daily Discovery three-slot global schedule implementation (2026-11-14)

### Owner decision

The owner selected **Option A**:
- Free sees only the first globally scheduled Discovery entry for the UTC day.
- Premium sees all three scheduled entries.
- Free does not see locked placeholders or previews for entries two and three.
- The existing completion allowance remains Free = 1 and Premium = 3 per allowance day.

### Implementation on the existing feature branch

- Expanded the active Discovery vocabulary from 12 to **93 unique, curated English words**. Each entry includes an original definition, Simplified Chinese definition, pronunciation, part of speech, explanatory note, two or more examples, and an English usage note with Chinese translation.
- The 93-entry pool provides **31 days at three distinct entries per UTC day**.
- Added schedule version 1, fixed UTC epoch 2026-11-15, and a fixed pool size of 93. Each date receives three consecutive entries from the ordered pool. The schedule is deterministic and independent of user ID, account completion, local timezone, and mock selection offsets.
- The pool size is pinned. Appending/reordering content must not silently change published assignments; a future expansion requires an explicit schedule-version change and reviewed catalogue migration.
- The frontend now renders three separate Discovery cards for Premium and only the first card for Free. It does not render locked cards for Free. Each card opens its own scheduled word and preserves the existing dictionary-style reader.
- Discovery usage notes now display the selected translation language where a Chinese translation is available.
- Added private rotation_order metadata (1–93) to the approved content catalogue. The server validator checks the UTC date, approved base ID, scheduled rotation slot and active plan allowance. start_daily_activity_session now calls the approved-content validator before creating a new session, preventing a Free user from bypassing the hidden second/third entries through a direct RPC call.
- The catalogue remains server-only with RLS and no client SELECT access. It stores IDs and schedule metadata, not vocabulary text or learner answers.

### Tests and source-level validation

- Updated the frontend catalogue checker and SQL catalogue draft to match all **161** approved content records: 28 Daily Topic, 25 Daily Application, 93 Daily Discovery, and 15 permanent lessons.
- Added browser coverage for Free one-card visibility, Premium three-card visibility, identical schedules across separate accounts, and uniqueness within a daily set.
- Added SQL assertions for contiguous rotation order, Free slot-one-only validation, Premium slots one through three, rejection of an unscheduled fourth entry, stale/impossible UTC dates, and direct-RPC bypass attempts.
- Updated frontend schedule tests for deterministic same-date assignments, no repeats on adjacent days, no repeat across the 31-day rotation boundary, and use of all 93 entries exactly once per cycle.
- Source-level checks performed during implementation: JavaScript syntax compilation passed; all 93 entries have unique IDs and words and complete required fields; frontend IDs/metadata and SQL catalogue rows match exactly (161 records); the schedule helper returned three entries per date and passed the 31-day uniqueness and boundary checks; test source files passed syntax compilation after module imports were stripped for the check.
- **Full CI, Playwright browser execution and disposable PostgreSQL/Supabase SQL assertions have not yet been run for this implementation.** No new GitHub Actions run is associated with the latest feature head yet. Source-level checks must not be described as full CI validation.
- The Cloudflare preview has not yet been owner-tested with Free and Premium mock accounts.

### Legal, privacy and release boundaries

- The new word definitions, explanations, translations and examples were authored for this project; no third-party dictionary text or external spoken-corpus data was imported for this expansion.
- No new personal-data field, user tracking, answer-level telemetry, or global learner-completion record was added. Per-user completion and allowance remain account-scoped.
- This is a planning and engineering review, not a legal-compliance certification. Malaysia PDPA and applicable global privacy/age obligations remain project-wide requirements. If Premium is later commercialised, review subscription terms, price/renewal/cancellation disclosures and applicable consumer obligations before launch.
- No production Supabase migration, production data operation, merge or deployment was performed. Dashboard remains frozen.

### Current recovery point and next actions

1. Continue on feature/update-2-3-1-bug-fix-and-changes; PR #5 remains open and unmerged.
2. Latest application/code commit: 6bc0791116ca0a96410a84a3e3fe6953943b2ae3. Latest feature branch head after the handover-record update: e1039bed85ed6f65514699f30cda8a06d2df0214.
3. Obtain full CI execution and inspect any failures before owner preview testing.
4. Confirm Cloudflare Pages has rebuilt the current head. Use only ?swiftMock=1 and fictional Free/Premium Test User accounts; do not use real accounts or production data-changing tests.
5. Verify Free sees exactly one Discovery card; Premium sees exactly three; both accounts share the same words for the UTC date; complete/abandon flows consume allowances correctly; translation switching updates definitions and usage notes; UTC rollover and local allowance reset remain understandable.
6. Do not merge PR #5 or deploy without explicit owner approval.


## 20. Update 2.3.1 — Daily Discovery implementation CI validation (2026-11-14)

### Full CI result

GitHub Actions run **#632** completed successfully against feature head **0531dfaea4903630eb147a75fdbbc122fbf8871d**:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43561897142

All three jobs passed:

- **Chromium browser regression:** 17 tests passed. The new plan-visibility test confirmed Free sees exactly one Discovery entry, Premium sees three, and two separate Premium accounts receive the same three scheduled words. Existing Daily Learning, translation, lesson, Dashboard non-regression, sign-in and account-switching tests also passed.
- **PostgreSQL 17 migration and allowance tests:** passed. This includes catalogue order and approved-ID validation, Free/Premium slot enforcement, direct-RPC bypass rejection, allowance-ledger assertions, learning-history deletion, and concurrency tests.
- **Supabase CLI local Auth compatibility:** passed. The private catalogue, allowance and Daily Learning migrations/assertions ran against disposable local Supabase services; security-advisor checks passed.

The CI run follows two corrected test-fixture issues: SQL exception-message quoting, then replacement of obsolete synthetic content IDs with approved catalogue entries. The final run #632 includes those corrections.

### Release status

1. PR #5 remains open, targets main and is not merged.
2. Latest validated code/test commit: 0531dfaea4903630eb147a75fdbbc122fbf8871d. Subsequent commits only updated this development record; no application or test files changed after run #632.
3. CI success does not replace owner preview testing. The latest Cloudflare preview build has not yet been independently confirmed or tested by the owner.
4. Continue using only the explicit mock preview and fictional Free/Premium accounts. Do not use real accounts or production data-changing tests.
5. No production Supabase migration, production data operation, merge or deployment was performed.
6. The next gate is owner preview testing of the Free/Premium Discovery experience and the existing Update 2.3.1 regression checklist. Do not merge or deploy without explicit owner approval.


## 21. Update 2.3.1 — Free/Premium mock accounts and final CI revalidation (2026-11-14)

### Mock preview plan fixtures

To make the owner preview testable without real accounts:
- Test User A is now a Free mock identity (1 Daily Discovery completion/day).
- Test User B is now a Premium mock identity (3 Daily Discovery completions/day).
- The mock control panel labels each identity with its plan.
- The mock adapter now returns matching plan entitlements and plan-limit rows, including Free/Premium lesson and daily-activity limits. Existing sessionStorage isolation and no-cloud/no-real-OAuth boundaries remain unchanged.
- Added mock unit coverage confirming the two plan fixtures and Premium's three-completion Daily Discovery allowance.

### Final CI revalidation

GitHub Actions run **#647** completed successfully against code/test commit **308138b72917161d14ba5c5ed028a293509423b9**:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43562295504

All three jobs passed again:
- Chromium browser regression: 17 tests passed.
- PostgreSQL 17 migration and allowance tests: passed.
- Supabase CLI local Auth compatibility and security-advisor checks: passed.

The mock-adapter unit test step also passed with the Free/Premium plan fixtures. The browser and database suites continued to pass after those changes.

### Owner preview handoff

Use the existing feature preview only after confirming Cloudflare Pages has rebuilt the latest feature branch:
- Test User A — Free: exactly one Discovery card, no locked placeholders.
- Test User B — Premium: exactly three Discovery cards.
- Compare the UTC-day words between both accounts; the Free card must match Premium's first card, and two Premium accounts must match all three.
- Complete Discovery entries and check the remaining allowance: Free 0 after one; Premium 2 after one and 0 after three. Abandoning must not consume a completion.
- Switch translation while the reader is open and confirm the definition and usage note update without changing the English learning context.
- Refresh/reopen on the same UTC date and confirm the three scheduled words remain unchanged.

No owner preview test has yet been recorded. PR #5 remains open/unmerged; no production database migration, production data operation or deployment was performed. Do not merge or deploy without explicit owner approval.

## 22. Update 2.3.1 — activity content quality, allowance enforcement and completed reviews (2026-11-14)

### Owner feedback and scope

The owner reported four issues during mock-preview testing:
1. Daily Application and Daily Revision reused the same examples and Q&A.
2. Users could still open new lessons after exhausting their daily allowance on either Free or Premium.
3. Completed content should remain available for review after the allowance is used.
4. Some strings displayed as examples were actually questions.

These corrections preserve the previously approved allowance values:
- Free: 5 permanent lesson completions per local day; 1 completion per day for each Daily Topic, Daily Application, Daily Discovery and Daily Revision category.
- Premium: 15 permanent lesson completions per local day; 3 completions per day for each daily category.
- Only successful completion consumes allowance. Reviewing completed content does not consume another completion. Existing in-progress sessions retain the existing free-resume behavior; their eventual completion remains subject to the server-side allowance.

### Implementation on the existing feature branch

**Content quality**
- Added two explicit, authored example sentences for each of the 25 Daily Application items.
- Added independent, topic-specific Daily Revision materials for all 13 revision topics, with separate examples and Q&A. Revision no longer borrows the Application question set.
- Updated `makeRevisionContent` to use the dedicated Revision material.
- Removed the renderer's conversion of practice prompts into examples. Only explicitly supplied example strings are rendered in the Examples section.
- Added checks for question-style examples, exact reuse between Application and Revision, and invalid question structures.

**Allowance enforcement**
- Daily activity start buttons are disabled when the current plan's category allowance is exhausted. Existing plan-specific visibility remains unchanged: Free sees only Discovery slot one; Premium sees slots one through three.
- Permanent Lessons now reads current usage from the server-side `get_my_learning_allowance_usage` RPC, disables unstarted lessons at zero remaining, and rechecks the allowance before creating a new progress row.
- Completed lesson progress remains accessible for free review. Existing in-progress lessons remain resumable under the established policy.
- The mock adapter now rejects new daily activity sessions after the plan allowance is exhausted, matching the server behavior.

**Completed-content review**
- Daily Topic, Daily Application and Daily Revision show completed items from the current local allowance day as review cards.
- Daily Discovery preserves completed review cards across a UTC schedule change that occurs before the user's local allowance day ends. These review cards do not count as additional scheduled entries or consume another allowance.
- `start_daily_activity_session` checks for an exact completed session before applying the current approved-content schedule/plan validator. A previously completed item can therefore be reopened after allowance exhaustion, UTC schedule rollover or a plan change. New sessions still pass the private approved-catalogue and plan-slot validator.
- The private catalogue, RLS boundaries, account-scoped completion state and aggregate-only practice-result design are unchanged.

### Validation

GitHub Actions run **#705** passed against code/test commit **8fb19e183f524277fc9b5c133e8860d79a4a975b**:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43565545461

All three jobs passed:
- **Chromium browser regression:** 21 tests passed. New coverage includes Free and Premium lesson limits, free completed-lesson review, distinct Application/Revision examples and Q&A, completed Daily Topic review after exhaustion, and Discovery review across UTC rollover. Existing translation, Daily Learning, Dashboard, sign-in and account-switching regressions also passed.
- **PostgreSQL 17 migration and allowance tests:** passed, including a new assertion that reopening an exact completed Daily Topic session after the Free allowance is exhausted returns the saved completed session without increasing usage. Existing catalogue, direct-RPC, ledger, concurrency and history-deletion assertions passed.
- **Supabase CLI local Auth compatibility:** passed against disposable local services, including Auth schema/roles/JWT helpers and security-advisor checks.

Intermediate test failures were corrected before run #705. They included question-form and duplicated examples, locale-specific test expectations, and a rollover fixture using a display word instead of the approved stable Discovery ID. An earlier Supabase CLI setup attempt hit a GitHub release API rate limit; the complete final run #705 succeeded.

### Legal, privacy and release boundaries

- New examples and Revision questions were authored for SwiftDictionary. No third-party dictionary corpus, question bank or external frequency dataset was imported.
- No new personal-data fields, tracking, answer-level telemetry or global learner-completion records were added.
- Completed and reviewable progress remains account-scoped; the content catalogue remains private and RLS-protected.
- The standing Malaysia PDPA and general privacy planning remains applicable. No new data-source or personal-data processing category was introduced. If Premium is commercialised later, subscription pricing, renewal, cancellation/refund and consumer disclosures still require separate review. This is not a legal-compliance certification.
- Dashboard remains frozen. The SQL migration is still a draft. No production Supabase migration, production data operation, merge or deployment was performed.

### Current recovery point and next actions

1. Continue on `feature/update-2-3-1-bug-fix-and-changes`; PR #5 remains open and unmerged.
2. Latest code/test commit validated by CI: `8fb19e183f524277fc9b5c133e8860d79a4a975b`. Subsequent commits on the feature branch update only the development record and archive.
3. Confirm Cloudflare Pages has rebuilt the latest feature head before owner retesting. Use only the mock preview with fictional Test User A (Free) and Test User B (Premium):
   `https://feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev/?swiftMock=1`
4. Retest the four reported issues: distinct Application/Revision examples and Q&A; examples are actual examples; new lessons/daily activities are blocked at exhausted Free/Premium limits; completed content remains reviewable without consuming allowance.
5. Specifically verify Discovery review across UTC rollover while the local allowance day remains active, and verify Chinese translation refresh still updates the reader in place.
6. Do not merge PR #5, apply production migrations, or deploy without explicit owner approval.

## 23. Update 2.3.1 — Daily Learning category tabs and plan-sized activity rows (2026-11-14)

### Owner feedback and scope

After reviewing the previous content-quality, allowance and completed-review fixes, the owner requested a final Daily Learning layout refinement:
- Replace the combined list of all daily activities with separate category tabs: Daily Topic, Daily Application, Daily Discovery and Daily Revision.
- Free sees one activity card per tab; Premium sees three cards in a row, following the permanent lesson-library layout.
- Place Start, Resume and Review completed content actions on the right side of each card row.
- When a category allowance is exhausted, place its midnight-reset explanation below that category title, not inside an additional locked lesson card.

No allowance amount, course, content-library or Dashboard scope decision was changed.

### Implementation on the feature branch

**Tabbed category navigation**
- Added four accessible tab buttons and one active tab panel.
- Selected category persists through rerenders caused by completion, preference updates and translation changes.
- Existing daily activity preference controls remain. A paused category retains its tab and shows the paused state within the panel.
- Tab labels update with the selected translation language.

**Plan-sized activity rows**
- Free renders one card per category; Premium renders three.
- Daily Topic and Daily Application use separate curated content per Premium slot.
- Daily Revision preserves the highest-priority adaptive topic in the first slot and uses different candidate topics for additional Premium slots.
- Daily Discovery retains the account-independent global UTC schedule: Free sees slot one and Premium sees up to three.
- Completed items and in-progress sessions remain available as review/resume cards. Once the allowance is exhausted, uncompleted Discovery schedule entries are not shown as locked lessons; completed Discovery items remain reviewable across UTC rollover.
- Premium cards use a three-column desktop grid, with responsive reduction at narrower widths. Free uses a single-column layout.
- Each card uses a horizontal row layout, with Start, Resume or Review completed content action aligned on the right.

**Allowance reset message**
- Removed the exhausted-allowance cooldown message from individual lesson cards.
- The active category panel shows its remaining allowance count and, once exhausted, the midnight-reset explanation directly below the category title.
- The message uses the effective allowance timezone for the account.
- Existing allowance amounts, local-midnight reset behavior, server-side enforcement and free review policy remain unchanged.

**Accessibility and responsive behavior**
- Tabs use tablist/tab/tabpanel semantics, selected-state attributes and focus handling.
- The card rows and actions adapt to mobile widths.
- Permanent lesson navigation and Dashboard remain unchanged.

### Validation

GitHub Actions run **#749** completed successfully against code/test commit **55ad7a12abaa462142a7c6e88b8466d11851040a**:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43568453615
All three jobs passed:
- **Chromium browser regression:** 22 tests passed. New coverage verifies all four tabs, Free one-card and Premium three-card rows for every category, right-side row actions, reset-message placement after Daily Topic completion, and Discovery review across UTC rollover. Existing content-quality, lesson/daily allowance, completed-review, translation, Dashboard, sign-in and account-switching tests passed.
- **PostgreSQL 17 migration and allowance tests:** passed. The layout change did not alter the database schema or allowance ledger. Frontend syntax/integration, catalogue validation, direct-RPC checks, completion/review, concurrency and deletion tests passed.
- **Supabase CLI local Auth compatibility:** passed, including local Auth contract and security-advisor checks.

### Legal, privacy and release boundaries

- This is a presentation/navigation change using existing plan limits, activity preferences, completed sessions and approved content. It adds no personal-data fields, tracking, analytics, answer-level telemetry or external content source.
- No new dictionary corpus, question bank or third-party licensed content was introduced.
- Malaysia PDPA and general privacy planning remains unchanged. If Premium is commercialised later, subscription pricing, renewal, cancellation/refund and consumer disclosures still need separate review. This is a planning note, not legal-compliance certification.
- Dashboard scope remains frozen.
- No production Supabase migration, production data operation, merge or deployment was performed.

### Current recovery point and next actions

1. Continue on `feature/update-2-3-1-bug-fix-and-changes`; PR #5 remains open and unmerged.
2. Latest application code/test commit validated by CI: `55ad7a12abaa462142a7c6e88b8466d11851040a`. Subsequent commits on the feature branch update only the Master Development Record, conversation archive and archive index.
3. Confirm Cloudflare Pages has rebuilt the latest feature branch before the final owner retest. Use only the mock preview with fictional Test User A (Free) and Test User B (Premium):
   `https://feature-update-2-3-1-bug-fix.swiftdictionary-testing.pages.dev/?swiftMock=1`
4. Owner retest checklist:
   - Confirm all four tabs appear and switch independently.
   - Confirm Free sees one card and Premium sees three in each category.
   - Confirm Start/Resume/Review actions are at the right side of each row.
   - Exhaust Daily Topic and confirm the reset description appears below the category title, with no locked cooldown card inserted into the lessons.
   - Confirm completed content remains reviewable without consuming another allowance.
   - Confirm Discovery still follows the global UTC schedule and local allowance day.
   - Confirm Chinese/English translation refresh works without navigating away.
5. Do not merge PR #5, apply production migrations or deploy until the owner explicitly approves.
6. The preceding Update 2.3.1 content-quality/allowance work remains in force and is recorded in the prior archive. This layout change does not reverse those fixes.



## 24. Update 2.3.1 — owner feedback: activity rows, allowance indicator and Premium mock allowance (2026-11-14)

### Owner feedback and final acceptance

The owner requested five final refinements to the Daily Learning category tabs:
1. Premium activity cards must each occupy one full-width row; three columns caused text crowding beside the Review completed content action.
2. Numeric allowance must appear only beside the category title, not inside activity cards.
3. The title-side allowance indicator should be clean, centered and color-coded according to remaining allowance.
4. Premium mock account must show the established 15 permanent lesson completions, not the Free limit of 5.
5. Category tabs should be slightly larger with white text.

The corrected preview was deployed for commit `8c4c4949be68f2b372def13ce75c8ec67b67405e`. The owner retested it and confirmed that all requested changes were present, then approved Update 2.3.1 for merge.

### Implementation confirmed in the final feature commit

- Premium continues to receive up to three activity cards per category, but the cards stack vertically in one full-width column. Free remains one card.
- Card actions remain right-aligned. Numeric remaining-allowance text was removed from unstarted activity cards; those cards use a neutral “New activity” label. In-progress and completed/review statuses remain.
- The category allowance count is displayed in a centered compact indicator beside the category title. The indicator uses green, amber and red states according to remaining allowance.
- Category tabs have increased padding/font size/weight and white text.
- Account refresh now reinitializes lesson progress and reloads allowance for the active identity, preventing a stale Free/Premium lesson allowance from remaining visible after account switching.
- Frontend regression assertions cover the layout, allowance presentation and account-refresh behavior. The isolated mock fixture records Free 5 and Premium 15; the earlier Premium completion-enforcement test was present in the preceding validation work.
- No database schema, allowance values or production data were changed by these presentation/account-refresh refinements.

### Correction to the earlier validation record

A source rollback incident was identified after the first attempted fix: a stale Git tree reference had caused older CSS and Daily Learning JavaScript to be restored, despite earlier commit-history inspection and a successful CI run. The earlier report that the five final visual changes were implemented was incorrect, and CI run #763 on commit `d1c9be67` did **not** validate the final five refinements.

The branch was corrected by updating the actual current file versions sequentially. The corrected implementation and regression assertions are in commit **`8c4c4949be68f2b372def13ce75c8ec67b67405e`**. Raw branch-file inspection confirmed the requested source changes before the owner was asked to retest.

### Final validation and merge

Both GitHub Actions runs below completed successfully against commit `8c4c4949be68f2b372def13ce75c8ec67b67405e`, with all three jobs passing in each run (Chromium browser regression, PostgreSQL 17 migration/allowance tests, and disposable local Supabase Auth compatibility):

- Run #771: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43571579491
- Run #772: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43571583586

Cloudflare's pull-request deployment status reported a successful preview deployment for commit `8c4c494`. The owner confirmed all five requested changes in the preview.

**PR #5 was merged into `main` on 2026-11-14 at 07:52:23 UTC.**
- PR: https://github.com/WhiteWingCat/swiftdictionary/pull/5
- Feature head: `8c4c4949be68f2b372def13ce75c8ec67b67405e`
- Merge commit and verified `main` HEAD: `3ca194f908356f85aed1c143c647ebf488e9a353`

### Privacy and release boundaries

- The final changes are presentation, account-refresh and mock-test changes; they add no personal-data fields, analytics, tracking or third-party content.
- No production Supabase migration or production data operation was run as part of this merge.
- The merge itself is not proof that the production database has been migrated or that the main-branch site deployment has completed. Verify the main-branch deployment and production schema separately before treating the live production service as fully released.
- Malaysia PDPA and general privacy planning remains applicable to future feature expansion; this update does not constitute a legal-compliance certification.

## 25. Update 2.3.1 — final approval, merge and recovery point (2026-11-14)

### Current project state

- Update 2.3.1 is approved by the owner and merged to `main`.
- PR #5 is closed as merged.
- Verified `main` HEAD: `3ca194f908356f85aed1c143c647ebf488e9a353`.
- The final feature commit is `8c4c4949be68f2b372def13ce75c8ec67b67405e`.
- The feature branch preview was deployed successfully for the final commit and manually accepted by the owner.
- CI runs #771 and #772 passed all three jobs on the final feature commit.
- Do not repeat the earlier incorrect CI #763 claim as validation of the final five layout refinements.

### Next development milestone

The next active milestone is **Update 2.4.0 — Quiz**:
- Dedicated Quiz experience.
- Quiz progress tracking.
- Quiz allowance integration using the established completion-based allowance principles.
- Preserve free dictionary search and account isolation.
- Before planning or implementing any new feature, perform the standing Malaysia-specific and general legal/privacy review. Re-check content licensing and data minimisation if the Quiz introduces new question content, answer telemetry or analytics.

Update 2.5.0 — Flashcards remains planned after Quiz. Proposed Update 2.6.0 — Legal, Privacy & Terms Foundation is deferred until after Flashcards is released to `main`. Do not treat any roadmap item as implemented until released.

### Release safeguards

1. Verify the main-branch hosting deployment independently; merge confirmation alone is not deployment confirmation.
2. Confirm production Supabase migration state read-only before proposing any production migration. No production migration or production data operation was performed in this session.
3. Do not initiate a production migration, destructive operation or additional deployment without explicit owner approval.
4. Continue using isolated mock identities for future browser tests; never use real user accounts or production data in automated tests.


## 26. Update 2.3.2 — Favorite Words course isolation hotfix and Daily Learning database diagnosis (2026-11-14)

### Owner request

The owner reported that most Update 2.3.1 features were available on the live website, but Daily Learning was waiting for a server database update. The owner also observed English and Simplified Chinese saved words appearing in the wrong Favorite Words category on the Dashboard. The owner requested a quick Update 2.3.2 hotfix and explicitly authorised merging it to `main` after validation.

### Production Supabase diagnosis — read-only

The connected SwiftDictionary Supabase project was healthy and running PostgreSQL 17.11.0.003. Its migration history ended at `20261110041007` (`swiftdictionary_update_2_2_0_reconciliation_baseline`). The 2.3.0 server migrations had not been applied.

Read-only schema checks confirmed the following were absent:
- `public.daily_activity_sessions`
- `private.learning_content_catalog`
- `private.learning_allowance_usage`
- RPCs `public.start_daily_activity_session`, `public.complete_daily_activity_session` and `public.get_my_learning_allowance_usage()`

The 2.3.0 server-side fields were also missing: daily activity preference flags and allowance-timezone fields on `user_preferences`, completion event fields on `learning_activity_log`, and the Daily Learning category rows in `learning_plan_limits`. The live limits table still had only `lesson`, `quiz` and `flashcard`.

This is the direct reason the live website reports that Daily Learning is waiting for the matching server database update. It is a production schema/migration gap, not a browser cache problem.

### Pending production migration sequence

The repository currently contains these 2.3.0 SQL drafts under `docs/`; they are not yet timestamped deployment files under `supabase/migrations/`:
1. Saved-words least-privilege hardening (independent, review before applying).
2. Approved learning content catalogue.
3. Completion-based allowance foundation.
4. Daily activity session foundation.
5. Separate current-window allowance ledger.
6. Learning-history deletion implementation.

The dependency order is important: the content catalogue precedes the allowance foundation; Daily Activity follows the allowance foundation; the ledger follows both allowance and Daily Activity; learning-history deletion follows allowance, Daily Activity and ledger. The drafts have passed the repository's disposable PostgreSQL 17 and local Supabase CLI compatibility workflows, but this is not a production migration.

No production migration, production SQL write, or production saved-word bulk update was executed in this session. Before changing production, create proper timestamped migration files, review the exact SQL and historical data backfill, verify backups/rollback strategy and apply in order only after explicit owner approval. Afterward, verify migration history, schema objects, RLS/grants, allowance RPC results and Daily Learning start/complete/resume/review behavior with synthetic test identities.

### Favorite Words root cause and fix

The Dashboard grouped saved words by the database `course` field, but the dictionary's in-memory saved-state set was keyed only by the word text. This allowed identical text values to share saved state across English and Chinese. The live `saved_words` table already had a `course` column, a unique key on `(user_id, course, word)`, and owner-scoped RLS policies. Read-only inspection also found legacy rows whose stored course did not agree with the script/catalogue; no word contents or user IDs were copied into the development record.

The Update 2.3.2 hotfix:
- Keys in-memory favorites by both course and word.
- Persists signed-out local favorites as explicit course/word pairs while accepting legacy string-only local entries.
- On a signed-in user's Dashboard load, identifies clearly classifiable legacy mismatches using Han-script code points and exact dictionary-catalogue membership.
- Repairs only the authenticated user's own rows: insert the correctly classified `(user_id, course, word)` row first, then delete the old course row. If insertion fails, preserve the original. Unknown entries are not guessed or moved.
- Uses the existing authenticated INSERT/DELETE permissions and RLS; it does not require a new schema migration or a privileged cross-user operation.
- Adds browser regression coverage for legacy mixed-course rows and static checks that course and word are both part of saved-state identity.

### Branch, CI and merge

- Branch: `hotfix/update-2-3-2-favorite-words-course-isolation`
- PR #6: https://github.com/WhiteWingCat/swiftdictionary/pull/6
- Final hotfix head: `b50f0cc7b6ec74b065342c1e953d2f6d85d44fcd`
- GitHub Actions run #774 passed all three jobs: 22 Chromium browser regression tests, PostgreSQL 17 migration/allowance tests, and disposable local Supabase Auth compatibility.
- An earlier run #773 exposed two test-harness issues (a strict locator assertion after adding multiple saved rows, and changed mock INSERT timing). Both were corrected; run #774 passed.
- PR #6 merged on 2026-11-14 at 08:10:27 UTC.
- Merge commit and verified `main` HEAD: `60904fb77fec0c3757e8aa1947439440954ae385`.
- Main GitHub Pages deployment workflow #43574533852 was queued immediately after merge. Verify its completion before describing the live site as updated.

### Privacy and legal-risk review

- No new personal-data fields, analytics, tracking, raw answer telemetry or third-party content were added.
- Favorite-word correction processes existing saved-word data within the authenticated user's own RLS scope. It does not collect additional information or inspect other users' word contents in the browser.
- Unknown saved entries are left unchanged rather than inferred. Insert-before-delete avoids losing a saved word if the first write fails.
- Malaysia PDPA and general privacy obligations remain applicable. The correction is a limited data-quality operation on existing user-owned records, not a new purpose or new data collection category. Review the privacy notice if future changes introduce broader profiling or analytics. This is planning guidance, not legal-compliance certification.
- Daily Learning's production migration remains separate and pending explicit owner approval. No production schema or data operation was performed here.

### Recovery point and next actions

1. Confirm GitHub Pages deployment #43574533852 completed successfully for merge commit `60904fb77fec0c3757e8aa1947439440954ae385`.
2. The Favorite Words hotfix is merged. After the new main deployment is live, the owner can refresh the site and open Dashboard; the signed-in account's clearly identifiable legacy saved-word course mismatches will be repaired on that Dashboard load.
3. Prepare the six Update 2.3.0 production migration files in the dependency order above, using proper Supabase-generated timestamps and preserving the tested SQL.
4. Before applying production migrations, present the exact migration list, data backfill effects, security/RLS changes and rollback/backup plan, then obtain explicit owner approval.
5. Verify production migration history and schema after approval; then retest Daily Learning start, resume, completion, review, timezone reset and Free/Premium allowance behavior.
6. Update 2.4.0 Quiz is the next feature after the 2.3.3 rollout; product decisions and technical specification are now final.

## 27. Update 2.3.3 — production Daily Learning database rollout and Dashboard Favorite Words details (2026-11-14)

### Owner request and release scope

The owner authorised preparing and applying the reviewed 2.3.0 database migrations to the live Supabase project and requested that the combined work be tracked as **Update 2.3.3**. The additional interface change is that selecting a saved Favorite Word from the Dashboard must open its expanded details without navigating to Dictionary.

### Production Supabase migration rollout

All six reviewed migrations were applied successfully to the live SwiftDictionary Supabase project on 2026-11-14 using the connected Supabase integration, in this dependency order:

| Migration version | Migration |
|---|---|
| 20261114082303 | `swiftdictionary_update_2_3_0_saved_words_privilege_hardening` |
| 20261114082311 | `swiftdictionary_update_2_3_0_learning_content_catalog` |
| 20261114082324 | `swiftdictionary_update_2_3_0_completion_based_allowance` |
| 20261114082328 | `swiftdictionary_update_2_3_0_daily_activity_sessions` |
| 20261114082332 | `swiftdictionary_update_2_3_0_current_window_allowance_ledger` |
| 20261114082335 | `swiftdictionary_update_2_3_0_learning_history_deletion` |

The exact SQL bodies are now recorded under `supabase/migrations/` with the same timestamp versions as the live migration history. Their statements match the reviewed drafts applied to production; migration-file headers identify them as applied source, not pending drafts. The six original review drafts remain in `docs/` as historical review artifacts.

### Preflight and post-migration verification

Before applying the migrations, read-only checks confirmed:
- Historical `lesson_progress` and lesson `learning_activity_log` rows reconciled one-to-one (13 rows in each project-wide relation at the time of preflight).
- No per-user historical count mismatches.
- No historical start-timestamp mismatches beyond the five-second tolerance.
- No duplicate practice-summary groups that would block the new uniqueness/summary rules.
- Required Supabase Auth session columns were present.

After applying the migrations, the production migration history listed all six versions. Schema verification confirmed:
- `public.daily_activity_sessions`, `private.learning_content_catalog` and `private.learning_allowance_usage` exist.
- Daily start, complete, allowance-usage and learning-history-deletion RPCs exist.
- Free permanent lessons = 5/day; proposed Premium permanent lessons = 15/day.
- Free daily Topic/Application/Discovery/Revision = 1 each/day; proposed Premium = 3 each/day.
- 161 approved catalogue rows are active.
- Historical completion reconciliation remains represented as 13 completed events.
- The migrations themselves created no daily sessions or current-window ledger rows.

Security/grant verification confirmed:
- `public.saved_words` retains RLS and its three existing owner-scoped policies.
- Anonymous SELECT is denied; authenticated SELECT/INSERT/DELETE are allowed; authenticated UPDATE is denied.
- Authenticated users cannot directly SELECT the private catalogue or allowance ledger.
- Authenticated users can execute the intended Daily Activity, allowance read and own-history deletion RPCs.

The post-migration Security Advisor reported INFO findings for private tables with RLS enabled and no policies (intentional deny-by-default private tables), WARN findings for authenticated execution of two SECURITY DEFINER RPCs (including the new authenticated practice-summary RPC, which checks `auth.uid()` and is intentionally exposed to signed-in callers), and the existing Auth leaked-password-protection setting. These notices were not silently expanded into unrelated changes. Review the advisor again if the security model changes.

No production test account, synthetic user, or test session was inserted. No personal saved-word contents were copied into the development record. The current-window ledger remains private and stores category-level counts, not per-word or answer-level telemetry.

### Update 2.3.3 Dashboard Favorite Words detail behavior

- Branch: `feature/update-2-3-3-dashboard-favorite-details`.
- PR #7: https://github.com/WhiteWingCat/swiftdictionary/pull/7.
- Current recorded feature head at archive time: `b09f10aa1fa22ea3ba4209408758cb2325eba4ae`.
- Selecting an English or Chinese saved word opens the existing expanded detail drawer while the Dashboard page remains visible.
- Previous/next dictionary navigation controls and arrow-key navigation are suppressed while a Dashboard favorite is open; normal dictionary modal behavior is restored after closing.
- Closing the drawer returns focus to the originating Dashboard favorite when it remains in the document.
- A legacy saved row absent from the current dictionary catalogue remains on the Dashboard and receives a status message; it is not silently redirected to Dictionary or guessed.
- A new Chromium browser regression covers both English and Simplified Chinese favorites and verifies Dashboard remains visible.

### Validation and deployment state

- GitHub Actions run #775 passed PostgreSQL 17 migration/allowance tests, Chromium browser regression tests (including the new Dashboard favorite detail test), and disposable local Supabase Auth compatibility.
- GitHub Actions run #780 passed all three jobs on final branch head `b09f10aa1fa22ea3ba4209408758cb2325eba4ae`: PostgreSQL 17 migration/allowance tests, Chromium browser regression and disposable local Supabase Auth compatibility.
- Cloudflare Pages reported a successful branch preview build for final PR head `b09f10a`: https://feature-update-2-3-3-dashboa.swiftdictionary-testing.pages.dev.
- PR #7 was squash-merged into `main` as commit `90dc73a9b65fc3af713fefab4955057026089b96` on 2026-11-14 at 08:38:54 UTC. Main GitHub Pages deployment run #79 (`43576812434`) completed successfully at 08:39:35 UTC. Update 2.3.3 frontend and the six database migrations are now live. The owner should refresh the live site and test Daily Learning start/resume/completion/allowance behavior and Dashboard favorite details.

### Privacy and legal-risk review

The rollout uses the already reviewed data model: stable approved content identifiers, completion event metadata, per-category allowance counts and user-owned daily sessions. The catalogue does not store question text or answers; the allowance ledger does not store word IDs or answer-level events. No new tracking, third-party content or payment functionality was introduced. Saved-word least-privilege grants were tightened without removing owner-scoped RLS.

Malaysia PDPA and general international privacy obligations remain relevant to account-linked preferences and learning records. The current change does not add new personal-data categories. Review privacy notices and cross-border processing disclosures before future monetisation or broader analytics. This is planning guidance, not legal advice or a compliance certification.

### Recovery point and next actions

1. Owner refreshes the live website and tests Daily Learning start/resume/completion/allowance behaviour.
2. Owner tests English and Simplified Chinese Dashboard Favorite Word details, including close/return focus, on desktop and mobile.
3. Record any production-only bugs as a small 2.3.3 follow-up patch if needed.
4. Proceed with Update 2.4.0 Quiz implementation on a dedicated branch after the final source/schema checks.


## 28. Update 2.4.0 — Quiz planning and multilingual learning/translation rules (2026-11-14)

### Planning status

Update 2.4.0 Quiz is in product-planning only. No Quiz frontend, question bank, schema migration, allowance configuration, production data change or deployment has been implemented or authorised by this planning discussion. Preserve the existing Coming Soon state until implementation is separately approved and validated.

### Owner-confirmed Quiz product decisions

- Quiz is an assessment experience, distinct from Lessons: Lessons teach knowledge; Quiz tests knowledge learned through the lesson curriculum.
- Quiz tests vocabulary knowledge and definitions (for example, asking for the definition of “Ability”), and may use independently authored questions based on lesson knowledge.
- Quiz questions must not be direct one-to-one copies of Lesson practice questions. Quiz must have its own question wording, answer choices and distractors while assessing related knowledge.
- No user-facing Quiz topic/category selection is required. Questions are drawn from mixed topics within the selected difficulty. Internal topic and lesson metadata remains necessary for progress analysis and Dashboard recommendations.
- One difficulty is selected per quiz session:
  - Beginner: 10 questions.
  - Intermediate: 15 questions.
  - Advanced: 20 questions.
- Question difficulty and eligibility must be aligned with the relevant lesson curriculum, avoiding assessment of knowledge outside the learner's applicable course scope. **Eligibility mode: curriculum** — draw from all approved curriculum lessons within the selected difficulty, regardless of whether the individual learner has personally completed each lesson. Do not draw from unapproved or out-of-scope content. Difficulty composition is now owner-defined: Beginner = 100% Beginner; Intermediate = either 50% Intermediate / 50% Beginner or 80% Intermediate / 20% Beginner; Advanced = 60–80% Advanced, exactly 20% Intermediate and 0–20% Beginner. The selected proportions must total 100%. Higher-level quizzes may include lower-level material, never the reverse.
- Update 2.4.0 uses multiple-choice questions only. Fill-in-the-blank is deliberately deferred to a later update until flexible answer evaluation can be designed reliably.
- Answer options are randomly arranged. Randomisation should be fixed for the lifetime of a quiz session so that resuming or navigating does not unexpectedly reorder options.
- No correct-answer reveal, correctness feedback or result disclosure before the learner submits the completed quiz. Wrong answers are included in the results. **Answer navigation: change** — learners may navigate between questions and revise their selections any time before final submission. After submission, answers are locked and the result is immutable.
- Completed results must include all questions, the learner's selected answers, correct answers and explanations.
- Quiz feedback and explanations follow the user's selected translation language.
- Unfinished quiz progress is saved and can be resumed. Only one quiz may be in progress for an account at a time; a learner cannot start another while one remains active.
- Free plan: one completed quiz per local day. Proposed Premium plan: three different completed quizzes per local day. Only successful submission/completion consumes an allowance; abandoning or resuming does not. Reviewing a completed quiz is free and does not count as a retake.
- Completed quizzes can be reviewed, but cannot be retaken. Review is read-only.
- Quiz results should inform Dashboard learning recommendations and weak-topic prioritisation for relevant Lessons/Daily Revision. Avoid treating one quiz result as definitive mastery.
- Visual direction: clean, organised layout; question text in bold white; answer cards arranged adaptively in a row or two columns when answer text is sufficiently short, otherwise use a readable wider layout.
- **Timer: none.** Quiz has no countdown, time limit or time-pressure mechanic, consistent with the Lessons experience.

### Multilingual course and translation architecture — standing future rule

This is a cross-feature, long-term product rule for every language added to SwiftDictionary, not a Quiz-only requirement:

- Keep **learning course language** and **selected translation language** as distinct settings and inputs.
- The learning course determines the knowledge, vocabulary, curriculum and source language being taught or assessed.
- The selected translation language determines the language used for translations, explanations, feedback and other learner-support content where appropriate.
- Content must be authored or adapted for the actual learning-course/translation-language combination. Do not assume that translating or swapping labels on one language pair is sufficient.
- For translation-assessment questions, ask in the learning course language and provide answer choices in the selected translation language where that is the learning objective. Example: English course + Chinese translation may ask “What is the Chinese translation of ‘Ability’?” with Chinese answer choices.
- For ordinary knowledge/definition questions, retain the learning course language for the question and answer choices unless the question is specifically testing translation; provide explanations and feedback in the selected translation language.
- Explanations and feedback must follow the selected translation language, as explicitly confirmed by the owner.
- Apply this design consistently across Lessons, Quiz and Flashcards when Chinese becomes a full learning course, and to every additional language introduced in future. Support combinations in both directions where the product offers them (for example, Chinese learning with English translation as well as English learning with Chinese translation).
- Avoid ambiguous translation keys. Where a source word has multiple senses, tie the question and accepted answer(s) to the intended sense/context.
- Persist the course and translation language combination with an active learning session so a preference change does not silently mutate an in-progress session. A new session should use the newly selected preferences.
- Question/content catalogues should identify supported course and translation language pairs and retain stable links to the relevant lesson/topic concepts. Do not expose internal topic metadata as a required user-facing category system.

This rule is a future architecture requirement. It does **not** mean a full Chinese learning curriculum is part of Update 2.4.0. The current Quiz scope must be explicitly limited to the language/course combinations whose content is actually available and reviewed.

### Remaining design and implementation questions

Before implementation, settle:
1. How to handle an unfinished active session across a daily allowance reset, content retirement or a change in course/translation preferences — session persistence and abandonment are resolved in Section 31; content retirement and preference snapshots remain subject to the existing versioning/language-pair rules.
2. Whether results include a pass threshold or only score, percentage and per-question review — resolved in Section 31: score and percentage only; no pass/fail threshold.
3. Exact daily quiz uniqueness/allowance enforcement, including prevention of duplicate or cloned sessions while allowing resume and read-only review.
4. Which result fields are required to reproduce completed reviews if catalogue content changes. Prefer storing stable question/version references and the minimum answer/result snapshot needed for review.
5. How question selection guarantees a balanced enough curriculum sample despite mixed-topic random selection and limited eligible content — minimum question-bank availability gates are approved in principle; numeric thresholds must be set from the approved content inventory and validated before a difficulty is enabled (Section 31).

### Data, security and legal planning notes

- Reuse the established completion-based allowance principles, but inspect the live `learning_plan_limits`, activity categories, RPCs and private allowance ledger before designing or applying Quiz-specific configuration. Do not assume that the existing presence of a `quiz` activity type means daily Quiz limits are already configured.
- The existing personal testing exemption is lesson-only. Do not extend it to Quiz without explicit owner approval.
- Enforce one-active-session-per-account and ownership checks server-side; do not rely only on browser state.
- Do not reveal correct answers or answer keys to the browser before final submission. Evaluate submissions through a trusted server-side path.
- Preserve sufficient versioned result information for read-only review while minimising stored personal data. Align Quiz history with the existing learning-history deletion model and ensure deletion does not accidentally reset allowance ledgers.
- Keep account isolation, shared-device account switching, timezone-based midnight reset and free dictionary search intact.
- Perform the mandatory Malaysia PDPA and international privacy review before implementation. Review content licensing/originality, retention and deletion, security, age-related obligations and cross-border processing as relevant. This is planning guidance, not legal advice or a compliance certification.


## 29. Update 2.4.0 — confirmed Quiz interaction decisions and global language-refresh QA rule (2026-11-14)

The owner confirmed the remaining interaction choices for the Quiz implementation plan:

- **Lesson eligibility: curriculum.** The quiz may sample all approved lessons/content within the selected difficulty, whether or not the learner has personally completed each lesson. It must not include unapproved material or content outside the selected difficulty's curriculum. The owner-defined cross-level question ratios are recorded in Section 30.
- **Timer: none.** There is no countdown or time limit.
- **Answer navigation: change.** Learners may navigate between questions and change their selected answers until they submit the complete quiz. After submission, answers are locked and the completed result is read-only.

### New standing course/translation refresh and QA rule

This rule applies across SwiftDictionary, not only Quiz:

- Whenever a user changes either the learning-course selection or translation-language selection, the relevant page and all dependent content must refresh to the newly selected state. The user must not need to navigate away and back to see the change.
- Verify that controls, page content, question/lesson text, answer choices where language-dependent, explanations, feedback, labels, status text and other dependent UI update consistently. No stale language or mixed-language remnants should remain.
- Test both course and translation selectors, switching between available values and switching back, including while viewing relevant learning content.
- Verify translation quality, not just refresh mechanics: content must be accurate, complete, context-appropriate and correct for the selected course/translation pair. A language label changing or only some strings updating is not sufficient.
- Persisted preferences and active-session snapshots must remain coherent: a new session uses the new selection; an existing in-progress session retains the course/translation pair it started with unless the product explicitly provides a safe, tested transition.
- Add explicit refresh and translation-quality checks to the regression suite for Lessons, Quiz, Flashcards and future language-aware features.

### Scope and implementation status

These are planning and QA requirements only. No application source, question content, migration, production database setting or live deployment was changed in this session. The next implementation phase still requires explicit owner authorisation, a feature branch, source/schema inspection, and the mandatory Malaysia/international legal and privacy review.

### Recovery point

- Documentation branch: `docs/master-development-record`.
- Production baseline remains Update 2.3.3; merge commit `90dc73a9b65fc3af713fefab4955057026089b96`.
- Quiz remains unimplemented; the existing Coming Soon state must remain until a separately approved and validated release.


## 30. Update 2.4.0 — owner-defined difficulty composition (2026-11-14)

The owner confirmed the curriculum difficulty mix for Quiz. A higher-difficulty quiz may include lower-difficulty curriculum material as reinforcement, but a lower-difficulty quiz must not include higher-difficulty material.

| Selected Quiz difficulty | Approved question composition |
|---|---|
| Beginner | 100% Beginner |
| Intermediate | Either 50% Intermediate / 50% Beginner or 80% Intermediate / 20% Beginner. These are the two approved mixes. |
| Advanced | 60–80% Advanced, exactly 20% Intermediate, and 0–20% Beginner. |

All percentages for an individual quiz must total 100%. Question counts are fixed by the existing plan (Beginner 10, Intermediate 15, Advanced 20). For a 15-question Intermediate quiz, 80/20 maps exactly to 12 Intermediate and 3 Beginner questions; 50/50 cannot be represented exactly with an odd count, so use a balanced 7/8 split and alternate which level receives 8 across quizzes to avoid systematic bias. For a 20-question Advanced quiz, 4 questions are Intermediate and 0–4 are Beginner, with the remaining 16–12 questions Advanced (80/20/0 through 60/20/20). Beginner remains 10 Beginner questions. The implementation must never silently produce a ratio outside the approved compositions. The question bank must contain enough approved questions at each source difficulty to satisfy the selected composition; if it does not, the system should not quietly substitute out-of-scope questions.

This resolves the previously open question about cumulative difficulty composition. It does not change the separate rule that questions may come from all approved curriculum lessons within the selected difficulty scope regardless of the learner's personal lesson-completion history.

No application implementation, question-bank content, migration, production data or deployment was changed by this planning decision.


## 31. Update 2.4.0 — approved final pre-development decisions (2026-11-14)

The owner explicitly approved the following three decisions to close the remaining product-level questions before Quiz development:

### Scoring: score and percentage, no pass/fail

- A completed Quiz displays the raw score (for example, 12/15) and percentage.
- Do not assign a pass/fail status, passing grade or pass threshold in Update 2.4.0.
- Retain per-question review with the learner's selected answer, correct answer and explanation, as already specified.
- Results may inform topic-level revision recommendations, but must not be represented as a pass/fail judgement or definitive proof of mastery.

### Unfinished-session persistence: no automatic expiry

- Preserve an unfinished Quiz session until the learner completes it or explicitly abandons it.
- Do not expire or discard an unfinished session solely because the user's local daily allowance window resets.
- Resuming an existing session remains free and must not consume another Quiz allowance.
- Explicit abandonment releases the account's single-active-session slot and does not consume an allowance.
- Preserve the session under its owning account; signing out or switching accounts must not transfer or expose it to another account.
- Retain the session's original difficulty, question order, fixed answer-option order and course/translation language pair when resumed.
- Content retirement or catalogue updates must not silently mutate an active session; use stable/versioned question references or an equivalent reviewed snapshot strategy.

### Question-bank availability: minimum content gate

- A difficulty must not be presented as available or allowed to start a Quiz until its approved question bank meets a defined minimum-content requirement.
- Availability checks must account for the complete session length, approved difficulty composition, distinct-question selection, curriculum/topic coverage and the supported course/translation language pair.
- The system must detect insufficient eligible content before session creation. It must not silently lower the session length, violate the approved ratios, reuse a question within the same session, or substitute out-of-scope content.
- The numeric minimum bank size is not yet fixed. Set it after inspecting the approved question inventory and sampling/reuse policy; document and test the chosen threshold before enabling each difficulty. If a difficulty fails the gate, clearly mark it unavailable or otherwise prevent starting it with a clear user-facing explanation.
- Adding content or approving a new language pair may make a previously unavailable difficulty eligible, but availability must be re-evaluated against the same gate.

### Planning status and recovery point

- These decisions complete the three product-level items raised in the pre-development review.
- Remaining work is technical specification and evidence-based content threshold setting, followed by source-code and Supabase inspection, legal/privacy review, implementation and validation.
- No application source, question bank, Supabase schema/migration, production data, allowance setting or deployment was changed by this approval.
- Production remains Update 2.3.3 (main merge commit `90dc73a9b65fc3af713fefab4955057026089b96`). Quiz remains Coming Soon.
- Documentation branch: `docs/master-development-record`.


## 32. Update 2.4.0 — technical preparation and read-only architecture inspection (2026-11-14)

### Preparation status

The owner asked to proceed to the next stage after approving the Quiz scoring, unfinished-session persistence and minimum question-bank availability principles. The technical specification is recorded at \`docs/UPDATE-2.4.0-QUIZ-TECHNICAL-SPECIFICATION.md\`; the session archive is \`docs/conversation-archive/2026-11-14-update-2-4-0-quiz-technical-preparation.md\`.

This is technical preparation only. No implementation branch was created and no application source, Quiz question bank, schema, migration, production allowance setting, production user data or deployment was changed.

### Current repository and curriculum findings

- Production/main baseline remains Update 2.3.3, merge commit \`90dc73a9b65fc3af713fefab4955057026089b96\`.
- The static app's main UI and most application logic remain in \`index.html\` (approximately 932 KB / 18,530 lines at inspection); Daily Learning is in \`daily-learning.js\`. Existing Playwright, mock-testing and SQL regression infrastructure can be extended.
- Quiz navigation and route exist, but Quiz is still Coming Soon.
- The current Lessons curriculum is English learning with Simplified Chinese translations. It contains 15 lessons and 52 Lesson practice questions: Beginner 5/18, Intermediate 5/17 and Advanced 5/17.
- No Quiz question bank, Quiz session table or Quiz RPC exists in production. There are zero approved Quiz questions. The Lesson practice bank is not a substitute for the separate Quiz bank. All Quiz difficulties remain unavailable until new approved Quiz content meets the availability gate.
- A full Chinese-learning Quiz is outside 2.4.0 because the current permanent Lessons curriculum is English learning with Chinese translations, not a Chinese-learning curriculum.

### Supabase architecture findings

Read-only inspection of the connected SwiftDictionary project confirmed PostgreSQL 17.11 in Tokyo (\`ap-northeast-1\`) and 18 applied migrations, including the six Update 2.3.0 migrations.

Existing foundations that can be reused:
- \`learning_activity_log\` and its activity constraint already include Quiz.
- \`private.learning_allowance_usage\` already supports Quiz.
- The server-side activity insert trigger charges only completed events, uses the effective server-owned timezone and plan, serialises per-user completion and updates the private allowance ledger atomically.
- The personal testing exemption is explicitly lesson-only and must not extend to Quiz.
- Existing Daily Learning sessions enforce one open session per user/category and use their own rollover behaviour. Quiz needs one active session per account and indefinite persistence; do not reuse the Daily Learning session model unchanged.
- The existing learning-history deletion implementation must be extended to delete Quiz session/answer/review history while preserving the separate allowance ledger.

**Live Quiz allowance mismatch:** production currently contains Free 5/day and Premium 12/day. The planning target is Free 1/day and proposed Premium 3/day. These values do not match. No live setting was changed; a reviewed migration and explicit owner approval are required before enabling Quiz.

### Technical direction proposed

- Private, versioned Quiz question bank with stable question, lesson and topic identifiers.
- Prefer a dedicated `quiz.js` frontend module with a narrow explicit bridge to the existing inline app state, avoiding further growth of the large `index.html` file.
- Private session/question snapshots that preserve question version, fixed order, fixed option order, selected answer, correct answer and explanation.
- Server RPCs for availability, start, resume, save answer, submit, abandon and completed review.
- Correct answer keys stay server-side until submission. Evaluation, score calculation, session completion and allowance charge occur atomically.
- One-active-session-per-account database constraint; explicit abandonment frees the slot without charge.
- Completion charges the current local allowance window at submission time, including a session resumed after midnight.
- Supported course/translation pairs must have authored and reviewed content. For 2.4.0, English learning is the supported curriculum; Chinese learning remains future scope.
- Dashboard/Daily Revision use topic-level performance without treating a single wrong answer as definitive mastery.

### Question-bank threshold proposal

The production Quiz bank currently contains zero questions. The technical specification proposes a two-session minimum pool of 20 Beginner; 24 Intermediate + 16 Beginner; and 32 Advanced + 8 Intermediate + 8 Beginner. A three-session pool is proposed as a future Premium quality target if three quizzes/day and same-day non-reuse are confirmed.

These are not yet owner-approved numeric thresholds. The final availability gate depends on confirmation of the cross-session question-reuse policy and Premium allowance. It must also enforce exact source-difficulty ratios, at least three topic IDs per session as a proposed starting rule, no topic supplying more than 40% of a session, and complete reviewed language-pair content.

### Legal and privacy planning

Quiz introduces account-linked selected answer IDs, question snapshots, scores and topic performance. The current privacy-policy draft says individual selected answers are not stored; it must be revised before release if the approved Quiz design stores selected options.

The technical specification records a preliminary Malaysia Act 709/2024 amendment review, JPDP cross-border transfer/DPO/DPIA guidance, GDPR territorial/child-consent scope and US COPPA considerations. Specific release gates include determining Act 709 applicability to the actual public-service activity, identifying the controller and privacy contact, bilingual privacy notice, cross-border processor/location assessment, DPO/DPIA screening for systematic learning-performance monitoring, retention/deletion and breach-response procedures. This is planning guidance, not legal advice or compliance certification.

### Remaining owner confirmations

1. Four answer options where strong distractors exist, with three allowed rather than adding a weak fourth.
2. Whether same-day repeats across separate completed sessions should be prohibited.
3. Approve or revise the proposed two-session hard minimum and three-session Premium quality target.
4. Confirm the proposed Premium Quiz allowance of 3/day; production currently has 12/day.
5. Confirm nearest-integer percentage rounding.

### Recovery point

- Production remains Update 2.3.3, merge commit \`90dc73a9b65fc3af713fefab4955057026089b96\`.
- Documentation branch: \`docs/master-development-record\`.
- Quiz remains Coming Soon.
- No implementation branch or production change has been made. Wait for owner review of the technical specification and remaining choices before starting feature implementation.


## 33. Update 2.4.0 — final product decisions and implementation authorisation (2026-11-14)

### Owner-confirmed final decisions

The owner confirmed all remaining Quiz pre-development decisions:

- Exactly **four answer options** per question. Every approved question must have one correct answer and three strong, plausible distractors; weak or ambiguous questions must be rejected rather than published with fewer options.
- Do not repeat a question for the same account within the same effective local allowance day, across all Quiz sessions and difficulty levels.
- Do not repeat the same complete quiz sequence within the same day. The individual-question non-reuse rule also prevents this.- A started session reserves all questions issued to it for that local day, even if the learner later abandons it. Abandonment remains free and does not consume a completion allowance.
- Minimum question-bank capacity: **two complete sessions** per selected difficulty. Preferred target: **three complete sessions** per selected difficulty.
- Free Quiz allowance: **1 completed Quiz per local day**.
- Premium Quiz allowance: **3 completed Quizzes per local day**. The 1:3 ratio is confirmed and supersedes the earlier conceptual example.
- Display percentage rounded to the nearest whole percentage, while retaining exact score and question-count integers.

### Approved question-bank capacity

| Selected difficulty | Two-session minimum | Three-session target |
|---|---|---|
| Beginner | 20 Beginner | 30 Beginner |
| Intermediate | 24 Intermediate + 16 Beginner | 36 Intermediate + 24 Beginner |
| Advanced | 32 Advanced + 8 Intermediate + 8 Beginner | 48 Advanced + 12 Intermediate + 12 Beginner |

The counts support non-overlapping sessions at each selected difficulty and are based on the largest source-difficulty counts permitted by the approved composition rules. Because lower-difficulty questions can be used in higher-difficulty quizzes, the question pools are shared. The server must exclude all questions already issued to that account on the current effective local day, across difficulty levels. If the remaining unseen inventory cannot support a complete session with the exact composition and coverage rules, the system must block the start rather than repeat or substitute questions.

The three-session target is aligned with Premium's three-completion daily allowance. It is a capacity target per selected difficulty, not a guarantee that every arbitrary mix of difficulty sessions remains possible after lower-level pools have been used. The availability operation must assess the remaining pool before creating each session.

### Technical specification and current implementation baseline

The technical specification at `docs/UPDATE-2.4.0-QUIZ-TECHNICAL-SPECIFICATION.md` has been updated to replace all prior open decisions and proposal wording with the confirmed rules.

Read-only inspection of the connected live Supabase project reconfirmed:

- PostgreSQL 17.11, region Tokyo (`ap-northeast-1`).
- 18 applied migrations through the six Update 2.3.0 migrations.
- Existing activity log and private allowance ledger already accept the `quiz` activity type.
- Current production Quiz limits remain Free 5/day and Premium 12/day. These are not changed; a reviewed migration is required to set Free 1/day and Premium 3/day before Quiz is enabled.
- No Quiz question-bank table, session table, Quiz RPC or approved Quiz question exists.
- Existing completion allowance trigger uses the server-owned effective timezone and plan and charges only completed activity events.
- Existing personal testing exemption remains lesson-only and must not extend to Quiz.
- Learning-history deletion currently removes Daily Learning sessions, Lesson practice summaries, Lesson progress and activity log. Quiz session/history deletion must be added while preserving the private allowance ledger.
- Main's Quiz page remains a Coming Soon placeholder. Existing Lesson practice content is not a substitute for the independent Quiz question bank.

No production schema, allowance values, user data, application source or deployment was changed during the read-only inspection.

### Legal and privacy roadmap clarification

The existing privacy-policy draft prepared during Update 2.3.0 is not approved for publication and will need revision to reflect Quiz answer selection, score, session snapshots, topic performance and retention/deletion. This release still requires the mandatory Malaysia and international privacy review.

The owner also raised a broader legal-documentation update. Record this as a **proposed Update 2.6.0 — Legal, Privacy & Terms Foundation**, to begin only after Update 2.5.0 Flashcards has been released to `main`. Candidate scope includes Terms of Service/Use, Privacy Notice, data collection and user-rights disclosures, content and third-party licensing, educational disclaimers, acceptable use, service availability and (if monetisation is later introduced) subscription, payment, renewal, cancellation and refund terms. Scope and legal applicability must be researched and approved closer to that release. This is a planning item, not a legal opinion or compliance certification.

### Recovery point and next actions

1. The owner has authorised the recommended Update 2.4.0 sequence to proceed.
2. Keep documentation changes on `docs/master-development-record`.
3. Create the Quiz implementation branch from the current `main` head, not from a stale feature branch.
4. Implement and test question-bank/session/allowance foundations in isolation. Do not apply production migrations, change live allowance values, merge or deploy without explicit owner approval.
5. Keep Quiz difficulties unavailable until the independent question bank meets the hard two-session threshold and passes content review.
6. Continue preserving the Coming Soon production state until the Quiz release is validated and explicitly approved.


## 34. Update 2.4.0 — Quiz question-bank and database foundation (2026-11-14)

### Implementation status

The owner declined the estimated hourly cost of a hosted Supabase development branch. No paid branch was created. The database foundation was implemented on `feature/update-2-4-0-quiz` and validated using an ephemeral PostgreSQL 17 service container in GitHub Actions.

Files added to the feature branch:

- `supabase/migrations/20261114120000_swiftdictionary_update_2_4_0_quiz_question_bank_foundation.sql`
- `supabase/tests/quiz_question_bank_foundation.sql`
- `.github/workflows/quiz-db-foundation.yml`

The migration adds three private tables: versioned bilingual question bank, account-scoped Quiz sessions, and issued-question/session snapshots. It enforces four unique answer-option IDs with bilingual text, a valid correct option, question revision approval lifecycle, difficulty-specific question counts, one active session per account, immutable issued question identity/snapshots, mutable answer selection before submission, and a unique account/local-day/question constraint that blocks same-day reuse across sessions and after abandonment. RLS is enabled and direct `anon`/`authenticated` table access is revoked.

### Validation

GitHub Actions workflow **Quiz database foundation**, run #7, completed successfully on PostgreSQL 17.12:

- Migration applied successfully.
- Private tables and RLS flags verified.
- Direct table privilege revocation verified.
- Valid bilingual four-option question approved and timestamp assigned.
- Three-option and duplicate-option questions rejected.
- Shuffled option-order permutation validation passed.
- Answer changes before submission passed.
- Re-issuing the same question to the same account on the same local day after an abandoned session was rejected.
- Test transaction rolled back; the ephemeral database container was destroyed.

The first CI attempt found an option-ordering bug in the question validation trigger. It was fixed, then the next run found the test fixture needed a synthetic `auth.users` row. Both were corrected; the final run passed. The existing 2.3.x PostgreSQL migration/allowance regression job also passed on the same branch push. Other concurrent regression jobs were still running at the time of this record.

### Validation boundary

This no-cost workflow tests PostgreSQL DDL, constraints, triggers, role grants and core same-day uniqueness. It bootstraps minimal Supabase-compatible `auth.users`, `public.languages`, `anon` and `authenticated` objects. It does not prove full Supabase Auth, PostgREST, JWT, RLS policy or platform RPC integration. Use a disposable local Supabase CLI stack (Docker) if those behaviours need platform-level validation; do not create a paid hosted branch unless the owner later explicitly approves the cost.

### Current safety boundary

- No production Supabase migration was applied.
- At the time of section 34 (2026-11-14), production Quiz allowance was Free 5/day and Premium 12/day. It was subsequently updated on 2026-11-16 to Free 1/day and Premium 3/day; see section 36.
- No Quiz content has been approved or seeded. All difficulties remain unavailable.
- No live user data changed.
- No merge or deployment occurred.
- Draft PR #8 is open for validation only: https://github.com/WhiteWingCat/swiftdictionary/pull/8. Do not merge it yet.

### Next implementation stage

Proceed with authenticated, narrowly scoped Quiz RPCs and server-side selection/availability logic. They must enforce the approved source-difficulty ratios, question-bank minimum/target counts, account-local-day question reservation, one active session, session resume/abandon semantics, answer changes before submission, server scoring, completion-based allowance charging, and completed read-only review. Extend learning-history deletion for Quiz data without deleting the private allowance ledger. Keep production Quiz hidden until content minimums and all integration/security checks pass.



## 35. Update 2.4.0 — authenticated Quiz RPC implementation (2026-11-14)

The next backend stage has been implemented on feature/update-2-4-0-quiz. The new migration is supabase/migrations/20261114160000_swiftdictionary_update_2_4_0_quiz_authenticated_rpcs.sql. It adds authenticated-only availability, start/resume, answer-save, submit, abandon, history and review RPCs, and extends the existing learning-history deletion path to include Quiz sessions.

The implementation enforces the approved difficulty composition rules, two-session minimum bank gates and three-session target gates; selects only approved questions mapped to active permanent lessons with matching topics; randomizes and snapshots question/option order; enforces at least three topics and a 40% per-topic cap; and excludes same-day reserved questions. Intermediate and Advanced compositions are selected only from ratios that the remaining unseen pool can satisfy.

One unfinished session per account is enforced. Unfinished sessions persist without a timer until completion or explicit abandonment. Answers can be changed before submission. Submission requires all answers, calculates score and rounded percentage server-side, and charges the existing quiz completion allowance through the existing learning_activity_log trigger. Repeated submission is idempotent. Correct answers and explanations are hidden until completion.

Security uses auth.uid()-derived ownership, non-exposed private SECURITY DEFINER implementations with fixed empty search_path, public SECURITY INVOKER wrappers, RLS, and revoked direct table access. No user ID is accepted from the client. A separate private.quiz_daily_question_reservations ledger preserves same-day no-repeat after history deletion; it stores only user ID, local date, question ID and reservation time, and is cleaned after a conservative 36-hour window. Learning-history deletion removes sessions, snapshots and completion events but retains the daily allowance ledger and temporary no-repeat reservations. This behaviour must be disclosed in the Privacy Notice before public release.

Validation is implemented in .github/workflows/quiz-db-foundation.yml:
- Disposable PostgreSQL 17 job applies both Quiz migrations and runs SQL assertions for constraints, availability, selection, answer handling, session lifecycle, scoring, allowances, deletion, ownership and privileges.
- Disposable local Supabase job uses the real local Auth schema/JWT helpers, the existing synthetic SwiftDictionary baseline, the 2.3.x prerequisite migrations, both Quiz migrations, authenticated integration tests and Supabase security advisors.
- Both Quiz validation jobs passed on workflow run 66 (2026-11-14). The companion 2.3.x PostgreSQL and Chromium regression checks also passed. A final extra access-control assertion for the reservation table was committed afterward and its follow-up workflow is pending at the time of this record update.

No paid hosted Supabase branch was created. All local Supabase services ran in disposable GitHub Actions containers. At the time of this 2026-11-14 implementation stage, no production migration, production allowance change, merge or deployment had been performed.

Production Quiz allowance was updated on 2026-11-16 by tracked Supabase migration 20261116043139 to Free 1/day and Premium 3/day; the live rows were verified. No other activity limits or usage records were changed. The Quiz schema/RPC migrations and question content remain unapplied to production. The question bank has no approved production questions, and the Quiz frontend is not implemented, so all difficulties remain unavailable. Draft PR #8 remains open and must not be merged without explicit approval.

Preliminary Malaysia privacy review: Quiz stores account-linked answer selections, question/topic/lesson references, scores, timestamps and timezone. Adaptive weak-topic prioritisation may require assessment under the Commissioner's 2026 Automated Decision-Making and Profiling Guideline and the DPO regular/systematic-monitoring criterion. Before release, review Privacy Notice retention/deletion wording, DPO/DPIA requirements, 2026 data-controller registration classes, section 129 cross-border transfers, subprocessors and global age rules. The dedicated Terms and Legal update remains after Flashcards is released to main. See section 13.8 of the Quiz technical specification for official JPDP references and detail.

Next implementation work: build the question-bank authoring/import/approval pipeline and populate sufficient reviewed content, then integrate the Quiz frontend and browser tests. Production migration and release remain separate approval gates.


## 36. Update 2.4.0 — Quiz authoring pipeline and production allowance update (2026-11-16)

The user authorized the next Quiz content stage and explicitly requested changing the live Supabase Quiz allowance to Free 1/day and Premium 3/day.

### Production allowance change

Before the change, the live project had exactly two enabled Quiz rows: Free 5/day and Premium 12/day.

A guarded, narrowly scoped migration was added on the feature branch:
- `supabase/migrations/20261116043139_swiftdictionary_update_2_4_0_quiz_allowance_1_3.sql`

It verifies the exact expected pre-change values and aborts if unexpected Quiz rows or values exist. It changes only the Quiz rows in `public.learning_plan_limits`; all other activity limits and usage ledgers remain untouched.

The migration was applied to live Supabase and recorded as version `20261116043139`, name `swiftdictionary_update_2_4_0_quiz_allowance_1_3`. A follow-up query verified Free Quiz 1/day and Premium Quiz 3/day, both enabled.

No Quiz schema/RPC tables, question content, sessions or frontend were deployed to production. No user data or usage-ledger rows were modified.

### Question-bank authoring pipeline

New feature-branch files:
- `content/quiz/README.md` — authoring, editorial review, approval and release policy.
- `content/quiz/curriculum-map.en.json` — stable mapping of 15 English source lesson IDs to topics and difficulty.
- `content/quiz/questions.en-zh.draft.json` — bilingual draft bank.
- `scripts/quiz/validate-question-bank.mjs` — structural/curriculum validator and draft-only SQL exporter.
- `supabase/tests/quiz_draft_content_catalog.sql` — isolated local curriculum fixtures.
- `supabase/tests/quiz_draft_content_import_assertions.sql` — database import assertions.
- `.github/workflows/quiz-db-foundation.yml` — PostgreSQL and local Supabase validation/import checks.

The current draft bank contains 114 original English-learning / Simplified-Chinese-translation questions:
- Beginner: 30 questions, six each across five source lessons.
- Intermediate: 36 questions across five source lessons (8 + 7 + 7 + 7 + 7).
- Advanced: 48 questions across four source topics (10 academic/professional, 20 advanced grammar, 9 idioms, 9 precise vocabulary).

Every record has an English prompt, Simplified Chinese translation, four bilingual options, one answer key and bilingual explanations. The material is original SwiftDictionary content, not copied from third-party dictionaries, textbooks or commercial quiz banks.

The validator checks unique IDs/prompts, bilingual fields, four unique English options, answer-key membership and source lesson/topic/difficulty mappings. Its SQL exporter always inserts `status='draft'`; it cannot approve or publish questions. Manual editorial review and a separate approval migration are required.

### Validation

Quiz workflow run [#107](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43805415258) passed both PostgreSQL 17 and disposable local Supabase jobs for the 66-question Beginner/Intermediate pack, including authenticated RPC/session/allowance tests, draft import, local Auth helper checks and Supabase security advisors. Pinning Supabase CLI 2.81.3 resolved the earlier release API rate-limit issue.

The 48-question Advanced batch and expanded 114-row import assertions have since been added. The structural/curriculum check in this session found 114 unique question IDs and prompts, four unique English options per question, matching answer keys, complete bilingual fields, and valid mappings across all three difficulty levels. The 114-row PostgreSQL/local Supabase CI run is pending.

The companion 2.3.x workflow run [#829](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/43805415257) passed PostgreSQL 17 migration/allowance tests, Chromium browser regression and local Supabase Auth compatibility. A later companion run #839 again passed PostgreSQL 17 and Chromium checks, but its local Supabase setup hit the GitHub release API rate limit before tests started; the earlier full run #829 remains green.

### Content readiness

The draft counts reach the preferred three-session question-bank targets:
- Beginner: 30 (target 30).
- Intermediate: 36 Intermediate + 30 Beginner support questions (target 36 + 24).
- Advanced: 48 Advanced + 12 Intermediate + 12 Beginner support questions (target 48 + 12 + 12).

All content remains draft, so no difficulty is available yet. Availability also requires manual approval, production import, active matching lesson/topic mappings, the selected translation language and enough unseen questions. The current pack supports English learning with Simplified Chinese translation only.

### Legal and content provenance

The content pack adds no learner personal data, tracking or analytics. It uses original authored educational material. Future external-source content requires provenance and licensing review. The broader Quiz feature still processes account-linked learning-performance data, so the standing Malaysia PDPA/general privacy review remains applicable. The dedicated Terms and Legal update remains scheduled after Flashcards is released to main.

### Current release boundaries and next actions

- Production Quiz allowance is Free 1/day and Premium 3/day.
- Quiz schema/RPC migrations and draft content remain unapplied to production.
- PR #8 remains draft and unmerged.
- No merge or deployment occurred.
- Next, complete the 114-question CI validation, then perform human editorial review and plan a separate approval migration before implementing Quiz frontend and signed-token/PostgREST/browser end-to-end tests.


## 37. Update 2.4.0 — Chinese-translation integration questions and Mock Quiz validation (2026-11-17)

The owner approved the proposed Chinese-integration distribution for English-learning Quiz sessions with Simplified Chinese selected as the translation language:

- Beginner: 1 Chinese-translation assessment question in a 10-question session.
- Intermediate: 4 in a 15-question session.
- Advanced: 7 in a 20-question session.

These are included within the existing session lengths, not added on top. The approved difficulty composition remains unchanged: Beginner 10 Beginner; Intermediate 12 Intermediate + 3 Beginner; Advanced 12 Advanced + 6 Intermediate + 2 Beginner.

### Draft content and Mock User implementation

- Expanded `content/quiz/questions.en-zh.draft.json` from 114 to 150 original draft questions: 114 knowledge questions (30/36/48 by difficulty) plus 36 Chinese-translation assessment questions (3/12/21 by difficulty). The 3x bank supply is intended to support up to three daily sessions without exhausting the required translation-question pool.
- Each new assessment question uses an English prompt asking for the most accurate Simplified Chinese translation, with four Chinese answer choices and an English gloss stored as supporting metadata.
- Mock User sessions select exactly 1/4/7 Chinese-translation questions when the saved translation preference is Simplified Chinese. When English is selected as the translation language, the Mock session uses knowledge questions only. The total session lengths and original source-difficulty composition remain unchanged.
- The Quiz UI displays Chinese answer choices as the primary options for these assessment questions. If the learner changes the active session's display preference to English, the English gloss is shown as supporting text while the Chinese answer target remains intact.
- The existing nine questions with duplicate Chinese support-option strings were revised. The content validator and Mock loader now check for four unique English and four unique Chinese option labels after Unicode normalisation, in addition to IDs, answer-key membership, bilingual fields and curriculum mappings.
- The answer-navigation controls are disabled while an answer-save request is pending. This prevents a rapid Next/Previous action from being silently ignored while the save is in progress.

### Backend and release boundary

The 36 Chinese-translation assessment questions are intentionally Mock User preview-only in this stage. The authenticated Quiz database schema and RPC payloads do not yet carry a `question_type` field. The draft SQL exporter therefore imports only the 114 knowledge questions into disposable CI databases and excludes the 36 translation-assessment questions. A later feature-branch migration and RPC update is required before these question types can be tested against the authenticated backend or considered for release.

The source pack remains `draft`. None of the 150 questions is approved for learner-facing publication. No Quiz schema/RPC migration, question import, staging migration, production data change, production configuration change, main-branch merge or production deployment was performed in this session.

### Validation and current branch state

- Implementation branch: `feature/update-2-4-0-quiz`.
- Latest implementation commit: `710f043a43e116c90d4b3a6fb779605658bd2333`.
- PR #8 remains open, draft and unmerged.
- Quiz database foundation workflow run [#417](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44047597209) passed PostgreSQL validation, draft import of the 114 supported knowledge questions, disposable local Supabase Auth/RPC/session tests, authenticated Chromium runtime tests and Supabase security advisors.
- Companion 2.3.x regression workflow run [#974](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44047597250) passed PostgreSQL, Chromium and Supabase Auth compatibility checks.
- Earlier run #415 failed because a double-escaped Unicode-normalisation regular expression produced false duplicate-option reports. The regex was corrected in commit `710f043`; the subsequent #417 run passed.
- Earlier run #413 exposed a navigation/save timing race. Disabling navigation while saving was added; the authenticated Chromium runtime tests passed in #417.
- The latest Cloudflare Pages deployment for commit `710f043` has not yet been confirmed. Do not provide a preview link or claim the hosted preview contains these changes until deployment is independently verified.

### Legal, privacy and content review

The new questions are original authored learning content; no third-party question bank, dictionary text or external dataset was imported. This content change adds no learner personal-data fields or new tracking. The existing Quiz feature still processes account-linked learning activity, selected answers, scores and history, so the standing Malaysia PDPA and applicable international/16+ privacy review, retention/deletion disclosures and cross-border processing review remain release gates. This is planning guidance, not legal advice. Human editorial review of all bilingual questions remains mandatory before approval.

### Next steps

1. Confirm Cloudflare Pages has deployed the latest feature-branch commit before sharing the Mock User preview.
2. Let the owner test the 1/4/7 Chinese-integration mix, the question wording and the Chinese answer choices using fictional Mock User accounts only.
3. Continue the full bilingual accuracy review; do not publish or approve the draft pack based only on structural CI checks.
4. After the owner accepts the Mock preview, add backend `question_type` support through a reviewed feature-branch migration/RPC update and validate it in the isolated staging environment only after the clean-schema bootstrap is complete.
5. Keep PR #8 draft and unmerged until explicit owner approval. Keep production `main`, production Quiz schema/content and production data unchanged.


## 38. Update 2.4.0 — Quiz curriculum alignment and expanded question variety (2026-11-17)

A full pass was performed over the 199-question draft bank, its 15 permanent English lesson records and the bilingual lesson content.

The following existing permanent lessons were expanded in both English and Simplified Chinese. No new lesson IDs were necessary because the identified gaps could be taught coherently within their existing lesson topics:

- **Beginner — Everyday vocabulary:** descriptive adjectives and their meanings, including boring, exciting, beautiful, crowded, comfortable, delicious, friendly, quiet, useful and expensive; everyday collocations are also taught explicitly.
- **Beginner — Articles:** article selection by sound, including umbrella and hour.
- **Beginner — Countable/uncountable nouns:** irregular plural children; advice, information, equipment and furniture; slices of bread and sugar.
- **Beginner — Sentence basics:** subject/verb/object roles, there is/there are, adjective position and do/does question structure.
- **Beginner — Present simple:** positive and negative forms, questions, third-person singular, routines and the correct placement of usually.
- **Intermediate — Collocations:** make progress, heavy rain, meet a deadline, raise an issue, highly unlikely, take responsibility, pose a problem, deeply concerned, make a decision and the meaning of collocation.
- **Intermediate — Conditionals:** zero, first, second and third conditional patterns, unless, even if, provided that, and an introduction to mixed conditionals.
- **Intermediate — Phrasal verbs:** give up, put off, look after, run into, run out of, carry on, bring up, turn down and get along with; postpone is taught as an equivalent of put off.
- **Intermediate — Perfect forms:** present perfect, present perfect continuous, past perfect, since/for, already and yet.
- **Intermediate — Word families:** decide/decision, rely/reliable, succeed/successful, create/creativity, danger/dangerous, accurate/accuracy, persuade, convince/convincing, clarification/unclear and affect/effect.
- **Advanced — Hedging:** tentative, cautious, effective, attributable, consistent, compelling and causal relationship, alongside qualified claims.
- **Advanced — Inversion:** the tested negative/restrictive inversion patterns, including not until, only after, under no circumstances, no sooner…than, little did, at no point and third-conditional inversion.
- **Advanced — Mixed conditionals:** both time-reference patterns and the inverted mixed-conditional form used by a Chinese-integrated question.
- **Advanced — Idioms:** all expressions assessed in the bank, including get the ball rolling, tip of the iceberg, cut corners, on the same page, back to square one, on the fence, blessing in disguise, under the weather, in the long run, break the ice, scratch the surface, take the plunge and jump to conclusions.
- **Advanced — Precise vocabulary:** all tested near-synonym/confusable pairs, including historic/historical, ensure/assure, eminent/imminent, adopt/adapt, complement/compliment, discreet/discrete, credible/credulous, imply/infer, and the tone/disclosure terms tactful, candid, harsh, incidental, reluctant and disclose.

The Chinese lesson records received corresponding Simplified Chinese explanations, points, examples and practice items.

### Curriculum traceability

- Added objective definitions to every source lesson in content/quiz/curriculum-map.en.json.
- Added learning_objective_id to every one of the 199 question records.
- The content validator now rejects a question if its source lesson has no learning objective or if its objective ID does not belong to that source lesson.
- The Mock loader requires every draft question to carry a learning-objective link, and issued Mock questions retain that link.
- A separate semantic audit checked all one-word definition/translation targets against the mapped bilingual lesson text; no target was left without lesson coverage.
- Full-sentence Chinese translation questions were checked against the grammar, collocation, phrasal-verb, idiom or vocabulary topic of their mapped lesson.

### Question-bank composition and session selection

The draft pack now contains 199 questions:
- 114 knowledge questions: 30 Beginner, 36 Intermediate, 48 Advanced.
- 15 word-definition questions: five per difficulty.
- 70 Chinese-translation questions: 21 Beginner, 21 Intermediate, 28 Advanced.

The Mock selector now:
- Includes one word-definition question in each 10/15/20-question session.
- Uses a stable pseudorandom Chinese-translation count from 1 to 7 for each Mock learner, local reset date and difficulty when Simplified Chinese is selected as the translation language.
- Keeps that daily count stable when the learner restarts the same difficulty on the same day; it recalculates after the learner's local daily reset.
- Keeps the total session lengths and existing 10 / 12+3 / 12+6+2 source-difficulty composition unchanged.
- Continues to avoid reusing question IDs on the same local day, including across abandoned sessions and difficulty levels.
- Uses knowledge questions only for the remaining places after the definition and selected Chinese-translation items have been reserved.

The English-learning / English-translation preference still excludes Chinese-translation questions, but the session continues to include the word-definition item.

### Additional content correction

The audit found that quiz-beginner-030 had an incorrect answer sentence placing “usually” after the main verb. The answer was corrected to “She usually drinks tea in the evening.” The distractor set was revised to remain unique after Unicode normalisation.

The Chinese-integrated question quiz-advanced-zh-006 tests a third-conditional inversion, not a mixed conditional. Its source lesson was corrected from the mixed-conditionals lesson to the advanced inversion lesson. The separate inverted mixed-conditional question remains mapped to the mixed-conditionals lesson, which now explicitly teaches that form.


- Implementation branch: feature/update-2-4-0-quiz.
- Latest application/documentation commit at this note: 5b075f9bc01f0165fa0704931d42fb2d6ab0fa29.
- PR #8 remains open, draft and unmerged.
- Quiz database foundation workflow run #44059590986: quiz-db-foundation passed; disposable local Supabase Auth/RPC integration was still running at the latest status check.
- Companion 2.3.x regression workflow run #44059591070: PostgreSQL 17, Chromium browser regression and Supabase CLI local Auth compatibility all passed.
- The draft content validator and PostgreSQL import assertions passed for the 199-question source pack; the exporter continues to include only the original 114 knowledge questions. The companion 2.3.x workflow #44059591070 also passed its PostgreSQL 17, Chromium (23 tests) and Supabase CLI local Auth compatibility jobs.
- Cloudflare Pages check for the feature branch completed successfully. The separate Workers Builds check remains failed, consistent with the pre-existing split result recorded in the preceding archive; it is not the Pages deployment result.


### Final Mock objective-link guard (2026-11-17)

- The Mock loader now verifies that each question's learning_objective_id actually exists in the objectives array of its mapped permanent lesson; a non-empty but mismatched objective is rejected.
- Issued Mock question snapshots retain learning_objective_id, and the Mock test asserts that the issued snapshot matches the source draft record.
- Follow-up application commit: a0ff09012751a16d5d7e4c683ac965cf385c5d9d.
- On that commit, Cloudflare Pages, quiz-db-foundation, PostgreSQL 17, Chromium browser regression and Supabase CLI local Auth compatibility checks passed. The separate disposable local Supabase Auth/RPC integration job was still running at the latest check. The separate Workers Builds check remains failed; the Pages deployment is successful.

## Backend, legal and release boundaries

- The 15 word-definition and 70 Chinese-translation questions remain Mock User preview-only because authenticated Quiz database/RPC support for the new question types has not yet been added. The SQL exporter intentionally excludes all 85 non-knowledge items.
- All 199 questions remain draft; structural validation and lesson alignment do not constitute final human bilingual editorial approval.
- No production Quiz schema/content, production learner data, production settings or Supabase migration was changed in this work. No staging migration/import was performed.
- This content work adds original educational text only. It adds no learner personal-data field, tracking or analytics. The existing Quiz account-linked progress, answers, score and history processing still requires the standing Malaysia PDPA and applicable international privacy review, retention/deletion disclosures, cross-border processing assessment and 16+ safeguards before release. This is planning guidance, not legal advice.
- PR #8 remains draft and unmerged. Do not merge or mark the bank approved without the owner's explicit approval and completion of human editorial review.

## Next steps

1. Continue bilingual editorial review for factual accuracy, natural Simplified Chinese, answer uniqueness, difficulty and explanations.
3. Add authenticated database/RPC support for word_definition and chinese_translation in a reviewed feature-branch migration, then test it in the isolated staging environment after its clean-schema bootstrap is complete.
4. Keep all content draft until the owner has reviewed and explicitly approved the bank. Production import and release remain separate approval gates.


## 39. Update 2.4.0 — authenticated Quiz question-type support (2026-11-17)

The owner authorised continuation of authenticated backend question-type support while keeping production untouched. The implementation adds `question_type`, `answer_language_code` and `learning_objective_id` to the private question bank, with matching immutable issued-question snapshot fields and authenticated session-payload metadata. The selector now includes one word-definition question per session, a stable 1–7 Chinese-translation mix when Simplified Chinese is selected, and knowledge questions for remaining source-composition slots. Existing session sizes, source-difficulty composition, topic cap, topic diversity, answer secrecy and same-day no-repeat rules are preserved.

The SQL exporter and authoring documentation now support all 199 questions as draft-only imports. No automatic approval is possible. The migration and test changes are on `feature/update-2-4-0-quiz`; PR #8 remains draft and unmerged.

Validation:
- Quiz workflow #473 passed PostgreSQL 17 migration/RPC tests, 199-row draft import assertions, disposable local Supabase Auth/RPC integration, authenticated Chromium runtime tests and Supabase security advisors. Local services were stopped after tests.
- Earlier workflow #465 caught a malformed exporter string; it was fixed. The test fixture's English translation-language mismatch was also corrected.
- Follow-up workflow #477 adds a direct authenticated Chinese-preference session test for 1–7 Chinese-translation questions, exactly one definition item, Chinese answer-language metadata and free abandonment. It was pending at the time of this update.

No production Quiz schema/content migration, production data operation, merge or production deployment occurred. The existing production Quiz allowance remains Free 1/day and Premium 3/day. The approved zero-cost staging project remains empty because the clean-schema bootstrap blocker has not been resolved; no staging migration/import was performed.

The 199 questions remain draft and require full human bilingual accuracy review and explicit owner approval. The backend work adds no new personal-data category or analytics, but existing Quiz account-linked answers, scores, history and temporary no-repeat reservations remain subject to Malaysia PDPA and applicable international/16+ privacy review, including retention/deletion and cross-border disclosures. This is planning guidance, not legal advice.

Next: confirm workflow #477, resolve any failures, complete human bilingual review before content approval, and keep production/main untouched until separate explicit release approval.


## 40. Staging bootstrap and deferred friend-testing review (2026-11-17)

The owner chose to defer the manual accuracy review of all 199 Quiz questions until friends can test the website and provide feedback. The review is postponed, not waived. No production content approval is granted. A separate explicit owner decision is required before the 199 questions are activated for staging-only test sessions.

A clean staging bootstrap and post-migration grant checks were added under `supabase/staging/`; synthetic legacy Auth users and learner-history fixtures were split into a separate CI-only SQL file. The Quiz workflow uses the clean baseline, verifies it before fixtures, applies the 2.3.x/2.4.0 migration sequence and checks the grants. The hosted staging project `ivatvkfrtifgfheeaelj` (ACTIVE_HEALTHY, ap-southeast-1, PostgreSQL 17.12) now has the baseline plus all 12 ordered 2.3.x/2.4.0 migrations (13 migration records including baseline). Hosted grant verification passed. The database remains empty: zero Auth users, zero question-bank rows, zero approved questions, zero Quiz sessions, zero saved words and zero learning-history rows.

The feature-branch `supabase-config.js` now points to staging and the public staging publishable key. Cloudflare Pages successfully deployed commit `794e8ab` to `https://a81b4f89.swiftdictionary-testing.pages.dev`. Production `main` config is unchanged. Staging Google OAuth remains unconfigured; callback URI is `https://ivatvkfrtifgfheeaelj.supabase.co/auth/v1/callback`. A separate Google OAuth client and allowlisted preview redirect URL must be configured before friends can sign in.

CI:
- Quiz workflow #44070688629 passed PostgreSQL 17 foundation, local Supabase/Auth/RPC, authenticated Chromium runtime and security advisors.
- Companion 2.3.x workflow #1003 passed.
- Hosted staging grant verification passed; hosted data-boundary checks confirmed zero users/content.
- Hosted security advisors reported 7 INFO findings for private-schema RLS tables without policies (intentional, no client access) and 2 WARN findings for reviewed authenticated SECURITY DEFINER RPCs: `is_personal_learning_test_access()` (returns only the caller's own exemption status) and `record_completed_lesson_practice_result(...)` (checks authenticated ownership, approved catalogue membership and completed lesson before inserting a single aggregate summary). No ERROR findings were returned. Re-review if function bodies/grants change.
- The latest branch-head CI after the preview-config commit was still running at the time of this record update.

An unintended three-commit staging-scaffolding advance to `main` was detected. The commits contained only three staging bootstrap/verification files. The main ref was restored using a force-with-lease to its exact prior SHA `90dc73a9b65fc3af713fefab4955057026089b96`; a subsequent ref read confirmed that exact SHA. Feature branch retains all staging work. No production schema/data/config change, merge or production deployment occurred. PR #8 remains draft/unmerged.

Next: complete latest branch-head CI; configure staging Google OAuth; confirm preview uses only staging; obtain explicit owner approval for staging-only activation of the 199 draft questions; then create isolated tester accounts, validate RLS/session/allowance/history-deletion behaviour, provide a concise privacy/test notice for the intended 16+ audience, and collect feedback for the deferred bilingual review. Malaysia PDPA and applicable international/teen privacy review remains a release gate. This is planning guidance, not legal advice.


## 41. Update 2.4.0 production merge and 199-question release (2026-11-17)

Update 2.4.0 has been merged to `main` through PR #8, squash commit `01c7c61a9d7c8c91591eeb7f184afdf5c3caf8bf`. The owner explicitly authorized publication of all 199 questions without waiting for human bilingual accuracy review. Review is deferred until the owner and friends test the live website and provide feedback. Production database status `approved` means selectable; it does not mean independently human-reviewed. The source JSON remains draft for ongoing authoring.

GitHub Pages deployment #44075861937 succeeded for the merge commit. Live URL: `https://whitewingcat.github.io/swiftdictionary/`. Feature-branch `supabase-config.js` was restored to production before merge. The isolated staging project remains empty and is not the friend-testing target.

Production Supabase project `pzymiesazmpyvnfvsbsc` (Tokyo, PostgreSQL 17.11, ACTIVE_HEALTHY) received five migrations via the connector; generated version IDs are `20261117113854` (Quiz bank foundation), `20261117113904` (authenticated Quiz RPCs), `20261117113907` (learning page introduction preferences), `20261117113912` (authenticated question types), and `20261117113917` (199-question content release). The pre-existing Quiz allowance migration `20261116043139` was already applied and not repeated. PR #9 subsequently merged as `44f913e6898fbc154105f097fe9501dbdac84ff2`, renaming source migration files to those exact generated versions and updating CI references; do not reapply these migrations.

Post-migration production verification confirmed 199 approved/selectable rows: 114 knowledge (30/36/48), 15 word definitions (5/5/5), 70 Chinese translations (21/21/28); difficulty totals 56 Beginner, 62 Intermediate, 81 Advanced. All 15 source lessons are active and match topic/difficulty. Missing learning objectives: 0. Invalid four-option/correct-option records: 0. Production Quiz sessions at verification: 0. Existing learner records were not deleted or rewritten. Free 1/day and Premium 3/day allowances remain unchanged. The new public introduction-preferences table exists with RLS enabled.

Final pre-merge Quiz workflow #44075394265 passed PostgreSQL 17, local Supabase/Auth/RPC, approved export and release-migration assertions, authenticated Chromium runtime tests and security advisors. Companion 2.3.x regression workflow #44075394304 passed. Earlier intermediate browser-test failures were superseded by the passing final PR-head runs.

Production security advisors after migration: 7 INFO for private-schema RLS tables without client policies (intentional, private/non-exposed); 2 WARN for the previously reviewed authenticated lesson SECURITY DEFINER functions; 1 WARN for disabled leaked-password protection (current app uses Google OAuth). No ERROR findings. The Quiz private tables remain accessed through authenticated RPCs; the public introduction-preferences table has RLS and owner-scoped policies.

The content pack is original and adds no personal-data fields or analytics. Existing Quiz processing includes account-linked selected option IDs, question/lesson snapshots, scores, session history, timezone and temporary no-repeat reservation metadata (designed 36-hour cleanup). Production database is in Tokyo. Malaysia's PDPA Amendment Act 2024 commenced in phases on 1 January, 1 April and 1 June 2025. Before inviting friends to sign in, provide a clear test/privacy notice covering stored Quiz data, purposes, retention/deletion exception, Supabase hosting/cross-border transfer and user requests. The current website has no formal public Privacy Notice or Terms page. Review Malaysia and applicable international/16+ age obligations before broader public launch. This is planning guidance, not legal advice.

Next: owner tests live production Quiz; then friends test with an accompanying notice and provide feedback; correct questions/lessons based on reports; continue Flashcards 2.5.0 and the separate Legal/Privacy/Terms milestone on the existing roadmap.


## 42. Update 2.4.1 — Daily Learning and Quiz fixes (2026-11-17)

Update 2.4.1 has been merged to `main` through PR #10, squash commit `6dfd084fa9b2c1290fb183fbf0862dadec0dd8f7`. The feature branch was `feature/update-2-4-1-fix-changes`; final head `db96af2b1c1099380f09bd0b387d5d1863e3f7e1`. The PR description records the owner's four requested changes.

### Owner-approved changes

1. Remove the entire internal “Draft question-bank preview” notice from the live Quiz page.
2. Add a short-lived, accessible page-refresh toast after either Learning Course or Translation Language changes.
3. Preserve the Quiz subview the learner was already using when the translation selector changes. An open session remains open; changing translation from the overview does not automatically open an unfinished session. Immutable session snapshots and saved answers are retained.
4. Translate the main Quiz overview into Simplified Chinese, including the page heading/introduction, refresh control, difficulty cards, allowance, history and related controls.

### Root causes and repairs

- **Daily Learning blank activity grid:** the expired in-progress-session query did not select the session `id`, but cleanup required that identifier to call `abandon_daily_activity_session`. The missing ID caused loading to fail before activity cards rendered. The query now includes `id`; the existing expiry regression test verifies an old session is abandoned and a fresh session can be started.
- **Quiz unavailable under English translation preference:** the released 199-question bank stores a Simplified Chinese translation pack (`translation_language_code='zh'`) for English learning content. The availability function incorrectly coupled all English Quiz eligibility to the learner's display translation preference. The 2.4.1 migration now counts the available English question pack independently and includes Chinese-integration question types only when Simplified Chinese is selected. The browser sends its current course/translation selection explicitly when starting a session.
- **Translation selector reverting after Quiz start:** an asynchronous Profile hydration request could finish after a learner changed language selectors and overwrite the newer selection with stale account data. Profile hydration now snapshots the selection version and does not overwrite a newer local choice; it also reapplies the current translation to the Quiz overview/session after hydration.
- **Session appearing on the overview after translation changes:** the frontend now snapshots and restores the exact visible Quiz subview around language refreshes. It does not infer that an active server-side session must be opened.

### Validation and production state

- Quiz workflow #44097715861 passed: PostgreSQL 17 foundation and migration checks, local Supabase/Auth/RPC integration, authenticated Chromium Quiz runtime tests, and security advisors.
- Companion 2.3.x regression workflow #44097715708 passed: PostgreSQL migration/allowance tests, local Supabase Auth compatibility, and Chromium browser regression smoke tests.
- GitHub Pages deployment #44098139901 completed successfully for main commit `6dfd084fa9b2c1290fb183fbf0862dadec0dd8f7`.
- Production Supabase project `pzymiesazmpyvnfvsbsc` remains `ACTIVE_HEALTHY`, PostgreSQL 17.11. Migration `20261117132100_swiftdictionary_update_2_4_1_quiz_translation_language_fix` is present in production migration history; release wrap-up verified it rather than applying it again.
- Production question counts remain unchanged: 114 approved knowledge, 15 approved word-definition and 70 approved Chinese-translation questions (199 total). All 15 permanent English lesson mappings remain active.
- The new three-argument `public.start_my_quiz(text,text,text)` and private implementation are installed. Authenticated execute is granted; anon and public execute are false. Existing one-argument overloads remain authenticated-only for compatibility.
- Production security advisor returned 7 INFO findings for private-schema RLS tables without direct client policies (intentional private/RPC-mediated access), 2 WARN findings for previously reviewed public lesson SECURITY DEFINER functions, and 1 WARN for disabled leaked-password protection (current sign-in uses Google OAuth). No health findings or new Quiz-specific advisor warnings were returned.
- Production had two old Daily Learning sessions still marked `in_progress` at post-release verification. No user data was manually changed. On the next Lessons load, the corrected client should identify and abandon those sessions because they are outside the user's current allowance day.
- The release adds no new learner personal-data fields, analytics or tracking. Existing Quiz account-linked answers, score/history, session snapshots, timezone and temporary no-repeat reservation metadata remain subject to the previously recorded Malaysia PDPA and applicable international/16+ privacy review.

### Owner testing and next gates

1. Hard-refresh the live site at `https://whitewingcat.github.io/swiftdictionary/` so the new Pages assets are loaded.
2. Open Lessons and verify the Daily Topic, Daily Application, Daily Discovery and Daily Revision cards appear; stale sessions should be cleared automatically.
3. Test Quiz with English and Simplified Chinese translation preferences, including Beginner, Intermediate and Advanced availability/start.
4. Change translation while a Quiz is open and verify the active session stays open, then return to the overview and verify changing translation does not auto-open it.
5. Verify both selector toasts appear briefly and disappear, and check the Quiz overview is translated when Simplified Chinese is selected.
6. Report any live-test issues before inviting friends. Human bilingual review of the 199-question bank remains deferred, not waived. Before friends sign in, provide a concise test/privacy notice covering stored Quiz data, purposes, retention/deletion, Tokyo hosting/cross-border processing and a contact route. The current website still lacks formal public Privacy Notice/Terms pages. This is planning guidance, not legal advice.

No live Quiz session was started on the owner's production account during release verification, to avoid creating a session or consuming/reserving questions on their behalf. Automated authenticated tests used disposable local Supabase accounts; manual production-account testing remains the owner's next step.


## 43. Update 2.4.2 — Dashboard Quiz History rendering and navigation fixes (2026-11-18)

### Owner request

The owner reported two Dashboard-related Quiz defects and requested a minor patch released as Update 2.4.2:

1. Dashboard Quiz History displayed malformed JavaScript expression text instead of the Review button label.
2. Navigating from the Dashboard to the Quiz page opened a previously completed Quiz review instead of the Quiz overview.

### Investigation and implementation

- Repository: `WhiteWingCat/swiftdictionary`; production baseline was main commit `6dfd084fa9b2c1290fb183fbf0862dadec0dd8f7` (Update 2.4.1).
- The Dashboard history HTML template incorrectly escaped the JavaScript string concatenation around `quizEscape(quizT("Review","查看"))`. The generated HTML contained literal backslashes/quotes and expression fragments. The template now concatenates the escaped localized label normally.
- Ordinary navigation to `#quiz` now clears stale completed-result state, resets the return destination and session-view flag, explicitly shows the Quiz overview, and then runs normal Quiz initialization.
- The dedicated Dashboard Quiz History Review click handler retains its intentional direct-review path by passing `skipQuizInitialise:true` and calling the existing account-scoped `quizReview(...,"profile")` flow. Completed reviews still return to Dashboard.
- Added browser regression coverage for the visible Review label and for Dashboard-to-Quiz navigation when stale completed-review state is present.
- Extended the Quiz frontend validator to guard the corrected button template, retained direct-review path and overview-state reset.

### Branch and pull request

- Feature branch: `feature/update-2-4-2-dashboard-quiz-fixes`.
- PR #11: https://github.com/WhiteWingCat/swiftdictionary/pull/11
- Current PR head at this archive update: `a2eef0080fa683975d0c96b249e7d3464c15e84f`.
- PR is open and not merged. Cloudflare Pages preview build was reported as in progress for commit `a2eef00`.
- Changed files: `index.html`, `scripts/quiz/validate-quiz-frontend.mjs`, `tests/browser/update-2-4-0-quiz-runtime.spec.js`, and `.github/workflows/quiz-db-foundation.yml` (adds the Update 2.4.2 feature branch to the existing Quiz workflow push trigger so the same full regression suite can run for this patch).

### Validation status at handover

- Browser regression cases and static validation guards have been added.
- GitHub PR metadata reports the head as mergeable on the latest PR fetch.
- The available GitHub workflow-run/status lookup did not return a run for the current head at this check; do not describe CI as passed until an actual successful run is observed.
- Cloudflare Pages preview deployment was still in progress at the latest PR comment. Do not share it as a ready preview until a success status and URL are reported.
- No production merge, GitHub Pages deployment, Supabase migration, production data write or production session operation has occurred for Update 2.4.2.



### Validation update — 2026-11-18

The final current PR head at this check is `9cc1115b4d5379988bf5c54e1343c5107e18fe6b`. Quiz workflow #44228565220 has passed its frontend/static validation job and completed its disposable Auth/schema/migration/question-content preparation; its authenticated Chromium Quiz runtime step is still running, with the Supabase security-advisor step pending. Companion 2.3.x workflow #44228565184 passed all three jobs (PostgreSQL 17, Chromium smoke tests and local Supabase Auth compatibility). Cloudflare Pages preview for `9cc1115` deployed successfully at https://feature-update-2-4-2-dashboa.swiftdictionary-testing.pages.dev. PR #11 remains open and unmerged; do not merge until the remaining Quiz workflow steps pass.

### Privacy/legal and preservation review

This is a narrowly scoped presentation/navigation repair. It adds no personal-data categories, tracking, analytics, database fields, third-party content or external dependencies. Existing account-scoped Quiz history/review RPCs, saved answers, active-session snapshots, language preferences, allowances, authentication and account isolation are preserved. The existing Malaysia PDPA and applicable international/16+ privacy review remains relevant to the broader Quiz feature, but this patch does not expand its processing purposes or data collection. This is planning guidance, not legal advice or compliance certification.

### Recovery point and next steps

1. Continue on `feature/update-2-4-2-dashboard-quiz-fixes` and PR #11.
2. Confirm full Quiz workflow and companion regression validation on the final PR head; resolve any failures before merge.
3. Confirm Cloudflare Pages branch preview success and manually verify the Review label and navigation behaviour if the preview is available.
4. After validation, merge PR #11 to `main`, then verify the main GitHub Pages deployment before calling Update 2.4.2 live.
5. Update this record and archive with the final merge SHA, CI run IDs and deployment result. No Supabase migration is expected or required.


## 44. Update 2.4.2 — merge and release verification (2026-11-18)

This section supersedes the open-PR/pending-validation statements in Section 43.

- PR #11 was successfully squash-merged to `main` at 2026-11-18 03:29:55 UTC.
- Merge commit and verified `main` HEAD: `65d0a35bab577adc15a0b1911661c222ed625739`. GitHub reports the merge commit signature as verified.
- Final tested feature-branch head: `3b9d703f2f83a0f188d55acaac6eef788999434e`.
- Quiz workflow #44229322995 passed both jobs: Quiz frontend/database foundation and disposable local Supabase Auth/RPC integration, including authenticated Chromium Quiz runtime and local security-advisor checks.
- Companion 2.3.x workflow #44229322963 passed all three jobs: PostgreSQL 17 migration/allowance tests, Chromium browser regression smoke tests and Supabase CLI local Auth compatibility.
- Cloudflare Pages preview for the final tested feature-branch commit was reported successful at `https://feature-update-2-4-2-dashboa.swiftdictionary-testing.pages.dev`.
- GitHub Pages production deployment was triggered for the merge commit as run #44230831943. At the time of this record update it was still building; do not claim the production site is updated until that run completes successfully.
- No Supabase migration, production database write, production data operation or new personal-data processing was required for 2.4.2.

The code merge is complete. Remaining release gate: confirm GitHub Pages run #44230831943 succeeds, then update the production deployment status here and in the conversation archive. Owner should hard-refresh the live site and manually verify the Dashboard Review label and Dashboard-to-Quiz overview navigation after deployment.


### Production deployment confirmation — 2026-11-18

GitHub Pages deployment run #44230831943 completed successfully for merge commit `65d0a35bab577adc15a0b1911661c222ed625739`. All three deployment jobs passed: build, report-build-status and deploy. The deployment workflow is successful; the live URL remains `https://whitewingcat.github.io/swiftdictionary/`. The web inspection endpoint could not independently load the site, so deployment success is confirmed from GitHub Pages' completed workflow rather than a separate external page fetch. No Supabase migration was required. The owner should hard-refresh and manually check both Dashboard fixes on the live site.

## 45. Documentation source of truth and repository branch hygiene (2026-11-18)

### Owner direction

The owner identified two repository-maintenance problems: old 2.3.0 release gates remained visible after the milestone was completed, and the growing collection of feature branches plus development notes on `main` made the repository difficult to manage.

### Record corrections

- The top-level handover now identifies Update 2.4.2 as the current completed production baseline, including merge commit `65d0a35bab577adc15a0b1911661c222ed625739`, passing Quiz/regression workflows #44229322995 and #44229322963, successful Pages deployment #44230831943, and the owner's live confirmation.
- The old 2.3.0 release checklist is explicitly labelled historical and closed. Its delivered work is covered by the 2.3.0/2.3.1/2.3.2/2.3.3 implementation and release records. Remaining privacy and friend-onboarding safeguards are kept separate from completed engineering gates.
- Update 2.4.0 Quiz, Update 2.4.1 and Update 2.4.2 are explicitly marked completed/released. Update 2.5.0 Flashcards is the next planned milestone and has not started.
- This record and its archive index are maintained on `docs/master-development-record`, not on `main`.

### Agreed branch responsibilities

| Branch | Responsibility | Rule |
|---|---|---|
| `main` | Production website/source branch | Contains application/runtime assets and the source-controlled build, test, workflow and database-migration assets needed to maintain and release the website. It must not contain the Master Development Record, conversation archives or internal planning notes. |
| `docs/master-development-record` | Durable project notes | Documentation-only changes: Master Development Record, dated conversation archives, archive index and supporting internal planning records. Never merge this branch into `main`. |
| Temporary feature branch | One active implementation task | Branch from current `main`; keep scope focused; merge only after validation and explicit approval; delete after merge when no longer needed. |

Documentation work must not create a PR targeting `main`. A PR is not required merely to update the dedicated documentation branch. Close obsolete draft PRs that target `main` with documentation-only or already-completed work. Delete merged feature branches after verifying the PR is merged and no active work depends on the branch. Do not delete unmerged branches until their contents have been inspected and any unique useful work has been preserved.

### Repository audit at this checkpoint

Observed branch heads:
- `main`: `65d0a35bab577adc15a0b1911661c222ed625739`.
- `docs/master-development-record`: `724877b82ea0cf0322fbf21db83f13786be9788e`.
- Old implementation branches still present included the 2.2.0, 2.3.0, 2.3.1, 2.3.2, 2.3.3, 2.4.0, 2.4.1 and 2.4.2 branches, despite their related PRs being merged.
- Open draft PR #2 is the old 2.3.0 planning PR targeting `main`; open draft PR #4 is the documentation-branch PR targeting `main`. Neither should be merged into production.
- The standalone `work/update-2-4-0-quiz-feedback` branch also requires inspection before any deletion; do not assume it is merged or disposable.

### Cleanup completed in this session

- The full `docs/` directory from the former `main` tree was preserved on `docs/master-development-record` before removal. This includes the previous Master Development Record copy, conversation archives, legal/privacy review, 2.3.x design notes, migration drafts, staging checklist and 2.4.0 Quiz implementation notes.
- The four root-level internal documents `PRIVACY-POLICY-DRAFT.md`, `RELEASE-QA.md`, `UPDATE-2.1.0-TECHNICAL-PLAN.md` and `UPDATE-2.3.0-PLANNING.md` are preserved on the documentation branch (the privacy draft is under `docs/reference/`).
- A single commit removed those 30 documentation paths from `main`: `686d8743f42ab32e3736c51861a2dbb9b2686420`. No application, runtime, test, workflow, migration, licence or attribution file was removed. GitHub Pages deployment #44233284108 completed successfully; build, deploy and report-build-status jobs all passed.
- Obsolete draft PR #2 (2.3.0 planning) and PR #4 (documentation branch targeting `main`) were closed without merging. There are now no open PRs.
- The connected GitHub actions available in this session can inspect branches and update refs, but do not expose a branch-delete operation. Therefore, the nine branches whose implementation PRs are already merged, the closed/unmerged 2.3.0 planning branch, and the unassociated `work/update-2-4-0-quiz-feedback` branch remain present. Do not claim they have been deleted. The nine merged branches can be deleted safely in GitHub's branch list after confirming PRs #1, #3 and #5–#11 are merged. The planning branch is unmerged but its planning document is preserved on the documentation branch; inspect before deleting. The `work/update-2-4-0-quiz-feedback` branch compares as diverged from current `main` (173 commits ahead, 5 behind, merge base `90dc73a`), with unique code/test/content files in its diff; it must not be deleted until its changes are reviewed.

### Recovery point

- Continue documentation edits on `docs/master-development-record`.
- Do not start Update 2.5.0 as part of this documentation-maintenance task.
- Keep `main` free of internal project notes. Future documentation-only updates go directly to the dedicated documentation branch; never merge it into `main`.


## 46. Main-branch documentation removal and preservation verification (2026-11-18)

The owner-requested separation was applied in the repository:
- Main cleanup commit: `686d8743f42ab32e3736c51861a2dbb9b2686420`.
- 30 paths under `docs/` and four root-level internal planning/QA documents were removed from `main`.
- Before removal, all 18 files that were present on `main` but missing from the documentation branch were added to `docs/master-development-record` by commit `056e5bf884340e43b84b537dc8bb33d23e9d35a0`. The root privacy-policy draft was also preserved as `docs/reference/PRIVACY-POLICY-DRAFT.md` by commit `4aa89535c433c2c6d11398d59ec8ef21c65b0b36`. Other root planning/QA documents already existed on the documentation branch.
- The documentation branch now contains 49 documentation files, including the current Master Development Record and all archived/supporting notes removed from `main`.
- The remaining `main` tree contains the production application, content assets, test fixtures, GitHub Actions workflows, Supabase migrations/tests, and licence/attribution material. No application or database file was removed.
- Pages workflow #44233284108 succeeded for the housekeeping commit (all three jobs passed). The commit changes no site runtime content; the owner already confirmed the 2.4.2 live application before this cleanup.

This is a repository/documentation-only change, not a new SwiftDictionary product release. No Supabase project, production database, learner data or production configuration was modified.


## 47. Housekeeping deployment and branch cleanup boundary (2026-11-18)

- Current `main` HEAD is `686d8743f42ab32e3736c51861a2dbb9b2686420`, the documentation-separation commit.
- GitHub Pages deployment #44233284108 completed successfully. Build, deploy and report-build-status all passed.
- The documentation branch remains the only location for the Master Development Record, conversation archives and supporting notes. The branch-hygiene record update was committed as `a24572d35abbdb5b0f86d7c878ecb4e9f007dda4`, followed by archive update `17e40719806a74fd57f6335d9a0195be42e35cd4`.
- Open PRs #2 and #4 are closed without merging. No open PRs remained at the repository check.
- The branch refs themselves have not been deleted because no branch-delete action is exposed by the connected GitHub integration. Nine branches associated with merged PRs (#1, #3, #5, #6, #7, #8, #9, #10 and #11) are cleanup candidates. The 2.3.0 planning branch is closed/unmerged and should be inspected before deletion.
- The old `work/update-2-4-0-quiz-feedback` branch is not a routine stale branch: comparison with current `main` reports 173 commits ahead and 5 behind from merge base `90dc73a9b65fc3af713fefab4955057026089b96`, with unique file changes. Preserve it until its work is audited and reconciled.

The production website code was not changed by this housekeeping commit. Do not treat this deployment as a product feature release. Update 2.5.0 remains unstarted.


## 48. Rolling three-branch implementation policy (2026-11-18)

### Owner decision

The owner approved a rolling limit of **three recent implementation branches** to reduce repository clutter. When a new implementation task begins, the oldest of the three retained implementation branches is retired and a fresh task branch is created.

### Operating rules

1. Maintain at most three retained implementation branches across the repository. This count includes branches named `feature/*`, `fix/*`, `hotfix/*`, `chore/*` and `work/*) when they contain application or implementation work.
2. Exclude `main` and the permanent `docs/master-development-record` branch from the three-branch count.
3. At the start of a new implementation task, inspect the three retained branches and identify the oldest by task start/last meaningful development activity, not merely the last commit timestamp if a branch was touched only for housekeeping.
4. Retire the oldest branch before creating the new task branch, so the rolling set remains at three. Create the new branch with a fresh task-specific name from the latest `main`; do not reuse an old branch name or base new work on a stale feature branch.
5. A merged and verified implementation branch is eligible for retirement. Prefer retiring completed branches first; retain a newer active branch if the oldest branch contains important unfinished work.
6. **Safety exception:** never delete a branch with unique unmerged work, unresolved review feedback or unreconciled commits. First inspect its diff against current `main`, preserve or merge/cherry-pick any required work with owner approval, and only then retire it. If the oldest branch cannot safely be retired, explain the conflict and ask the owner before exceeding the limit or changing the priority order.
7. Keep a short branch register in the Master Development Record: branch name, task, status, last meaningful activity, related PR/merge SHA and retirement decision. Update it when a branch is created, merged, retained or retired.
8. Branch deletion is a repository-maintenance action. If the available GitHub integration cannot delete branch refs, do not claim deletion; provide the exact safe candidates and ask the owner to remove them through GitHub.

### Branches requiring current cleanup

The audit at Section 47 identified nine implementation branches associated with merged PRs (#1, #3 and #5–#11) as safe retirement candidates, subject to checking their current status. The old 2.3.0 planning branch is also a candidate because its useful notes and migration have been preserved elsewhere. The `work/update-2-4-0-quiz-feedback` branch is explicitly protected until its unique 173-ahead/5-behind work has been reviewed and reconciled.

The initial rolling set should be chosen only after that protected work is audited. Do not keep stale merged branches merely to fill the three slots; retain the three most recent useful implementation branches, including active work where applicable.

### Branch register — 2026-11-18 audit

Compared each implementation branch against current `main` at `65d0a35`. Ahead/behind counts are Git commit-graph comparisons; a squash-merged PR can still appear as diverged, so merged PR status and patch equivalence must be checked before deletion.

| Branch | Ahead / behind main | Status / action |
|---|---:|---|
| `feature/update-2-5-0-flashcards` | 32 / 0 | Active Update 2.5.0 implementation; retain |
| `work/update-2-4-0-quiz-feedback` | 173 / 5 | Protected unique work; audit/reconcile before any retirement |
| `feature/update-2-4-2-dashboard-quiz-fixes` | 8 / 2 | PR #11 merged; retirement candidate after confirming patch equivalence |
| `feature/update-2-4-1-fix-changes` | 58 / 3 | PR #10 merged; retirement candidate after confirming patch equivalence |
| `feature/update-2-4-0-quiz` | 322 / 5 | PR #8 merged; large divergent history, verify patch equivalence before retirement |
| `feature/update-2-3-3-dashboard-favorite-details` | 13 / 6 | PR #7 merged; retirement candidate after confirming patch equivalence |
| `feature/update-2-3-1-bug-fix-and-changes` | 0 / 13 | No unique commits relative to main; retirement candidate |
| `hotfix/update-2-3-2-favorite-words-course-isolation` | 0 / 7 | No unique commits relative to main; retirement candidate |
| `feature/update-2-3-0-allowance-foundation` | 298 / 214 | Associated with merged PR #3 but large divergence; audit patch equivalence before retirement |
| `feature/update-2-3-0-planning` | 8 / 214 | Closed/unmerged planning branch; useful planning notes preserved on docs branch; verify no unique implementation before retirement |
| `feature/update-2-2-0-lessons` | 0 / 217 | No unique commits relative to main; retirement candidate |

There are currently 11 implementation branches, exceeding the agreed three-branch target. The available GitHub integration exposes no branch-ref deletion action. No branch has been deleted or claimed retired. Owner-side GitHub cleanup is still required after the listed safety checks; keep the active 2.5.0 branch and protected Quiz-feedback branch.


### Scope

This policy governs future implementation work from Update 2.5.0 onward. It does not change production deployment approvals, testing requirements, the documentation-only branch rule, or the requirement to update this record and the dated conversation archive for meaningful work.


## 49. Live Supabase staging synchronization and verification (2026-11-18)

### Scope and safety boundary

- Owner approved proceeding with the recommendation to synchronize staging with the current repository/production Quiz backend state.
- Production project was inspected read-only and was not modified.
- All write operations in this task targeted the separate staging project SwiftDictionary Indie Staging (ivatvkfrtifgfheeaelj, Singapore region).
- No production learner records, profiles, saved words, auth users, or preferences were copied into staging.
- No production configuration, schema, migration history or data was changed.

### Initial findings

- Production had 25 recorded migrations, with the latest source migration 20261117132100_swiftdictionary_update_2_4_1_quiz_translation_language_fix.
- Staging had a clean, separate bootstrap plus the 2.3.x and most 2.4.0 schema/RPC migrations, but its Quiz question bank was empty and it lacked the 2.4.0 content-release and 2.4.1 translation-language updates.
- Staging had 15 active permanent-lesson catalogue mappings, satisfying the guarded Quiz content-release preflight.
- Staging had no auth users and no learner/application records in profiles, saved words, preferences, lesson progress/practice, learning activity log or daily activity sessions. It is not yet ready for real-user testing without a test account.
- The 2.2.0 reconciliation baseline migration is a verification-only marker. Its historical trigger names have since been superseded by the 2.3.0 completion-based allowance implementation. The current evolved trigger/function equivalents were inspected; the old verification script was not replayed against the newer schema.

### Changes applied to staging

1. Applied the exact repository migration 20261117113917_swiftdictionary_update_2_4_0_quiz_content_release.sql (source blob fdaee41888ca50c35163a6c9d08de5e21a892f3e). Its empty-bank and lesson-mapping guards passed; it inserted the 199 approved Quiz questions.
2. Applied the exact repository migration 20261117132100_swiftdictionary_update_2_4_1_quiz_translation_language_fix.sql (source blob 887b635c494a66d2bc36ed53060babae0160099d). This updated the Quiz availability/start implementation and the three-selector start_my_quiz RPC.
3. Reconciled staging migration tracking with the canonical versions/names in main for the migrations already applied there. Added the 2.2.0 verification-only baseline record as applied because the live schema is already beyond that baseline and its original trigger names have been superseded. The staging-only bootstrap record 20261117110818 was retained. No schema/data migration was replayed for the baseline marker.

### Validation evidence

- Staging now records every migration in the current main migration directory, using the exact repository versions and names, plus its retained staging-only bootstrap record.
- Quiz question bank: 199 total, all 199 approved; zero draft/retired records.
- Active permanent lessons: 15.
- Learning content catalogue: 161 entries.
- Content checksums (excluding generated timestamps) match production exactly:
  - Quiz bank: 39f935c9266f228b0074e290d103b551
  - Learning catalogue: 9eb1f62b808f33e5cbe7b52050a53df1
- Hashes of the Quiz public RPC wrappers and private availability/start implementations match production exactly, including both start_my_quiz overloads.
- All four private Quiz tables have RLS enabled and no direct table grants to authenticated.
- Staging auth users: 0. Staging application learner rows: 0.
- Staging health advisor returned no findings.
- Staging security/performance advisor still reports fail-closed private tables with RLS/no policies, two authenticated SECURITY DEFINER functions (also present in production), ten unindexed foreign keys, four RLS init-plan notices and eight unused indexes. These are review items, not evidence that staging failed to synchronize. Do not remove indexes solely because staging has no workload.
- No authenticated end-to-end browser test was performed; staging has no test account. Database schema/content parity for the Quiz feature is verified, but this does not replace an authenticated UI test.

### Current recovery point / next steps

- Staging is synchronized for the current 2.3.x/2.4.0/2.4.1 database migration set and 2.4.0 Quiz content; 2.4.2 required no database migration.
- Production remains untouched.
- Before relying on staging for authenticated manual testing, create or configure a dedicated staging test user and configure the staging OAuth callback/redirect URLs as needed. Never copy production user data for this purpose.
- Keep the staging-only bootstrap record; do not remove it without a separate migration-history review.
- Treat unused indexes and performance-advisor notices as a separate future review. Do not perform speculative cleanup.
- Update 2.5.0 remains unstarted.


## 50. Update 2.5.0 Flashcards foundation — implementation and staging validation (2026-11-18)

### Scope and owner-approved rules

- Update 2.5.0 is the next feature after the released 2.4.2 baseline.
- Four Flash Recall modes: Word, Definition, Translation and Sentence Recall. Each has Beginner, Intermediate and Advanced difficulty.
- Each game lasts 60 seconds and presents four answer choices.
- Starting timers:
  - Beginner: memory 5s, answer 12s.
  - Intermediate: memory 3s, answer 9s.
  - Advanced: memory 2s, answer 6s.
- Fixed reduction after every selected answer, including an incorrect answer; a timeout is also incorrect and shortens the next timers:
  - Beginner: memory −0.5s, answer −1s.
  - Intermediate: memory −1.5s, answer −4s.
  - Advanced: memory −0.7s, answer −3s.
- Minimum timer floors (owner's latest correction):
  - Beginner: memory 2s, answer 5s.
  - Intermediate: memory 1.5s, answer 4s.
  - Advanced: memory 0.7s, answer 3s.
- Track words seen, correct, incorrect and unanswered (unanswered is included in incorrect). Maintain per-card correct/incorrect totals, streak and last result for Weak Memory prioritisation.
- Collection areas are Learning Collections, Weak Memory and My Collections. My Collections supports named collections, dictionary entries and fully custom question/answer cards; edit, move, reorder, remove, rename, delete and account sync.
- Free Flash Recall allowance: 3 completed games per local day. Premium: 10. Abandoning a game does not consume allowance. Only completed games are charged.
- Current Flashcards learning course remains English; Translation Recall uses the selected translation language. Chinese learning-course Flashcards remain unavailable in this update.
- Four-choice options are shuffled and deduplicated; if a set cannot provide four distinct choices for the selected mode, the game reports that instead of repeating an option.

### Repository implementation

- Production baseline: `main` at `65d0a35bab577adc15a0b1911661c222ed625739`.
- Implementation branch: `feature/update-2-5-0-flashcards`.
- Latest implementation commit at this record: `58d2ea72ae95997a5261ebd06a34c55ad5639702`.
- Added `flashcards.js` for the Flashcards page, four game modes, 60-second clock, timer progression/floors, answer-choice generation, Weak Memory review, collection/card management and account RPC calls.
- Updated `index.html` to load the Flashcards runtime, replace the Coming Soon placeholder, describe the feature, show Flashcard/Quiz allowance usage in Profile and clarify that deleting learning history removes Flashcard game history/mastery but preserves collections and custom cards.
- Updated `mock-testing.js` with Flashcard collection/card/mastery/session RPC behaviour, Free/Premium limits, account isolation and a separate mock allowance ledger that survives learning-history deletion.
- Added regression tests for 3/10 allowances, account isolation, collection creation/edit/move/delete, custom cards, mastery, learning-history deletion, daily allowance preservation and all difficulty timer values/floors.
- Added `tests/update-2-5-0/check-flashcards-page.mjs` to syntax-check inline application scripts and verify Flashcards page integration.
- Added `.github/workflows/update-2-5-0-flashcards-test.yml`; latest run #44258066606 passed JavaScript syntax, page integration, Mock User RPC, allowance, collection and timer regression checks.
- Added authenticated SQL integration test `supabase/tests/flashcards_authenticated_rpcs.sql`.

### Database design and staging rollout

- Added migration `supabase/migrations/20261118090000_swiftdictionary_update_2_5_0_flashcards_foundation.sql`.
- New storage is in the non-exposed `private` schema:
  - `flashcard_collections`
  - `flashcard_cards`
  - `flashcard_mastery`
  - `flashcard_sessions`
- All four tables have RLS enabled, no direct table privileges for authenticated/anon, owner indexes and user ownership enforced by authenticated RPC implementations. Public wrappers are SECURITY INVOKER; anonymous execution is revoked. The private implementation derives the owner only from `auth.uid()`.
- Custom-card result keys are checked against the authenticated user's actual custom card; session result payload is bounded. Collection/card deletion clears custom-card mastery; learning-history deletion clears game sessions and mastery but leaves the learner's collections/cards intact.
- Game start checks the same private allowance ledger used by the existing completion trigger, under the user's saved/effective timezone. Completion also writes the existing activity log so the server-side allowance trigger remains authoritative. The game cannot complete before the 60-second server-side window.
- Staging project only: `ivatvkfrtifgfheeaelj` (Singapore). The migration was applied and refined during implementation; exploratory staging migration records were reconciled to the single canonical version `20261118090000` / `swiftdictionary_update_2_5_0_flashcards_foundation`.
- Staging Flashcard limits verified: Free 3, Premium 10. Authenticated SQL integration test passed, including collection/custom-card creation, game completion, correct/incorrect/unanswered counts, abandoned-game no-charge behaviour and Free game-four rejection.
- Test transaction rolled back. Follow-up query verified zero CI auth users and zero rows in all four Flashcard tables.
- Staging security check: RLS enabled; authenticated has no direct SELECT/INSERT table privileges; anon has no SELECT; authenticated can execute only the six public wrappers; anon cannot execute them. Private schema remains unexposed.
- Performance advisor has no Flashcard-specific unindexed foreign key remaining after adding the card-owner index. Remaining advisor findings are pre-existing Quiz/application notices and unused indexes on the otherwise empty staging database; no speculative cleanup was performed.
- Production project `pzymiesazmpyvnfvsbsc` was read-only. It still has no Flashcard tables and retains the old Flashcard allowance values Free 5/Premium 12. Do not apply the migration or update production quotas until owner-approved release preparation.

### Legal/privacy planning update

- Flashcard collections/cards store user-authored text, dictionary references and optional examples/translations. These are private to the signed-in owner and are not shared publicly in this release.
- Mastery stores aggregate correct/incorrect counts, streak, last result and last-seen timestamp. Game sessions store mode, difficulty, counts and timestamps; raw selected answers are not stored as a per-question event stream.
- Account deletion cascades through `auth.users`; learning-history deletion removes sessions/mastery and activity history while preserving collections/cards. The UI now explains this distinction. A separate retention period for old completed game sessions has not yet been approved; the database currently retains them until the learner deletes history or the account is deleted.
- Production database region is Tokyo; staging is Singapore and contains no learner data. Before release, document the cross-border basis and all Supabase backup/log/subprocessor locations, not only the primary database region.
- Malaysia PDPA applicability remains a fact-specific legal question for a free individually operated public service; the Amendment Act 2024 and current JPDP circulars/guidelines require review of controller registration, breach notification, DPO thresholds and cross-border transfer safeguards. The adaptive weak-memory feature should be included in DPO/DPIA screening.
- Intended minimum age remains 16+. This is at or above the GDPR Article 8 consent threshold used by EU Member States (which can vary from 13 to 16), but a global country-by-country child-privacy screen and clear age notice are still needed.
- This remains planning, not legal advice or a compliance determination. No new personal data was created in staging tests.

### Outstanding work and release gates

1. Owner must manually test the branch preview with Mock User: all four modes, all difficulties, timer reductions/floors, 60-second finish, timeout, abandonment, answer variety, Weak Memory, dictionary additions, custom card CRUD, ordering/moving, account switching and daily allowance display.
2. Confirm the feature-branch Cloudflare Pages preview is available; it has not been browser-verified in this session.
3. Review UI responsiveness, accessibility, error states, translation quality and profile progress.
4. Decide an explicit retention period for completed Flashcard game sessions; verify data export/account deletion expectations and privacy notice wording.
5. Complete Malaysia/global privacy review before public friend onboarding. No legal conclusion is made here.
6. After owner acceptance, prepare a PR and production migration/deployment plan. Do not merge, deploy or modify production without explicit owner approval.
7. Branch-cleanup capability remains limited: the available GitHub integration exposes no branch-ref deletion action. The rolling three-branch policy and previously identified protected/retirement candidates remain in force; do not claim any branch was deleted.

### Recovery point

- Current worktree is recoverable from `feature/update-2-5-0-flashcards` at `58d2ea72ae95997a5261ebd06a34c55ad5639702`.
- The matching implementation and docs are intentionally separate: this record belongs only on `docs/master-development-record`; do not merge documentation into `main`.
- Production remains Update 2.4.2 and has not been changed by Update 2.5.0 work.


## 26. Update 2.5.0 — Flashcards implementation hardening and automated Mock User validation (2026-11-18)

### Scope and recovery point

- Continue the approved Update 2.5.0 implementation; no product-scope or allowance decision was changed.
- Implementation branch: `feature/update-2-5-0-flashcards`.
- Latest implementation commit: `b48933a2bef3a5affa6b7224c43521fdb3370be3`.
- Production baseline remains `main` at `65d0a35bab577adc15a0b1911661c222ed625739` (Update 2.4.2).
- No PR, merge, production deployment, production Supabase migration or production data operation was performed.

### Implementation hardening

1. **Round preflight and target eligibility**
   - Startup validates the selected recall mode and the availability of four distinct answer choices before creating a server session.
   - Round generation now evaluates every eligible target and only selects targets that can produce three distinct distractors in the selected mode. This prevents a random later round from failing after a session has started.
   - Failed preflight clears the temporary deck and does not consume allowance or create a server session.

2. **Dictionary-card editing**
   - Dictionary cards in a selected collection now use their saved front/back/example/translation content during gameplay.
   - The original dictionary word remains the stable mastery key, so editing its display text does not split or lose learning history.
   - Translation Recall still uses the selected translation language captured at game start.

3. **Collection management**
   - Deleting the selected collection resets the collection manager to its neutral state before re-rendering.
   - Moving a card appends it to the destination collection rather than reusing an arbitrary source position.
   - Browser regression coverage was added for collection deletion and edited dictionary-card gameplay.

4. **Game lifecycle protection**
   - Duplicate start requests are guarded while the server session is being created.
   - The start action is disabled while the request is pending.
   - During completion or abandonment, the gameplay screen is replaced by a saving state to prevent overlapping game actions.
   - The page reloads account-scoped data after the session is finalised.

5. **Course availability**
   - When the learner selects the Chinese learning course, Flashcards now explains that the current release supports the English learning course only, rather than rendering an empty page.

### Automated validation

GitHub Actions workflow run **#77** passed on commit `b48933a2bef3a5affa6b7224c43521fdb3370be3`:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44270148241

Both jobs passed:
- **Flashcards static and mock regression job:** JavaScript syntax checks, Flashcards page integration/inline script checks, and Mock User account, allowance, collection and timer regression tests.
- **Chromium Mock User browser job:** all **4 tests passed**:
  1. Create a collection, add a custom card and dictionary word, play Flash Recall, check four distinct options and timer reduction, abandon without allowance use, then verify completed allowance usage and Profile display.
  2. Verify collection isolation when switching between Free and Premium Mock Users.
  3. Verify deleting the selected collection returns the manager to its neutral state.
  4. Verify edited dictionary-card content appears in the selected Flash Recall set and gameplay.

The browser job ran against the repository's local static preview with the isolated Mock User adapter. It is automated browser evidence, not owner acceptance and not a live Supabase test.

### Database, privacy and legal boundary

- No SQL migration or staging database change was made during this hardening pass; the already-applied staging foundation and authenticated SQL integration evidence remain as recorded in the preceding archive.
- Production remains untouched and has no Flashcard schema; production Flashcard allowance rows remain Free 5/Premium 12 until an explicitly approved release migration.
- These code changes introduced no new personal-data categories, external data source, analytics or raw-answer telemetry.
- Existing data processing remains: private user-authored collection/card text, aggregate mastery and completed session metadata. The retention period for completed sessions is still undecided.
- The standing Malaysia PDPA and international/16+ privacy review, cross-border processing review, test/privacy notice and public friend-onboarding gates remain outstanding. This is planning, not legal advice or compliance certification.

### Mock User handoff and remaining gates

- The implementation and automated test suite are ready for owner Mock User testing.
- Expected Cloudflare Pages branch preview host is `feature-update-2-5-0-flashcards.swiftdictionary-testing.pages.dev`, with explicit mock activation via `?swiftMock=1`. This session could not independently verify that the Cloudflare preview deployment is reachable; do not claim the live preview is confirmed.
- Owner should test all four modes across Beginner/Intermediate/Advanced, timer reductions/floors, timeouts, 60-second completion, abandonment, Weak Memory, collection CRUD/order/move, selected translation language, account switching, allowances and responsive layouts.
- Do not create a PR, merge, deploy to production, apply production SQL or change production allowance rows until owner acceptance and explicit approval.
- Before public friend onboarding, decide completed-session retention and finish the Malaysia/global privacy and public notice review.

### Recovery point

Continue from `feature/update-2-5-0-flashcards` at `b48933a2bef3a5affa6b7224c43521fdb3370be3`. The Master Development Record and this archive remain on `docs/master-development-record`; never merge internal documentation into production `main`.


## 27. Update 2.5.0 — Flashcards redesign and Mixed Recall (2026-11-18)

### Scope and recovery point

- Owner approved the full Flashcards interface/gameplay redesign after Mock User testing.
- Implementation branch: `feature/update-2-5-0-flashcards`.
- Latest implementation commit: `3a96ba41e65da00b0cf5827ac6bbb71159f7c7f3`.
- Production baseline remains `main` at `65d0a35bab577adc15a0b1911661c222ed625739` (Update 2.4.2).
- No PR, merge, production deployment, production SQL migration or production data operation was performed.

### Owner-approved UI and gameplay changes implemented

1. Replaced the crowded Flashcards home with a dedicated banner and four colour-coded, shadowed recall navigation cards:
   - Word Recall — light blue.
   - Definition Recall — blue.
   - Mixed Recall — magenta.
   - Sentence Recall — purple.
2. Removed the Translation Recall mode; Mixed Recall randomly rotates Word, Definition and Sentence mechanics.
3. Recall navigation opens a compact setup overlay containing difficulty, card set and Begin. Difficulty/card set/start controls are no longer on the home page.
4. Added contextual card-set filters: all available words, common words, nouns, verbs, adjectives, adverbs, everyday phrases and subject/technical terms. Part-of-speech filters use the dictionary's `part` field.
5. Hid the My Collections manager UI without deleting its underlying account data or management implementation.
6. Reworked gameplay so the light-blue flashcard and four answer slots remain visible together. Answer choices are blacked out during memory; the flashcard is blurred and a “Pick your answers” overlay appears during answer time.
7. Added a yellow/orange combined memory/answer gauge beneath the flashcard.
8. Added a fixed three-second feedback phase. The flashcard is revealed again and the four choices show green correct / red selected-incorrect feedback without changing the overall layout.
9. Added an end-of-game result overlay with attempted, correct, incorrect, unanswered and accuracy totals. The learner must close it before returning to the home page.
10. Moved Weak Memory into a compact home-page action. Its overlay has Word, Definition, Mixed and Sentence tabs; selecting a missed card reveals a separate detail panel. Review is read-only and does not start a game or consume allowance.

### Mode-specific review data and staging

- Added `private.flashcard_review_items`, scoped by user, card key and recall mode. It stores only the minimum review metadata (incorrect count, last incorrect time and session reference), not additional answer text.
- Extended authenticated Flashcards data/start/complete functions to support Mixed Recall and return/update mode-specific weak-memory history.
- Extended learning-history deletion to remove the new review-history records as well.
- Both new migrations were applied to the isolated SwiftDictionary Indie Staging project only:
  - `20261118143000_flashcards_mixed_recall_and_review_history.sql`
  - `20261118150000_flashcards_review_history_deletion.sql`
- Staging SQL verification confirmed the review table, Mixed Recall session constraint, RPC review output, completion tracking and learning-history deletion integration.
- Security-advisor review showed the new private table as RLS-enabled with no direct policies, consistent with the existing private-schema/server-RPC access pattern. Existing unrelated advisor warnings remain unchanged. Production was not inspected or changed as part of this migration application.

### Automated validation

GitHub Actions workflow **#?** passed on commit `cb9a87eed12c1f8a8a055d5a7095fbc546f118d8`:
https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44282805958

Both jobs passed:
- JavaScript syntax and Flashcards page integration checks.
- Mock account, allowance, collection and timer regression tests.
- All **4 Chromium Mock User browser tests** passed:
  1. Simplified, colour-coded home and compact setup overlay.
  2. Word Recall answer masking, answer reveal and three-second feedback.
  3. Mixed Recall session and mode-specific weak-memory review.
  4. 60-second completion results prompt and close-to-return behaviour.

These tests use the isolated Mock User adapter and local static browser environment. They are not owner acceptance or live-authenticated Supabase browser testing.

### Legal and privacy planning

- The new review record is account-linked learning activity data. It is stored in the private schema and is not exposed as a direct public table.
- The review record is minimal and now participates in the existing authenticated learning-history deletion workflow.
- Malaysia's PDPA amendment provisions took effect in stages during 2025. The official JPDP materials identify DPO, breach-notification and cross-border-transfer guidance; whether specific duties apply depends on the actual processing/controller/processor circumstances and thresholds. Reassess before public/commercial expansion, subscriptions or broader analytics. This is a planning check, not legal advice or a compliance certification.
- Official references: [JPDP — PDPA Amendment Act 2024](https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024/), [JPDP — DPO FAQ](https://www.pdp.gov.my/en/faq/), [JPDP — Data Breach Notification Guidelines](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-data-breach-notification-dbn/).

### Mock User handoff and remaining gates

- Code and automated tests are ready for owner Mock User testing.
- No Cloudflare Pages branch-preview hostname was independently verified during this work. Open Cloudflare Pages → the SwiftDictionary project → Deployments, select the latest deployment for `feature/update-2-5-0-flashcards`, and use its displayed preview URL. Do not rely on a guessed hostname.
- Owner should test all four modes, all difficulties and card sets; 60/120-second timing; no repeated question targets before the deck cycle is exhausted (especially Mixed Recall); timeout animation and delayed results; abandonment/allowance; weak-review tabs/details; Chinese translation UI and prompt content; Dashboard statistics and in-place Weak Memory; main navigation, Lessons/Quiz banners, Dictionary filter overlay, account switching and responsive layout.
- My Collections remains hidden, not deleted. No production merge or production migration is authorised by this implementation work.
- Continue to keep the last three feature branches and retire older branches only under the agreed branch-hygiene rule.

### Owner feedback round 2 — implementation (2026-11-19)

The owner supplied nine additional requirements after Mock User review. They have been implemented on the existing feature branch:

1. **No repeated questions:** the current game tracks question/card keys and does not reuse a target until the eligible target pool has been exhausted. Mixed Recall selects only a sub-mode that still has unused targets, preventing the same card from repeating merely because the random sub-mode changed. Source deck entries and answer options are deduplicated.
2. **Simplified Chinese translation:** Flashcards now follows the existing Quiz language model: English remains the learning course, while Simplified Chinese can be selected as the translation language. The home page, setup, game phases, feedback, results and Weak Memory prompt are translated. Word Recall offers Chinese meaning choices; Definition Recall uses Chinese meaning prompts with English word choices; Sentence Recall can show a Chinese meaning hint. The separate Chinese learning course remains unavailable, matching the current Quiz scope.
3. **60/120-second challenge:** all four recall modes share a 60- or 120-second setup choice. The chosen duration is stored on the session and checked by the authenticated completion RPC. Added migration `20261119130000_flashcards_60_120_second_challenges.sql`; existing sessions default to 60 seconds.
4. **Time's Up transition:** the game is blurred behind an animated “Time's Up!” overlay for two seconds before the results prompt appears.
5. **Dashboard integration:** Dashboard now displays recent Flashcard games, attempted questions, recent accuracy and Weak Memory summary. Its Weak Memory action opens the review prompt in a global overlay and leaves Dashboard as the active page.
6. **Lessons/Quiz banners:** both pages now use banner headers in the same visual family as Flashcards, replacing their previous standalone page headings.
7. **Navigation styling:** primary navigation now uses bold white labels, contextual icons and drop shadows. Secondary navigation/filter controls also receive consistent shadows.
8. **Dictionary filters:** part-of-speech filters, saved words and alphabet filtering are grouped in one Filters overlay.
9. **Dashboard compatibility hardening:** Flashcard statistics now fail gracefully if the Flashcards RPC is not yet deployed. Corrected Dashboard section nesting and added explicit regression assertions for existing allowance and practice-insight content.

### Updated validation and deployment boundary

- Feature branch: `feature/update-2-5-0-flashcards`.
- Current implementation commit: `3a96ba41e65da00b0cf5827ac6bbb71159f7c7f3`.
- Pull request #12 remains open against `main`; it has not been merged.
- SwiftDictionary Update 2.5.0 Flashcards workflow run **#44471295332** passed on the current commit. Both the static/Mock regression job and Chromium Mock User browser job passed. The browser suite covers the 60/120-second selector, Time's Up/result ordering, Chinese UI and English recall prompts, Dashboard Weak Memory overlay, navigation banners and Dictionary Filters overlay.
- GitHub Actions local Supabase workflow run **#44471295226** passed both jobs. The `quiz-db-foundation` job applied the new duration migration in its isolated database and passed the authenticated Flashcards RPC SQL test; the companion local Auth/RPC job also passed the authenticated Chromium Quiz runtime tests.
- The separate 2.3.x regression workflow is not green. Its logs include a documentation file lookup for a SQL draft that intentionally lives only on `docs/master-development-record`, plus a local test-server Mock-mode expectation. These are workflow/environment alignment issues, not failures in the dedicated 2.5.0 Flashcards workflow. The Dashboard markup nesting issue found during review has been corrected and is covered by the passing 2.5.0 browser test.
- Mock User testing is ready from the code/CI side. Cloudflare's current branch preview URL is not verified in this session; retrieve it from the Cloudflare Pages Deployments screen rather than assuming a hostname.
- The new duration migration has **not** been applied to staging or production. Only the disposable CI database received it. No production database, production branch or production deployment was changed.
- No final ZIP is being issued at this intermediate development stage. The owner should complete the Mock User review before this phase is treated as accepted.

### Legal and privacy planning — this feedback round

- No new personal-data category, third-party processor, analytics event or raw-answer telemetry was added. The new `duration_seconds` value is a game setting attached to the existing private session record; Dashboard statistics aggregate existing session and Weak Memory records; Chinese translation uses existing dictionary content.
- Dashboard statistics and Weak Memory are a limited form of learning-performance monitoring/profiling. They do not make high-stakes or consequential decisions. Keep the purpose transparent in the privacy notice, preserve account-scoped access and existing learning-history deletion, and screen the feature under current JPDP DPIA/DPO guidance before broad public expansion.
- The 120-second option does not change the existing session-retention question. Completed session summaries remain until learning-history/account deletion unless a retention period is separately adopted.
- Malaysia PDPA applicability, the personal/household exemption, the project's free individually operated status, 16+ age gate, and cross-border processing (including production Tokyo and staging Singapore) remain fact-specific review items. No compliance conclusion is claimed; consult Malaysian counsel before public/commercial expansion or subscriptions.

### Recovery point

Continue from `feature/update-2-5-0-flashcards` at `3a96ba41e65da00b0cf5827ac6bbb71159f7c7f3`. Keep the Master Development Record and conversation archives on `docs/master-development-record`; do not merge internal documentation into production `main`.


## Owner feedback round 3 — Flashcards fixes (2026-11-19)

The owner tested the latest Update 2.5.0 Flashcards preview and supplied nine fixes. Implementation is on the existing `feature/update-2-5-0-flashcards` branch; no new release branch or production change was created.

### Changes implemented

1. **Challenge duration placement:** moved the 60s/120s choice out of the game setup prompt and into selectable pills on the right side of “Choose your Flash Recall”. The selected duration remains the session setting and is sent to the existing authenticated start RPC.
2. **Game setup visual refresh:** improved modal hierarchy, spacing, card treatment, dropdown/select appearance and indicators, focus state, and Cancel/Begin button styling.
3. **Game results visual refresh:** added a dedicated results-modal presentation, clearer score layout, and a more prominent Close control.
4. **Translation-panel regression:** changing the global translation language now refreshes the dictionary definition only when the definition modal is actually open. A previously viewed but closed word no longer reopens automatically while the learner is on Lessons, Quiz or Flashcards.
5. **Weak Memory review:** list and detail scroll positions are preserved when selecting an item; removed the redundant missed-count descriptions; redesigned the Close control.
6. **Unanswered question tracking:** the game now records the current question as unanswered when the challenge ends before the learner can answer. The existing completion RPC already converts incorrect/unanswered results into mode-specific Weak Memory records and mastery updates, so no new migration or data category was required. A round-recorded guard prevents double-counting.
7. **Navigation hover clipping:** increased the top breathing room around the main navigation so raised hover buttons are not cropped.
8. **Help-button consistency:** Flashcards help control now sits in the banner layout using the same aligned header approach as Lessons and Quiz.
9. **Flashcards icon alignment:** primary-navigation icons now share a consistent centered inline-flex box.

### Files and tests

- Updated `flashcards.js`, `index.html`, `tests/browser/update-2-5-0-flashcards.spec.js`, and `tests/update-2-5-0/check-flashcards-page.mjs`.
- Added browser regression coverage for unanswered timeout-to-Weak-Memory recording, translation changes not reopening a closed Dictionary definition panel across Lessons/Quiz/Flashcards, and Weak Memory list scroll persistence.
- Static JavaScript syntax, Flashcards page integration checks and Mock account/allowance/collection/timer regression tests passed in dedicated workflow **#44483060698**.
- Chromium Mock User browser suite in workflow **#44483060698** passed all **13 tests** (25.3 seconds). This includes the corrected duration-pill setup helper, 60/120-second game flows, timeout-to-Weak-Memory persistence, translation-panel non-reopening and Weak Memory scroll preservation.
- The initial browser run #44481421287 had seven failures. The next run #44482890022 passed 11/13; remaining issues were stale Dictionary modal selectors and browser auto-scroll in the test itself. These were corrected, and final run #44483060698 passed 13/13.
- Latest implementation branch head: `8db21bd42405adc3c37ff9764dbe4cc421b70dbf`.
- PR #12 remains open against `main`; it is not merged.
- Cloudflare Pages testing deployment for commit `8db21bd` succeeded. Verified branch preview: `https://feature-update-2-5-0-flashca.swiftdictionary-testing.pages.dev`; append `?swiftMock=1` to launch isolated Mock User mode.
- No production deployment, production Supabase migration, staging migration or production data operation was performed. No migration is required for these UI/round-state changes.

### Legal and privacy planning

- This is a bug-fix/UI refinement to existing account-scoped Flashcards learning history. It adds no new personal-data category, processor, analytics event, raw-answer telemetry or retention behaviour.
- Unanswered results feed the already-approved Weak Memory and mastery records; existing account scoping and learning-history deletion remain the applicable controls.
- Continue the standing Malaysia PDPA and international privacy review before wider public/commercial expansion. This implementation is not a legal compliance certification.

### Next gate and recovery

- Owner should manually retest the nine round-3 feedback items and relevant existing Flashcards, Quiz, Lessons, navigation and account-switching regressions using the verified testing preview.
- Do not merge PR #12, deploy production, or apply migrations to staging/production without explicit owner approval.
- Recovery branch: `feature/update-2-5-0-flashcards`; current branch head above. Keep all development records on `docs/master-development-record`.


## Owner feedback round 4 — final pre-polishing UI refinements (2026-11-19)

The owner completed the previous Mock User test and supplied four further refinements. These are implemented on the existing `feature/update-2-5-0-flashcards` branch; PR #12 remains open and unmerged.

### Changes implemented

1. **Dictionary filters:** replaced the fixed modal/backdrop with an inline expanding panel directly below the search row. The panel spans the same combined width as the search input and Filters button, pushes Explore Words downward, and opens/closes from the same Filters toggle. Escape also closes it; the toggle exposes its state through `aria-expanded`.
2. **Flashcards help position:** removed the late absolute-positioning override that kept the help button at the top-right. It now remains in the banner flex layout and is vertically centred at the right, consistent with Lessons and Quiz.
3. **Game result summary:** moved Accuracy to a prominent top-centred percentage display. Attempted, Correct and Incorrect now occupy separate, roomier stat cards with larger values, more padding and spacing. Mobile cards retain a two-column responsive layout.
4. **Lessons Simplified Chinese banner:** changing the translation language now translates the Lessons banner eyebrow, title and description to Simplified Chinese and restores English when switched back. Existing lesson-reader and Daily Learning translation flows remain intact.

### Files and validation

- Updated `index.html`, `flashcards.js`, `tests/browser/update-2-5-0-flashcards.spec.js`, and `tests/update-2-5-0/check-flashcards-page.mjs`.
- Browser coverage now verifies inline filter panel placement, width equality with the search row, pushing Explore Words down, toggle state, vertically centred Flashcards help, the enlarged Accuracy-first result summary, and Lessons banner translation.
- One initial static integration run failed because its assertion still expected the removed overlay. The static checker was updated to assert the new inline panel and its control relationship.
- The first browser run passed 12/13; the sole failure was a strict-mode ambiguity in the new test assertion (three stat cards matched). The assertion was narrowed to the first stat card; no application defect was found.
- Final workflow **#44487132337** passed JavaScript syntax, Flashcards page integration, Mock account/allowance/collection/timer regression checks and **all 13 Chromium Mock User browser tests** (25.7 seconds).
- Latest implementation branch head: `ade355db47efc5664b5b2de35a2aa744e2406c9a`.
- PR #12 remains open against `main`; it is not merged.
- Cloudflare Pages testing deployment for commit `ade355d` succeeded. Verified branch preview: `https://feature-update-2-5-0-flashca.swiftdictionary-testing.pages.dev`; append `?swiftMock=1` to launch isolated Mock User mode.
- No production deployment, production Supabase migration, staging migration or production data operation was performed. No migration is required for these UI-only refinements.

### Legal and privacy planning

## 28. Update 2.6.0 — Phase L: owner dashboard inspection (2026-11-20)

The owner completed a read-only inspection of the production/staging Supabase dashboards and the Cloudflare Pages production project. No TinyFish or temporary browser service was used; no provider settings or deployments were changed.

- Supabase production: project `pzymiesazmpyvnfvsbsc`, Tokyo (`ap-northeast-1`). Owner reports configurable database backups require Pro; no backup/PITR recovery period was confirmed. Production plan label was not separately reported. Google sign-in is enabled; “Skip nonce checks” and “Allow users without an email” are disabled. Auth log retention was not exposed in the inspected view.
- Supabase staging: project `ivatvkfrtifgfheeaelj`, Singapore (`ap-southeast-1`), Free plan; owner confirms no database backups. No PITR recovery window confirmed.
- Cloudflare Pages `swiftdictionary`: production connected to `main`; automatic production deployment enabled; preview deployments enabled for all non-production branches. Owner observed 236 deployments at inspection time. Build command and output directory are blank. Web Analytics is not configured. Observability/Logs area exists but no logs were displayed. Turnstile and Logpush were not found/not confirmed; do not infer all logging is disabled.
- Interpretation: no configurable database backup/PITR period is confirmed for either project; do not promise backup retention or immediate backup erasure on learner account deletion. Deployment retention/count is distinct from request/build/security-log retention. No visible logs does not prove no logs are retained. No numeric application-data retention periods are approved.
- The detailed owner-reported observations and caveats are recorded in [Phase L archive](conversation-archive/2026-11-20-update-2-6-0-phase-l-owner-dashboard-inspection.md) and the [Data Retention Schedule](reference/DATA-RETENTION-SCHEDULE-DRAFT-2026-11-20.md).

No production or staging database changes, source-code edits, migrations, deployments, legal approvals or user-data inspections occurred. Existing legal publication and Mock User readiness gates remain open.


## 29. Update 2.6.0 — Phase L retention confirmation and remaining-work handover (2026-11-20)

The owner confirmed the production Supabase subscription is Free using the Subscription Plan page; Project Settings → General did not show the plan label. Production and staging are both Free. The owner supplied further Cloudflare Observability screenshots. This follow-up is documentation/research only.

### Provider retention evidence

- Supabase's current [pricing page](https://supabase.com/pricing) lists **24 hours** of Auth Audit Logs and **1 day** of API & Database log retention on Free. Platform Audit Logs are not included on Free. The public plan comparison lists longer windows for paid plans, but SwiftDictionary will remain on Free for this work.
- Supabase's [Auth Audit Logs guide](https://supabase.com/docs/guides/auth/audit-logs) says authentication events are captured and stored by default in both external dashboard log storage and the project's Postgres `auth.audit_log_entries` table. Disabling Postgres writes does not disable external log storage. Auth Audit Logs and API/Database logs are distinct categories; Platform Audit Logs are a separate administrative feature.
- These published windows describe plan-level log history/retention. They do not prove physical erasure of every provider-held operational/security copy, nor define retention for every service-specific log or support record.
- Cloudflare Observability → Usage displayed **7 days** retention for the logs/traces represented on that page, 0.00/0.50 GB ingested that day, zero days at cap, and no dataset data for the selected period. Cloudflare Observability Events displayed no matching events in its selected view and a Workers Free allowance of 200,000 events/day.
- Cloudflare Observability → Logs showed HTTP request records for the SwiftDictionary Pages hostname in the selected last-hour view (43 served by Cloudflare, zero mitigated, zero served by origin; visible examples were GET `/favicon.ico`, 200 OK). This confirms request-log visibility in that view, not unique visitor counts or total traffic.
- It remains unverified whether Cloudflare's seven-day Observability Usage retention applies to the separate Pages HTTP request-log view, build logs, or every Cloudflare security/platform record. Web Analytics was not configured; Turnstile and Logpush were not found/not confirmed.
- The owner-confirmed Free plan means no configurable Supabase database backup/PITR window is available for the reviewed projects. Do not publish a numeric backup-retention promise or imply immediate backup erasure on individual account deletion.

### Documentation updated

- Updated [Phase L owner dashboard inspection](conversation-archive/2026-11-20-update-2-6-0-phase-l-owner-dashboard-inspection.md) with the production Free-plan confirmation and the Cloudflare request-log/Usage findings.
- Updated [Data Retention Schedule](reference/DATA-RETENTION-SCHEDULE-DRAFT-2026-11-20.md) with plan-level Supabase log history, Auth Audit Log storage distinctions, Cloudflare observations and remaining scope limitations.
- Created and indexed [Phase L retention confirmation and remaining-work handover](conversation-archive/2026-11-20-update-2-6-0-phase-l-retention-confirmation-and-status.md).
- Privacy Notice and Terms remain internal drafts. No numeric operator-controlled application retention periods are approved.

### Remaining Update 2.6.0 work

1. **Owner decision:** RESOLVED — owner approved a separate optional checkbox, unchecked by default and shown only when signed-out local saved words exist, to clear only that browser's designated anonymous saved-word collection. Preserve by default; never clear other accounts or unrelated browser storage.
2. **Contact channel:** verify external send/receive for the Tuta privacy mailbox and establish a monitored public privacy/support route. Do not publish it until verified.
3. **Technical account deletion:** initial implementation is on `feature/update-2-6-0-legal-privacy-security`; Singapore staging Edge Function `delete-account` version 2 is ACTIVE with JWT verification. The client dialog, optional local-clear checkbox, anonymous-storage separation, 15-minute auth-time check, verified-session UID derivation, global refresh-session revocation, Auth Admin deletion and final Auth lookup are implemented. Still required: hosted synthetic-account end-to-end tests, reauthentication/stale-session tests, cascade verification using seeded rows, failure/retry tests and interactive preview QA.
4. **Staging end-to-end validation:** use synthetic accounts through the Cloudflare preview; test Google OAuth, account deletion, saved-word/account isolation, shared-device behaviour and all existing feature regressions. No real learner data.
5. **Production security:** review production privilege differences and prepare a separately reviewed ACL remediation plan. Production remains untouched until explicit owner approval.
6. **Provider/data-flow verification:** inspect actual Google OAuth scopes and Supabase provider attributes; verify whether jsDelivr remains in the deployed asset path; check GitHub Actions retention and ensure logs/artifacts contain no personal data or secrets.
7. **Retention and deletion:** define operator-controlled application retention periods and event-based deletion rules after implementation/deletion coverage is verified. Keep provider logs/backups distinct from app records; retain Cloudflare's seven-day request-log scope as unverified pending clarification.
8. **Legal approval:** resolve the 16 open decisions in the Legal Approval Register, including Act 709 applicability/exemption, controller identity/capacity, processing basis, 16–17-year-old Regulation 3(3), DPO/DPIA, cross-border transfers, privacy requests, Terms enforceability and content licensing.
9. **DPIA and incident readiness:** complete the full DPIA recommended by the preliminary screening before broader public onboarding; assign an incident owner, verify provider escalation contacts and approve/rehearse the incident playbook.
10. **Publication/acceptance:** revise and obtain review of the bilingual Privacy Notice and Terms, then implement versioned Terms acceptance and separate Privacy Notice acknowledgement/consent as legally approved. Do not publish drafts or treat Mock User testing as release-ready until legal gates are resolved or a limited synthetic-only exception is explicitly approved.

No application source, migrations, schema/data, provider settings, Cloudflare deployment, production configuration or legal publication changed in this follow-up. All work remains on `docs/master-development-record`; implementation must use a focused feature branch from current `main`, with staging synthetic-only and production changes behind explicit approval.


## 30. Update 2.6.0 — Account-deletion foundation implementation (2026-11-20)

### Owner-approved behaviour

The owner approved an optional signed-out local saved-word clearing checkbox in the Profile → Preferences account-deletion confirmation dialog. It is unchecked by default, appears only when the current browser has anonymous saved words, and clears only that browser's dedicated anonymous saved-word collection. Account deletion must proceed independently of optional local clearing; if local clearing fails after account deletion, report the partial outcome. Other accounts and unrelated browser storage must not be cleared.

### Implementation status

Implementation is on `feature/update-2-6-0-legal-privacy-security`, not `main`.

- Added `account-deletion.js` with the Profile → Preferences deletion card/dialog, explicit confirmation, optional checkbox, reauthentication prompt, function invocation and truthful post-delete/local-clear messaging. The module listens for the initial Supabase auth session as well as later auth updates, so the deletion controls mount even when initial session retrieval completes asynchronously.
- Separated signed-out saved words into `swiftdictionary-anonymous-saved`. The loader preserves the old local key before the existing auth refresh handler clears it; anonymous saves are hidden while signed in and restored after sign-out. They are never merged into a signed-in account.
- Added `supabase/functions/delete-account/index.ts` and testable `security.ts`. The server requires a valid user JWT, explicit confirmation and an `auth_time` within 15 minutes; derives UID from verified Auth user; revokes refreshable sessions globally; deletes through Auth Admin; and verifies the user is no longer returned before success. Service-role access remains server-only. Already-issued access JWTs can remain valid until expiry.
- Deployed Edge Function `delete-account` to Singapore staging project `ivatvkfrtifgfheeaelj`, version 2, ACTIVE, with `verify_jwt=true`. No production Edge Function deployment occurred.
- Read-only staging FK inspection found SwiftDictionary application tables reference `auth.users` with `ON DELETE CASCADE`, including saved words, profile/preferences/entitlements, lesson and daily-learning records, Quiz sessions/questions/reservations, Flashcard collections/cards/mastery/review/session records and private learning allowance/test-access records. Supabase-owned Auth records also cascade. Supabase's own SCIM reference uses SET NULL; SwiftDictionary does not use SCIM.
- Added Node static safeguards, Deno tests for shared auth/origin helpers, Deno type checking and Cloudflare build-routing checks. GitHub Actions run for latest commit `d65dacfdeca8559fe08e284c715631316ae39f31` passed all steps: JavaScript syntax, static safeguards, Deno type check/unit tests and Cloudflare environment routing.
- The current implementation and recovery instructions are recorded in [the account-deletion implementation archive](conversation-archive/2026-11-20-update-2-6-0-account-deletion-foundation.md).

### Remaining validation and release gates

1. Confirm the Cloudflare preview is using the Singapore staging backend, then manually test the new UI. Do not use production or personal accounts.
2. Create a disposable synthetic staging account and seed synthetic rows; test recent-auth acceptance/rejection, global refresh-session revocation, full cascade deletion, Auth absence verification, and partial-failure/retry handling.
3. Test anonymous saved words across signed-out → sign-in → account switch → sign-out; confirm they remain hidden while signed in and return afterward. Test checkbox unchecked (preserve) and checked (clear only anonymous key) on a synthetic browser profile.
4. Complete mobile/desktop accessibility and regression checks; inspect browser console and Edge Function logs.
5. Keep production unchanged. Production ACL review/remediation, provider/data-flow checks, full DPIA, legal approvals, privacy-contact verification and unpublished legal-document review remain outstanding.

No account was deleted during this implementation. No production data, schema, migration, provider settings, Cloudflare production deployment or legal publication changed.


## 31. Update 2.6.0 — Owner feedback: deletion clarity and signed-out Flashcards banner (2026-11-20)

The owner reported confusion between account deletion and learning-history deletion, a browser-native confirmation prompt that could not show the account-deletion checkbox, and a missing Flashcards banner/title for signed-out visitors. The fixes are implemented on `feature/update-2-6-0-legal-privacy-security` only; see the [owner feedback archive](conversation-archive/2026-11-20-update-2-6-0-owner-feedback-ui-fixes.md).

- Preferences now presents a distinct **Delete Account** card immediately before a separately labelled **Learning history** card. The account action permanently deletes the SwiftDictionary account/cloud data; the history action only removes learning records and preserves the account, saved words, Flashcard collections/custom cards, profile and preferences.
- Learning-history confirmation now uses an in-site accessible dialog rather than `window.confirm()`. It clearly explains the narrower scope and does not clear local saved words.
- The optional local saved-word checkbox remains exclusively in the **Delete Account** dialog. It is unchecked by default and appears only when signed-out anonymous saved words exist in the current browser; it affects only that anonymous local collection.
- Signed-out Flashcards visitors now see the Flashcards banner/title and help control above the sign-in prompt.
- Added static regression assertions in `tests/update-2-6-0/account-deletion-static.test.mjs` for the two distinct deletion actions, in-site confirmation and signed-out Flashcards banner.
- Implementation files: `account-deletion.js`, `index.html`, `flashcards.js`, and the static regression test.
- Latest feedback implementation commit: `85965e1f70335b3ac85292d165bbe0584494f181`. GitHub Actions results for this push were not retrievable in the session; do not mark tests as passed until the branch workflow run is checked. No PR, merge or deployment was performed.
- No schema, migration, provider setting, personal-data category or retention behaviour changed. No account was deleted and production remains untouched. Existing legal/DPIA/provider and synthetic staging validation gates remain open.


## 32. Update 2.6.0 — Owner feedback round 2: sign-in, deletion UI and Terms page (2026-11-20)

The owner reported first-attempt Google sign-in failure, missing Delete Account Preferences UI, the learning-history action still displaying a browser-native prompt in the preview, and requested a Terms & Conditions page. See the [round 2 owner-feedback archive](conversation-archive/2026-11-20-update-2-6-0-owner-feedback-round-2-auth-deletion-terms.md).

### Corrective implementation on the feature branch

- **Google sign-in timing:** the sign-in/sign-out and Supabase auth-state listeners are now registered before the first awaited, network-backed account refresh. The first click is therefore not lost while account/profile/learning data is loading. OAuth startup errors are shown, and the sign-in control is protected from duplicate clicks and re-enabled on failure. The initial auth-state notification is ignored in the listener to avoid duplicate concurrent refreshes.
- **Delete Account rendering:** the root cause found in source ordering was a dynamically injected asynchronous `account-deletion.js` script loaded from `supabase-config.js` before the main inline app script had completed establishing its lexical bindings. This could race module initialisation and prevent the Preferences card from mounting. Removed the dynamic loader from `supabase-config.js` and Cloudflare `build.sh`; `index.html` now loads the module explicitly after the app, Daily Learning and Flashcards scripts.
- **Learning-history prompt:** current source uses the in-site `confirmLearningHistoryDeletion()` dialog, and the deletion handler does not call native `confirm()`. A preview still showing a browser prompt indicates stale/older preview source or a different event path; a targeted test now inspects the handler itself. Re-test the latest deployed preview before closing this defect.
- **Checkbox semantics:** the optional local saved-word checkbox is only in the separate Delete Account dialog, unchecked by default and conditional on anonymous saved words existing in the current browser. Learning-history deletion does not clear local saved words or the account.
- **Terms & Conditions:** added `terms.html` and a footer link. The public page is a noindex publication placeholder only; it explicitly says Terms are not yet published or binding and that no acceptance is collected. The full internal Terms draft remains unpublished pending Malaysian legal review and owner approval.

Files changed: `index.html`, `supabase-config.js`, `build.sh`, `terms.html`, and `tests/update-2-6-0/account-deletion-static.test.mjs`. Latest implementation/test commit: `a1a438b121f37f5af46da4a33417e3fa7d013214`. The account-deletion script URL is cache-busted as `account-deletion.js?v=2.6.0-r2`. Feature-branch pushes may trigger Cloudflare preview deployment automatically; its completion/deployed commit was not independently verified. No PR, merge or production deployment was performed. Cloudflare build routing guard run #62 passed on the latest commit: all 11 static regression tests, JavaScript syntax/account-deletion safeguards, Deno type-check, all 4 Edge Function unit tests and environment-routing checks passed. The separate Quiz database foundation workflow for the same commit was still running at the time of this update. Cloudflare preview deployment completion/deployed commit was not independently verified.

### Legal, privacy and release boundary

No new data category, analytics, tracking, processor, schema, migration, retention rule or provider permission was introduced. Terms publication and acceptance remain blocked on existing legal review, including controller identity/capacity, Malaysia PDPA applicability/legal basis, age 16–17 requirements, international transfers, contact route, retention, licensing, liability and dispute wording. Production remains untouched; no account was deleted or real learner data used. All destructive staging checks must use synthetic accounts. No merge or production deployment without explicit owner approval and completion of the existing Update 2.6.0 gates.


## 33. Update 2.6.0 — Owner feedback round 3: learning auth UI and preview regressions (2026-11-20)

The owner reported that the previous round's changes still appeared absent in the preview and requested a signed-out Lessons gate, consistent Lessons/Quiz sign-in UI following Flashcards, and restoration of the Flashcards banner/title after sign-out. The prior first-click sign-in, Delete Account visibility, Learning History confirmation and Terms-link feedback remains in scope. See the [round 3 owner-feedback archive](conversation-archive/2026-11-20-update-2-6-0-owner-feedback-round-3-learning-auth-ui-and-preview-regressions.md).

### Implementation and regression safeguards

- Added a static **Delete Account** card in Preferences before the distinct Learning history card. The account-deletion module now enhances a pre-existing card rather than returning early when it finds one. This removes a dependency on dynamic card creation for basic visibility.
- Kept Learning History deletion on the in-site dialog path; added a browser test that detects native browser dialogs and verifies none is raised by the Learning History action. The Terms & Conditions footer link is also checked in the browser test. The linked Terms page remains a non-binding placeholder.
- Added a Lessons signed-out panel and gate. While signed out, Daily Learning, lesson difficulty tabs, lesson library and lesson detail content are hidden, and signed-out users are not sent into lesson initialisation. The sign-in action opens the shared account dialog.
- Applied shared Flashcards-style sign-in card classes to Lessons and Quiz.
- Flashcards now responds directly to Supabase `SIGNED_OUT`, clears in-memory account-specific Flashcards data and renders the signed-out banner/title and sign-in panel immediately, without depending solely on a later app-level refresh event.
- Bumped the cache-busting query for `flashcards.js` and `account-deletion.js` to `v=2.6.0-r3` so browsers and edge caches request the revised modules.

### Files, commits and validation

- Files changed: `index.html`, `flashcards.js`, `account-deletion.js`, `tests/update-2-6-0/account-deletion-static.test.mjs`, `tests/browser/update-2-4-0-quiz-runtime.spec.js`, `tests/browser/update-2-5-0-flashcards.spec.js`, and `.github/workflows/quiz-db-foundation.yml`.
- Implementation commit: `2ea1ef3a05ceaa8decc53f50116613272b53bdbd`; browser test commit: `7ca090707b59b568bfda18dc5c4ad9bf1e954c51`; assertion correction: `cbaa404a6d5728bdff9bf9e819a952c2c8ad8399`; latest cache-bust/workflow commit: `52aa7a0b74a74f36c619c7e607fb501798dc7aa1`.
- Cloudflare build-routing guard run `44692571488` passed. The Quiz database foundation job passed. At the time of writing, the local Supabase/Auth/Chromium workflow was still running: authenticated Quiz runtime tests were in progress and the targeted Flashcards/Preferences browser tests were pending.
- Cloudflare Pages successfully deployed commit `52aa7a0` to the `swiftdictionary` Pages project. Immutable preview URL: https://ab8b4065.swiftdictionary.pages.dev . Branch preview alias: https://feature-update-2-6-0-legal-p.swiftdictionary.pages.dev .
- The earlier successful Cloudflare check on commit `7ca0907` also confirmed the branch alias was served by the `swiftdictionary` Pages project. The separate `swiftdictionary-testing` Worker build status must not be confused with the app's Pages preview.

### Legal, privacy and release boundary

No new data category, analytics, tracking, processor, schema, migration, retention rule or provider permission was introduced. Lessons now requires sign-in to access its learning content, using the existing account model. Terms publication and acceptance remain blocked on legal review and owner approval. Production remains untouched; no account was deleted and no real learner data was used. No PR, merge or production deployment occurred.


## 34. Update 2.6.0 — Account-deletion auth freshness and failure feedback correction (2026-11-20)

The owner reported that a Singapore-staging account-deletion attempt refreshed the page without signing out or removing saved words/progress, and authorised a code fix. The investigation confirmed two HTTP 401 responses from the Singapore `delete-account` Edge Function. The valid Google OAuth access tokens had no `auth_time` claim, while the function incorrectly required that claim within 15 minutes. Supabase's current JWT Claims Reference documents `amr` authentication-method entries with timestamps; it does not list `auth_time` as a standard access-token claim.

### Changes on the feature branch

- Replaced the `auth_time` freshness check with Supabase `amr[].timestamp` validation. Entries for `token_refresh` are ignored, preserving the 15-minute recent interactive-authentication requirement and fail-closed behaviour for missing/stale timestamps.
- Kept platform JWT verification enabled and preserved verified bearer-user lookup, server-derived deletion UID, global refresh-session revocation, Auth Admin deletion and final user-absence verification.
- Hardened the browser confirmation handler against default event navigation; 401 and other failures remain visible in the dialog and state clearly that account/data were not deleted. The account-deletion script cache key was bumped to `v=2.6.0-r4`.
- Added/updated AMR unit tests and static regression assertions.
- Detailed session record: [Account deletion auth freshness fix](conversation-archive/2026-11-20-update-2-6-0-account-deletion-auth-freshness-fix.md).

### Commits and validation

- Final feature-branch head recorded: `1676e65f19decb935e05f0aa26c78d8657fe623b`.
- Cloudflare build-routing guard run `44714423795` passed on that head, including JavaScript/static safeguards, Deno type check/unit tests and environment-routing checks. Intermediate failures were incorrect test expectations and were corrected before the passing run.
- Singapore staging Edge Function `delete-account` is now version 3, ACTIVE, with `verify_jwt=true`. Production function/configuration was not changed.
- The separate Quiz database foundation workflow was still running at archive time. Cloudflare Pages preview deployment was triggered by the feature-branch push, but its exact deployed commit was not independently verified.
- No synthetic end-to-end deletion test has yet been performed.

### Safety, legal and recovery gates

Do not repeat destructive testing with the owner's personal account. Next, verify the feature preview points to Singapore staging, then use a disposable synthetic staging account and seeded synthetic data to test recent OAuth authentication, stale/refresh-only rejection, global session revocation, all cascade deletions, final Auth absence, browser sign-out and truthful error/success feedback. Test anonymous local-word checkbox behaviour separately on a synthetic browser profile.

Tokyo production, production data/schema, migrations, provider settings and public legal documents remain untouched. Malaysia PDPA applicability, controller identity, minors' safeguards, cross-border transfer review, provider contracts, DPIA and legal approval remain open. No merge or production deployment without explicit owner approval and completion of the existing U2.6.0 gates.


## 35. Update 2.6.0 — Account-deletion success toast and allowance notifications (2026-11-20)

The owner manually tested account deletion on Singapore staging and confirmed that the account is deleted and the browser signs out. They reported that the success notification did not appear. They also requested a five-second notification when daily allowances are exhausted in Lessons, Quiz and Flashcards.

### Account-deletion success toast correction

- The success path already prepared a success message, but it inserted the toast before dispatching the account-deleted event. Sign-out listeners can refresh the page shell during that event.
- Updated `account-deletion.js` to dispatch the event first, then append a dedicated accessible success toast on the next event-loop turn. It is positioned above the page, uses `role=status` and `aria-live=polite`, and is removed after five seconds.
- The message retains the distinction between clearing and preserving signed-out local saved words on the current device.
- No deletion backend or data-removal behaviour changed.

### Lessons, Quiz and Flashcards allowance notifications

A code and test audit confirmed the requested behaviour already exists on the feature branch:
- Lessons checks remaining allowance after a successful permanent lesson completion.
- Quiz checks availability after a successful Quiz submission.
- Flashcards checks remaining allowance after a successfully saved game and refreshed allowance data.
- All three use the shared five-second toast, English/Simplified Chinese text and the configured allowance timezone reset explanation. Failed Lessons/Quiz RPCs do not trigger the exhaustion notification.
- Existing browser regression tests cover all three exhaustion cases; the Flashcards test also checks the toast hides after five seconds.

### Files, commits and validation

- Feature branch: `feature/update-2-6-0-legal-privacy-security`.
- Account-deletion toast commit: `3d73e488855ebba0b409fd62459ecdc2c04eac80`.
- Toast-handler correction: `71e78055033e3f1bfc912b84502ac8bd0ca9d0f8`.
- Static regression test update and final feature-branch head: `6d2c73e8ca2fd1553285e04f67f4af513518e31b`.
- Cloudflare build-routing guard run `44722035154` passed, including JavaScript syntax, deletion safeguards, allowance notification static assertions and environment routing.
- Quiz database foundation workflow passed. Companion Local Supabase Auth/RPC/Chromium browser validation was still running at archive time, currently in authenticated Quiz browser tests; no failure was reported in the visible job state.
- Cloudflare build script refreshes the account-deletion, Daily Learning and Flashcards cache keys to `r5`, `r4` and `r4` respectively.
- The owner's manual staging test confirms account deletion/sign-out. The revised success toast itself still needs visual confirmation in the updated preview.
- Singapore staging Edge Function remains version 3. No backend deployment, migration or production change was required.

### Legal and release boundary

No new data category, analytics, tracking, processor, schema, migration, retention rule or provider permission was introduced. Tokyo production remains untouched. Malaysia PDPA applicability, controller identity, 16–17-year-old safeguards, international transfers, provider contracts, DPIA and legal approval remain open. No merge or production deployment is authorised by this update.


## 36. Update 2.6.0 — allowance notification CI compatibility and legal-review deferral (2026-11-20)

### Owner confirmation
- The owner tested the updated Singapore staging preview and reported no issues.
- Account deletion completes and signs the user out as intended. This is the owner’s manual staging acceptance for the tested flow.

### Allowance notification CI diagnosis and fix
- The earlier Local Supabase/Auth/RPC browser workflow failed two Daily Learning notification assertions: permanent Lessons allowance exhaustion and Daily Topic allowance exhaustion.
- Root cause: the browser test adapter returns native JavaScript Promises from `rpc()`, while the application observer previously decorated only Supabase’s custom thenable RPC builder. Awaiting a native Promise bypasses an overridden `.then()` method.
- Feature branch fix commit: `5345c78ae6db1162118e777ecde329e75ec22cd9`. Native Promise results now receive a passive observer; the custom Supabase thenable path remains unchanged, avoiding duplicate RPC execution.
- Cloudflare build-routing guard passed on the fix commit (run `44731349283`).
- Cloudflare Pages deployed the fix commit successfully to preview `https://0416a496.swiftdictionary.pages.dev`; branch alias remains `https://feature-update-2-6-0-legal-p.swiftdictionary.pages.dev`.
- Local Supabase/Auth/RPC integration workflow run `44731349080` was pending at archive time; do not mark the full integration suite as passed until its final result is checked.
- A separate Cloudflare Workers build check for service `swiftdictionary-testing` failed on the same commit. The Pages preview itself succeeded. Triage whether this Worker service is part of the active product deployment before treating the check as a release blocker.

### Terms and legal/privacy status
- The owner requested deferral of formal legal/privacy review because external legal assistance is currently unavailable.
- Terms page wording was updated in commit `919a63c839cafad37d8f52bdbaad4184238da2ea` to state that publication is deferred while operator identity, contact details and data-handling disclosures are confirmed. It remains a non-binding placeholder and does not request or record acceptance.
- No complete Terms & Conditions or Privacy Notice is represented as legally reviewed. No unverified operator identity, address or operational contact has been invented or published.
- Formal review is **deferred, not completed or waived**. The owner’s decision does not remove applicable legal obligations or establish compliance.
- Open items: Malaysia PDPA applicability to actual operating circumstances; controller/operator identity and reliable contact; safeguards for users aged 16–17; data-flow and processor/subprocessor inventory; cross-border transfer basis; DPIA/DPO applicability; final Terms and Privacy Notice review.
- Official Malaysian Commissioner resources describe the PDPA as regulating personal-data processing in commercial transactions and provide privacy-notice and cross-border-transfer guidance. Applicability is fact-specific; this record is not a legal determination.

### Release boundary
- Feature branch: `feature/update-2-6-0-legal-privacy-security`.
- Latest known feature commit at archive time: `919a63c839cafad37d8f52bdbaad4184238da2ea`.
- No pull request or merge to `main` has been made.
- Tokyo production remains untouched. Singapore staging account-deletion Edge Function remains version 3.
- Legal/privacy risk remains visible in the release record. Terms publication and broad public onboarding are not represented as legally cleared.

Archive: `docs/conversation-archive/2026-11-20-update-2-6-0-allowance-ci-fix-and-legal-review-deferral.md`.


### 36.1. Follow-up validation and draft PR (2026-11-20)

- Additional test-maintenance commits: `a86a36989f7650c57130b15a90548f5e692e4673` (cache-busted Flashcards script assertion) and `d2cb49d12d7808fc58d401b873bcf53091e6041b` (update older Preferences regression assertions to verify distinct Delete Account and Learning history controls).
- Latest feature branch head: `d2cb49d12d7808fc58d401b873bcf53091e6041b`.
- Latest Cloudflare Pages preview deployed successfully: `https://43934340.swiftdictionary.pages.dev`.
- Cloudflare build-routing guard passed.
- Quiz database foundation passed.
- PostgreSQL 17 migration/allowance suite passed, including allowance ledger, data preservation and concurrency checks.
- Supabase CLI local Auth compatibility suite passed, including its security-advisor check.
- Flashcards static/mock checks passed; Chromium Mock User Flashcards browser suite passed all 17 tests.
- Local Supabase/Auth/RPC integration passed: Auth contract, prerequisite and U2.6.0 migrations, explicit least-privilege grants, Quiz RPC integration, 199-question export validation, authenticated Quiz browser tests, signed-out Flashcards/Preferences regressions, and permanent Lessons allowance-exhaustion regression.
- U2.6.0 local Supabase security advisor completed successfully with output `No issues found`.
- General Chromium browser smoke workflow `44732605727` remained in Playwright dependency installation at this record update; its test step had not started.
- Separate Cloudflare Worker check `Workers Builds: swiftdictionary-testing` failed (check run `136276269890`) while Pages deployment succeeded. No Wrangler configuration or Worker entrypoint exists in the repository. Confirm whether this external Worker service is still used before treating the check as irrelevant or disconnecting it.
- Draft PR #13 is open at https://github.com/WhiteWingCat/swiftdictionary/pull/13, targeting `main`; it is not merged. At update time it contained 147 commits and 25 changed files.
- Formal legal/privacy review remains deferred at the owner's request, not completed or waived. The Terms page remains a non-binding unpublished placeholder. No production deployment or Tokyo production changes were made.

Archive: `docs/conversation-archive/2026-11-20-update-2-6-0-allowance-ci-fix-and-legal-review-deferral.md`.


### 36.2. Browser regression alignment (2026-11-20)

- General Chromium smoke run on commit `9660345` reported 37 passed and 4 failed.
- Two failures were stale signed-out Lessons expectations. The established U2.6.0 decision is to show a Lessons sign-in panel and hide Daily Learning, lesson library, difficulty tabs and lesson details until sign-in. Application gating was preserved; the tests were updated to verify it.
- One failure expected the old `Privacy and data` heading. The test now verifies the separate `Delete Account` and `Learning history` controls in Preferences.
- One account-switching failure came from the minimal test-only Supabase auth mock having no `tables` fixture. The mock now seeds profile/preferences rows for initial and switched accounts and provides an empty saved-words table.
- Test update commit: `bf93bf925c489433f4cfde0add3748d992f25dd2`.
- Latest Pages preview deployed successfully: `https://d4db4cd1.swiftdictionary.pages.dev`.
- PostgreSQL 17 migration/allowance tests passed; Quiz database foundation passed; Flashcards static/mock and Chromium browser tests passed; Cloudflare build-routing guard passed.
- The general Chromium smoke suite and full local Supabase/Auth/RPC integration were rerun for `bf93bf9`; results were pending at this record update.
- Cloudflare Worker build check `Workers Builds: swiftdictionary-testing` failed again on `bf93bf9`; Cloudflare Pages deployment succeeded. No Wrangler configuration or Worker entrypoint exists in the repository; owner confirmation is required before disconnecting or ignoring that external service.
- Draft PR #13 remains open, draft and unmerged: https://github.com/WhiteWingCat/swiftdictionary/pull/13.
- Formal legal/privacy review remains deferred at the owner's request, not completed or waived. Terms publication remains deferred. Tokyo production remains untouched.

Archive: `docs/conversation-archive/2026-11-20-update-2-6-0-allowance-ci-fix-and-legal-review-deferral.md`.


### 36.3. Final U2.6.0 integration result for current feature head (2026-11-20)

- On feature head `bf93bf925c489433f4cfde0add3748d992f25dd2`, Local Supabase/Auth/RPC integration workflow `44733764841` completed successfully.
- Passed: U2.6.0 least-privilege migration and explicit grant checks; authenticated Quiz runtime; signed-out Flashcards/Preferences regressions; permanent Lessons allowance-exhaustion regression; local Supabase security advisors.
- Security-advisor output: `No issues found`.
- Quiz database foundation passed.
- PostgreSQL 17 migration/allowance tests passed.
- Flashcards static/mock and Chromium browser checks passed.
- Cloudflare build-routing guard passed; Pages preview deployed successfully at `https://d4db4cd1.swiftdictionary.pages.dev`.
- General Chromium browser regression workflow `44733764944` was still in Node setup at this record update; its test step had not started.
- Separate Cloudflare Worker check failed again; Pages deployment succeeded. Owner confirmation is still required on whether `swiftdictionary-testing` is a legacy/unused Worker service.
- Draft PR #13 remains open, draft and unmerged. No production deployment or Tokyo production change has occurred.
- Formal legal/privacy review remains deferred at the owner's request, not completed or waived; Terms publication remains deferred.

Archive: `docs/conversation-archive/2026-11-20-update-2-6-0-allowance-ci-fix-and-legal-review-deferral.md`.


## 37. Update 2.6.0 — current handover, PR correction and production ACL audit (2026-11-20)

- Owner confirmed GitHub was disconnected from the Cloudflare `SwiftDictionary-testing` project and that it is no longer used. Treat its old separate Worker build check as obsolete; the active Cloudflare Pages project remains separate.
- Current feature head remains `bf93bf925c489433f4cfde0add3748d992f25dd2`; draft PR #13 remains open, unmerged and unapproved. Its body was corrected to remove any suggestion that the current account-deletion flow had passed owner testing.
- Latest PR checks passed: Cloudflare build routing guard `44733764948`, Quiz database foundation `44733764841`, 2.3.x allowance/dashboard regression `44733764944`, and Flashcards checks `44733765083`. Recorded local Supabase/Auth/RPC integration and local security-advisor checks passed. These results do not replace hosted production verification.
- Owner confirms Google sign-in and account isolation work in Singapore staging. The current account-deletion flow remains untested by the owner. Use a disposable synthetic staging account; do not use the owner's personal account.
- Read-only comparison of Tokyo production and Singapore staging found RLS enabled on inspected public application tables in both, but residual production grants remain: broad anon/authenticated access on `daily_activity_sessions`, anon SELECT on `learning_plan_limits`, anon privileges on several identity sequences, PUBLIC/anon/authenticated EXECUTE on two trigger-only guard functions, and broader `postgres` default privileges. Staging has the intended narrower grants/defaults.
- Production also has a legacy `lesson_practice_results_id_seq` without an ownership dependency; the production-owned sequence is `lesson_practice_results_id_seq1`. Do not drop the apparent orphan as part of this update.
- Staging has U2.6.0 migrations `20261119112433` and `20261120023718`; production does not. A separate unapproved SQL remediation and rollout draft was added at `docs/reference/UPDATE-2.6.0-PRODUCTION-ACL-REMEDIATION-DRAFT.md`. No production grants or defaults were changed.
- Hosted Security Advisor findings include eight intentional private-schema RLS/no-policy INFO findings, two intentional SECURITY DEFINER RPC warnings, and one leaked-password-protection warning. Do not treat these as a clean security certification.
- Formal legal/privacy review remains deferred at the owner's request, not completed, waived or cleared. The internal Privacy Notice/Terms drafts remain unpublished; the public Terms page remains a non-binding placeholder.
- Supabase changelog reviewed: Data API table exposure defaults were enforced for existing projects on 2026-10-30; Supabase CLI v3 changed local/hosted targeting and confirmation behaviour in November. Future CLI upgrades require explicit remote targeting/approval safeguards.
- No production migration, ACL change, Edge Function change, OAuth setting, Cloudflare Pages configuration, deployment or data mutation was performed.

Archive: `docs/conversation-archive/2026-11-20-update-2-6-0-current-handover-and-production-acl-audit.md`.


## 38. Update 2.6.0 — account deletion confirmation and ACL second review (2026-11-21)

- Owner confirmed that account deletion works in the current Singapore staging preview. Mark the current staging deletion test as owner-confirmed passed; do not infer production readiness.
- Technical ACL review is being handled by the assistant; the owner can review the written plan but is not expected to inspect or author SQL. Plan: `docs/reference/UPDATE-2.6.0-PRODUCTION-ACL-REMEDIATION-DRAFT.md`.
- Second review found environment-specific identity sequence naming for `lesson_practice_results.id`: staging uses `lesson_practice_results_id_seq`, production uses `lesson_practice_results_id_seq1`. The existing migration's static name would target the wrong production sequence.
- Added feature-branch migration `20261121090000_update_2_6_0_acl_drift_correction.sql`, dynamically resolving the owned sequence via `pg_get_serial_sequence`, removing anonymous access to plan limits and account sessions, and removing unintended authenticated non-DML privileges on sessions. No sequence is renamed or dropped.
- Added `supabase/tests/update_2_6_0_acl_drift_correction.sql` and dedicated workflow `.github/workflows/update-2-6-0-acl-test.yml`. Await CI before claiming validation.
- The initial migration's global `postgres` default-function EXECUTE revoke still requires a cross-schema impact review before production rollout.
- PR #13 remains draft/open/unmerged. No production or staging database changes have been made.
- Account deletion staging test is now marked passed in the PR body; remaining checks include the new ACL CI run and any outstanding staging regression checks.


## 39. Update 2.6.0 — ACL workflow isolation and default-privilege compatibility (2026-11-21)

- Read-only inventory in Tokyo production and Singapore staging shows 49 postgres-owned functions in `extensions`, 32 in `private`, and 31/29 in `public` (production/staging). A global default-function EXECUTE revoke affects future functions created by postgres across schemas, not only public.
- The new ACL correction migration now restores the historical default PUBLIC EXECUTE only for future functions in `extensions`, while public/private application defaults remain restricted. Added local regression probes for public and extensions function defaults.
- The first ACL CI workflow attempt replayed the entire historical migration chain and failed at an unrelated pre-existing 2.2.0 reconciliation assertion before reaching U2.6.0. The dedicated workflow was redesigned to create an isolated Supabase workspace, apply a synthetic app baseline, apply the U2.6.0 ACL migrations, rename the practice-results identity sequence to production's name, and assert the corrected grants.
- Latest isolated workflow run at the time of this update is pending/in progress; no passing result is claimed yet.
- Owner confirmed account deletion works in Singapore staging. PR #13 now records this as an owner-reported staging pass, not a production test.
- PR #13 remains draft/open/unmerged. No production or staging DB changes were made.


## 40. Update 2.6.0 — ACL regression passes; merge approval received (2026-11-21)

- Owner explicitly approved merging PR #13 to main after remaining checks pass.
- The isolated PostgreSQL 17 ACL drift regression passed on current feature head 6314c15d9eae801ef64ba00bce7b41d27fb168cd: PR run 44854645412 and push run 44854640598 both succeeded.
- The test builds a synthetic baseline matching audited staging, then overlays the known production ACL differences, renames the owned practice-results identity sequence to production's name, applies the corrective migration and verifies final grants/defaults.
- Verified: anonymous access removed from Daily Learning sessions and plan limits; authenticated sessions retain only SELECT/INSERT/UPDATE; anonymous privileges removed from all three relevant identity sequences; public function defaults remain restricted; extensions function defaults retain prior PUBLIC EXECUTE behavior.
- CI changes were limited to disposable local Supabase/PostgreSQL. No hosted staging or production database was modified.
- Cloudflare build routing guard, Flashcards checks, and 2.3.x allowance/dashboard regression checks have passed on the same head. Quiz database/Auth integration is still running at the time of this record update.
- PR #13 remains open/draft/unmerged while the remaining checks finish. Owner approval is recorded; merge is not yet performed.
- Formal legal/privacy review remains deferred, not cleared. Production ACL rollout remains separate and unapproved.


## 41. Update 2.6.0 — PR #13 merged to main (2026-11-21)

- Owner explicitly approved the merge after the release checks passed.
- PR #13, “U2.6.0 — Account deletion and privacy/security safeguards”, was marked ready and squash-merged into `main` on 2026-11-21 at 02:20:20 UTC.
- Merge commit: `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Verified GitHub reports PR #13 closed/merged and `main` points to the merge commit.
- Latest feature-head CI passed: Cloudflare build routing, 2.3.x allowance/dashboard, Quiz DB/Auth/RPC integration, Flashcards, and U2.6.0 ACL/static regression. Local Supabase security advisor reported “No issues found”.
- Account deletion remains owner-confirmed passed on Singapore staging; not a production test.
- No manual production deployment, Tokyo production database migration, ACL change or Edge Function deployment was performed. Merging may cause Cloudflare Pages to automatically build/deploy if the configured production branch is `main`; that platform-side deployment status was not independently verified here.
- Production ACL remediation remains a separate task and is not approved for execution. Formal legal/privacy review remains deferred, not cleared; Terms placeholder remains non-binding and unpublished.


## Update 2.7.0 — planning finalized and development prepared (2026-11-21)

**Status: planning finalized; application development prepared, Phase 0 audit not yet started.**

- Scope: Chinese Dictionary Expansion & Chinese course lessons, following the roadmap and the completed U2.6.0 merge.
- Application baseline: `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Application feature branch created from main: `feature/update-2-7-0-chinese-dictionary-lessons`.
- Full approved scope, phased implementation sequence, QA gates and legal/content-risk checklist: [Update 2.7.0 Development Plan](UPDATE-2.7.0-DEVELOPMENT-PLAN.md).
- Dated session archive: [2026-11-21 planning finalization](conversation-archive/2026-11-21-update-2-7-0-planning-finalization.md).
- Owner-approved dictionary work: initial target at least 500–700 new unique characters with no hard cap if quality permits; replace the ineffective Chinese filter with Pinyin A–Z and multi-category filters; allow combined filtering; preserve one character per grid card, keep the grid character-only (no pinyin displayed on cards), and retain existing character/pinyin search and detail pinyin.
- Permanent Chinese Lessons visual invariant: when Chinese lesson content displays pinyin, place it directly below the corresponding Chinese character/text; never above or beside it. **Do not add pinyin to Chinese Dictionary grid cards**; preserve their existing character-only presentation.
- Owner-approved Chinese Lessons work: reuse existing lesson architecture; Beginner/Intermediate/Advanced; minimum 17 permanent lessons and 112 practice questions, matching the actual English library (7/5/5 lessons and 44/34/34 questions by difficulty); English support always available; pinyin throughout; English-to-Chinese practice and English/Chinese structural comparisons; grammar, vocabulary, expressions, idioms, proverbs, verified quotations and selected poetry.
- No timer. Preserve existing translation refresh, answer state, progress, completion, allowance, account isolation and sync behavior. Prepare reusable content for U2.8.0.
- Legal/privacy review remains deferred, not cleared. Review Malaysia and general international risks and all dictionary/quote/poetry/translation licensing; do not claim legal compliance.
- Initial source retrieval limitation was resolved during Phase 0 by retrieving the actual Git blob for `index.html`; the older README is stale and was not used as the implementation specification.
- No application files, database, production settings or deployment were changed during planning preparation.

### Next recovery step

Start Phase 0: retrieve and audit the current app source, dictionary catalogue/data structure and counts, filter implementation, lesson architecture, translation refresh path, allowance/progress integration, tests, CI and third-party notices. Do not bulk-add content or author the lesson library until this audit is complete. Keep implementation on the feature branch and internal documentation on this branch.

Owner clarification (2026-11-21): do not add pinyin to Chinese Dictionary grid cards. The character-above-pinyin layout requirement applies to Chinese Lessons only.


### Update 2.7.0 — Phase 0 baseline audit completed (2026-11-21)

- Audited application source on `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`; actual `index.html` Git blob was retrieved and inspected. Earlier empty file-content responses were a connector limitation, not an empty source file.
- Current Chinese dictionary: 206 unique single-character entries, all with pinyin; 12 polyphonic entries (221 listed readings); no multi-character grid entries; no category metadata. Existing broad `part` values are `汉语词汇` (187) and `汉字` (19), not useful learning categories.
- Chinese A–Z filter is currently hidden/disabled, and the existing English part-of-speech category row is hidden for Chinese. Character and pinyin search already work.
- Owner correction: keep Dictionary grid cards character-only; do not add pinyin to grid cards. The vertical character-above-pinyin layout rule applies specifically to Chinese Lessons.
- Current English Lessons baseline: 17 lessons and 112 questions — Beginner 7/44, Intermediate 5/34, Advanced 5/34. Existing `lessonZh` contains translations of those English lessons, not a Chinese-language course. U2.7.0 Chinese Lessons target is therefore at least 17 lessons/112 questions.
- Current lesson reader has no pinyin rendering. New Chinese course needs its own lesson dataset and pinyin-aligned reader; use authored phrase/sentence-level pinyin to handle polyphonic characters and context-dependent readings.
- Supabase `lesson_progress` and `lesson_practice_results` have no learning-language identity; unique keys and catalogue validation assume English. The private content catalogue check permits only `en`, and completion/replay functions hardcode English. A backward-compatible additive migration is required to support Chinese course identity while preserving legacy rows as English.
- Existing completion quota counts by user and activity type across language codes; keep the same shared lesson allowance rather than creating a separate Chinese quota. Preserve atomic completion, authenticated RPCs, RLS and personal testing exemption.
- Existing tests include static checks, Playwright Chromium, PostgreSQL 17 and disposable local Supabase Auth/RPC integration. Dedicated Chinese dictionary filter and Chinese lesson tests must be added.
- Third-party notices identify Hanzi Writer 3.7.3 (MIT) and Hanzi Writer stroke data (Arphic Public License). Current dictionary entries lack per-entry source/provenance metadata; content sourcing and licensing must be recorded before release.
- Detailed findings and scope are in [Update 2.7.0 Development Plan](UPDATE-2.7.0-DEVELOPMENT-PLAN.md), Section 9.
- No application code, hosted Supabase schema, production settings or deployment changed during Phase 0.

**Next step:** proceed to Phase 1 design and implementation on `feature/update-2-7-0-chinese-dictionary-lessons`. Add a dedicated Chinese filter UI/state while preserving character-only cards, then design the additive language-aware Lessons migration and pinyin-aware reader. Any SQL migration remains local/CI-only until explicitly approved for hosted environments.


### Update 2.7.0 — Phase 1 dictionary filter foundation (2026-11-21)

- Application feature branch head: `510954a3e2c037ab7f231ddaeec3247299c08181`.
- Implemented Chinese Pinyin A–Z initial filtering across every slash-separated reading; combines with existing character/pinyin search and supports polyphonic entries.
- Added multi-category filter UI/state with ten agreed categories. The row remains hidden until `categories` metadata is populated; the current 206 Chinese entries are not yet categorized.
- Preserved character-only Chinese Dictionary grid cards. Pinyin is not displayed on the grid; the pinyin-below-Chinese rule remains specific to Chinese Lessons.
- Added static/data checks, three Chromium tests and dedicated CI workflow. Final CI run [44867027510](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44867027510) passed.
- No dictionary expansion/category assignment, Chinese Lessons implementation, hosted Supabase schema change or production deployment has occurred yet.
- Data-source research: Unicode Unihan 18.0.0 is the primary candidate for character definitions/readings and core-priority signals under Unicode License v3; CC-CEDICT is an optional secondary CC BY-SA 4.0 source. Licensing and validation notes are in Section 9 of the U2.7.0 plan.
- Language-aware lesson progress design is documented in [U2.7.0 lesson-language schema design](reference/UPDATE-2.7.0-LESSON-LANGUAGE-SCHEMA-DESIGN.md). It remains proposed only; no SQL has been applied to hosted environments.

**Next:** source-backed Chinese dictionary expansion and category classification in small validated batches. Keep the pinyin display rule scoped to Lessons only.


### Update 2.7.0 — first Chinese dictionary content batches (2026-11-21)

- Feature branch now contains 100 new HSK Level 1 character records in `data/chinese-characters.js`; combined dictionary count is 306 unique characters (206 existing + 100 additions).
- Each new entry has course marker, pinyin, English/Chinese definitions, example, related terms, learning note, one or more of 11 category tags, HSK level and source IDs.
- Chinese Pinyin A–Z, polyphonic initials, category filtering and combined filters are implemented. Dictionary grid remains character-only; do not add pinyin to grid.
- Added a user-facing [Dictionary Data Sources](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-2-7-0-chinese-dictionary-lessons/data-sources.html) attribution page and source registry. CC-CEDICT-derived dictionary glosses are attributed and kept free under CC BY-SA 4.0; Unihan 18.0.0 pinyin and the HSK candidate list have their own notices.
- CI run [44868243733](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44868243733) passed the static/data checks and four Chromium browser tests.
- Current target candidate pool: up to 1,295 new characters from HSK 3.0 Levels 1–5 after deduplication, subject to validation. The HSK source warns it was OCR-processed and not extensively proofread.
- Next: complete the remaining 48 HSK Level 1 candidates, then continue Levels 2–5 in small reviewed batches. No Chinese Lessons code or hosted Supabase schema changes yet.


### Update 2.7.0 — dictionary expansion and Chinese Lessons content complete; QA in progress (2026-11-21)

**Current application branch:** `feature/update-2-7-0-chinese-dictionary-lessons`  
**Current plan:** [UPDATE-2.7.0-DEVELOPMENT-PLAN.md](UPDATE-2.7.0-DEVELOPMENT-PLAN.md)

- Supersedes the earlier initial 100-character milestone: `data/chinese-characters.js` now contributes **519 new single-character records**, bringing the combined dictionary to **725 unique entries** (206 existing + 519 additions).
- Pinyin A–Z, 11 character categories, combined filtering, polyphonic initial matching and the existing search are implemented and browser-tested.
- **Dictionary cards remain character-only. Do not add pinyin to the grid.** The character-above-pinyin rule is for Chinese Lessons only.
- Chinese Lessons content is now **17 lessons / 112 questions**: Beginner 7/44, Intermediate 5/34, Advanced 5/34. English support is always rendered; Chinese text is followed by pinyin directly below, then English support.
- Lesson data has a dedicated static validator for bilingual text/pinyin, question structure, lesson counts and Supabase catalogue IDs. Browser coverage checks the 7/5/5 difficulty libraries and vertical Chinese/pinyin/English layout.
- Additive language-aware progress/catalogue migration: `20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql`. PostgreSQL/CI database foundation job passed the migration and its SQL regression suite. The companion local Supabase Auth/RPC integration and security-advisor job is still being monitored.
- U2.7.0 dictionary/lesson CI workflow **#44875595145** passed: 725 dictionary entries (519 new), 17 lessons, 112 questions, five dictionary Chromium checks and one Chinese lesson layout test.
- Source notices are committed: `data-sources.html`, `data/CHINESE-DICTIONARY-SOURCES.md`, and `THIRD_PARTY_NOTICES.md`. CC-CEDICT-derived gloss adaptations are identified as CC BY-SA 4.0; Unihan 18.0.0 and HSK candidate-list notices are included. Existing 206 dictionary entries still need their own provenance review. Formal legal/privacy review remains deferred, not cleared.
- No hosted Supabase migration has been applied. No production settings, production database or deployment have been changed.

**Next:** complete local Supabase Auth/RPC and advisor checks; run the full English Lessons/Daily Learning browser regression; test Chinese completion/progress isolation; complete linguistic and licensing review; then owner preview. Do not merge, apply the migration to hosted environments, or deploy without explicit approval.


### Update 2.7.0 — full browser regression passed (2026-11-21)

- Application feature branch head: `27739f86162ddd2b7251ebe52ca98490f224782e`.
- U2.7.0 workflow #44876433048 passed all checks: dictionary static/data (725 total, 519 new), Chinese Lessons content validator (17/112), full English Lessons/Daily Learning regression **26/26**, dictionary filters **5/5**, Chinese Lessons bilingual layout **1/1**.
- The full suite includes Chinese lesson completion and English/Chinese progress isolation.
- Quiz database foundation workflow #44876433049 PostgreSQL job passed. Local Supabase Auth/RPC integration was still in progress at this snapshot.
- Dictionary grid remains character-only; the Chinese text → pinyin → English vertical layout is specific to Lessons.


### Update 2.7.0 — latest full regression and category coverage (2026-11-21)

- Current application feature branch head: `c0d986a31b2905639c5ddd28b59e63d4c217edf2`.
- U2.7.0 workflow #44876788816 passed: 725 unique dictionary entries (519 new), 17 lessons / 112 questions, 26/26 full Lessons/Daily Learning browser regressions, 5/5 dictionary filter tests, and 1/1 Chinese Lessons layout test.
- The original 206 Chinese dictionary entries receive their 11 category labels and additional pinyin readings through `window.SWIFT_CHINESE_METADATA` in `data/chinese-characters.js`; the app applies this metadata at runtime. The 519 additions have categories in their own records. All 725 are therefore covered; no duplicate inline mapping is required.
- Quiz database foundation job #44876788818 passed. Companion local Supabase Auth/RPC integration run #44876433049 previously passed the U2.7.0 migration and SQL regression, authenticated Quiz/Flashcards/Lessons regressions, and local Supabase security advisors (“No issues found”). The same integration is being rerun against the latest branch head.
- No hosted migration, merge or deployment has occurred.


### U2.7.0 legal/privacy review note (2026-11-21)

A current Malaysia PDPA and general international risk check was added to [the U2.7.0 Development Plan](UPDATE-2.7.0-DEVELOPMENT-PLAN.md), Section 12. It covers the phased 2024 PDPA amendments, DPO thresholds (including regular/systematic monitoring), 72-hour breach notification guidance, data portability, 13-class registration, cross-border transfers for the existing Singapore/Tokyo service regions, 16+ audience considerations under GDPR/UK Children's Code, and dictionary/poetry licensing. U2.7.0 adds only a course-language dimension to existing user-linked progress; no new identity fields, sensitive data or telemetry were added. This is risk planning only; formal legal review remains deferred and no legal clearance is claimed.


### Update 2.7.0 — local Supabase integration and security checks passed (2026-11-21)

- Current application feature branch head: `c0d986a31b2905639c5ddd28b59e63d4c217edf2`.
- Quiz database foundation workflow #44876788818 and companion local Supabase Auth/RPC integration both passed against the current branch.
- The companion job applied the U2.7.0 language-aware lesson migration to an ephemeral local Supabase instance only; Auth contract and SQL regression passed.
- Authenticated Chromium regression results: Quiz runtime 12 passed, Flashcards 3 passed, Lessons/Daily Learning allowance 2 passed.
- Supabase security advisors reported “No issues found.”
- This was local CI only. No migration was applied to hosted Singapore staging or Tokyo production; no merge or deployment occurred.


## U2.7.0 Phase 0 audit findings (2026-11-21)

The actual application source on `main` was retrieved and audited. The Chinese dictionary contains 206 unique single-character entries with no duplicates and populated core fields. Twelve entries have multiple pinyin readings. Existing `part` metadata only distinguishes `汉语词汇` and `汉字`; planned semantic categories require new metadata. Preserve the existing Chinese grid layout: character only plus saved marker; do not add pinyin to dictionary cards.

The current English Lessons library contains 17 permanent lessons and 112 questions. The existing `lessonZh` object translates these English lessons into Chinese; it is not a Chinese course. Chinese Lessons are currently unavailable in the UI. The new course needs its own authored catalogue, with explicit pinyin paired directly below Chinese content in lesson reader/practice UI. English must remain available as support independently of selected translation language.

The current progress and practice-result tables have no language field; the content catalogue is English-only; lesson-start validation, completion/replay RPCs and completion activity logging hardcode `en`. A backward-compatible additive migration must add language-scoped progress and practice records, support Chinese catalogue rows and use the correct language in validation/activity logging while preserving existing English progress. Existing allowance logic counts the shared lesson activity type across languages; preserve Free 5 / Premium 15 shared daily permanent-lesson limit unless the owner explicitly approves a change.

Phase 0 confirms the Chinese course target should be at least 17 lessons and 112 practice questions, matching the audited English library. Current CI build/deploy, Chromium smoke, PostgreSQL allowance/ACL, local Auth, Quiz and Flashcard jobs were inspected and passed. Dedicated Chinese course tests remain to be added. No app source, database or deployment changes were made during this audit.


## Update 2.7.0 — implementation checkpoint (2026-11-21)

Reviewed feature branch `feature/update-2-7-0-chinese-dictionary-lessons` at `c8c6e72e92a0fac2b1be4d8454c25a1227053a36`. The branch contains 519 new Chinese character entries plus the 206-entry legacy catalogue (725 unique total), Pinyin A–Z and semantic category filters with combined filtering, and a separate Chinese Lessons library of 17 lessons/112 questions. The Dictionary grid retains its existing character-only cards; no pinyin was added to grid cards. Chinese Lessons render Chinese text with pinyin directly underneath and English support always available.

Language-aware progress and practice-result migration, Chinese catalogue rows and completion/replay RPCs are present. The existing Free 5 / Premium 15 permanent-lesson daily allowance remains shared across both courses. U2.7 static/Chromium workflow passed at the reviewed head. The local Supabase database foundation job, including the U2.7 migration regression, passed; local Auth/Quiz/Flashcard integration was still running at the checkpoint.

During review, 17 practice question prompts containing Chinese text inside English-only strings were converted to bilingual Chinese/pinyin/English objects. Static tests now reject unpaired Chinese strings. Browser tests verify pinyin appears directly below Chinese text on desktop and mobile. Dictionary volume tests enforce at least 500 new entries and 700 total unique entries. Attribution was extended to include the pinyin-data MIT licence and the correct Unihan copyright period.

Public source notices cover CC-CEDICT (CC BY-SA 4.0), Unicode Unihan (Unicode License v3), mozillazg/pinyin-data (MIT) and HSK 3.0 source data (MIT). CC-CEDICT-derived dictionary content remains free and unrestricted. Formal Malaysia/general legal and privacy review remains deferred, not cleared.

Remaining gates: finish local Auth/RPC CI; manually review pinyin accuracy, especially 80 polyphonic new entries, definitions, Simplified forms and category assignments; owner-approved Singapore staging migration and preview test; then explicit owner approval before production migration, merge or deployment. No staging or production database was changed in this checkpoint.


**U2.7 CI completion follow-up (2026-11-21):** The U2.7 dictionary static/Chromium workflow passed at feature branch head `c8c6e72e92a0fac2b1be4d8454c25a1227053a36` (run 44881091752). The local Supabase Auth/Quiz/Flashcard integration workflow completed with both jobs successful, including the U2.7 database foundation/migration regression (run 44881091714). No staging or production database changes were made.




## Update 2.7.0 — linguistic QA continuation and staging gate (2026-11-21)

- Reviewed the latest U2.7.0 plan and conversation archives before continuing.
- Current application feature branch: `feature/update-2-7-0-chinese-dictionary-lessons`.
- Retrieved the full application `index.html` Git blob after the connector's file-content endpoint returned an empty body for the large file.
- Audited the 519 new Chinese dictionary records: 519 unique single-character identities, no missing core fields, all 11 category values valid, and 80 entries with multiple readings.
- Audited the separate Chinese lesson dataset: 17 lessons / 112 questions and 716 bilingual text objects with Chinese, pinyin and English fields. Field presence is not proof of pinyin accuracy; manual linguistic review remains required.
- Corrected two verified dictionary issues against the Ministry of Education's Revised Mandarin Chinese Dictionary: removed unsupported `wéi` from `喂` (retaining `wèi`), and corrected `待在家` to `dāi zài jiā`. The `等待` reading remains `dài`.
- Application commit: `e7d911f72d443e07eb6aa47a80229711a9288c05`; changed file `data/chinese-characters.js`. These data-only edits have not yet been confirmed by a new CI run.
- The reference confirms `跑` / `pǎo, páo` with the secondary reading restricted to animals digging the ground. The readings `骑 jì` and `玩 wàn` require clear modern-standard/literary labelling and remain in the manual review queue.
- Previously recorded U2.7.0 static/Chromium and disposable local Supabase/Auth/RPC workflows passed at earlier commits (#44881091752 and #44881091714). Do not imply these results validate the new commit.
- No hosted staging or production migration, settings change, merge or deployment occurred.
- The current next technical gate is Singapore staging validation of the language-aware Lessons migration and Cloudflare preview. The owner must explicitly approve applying the migration to hosted Singapore staging. Production migration, merge to `main` and production deployment require separate approval.
- Detailed session archive: [U2.7.0 linguistic QA and staging gate](conversation-archive/2026-11-21-update-2-7-0-linguistic-qa-and-staging-gate.md).




## Update 2.7.0 — Singapore staging migration and preview validation (2026-11-21)

- Owner approved applying the U2.7.0 language-aware Lessons migration to Singapore staging, preferring automated work where possible.
- Confirmed target project `SwiftDictionary Indie Staging`, ref `ivatvkfrtifgfheeaelj`, region `ap-southeast-1`, status `ACTIVE_HEALTHY`. Tokyo production project was not targeted.
- Read-only preflight confirmed the `zh` language code existed, the preceding migrations were present, there were no duplicate lesson-progress or practice-result identities that would conflict with language-scoped uniqueness, and existing lesson rows were present.
- Applied `supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql` to Singapore staging. Supabase recorded version `20261121074834` named `swiftdictionary_update_2_7_0_language_aware_lessons`; the hosted version is assigned by the migration service and differs from the repository filename timestamp.
- Post-checks: 17 active Chinese permanent lessons, 17 active English permanent lessons, zero Chinese Daily Learning activities, both language columns present, unique language-scoped practice index present, and existing lesson rows preserved as English.
- Security Advisor reports the expected private-schema RLS INFO findings, leaked-password protection WARN, and two authenticated SECURITY DEFINER RPC findings. The language-aware replay-summary RPC is SECURITY DEFINER with explicit `auth.uid()` check, rejects anon execution, and uses a fixed search path; keep this under test/security review. The completion RPC is SECURITY INVOKER and rejects anon execution. Performance Advisor reports existing unindexed-FK/RLS-initplan warnings and new indexes unused on the small staging dataset. No unrelated advisor fixes were applied.
- Created draft PR #14: https://github.com/WhiteWingCat/swiftdictionary/pull/14. It remains open, draft and unmerged.
- Initial PR CI found a stale U2.3.0 test assertion that expected the English-only lesson RPC names. Updated `tests/update-2-3-0/check-frontend.mjs` to expect the language-aware completion and replay RPC names. New application commit: `ff4c1c4bda297a58bc0403d9795c0dbd75c2f254`.
- Initial U2.7.0 static, content/pinyin and full Lessons/Daily Learning browser regression stages passed; isolated dictionary browser checks also passed on the initial PR head. The initial general PR CI run had one failure caused by the stale RPC-name assertion; the test has been corrected and new workflows are running on the updated head. Do not declare the whole suite green until they finish.
- Cloudflare Pages bot started a preview build for `ff4c1c4`; latest observed status was in progress with no preview URL yet. A separate older Cloudflare Workers build on `e7d911f` failed; it is not evidence of the current Pages preview result. Cloudflare build-routing guard passed on the initial head and reran on the updated head.
- No production migration, deployment, OAuth/configuration change, or merge occurred.
- Detailed archive: [U2.7.0 Singapore staging migration and preview](conversation-archive/2026-11-21-update-2-7-0-singapore-staging-migration-and-preview.md).




### U2.7.0 Pages deployment and CI follow-up (2026-11-21)

- Cloudflare Pages deployed application head `ff4c1c4` successfully:
  - https://06110066.swiftdictionary.pages.dev
  - https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev
- CI passes: Cloudflare build-routing guard #44882082871; U2.7.0 Chinese dictionary and Lessons suite #44882082850; Update 2.3.x migration/Auth/Chromium suite #44882082837; Update 2.5.0 Flashcards #44882082822; Update 2.6.0 ACL drift regression #44882082838.
- Quiz database foundation job in run #44882082923 passed; its Local Supabase Auth/RPC integration job was still running authenticated Chromium Quiz runtime tests at the latest check. Do not claim the entire run passed until it completes.
- The separate Cloudflare Workers build for the retired `swiftdictionary-testing` Worker failed; this is distinct from the successful active Pages preview.
- The Pages private build log could not be inspected through available connected tools. Keep the staging-backend routing check in the final preview verification before signing in.
- Updated detailed archive: [U2.7.0 Singapore staging migration and preview](conversation-archive/2026-11-21-update-2-7-0-singapore-staging-migration-and-preview.md).




## Update 2.7.0 — shared Lessons UI redesign and Chinese expansion pause (2026-11-21)

- Owner requested a temporary pause on further Chinese dictionary/content expansion while the Lessons UI is reworked. This is a scope adjustment, not cancellation or a delay to Update 2.7.0; existing Chinese dictionary and Lessons foundations remain.
- Redesigned the Lessons landing UI for both English and Chinese. New Permanent Lessons container now holds difficulty tabs, daily lesson allowance and permanent lesson library; Daily Learning follows below it.
- Moved the existing My daily activities preferences to Preferences. Existing user_preferences fields, sync and completion rules remain unchanged. Added visible save/error feedback on Preferences and initialization when Preferences is opened directly.
- Daily activity tabs now use distinct category colours, drop shadows and connected active-panel styling.
- Widened permanent lesson reader to 1320px maximum/full parent width; improved Chinese/pinyin/English line spacing and contrast; added KEY IDEA / 重点 emphasis to curated lesson points in both courses.
- Practice panels and question fieldsets now constrain width, wrap long bilingual text and clip overflow. Daily Learning reader is now a left drawer: half viewport on desktop, 62% medium and full-screen on narrow mobile.
- Added smooth reader/drawer entry/exit and interaction transitions, with prefers-reduced-motion support.
- No database schema/migration, new personal data collection or new processing purpose was introduced. Singapore staging retains the previously applied U2.7.0 language-aware Lessons migration; production remains untouched. Formal Malaysia PDPA/international legal review remains deferred, not cleared.
- Application branch: feature/update-2-7-0-chinese-dictionary-lessons. Latest app head: 0e0d0b520f8d763dbb9839deda36085ded759082. PR #14 remains draft/open/unmerged; title/body now record the revised scope.
- Latest preview deployment for 0e0d0b5 succeeded: https://8dfdd54f.swiftdictionary.pages.dev; branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev.
- Latest U2.7.0 suite #44886855621 passed all static/data, Chinese lesson content/pinyin, new UI structure/accessibility, full Lessons/Daily Learning browser regression, Chinese dictionary browser and bilingual layout checks. Cloudflare build-routing guard #44886855624 passed. Flashcards suite #44886855618 passed.
- Latest 2.3.x PostgreSQL and Chromium jobs passed in #44886855634; local Supabase Auth compatibility was completing cleanup at last check. U2.6 ACL disposable Supabase cleanup and Quiz Auth/RPC integration were still running. The prior 2.3.x ordering assertion failure was corrected and its latest run passed the PostgreSQL and Chromium jobs.
- A separate Cloudflare Workers build for retired swiftdictionary-testing failed; it is not the active Pages deployment. Do not conflate it with the successful Pages preview.
- Detailed archive: [Update 2.7.0 — Lessons UI redesign and content pause](conversation-archive/2026-11-21-update-2-7-0-lessons-ui-redesign.md).




### U2.7.0 Lessons UI — final automated verification (2026-11-21)

All latest-head PR workflows completed successfully:
- U2.7.0 dictionary/Chinese Lessons/UI static-accessibility/browser suite #44886855621.
- Update 2.3.x PostgreSQL/Auth/Chromium suite #44886855634.
- Update 2.5.0 Flashcards suite #44886855618.
- Update 2.6.0 ACL regression #44886855686.
- Quiz database foundation and Local Supabase Auth/RPC/Chromium integration #44886855646.
- Cloudflare build-routing guard #44886855624.

The latest Cloudflare Pages preview for app head 0e0d0b5 deployed successfully at https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev (deployment https://8dfdd54f.swiftdictionary.pages.dev). PR #14 body was updated with completed CI evidence and remains draft/open/unmerged. No production migration, merge or deployment occurred. Owner visual acceptance of the updated preview remains outstanding; no technical manual action is required from the owner.


## Update 2.7.0 — Lessons UI owner feedback round 1 (2026-11-21)

Owner-tested staging feedback has been implemented on the existing U2.7.0 feature branch for English and Chinese Lessons. “What you will learn” and “Examples in context” now use localized expand/collapse controls after the first three entries. Practice prompts are contained inside their own question panels; short answer sets use responsive columns while longer choices remain stacked. The Lessons landing page order is restored to Daily Learning followed by Permanent Lessons. The Daily Activities reader is portalled to the document-level overlay to prevent clipping/stacking issues. Activity tabs wrap in a responsive grid without a horizontal scrollbar. Each activity panel now has a redesigned localized title and daily allowance card with remaining count and progress bar.

The responsive drawer widths are explicitly retained at 50vw desktop, 62vw medium and 100vw narrow mobile. Asset cache-busting is `2.7.0-ui3`. Dictionary grid remains unchanged and does not display pinyin.

Latest app head: `b98980dc5eae5ffea4cdb482c126fbb529daa739`; PR #14 remains draft/open/unmerged. U2.7.0 static/data/accessibility/browser suite #44889504955 and Cloudflare build-routing guard #44889504919 passed. All latest-head compatibility workflows completed successfully: U2.7.0 dictionary/Chinese Lessons/UI/browser suite #44889504955; 2.3.x PostgreSQL 17 migration/allowance, Auth compatibility and Chromium suite #44889505053; Update 2.5.0 Flashcards #44889505023; Update 2.6.0 ACL regression #44889505006; Quiz database foundation and Local Supabase Auth/RPC/Chromium integration #44889505105; Cloudflare build-routing guard #44889504919. Cloudflare Pages deployment check #136802063112 also succeeded for app head `b98980d`, with deployment URL https://42daddd5.swiftdictionary.pages.dev and branch preview https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev. Cloudflare Pages deployment check #136802063112 completed successfully for app head `b98980d`: https://42daddd5.swiftdictionary.pages.dev. Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev. No production deployment or migration occurred. No new personal-data processing or schema change was introduced. Formal Malaysia PDPA/international legal review remains deferred, not cleared.

Detailed session archive: [Update 2.7.0 — Lessons UI redesign and owner feedback round 1](conversation-archive/2026-11-21-update-2-7-0-lessons-ui-redesign.md).


## Update 2.7.0 — owner feedback round 2 (2026-11-22)

Continued PR #14 on `feature/update-2-7-0-chinese-dictionary-lessons`. This work addressed the owner's seven new staging feedback items: sense-specific pinyin in Chinese dictionary examples; Daily Learning drawer rendering and transitions; English Daily Discovery restoration; completed-content replay; educational tab descriptions separated from allowance status; English support across Chinese Daily Learning; and consistent contextual highlighting/sentence breakdowns across English and Chinese lessons.

Implementation details:
- Polyphonic dictionary sense examples render pinyin using the selected sense reading for the target character.
- Daily Learning resolves the active course language before its session queries, refreshes on course changes, and scopes completed/open sessions by `language_code`.
- Completed content is replayable without a new completion or allowance charge. Historical review cards do not reduce today's new activity slots. Adaptive Chinese Daily Revision reconstructs the original source material.
- Chinese Daily Topic/Application entries have English titles and bilingual learning text; Daily Revision has an English title; Chinese Daily Discovery cards show English definitions when selected.
- Shared sentence emphasis now covers subject, verb/predicate, object and adverbial roles. Four additional English and six additional Chinese lessons received contextual breakdowns.

A Chromium run revealed a temporal-dead-zone bug after language-scoped session filtering was added: the language variable was referenced before declaration. It was moved before the queries and a static ordering regression was added. The browser fixtures were also updated to carry `language_code` and to distinguish educational descriptions from allowance status.

Latest application head at this documentation update: `3ec276effb24ed553ccd697daebcc42ae166dfe5`. U2.7.0 static checks passed on prior heads; the latest full Chromium regression and Cloudflare Pages deployment were still pending. The staging preview must not be declared ready until the final browser checks and deployment are verified. PR #14 remains draft/open/unmerged. No production database or deployment changes were made. No new personal-data category or processing purpose was introduced. Formal Malaysia PDPA/international legal review remains deferred, not cleared.

Detailed session archive: [Update 2.7.0 — owner feedback round 2: Daily Learning, Chinese pinyin and lesson emphasis](conversation-archive/2026-11-22-update-2-7-0-owner-feedback-round-2.md).


### U2.7.0 owner feedback round 2 — validation follow-up

Latest application head: `8fec96ab80e889c2cf50ddf71382da643a6e4c23`. The U2.7.0 static/data/accessibility checks, full Lessons and Daily Learning Chromium suite, isolated Chinese dictionary browser checks and Chinese bilingual-layout browser check all passed. The 2.3.x PostgreSQL 17 migration/allowance, local Supabase Auth compatibility and Chromium regressions passed. Update 2.5.0 Flashcards, Update 2.6.0 ACL drift and Cloudflare build-routing guard passed. Quiz DB foundation PostgreSQL validation passed; the separate local Supabase Auth/RPC/Quiz Chromium runtime was still running at the time of this update.

Pinyin coverage was extended to all Han characters appearing in separate-sense examples across the 725 combined dictionary entries; static checks assert no example character lacks a pinyin fallback. Historical review cards no longer consume today's new activity slots, and stale completed sessions that cannot be resolved to their original content are omitted rather than shown as unrelated content.

The U2.7.0 GitHub Actions workflow succeeded for head `8fec96a`. Cloudflare Pages branch-preview deployment was not independently verified, so do not yet mark the staging preview ready. PR #14 remains draft/open/unmerged. No production deployment or migration occurred.

Detailed archive: [Update 2.7.0 — owner feedback round 2: Daily Learning, Chinese pinyin and lesson emphasis](conversation-archive/2026-11-22-update-2-7-0-owner-feedback-round-2.md).


### Final cross-version CI result

The Quiz database foundation workflow completed successfully, including local Supabase Auth/RPC integration and authenticated Chromium Quiz runtime tests. All GitHub Actions workflows for application head `8fec96ab80e889c2cf50ddf71382da643a6e4c23` passed: U2.7.0, 2.3.x, 2.5.0, 2.6.0, Quiz DB foundation and Cloudflare build-routing guard.

The remaining release gate is confirmation that Cloudflare Pages has published the latest feature-branch head to the existing branch-preview URL. The preview URL could not be independently fetched by available browser inspection, and no Cloudflare deployment-status connector is available in this workspace. Successful build-routing validation is not itself proof of a completed Pages deployment. Keep PR #14 draft/open/unmerged until the Pages deployment is confirmed.


### U2.7.0 staging preview ready — Cloudflare Pages confirmed

Cloudflare's `Cloudflare Pages` check run for application head `8fec96ab80e889c2cf50ddf71382da643a6e4c23` completed successfully at 2026-11-22 08:47:37 UTC. Deployment ID: `3b37c9ef-d582-4b15-af2b-576141de4368`.

- Commit-specific preview: https://3b37c9ef.swiftdictionary.pages.dev
- Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

All GitHub Actions compatibility workflows passed (U2.7.0, 2.3.x, 2.5.0, 2.6.0, Quiz DB foundation, Cloudflare build routing), and Cloudflare Pages explicitly reported **Deploy successful** for the latest feature-branch commit. The separate `Workers Builds: swiftdictionary-testing` check remains failed for the retired testing Worker and is not the Pages deployment. Staging is ready for owner testing. PR #14 remains draft/open/unmerged; production/main remains untouched.


## 2026-11-22 — U2.7.0 owner feedback round 3

- Continued work only on `feature/update-2-7-0-chinese-dictionary-lessons` / PR #14; no merge to main or production release.
- Addressed the owner's remaining Daily Learning drawer, completed-content review, and allowance-description feedback; added explicit transform/opacity transitions with reduced-motion support and browser coverage.
- Changed permanent lesson allowance consumption to the first confirmed start. Added a Confirm/Cancel prompt with the exact owner-provided wording, a private Supabase trigger/migration, and regression coverage for Free/Premium quotas, shared English/Chinese usage, completion neutrality, free resume/review, personal test exemption, and concurrent starts.
- Reworked lesson emphasis to white bold topic highlighting, including `a`, `an`, and `the` for the article lesson; removed subject/verb/object role emphasis.
- Corrected the Chinese date example to `二零二六年` with matching `líng` pinyin, and replaced the English example name Maya with 李明 / Lǐ Míng.
- Applied the first-start allowance migration to the Singapore staging Supabase project only. No new personal-data category or external data recipient was introduced; formal legal/privacy review remains a separate outstanding activity.
- Latest branch commit: `ade95b7c3e99405d941c33627156aa6856117958`. Cloudflare Pages deployed successfully at `https://fed3bc44.swiftdictionary.pages.dev`. The U2.7.0 PostgreSQL 17 lesson-start allowance regression and full Lessons/Daily Learning Chromium suite passed, as did isolated Chinese dictionary checks and the Chinese Lessons bilingual layout check. A broader local Supabase Auth/RPC integration rerun remained in progress; its earlier synthetic exemption fixture issue was corrected. The staging preview is ready for owner acceptance testing; no production merge was performed.
- Detailed archive: [U2.7.0 owner feedback round 3](conversation-archive/2026-11-22-update-2-7-0-owner-feedback-round-3.md).


## 2026-11-22 — U2.7.0 owner feedback round 4

- Continued implementation only on `feature/update-2-7-0-chinese-dictionary-lessons`; latest application head is `efd4a1a0f06d29f0a0d5a894d4c96761324c1220`. PR #14 remains draft/open/unmerged. No changes were made to `main`, and no production migration or deployment occurred.
- Replaced the broad lesson-reader highlighter with an explicit curated topic map. Highlights are limited to explanation paragraphs, examples in context, sentence-breakdown sentences and the actual breakdown term tokens. Titles, headings, descriptions, questions, answer choices and answers are excluded. Terms are bold white; lessons without a clearly useful focal term remain unhighlighted (including the basic-sentence lesson rather than highlighting subject/verb/object labels).
- Removed role-based subject/verb/object/adverbial emphasis. Legacy role marks are neutralised while preserving their nested bilingual markup, including Chinese pinyin and English support. The highlight observer rebinds if the lesson reader root is replaced.
- Fixed completed Daily Learning content resolution to use the language associated with the loaded Daily Learning snapshot rather than a possibly out-of-sync visible course selector. This resolves Chinese Topic, Application, Discovery and Revision content from the correct language pool.
- Added a Chromium regression that deliberately keeps the page selector on English while the loaded Daily Learning snapshot and completed rows are Chinese. All four completed categories reopen in review-only mode, show “Review completed content”, and make no new activity-start call or allowance charge.
- Found the drawer transition conflict: the panel inherited the global `.modal` slide-in keyframe animation, which competed with the dedicated transform/opacity transition. Disabled that global animation on the Daily Learning panel so its dedicated slide transition runs. Removed a later `display:flex !important` override that defeated the native `hidden` attribute. Normal-motion users receive slide-in/slide-out; reduced-motion users receive a short opacity fade. The reader now hides correctly after close.
- Full validation passed on the latest head: U2.7.0 static/Chromium and PostgreSQL 17 allowance regressions; 2.3.x Auth, PostgreSQL and Chromium regressions; 2.5.0 Flashcards browser/database checks; 2.6.0 PostgreSQL ACL drift; Quiz DB foundation and local Supabase Auth/RPC/Chromium integration; and Cloudflare build-routing guard.
- Cloudflare Pages explicitly reported **Deploy successful** for `efd4a1a`: commit preview `https://caf353ae.swiftdictionary.pages.dev`, branch preview `https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev`. The separate Cloudflare Workers Builds failure for the retired `swiftdictionary-testing` Worker is not the Pages deployment.
- No new Supabase schema/migration, personal-data category, external recipient or third-party processor was introduced in this round. The prior first-start allowance migration remains applied to Singapore staging only. Malaysia PDPA and general legal/privacy review remain outstanding and are not represented as completed.
- Owner acceptance is pending. Do not merge PR #14 or deploy U2.7.0 to production without explicit owner approval.
- Detailed archive: [U2.7.0 owner feedback round 4](conversation-archive/2026-11-22-update-2-7-0-owner-feedback-round-4.md).


## 2026-11-22 — U2.7.0 owner feedback round 5

- Continued application work only on `feature/update-2-7-0-chinese-dictionary-lessons`; PR #14 remains draft/open/unmerged. Latest application head at this record: `2ce01237c2350115941c56f524b0a7661365879b`. No changes were made to `main`.
- Added an explanation beneath Daily Learning clarifying that each activity category's daily allowance is shared across English and Simplified Chinese, course switching does not reset it, completed content remains reviewable, and the allowance resets at midnight in the configured allowance timezone. The paragraph follows the selected translation language, including Simplified Chinese.
- Preserved the allowance system exactly as requested: no quota, RPC, completion accounting, database or migration changes.
- Changed normal-motion Daily Learning drawer animation to transform-only slide-in/slide-out. Backdrop opacity remains independent; reduced-motion users retain a brief fade.
- Root cause of English Daily Discovery appearing empty: daily usage is shared across courses, but completed/in-progress review rows are language-scoped. If Chinese consumes today's Discovery allowance, English may have no language-scoped history and no remaining new slot, so the renderer previously produced no card. It now retains the first scheduled English Discovery item as a disabled “Daily limit reached” card; no session or allowance is created. The 93-entry English/Chinese pools and global schedule remain unchanged.
- Refreshed Daily Learning and Lessons stylesheet cache versions and updated the relevant regression assertions.
- Latest-head validation: U2.7.0 static/data/content and full Lessons/Daily Learning Chromium suite passed; U2.7.0 PostgreSQL 17 lesson-start allowance regression passed; 2.3.x PostgreSQL/Auth/Chromium passed; 2.5.0 Flashcards passed; 2.6.0 ACL drift passed; Cloudflare build-routing guard passed. Quiz DB foundation and Auth/RPC checks passed their database/RPC phases; authenticated Chromium Quiz runtime was still running at record time. Do not claim the entire cross-version workflow set green until it finishes.
- Cloudflare Pages explicitly reported **Deploy successful** for `2ce0123`: https://8f5833dd.swiftdictionary.pages.dev. Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev.
- No new personal-data category, tracking, processor, external recipient, RPC or schema/migration was introduced. Formal Malaysia PDPA and international legal/privacy review remains deferred/outstanding. No production database migration or deployment was performed.
- Owner staging acceptance remains pending. Do not merge PR #14 or deploy to production without explicit approval.
- Detailed archive: [U2.7.0 owner feedback round 5](conversation-archive/2026-11-22-update-2-7-0-owner-feedback-round-5.md).


### Final cross-version CI confirmation — owner feedback round 5

After the archive was first recorded, the remaining Quiz database foundation / Local Supabase Auth-RPC / authenticated Chromium Quiz runtime workflow completed successfully on application head `2ce01237c2350115941c56f524b0a7661365879b`. All latest-head cross-version workflows are now green: U2.7.0, 2.3.x, 2.5.0, 2.6.0, Quiz DB/Auth/RPC/Chromium and Cloudflare build routing. Cloudflare Pages had already explicitly confirmed a successful deployment for the same head. Staging is ready for owner testing; PR #14 remains draft/open/unmerged and production/main remains untouched.


## 2026-11-22 — U2.7.0 release-polishing pass

- Owner confirmed the latest U2.7.0 staging preview was functionally good and authorised polishing/release preparation, including a README refresh. This was not approval to merge or deploy to production.
- The U2.7.0 feature branch was synchronized with the latest `main` history; it is now 347 commits ahead and zero behind. `main` itself was not modified.
- Replaced the feature-branch README's obsolete 2.2.0-only description with a U2.7.0 release-candidate summary covering 519 new Chinese characters, 700+ total Chinese characters, 17 Chinese lessons/112 questions, Chinese Daily Learning content, shared cross-course allowances, UI changes/fixes, migrations, hosting/build safeguards, attribution/licensing, privacy notes and release history. Corrected the grid description to character-only cards with pinyin search/detail support.
- Confirmed the only file changed after the owner-accepted functional head `2ce01237c2350115941c56f524b0a7661365879b` is `README.md`; application source, content, CSS, SQL and runtime behaviour are unchanged by the polishing commit.
- Latest head: `c355a23f3d4555fec1384fd14fb4056d77336756`. Cloudflare Pages deployment succeeded at https://962c2836.swiftdictionary.pages.dev; branch preview remains https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev.
- U2.7.0 data/static/Chromium/PostgreSQL checks, 2.3.x PostgreSQL/Auth/Chromium, 2.5.0 Flashcards, 2.6.0 ACL, Quiz DB/Auth/RPC/Chromium and Cloudflare build routing passed. The separate `Workers Builds: swiftdictionary-testing` check remains failed for the retired Worker and is unrelated to the successful Pages deployment.
- U2.7.0 migrations remain staging-only. No production migration, deployment, tag or merge occurred. Formal Malaysia PDPA and international legal/privacy review remains outstanding.
- PR #14 remains draft/open/unmerged pending explicit owner release approval.
- Detailed archive: [U2.7.0 release-polishing pass and README refresh](conversation-archive/2026-11-22-update-2-7-0-release-polishing-pass.md).


## 2026-11-22 — U2.7.0 owner-approved merge to main

- Owner explicitly approved merging U2.7.0 into `main`.
- PR #14 was changed from draft to ready for review and merged using a merge commit (not squash/rebase).
- PR: https://github.com/WhiteWingCat/swiftdictionary/pull/14
- Source branch: `feature/update-2-7-0-chinese-dictionary-lessons`
- Source head: `c355a23f3d4555fec1384fd14fb4056d77336756`
- Base before merge: `11679f706ef3c03f314eeb6f0acf2d753a7e3a8a`
- Merge commit and verified `main` head: `1d74e4925456c23b96223a94e64827b42c9cb869`.
- PR #14 is closed/merged. Its description was updated to reflect the final merge status, deployment boundary and outstanding legal review.
- The merge includes the refreshed root README and all U2.7.0 application/data/UI/migration files from the accepted feature branch.
- GitHub automatically triggered the `pages build and deployment` workflow on `main`, run [45024731635](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45024731635). It was `in_progress` at the latest check; do not claim the production Pages deployment succeeded until a completed successful result is observed.
- The three U2.7.0 Supabase migrations remain applied to staging only. The Git merge did not apply them to production; do not run them against production without a separate explicit owner approval and preflight.
- The separate failed `Workers Builds: swiftdictionary-testing` check on the feature head was for the retired testing Worker. The relevant U2.7.0 application checks, Pages build-routing guard and feature-branch Pages deployment had passed.
- Formal Malaysia PDPA and general international legal/privacy review remain outstanding. This is not a legal compliance certification.
- No release tag or downloadable ZIP was created as part of the merge.
- Detailed session archive: [U2.7.0 owner-approved merge to main](conversation-archive/2026-11-22-update-2-7-0-merge-to-main.md).


### Post-merge README release-status refresh

The merged root README initially still contained pre-merge release-candidate wording. This was corrected on `main` in a documentation-only commit, `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`, marking U2.7.0 released and recording the successful Pages deployments. No application source or migration changed in this follow-up. For the latest `main` head, GitHub Pages workflow #45024998181 and the Cloudflare Pages check succeeded; the separate Cloudflare Workers testing check was still running at the last observation. The feature branch remains intact.


---

## 2026-11-23 — Update 2.8.0 final planning approval (development not started)

**Update title:** Chinese Quiz & Flashcards Expansion.

The owner approved the final U2.8.0 plan but explicitly instructed that development must not begin yet. This entry records scope and the documentation handover only. The detailed authoritative plan is [Update 2.8.0 Development Plan](UPDATE-2.8.0-DEVELOPMENT-PLAN.md); the conversation decision archive is [2026-11-23 Update 2.8.0 final planning approval](conversation-archive/2026-11-23-update-2-8-0-final-planning-approval.md).

### Approved scope

1. **Chinese Quiz bank:** Sufficient coverage for Beginner, Intermediate and Advanced across character recognition/meaning, pinyin/pronunciation, vocabulary, useful expressions, sentence comprehension, grammar/structure, contextual usage and English-to-Chinese translation only when English is the selected translation language. Preserve the existing Quiz session sizes, four-option format, no-timer rules, review behaviour, session persistence, same-day no-repeat reservations and difficulty composition. Numeric Chinese bank targets are deliberately deferred until the technical/content audit measures actual curriculum coverage, topic diversity, supported language pairs and eligible unseen-session capacity. Do not invent counts or assume historic draft questions are approved.
2. **Chinese Flashcards bank:** Cover individual characters, multi-character vocabulary and useful expressions/phrases. Include pronunciation/pinyin, meanings, definitions, contextual usage and sentence knowledge as appropriate. Establish numeric capacity targets after the same curriculum/bank audit.
3. **Distinct recall modes:** Word Recall tests lexical-form/pronunciation retrieval (pinyin); Definition Recall tests conceptual meaning via a descriptive clue; Translation Recall tests language equivalence (English equivalent to Chinese when English is selected, Chinese paraphrase/equivalent when Chinese is selected); Sentence Recall tests sentence-level retrieval. Mandatory cross-mode anti-overlap QA must reject cards that test the same skill with superficial rewording. Definition Recall must not merely be a direct English gloss, and Translation Recall must not simply restate a dictionary-style definition.
4. **Language gating:** Chinese-course English translation content is eligible only when English is selected as the translation language. Chinese translation preference keeps prompts/explanations Chinese-focused and excludes English integration. Each Quiz/Flashcard session captures its language pair at start; preference changes apply to new sessions only.
5. **Quiz UI:** Redesign both Quiz landing and active test screens to match Lessons/Flashcards visual language, including card shadows, navigation background colour, consistent spacing/radii, animated transitions, directional previous/next question transitions, answer preservation, rapid-navigation protection, responsive layouts and reduced-motion support.
6. **Allowance overview:** Replace Dashboard gauges with clearer cards showing completed/limit/remaining status for Lessons, Quiz, Flashcards and Daily Revision. Do not change quota policy or enforcement.
7. **Practice Insights:** Flexible lesson completion is approved. Learners may proceed after reviewing an explanation without selecting the correct answer. Record first-attempt and subsequent errors so eventual correction does not erase the learning signal. Quiz questions link to relevant permanent lesson topics; incorrect answers can raise review priority. Carry forward the previously agreed recent-performance rule using the five most recent completed Quiz reviews. Avoid declaring a topic weak from one isolated mistake. Chinese Quiz questions must map to Chinese lesson topics.
8. **Dashboard:** Four tabs — Favourites, Learning Progress, Daily History and Analytics. Analytics combines Flashcard statistics with Practice Insights and supports English/Chinese course filtering.
9. **Daily History:** Display completed Lessons, Quiz sessions and Flashcard games for the current effective local day. The displayed daily view resets at local midnight, but underlying records are not deleted and remain available for long-term progress/analytics and applicable retention/deletion processes.
10. **Full Flashcard game review:** Every completed Flashcard game shown in Daily History can be reopened for a read-only review of every card, including cards answered correctly. Preserve original card content/order/language and recorded response/result where supported. Review must not create a new game, change results or consume allowance. The technical audit must choose a safe snapshot/versioning strategy so later bank edits/deletions do not alter past game content.
11. **Daily Learning refresh:** Completed Daily Topic, Daily Application, Daily Discovery and Daily Revision activities leave the active daily view at the effective local midnight reset and are replaced with fresh eligible activities under existing selection/weak-topic rules. This is a local calendar-day reset, not a rolling 24-hour window. Preserve permanent lesson progress, historical records, allowance rules and abandoned-session semantics.
12. **Compatibility:** Preserve English Quiz/Flashcards, existing modes, custom collections, account sync/isolation, session rules, quotas, timezone handling, daily activity policies, dictionary search (free and unlimited), and desktop/mobile functionality.
13. **Legal/privacy/content gate:** Perform Malaysia-specific and general international review covering privacy/data minimisation, global 16+ audience, cross-border processing, retention, account deletion, RLS, any additional attempt-level analytics data, and content licensing/attribution. This is a risk-planning requirement, not legal advice or compliance certification; formal legal/privacy review remains outstanding.

### Existing quota baseline to preserve

Previously approved baselines remain unchanged by U2.8.0: permanent lessons Free 5/Premium 15 per local day; each Daily Learning category Free 1/Premium 3 per day; Quiz Free 1/Premium 3 completed sessions per day; Flashcards Free 3/Premium 10 completed games per day. Confirm actual Production configuration during the later technical audit before proposing any database change. Abandoning a game/session does not consume a completion allowance under existing rules. Dictionary word-grid search remains free and unlimited.

### Development order and release gates

After a separate explicit start instruction: audit current `main`, schemas/RPCs/migrations, production/staging configuration, content banks, lesson-topic mappings, allowance logic, RLS and account deletion; establish Chinese bank targets; implement content and language gating; implement Quiz UI; implement flexible practice/Quiz insight tracking; implement Dashboard/Daily History/full-game review; implement midnight refresh; then run content, database, security, account, allowance, timezone, browser, mobile and accessibility regression tests. Prepare staging for owner testing. Merge, production migrations and production deployment each require separate explicit owner approval.

### Branch and change boundary

- Verified application branch: `feature/update-2-8-0-chinese-quiz-flashcards`.
- Branch was created from current `main` in the preceding planning stage; it remains untouched.
- No U2.8.0 application code, content, SQL, migrations, schema, RPCs, staging data, production data or deployments changed.
- This update modifies documentation only on `docs/master-development-record`. The production `main` branch is not modified.
- Plan approval is not development-start approval. Wait for a separate explicit owner instruction before any technical audit or implementation.



## 2026-11-23 — Update 2.8.0 development authorised

- Owner explicitly authorised development after requesting review of the latest Master Development Record and relevant conversation archive.
- The authoritative U2.8.0 plan now records development as authorised and the technical audit as in progress.
- Application work is permitted only on the reserved branch `feature/update-2-8-0-chinese-quiz-flashcards`, based on current `main`; verify its head before writing.
- Initial work begins with a read-only audit of current `main`, the feature branch, database schemas/RPCs/migrations, content banks, topic mappings, allowance rules, RLS and account-deletion paths. No assumptions from older draft plans replace live state.
- Existing U2.8.0 scope and acceptance criteria remain unchanged. No quota changes, dictionary gating, destructive midnight deletion or scope expansion is authorised.
- Merge, production database changes/migrations, production deployment and release remain separate approval gates.
- Required Malaysia-specific and general international legal/privacy planning remains mandatory; formal legal/privacy clearance is still outstanding.


## 2026-11-23 — Update 2.8.0 development audit and implementation start

The owner explicitly authorised development after the authoritative plan and conversation archives were reviewed. The U2.8.0 plan now contains the initial technical audit baseline and derived Chinese Quiz capacity targets. The reserved application branch initially matched current main commit `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`.

Read-only audit confirmed:
- 17 Chinese permanent lessons (7 Beginner / 5 Intermediate / 5 Advanced) and 112 lesson-practice candidates (44 / 34 / 34).
- The approved Quiz bank currently has 199 English-learning / Chinese-translation questions and no Chinese-learning rows.
- Chinese Quiz target inventory, carried forward from the existing three-session Premium capacity model: 30 Beginner, 36 Intermediate, 48 Advanced. Current candidate gaps: +2 Intermediate and +14 Advanced; all candidate questions remain subject to validation and approval.
- Chinese dictionary bank: 519 single-character entries (HSK1 148, HSK2 271, HSK3 100). Multi-character terms/expressions are not yet standalone cards and must be added.
- Current Flashcard backend is English-only and Mixed Recall replaced the earlier Translation mode in the current constraints. Preserve Mixed Recall and add Translation Recall as a distinct Chinese-course mode; the four distinct Chinese learning tasks are Word, Definition, Translation and Sentence Recall.
- Production has four completed Flashcard summaries, 39 mastery rows and 12 weak-memory rows; staging has no Flashcard learner rows. Existing sessions have no per-card snapshots and cannot be reconstructed for full historical review. New games will receive immutable review snapshots; legacy sessions will remain summary-only with an explicit notice.
- Flexible lesson completion requires a new explicit completion path and minimal attempt aggregates because current lesson UI requires every question correct and current result storage does not preserve retry mistakes.
- Daily Learning currently includes historical completed cards in its view; filter the active view by effective local day without deleting stored records.
- Verified Free/Premium quotas remain unchanged: Free Lessons 5 / Quiz 1 / Flashcards 3 / each Daily category 1; Premium Lessons 15 / Quiz 3 / Flashcards 10 / each Daily category 3.

Security baseline and privacy gates are recorded in the U2.8.0 plan. All database checks were read-only; no production or staging data/schema/settings were changed. No merge, production migration or production deployment is authorised.


## 2026-11-23 — U2.8.0 repository audit correction and active development checkpoint

This entry supersedes any earlier same-day statement that the U2.8.0 feature branch remained untouched after the initial audit. The owner gave a separate explicit start instruction. The feature branch was already populated with substantial U2.8.0 work by the time the latest branch audit was performed; preserve it and do not reset or overwrite it.

- `main`: `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`.
- Feature branch: `feature/update-2-8-0-chinese-quiz-flashcards`, head `888d7c4e6bada45b2e09e23b449d49d1c71843a9`; compare reports 94 commits ahead, zero behind.
- PR #16 is open and draft. It remains a development checkpoint, not a merge candidate.
- Branch changes include Chinese Quiz and Flashcard draft banks, separate Chinese recall modes, language-aware runtime, per-card immutable Flashcard review snapshots, Dashboard four tabs and allowance cards, Daily History, lesson/Daily Learning attempt metrics, Quiz-to-topic Practice Insights and current-day Daily Learning filtering.
- Four U2.8.0 migrations are committed on the feature branch. No U2.8.0 migration has been applied to staging or production.
- Latest Cloudflare Pages preview check and Quiz DB foundation check passed. Local Supabase Auth/RPC integration failed because its synthetic in-progress Flashcard fixture inserted nonzero counters that violate the existing session-count constraint. Corrected the fixture in commit `81d379a4b3f74c99e23c33aa3f5b76737fd54643` by starting with zero counters and setting final counts only on completion; rerun is pending.
- Latest Chromium run reported 49 passed, 3 failed, 13 skipped. Failures include Dashboard/Practice Insights, historical Daily Learning review, and signed-out Flashcards auth-card visibility. Investigate semantics and correct genuine regressions; update stale assertions only when behaviour is demonstrably equivalent.
- Other failing checks include U2.7.0 static source assertion for Daily Learning filtering, Cloudflare build-routing/cache-version assertion, U2.6.0 ACL regression and broader PostgreSQL 17 migration/allowance checks. Inspect and resolve each independently; do not weaken security or compatibility contracts.
- The separate `Workers Builds: swiftdictionary-testing` check failed for the retired Worker and is not the Cloudflare Pages preview result.
- Legal/privacy, retention, cross-border processing and content licensing remain outstanding release gates. No compliance clearance is implied.
- Immediate recovery point: branch head `888d7c4` plus fixture correction commit `81d379a`; rerun CI and continue test-led remediation. Do not merge, apply production migrations or deploy to production without separate explicit owner approval.


## 2026-11-23 — U2.8.0 release-gate remediation and staging readiness checkpoint

- Read the latest Master Development Record, U2.8.0 development plan, archive index, final-planning archive and development-start/repository-audit archive before continuing.
- PR #16 remains open/draft; no merge or production action was performed.
- Reviewed the Chinese Flashcard draft pack: 519 characters, 904 multi-character vocabulary entries and 24 authored phrases. Character and vocabulary example-Pinyin fields are absent; current Sentence Recall uses the example sentence rather than example Pinyin. This is explicitly retained as a content QA limitation for owner/linguistic review.
- Clarified the Chinese-selected Translation Recall prompt in `flashcards.js` so it asks for the closest Chinese equivalent, distinct in intent from the descriptive clue used by Definition Recall.
- Corrected the earlier migration inventory: six U2.8.0 SQL migrations are present on the feature branch (Chinese review foundation; Flashcard language/snapshots; Chinese Quiz runtime; daily practice attempt metrics; Quiz source-composition guard; security-invoker wrappers), not four. None has been applied to staging or production.
- At `f91b776`, Cloudflare Pages, Quiz DB foundation, PostgreSQL 17 migration/allowance, PostgreSQL 17 ACL, U2.7 lesson-start, Chromium, signed-out Flashcards, Chinese dictionary and Cloudflare routing checks passed. The authenticated local Supabase/Auth/RPC workflow was still running.
- Latest feature head after the prompt-copy clarification: `a981ae25622b7a2e5a5b230a1ebc09373ef27cb7`. Cloudflare Pages check succeeded for this head; all other latest-head CI workflows were in progress at the time of the audit. Do not claim latest-head CI is green until final results are inspected.
- Updated PR #16 description to accurately describe implemented work and remaining gates. PR remains draft.
- Staging preview URL last confirmed at prior head `f91b776`: https://92587b07.swiftdictionary.pages.dev. Verify the new head's preview deployment before declaring staging preview ready.
- Remaining gates: latest-head CI green; independent Chinese linguistic/answer-key/distractor/Pinyin/translation/anti-overlap review; review all six migrations/RLS/RPC grants/deletion cascades in disposable local Supabase; explicit approval before isolated staging migration/content activation; staging backend/preview verification; Malaysia and international privacy/retention/cross-border/16–17-year-old/DPO-DPIA and content licensing review; owner staging review.
- Formal legal/privacy clearance remains outstanding. No staging or production database, production data, production branch or production deployment was changed.
- Detailed session archive: [U2.8.0 release-gate remediation and staging readiness](conversation-archive/2026-11-23-update-2-8-0-development-start-and-repository-audit.md).


## 2026-11-23 — U2.8.0 staging database activation and preview handover

- Owner explicitly approved changes to isolated SwiftDictionary Indie Staging (`ivatvkfrtifgfheeaelj`, ap-southeast-1, PostgreSQL 17). All six core U2.8.0 migrations and three supplemental migrations (Flashcard review mode alias; 145-question Chinese Quiz seed; foreign-key indexes) were applied. A one-off review-mode hotfix preceded the canonical alias migration and is recorded separately in staging migration history.
- Chinese Quiz migration inserts 145 rows as draft by default; the 145 Chinese-course rows were promoted to approved in staging only to enable preview. Production content remains untouched.
- Rollback-only authenticated RPC checks passed: Quiz availability, 10-question Chinese Beginner Quiz start, and 60-second Chinese Word Recall Flashcard session start. Transactions were rolled back.
- Feature branch `supabase-config.js` routes Cloudflare Pages preview hosts to staging and keeps the production hostname/non-preview hosts on Production.
- Latest Pages deployment for feature head `79ae67d7aef0bc6cca97a2a1024a3e18b51f5532` succeeded. Preview: https://fce59d48.swiftdictionary.pages.dev. Stable branch preview: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev.
- Latest-head CI was still in progress at the time of the update; verify final authenticated Supabase/Auth/RPC and remaining regression conclusions before calling the branch fully green.
- Malaysian PDPA planning flag: intended 16+ audience includes 16–17-year-olds; guardian consent is required for data subjects under 18 under the Personal Data Protection Regulations. Cross-border transfers, privacy notice, DPO applicability, breach notification and retention/deletion procedures remain legal/privacy review items, not legal clearance.
- Production `main` tree hash was verified identical to its pre-action baseline after a documentation-only file was briefly created and immediately deleted from the default branch. No application code, production database or production deployment changed.
- Detailed follow-up is appended to [the U2.8.0 development-start and repository-audit archive](conversation-archive/2026-11-23-update-2-8-0-development-start-and-repository-audit.md). PR #16 remains draft; no merge or production release is authorised.


## 2026-11-23 — U2.8.0 staging feedback remediation

Owner feedback after the staging preview identified four gaps: missing Quiz overview/test redesign, non-functional Dashboard tabs, incorrect Chinese Mixed Recall visibility, and Daily History reviews navigating away from Dashboard.

- Quiz overview and active-test UI redesigned; directional question transitions, screen-entry transitions, reduced-motion handling, save/navigation locking and answer preservation implemented.
- Dashboard tab issue traced to `.dashboard-tab-panel { display:grid; }` overriding the `hidden` attribute. Added explicit hidden-panel CSS, tab state preservation, keyboard navigation and active state.
- Corrected course-specific Flashcard mode contract: English = Word / Definition / Mixed / Sentence; Chinese = Word / Definition / Translation / Sentence. Third position swaps in place. Existing staging RPC already rejects Chinese Mixed Recall and English Translation Recall; authenticated regression test added.
- Added in-place Dashboard review for permanent Lessons, all four Daily Learning activity types, Quiz sessions and Flashcard games. Lesson and Daily Learning practice reviews display correct answers read-only; Quiz and Flashcard reviews use their existing snapshots. Review does not consume allowance or change completed state.
- Updated mock Flashcard RPC/snapshots and Playwright/static regression tests. Cache-busting versions refreshed for Lessons UI, Daily Learning and Flashcards.
- No Supabase migration or staging data change was needed for these UI fixes. Production remains untouched.
- Fresh CI batch was still running when the archive was written; inspect latest-head results before declaring the staging preview ready. PR #16 remains draft.

Detailed implementation and initial CI findings: [U2.8.0 staging feedback remediation archive](conversation-archive/2026-11-23-update-2-8-0-staging-feedback-remediation.md).


## 2026-11-23 — U2.8.0 staging feedback follow-up verification

- Fixed an additional Chinese permanent-lesson Daily History edge case: Dashboard review now looks up Chinese lessons in `chineseLessonData` rather than the English catalogue. Added a Playwright regression for `zh-b-pinyin-foundations` and verified the review stays on `#profile`.
- Staging backend confirmed the existing Flashcard RPC rejects Chinese `mixed` mode with the expected validation error before allowance checks/session creation. The check ran in a rollback-only transaction. No staging migration or data change was required.
- Latest feature head: `2749d6359fafbbbbc52429b3b5f4c5a36f42ad71`. Cloudflare Pages deployment passed. Stable branch preview: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev.
- Latest-head checks passed for Quiz DB foundation, Flashcards static and browser tests (including Dashboard tabs, in-place history review, language-specific third-mode swap and Chinese lesson review), signed-out Chromium smoke, Supabase CLI Auth compatibility, U2.7 lesson allowance, ACL, Chinese dictionary, Cloudflare build routing and PostgreSQL 17 migration/allowance.
- Two duplicate push/PR full local Supabase Auth/RPC integration workflows were still running the authenticated Quiz Chromium runtime step at the time of this update. Check both final results before declaring all CI green.
- The retired Workers Builds workflow remains failed but is unrelated to the successful Cloudflare Pages deployment.
- No production code, database, branch or deployment was changed. PR #16 remains draft. Detailed record: [U2.8.0 staging feedback remediation](conversation-archive/2026-11-23-update-2-8-0-staging-feedback-remediation.md).


## 2026-11-23 — U2.8.0 authenticated Quiz regression follow-up

- Initial authenticated Quiz browser run confirmed the redesigned Quiz overview and active-test UI/directional transitions passed. Remaining failures were test assumptions/races: a localized Chinese review title was hard-coded in English; the Quiz History button was asserted while its Analytics tab was hidden; Chinese Mixed Recall RPC was tested before the synthetic user's course upsert settled; and the comprehensive Quiz end-to-end test exceeded its default 30-second timeout.
- Corrected the tests without removing product assertions: locale-aware title expectation, explicit Analytics tab selection, wait for course/translation preference upserts before authenticated RPC checks, and a 120-second timeout for the long full Quiz flow.
- Latest feature head: `e1591d86bb58d548cb51bcf848661c3036aaecd9`. Cloudflare Pages deployment passed; stable preview: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev.
- All other latest-head checks passed (Quiz DB foundation, Flashcards static/browser, signed-out Chromium, Supabase CLI Auth, U2.7 allowance, ACL, Chinese dictionary, build routing and PostgreSQL migration/allowance). Two duplicate full local Supabase Auth/RPC workflows remained in the authenticated Quiz Chromium step; check both final conclusions before declaring CI green.
- Production remains unchanged. PR #16 remains draft. See [staging feedback remediation archive](conversation-archive/2026-11-23-update-2-8-0-staging-feedback-remediation.md).


## 2026-11-23 — U2.8.0 second owner feedback remediation

- Implemented the 12-point follow-up covering Quiz Answer Review and remaining Quiz containers, bilingual Quiz-start warning/charging, difficulty colors, Chinese question answer-leak fixes, Translation Recall color/exhausted notification, Dashboard hero/tab polish, Chinese Daily History titles, activity segmentation and moving Dashboard Quiz History into Daily History.
- Chinese Quiz QA now checks both prompt languages and Pinyin. The approved 145-question staging bank has zero normalized correct-answer matches in either knowledge prompt language and zero matching prompt-Pinyin leaks. Structural checks confirm four options, a valid correct-option reference and an explanation per question, with no duplicate learning-option sets. Six weak distractor sets were improved; server-side option ordering is random per session. Active Chinese Quiz choices hide option Pinyin and translations that would expose the answer. Historical question revisions remain retained.
- Quiz allowance remains Free 1 / Premium 3 daily; charge now occurs on successful session creation after confirmation, and abandoned sessions are not refunded. Exhaustion error text and client feedback now describe the start-based rule. Quota values and local-time reset are unchanged.
- Applied nine supplemental migrations to SwiftDictionary Indie Staging, including immutable question revision preservation, five targeted Chinese distractor improvements and a performance-only RLS policy optimization. The four auth_rls_initplan performance warnings cleared. Production remains unchanged.
- Latest feature branch: feature/update-2-8-0-chinese-quiz-flashcards; PR #16 remains draft. Stable preview URL: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev.
- Latest-head CI was queued/in progress at the time of this entry. Confirm Quiz DB, authenticated Quiz, Flashcards browser, Dashboard/allowance, ACL, Chinese dictionary and Cloudflare checks before declaring staging preview ready.
- Legal/privacy review remains open: no new data category or vendor was introduced, but Malaysia PDPA/international processing, 16–17-year-old consent, retention/deletion and DPO/DPIA questions remain unresolved. The staging Auth leaked-password-protection warning also remains a dashboard-level configuration decision.
- No production merge, migration or deployment is authorised. Detailed record: [second owner feedback remediation](conversation-archive/2026-11-23-update-2-8-0-second-owner-feedback-remediation.md).


### Latest-head CI follow-up — 2026-11-23

- The first full CI attempt exposed one incorrect regression assertion in the Chinese translation-question browser test: it expected prompt Pinyin to be absent and a translated gloss to be visible. The actual question renderer correctly keeps Chinese prompt Pinyin as pronunciation support and suppresses the prompt translation for a translation question so the answer is not revealed. The test was corrected to assert that behaviour and continue asserting that option Pinyin/translation hints remain absent.
- Corrected test commit: 54abe100408390cdfb609ed16ddf67634cc5aae7.
- On this latest head, Cloudflare build routing, PostgreSQL migration/allowance tests, Supabase CLI Auth compatibility, Dashboard/allowance browser regressions, Chinese Dictionary browser checks, Flashcards browser checks and ACL regression all passed. Authenticated Quiz runtime browser checks against disposable local Supabase were still running; the preview must remain gated until they and the remaining chained regressions/Supabase advisor step finish successfully.
- Live staging Supabase audit reconfirmed Free Quiz limit 1/day and Premium 3/day, both enabled; expected authenticated Quiz RPC signatures are present; approved Chinese bank count is 145 and historical retired revisions are retained. The security advisor reports no public-schema RLS-without-policy finding; ten such INFO notices concern private-schema tables intentionally not exposed to the API. The four auth_rls_initplan performance warnings remain resolved. The project-level leaked-password protection warning remains; the available database connector does not expose the Auth project setting, so it was not changed through unsafe SQL.


- A second CI run found the same translation-question test was also assuming every question had a Pinyin field and was reading the new question before its transition render settled. The regression now waits for the question area's matching `data-question-type`, asserts Pinyin presence from that specific question's optional `prompt_pinyin`, and always verifies the translated prompt and option-side Pinyin/translations remain hidden for Chinese translation questions. This is a test synchronization/fixture-contract correction; application rendering logic was not loosened.
- Follow-up test commit: e523e4de5ade6cb7bae9471243855d2945342f96. Latest-head full CI is running again; no preview-ready declaration until the authenticated Quiz job and all sibling checks pass.


- The next Quiz runtime attempt exposed the remaining stale assumptions in that same translation-language test: it required every knowledge prompt to have both Pinyin and a translated gloss, although both are optional fields, and expected option Pinyin to be rendered despite the answer-leak prevention change. The test now synchronizes the rendered question type and checks prompt Pinyin/translation against that exact question's available metadata; it asserts active Chinese choices never show option-side Pinyin or translations in either English-translation or Chinese-translation preference cases.
- Latest test commit: 32cf8ec23a98c4bc026fc9b4cf7265618d236065. New full CI run is pending; no staging-preview-ready declaration until it passes.


- Latest feature branch commit at this checkpoint: `6baf19012164ee14e6c485ee3312e695b26c106f`. The previous attempt showed the Chinese translation-preference test also assumed non-null Pinyin/translation fields on every knowledge question. The test was corrected to assert only the fields actually present on the current question and to verify that active Chinese answer options never expose option-side Pinyin or translation. On this latest head, Cloudflare build-routing, Dashboard/allowance, PostgreSQL allowance, Supabase CLI Auth compatibility, Flashcards browser, Chinese Dictionary browser and ACL checks are green. The Quiz DB foundation's authenticated local-Supabase Chromium runtime suite remains in progress; release readiness is therefore still pending.


## 2026-11-24 — U2.8.0 staging CSS overlay, owner-feedback verification, and authenticated Quiz closeout

### Staging presentation correction

- Owner reported that the U2.8.0 staging preview displayed what looked like source code/scripts over the SwiftDictionary interface.
- Repository inspection identified the exact cause in `index.html`: the main stylesheet's closing `</style>` tag appeared before the newly added Dashboard and Quiz CSS. The remaining CSS was therefore emitted as visible page text.
- Corrected the stylesheet boundary in feature-branch commit `cc2063440f67eca2c277df12c789f4150312c205`.
- Added a regression guard in `scripts/quiz/validate-quiz-frontend.mjs`. It now verifies that the Quiz overview/session, difficulty, review, Dashboard hero, Dashboard tab and Dashboard panel selectors remain inside the main stylesheet, and that Translation Recall retains its orange CSS treatment.
- Cloudflare Pages confirmed successful deployment of the corrected feature branch. The stable preview is `https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev/`.

### Owner-feedback implementation verification

The two U2.8.0 staging-feedback rounds were checked against the feature branch implementation and dedicated browser assertions. Verified behaviours include:

- Redesigned Quiz overview and active-question experience, including directional question transitions.
- Functional Dashboard tabs that switch their corresponding visible panels.
- Course-aware recall modes: Mixed Recall for English and Translation Recall for Chinese, occupying the same third mode position.
- In-place Daily History reviews, with separate Lessons, Quiz and Flashcards history sections; normal Quiz navigation opens the Quiz overview rather than a completed review.
- Chinese Quiz answer choices do not expose answer hints through English translations or Pinyin.
- Quiz start confirmation explains the allowance charge; cancelling does not consume an allowance.
- Redesigned Quiz difficulty/review presentation and distinct difficulty styling.
- Orange Translation Recall visual treatment and Flashcards allowance-exhaustion notification.
- Dashboard hero/tab styling, Flashcards Dashboard statistics and in-place Weak Memory review.
- Existing Chinese Lessons/Daily Learning, history, Preferences and account-isolation regressions remain covered by their dependent suites.

### Quiz browser-test synchronization correction

- The first post-fix authenticated browser run exposed an intermittent test race: the test could accept the previous question while its answer-save/navigation RPC was still in flight, then compare that snapshot against the next rendered question.
- The test was strengthened to wait for `quizPageState.saving` to clear, verify the expected question position, and compare the same question snapshot against the rendered prompt, Pinyin and translation.
- This was a test synchronization correction; the application's answer-save and navigation protections were retained.
- Final test correction commit: `c994e271a7296c0ee8dec5d69d6a4376a0fb0b45`.

### Final validation on `c994e27`

Successful checks:

- Quiz database foundation and authenticated Quiz RPC/session/allowance lifecycle.
- Authenticated Chromium Quiz runtime, including selected translation language and Chinese question-type coverage.
- Signed-out Flashcards and Preferences browser regressions.
- Permanent Lessons allowance notification regression.
- Supabase security advisors against the disposable local Quiz schema.
- Update 2.3.x Dashboard/allowance regressions.
- Update 2.5.0 Flashcards checks.
- Update 2.6.0 ACL drift regression.
- Update 2.7.0 Chinese dictionary and lesson-start allowance checks.
- PostgreSQL migration/allowance tests, Supabase CLI Auth compatibility, Chromium browser regression smoke tests and Cloudflare build-routing guard.
- Cloudflare Pages deployment check: successful.

The push and pull-request Quiz foundation workflows both completed successfully on `c994e27`. The separate `Workers Builds: swiftdictionary-testing` check still reports failure for the retired testing Worker; it is not the active SwiftDictionary Pages deployment and does not negate the successful Pages deployment.

### Environment and release state

- Quiz browser/authentication tests used disposable local Supabase environments and synthetic test accounts.
- The earlier staging question-bank audit was read-only. No Production or live Supabase migration/write was performed as part of this remediation.
- PR #16 remains a draft and has not been merged. U2.8.0 remains in staging; Production is unchanged.


## 2026-11-24 — U2.8.0 final Chinese Quiz and Flashcards content QA

- Latest feature branch head: `931c40242a2061cfe82f2f2a899720f4380b9f68`; PR #16 remains open and draft, based on `main`.
- Final Quiz Answer Review spacing feedback was applied; the total-correct score now has additional clearance from the top-right close button. Stylesheet cache key is `2.8.0-ui11`.
- Reviewed all 145 Chinese Quiz items (128 knowledge and 17 English-to-Chinese translation questions). Automated validation and staging SQL audit found 145 unique active questions, four unique options each, valid correct-option keys, unique prompts and zero answer leaks. Authenticated session payloads omit correct-option IDs and review explanations until a completed session; question and option order are randomized. Review RPCs are owner-scoped and completion-gated.
- Chinese Flashcards: 519 characters, 904 vocabulary terms and 24 phrases. Source checks passed for 519/519 character records and 904/904 numeric/accented vocabulary Pinyin pairs. All eligible targets have three distinct distractors; sentence recall blanks all target occurrences.
- Content corrections: duplicate English cues for `教师/老师` and `夏天/夏季` were resolved by disabling English Translation Recall for `教师` and `夏季`. 490 answer-revealing Definition Recall cues and 445 answer-revealing Chinese Translation Recall cues were removed from those modes. Runtime and validator checks now reject target-containing Chinese definition/translation cues. The `没问题` Chinese cue was refined to `没有问题`.
- Validated mode coverage: Word 1,447; Definition 53; English Translation 1,437; Chinese Translation 71; Sentence 543. 27 character cards still lack a reviewed Chinese equivalent and remain excluded from Chinese Translation Recall. The content bank remains draft; no release status was automatically changed.
- Latest-head checks passed: Quiz/Flashcard validators, 22 authenticated Quiz Chromium runtime tests, Flashcards browser checks, PostgreSQL migration/allowance and ACL regressions, Supabase CLI Auth, Chinese Dictionary/Lessons checks, Chromium regression smoke tests, Supabase security advisors, Cloudflare Pages and build-routing guard.
- The separate `Workers Builds: swiftdictionary-testing` check remains failed for the retired testing Worker; Cloudflare Pages succeeded.
- No Production Supabase migration/write or Production deployment occurred. No additional staging migration was required. PR #16 remains unmerged.
- Full details: `docs/conversation-archive/2026-11-24-update-2-8-0-chinese-quiz-flashcard-polishing.md`.

## 2026-11-24 — Update 2.9.0 plan approved; future Premium collection limits recorded

- The owner approved the recommended Update 2.9.0 development sequence and requested the plan be finalized and recorded here.
- Authoritative plan: [Update 2.9.0 Development Plan](UPDATE-2.9.0-DEVELOPMENT-PLAN.md). Owner decision archive: [2026-11-24 Update 2.9.0 planning approval and Premium collection-limit decision](conversation-archive/2026-11-24-update-2-9-0-planning-approval-and-premium-collection-limits.md).
- Core scope: expand the English dictionary by approximately 500–700 new words where quality permits; perform a full existing-and-new English entry audit for complete, accurate contextual definitions, multiple senses and grammatical forms; add Dashboard Favorite collections; expand English category filters; ensure Simplified Chinese translations cover English definitions; and prepare a visual-only Get Premium Plan interface/navigation.
- Favorite collections must be user-named, managed through in-site centred modal dialogs (never browser-native prompt/alert), and allow saved words from both English and Chinese regardless of course-language difference. A saved word may belong to multiple collections. Removing a word from a collection must not remove it from Favorite words. Collections must sync across devices and remain account-isolated, with Supabase RLS and authorization enforced.
- English Lessons, Quiz and Flashcards content expansion is explicitly optional and must not jeopardise core scope or QA. Prioritise it only if the main deliverables are complete and the workload allows.
- Approved development sequence: (1) repository/content/data audit and planning; (2) English dictionary expansion and full accuracy review; (3) English filter expansion and translation QA; (4) Favorite collections implementation and Supabase integration; (5) visual-only Premium interface/navigation; (6) optional English Lessons/Quiz/Flashcards expansion; (7) consolidated full QA and release preparation.
- Premium direction recorded for future planning: Premium benefits are intended to expand beyond daily allowance increases alone. The owner proposed a collection-folder capacity of **16 folders for Free accounts** and **40 folders for Premium accounts**. These are proposed future entitlement limits, not an activated entitlement or a U2.9.0 payment feature. U2.9.0 may prepare visual presentation only; it must not introduce checkout, payment processing, subscription activation, entitlement enforcement or change existing allowance rules.
- Collection-capacity implementation is not to be treated as unlimited. When eventually implemented, enforce limits server-side as well as in the UI; test concurrent folder creation and account isolation. A safe downgrade policy should preserve existing folders rather than silently delete user data if a Premium account has more than the Free limit; block additional folder creation until the account is within its current entitlement or upgrades again. This downgrade behaviour is a recommended data-preservation safeguard for future Premium implementation, not an independently approved detailed subscription policy.
- Legal/privacy planning remains mandatory: assess Malaysia PDPA and relevant international requirements, age-appropriate safeguards for the global 16+ audience, data minimisation, retention/deletion, cross-border processing, content licensing, and (before any actual Premium launch) consumer/payment disclosures and subscription cancellation/refund obligations. No legal clearance or Premium launch approval is implied.
- This is a documentation/planning approval only. No U2.9.0 application code, content, SQL, schema, RPC, staging or production data, deployment or payment integration has been changed or authorised by this record update.
- Recovery point: documentation branch `docs/master-development-record`; the plan and archive are the authoritative U2.9.0 planning records. U2.8.0 remains completed and live; U2.9.0 implementation awaits a separate start instruction.



## 2026-11-24 — Update 2.9.0 implementation checkpoint: Phase 1 complete, Phase 2 content target reached

- Development began after the owner's separate start instruction, following the 2026-11-24 planning approval. Authoritative scope remains in [Update 2.9.0 Development Plan](UPDATE-2.9.0-DEVELOPMENT-PLAN.md).
- Application branch: `feature/update-2-9-0-english-dictionary-collections`; latest checkpoint commit: `f2ef3b1e233818ebd5363c328d6c9689a4a9372d`. At this checkpoint the branch was 55 commits ahead of and 0 behind `main`; no PR was opened.
- Phase 1 audit: the embedded English baseline contains 810 entries and 810 unique headwords. Read-only saved-word review confirmed existing account-owned `public.saved_words` records with RLS; collection CRUD and mixed-language membership were not present. No database changes were made.
- Baseline structural scan: all 810 entries have core word/POS/pronunciation/definition/Chinese-translation/examples/tip fields; after corrections, 216 have fewer than two examples; 130 have explicit sense arrays (304 senses, all with Simplified Chinese translations); 680 have no explicit sense array, including 110 multi-POS entries; 38 lack optional `breakdown`/`related`; none has category assignments. These are structural findings, not linguistic certification.
- Added and integrated 30 POS-specific sense patches (60 sense records) and 42 second-example sentences into the feature-branch `index.html` at commit `9c09415afe879e1960dd254e6243e07c2dbb8615`. The new 506-word expansion remains separate from the runtime array pending full content QA and integration.
- Phase 2: 506 authored English additions across eleven batches. Normalised duplicate comparison found 0 overlaps with the 810-entry baseline; all 506 are unique and present in the 660-item candidate inventory. 185 baseline-existing candidates were excluded during initial inventory preparation; 154 candidates remain un-authored. Projected dictionary size after integration: 1,316.
- Cross-file structural audit found zero errors for duplicate headwords, missing required fields, malformed examples/senses, invalid course/category values or candidate membership. A standalone Node validator exists and was corrected for optional empty related fields and normalised compound-word checks; actual Node/CI execution remains pending.
- Phase 2 is **not complete**: full linguistic review of all existing and new English entries, sense/POS/inflection QA, example expansion for the 258 short baseline records, review of the 710 baseline entries without explicit sense arrays, translation-quality review and runtime integration remain open.
- Phase 3 category/filter implementation must classify all 810 existing entries as well as the 506 additions; Chinese course and headword-only search semantics must remain unchanged.
- Phase 4 Favorite collections remains unstarted. Before it begins, read the Supabase skill and re-audit schema, migrations, RLS, RPCs, indexes and account isolation. Mixed-language membership must not alter global Favorite words.
- Legal/privacy planning: the Malaysia PDPA scope remains fact-specific; global 16+ age does not remove jurisdiction-specific child-data obligations; collection names/membership are account-linked data; Tokyo primary database region requires cross-border transfer review; dictionary content/translation/example licensing must be checked. No legal clearance is implied.
- No staging preview has been created. The owner explicitly requires staging to wait until Phase 4 is fully implemented and internally validated. No production branch, production deployment or Supabase database/data/policy change occurred.
- Detailed session archive: [2026-11-24 U2.9.0 development Phase 1 and Phase 2 content expansion](conversation-archive/2026-11-24-update-2-9-0-development-phase-1-and-2-content-expansion.md).


## 2026-11-25 — Update 2.9.0 Phase 2 content audit and validator hardening

- The owner reiterated the instruction to finish the remaining Phase 2 work and explicitly withhold staging preview until Phase 4 is complete and internally validated.
- The feature branch contains 506 new English entries across seven JSON batches, with 506 unique normalised headwords and zero overlap with the 810-entry baseline. The runtime file matches the ordered batch source files exactly.
- All 506 new entries have required core fields, at least two non-empty general examples, valid approved category labels and 686 complete sense records with Simplified Chinese translations. Zero declared-POS mapping errors remain after 13 duplicate noun/verb sense records were rewritten and seven repeated sense examples were corrected.
- The 810-entry baseline was parsed in full: 810 unique headwords, zero missing core fields, at least two non-empty general examples for every entry, zero repeated general examples within an entry and zero definitions shorter than 20 characters after targeted corrections. The baseline has 270 entries with explicit sense arrays and 593 total senses. Five missing noun senses were added to miss, go, hold, leave and call; the multi-POS mapping audit now reports zero errors across all 176 multi-POS entries. Definitions, Chinese glosses and IPA were improved for frequent, frequently, rarely, recently and similarly.
- The repository validator now checks the existing baseline as well as the expansion batches, including required fields, example coverage, pronunciation notation, sense completeness and POS-to-sense coverage. One intermediate CI failure caused by an over-escaped IPA regex was diagnosed from the Node stack trace, corrected, and followed by a successful run.
- Latest full successful GitHub Actions run: 45534072220 on commit c88b637e8e9cb7042c7c7763ae41113cec2d1779. Node validation, runtime equality/load order and all three Playwright smoke tests passed.
- Phase 2 remains in progress: the automated and targeted editorial checks do not constitute professional/native-speaker certification of every lexical nuance or all sense-level translations. Full semantic review and manual Simplified Chinese translation QA remain open.
- Phase 3 category/filter work and Phase 4 collections have not started. Phase 4 must include a fresh Supabase schema/migration/RLS/RPC/account-isolation audit before implementation. The Supabase skill has been read.
- No staging preview, production merge/deployment, Supabase schema/data/policy write or Premium/payment activation occurred.
- Detailed session archive: [2026-11-25 Update 2.9.0 Phase 2 content audit and validator hardening](conversation-archive/2026-11-25-update-2-9-0-phase-2-content-audit-and-validator-hardening.md).


## 2026-11-25 — Update 2.9.0 Phase 2 completed

- The owner asked to finish Phase 2. Work remained isolated to `feature/update-2-9-0-english-dictionary-collections`; no staging preview was prepared.
- 506 unique English headwords were authored in seven source batches (20, 20, 21, 19, 20, 177, 229), with zero overlap against the 810-entry baseline. The consolidated runtime contains exactly the ordered batch entries. Final projected English catalogue: 1,316 unique headwords.
- The expansion contains 766 sense records. All 183 multi-POS entries have distinct POS-specific senses; no combined POS sense labels remain. A focused audit also corrected 38 noun/verb definitions, Chinese translations and/or examples that had mixed the two grammatical meanings.
- New-entry checks report zero missing required fields, zero missing Chinese sense translations, zero incomplete sense records, zero missing POS mappings, zero duplicate general examples, zero duplicate headwords and zero unapproved categories.
- The baseline was parsed from the latest feature-branch `index.html`: 810 unique headwords, 302 entries with 657 explicit sense records, 508 single-POS entries without explicit sense arrays, all 176 multi-POS entries with sense coverage, and all 810 entries with at least two contextual examples. Twenty additional high-frequency baseline entries received 40 distinct sense records. The current machine-readable audit is `data/english-baseline-qa-audit.json`.
- Final successful CI/browser run: **45537066279**, commit `399ad92e06cd93bcc9f1cc6eabb7a7222c22d45c`. Baseline-aware Node validation, batch/runtime equality, script load order and all three Playwright browser smoke tests passed.
- Internal model-assisted editorial QA is complete. This does not represent independent professional/native-speaker certification of every lexical nuance, IPA accent variant or translation; that limitation remains visible for release review.
- Phase 3 and Phase 4 have not started. The staging preview remains withheld until Phase 4 is implemented and internally validated.
- No Supabase schema/data/policy writes, production merge/deployment, payment integration, Premium entitlement enforcement or subscription activation occurred.
- Detailed completion archive: [2026-11-25 Update 2.9.0 Phase 2 completion](conversation-archive/2026-11-25-update-2-9-0-phase-2-completion.md).


## 2026-11-25 — Update 2.9.0 Phase 3 category/filter and translation QA checkpoint

- The owner explicitly confirmed Phase 2 complete and instructed immediate Phase 3 work. Application changes remain isolated on `feature/update-2-9-0-english-dictionary-collections`.
- Added `data/english-baseline-categories.js` for all 810 original English headwords and integrated it before the main application script. The 506 expansion entries already have category arrays in their seven source batches and consolidated runtime dataset.
- Added `english-category-filters.js` and wired it into `index.html`. The ten approved English topic filters appear in a separate row above the existing part-of-speech controls. Topic filters compose with headword-only search, alphabet selection, saved-word filtering and pagination. The English topic row hides/resets when Chinese is selected; existing Chinese category and pinyin filters remain intact.
- Added `scripts/dictionary/validate-english-phase3.mjs` to audit approved category coverage and Simplified Chinese headword/sense translation presence across the baseline and expansion.
- All 1,316 English headwords have category assignments. Combined category assignment counts (multi-category entries count in each assigned category): Actions 442; Everyday Terms 379; Activities 62; Places 83; People & Relationships 68; Science & Technology 74; History & Culture 33; Nature & Environment 49; Education 68; Emotions & Descriptions 249.
- Translation field inventory: all 810 baseline headword definitions have Simplified Chinese translations; all 657 explicit baseline sense records have Chinese translations. All 506 expansion headword definitions and 766 expansion sense records have Chinese translations. This is structural completeness, not professional/native-speaker certification.
- Added Playwright tests for topic/search/POS composition, multi-sense translation switching, single-sense baseline translation fallback and Chinese-course filter isolation.
- Initial browser-test runs failed due to test assumptions/selectors: the test queried controls while the filter panel was closed; one translation test had not explicitly selected Chinese; and a non-exact “Verbs” selector also matched “Adverbs”. The tests were corrected; the application filter code was not changed in response to these test-only failures.
- Latest full successful CI run: **45540254655**, commit `95b9253b5a796d4cb2a62b838690659bc599fffe`. Existing Phase 2 validator, Phase 3 category/translation audit, Playwright/Chromium setup and all six browser tests passed.
- Malaysia/general legal and privacy check: this phase adds public editorial category metadata and UI only. It introduces no new personal-data collection, tracking, external processor or Supabase change. Existing PDPA applicability, global 16+ age screening, privacy and content-provenance/licensing obligations remain relevant; this is not legal clearance. No payment, subscription or Premium entitlement enforcement was added.
- No Supabase schema/data/policy write, staging preview, production merge/deployment, payment integration or Premium enforcement occurred. Dictionary search remains free and unlimited; proposed Free 16-folder/Premium 40-folder capacities remain future planning only.
- **Phase 3 remains in progress** pending broader semantic/editorial spot checks of category assignments and Chinese translations, plus responsive and interaction regression. Phase 4 remains not started and must retain its fresh Supabase schema/migration/RLS/RPC/account-isolation audit. Staging preview remains withheld until Phase 4 is fully implemented and internally validated.
- Feature-branch progress record: `docs/U2.9.0-IMPLEMENTATION-PROGRESS.md`. Authoritative approved plan: `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`.
- Detailed session archive: [2026-11-25 Update 2.9.0 Phase 3 category filters and translation QA](conversation-archive/2026-11-25-update-2-9-0-phase-3-category-filters-and-translation-qa.md).


## 2026-11-25 — U2.9.0 Phase 3 editorial and mobile QA follow-up

- An additional semantic scan of the 810-entry baseline category metadata identified clearly specialist scientific, environmental, historical/cultural and educational entries that had been placed too broadly. Added 89 targeted manual category overrides across two spot-check passes.
- Latest combined category assignment counts: Actions 442; Everyday Terms 307; Activities 62; Places 85; People & Relationships 71; Science & Technology 147; History & Culture 46; Nature & Environment 73; Education 70; Emotions & Descriptions 233. Multi-category entries are counted in every category.
- Added a narrow 390px viewport browser regression covering topic-row availability, wrapping/no horizontal overflow and an actual Places-filter selection.
- Latest authoritative CI run **45540937597**, commit `82ba00e4d6913eede952a3d7f0aa998d93054784`, passed baseline/expansion validation, Phase 3 category/translation audit, Playwright/Chromium setup and all seven browser tests.
- Translation field coverage remains: baseline 810 headword translations and 657 sense translations; expansion 506 headword translations and 766 sense translations; zero missing fields reported.
- Phase 3 remains in progress pending broader editorial review of category assignments and Chinese translation semantics. Phase 4 has not started. No staging preview, Supabase change, production merge/deployment or Premium/payment enforcement occurred.
- This phase's Malaysia/general legal check remains unchanged: no new personal-data processing or external processor; existing PDPA, global 16+ screening, privacy and content licensing obligations remain relevant.


## 2026-11-25 — U2.9.0 Phase 3 translation-content audit strengthening

- Extended `scripts/dictionary/validate-english-phase3.mjs` to require Chinese characters in each English headword/sense translation and reject known placeholder/fallback strings, not merely empty fields.
- Latest audit: baseline 810/810 headword translations and 657/657 sense translations; expansion 506/506 headword translations and 766/766 sense translations. Zero translations without CJK characters and zero placeholder translations.
- Targeted sense-alignment review sampled 20 high-frequency baseline entries and 8 expansion entries. Distinct English meanings remained separately translated in the reviewed cases; this remains model-assisted spot checking, not independent native-speaker certification of every translation.
- Latest full CI run **45541339325**, commit `48ec2caabe3e8dae3fa223380efd9d51852ca6e8`, passed both data validators, Playwright/Chromium setup and all seven browser tests.
- Phase 3 remains in progress pending broader editorial review and completion of remaining approved scope; Phase 4 has not started.


## 2026-11-25 — U2.9.0 Phase 3 visual-only Premium preparation

- Added a global-header “Premium plan” entry and an in-site Free/Premium comparison dialog.
- UI copy marks Premium and Collections as future proposals, not currently available. It states dictionary search remains free and unlimited, proposed folder capacities are 16 for Free and 40 for Premium once Collections launches, and future Premium value is intended to include higher daily learning allowances and additional organisation benefits.
- No checkout, payment, purchase, billing portal, subscription activation, entitlement mutation, allowance change or Supabase integration was added.
- Added responsive styling and keyboard accessibility: Escape/backdrop/close actions, focus restoration and tab focus containment.
- Playwright covers future-only status, absence of purchase actions, keyboard close/focus restoration and mobile fit.
- Latest full CI run **45541902319**, commit `0279d056fa1b11c0f31b1263ac918daacab0edcd`, passed both content validators, Playwright/Chromium setup and all nine browser tests.
- Malaysia/general legal check: informational-only UI introduces no new personal-data processing or consumer transaction. Actual Premium activation still requires separate payment, recurring-billing, tax, consumer-disclosure, cancellation/refund and processor review. Proposed folder limits are not active entitlements.
- Phase 3 remains in progress. Phase 4 has not started; no staging preview, production merge/deployment or Supabase write occurred.


## 2026-11-25 — U2.9.0 Phase 3 expanded category and Premium regression

- Added browser coverage for all ten English topic categories, ensuring each returns entries. Verified topic-scoped pagination across five Actions pages and reset of the active English topic after switching to Chinese and back.
- Expanded visual-only Premium UI tests for proposed 16/40 folder capacities, unlimited free dictionary search, future-only disclosure, absence of checkout/payment/subscription actions, Escape close/focus restoration and narrow-mobile fit.
- Latest full CI run **45542196426**, commit `70f3e27486a8609aa11c22c29fae6529cb94fe09`, passed baseline/expansion validation, strengthened Phase 3 translation/category audit, Playwright/Chromium setup and all ten browser tests.
- Phase 3 core implementation is integrated. Broader semantic/editorial review remains open; Phase 3 is not marked complete. Phase 4 has not started.


## 2026-11-25 — U2.9.0 Phase 3 expansion-content regression

- Extended browser coverage to verify Phase 2 expansion entry `adjust` displays both explicit Simplified Chinese senses and updates immediately when switching translation language; also verified expansion-only `accretion` is returned by the Science & Technology topic filter.
- Latest full CI run **45542376568**, commit `234c0b2edb4b61e8d6dac0ed03c52db8c4a15083`, passed both content validators and all ten browser tests.
- Phase 3 remains in progress pending broader semantic/editorial review. Phase 4 has not started.


## 2026-11-25 — U2.9.0 Phase 3 completed


## 2026-11-25 — Phase 3 completion checkpoint

**Phase 3 is complete. Phase 4 is now the next development phase, but has not been started.** No staging preview has been created.

### Full-catalogue editorial and structural audit

- Added `scripts/dictionary/audit-english-catalogue.mjs`, a reproducible audit covering all 810 baseline entries and 506 expansion entries (1,316 total).
- Latest audit: zero duplicate headwords, missing required fields, invalid parts of speech, insufficient examples, duplicate examples, duplicate senses, multi-POS entries lacking sense coverage, missing/unapproved topic categories, or structurally incomplete Chinese translations.
- Reviewed all 15 concise-definition flags manually/model-assisted; all are intentionally concise, contextually supported definitions rather than omissions. The report records 15 reviewed and accepted, zero unresolved short-definition candidates.
- The report is preserved as the `u2-9-0-english-catalogue-editorial-audit` artifact in the final QA run.

### Editorial corrections and coverage

- Corrected 14 expansion sense definitions/translations to improve self-contained meaning and English–Chinese alignment, including lecture, father, mother, pedestrian, favourite, cycle, picnic, design, golf, kayak, breeze, coral, telephone and text message.
- Corrected the headword-level Chinese definition alignment for pedestrian, breeze and coral.
- Translation coverage remains complete: baseline 810/810 headwords and 657/657 senses; expansion 506/506 headwords and 766/766 senses. No translation fields lack CJK characters or contain detected placeholders.
- Category assignments cover all 1,316 entries, with 1,536 total assignments across the ten approved categories.

### Interaction and responsive QA

- All ten English topic categories return results; topic filtering composes with headword search and POS filtering and scopes pagination correctly.
- Switching between English and Chinese resets/hides the English topic filter without disturbing Chinese character filtering.
- Multi-sense and expansion translation switching is verified, including the corrected 14-entry sense translations.
- Premium information dialog remains visual-only, clearly future-only and without payment, checkout, subscription or entitlement changes.
- Final full CI run **45544792646**, commit `278a2c20472988935f615f1e0b2bab1d551fadde`, passed both dictionary validators, the whole-catalogue audit, Playwright/Chromium setup, all **11 browser tests**, and audit-artifact upload.

### Release boundary and legal/privacy review

- No Supabase schema, data, RLS policy, RPC or production database changes were made. No production merge/deployment or staging preview was created.
- No new personal-data collection, tracking, third-party processor, payment, subscription or Premium entitlement behaviour was introduced.
- Malaysia/general legal planning remains: existing PDPA/privacy, 16+ audience, content provenance/licensing and accessibility obligations remain applicable. Actual Premium activation requires separate consumer, payment, tax, cancellation/refund and processor review. This is planning, not legal clearance.
- Dictionary word-grid search remains free and unlimited. Proposed folder limits remain future policy only.
- Phase 4 may now begin on the feature branch, following the approved collections data/security design. Staging remains withheld until Phase 4 is implemented and internally validated.


## 14. Update 2.9.0 — Phase 4 Favorite Collections kickoff (2026-11-25)

- Phase 3 completion is confirmed; Phase 4 is now in progress.
- Application branch remains feature/update-2-9-0-english-dictionary-collections. Initial files: favorite-collections.js, account-deletion.js loader update, tests/browser/u2-9-0-favorite-collections.spec.js, supabase/migrations/20261125041816_swiftdictionary_update_2_9_0_favorite_collections.sql and supabase/tests/favorite_collections.sql.
- Isolated staging migration version 20261125041816 created public.favorite_collections and public.favorite_collection_items. Both tables have RLS enabled; four collection owner policies and three membership owner policies enforce access. Membership links require ownership of both the folder and saved-word row. Case-insensitive per-user name uniqueness, 1–48 character trimmed names, indexes and cascading membership foreign keys are present.
- Read-only schema checks passed. Existing staging saved_words rows remain unchanged at 14; collections and membership tables are empty after checks. The post-migration advisor reported no new collections-specific finding; existing private-table RLS notices and leaked-password-protection warning remain.
- Static SQL and mocked Playwright regression files have been added. Their CI/runtime results are not yet verified. Adversarial two-account RLS tests, authenticated CRUD and actual UI placement/responsive checks remain outstanding.
- No staging preview, production database/schema/data change, production merge/deployment, payment integration or Premium entitlement enforcement has occurred. Dictionary search remains free and unlimited; learning allowances remain unchanged; proposed Free 16/Premium 40 folder capacities remain future policy only.
- Legal/privacy planning: collection names are user-generated content and memberships reference existing account-owned saved words. No new tracking, identity data or processor is added. Review transparency, retention/deletion and Malaysia PDPA/general international 16+ safeguards before release; this is not legal clearance.
- Continue Phase 4 until fully implemented and internally validated before creating the first staging preview. See the dated Phase 4 archive for detailed recovery steps.


### Phase 4 validation follow-up — 2026-11-25

The U2.9.0 Favorite Collections SQL regression script was executed successfully against isolated staging and rolled back. It checks RLS enablement, seven owner-scoped policies and their auth.uid()/collection/saved-word predicates, cascading membership foreign keys, case-insensitive per-user name uniqueness, anonymous denial and authenticated grants. Existing saved-word data remains unchanged. Authenticated two-account API testing, actual browser/CI verification and UI placement/responsive validation remain outstanding; the first staging preview remains withheld until Phase 4 is fully implemented and internally validated.


### Phase 4 browser QA follow-up — 2026-11-25

GitHub Actions run 45547406099 succeeded on commit e4a605bc4ee880882b2b7ed998450e7f014eb27d: all 12 Playwright tests passed, including the new mocked Favorite Collections workflow. English expansion validation, Phase 3 category/translation audit and whole-catalogue editorial audit also passed, and the audit artifact uploaded. Earlier failures were corrected (hidden section CSS and test ordering assumption). This remains mocked Supabase coverage; live authenticated CRUD, two-account authorization, actual dashboard placement and full responsive/accessibility validation remain outstanding. No staging preview or production change has occurred.


### Phase 4 Realtime follow-up — 2026-11-25

The staging publication initially contained no public tables, so added and applied migration 20261125043448 to publish only favorite_collections and favorite_collection_items for Postgres Changes delivery. RLS remains enforced. The strengthened SQL regression, including Realtime publication membership, passed with rollback. The cache-safe loader was moved to supabase-config.js and scheduled at DOMContentLoaded after app scripts; a p4 cache-busting query is used. A real-app-shell loader browser test was added. Prior CI run 45547652317 passed all 12 tests before these follow-up changes; a new run is pending. Authenticated live CRUD, adversarial cross-account RLS, actual dashboard placement and real Realtime delivery remain unverified.


### Phase 4 Realtime/loader CI evidence — 2026-11-25

Run 45547652317 passed all 13 Playwright tests, including the real-app-shell loader test. Run 45547784739 passed all 13 tests after the SQL regression added a publication-membership assertion, and run 45547828600 passed after workflow path filters were corrected. The staging SQL regression also passed separately. Browser CRUD is mocked; live authenticated CRUD, adversarial cross-account RLS and actual Realtime event receipt remain outstanding. The prior archive wording suggesting the loader test was added after run 45547652317 was incorrect and has been corrected in the archive addendum.


### Phase 4 Favorite words panel placement — 2026-11-25

Run 45548152492 passed all 13 Playwright tests, including an application-shell DOM assertion that Your collections is the immediate sibling after the existing Favorite words profile card and before Learning progress. The versioned supabase-config.js loader passed as well. This confirms structural placement, not a visual signed-in device review. Live authenticated CRUD, adversarial two-account RLS/API testing and actual Realtime event receipt remain outstanding.


### Phase 4 expanded regression and staging integrity — 2026-11-25

Run 45548503961 passed all 13 Playwright tests, including mocked blank/duplicate name handling, mixed-language membership, CRUD, membership removal without Favorite-word deletion and two-account UI isolation. The test double was corrected to follow the active account dynamically. Collection counts now use one membership query. Post-Realtime staging checks confirm the existing saved_words count remains 14, collections/membership tables remain empty, and both tables are in supabase_realtime. The security advisor remains at ten informational private-schema RLS/no-policy notices and one leaked-password-protection warning; no collections-specific finding. Live authenticated API/RLS, actual Realtime delivery, and signed-in desktop/mobile/accessibility review remain outstanding.


### Phase 4 saved-word schema correction — 2026-11-25

Staging schema inspection found saved_words contains id (bigint), user_id (uuid), course (text) and word (text), without created_at. The collection picker was changed to order by id descending, test fixtures now match the actual table, and the SQL regression asserts this schema contract. The strengthened SQL regression passed against staging. Browser CI for the final schema-aligned change is in progress. This was caught before staging preview/production rollout.


### Phase 4 schema-aligned browser QA — 2026-11-25

Run 45548857974 passed all 13 Playwright tests after aligning the saved-word picker with the real saved_words schema (id, user_id, course, word; no created_at). The SQL regression now asserts this schema and passed. Browser coverage includes name validation, mixed-language collection membership, CRUD, account-switch UI isolation, real-app loader and Favorite words placement. Staging retains 14 saved words, zero collection/membership rows and both collection tables in supabase_realtime. Security advisor findings remain unchanged. The two collection indexes are unused only because staging has no collection data; they support planned query and FK patterns. Live authenticated CRUD, adversarial API-level RLS, actual Realtime event delivery and signed-in desktop/mobile/accessibility checks remain open.


### Secure private Realtime Broadcast redesign — 2026-11-25

- Replaced the initial Postgres Changes subscription with account-scoped private Broadcast topics (favorite-collections:<auth.uid()>). Supabase documents that DELETE events cannot be filtered and DELETE events are not RLS-filtered; a table-level Postgres Changes listener therefore was not acceptable for user-owned collection data.
- Added a realtime.messages SELECT policy restricted to authenticated users whose auth.uid() matches the current private topic and whose extension is broadcast.
- Added a trigger function in the non-exposed private schema. It is SECURITY DEFINER, uses an empty search_path, resolves the owner from the collection or saved-word parent for cascading membership deletes, and has EXECUTE revoked from PUBLIC, anon and authenticated. Only table triggers can invoke it.
- Added AFTER INSERT/UPDATE/DELETE triggers to both collection tables. Client subscriptions now use private=true and handle INSERT, UPDATE and DELETE Broadcast events. Account switching removes the previous channel and creates the new user's private topic. A visible status message appears if the channel reports an error or timeout.
- Removed both collection tables from the supabase_realtime Postgres Changes publication in migration 20261125050329, so the app cannot accidentally fall back to unfiltered DELETE events.
- Staging migrations now include 20261125050023 (private Broadcast policy/triggers) and 20261125050329 (remove Postgres Changes publication). The SQL regression passed after asserting the topic-scoped policy, both triggers, SECURITY DEFINER + empty search_path, revoked API-role execution, and no direct Postgres Changes publication membership.
- The authenticated two-account SQL regression also passed in a rollback transaction. It checks each account's own CRUD, cross-account SELECT/UPDATE/DELETE denial, rejection of membership that references another account's collection or saved word, and rejection of user_id reassignment. No fixture rows remain.
- Important staging runtime condition: no Realtime WebSocket client has yet connected to this staging project, so realtime.messages currently has no daily partitions. Supabase creates its rolling message partitions when a client first joins over WebSocket (and the janitor maintains them while the project remains active). Calling a database broadcast before the first socket connection logs WarnSendingBroadcastMessage: no partition of relation messages found for row; this is expected before any listener exists, not evidence that the trigger function is malformed. We deliberately did not create or alter Supabase-managed objects in the locked realtime schema. The first authenticated staging-preview session must establish the private channel; then actual cross-device delivery can be verified.
- Supabase security advisor has no collections-specific finding. Existing findings remain 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning. Performance advisor continues to report unused indexes in empty tables; the saved-word FK index remains justified for cascade cleanup.
- Privacy/legal review: collection names and saved-word references are user-created account data. Malaysia PDPA and general international privacy obligations remain a pre-publication review item. The current Terms page is still explicitly unpublished; no legal approval or public terms/privacy representation is claimed.
- No production database, main branch, deployment or staging preview was changed or created by this work.


### Phase 4 staging-preview readiness — 2026-11-25

- Implementation and internal validation are complete enough for a controlled staging preview. No preview deployment has been created yet; production and main remain untouched.
- Latest GitHub Actions run 45550967547 passed all 13 Playwright tests. Coverage includes collections CRUD, mixed English/Chinese membership, duplicate/blank names, preserving saved words on membership removal, two-account UI isolation, stale-response protection during account switching, private Broadcast configuration/event handlers, channel replacement on account switch, app-shell loader, Favorite words placement, mobile viewport and keyboard dialog behaviour, and desktop no-overflow checks.
- The staging SQL regression passed after the private Broadcast redesign. It validates owner-scoped collection/membership RLS, cross-account SELECT/UPDATE/DELETE denial, foreign collection/saved-word membership rejection, user_id reassignment denial, anon table access restrictions, topic-scoped private Broadcast receive policy, both triggers, SECURITY DEFINER with empty search_path, and no API-role EXECUTE grant.
- Final staging integrity query: saved_words 14; favorite_collections 0; favorite_collection_items 0; collection tables in supabase_realtime publication 0; private Broadcast policy 1; broadcast triggers 2. The two collection tables are intentionally removed from Postgres Changes because DELETE events cannot be filtered or RLS-authorized there.
- Supabase migration history confirms four Phase 4 migrations applied: base collections (20261125041816), initial Realtime publication (20261125043448), private Broadcast triggers/policy (20261125050023), and removal from Postgres Changes (20261125050329).
- Supabase health advisor: no findings. Security advisor: no collections-specific finding; existing unrelated findings remain 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning. Performance advisor: 15 unused-index notices overall; the collection saved-word FK index is expected to be unused while the empty collection tables have no membership rows.
- Two-account RLS was exercised in a transaction as the authenticated PostgreSQL role using two existing staging accounts; all test data was rolled back. This is a real database RLS execution, not a browser REST/JWT test.
- Live Realtime delivery is the one acceptance check that requires a connected authenticated browser session. The staging project currently has no Realtime WebSocket client history and no daily messages partitions. Supabase creates the rolling partitions when a client first joins over WebSocket. The first staging-preview session must verify that the private channel reaches SUBSCRIBED and that changes on a second signed-in device cause the expected refresh. The app shows a fallback status if the channel errors or times out, and refreshes on focus/visibility return.
- Staging preview readiness is therefore approved for controlled user acceptance, with live authenticated cross-device delivery explicitly marked as the first preview smoke test. This is not a claim that live two-device delivery has already been observed.
- Legal/privacy: Malaysia PDPA and general international privacy review remains a pre-publication item for user-created collection names and account-linked saved-word references. The Terms page remains an unpublished placeholder; no legal clearance is claimed.


## U2.9.0 interim staging review — 2026-11-25

- Owner clarified that Phase 4 completion is not completion of Update 2.9.0; all remaining planned phases must continue after this review.
- Opened PR #17, **SwiftDictionary Update 2.9.0 — Staging review checkpoint (Phases 1–4)**: https://github.com/WhiteWingCat/swiftdictionary/pull/17. The PR is an interim review checkpoint only and is not authorization to merge or release.
- Cloudflare Pages reported a successful preview deployment for commit 72152496c40eede6dafbdf1bdd0c7355225a1f1e. Branch preview: https://feature-update-2-9-0-english.swiftdictionary.pages.dev ; unique deployment URL: https://9abfc9c5.swiftdictionary.pages.dev.
- Existing build.sh routes non-main Cloudflare Pages builds to isolated staging Supabase project ivatvkfrtifgfheeaelj. No production Supabase or main-branch changes were made.
- Phases 1–3 are recorded complete; Phase 4 implementation is complete and ready for user acceptance. Phase 5 (visual-only Premium interface/navigation) and Phase 6 (optional aligned English Lessons/Quiz/Flashcards expansion) remain open, followed by full QA/release preparation. U2.9.0 must not be marked complete until all required phases and release gates are satisfied.
- First staging acceptance check: sign in and verify private Broadcast reaches SUBSCRIBED, then verify collection changes refresh on a second signed-in browser/device. Live authenticated Realtime delivery has not yet been observed; mocked Playwright and rollback-based SQL RLS tests do not substitute for this check.
- At PR creation, PR-triggered regression workflows were still running. Cloudflare Pages deployment itself succeeded. A separate Cloudflare Workers Builds check for swiftdictionary-testing failed; investigate/triage before final release sign-off.
- Existing limits remain: no production rollout, no merge authorization, no subscription/entitlement activation, no folder-count enforcement, unlimited free dictionary word-grid search, and unchanged learning allowances. Malaysia PDPA and general international privacy review remains a pre-publication requirement.


## U2.9.0 Phase 4 Your Collections feedback refinement — 2026-11-25

- The owner reviewed the first Phase 4 staging preview and requested: dim the New folder button; make folders expand/collapse inline like Dashboard Favorite words; open the shared detail panel from a selected collection word; add a custom right-side **…** menu with Add words / Rename / Remove; add an Add to collection action beside the Favorite button for saved words; remove collection memberships automatically when a saved word is unsaved; add relevant shadows; and replace the description with “Customize and organize any saved words to your preferences.”
- Implemented the refinements on `feature/u2-9-0-collections-feedback`, tracked by open PR #18: https://github.com/WhiteWingCat/swiftdictionary/pull/18. PR #17 was closed without merging and superseded by PR #18.
- Collections render as inline expandable/collapsible folders with English and Simplified Chinese saved-word cards. Clicking a word opens the same shared dictionary detail drawer used by Favorite words. The custom in-site menu exposes Add words, Rename and Remove. The detail drawer's Add to collection button appears only for saved words and supports selecting multiple folders.
- Verified the existing membership FK `favorite_collection_items.saved_word_id` already has `ON DELETE CASCADE`; no schema migration was required. The SQL regression now performs a saved-word deletion inside a transaction and asserts the memberships cascade away. The transaction rolls back to preserve real staging data.
- Additional hardening: private Realtime channels are now removed when a user signs out, not only when switching to another account. Per-folder request sequence guards prevent stale reads from repainting a folder after it is collapsed/reopened or the active account changes.
- Browser QA on commit `25f10b2dfc28837e6fc799cff44b1b0c8215c763`: 79 passed, 22 skipped. All three Your Collections browser tests passed, covering inline expansion, custom menu, mixed-language words, folder management, detail-panel assignment, saved-word cascade cleanup, account isolation, sign-out channel cleanup, and stale folder-load handling.
- Full PR regression checks passed for Cloudflare Pages, build routing, English dictionary validation, PostgreSQL migration/ACL/allowance checks, Chinese dictionary, Flashcards, and local Supabase authenticated integration. A separate Cloudflare Workers Builds check for `swiftdictionary-testing` failed; it is distinct from the successful Cloudflare Pages deployment and remains a separate infrastructure item.
- The staging SQL regression passed. Staging row counts afterward were saved_words 14, favorite_collections 1, favorite_collection_items 3; these reflect the owner's own staging review data and were not altered by the rollback test. Supabase health advisor returned no findings. Security advisor continues to show only the pre-existing private-schema informational notices and leaked-password-protection warning, with no new collections-specific finding.
- Current controlled branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev ; latest deployment-specific URL: https://4fa9c4e2.swiftdictionary.pages.dev. The build routing guard sends this non-main preview to isolated staging Supabase. No production database, main branch or live deployment changes were made.
- Phase 4 remains subject to the owner's acceptance of the revised preview. Phase 5 (visual-only Premium interface/navigation preparation), Phase 6 (optional aligned English Lessons/Quiz/Flashcards expansion), and final full QA/release preparation remain open. Dictionary word-grid search remains free and unlimited; existing allowances are unchanged; no folder-cap, subscription or payment enforcement was activated.
- Legal/privacy review: no new personal-data category or third-party processor was introduced; the feature continues to use existing account-owned collection names and saved-word references. Malaysia PDPA and general international privacy review remain pre-publication requirements.

- Preview pointer follow-up: docs-only implementation-progress commit `cc4081a4663af62d2ab53886d6474b2635be73de` redeployed the same app source successfully. The branch preview remains https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev; latest deployment-specific URL is https://4fa9c4e2.swiftdictionary.pages.dev. No application source changed in that commit.


## U2.9.0 Phase 4 final feedback and Phase 5 Premium Plan — 2026-11-25

- The owner supplied final Phase 4 visual/interaction feedback and authorised Phase 5 to proceed concurrently. Updated the authoritative U2.9.0 plan and archived this work in `docs/conversation-archive/2026-11-25-update-2-9-0-phase-4-final-feedback-and-phase-5-premium-plan.md`.
- Phase 4: collection folders now render as full-width horizontal rows; saved-word X/remove controls have been removed; membership removal uses the shared detail-panel **Add to collection** picker; Your Collections copies the Favorite words card class to match its background/surface; collection dialogs and menus use light neutral surfaces and reduced-motion-aware transitions.
- Phase 5: the old Premium information modal is replaced by navigation to `premium-plan.html`, a standalone responsive comparison page with direct-route/refresh support and a return-to-app link. It lists all six requested categories and complete Free/Premium values, with explanatory notes for shared cross-course Daily Learning allowances, completion charging, timezone reset, lesson resume/review and proposed folder capacities.
- Staging `public.learning_plan_limits` was queried read-only and confirmed the configured values: Free daily_topic/application/discovery/revision 1 each, lesson 5, quiz 1, flashcard 3; Premium daily_topic/application/discovery/revision 3 each, lesson 15, quiz 3, flashcard 10. No database write or migration was made. The 16/40 folder caps remain proposed and unenforced.
- Updated Playwright coverage for horizontal folder layout, Favorite card surface matching, absence of per-word X controls, detail-picker removal/reassignment, Premium route navigation, all six comparison rows and mobile layout. Final relevant QA run **45576573180** passed all validators, whole-catalogue audit, artifact upload and **15 browser tests**.
- Cloudflare Pages successfully deployed commit `9a0752c68ab5161fea88adcbfb3acb9a153725a0` to isolated staging. Branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev ; unique deployment: https://60523dea.swiftdictionary.pages.dev. Cloudflare build-routing guard passed.
- The separate Cloudflare Workers Builds check for `swiftdictionary-testing` failed; this is distinct from the successful Pages deployment and remains an infrastructure triage item. Other cross-version PR checks were still running at the time of this checkpoint.
- PR #18 remains open. No merge, production database change, production deployment, Premium purchase/activation or folder-cap enforcement occurred.
- Remaining acceptance: owner desktop/mobile review; first authenticated preview session must verify the private Realtime channel reaches SUBSCRIBED and test cross-device collection refresh; all outstanding PR checks must finish and any failures be investigated.
- Legal/privacy: no new personal-data category, processor, tracking or transaction was introduced. Existing Malaysia PDPA, international privacy, 16+ audience, content licensing and unpublished Terms/privacy review remain open. Actual Premium activation requires a separate consumer/payment/tax/cancellation/refund review. This is planning, not legal clearance.


## U2.9.0 owner feedback — dark-blue panels, active folder limits, grid sizing and Phase 6 start — 2026-11-25

- The owner clarified the desired theme: retain the overall dark SwiftDictionary background and use the deep-blue Dashboard Favorite words panel surface for Premium panels, collection dropdowns, dialogs and prompts. White UI panels are not acceptable; the paper-white stroke-order canvas remains a functional drawing surface.
- Updated `premium-plan.css` and `premium-plan.html` to use the dark shell/deep-blue panels, blue plan comparison surfaces, accessible contrast and reduced-motion-aware transitions. The Premium comparison now describes the 16/40 capacities as active folder limits, while still stating that Premium is not currently available to purchase.
- Your Collections custom dropdowns, dialogs, prompts and text input were restyled to dark-blue surfaces. The parent collection panel continues to copy the same class/surface as Favorite words.
- Approved active folder capacities: Free 16, Premium 40. No capacity counter or remaining count is shown in Your Collections. At capacity, the in-site dialog reports the user's plan-specific limit and tells them to remove a folder before creating another.
- Added migration `supabase/migrations/20261125101500_swiftdictionary_update_2_9_0_favorite_collection_capacity_limits.sql`. Applied to isolated staging project `ivatvkfrtifgfheeaelj` only. Authenticated direct INSERT on `public.favorite_collections` is revoked; creation uses `public.create_my_favorite_collection(text)` and a private SECURITY DEFINER implementation. It derives the owner from `auth.uid()`, checks active entitlement validity (defaulting to Free), serializes creates with a per-user transaction advisory lock, counts existing folders, and inserts only below the 16/40 cap. No existing folder is deleted on downgrade.
- The full staging SQL regression `supabase/tests/favorite_collections.sql` passed in a transaction after updating its original folder-creation fixtures to use the new RPC-only path. It validates owner RLS, cross-account isolation, direct-insert denial, function grants, Free 17th-folder rejection and Premium 41st-folder rejection. Test data and entitlement changes roll back.
- English collection grids now use the same `word-grid` and `word-card` base sizing as Dictionary cards, with a 110px minimum English column and 58px card minimum height. Chinese character grids retain 66px square cards. Browser regression covers both.
- Phase 6 optional content expansion has started. Added 15 original bilingual English Quiz questions (five per difficulty) to the 199-question draft bank, bringing it to 214: 129 knowledge, 15 word-definition and 70 Chinese-translation. The questions align with existing taught lesson objectives in articles, collocations and precise near-synonyms. They remain draft-only; no approval, database import or live availability was performed.
- Confirmed English Flashcards already draw from the full `englishWords` dictionary dataset, including U2.9.0 expansion, so no duplicate English flashcard bank is needed. Existing recall modes, timing, progress and allowance rules remain unchanged.
- Added the Quiz draft validator to the U2.9.0 QA workflow and enabled the disposable local Supabase Quiz/Auth/RPC regression workflow on the U2.9.0 feature branch.
- The first relevant browser run on commit `358cf32` found two test failures: the grid test compared absolute track widths across different parent widths, and the Premium status locator matched two elements. Corrected the UI to enforce a 110px minimum English track width, changed the assertion to check minimum width/card height, and made the Premium locator exact. Latest full QA checks are queued/in progress and must be confirmed before a new preview is handed to the owner.
- Staging health advisor returned no findings. Security advisor still reports only the existing 10 informational private-schema RLS/no-policy notices and one leaked-password-protection warning; no collection-capacity-specific finding.
- Feature branch `feature/u2-9-0-collections-feedback` and PR #18 remain open. No production migration, main merge, production deployment, Premium payment or entitlement assignment occurred. A new controlled preview must be generated after latest source changes and checked to route only to isolated staging.
- Legal/privacy: folder enforcement uses existing account identity and collection records, with no new personal-data category, processor, tracking or transaction. Preserve folders on downgrade. Premium remains unavailable to purchase; a real launch requires separate Malaysia/international privacy, consumer and payment review. This is planning, not legal clearance.


### U2.9.0 follow-up QA and Phase 6 release separation — 2026-11-25

- U2.9.0 English QA on commit `7a1aaea` passed: dictionary data and editorial audits, 214-question Quiz draft validator, Mock Quiz/Flashcards regression and 16 browser tests.
- Preserved the prior owner-authorized 199-question Quiz release without implicitly approving the 15 new Phase 6 additions. The original 199 source records are explicitly marked `release_approved: true`; the new 15 are `false`. Draft export includes all 214 as `draft`; approved release export includes only the 199 previously authorized rows.
- Updated `mock-testing.js` and its regression expectations to accept the 214-question draft bank while retaining the original release distribution. Updated `supabase/tests/quiz_draft_content_import_assertions.sql` to assert that all 15 Phase 6 questions are draft-only, lesson/objective mapped and have valid four-option answer records.
- Disposable `quiz-db-foundation` job passed, including both the 214-row draft import and the separate 199-row owner-authorized release export assertions.
- Cross-version regression on commit `7a1aaea` passed: Flashcards, Chinese dictionary/lessons, U2.7 lesson-start allowance, U2.3 allowance/dashboard, U2.6 ACL, PostgreSQL migration/allowance, Chromium browser smoke and Cloudflare build routing.
- Cloudflare Pages deployed commit `7a1aaea` successfully (https://bf0603b6.swiftdictionary.pages.dev; branch preview https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev). Build-routing guard passed.
- The separate Workers Builds check for `swiftdictionary-testing` failed again; Pages deployment and routing guard succeeded. Treat this as an independent Workers build/infrastructure issue.
- Local Supabase Auth/RPC integration was still running authenticated Quiz browser tests, signed-out Flashcards/Preferences, permanent Lessons allowance notification and local security advisor checks. Do not close the consolidated regression matrix until this job finishes.
- Staging Free 16/Premium 40 SQL regression passed and rolled back. No production database or entitlement was changed.


### Authenticated lesson-start race found and fixed — 2026-11-25

- The first consolidated Local Supabase Auth/Quiz run exposed a race in the permanent lesson confirmation flow: an allowance-driven lesson-card re-render could detach the button captured by the confirmation dialog, so confirming the dialog silently failed to start the lesson.
- Added a stable `data-lesson-id` to rendered lesson cards and a fallback that resolves the current card by that ID before continuing. If the refreshed card has become disabled, the UI now reports the reason in lesson status.
- Extended the authenticated Quiz runtime test to deliberately re-render the lesson list while the confirmation is open, then confirm. Extended the U2.7 static regression to cover the stable-ID fallback.
- The failure occurred before Quiz launch and was unrelated to the 15 Phase 6 questions. The updated full Local Supabase Auth/RPC run on commit `78280d4` is still pending at this checkpoint.


### Final consolidated U2.9.0 QA — 2026-11-25

- Latest feature commit `78280d4` passed U2.9.0 English QA, including 16 Playwright browser tests, whole-catalogue validation, Quiz draft validation and Mock Quiz/Flashcards regressions.
- Local Supabase Auth/RPC integration passed, including authenticated Quiz runtime, signed-out Flashcards/Preferences, permanent Lessons allowance notifications, local security advisors and the lesson-confirmation re-render regression. The lesson-start race fix is verified.
- Quiz database foundation passed: 214-question draft import and separate 199-question previously owner-authorized release export. The 15 Phase 6 additions remain unapproved drafts.
- U2.3 allowance/dashboard, U2.5 Flashcards (including Chromium browser), U2.6 ACL, U2.7 Chinese dictionary/lessons and lesson-start allowance, PostgreSQL migration/allowance, Chromium regression smoke, Supabase CLI local Auth and Cloudflare build-routing checks passed.
- Cloudflare Pages deployed commit `78280d4`: https://b7576dea.swiftdictionary.pages.dev (branch preview https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev; Premium page at `/premium-plan.html`). Pages deployment and routing guard passed.
- Separate `Workers Builds: swiftdictionary-testing` failed. It is a distinct Cloudflare Workers production build; Pages deployment and routing guard succeeded. Track it as an infrastructure issue, not a Pages staging failure.
- Staging Free 16 / Premium 40 migration and full transactional SQL regression passed. No production migration, merge, entitlement assignment, Premium checkout or production deployment occurred. PR #18 remains open pending owner review.


### U2.9.0 owner follow-up implementation and expanded Phase 6 — 2026-11-25

- Owner feedback was incorporated after reviewing the latest Master Development Record and conversation archives. The owner requested fixed collection card geometry, draggable folder ordering, consistent expand/collapse animation, and more English Lessons/Flashcards content rather than Quiz-only expansion.
- Collections card sizing is aligned to the Favorite/Dictionary grid and preserves the panel width when adding long headwords such as bioavailability. Browser coverage includes desktop and 390px mobile viewports and Chinese square-card geometry.
- Folder ordering is account-owned and persisted through a Supabase RPC. Reordering uses one RPC per move, includes drag-to-top/bottom and keyboard move controls, and computes list positions by rank so deletions/gaps do not break subsequent moves. SQL tests cover owner isolation and sparse-order recovery.
- Folder expansion/collapse and Dashboard native details disclosures (including Favorite words) use restrained height/opacity transitions. Existing DOM nesting is preserved, collapsed content is inert, rapid toggles are guarded, and reduced-motion users receive immediate state changes.
- Runtime lesson catalogue inspection found 17 existing English lessons in the browser while only 15 were in the server allowlist. The two already-visible but unapproved IDs (b-greetings-polite-expressions and b-places-getting-around) were added to the server catalogue. Three new original lessons were added: Beginner question forms/negatives, Intermediate passive voice, and Advanced reported speech. The browser catalogue now has 20 lessons (8/6/6), with Simplified Chinese reader and practice translations. New stable IDs and curriculum objectives are recorded in content/quiz/curriculum-map.en.json.
- Added a server allowlist migration and transactional test for all 20 active English lessons. The local Supabase migration/RLS step passed, including owner-authorized acceptance for the five added catalogue IDs.
- Quiz Phase 6 now has 24 draft-only additions (the original 15 plus nine questions aligned to the three new lessons). Draft source bank: 223 total (64 Beginner, 70 Intermediate, 89 Advanced). The 199-question previously owner-approved release subset is unchanged. Updated the validator, mock Quiz count/distribution expectations, SQL import assertions and test fixture catalogue. The PostgreSQL Quiz database job passed the 223-row draft import and separate 199-row release export.
- Added 15 original English Flashcards multiword expressions (collocations, phrasal verbs and idiomatic expressions), each with Simplified Chinese meaning and contextual example. They use the existing phrase/all card sets and do not duplicate dictionary headwords.
- Successful latest branch checks on source checkpoint d27750988a6e2ad097436b0810b237c7f44d449f: U2.9.0 English QA run 45598338317; U2.3 allowance/dashboard run 45598338297; U2.5 Flashcards browser run 45598338382; U2.6 ACL run 45598338168; U2.7 Chinese regression run 45598338333; Cloudflare build-routing guard 45598338207. The local Supabase Auth/RPC job has passed U2.9.0 migrations, collections SQL/RLS tests, lesson-catalogue allowlist tests, Quiz draft import and 199-row release export. Authenticated Chromium Quiz runtime and final local security-advisor steps were still running at this checkpoint.
- No refreshed staging preview has been handed to the owner. PR #18 remains open. No merge, production deployment, production database write, Premium checkout or entitlement assignment occurred.
- Legal/privacy: the new sort_order field is account-owned ordering metadata; no new personal-data category, tracking or processor was introduced. New lesson and Flashcards content is original. This is planning, not legal clearance; Malaysia PDPA, international privacy/16+ safeguards and future Premium consumer/payment review remain open.


## U2.9.0 final owner-feedback closeout and staging review — 2026-11-25

The latest authoritative execution plan is `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`; the detailed session archive is `docs/conversation-archive/2026-11-25-update-2-9-0-owner-feedback-closeout-and-staging-review.md`.

### Final owner feedback implemented

- **Favorite/Collections sizing:** panel padding and responsive grid rules now match Favorite words at desktop/mobile. Folder border width is accounted for without changing the outer panel width. The long headword `bioavailability` is a regression case; tests compare Favorite and collection track/card geometry and text overflow.
- **Persistent ordering:** account-owned `favorite_collections.sort_order` and reorder RPC persist folder order. Drag/drop supports any position, including top/bottom; touch-friendly and keyboard move controls are available. Reorder uses per-account advisory/row locks and owner-scoped RLS. The exposed RPC is SECURITY INVOKER.
- **Expand/collapse:** Your Collections, Favorite words and other Dashboard disclosure details use consistent height/opacity transitions. Collapsed content is inert; reduced-motion users receive immediate changes.
- **Lessons:** three original bilingual English permanent lessons were added (question forms/negatives, passive voice, reported speech). The active catalogue now contains 20 lessons (8 Beginner, 6 Intermediate, 6 Advanced).
- **Quiz:** 229 source questions = 199 previously owner-approved + 30 draft-only Phase 6 additions. All 30 drafts remain unapproved and excluded from the approved release subset.
- **Flashcards:** curated English multiword expressions increased from 15 to 25 with ten original bilingual additions. Ordinary English word cards continue to use the shared dictionary data.

### Staging database and security

- Four U2.9.0 migrations were applied only to isolated staging project `ivatvkfrtifgfheeaelj`: capacity limits `20261125085850`, ordering `20261125105110`, lesson allowlist `20261125105244`, reorder SECURITY INVOKER hardening `20261125105351`.
- Migration filenames were reconciled to the exact versions recorded in staging migration history to avoid a later CLI push replaying already-applied migrations.
- Staging SQL tests passed for collection RLS/account isolation, folder ordering, capacity, membership and lesson catalogue. Staging retained the existing two collections/nine memberships after rollback-based tests.
- Supabase health advisor returned no findings. Security advisor reports no new Collections-specific issue; pre-existing private-schema informational notices and leaked-password-protection configuration remain.
- No production database migration/write or production data change occurred.

### Latest-head validation

All checks passed on application commit `6409b7981656d27a6385400862df3557a757828d`:

| Workflow | Run |
|---|---:|
| U2.9.0 English dictionary/content/Chromium QA | `45601282736` |
| Flashcards syntax, integration, mock and Chromium tests | `45601282876` |
| Quiz database foundation and local Supabase Auth/RPC integration | `45601282873` |
| U2.3 allowance/dashboard regression | `45601282803` |
| U2.6 ACL drift regression | `45601282613` |
| U2.7 Chinese dictionary/lesson and allowance regression | `45601282617` |
| Cloudflare build-routing guard | `45601282708` |

The Quiz DB/Auth workflow passed the U2.9.0 Collections migrations/RLS/order/security tests, explicit grants, Quiz draft import, the separate 199-question approved release export, authenticated Quiz runtime, signed-out Flashcards/Preferences, permanent Lessons allowance notification checks and local Supabase security advisors. The U2.9.0 browser suite passed collection sizing, ordering, animation/reduced-motion, account isolation, shared detail, capacity and lesson-content coverage.

### Staging preview and release boundary

- Cloudflare Pages deployed commit `6409b79` successfully.
- Deployment-specific preview: https://adc32f85.swiftdictionary.pages.dev
- Branch preview: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev
- Cloudflare build-routing guard passed. A separate Workers Builds check is not the Pages deployment and must not be conflated with a Pages failure.
- PR #18 remains open against `main`. Owner review is the remaining gate. Do not merge or deploy to production until explicitly approved.
- No production Supabase migration/write, production deployment, Premium purchase/activation, entitlement mutation or allowance change occurred. Dictionary word-grid search remains free and unlimited; existing allowances and Free 16/Premium 40 folder capacities remain unchanged.

### Legal/privacy planning

The `sort_order` field is minimal account-linked preference metadata and adds no new personal-data category or tracking purpose. Malaysia PDPA Act 709 and its 2024 amendments, JPDP breach-notification/DPO/registration guidance, Section 129 cross-border transfer requirements, Singapore staging/Japan production regions, GDPR territorial scope and jurisdiction-specific child-consent rules were considered. Confirm operator/controller scope, processor terms, transfer safeguards and privacy notices before public release. New learning content is original and should retain provenance. This is planning, not legal advice, legal clearance or licensing certification.


## U2.9.0 owner feedback — whole-folder drag interaction — 2026-11-26

- Owner requested dragging a folder by holding the left mouse button on the folder itself, and removing the separate drag icon and up/down arrows if the interaction works.
- Replaced the dedicated drag handle with pointer-based reordering from the folder heading. A movement threshold preserves ordinary expand/collapse clicks. Dropping on the upper/lower half of another folder places the dragged folder before/after it.
- Removed the visible drag handle and arrow buttons. Keyboard users can focus a folder heading and use Alt + Arrow Up / Alt + Arrow Down. Pointer listeners are delegated once to avoid per-render global listener accumulation.
- Updated browser tests cover dragging the heading to the first and last positions, the absence of the old controls, and keyboard movement.
- U2.9.0 English dictionary QA passed on commit `3bf1dbb248346330c629de9c983201438a161191` (run `45748313425`), including the Playwright collection tests. Cloudflare Pages and build-routing checks passed. Cross-version browser/Auth/Flashcards checks were still in progress at this checkpoint; the separate Workers Builds failure is an infrastructure item and not a Pages deployment failure.
- No database schema/RLS, migration, entitlement, allowance, production data, or legal/privacy processing changes. Existing Malaysia/international privacy, 16+ safeguards, content provenance and future Premium consumer/payment review remain release-planning requirements.
- PR #18 remains open; no production merge or deployment. The owner must review the refreshed staging preview before approval.

Detailed archive: `docs/conversation-archive/2026-11-26-update-2-9-0-whole-folder-drag-feedback.md`.


## U2.9.0 final polishing and merge-readiness — 2026-11-26

- Final application head: `55a1ff5c43487985f2d20618385d1cb7a27edf9b`, branch `feature/u2-9-0-collections-feedback`, PR #18 remains open and unmerged.
- Whole-folder drag feedback is implemented: hold and drag the folder heading, drop before/after another folder; remove the separate drag icon and up/down arrows. Normal click-to-expand/collapse is preserved, and keyboard reordering remains available through Alt + Arrow Up / Alt + Arrow Down.
- Final UI/loader polish: Dashboard Favorite disclosures are initialized even when their panel is dynamically inserted after the initial app mount; the single versioned Favorite Collections loader lives in `supabase-config.js`; the duplicate unversioned loader was removed from `account-deletion.js`; module cache key is `2.9.0-p4-r4`. The Flashcards regression harness now mirrors that real loader, and temporary diagnostic logging was removed.
- CI workflow polish: relevant workflows use `actions/checkout@v6`, `actions/setup-node@v7`, and `supabase/setup-cli@v3`, with the tested Supabase CLI pinned to `2.81.3`.
- Latest U2.9.0 Playwright QA passed 20/20 on run `45750692619`, including direct folder drag, removed controls, keyboard movement, account isolation, collection sizing and reduced-motion disclosures.
- Broad Dashboard/Flashcards/allowance Chromium regression passed 87/87 on run `45750692621`; the dynamic Dashboard Favorite disclosure test passed after correcting the test harness to load the versioned module as the app does.
- Authenticated local Supabase Auth/RPC integration runs `45750692738` and `45750686934` both completed successfully. They applied the local Auth contract and staged migrations through U2.9.0, verified grants/RLS/Collections ordering and security, tested authenticated Quiz RPC/session/allowances and Quiz browser runtime, signed-out Flashcards/Preferences, permanent Lessons allowance notifications, draft import/release export and Supabase security advisors. The security advisor reported no issues.
- Other latest-head checks passed: Flashcards, Chinese dictionary/Lessons, PostgreSQL migration/allowance, U2.7 lesson-start allowance, U2.6 ACL drift and Cloudflare build-routing. Latest check matrix: 15 successes, no pending checks, one separate Cloudflare Workers Builds failure.
- Cloudflare Pages deployed successfully for the latest head: https://a71ff936.swiftdictionary.pages.dev ; branch preview https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev . The separate failed check is for Worker service `swiftdictionary-testing`, not Pages. Its build log is at https://dash.cloudflare.com/4095c6f30d6c1e0454918d2f9726ff6a/workers/services/view/swiftdictionary-testing/production/builds/731fc543-13e2-4584-bc81-629a8953a14d . This has failed on earlier commits too; confirm whether it is a required PR status before merging. Branch-protection settings were not readable during this pass.
- Legal/privacy check: no new personal-data category, purpose, processor, tracking, schema field or entitlement change was introduced by the polish. Existing Malaysia PDPA, cross-border transfer, global 16+ safeguards, Terms/Privacy publication and future Premium consumer/payment compliance remain pre-publication planning items; this is not legal advice or legal clearance.
- Release boundary: PR #18 remains open; no production merge/deployment, production Supabase write/migration, Premium activation, entitlement mutation or allowance change. The 30 new Quiz questions remain draft-only; the approved Quiz release subset remains 199 questions.
- Detailed record: `docs/conversation-archive/2026-11-26-update-2-9-0-whole-folder-drag-feedback.md` and updated `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`.


## U2.9.0 release completion and production synchronisation — 2026-11-26

**Status: MERGED TO `main`; Live Supabase U2.9.0 migrations applied and verified.** This section supersedes the earlier U2.9.0 pre-merge / pre-production notes above.

### GitHub release

- Owner explicitly approved merge and Live Supabase migration in the 2026-11-26 conversation.
- PR #18 (https://github.com/WhiteWingCat/swiftdictionary/pull/18) was squash-merged successfully.
- Merge commit on `main`: `64dc4406f96cf4b5a7644d802f936ff5ffd97289`.
- Merged feature head: `96b856b1419aadb24c3d4e8872a54bd27a4e9294`; validated application code commit remains `55a1ff5c43487985f2d20618385d1cb7a27edf9b`.
- Cloudflare Pages is the sole active website build/deployment system. The Cloudflare Workers Builds integration/check for service `swiftdictionary-testing` is retired and no longer in operation; its repeated failed status is obsolete and must not be treated as a release blocker or as a Pages failure. Do not restore or rely on that Worker build workflow.
- The Pages preview for the merged feature head succeeded at https://1df70422.swiftdictionary.pages.dev . The merge-triggered production Pages deployment should be independently checked before stating the live website deployment is complete.

### Live Supabase migration and verification

- Production project: SwiftDictionary, ref `pzymiesazmpyvnfvsbsc`, region `ap-northeast-1`; project status was `ACTIVE_HEALTHY`.
- Before rollout, production migration history ended at U2.8.0 and staging already contained all eight U2.9.0 migrations. Production schema was inspected: `public.saved_words`, `public.user_entitlements` and `private.learning_content_catalog` were present; the saved_words contract supports the collection FK and the entitlement/catalog fields matched the migration assumptions.
- Successfully applied all eight U2.9.0 migrations to Live Supabase, in dependency order:
  1. `20261126041610` — `swiftdictionary_update_2_9_0_favorite_collections`
  2. `20261126041612` — `swiftdictionary_update_2_9_0_favorite_collections_realtime`
  3. `20261126041615` — `swiftdictionary_update_2_9_0_favorite_collections_private_broadcast`
  4. `20261126041617` — `swiftdictionary_update_2_9_0_favorite_collections_remove_postgres_changes`
  5. `20261126041620` — `swiftdictionary_update_2_9_0_favorite_collection_capacity_limits`
  6. `20261126041622` — `swiftdictionary_update_2_9_0_favorite_collection_ordering`
  7. `20261126041625` — `swiftdictionary_update_2_9_0_english_lesson_expansion`
  8. `20261126041627` — `swiftdictionary_update_2_9_0_reorder_rpc_invoker_security`
- Post-migration verification confirms all eight migration-history entries are present; both collection tables exist with RLS enabled and six owner-scoped policies; three expected collection triggers exist; reorder and create wrapper functions are SECURITY INVOKER; the collection tables are not in the Postgres Changes publication; and all five new English lesson allowlist rows are active.
- Live collection/membership row counts are both zero immediately after rollout. Existing saved_words and user_entitlements rows were not modified by these migrations; no user data was backfilled or deleted.
- Health advisor: no findings. Security advisor: no new U2.9.0 findings; existing notices remain (10 informational private-schema RLS/no-policy findings and one warning that leaked-password protection is disabled). Performance advisor: existing unused-index notices include the two new collection indexes while the collection tables are empty, plus one pre-existing duplicate-index warning on `public.learning_activity_log`. These are recorded for later review; no unrelated schema/index cleanup was bundled into this release.

### Retired Cloudflare Workers Builds classification

- Mark `Workers Builds: swiftdictionary-testing` as **Retired — not in operation** in project records and future CI interpretation.
- Active deployment path: GitHub `main` → Cloudflare Pages production build/deployment.
- Active preview path: feature branches / pull requests → Cloudflare Pages preview deployments.
- The obsolete Worker status is not a failed active deployment and is not a required release gate. Keep the Pages build and routing checks as the deployment evidence.

### Product, release and legal boundaries retained

- Dictionary word-grid search remains free and unlimited; Free 16 / Premium 40 folder caps remain unchanged.
- Premium remains presentation-only. No billing, checkout, payment processing, subscription activation or entitlement mutation was introduced.
- The 30 additional Quiz questions remain draft-only; the approved release set remains 199.
- No new personal-data category, purpose, processor, tracking purpose or schema field was introduced by the final polish. Malaysia PDPA, international/cross-border privacy safeguards, global 16+ requirements, Terms/Privacy publication and future Premium consumer/payment review remain pre-publication planning items. This is not legal advice or legal clearance.

### Final closeout boundary

- GitHub `main` merge and Live Supabase U2.9.0 migration are confirmed complete.
- Confirm the merge-triggered Cloudflare Pages production deployment before claiming the live website is updated. Do not report Pages production success based solely on the PR preview.
- Detailed session record: `docs/conversation-archive/2026-11-26-update-2-9-0-merge-live-supabase-and-retire-workers-builds.md`.


## U2.9.1 emergency patch — restore Dashboard Your Collections on Cloudflare Pages (2026-11-26)

**Status: merged to `main` and production Pages deployment successful.**

### Incident and root cause
- After U2.9.0 production rollout, the owner observed that all other updated features were live but "Your Collections" was missing from the Dashboard.
- Live Supabase was already migrated correctly; the Favorite Collections tables, RLS, private Broadcast and RPCs were not the cause.
- The root cause was a frontend build integration mismatch: U2.9.0 had placed the dynamic Collections module loader in the checked-in `supabase-config.js`, but Cloudflare Pages' `build.sh` replaces that file with environment-specific Supabase configuration during deployment. The generated production config therefore discarded the loader. The `favorite-collections.js` asset itself was present, but never requested by the deployed page.

### Fix
- Added an explicit, versioned `<script src="favorite-collections.js?v=2.9.1"></script>` to `index.html`, after the main application and account-deletion scripts.
- Removed the dynamic loader from `supabase-config.js`. Loading the Dashboard Collections feature no longer depends on generated Supabase config content.
- Extended `tests/cloudflare-build-routing.sh` to assert that the Collections asset exists, the script tag is included after the application scripts, and the tag survives both preview and production build transformations. The generated config is explicitly checked not to be the loader source.
- No change to the Collections implementation, database schema, RLS, Realtime, auth, saved words, user entitlements or Premium limits.

### Release and validation
- PR #19: https://github.com/WhiteWingCat/swiftdictionary/pull/19 — squash-merged with owner approval.
- Merge commit: `4ab30af1c9c1ef7eb2fe35cdf015755a5e87e16d`.
- Feature commit validated: `f684cbea0f110d99db40d4931d9792870f169e96`.
- Cloudflare Pages preview succeeded: https://d6bd7a26.swiftdictionary.pages.dev .
- Cloudflare build-routing regression passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45755214948 .
- U2.9.0 English dictionary and Collections browser QA passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45755214893 .
- PostgreSQL migration/allowance, Chromium browser regression, Supabase CLI compatibility, Chinese dictionary, ACL and U2.7 allowance checks passed. Local authenticated Supabase Auth/RPC and Mock Flashcards browser jobs were still running at the time of this record update; check their final result before using this archive as the complete CI matrix.
- Merge-triggered Cloudflare Pages production check succeeded for deployment `0959fe7d-e5da-4f81-b7ff-d0ba5f3d7835`: https://dash.cloudflare.com/?to=/4095c6f30d6c1e0454918d2f9726ff6a/pages/view/swiftdictionary/0959fe7d-e5da-4f81-b7ff-d0ba5f3d7835 .
- The separate Cloudflare Workers Builds check may still report failure; it is retired and is not an active deployment path or release blocker. Cloudflare Pages is the sole active platform.

### Production data and legal/privacy impact
- No Live Supabase migration was required or applied for U2.9.1.
- No production database writes, user-data changes, personal-data categories, processing purposes, processors, tracking, entitlements, payments or billing changes were introduced.
- Existing U2.9.0 Live Supabase schema and user data remain unchanged. Dictionary search remains free and unlimited; folder caps remain Free 16 / Premium 40.
- No new legal/privacy risk category was introduced. Existing Malaysia PDPA, cross-border safeguards, international 16+ obligations and Terms/Privacy publication review items remain as previously documented.

### Release closeout
- GitHub `main`: updated at `4ab30af1c9c1ef7eb2fe35cdf015755a5e87e16d`.
- Cloudflare Pages production deployment: confirmed successful.
- Live Supabase: already at U2.9.0; U2.9.1 is frontend/build-only and does not require a database migration.

## Multilingual platform and language-expansion development structure — owner-approved direction (2026-11-26)

**Status: architectural/product direction approved for future planning; detailed technical design and implementation are not yet authorised.** This section captures the owner's workflow concern and decisions ahead of Update 3.0. It is a durable planning foundation, not an assertion that the architecture or tooling has already been implemented.

### 1. Core problem and objective

Update 3.0 is expected to introduce Malay as a new learning language. This is broader than adding a dictionary: Malay is expected to have its own dictionary, Lessons, Quiz and Flashcards, while the existing English and Simplified Chinese courses also need Malay translation and integration. As more languages are added, repeating cross-cutting application changes and manually reworking every course will make each expansion progressively slower and more error-prone.

The long-term objective is to **keep the marginal engineering and maintenance effort of each additional language as small as reasonably possible without compromising linguistic, educational or functional accuracy**. Reduce repeated application changes and repetitive manual checks; do not reduce the depth of language review or silently accept lower quality.

### 2. Owner-approved content-authoring principle

**Every language must be allowed to have its own independently authored educational content. English is not the permanent master curriculum and must not be treated as the linguistic or pedagogical authority for every other language.**

- A language's dictionary entries, meanings, examples, parts of speech, grammar explanations, lessons, quiz questions, answer explanations and flashcards may be authored directly for that language.
- Translation is a support layer, not a requirement that every language's curriculum be a literal translation or derivative of English.
- Use stable content identifiers and shared structural schemas to connect related items and translations where appropriate, while allowing language-specific content, examples, pedagogy, grammar and question design.
- A language may have content with no one-to-one equivalent in another language. The data model must support language-specific items and optional relationships rather than forcing artificial parity.
- Shared content structure means common fields and interoperable formats, not identical linguistic rules or identical curriculum.
- Translation must preserve intended meaning and learning objective, not word-for-word form. Adapt examples and explanations where literal translation would be unnatural, misleading or pedagogically unsuitable.

### 3. Two-layer architecture: shared platform and language packages

Design toward a language-independent learning platform plus independently maintainable language packages.

**Shared platform responsibilities (build once, improve for all supported languages):**
- Dictionary, lesson, quiz and flashcard presentation/interaction engines.
- Navigation, course and support-language selection, preferences and refresh behaviour.
- Progress tracking, activity history, allowances, account synchronisation and shared user workflows.
- Content loading, stable-ID resolution, search orchestration, translation lookup and fallback/status handling.
- Common validation interfaces, import/export tooling, test harnesses and regression suites.
- Shared UI localisation infrastructure and accessibility behaviour.

**Language package responsibilities (specific to each language):**
- Language metadata: stable language code, display names, script/writing system, text direction, locale/formatting metadata and supported capabilities.
- Dictionary vocabulary, senses, parts of speech, pronunciation/transliteration, examples, related terms and language-specific search/index data.
- Independently authored Lessons, Quiz questions, explanations, answer rationales and Flashcards.
- Language-specific linguistic rules and processing adapters: tokenisation, morphology/affixes, segmentation, input/search normalisation, pronunciation and script-specific behaviour as relevant.
- Language-specific editorial guidance, content provenance and review status.

Do not scatter language-specific conditionals throughout shared application code. Where a language needs special processing, expose a clearly bounded language adapter/capability contract. Do not force all languages into English-like or alphabetic assumptions. Chinese character handling, Malay morphology/affixes and English spelling are examples of materially different requirements.

### 4. Standard language package and content schemas

Define versioned, documented schemas shared by all language packages, with optional and extensible language-specific fields. At minimum, establish consistent structures for:

- Language metadata and capability declarations.
- Dictionary entries and stable entry/sense identifiers.
- Lessons, learning objectives, lesson sections, examples and practice items.
- Quiz question types, options, correct-answer references, explanations and curriculum/topic links.
- Flashcards, prompt/answer content, card identity and review/mastery references.
- Translation records and their source/target locale, content identity, context, status and revision relationship.
- Editorial provenance, reviewer/approval state, schema version and content version.

The schema must distinguish a content item's **authored language** from the **support/translation language** selected by the learner. Preserve stable identifiers across revisions where the underlying learning item remains the same; create new identities when the learning objective or item is materially different. Avoid copying the same content into disconnected records just to support another translation.

### 5. Separate learning language from support language

Maintain two explicit concepts throughout the product:

- **Learning language:** the language being studied; it determines the dictionary/course content and the language-specific processing rules.
- **Support language:** the language used to explain, translate or guide the learner through that content.

A language may have support-language translations available before it is enabled as a selectable learning course. Conversely, enabling a language as a learning course requires its own authored/curated course content and validated language-specific behaviour, not merely the existence of translations.

The translation system must identify supported pairs and coverage at content level. Language selectors must not imply that all learning/support combinations are complete. Missing translations should be explicitly represented and handled through an intentional fallback or unavailable state, never silently shown in the wrong language.

Course/support-language changes must refresh all dependent content immediately, without unrelated navigation or stale labels, explanations, feedback, cached content or answer text. Continue applying the standing course/translation switching QA rule across Dictionary, Lessons, Quiz, Flashcards and future learning surfaces.

### 6. Translation registry and translation-coverage strategy

Use a central translation registry/catalogue keyed by stable content identity and explicit source/target language. Track at least: authored/source language, target language, content type and ID, translation version, source revision, status (not started / draft / machine-assisted draft / reviewed / approved / stale / not applicable), reviewer/provenance where available, and last validation/review metadata.

Translations are independent, versioned content records. When an authored item changes, identify translations based on the changed source revision and mark potentially affected records for review. Do not silently overwrite a reviewed translation or assume that a translation remains accurate after its source changes. Where content is independently authored in the target language, do not label it a translation merely to fill a matrix cell.

### 7. Owner's proposal: prepare translations for future languages ahead of course launch

The owner proposed a forward-looking strategy: while developing Malay, consider also preparing translations of existing courses and Malay content into future support languages (for example Japanese and Korean), even if those languages are not yet planned as selectable learning courses. The intent is to spread translation work over time so a future language launch has less concentrated translation workload.

**Recommended disposition: adopt this as a staged, demand-aware translation-readiness strategy, not as a blanket requirement to translate every item into every conceivable language immediately.** The idea is valuable, but must be controlled to avoid a rapidly growing, unreviewed translation backlog and unnecessary maintenance.

Principles:
- Separate translation availability from learning-course availability. Japanese or Korean support translations may exist in the background without enabling Japanese/Korean dictionary or learning-course functionality.
- Maintain a future-language/support-language roadmap and translation coverage matrix. Record which languages are active learning languages, which are currently supported support languages, which are planned, and which are only exploratory.
- When new content is authored for English, Chinese or Malay, make it translation-ready from the start: stable IDs, clear context, unambiguous meaning, content type, learning objective, terminology notes and source revision. This preparation is low-regret even when no target translation is commissioned yet.
- Prioritise background translations for high-value, stable and reusable material: shared UI strings, navigation/help text, core dictionary meanings, common lesson explanations and recurring instructions. Treat frequently revised, culturally specific or language-dependent examples as higher-maintenance items.
- Do not assume a direct translation from one language is authoritative for another. Use an appropriate source/context for each target language, allow translation from the language in which the content was authored, and allow target-language adaptation. A pivot language may be used as a workflow aid only when useful; it must not become the master curriculum or introduce chained-translation errors.
- Do not create every possible language pair by default. With N languages, pairwise translation demand can grow approximately with N squared. Commission translations according to likely learner value, available review capacity and launch plans.
- For each translation, retain status and review evidence. Machine-assisted drafts are not approved content. No unreviewed translation should be presented as verified educational material.
- Translation coverage does not itself certify that a language is ready to launch as a learning course. Launch gates must separately cover dictionary quality, language-specific search/input behaviour, authored curriculum, Quiz answer validity, Flashcard quality, UI localisation and end-to-end QA.
- Review whether background translation work is actually reducing future launch effort. Avoid spending resources translating low-priority content that may never be used.

**Practical rollout model:**
1. At content creation time, make all new material translation-ready and register it, even if no target translation is requested yet.
2. During U3.0, cover the required English ↔ Malay and Chinese ↔ Malay support needs agreed for launch, alongside the existing English/Chinese support paths. Confirm the exact directional matrix and content scope in the U3.0 plan; do not infer that every course component must be translated in every direction without owner approval.
3. Where capacity permits, build a small, explicitly prioritised background queue for future support languages such as Japanese and Korean. Start with stable shared UI and high-value foundational content rather than attempting full-catalogue translation.
4. Keep these future-language translations inactive/unselectable until their review and product requirements are satisfied.
5. When a future language is selected for launch, complete the remaining coverage, language-specific authored curriculum and processing capabilities, then pass the same quality and regression gates.

### 8. Content production and import pipeline

Treat content expansion as a managed data/editorial workflow rather than repeatedly as bespoke application coding:

1. **Author / prepare:** Create independently authored language content or translation drafts using the approved schema. Include context, learning objective, terminology and provenance.
2. **Structural validation:** Check schema/version, required fields, IDs, references, types, locale tags and encoding.
3. **Consistency validation:** Detect duplicates, missing content, broken links, invalid references, conflicting identifiers, stale translations and incomplete coverage.
4. **Linguistic and educational review:** Check meaning, grammar, naturalness, register, spelling, examples, cultural suitability, learning objective, question clarity and answer correctness. Use competent human review for approval; automated or machine-assisted output is a draft only.
5. **Import/integration:** Load validated packages through a repeatable, versioned process without rewriting shared learning engines for routine content additions.
6. **Runtime verification:** Check rendering, search, selection switching, content interactions and persistence in the actual application.
7. **Regression and release:** Run language-specific and cross-language regression suites, document evidence and obtain owner approval before merge/release or production data changes.

Content should be processed in small, sequential batches when the dataset is large. Validate each batch and then validate the consolidated package. Do not issue intermediate downloadable ZIPs for every batch; provide one consolidated deliverable only when the relevant phase is complete and validated.

### 9. Automated validation and three-level quality assurance

Build reusable validation tooling and a repeatable test matrix. Automation should reduce repetitive work, not replace linguistic judgement.

**Level 1 — Automated structural and consistency checks (run for every package/change):**
- Schema and encoding validation; required-field and locale checks.
- Duplicate vocabulary, sense, question and flashcard detection.
- Stable-ID uniqueness and reference integrity.
- Translation completeness/status/source-revision checks.
- Valid question options, correct-answer references, answer-key integrity and ambiguity safeguards.
- Lesson-to-topic/question relationships and flashcard references.
- Language-specific checks where deterministic rules exist (for example pinyin field structure, script/character validity, tokenisation expectations, spelling/normalisation and morphology constraints).
- Import/export round-trip and content-count/change reports.

**Level 2 — Linguistic and educational review:**
- Correct meanings and parts of speech in context.
- Natural grammar, spelling, pronunciation/transliteration and register.
- Appropriate examples and cultural/contextual suitability.
- Accurate, understandable explanations and translations.
- Clear learning objectives, unambiguous quiz prompts/options and correct answer explanations.
- Flashcards that test the intended knowledge without misleading simplification.
- Independent review of authored content; do not assume that matching an English source proves correctness.

**Level 3 — Application/runtime and regression testing:**
- Dictionary search, filtering, detail content and language-specific input/normalisation.
- Lesson rendering, practice, answer checking, completion and progress.
- Quiz selection, question rendering, answer correctness, scoring and allowances.
- Flashcard rendering, review/mastery and progress.
- Learning-language and support-language changes from all relevant pages, including switching back and forth and preserving valid in-progress state.
- Account isolation, saved data, synchronisation and existing auth behaviours where affected.
- Existing English and Chinese functionality must remain intact when Malay or future translation content is added.
- Accessibility, responsive layouts, performance and fallback states.

Report automated pass/fail separately from human linguistic approval and owner browser acceptance. Never describe automated structural success as proof of language accuracy.

### 10. Regression, release and operational safeguards

- Every language addition must include both new-language tests and regression tests for every existing learning language affected by shared code or translation data.
- Prefer test fixtures and reusable contracts that run against all language packages, supplemented by language-specific suites.
- Compare translation and content coverage before/after changes; surface missing/stale translations explicitly.
- Keep application logic, content data, migrations and editorial assets separated where practical, with clear ownership and versioning.
- Use focused temporary implementation branches from current main, maintain the established rolling three-branch policy, preserve unique unmerged work, and require explicit owner approval before merge.
- Keep MDR and conversation archives on docs/master-development-record; never merge internal documentation into production main.
- Cloudflare Pages is the only active deployment path. Cloudflare Workers Builds is retired and no longer in operation.
- Inspect the current production/staging schema and migration history before proposing or applying data changes. No production deployment, destructive database action or production migration without explicit owner approval.
- Keep dictionary word-grid search free and unlimited. Do not introduce a subscription gate as a side effect of multilingual architecture.
- Respect free-plan/service constraints; prefer no-cost or low-cost validation and avoid assuming paid infrastructure is available.

### 11. Success measures for the architecture

Evaluate whether the approach is working by tracking:
1. The number and scope of shared application-code changes required to add a language.
2. The amount of repeated/manual integration work eliminated by package schemas and import tooling.
3. Structural validation coverage and the proportion of content defects caught before runtime.
4. Linguistic/educational approval coverage, separately from automated checks.
5. Translation completeness, staleness and review status by language pair and content type.
6. Regression outcomes for all existing languages after each addition.
7. Whether advance translation work measurably reduces the remaining workload when a future language is selected.
8. Ongoing maintenance cost: each additional language should not multiply shared-engine complexity or create unbounded pairwise translation obligations.

### 12. Update 3.0 planning implications (not yet a committed implementation plan)

Use Malay as the first real proving case for the multilingual architecture. Do not build a completely abstract framework in isolation and then separately bolt Malay onto it. Design and validate the shared package/registry/pipeline against real English, Simplified Chinese and Malay content.

The future U3.0 plan should first audit the current code/data model to identify language-specific assumptions and existing translation storage/flows; then propose incremental architecture changes and migration/compatibility strategy. It should define the Malay launch content and support-language coverage, future-language background translation scope, data schemas, language adapters, automated validators, editorial review process, test matrix, staging/release gates and Malaysia/international legal/privacy/licensing review.

**No U3.0 feature scope, translation matrix, target languages beyond Malay, implementation sequence, schema, migration or production action is approved by this record yet.** These require a separate planning discussion and explicit owner approval.

### 13. Legal, privacy and content provenance review

Every new language, content pipeline or translation expansion remains subject to the standing Malaysia-specific and general legal-risk planning check. Consider as applicable:
- Malaysia PDPA and amendments, operator/controller responsibilities, notices, data minimisation, processor terms and cross-border transfer safeguards.
- International privacy rules and territorial scope for users in supported regions.
- Age-related safeguards for the intended 16+ audience, including jurisdiction-specific treatment of minors.
- Rights, licences and provenance for dictionaries, corpora, example sentences, pronunciation/audio, scripts/fonts, transliteration and third-party linguistic datasets.
- Terms/Privacy disclosures if content providers, translation providers, analytics or new processors are introduced.
- Consumer/payment rules only if future Premium or monetisation functionality changes.
- AI/machine translation provider data handling and retention before sending any non-public or user-linked information to such services.

This is a planning checklist, not legal advice, legal clearance, licensing approval or a compliance certification. Prefer original content and record provenance; do not assume that publicly accessible language data is free to reuse.

### 14. Owner decisions and open questions captured

**Confirmed:**
- The concern is long-term development and maintenance growth as more learning languages are added, while maintaining top accuracy.
- The target direction is a shared language-independent platform with language-specific packages.
- Every language may have independently authored educational content; English is not the permanent master language.
- Learning language and support/translation language are distinct concepts.
- Standard schemas, stable content IDs, translation registry/coverage tracking, reusable content pipelines and automated validation are desired architectural tools.
- Human linguistic/educational review remains mandatory; automation is not a substitute.
- Malay is the first proving case for the architecture in U3.0.
- Advance preparation of translations for future support languages (examples: Japanese and Korean) is an idea to pursue in a staged, prioritised and reviewed manner, not an instruction to translate every item into every language immediately.

**Still to decide in U3.0 planning:**
- Exact language-pair translation coverage for English, Simplified Chinese and Malay, including direction and content types.
- Whether and how Japanese, Korean or other future languages enter the background translation queue, and which content is prioritised.
- Language-package file/database boundaries and versioning details.
- Stable-ID strategy for related but independently authored curricula.
- Language-specific adapter interfaces and exact capabilities.
- Translation provider/tooling, human-review capacity and approval workflow.
- Which UI strings, dictionary fields, lessons, quizzes and flashcards require support-language translations at launch.
- Migration/backward-compatibility approach for current English/Chinese data.
- U3.0 phase boundaries, estimates, tests, staging and release criteria.

## Long-term language roadmap and mandatory development workflow rules — owner-approved (2026-11-26)

**Status:** The major-language sequence and standing workflow rules below are owner-approved planning direction. They do not authorise implementation, database changes, merges or production deployment by themselves.

### 1. Planned major language-expansion roadmap

The current intended sequence for major language expansions is:

| Major update | Planned language expansion |
|---|---|
| **Update 3.0** | Malay |
| **Update 4.0** | Japanese |
| **Update 5.0** | Korean |

This is the current long-term roadmap direction. Each major language expansion is expected to be accompanied by moderate updates between major releases. Moderate updates may deliver incremental features, refinements, bug fixes, technical preparation, content improvements and infrastructure work; they do not need to wait for the next major language release.

The sequence is a planning baseline and can be revisited with the owner if priorities or feasibility change. Japanese and Korean are planned future learning-language expansions, not languages already approved for immediate implementation.

The advance-translation strategy recorded in the preceding multilingual architecture section remains applicable: prepare selected future support-language translations progressively where useful, without enabling a language as a learning course before its own dictionary, independently authored curriculum, language processing and launch QA are ready.

### 2. Standing development and release rules — mandatory

These rules apply to all future SwiftDictionary development unless the owner explicitly changes them.

#### Rule 1 — Keep the repository README current

Whenever development is pushed/merged into the production `main` branch and the change affects the released application or project status, update the repository's root `README.md` as part of the same release/change workflow.

- The README's displayed current version and release/status information must agree with the actual production release.
- Do not leave stale version references (the owner identified that the README still showed 2.8.0 while 2.9.0 was already released).
- Check the README before completing a release and update it to the correct release version (currently U2.9.1 as of this record) when appropriate.
- Include the README change in the same approved main-branch release where practical; do not update it prematurely to claim a release that has not shipped.
- Verify the committed README content after the push/merge.

#### Rule 2 — Live Supabase migration must precede the production main-branch update

For releases that require database schema or data migrations, the required Live Supabase migration must be applied and verified **before** the corresponding application changes are merged/pushed to production `main` and deployed live.

- First inspect the current Live Supabase schema, migration history and relevant data; identify the exact migration requirements and compatibility implications.
- Prepare and test migrations in the appropriate non-production environment first.
- Obtain explicit owner approval before applying any Live Supabase migration or production database/data change.
- Apply the approved Live migration, then verify its result and record evidence.
- Only after successful Live migration verification should the corresponding application release be merged/pushed to `main` and allowed to go live.
- If the migration fails, is incomplete, or cannot be verified, stop: do not merge/deploy the dependent application change. Report the actual state and resolve it first.
- Plan compatibility and recovery/rollback carefully. Where an application change does not require a database migration, record that no migration is needed rather than inventing one.
- This sequencing is a release gate, not permission to run production SQL without approval.

#### Rule 3 — Do not hand over staging previews until implementation and internal verification are complete

A staging preview is a user-testing handoff, not a place to discover whether the feature was implemented at all.

Before presenting a preview:
- Complete the agreed feature implementation, including its required UI, data flow, persistence, error handling, responsive behaviour and integration with existing features.
- Run appropriate static/code checks, automated tests, integration tests and browser/runtime checks available for the task.
- Verify the actual feature paths and relevant edge cases, not merely that the page loads or the build succeeds.
- Check affected existing features for regressions.
- Inspect logs and errors where available; investigate failures instead of dismissing or concealing them.
- Confirm that required migrations, seed data, configuration and feature flags are present in the staging environment.
- Provide a concise, truthful handoff stating what was tested, what passed, what remains unverified and any known limitations.

Never pretend a feature works, claim a test passed without executing it, or present an unverified implementation as complete. If a required check cannot be performed because of tool, environment, access or free-plan limitations, disclose that limitation explicitly and do not imply verification. Do not transfer unfinished implementation work to the owner under the label of a ready staging preview.

#### Rule 4 — Use website-created UI for prompts and dropdowns; avoid browser-native UI

For application prompts and dropdown interactions, implement and use the website's own interface rather than browser-native prompt/dialog/dropdown behaviour.

- Avoid browser-native `alert()`, `confirm()` and `prompt()` for product workflows.
- Avoid relying on browser-native dropdown presentation where the product requires a designed dropdown/select interaction.
- Build these interactions as website UI components, consistent with the site's layout, theme, accessibility and interaction patterns.
- Existing browser-native prompts/dropdowns should be identified and replaced as part of relevant maintenance or UI-polishing work; do not claim the entire application has been audited or converted until it has actually been checked.
- Preserve keyboard accessibility, focus management, screen-reader semantics, validation and mobile usability in custom website components.
- Native HTML form controls may still be appropriate when they are intentionally styled/used as part of the website interface and meet the design requirements; the intent is to avoid browser-controlled UI that breaks the site's visual and interaction consistency.

#### Rule 5 — Maintain consistent UI design and interaction quality across features

Every new feature must follow the established visual and interaction language demonstrated by Lessons, Quiz and Flashcards.

- Reuse the established design patterns, spacing, typography, panel/card treatments, controls, navigation, responsive behaviour and interaction conventions rather than inventing an unrelated style for each feature.
- Use drop shadows where appropriate to establish panel/card elevation and hierarchy.
- Include smooth, purposeful animation transitions for state changes, expansion/collapse, navigation and feedback where appropriate. Animations must not impair accessibility or usability; respect reduced-motion preferences.
- Use colour-coded panels, tabs, status indicators or sections where they materially improve recognition, grouping or feedback. Colours should be consistent and meaningful, not decorative overload.
- Maintain consistent hover, focus, active, disabled, loading, success, warning and error states.
- Ensure the overall page theme and component surfaces remain coherent with the existing SwiftDictionary design, including dark-background/dark-blue-panel decisions already established.
- Do not force shadows, animations or colour-coded panels into every element. Apply them when appropriate to the component's purpose while preserving a coherent system.
- Verify the feature on desktop and mobile and check that the new UI fits alongside Lessons, Quiz and Flashcards rather than looking like a separate product.

### 3. Required release checklist

Before each production release, verify and record:

1. Feature implementation complete and internally tested before staging handoff.
2. Staging preview accurately reflects the tested code and configuration.
3. Relevant automated, integration, browser and regression checks executed; results and limitations truthfully reported.
4. No browser-native prompt/dropdown remains in the new or changed workflow where a website-created component is required.
5. UI consistency checked against Lessons, Quiz and Flashcards, including appropriate shadows, transitions and colour-coded grouping.
6. Live Supabase migration requirement assessed; if required, approved migration applied and verified before main-branch merge/deployment.
7. Root README version/status updated to match the actual release.
8. MDR and conversation archive updated on the documentation branch, without merging internal documentation into production main.
9. Legal/privacy/licensing risk review completed for new features, languages, content sources or processing changes, following the standing Malaysia and international planning rule.
10. Explicit owner approval obtained at the established merge and production-release gates.

### 4. Owner decisions captured

- Planned major language sequence: U3.0 Malay, U4.0 Japanese, U5.0 Korean.
- Moderate updates are expected between major updates.
- Root README must be kept current whenever release changes are pushed/merged to production main; it must not lag behind the shipped version.
- For database-dependent releases, Live Supabase migration and verification must happen before the corresponding production main-branch update/deployment, with explicit approval.
- Staging previews must only be handed over after implementation is complete and internally verified. Never claim functionality or test results that have not been demonstrated.
- Prompts and dropdowns should be website-created UI, not browser-native prompts or browser-controlled dropdown presentation.
- New feature UI must remain consistent with Lessons, Quiz and Flashcards, using appropriate drop shadows, animation transitions and colour-coded panels/tabs where useful.
- These rules supplement, and do not replace, the existing branch hygiene, production safeguards, Cloudflare Pages deployment, documentation separation, free dictionary search and legal/privacy planning rules.

## Update 3.1 — Fill-in-the-Blank typing questions (owner-confirmed roadmap decision, 2026-11-26)

**Status: CONFIRMED FOR PLANNING; implementation not started or authorised.**

The owner confirmed that the Fill-in-the-Blank typing-answer feature belongs in **Update 3.1**, rather than Update 3.0. The feature must serve the existing English and Simplified Chinese courses as well as the planned Malay course; it is not a Malay-only addition. The owner explicitly confirmed:

- Typing questions should appear in **both Lessons and Quiz**.
- The initial question format should contain **one missing word per question**.
- Multiple missing words in one question are deferred from the initial scope.
- A shared reusable typing-question system is preferred, with language-specific validation rather than separate duplicated implementations.

### Preliminary implementation direction

1. Define the question format and interaction rules.
2. Define structured question data for prompts, expected answers, reviewed accepted alternatives, normalisation rules, hints and explanations.
3. Build a reusable, accessible typing interface.
4. Implement deterministic answer validation with explicitly accepted alternatives and language-specific adapters.
5. Integrate into Lessons and Quiz while preserving their distinct feedback, retry, assessment, progress and allowance behaviours.
6. Prepare/review content and validate across English, Simplified Chinese and Malay, devices, scripts, persistence and regressions.

The first release should favour deterministic validation and reviewed accepted-answer lists. Flexible semantic matching or AI-based grading is not approved as part of the initial scope. Quiz answer keys must not be exposed to the browser before submission; the secure checking architecture remains an open design question.

### Open decisions

The exact data schema, accepted-answer authoring workflow, language-specific normalisation (including Chinese input and Malay morphology), retry/hint/feedback rules, secure Quiz validation, scoring/progress/revision integration, content volume, database migration requirements and implementation estimate remain undecided. Inspect the then-current application and database before estimating or committing to technical design.

### Release placement

- **U3.0:** Malay language expansion; exclude the typing-question implementation.
- **U3.1:** Fill-in-the-Blank typing questions in Lessons and Quiz.
- **U4.0:** Japanese language expansion.
- **U5.0:** Korean language expansion.

This is a roadmap/scope decision only. It does not authorise U3.0 or U3.1 implementation. All standing legal/privacy, database approval and migration sequencing, staging verification, README, UI consistency and regression requirements continue to apply. See [the dated conversation archive](conversation-archive/2026-11-26-update-3-1-fill-in-the-blank-scope-confirmation.md) for the full decision record.


## Update 3.2 — Games page and Wordmine (owner-confirmed planning direction, 2026-11-26)

**Status: CONFIRMED FOR PLANNING; implementation not started or authorised.**

Update 3.2 is planned to rename the existing Flashcards navigation/page destination to **Games**, retain Flashcards as an activity, and add **Wordmine** as a separate game. The existing Flashcards allowance category is to become a shared Games allowance covering Flashcards, Wordmine and future games in Games. This does not approve a numeric quota change; preserve the currently configured quota values pending a production schema/limits audit.

### Wordmine gameplay

- Start with nine square tiles labelled Q, T, L or B. Q presents a four-option multiple-choice question; T presents a True/False question; L asks for a missing letter in a word and may show its definition as a hint; B asks the player to complete a sentence with a missing word.
- A correct answer turns the selected tile green and immediately replaces it with a newly random-labelled tile. Each correct answer counts as one successful round.
- An incorrect answer turns the tile red and permanently locks it for the session. The player must select another non-red tile. The fifth red tile immediately ends the game in defeat.
- There is no time limit. No question may repeat within a game session: once presented, it is used for that session regardless of whether it was answered correctly or incorrectly. This must apply across question types and tile replacements. Track presented question IDs; do not silently repeat if the eligible pool is exhausted.
- Difficulty affects both question complexity and successful-round target: Beginner 10; Intermediate 15; Advanced 20. All three use the same five-red-tile loss condition.
- Endless is exclusive to Wordmine. It has no ordinary round target and can continue up to 100 successful rounds. Reaching 100 is a win; five red tiles is a loss, regardless of the current score.
- After either victory or defeat, return directly to the Games main page. No mandatory retry/result screen.

### Shared Games allowance

- Flashcards, Wordmine and future games within Games share one daily Games allowance bucket; do not create per-game daily quotas by default.
- Wordmine victory consumes one allowance use; Wordmine defeat consumes one; abandoning before a terminal outcome consumes none. Do not charge at game start. Completion settlement must be idempotent.
- Preserve the existing daily reset behaviour based on the user's effective timezone. No new numeric Free/Premium quota values or quota increase/decrease are approved. Audit the current Live Supabase limits and migration history during implementation and preserve existing Flashcards quota values unless separately approved.
- Preserve existing Flashcards progress/history and design a compatible migration for allowance category/ledger/Profile display only after inspecting the actual production schema.

### Implementation planning and safeguards

Audit the current Flashcards navigation, page, data/progress and allowance paths; design the Games landing page and reusable language-aware Q/T/L/B question pipeline; implement session-level no-repeat tracking and safe pool-exhaustion handling; define Wordmine state/terminal settlement; and review Profile/Dashboard statistics without adding unapproved reward systems or unnecessary raw-answer collection. Test all available course languages, accessibility, responsive behaviour, account isolation, allowance enforcement and regressions. Inspect Live Supabase before drafting migrations and follow the mandatory approved Live-migration-before-production-merge sequence.

Before implementation, perform the standing Malaysia-specific and international legal/privacy review, including PDPA/data minimisation, intended 16+ audience safeguards, content provenance/licensing, and a Wordmine name/trademark clearance check. Keep branding, art, code and visual expression original; Minesweeper is a gameplay inspiration, not permission to copy protected assets or branding. This is a planning checklist, not legal advice or legal clearance.

### Open decisions

Question complexity standards by difficulty; Q/T/L/B distribution; unique-question pool exhaustion behaviour; interrupted-session/resume classification; Profile/Dashboard statistics; Games landing-page layout and route compatibility; historical Flashcards allowance-ledger migration; future game-specific exceptions; and detailed technical design, migration, content, estimates and acceptance criteria remain open. See [the dated conversation archive](conversation-archive/2026-11-26-update-3-2-games-and-wordmine-concept.md) for the complete decision record.

**Release placement:** U3.0 Malay; U3.1 Fill-in-the-Blank typing questions in Lessons and Quiz; U3.2 Games page and Wordmine. This is a planning decision only and does not authorise implementation, staging handoff, database changes, merge or production deployment. U2.9.1 remains the production baseline. Cloudflare Pages is the sole active deployment platform; Workers Builds is retired.


## Update 3.0.0 — final development plan (2026-11-26)

**Status: PLAN FINALISED; implementation not started.** Current production baseline remains U2.9.1.

Owner-confirmed decisions:
- Follow **Malaysian Standard Malay (Bahasa Melayu Malaysia)**.
- Bring older application code and data structures up to the U3.0 architecture, including existing English and Simplified Chinese. U3.0 is not a Malay-only parallel implementation.
- Do not provide a staging preview before Phase 3 is complete.
- Keep and complete all phases after Phase 3; the Phase 3 preview gate is not a U3.0 completion or release gate.
- Preserve the established U3.1 Fill-in-the-Blank and U3.2 Games/Wordmine roadmap boundaries.

### Final scope and architecture

U3.0 delivers a shared multilingual platform for English, Simplified Chinese and Malay, plus a complete Malaysian Standard Malay learning package: Dictionary, Lessons, Daily Learning, Quiz and Flashcards. Each language owns independently authored content; English is not the permanent master curriculum. Shared schemas, stable IDs, a language registry/capability contract, language adapters, versioned translation records and common engines reduce repeated work without flattening language-specific grammar, scripts or pedagogy.

The shared architecture must distinguish learning language from support/translation language; support optional cross-language relationships; track translation source revisions and review status; and never silently show the wrong language. Machine-assisted translations remain drafts until reviewed. Japanese/Korean may receive a small background translation queue, but remain inactive as learning courses.

### Final phases

0. **Legacy architecture and production audit:** inventory English/Chinese code/data, language assumptions, IDs, content loaders, Supabase schema/RPC/RLS/migration history and compatibility risks; production inspection is read-only.
1. **Shared architecture and legacy modernisation:** implement versioned shared schemas, language registry/adapters, stable IDs, translation registry and validation/import tools; refactor English and Simplified Chinese to the new model; preserve existing data/progress/history/preferences/allowances.
2. **Malay Dictionary:** Malaysian Standard Malay vocabulary, senses, POS, examples, pronunciation, related terms, morphology-aware processing/search and support translations.
3. **Malay learning foundation and staging gate:** independently authored Beginner/Intermediate/Advanced Lessons, reader/practice/progress, and all four Daily Learning categories (Daily Topic, Daily Application, Daily Discovery, adaptive Daily Revision). Complete internal verification before any preview handoff. After Phase 3, a staging preview may be provided with unfinished phases clearly disclosed.
4. **Malay Quiz:** authored question bank, language-appropriate distractors/explanations, secure server-side answer checking, progress/review/allowance integration.
5. **Malay Flashcards:** Malay-authored cards and appropriate recall modes, session snapshots, weak review/mastery/progress and allowance integration.
6. **Translation integration/coverage closeout:** measured English/Simplified Chinese/Malay coverage by content type and direction, missing/stale translation resolution, fallback/refresh tests, optional inactive future-language background queue.
7. **Full QA and rollout:** automated and human linguistic review, migration/security/accessibility/responsive/cross-version regression, legal/privacy/licensing checks, approved Live migration and verification before dependent main merge, README update and independently verified Cloudflare Pages deployment.

### Compatibility and release rules

- Preserve current allowance amounts, configured local-midnight reset, completion-only Daily Learning charging, resume/review rules and shared cross-course allowance buckets; do not create per-language quotas.
- Preserve English/Chinese content, stable IDs, progress, Quiz/Flashcard history, preferences, saved words, Collections, account isolation and deletion semantics.
- Keep dictionary search free and unlimited; no Premium payment/subscription activation in U3.0.
- Apply the standing Malaysia PDPA/general international privacy, cross-border processing, intended 16+ and jurisdiction-specific younger-user, content licensing, translation provider, data minimisation and accessibility review. This is planning, not legal advice or legal clearance.
- Keep application changes on a focused feature branch; keep internal docs on `docs/master-development-record`. Cloudflare Pages is the only active deployment path; Workers Builds is retired.
- No production migration, data mutation, merge or deployment without explicit approval. Where a migration is required, approved Live migration and verification precede dependent merge/deployment.
- Use website-created prompts/dropdowns and established responsive/reduced-motion UI conventions. Do not claim unexecuted tests. Analyse large content sets in small sequential batches and provide one consolidated deliverable only after a phase is complete and validated.

**Plan document:** [Update 3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md).  
**Session archive:** [Update 3.0 planning finalisation](conversation-archive/2026-11-26-update-3-0-planning-finalisation.md).

No implementation branch, source changes, Supabase migrations, staging preview or production deployment were created during this planning session. Next step is Phase 0 on a focused feature branch from current `main`.


## Update 3.0.0 — Phase 0 audit complete (2026-11-26)

**Phase 0 is complete as a read-only audit. Phase 1 is next.** The audit was performed against `main` commit `2aa44d7768fd4187d83cdd115c423ba62d92e9ed`; feature branch `feature/update-3.0-phase-0-audit` was created from that commit.

Key findings:
- The frontend remains two-language-specific across Dictionary, Lessons, Daily Learning, Quiz, Flashcards, saved words, Collections, Dashboard and anonymous account-deletion saves. Unknown language values are often coerced to English.
- English Dictionary: 1,316 headwords; Simplified Chinese Dictionary: 725 characters. English Lessons: 20; Chinese Lessons: 17/112 practice questions. Daily content catalogue: en 28 topics/25 applications/93 discovery; zh 6 topics/7 applications/93 discovery.
- Production Quiz bank has 199 approved English-learning and 145 approved Chinese-learning questions. English authoring JSON is 229 while its README says 214; Chinese authoring pack says draft while production DB has 145 approved records. Chinese Flashcards generated pack has 1,447 cards marked draft, but the frontend currently maps the bank into runtime cards without checking draft status.
- Production `public.languages` contains en/zh; `ms` fits the registry code format, but saved words, lesson progress/results, content catalogue, Quiz answer-language/snapshots, Flashcard cards/sessions and multiple PL/pgSQL functions still enforce en/zh.
- Production/staging both have 27 app tables, but migration histories differ (71 vs 63 records) and five table definitions differ: `public.languages`, `public.learning_activity_log`, `public.lesson_progress`, `public.profiles` and `public.saved_words`. Production is Tokyo/PG17.11; staging is Singapore/PG17.12. Staging README's zero-user/zero-content state is stale.
- Shared allowance values are unchanged and shared across courses; preserve them and free unlimited Dictionary search.
- Security advisor notes ten private tables with no policies, but inspected private content tables are not directly selectable by anon/authenticated; preserve private RPC-only access. Leaked-password protection is disabled (Google OAuth is the current sign-in path); verify applicability. Production also has unused/duplicate index advisories.
- Terms remain unpublished and no privacy notice page was found. Production/staging data regions require cross-border transfer review. Existing CC-CEDICT/Unicode/HSK/Hanzi Writer licences are documented, but the original 206 Chinese base entries and older English content need provenance review.

**Audit report:** [U3.0 Phase 0 Audit](UPDATE-3.0-PHASE-0-AUDIT.md).  
**Plan:** [U3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md).  
**Archive:** [U3.0 Phase 0 audit session](conversation-archive/2026-11-26-update-3-0-phase-0-audit.md).

No source code, database schema/data, Auth settings, migrations, staging preview, merge or deployment was changed. No tests were executed; this was static source and read-only live-schema inspection. Next action: Phase 1 shared language architecture and English/Chinese modernisation on `feature/update-3.0-phase-0-audit`.


## U3.0 Phase 1 — architecture foundation checkpoint (2026-11-26)

Phase 1 has begun on `feature/update-3.0-phase-0-audit`. Added a shared language registry for en/zh and planned ms, a versioned content/translation contract validator, an initial Node test suite, and the architecture contract at `docs/U3.0-MULTILINGUAL-ARCHITECTURE.md`. This is a foundation checkpoint only: the modules are not yet wired into the application entry point, legacy English/Chinese runtime and persistence paths remain to be modernised, and tests have not yet been executed. No database, Auth, staging, production, main-branch or deployment changes were made. No staging preview was created. See `docs/conversation-archive/2026-11-26-update-3-0-phase-1-foundation.md` and the updated U3.0 plan for remaining Phase 1 work.


## U3.0 Phase 1 integration checkpoint — 2026-11-26

The U3.0 feature branch now includes the shared runtime language registry and adapters, content-package/translation registries, legacy English/Chinese bootstrap, language manifests, extracted Dictionary/Lessons data packages, explicit Daily Learning package resolution, adapter-gated Flashcards, registry-aware saved-word/Collections/account-deletion paths, shared Quiz validation primitives, and a reviewed database migration design (design only; no SQL applied). Translation status `legacy_unverified` is used for legacy translation maps whose reviewer provenance has not yet been confirmed; it is not an approved state.

Validation: 22 core Node architecture/integration tests passed locally. Application script load order and active/planned language manifest states were checked. Source inventories confirmed English Dictionary 1,316 unique word/POS records; Chinese Dictionary 725 unique character records; English Lessons 20; Chinese Lessons 17/112 practice questions; Chinese Daily Learning 6/7/93; Chinese Flashcards 1,447 cards with draft status preserved. Generic Quiz question-envelope rules were checked against 229 English and 145 Chinese draft questions with zero envelope errors. Additional wiring/content-parity test files were added but not included in the 22-test run.

**Phase 1 exit remains open** pending full browser/device regression, account/progress/allowance history parity, and environment-specific Supabase migration compatibility review. No staging preview, database/Auth change, production merge or deployment was performed. Do not begin Phase 2 until Phase 1 exit evidence is complete. See `docs/U3.0-MULTILINGUAL-ARCHITECTURE.md`, `docs/U3.0-PHASE-1-DATABASE-MIGRATION-DESIGN.md` and the Phase 1 integration archive.


## 10. Update 3.0 Phase 1 regression and migration-compatibility checkpoint — 2026-11-26

**Historical checkpoint:** U3.0 Phase 1 architecture integration was present, but formal exit was **blocked** while validation was in progress. This was superseded by the final validation record dated 2026-11-26.

- Production: Tokyo, PostgreSQL 17.11.0.003, 71 migration records.
- Staging: Singapore, PostgreSQL 17.12.0.000, 63 migration records.
- Both environments have 27 inspected public/private tables with RLS enabled, but five confirmed table-definition differences and additional function, policy, index and trigger drift.
- Existing database constraints and RPCs still contain en/zh-only assumptions; no U3.0 migration has been applied.
- 22 earlier core tests passed, but the full current 25-case architecture/wiring/parity suite and browser/device regression have not been executed in this review.
- Production aggregate row-count and language distributions are recorded in the dated archive. These are read-only baselines, not before/after migration parity evidence.
- The Cloudflare Pages feature-branch build succeeded; it does not prove browser or database compatibility. Workers Builds is retired.
- No database, Auth, RLS, schema, production main branch, merge or production deployment was changed. A Pages branch build may automatically create an internal preview, but no preview link is to be handed to the owner before Phase 3.

**Decision:** Do not start Phase 2. Complete the full test suite, browser/device regression, production/staging compatibility matrix, disposable/local and staging migration rehearsal, and account/progress/history/allowance parity evidence first. Preserve English/Chinese behaviour and data, keep Malay planned until its content phases, and retain all Phase 3–7 release gates. See [the detailed Phase 1 checkpoint](conversation-archive/2026-11-26-update-3-0-phase-1-regression-and-migration-compatibility.md) and [the updated U3.0 plan](UPDATE-3.0-DEVELOPMENT-PLAN.md).

## 11. Update 3.0 Phase 1 validation complete — 2026-11-26

**Decision: Phase 1 is complete. Phase 2 is ready to begin, but has not started.** See [the final Phase 1 validation archive](conversation-archive/2026-11-26-update-3-0-phase-1-validation-complete.md) and [the updated U3.0 plan](UPDATE-3.0-DEVELOPMENT-PLAN.md).

### Final automated evidence

All final relevant GitHub Actions runs succeeded on application commit `c2dfc3bd1887c4ee1d4b821520f305726303922c`:
- U3.0 architecture regression: 29/29 Node tests passed.
- U2.9.0 English Dictionary QA: all content validators passed, 29/29 Mock Quiz/Flashcards tests passed, and 20/20 Chromium browser tests passed.
- Quiz database foundation and local Supabase integration: both jobs passed. Existing 2.3.x–2.9.0 migrations replayed in a disposable local environment; Auth/RPC, authenticated Quiz session, Flashcards/Preferences, Daily Learning, Chinese Dictionary and security-advisor checks passed.
- Additional browser suites passed: 22 Quiz, 7 Flashcards/Preferences, 2 Daily Learning and 5 Chinese Dictionary tests.
- Total: 114 Node/Playwright test cases passed, plus SQL migration/integration assertions.

The broader runs found stale validators that expected English content inside `index.html` and test fixtures that did not load the new language adapters. Those validators/fixtures were updated to read the extracted language packages and load the actual application dependencies. The final runs passed.

### Read-only production/staging integrity evidence

Both Supabase environments were inspected without writes. Each has 27 inspected tables with RLS enabled. Duplicate-key checks for saved words, collections, lesson progress, allowance usage, Quiz revisions, Flashcard mastery and session positions returned zero in both environments. Unknown language references across saved words, progress, practice, activity, Daily Learning, content catalogue, Quiz and Flashcards also returned zero in both. Direct SELECT to private Quiz, Flashcard and allowance tables is denied to anon/authenticated. Inspected protected RPCs are authenticated-only.

### Migration compatibility and known drift

The disposable local migration rehearsal passed using the clean staging-style baseline and existing migration chain. This validates the current U2.9.1-compatible application/database baseline; it is not a U3.0 schema migration rehearsal. No U3.0 SQL migration exists or is required for Phase 2 content authoring.

Production and staging are not identical: migration records are 71 vs 63; five table-definition differences remain; production has two helper functions and three triggers absent from staging; four indexes are production-only; and the `learning_plan_limits` RLS policy differs semantically. The other seven common function raw-hash differences disappear after comments/whitespace normalisation, and most other policy/trigger differences are naming-only. Full detail is in the final archive.

**Phase 2 impact:** These known differences do not block Malay Dictionary content authoring because Phase 2 does not require a database migration or Malay activation. They remain mandatory reconciliation gates before any U3.0 database migration, Malay database registration/activation or release depending on new schema/RPC behaviour. Never replay migrations by count/name or manually force production/staging parity.

No SQL was applied to production or staging. No Auth/RLS/schema/data changes, merge to production `main`, production deployment or staging-preview handoff occurred. No preview URL is to be provided before Phase 3 is complete. Cloudflare Pages remains the sole active deployment platform; Workers Builds remains retired.

**Handoff:** Phase 0 complete; Phase 1 complete; Phase 2 ready but not started. Continue on `feature/update-3.0-phase-0-audit` only when the owner authorises Phase 2. Keep documentation on `docs/master-development-record`.


## 12. Update 3.0 Phase 2 — Malay Dictionary authorised and started (2026-11-26)

Phase 2 has been authorised. Work is restricted to the Malaysian Standard Malay Dictionary package, lexical content, language-specific search/morphology adapter, support-translation records and validation. Malay remains registered as `planned`; it is not selectable or activated. No Supabase schema/data/Auth/RLS changes, database migrations, staging-preview handoff, production merge or deployment are permitted in this phase.

The Phase 2 execution contract is documented in [U3.0 Phase 2 Malay Dictionary Plan](U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md), and the main [U3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md) now contains the detailed execution sequence and safeguards.

### Content and licensing safeguards

Malay content is to be independently authored in Malaysian Standard Malay. DBP/PRPM and Kamus Dewan may be consulted for linguistic verification, but their dictionary text, definitions, examples and bulk data must not be copied or scraped into SwiftDictionary without written permission or an applicable reuse licence. DBP's copyright notice expressly requires prior written permission for reproduction of site content: https://dbp.gov.my/hak-cipta/. Each entry must retain its own provenance/licence and editorial status.

This phase introduces static lexical data and local search only; it does not add learner tracking or personal-data collection. Before public activation, revisit the amended Malaysian PDPA and current Commissioner guidance, including the phased commencement of Act A1727, cross-border hosting facts, notices, retention/deletion and any obligations applicable to the project's actual operating model. This is planning, not legal advice or compliance clearance.

### Current implementation state — 2026-11-26

Phase 2A is complete. Phase 2B has three authored batches on `feature/update-3.0-phase-0-audit`: 123 unique Malay headwords and 145 senses. Each sense has English and Simplified Chinese support text, with 290 shared translation-registry records marked `machine_assisted_draft`. All lexical entries are draft, original-authored records with source verification, rights review and human linguistic review pending.

The Malay adapter now searches headwords and explicitly recorded valid inflected forms only. It does not search definitions/examples or perform blind stemming. The shared package adapter preserves Malay stable IDs, provenance and morphology, and avoids same-language translation pairs.

The U3.0 architecture/content CI passed 39/39 Node tests on the latest batch 03 commit `353979dff00489f00c36af083d141a10e4219dfa`: [workflow run 45798641246](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641246). The U2.9.0 English Dictionary QA also passed all content validators, Mock Quiz/Flashcards regressions and Chromium browser smoke tests on the same commit: [workflow run 45798641233](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641233). Phase 2 is not complete. `ms` remains planned/inactive and not selectable. No database, Auth/RLS, staging preview, production merge or deployment changes were made. The Phase 1 database drift remains a future activation/migration gate.

See [the Phase 2 initial-batches archive](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-initial-batches.md) and [the detailed Phase 2 execution plan](U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md).


### Phase 2 vocabulary target update — 2026-11-26

The owner requested an approximately 700-headword Malay Dictionary, with a practical range of 650–750. This is a coverage target, not a reason to pad the catalogue with duplicates, predictable inflections or low-quality records. At batch 03 close, the package contains 123 unique headwords, 145 senses and 290 en/zh support translation records. All remain draft; translations remain machine-assisted drafts. See [the batch 03 archive](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-03.md).

The batch 03 architecture/content CI passed 39/39 Node tests: [run 45798641246](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641246). The legacy English Dictionary QA passed its validators, mock learning regression and browser checks on the same application commit: [run 45798641233](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641233). The baseline Quiz database/local Supabase integration workflow also passed its disposable migration-chain, authenticated Quiz, Flashcards/Preferences, Lessons allowance, Chinese Dictionary and security checks: [run 45798641222](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45798641222). No U3.0 schema migration was created or applied. Malay remains planned/inactive; no production database, staging preview, production merge or deployment changes occurred.


## 13. Update 3.0 Phase 2 — Malay Dictionary batch 04 (2026-11-26)

Batch 04 added 54 unique Malaysian Standard Malay headwords. The package now contains **177 unique headwords, 199 senses and 398 English/Simplified Chinese per-sense support translation records**. The manifest and dictionary revision are updated to `u3-ms-dict-0.4.0`. New coverage spans employment, money and shopping, healthcare, public services, education, technology and communication, weather, safety and general concepts.

The U3.0 architecture regression workflow passed **39/39 Node tests** on application commit `729b4305db6ad7d87c08896b01eff89b05729b3e` ([run 45801008034](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45801008034)). The initial attempts exposed real canonical-headword/search-alias collisions: new entries overlapped existing `gaji`, `harga`, `bayar` and `beli`; aliases on `kerja` overlapped `pekerja` and `pekerjaan`; and aliases on `bayar` overlapped `bayaran`. The overlaps were removed, the alias lists corrected, and the final 39/39 run passed. The earlier failed runs remain documented as failures and are not counted as successful checks.

The English Dictionary QA and Quiz database foundation workflows were triggered on the latest application commit; their final results are recorded separately when available. No U3.0 database migration was created or applied. No production or staging database, Auth/RLS, main branch, staging preview, or deployment was changed.

All Malay entries remain draft and all 398 support translations remain machine-assisted drafts. Competent Malaysian Malay linguistic review, independent translation review, source verification and rights review remain pending. No DBP/PRPM/Kamus Dewan protected text was copied or scraped. `ms` remains planned/inactive and not selectable. Phase 2 is still in progress; continue sequential content batches toward 650–750 unique headwords.

**Archive:** [Phase 2 Dictionary batch 04](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-04.md).  
**Plan:** [Update 3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md) and [Phase 2 Malay Dictionary Plan](U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md).


## 14. Update 3.0 Phase 2 — Malay Dictionary batch 05 (2026-11-26)

Batch 05 added 49 unique Malaysian Standard Malay headwords, bringing the package to **226 unique headwords, 248 senses and 496 English/Simplified Chinese support-translation records**. The manifest and content revision are updated to `u3-ms-dict-0.5.0`. New vocabulary covers transport/travel, places, nature/geography, food, housing/household items, clothing/hygiene and everyday actions.

The final U3.0 architecture regression run passed **39/39 Node tests** on application commit `f419789937478c8d32e48c2da9bf739e0f9f81e2` ([run 45801371395](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45801371395)). The first batch 05 attempt found a collision between the canonical headword `perjalanan` and an existing `jalan` search alias. The alias was removed from the `jalan` search forms while the related-word relationship was retained. The final 39/39 run passed.

The English Dictionary QA and Quiz database foundation workflows were triggered on the latest branch commit; their final outcomes are to be checked independently. No U3.0 database migration was created or applied. No production/staging schema, data, Auth/RLS, main branch, staging preview or deployment was changed.

All 226 Malay entries remain draft; all 496 support translations remain machine-assisted drafts. Human Malaysian Malay linguistic review, independent translation review, source verification and rights review remain pending. `ms` remains planned/inactive and not selectable. Phase 2 is still in progress; continue sequential content batches toward 650–750 unique headwords.

**Archive:** [Phase 2 Dictionary batch 05](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-05.md).  
**Plan:** [Update 3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md) and [Phase 2 Malay Dictionary Plan](U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md).


## 15. Update 3.0 Phase 2 — Malay Dictionary batch 06 (2026-11-26)

The owner requested that subsequent dictionary batches contain 100+ new unique headwords. Batch 06 follows that direction with **110 new unique Malaysian Standard Malay headwords**, bringing the current catalogue to **336 unique headwords, 358 contextual senses and 716 English/Simplified Chinese per-sense support-translation records**. The package and manifest revision is `u3-ms-dict-0.6.0`.

Batch 06 expands common learner coverage in family and people, education, food and meals, household objects, descriptions and emotions, function words and grammar, public administration, communication, health, everyday actions and general vocabulary. New records use the existing language-owned `makeEntry` helper, stable IDs, sense-level en/zh support translations, draft translation states and original-authorship/provenance metadata. New entries have no search aliases by default; morphology is not mechanically expanded. Canonical headword and search alias collisions remain prohibited.

The U3.0 architecture/content regression workflow passed **39/39 tests** on application commit `9ac14ca9732eef61be625e7a89573e9168ef059e` ([run 45813318122](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45813318122)). It validates the new 336-entry/358-sense package counts, translation coverage, shared Dictionary schema, Malay headword-only search and alias uniqueness, Unicode handling, inactive-language gating and English/Chinese adapter regressions. An earlier intermediate run failed only because it ran before the test and manifest count assertions were updated from 226/496 to 336/716; the corrected final run passed. The separate English Dictionary QA and Quiz database foundation workflows were checked after this record was first drafted: English Dictionary QA passed (run [45813318397](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45813318397)); Quiz database foundation plus its authenticated Chromium integration completed successfully (run [45813318148](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45813318148)). These are local/disposable validation workflows only; they do not imply any production or staging database changes.

All 336 entries remain draft and all 716 support translations remain machine-assisted drafts. Automated validation is not professional Malaysian Malay editorial review, independent translation review, source verification or rights clearance. No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Item-level rights and human review remain pending.

`ms` remains planned/inactive and not selectable. No Malay lessons, Daily Learning, Quiz or Flashcards implementation began. No Supabase schema/data/Auth/RLS change or migration was made. No staging preview, production merge, or deployment occurred. Phase 2 remains in progress; continue sequential batches of 100+ unique headwords toward 650–750 while preserving quality gates.

**Archive:** [Phase 2 Malay Dictionary batch 06](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-06.md).  
**Plan:** [Update 3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md) and [Phase 2 Malay Dictionary Plan](U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md).


## 16. Update 3.0 Phase 2 — Malay Dictionary batch 07 (2026-11-26)

Batch 07 adds **110 new unique Malaysian Standard Malay headwords**, bringing the catalogue to **446 unique headwords, 468 contextual senses and 936 English/Simplified Chinese per-sense support-translation records**. The package revision is `u3-ms-dict-0.7.0`. Coverage includes agriculture, household tools and materials, clothing, public facilities, transport infrastructure, environmental care, personal qualities and feelings, communication, administration, education and language study. New entries use the existing language-owned authoring helper and shared dictionary schema, stable IDs, explicit empty search aliases and original-authorship/provenance metadata; no automatic morphology expansion was introduced.

The corrected U3.0 architecture/content regression workflow passed on final application head `c6f8d5c635c4a79017d7f9a59a58426d34bd47db` ([run 45817883224](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45817883224)). The initial content-only run failed because the test still expected the pre-batch translation count; the assertions and manifest were updated, and the corrected latest-head architecture workflow passed. English Dictionary QA passed on the final application head (run [45817883250](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45817883250)). Quiz database foundation workflow [45817883239](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45817883239) remained in progress at the latest check and must be recorded separately when complete.

All 446 entries remain original-authored drafts; all 936 support translations remain machine-assisted drafts. Human Malaysian Standard Malay review, independent translation review, source verification and item-level rights clearance remain pending. No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysia PDPA and broader international legal reviews remain required before public launch and are not cleared by this content-only work.

The `ms` package remains planned/inactive and not selectable. No Malay Lessons, Daily Learning, Quiz or Flashcards implementation began. No Supabase schema/data/Auth/RLS changes or migrations, staging preview, main-branch merge, production deployment or ZIP occurred. Phase 2 remains in progress; continue batches of 100+ unique headwords toward the 650–750 target band while preserving quality gates.

**Archive:** [Phase 2 Malay Dictionary batch 07](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-07.md).


## 17. Update 3.0 Phase 2 — Malay Dictionary batch 08 (2026-11-26)

Batch 08 is complete at the lower boundary of the approved catalogue target: **204 new unique Malaysian Standard Malay headwords**, bringing the package to **650 unique headwords, 672 contextual senses and 1,344 English/Simplified Chinese per-sense support-translation records**. Package revision: u3-ms-dict-0.8.0.

The first batch-08 draft contained 23 repeated headwords (22 repeated terms from earlier batches and one repeated pekerja record). These were removed. To complete the requested 100+ new unique headword batch and enter the target band without padding, 23 additional distinct, useful terms were authored and added. Two search-alias collisions were resolved by retaining arahan and penghantaran as their own headwords rather than redundant aliases of arah and hantar. The subsequent regression verifies unique headwords and alias ownership.

Batch 08 covers communication and digital life, administration and commerce, transport, sport, health and anatomy, food, household appliances, geography, weather, environmental care, community, household items, shopping and public navigation. All entries use original-authored Malay draft definitions and contextual examples, per-sense English and Simplified Chinese machine-assisted draft translations, stable IDs and item-level provenance.

Application branch: feature/update-3.0-phase-0-audit. Latest content/test/manifest commit: c02cf9f2841f872bd1a68fe10fb24a5732fff522. The preceding corrected 627-entry checkpoint passed architecture regression 39/39 on commit 95ec6ac2797913ab96b4a59a01af10b99aba3bc4 (run [45837310858](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837310858)). Final-head validation passed on application commit c02cf9f2841f872bd1a68fe10fb24a5732fff522: U3.0 architecture regression **39/39** ([run 45837848040](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837848040)) and English Dictionary QA ([run 45837847935](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837847935)). The final regression confirms 650 unique Malay headwords, 672 senses, 1,344 en/zh translation records, consistent u3-ms-dict-0.8.0 versioning, no duplicate headwords or search-alias collisions, shared Dictionary contract compliance, and that Malay remains inactive/unselectable.

All 650 entries remain original-authored drafts; all 1,344 support translations remain machine-assisted drafts. Human Malaysian Standard Malay editorial review, independent translation review, source verification and item-level rights clearance remain outstanding. Medical, technical, administrative and environmental terminology needs subject-matter review. No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysia PDPA and broader international privacy/legal reviews remain required before public launch.

The ms package remains planned/inactive and not selectable. No Malay Lessons, Daily Learning, Quiz or Flashcards implementation began. No Supabase schema/data/Auth/RLS changes or migrations, staging preview, main-branch merge, production deployment or ZIP occurred. Phase 2 authoring has reached its headword target; remaining Phase 2 work is editorial, linguistic, translation, source/rights and release-gate validation.

**Archive:** [Phase 2 Malay Dictionary batch 08](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-08.md).


## 18. Update 3.0 Phase 2 — post-Batch 08 closeout validation (2026-11-26)

The owner-requested Malay Dictionary content target has been reached: **650 unique Malaysian Standard Malay headwords, 672 contextual senses and 1,344 English/Simplified Chinese per-sense support translations**, package revision `u3-ms-dict-0.8.0`. This is the lower boundary of the 650–750 target band. Batch 08 added 204 unique headwords.

The development plan was updated to clarify that reaching the headword target does not itself complete Phase 2. The remaining work is editorial, translation, source/rights and manual acceptance closeout. The next planned implementation phase remains Phase 3 (Malay Lessons, Beginner/Intermediate/Advanced, plus Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision), but Phase 3 must not be marked started until Phase 2 exit evidence is recorded.

### Additional automated validation

Application branch `feature/update-3.0-phase-0-audit` received two additional package-wide tests in `tests/u3-phase2-malay-dictionary.test.mjs`, commit `1d0ac17d5166e32ab59c9d29b0a35afeecdacf3c`:

- Learner-facing coverage and provenance assertions for every entry and sense, including POS, categories, headword/sense examples, original-authorship declaration, explicit no-copy status, draft editorial state, pending rights state and absence of a fictitious reviewer.
- Exact translation-registry mapping: each of 672 senses has exactly one `ms→en` and one `ms→zh` record, for 1,344 unique records, with revisions, machine-assisted draft status and provenance.

The U3.0 architecture/adapter/translation/content-parity workflow passed ([run 45849090462](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45849090462)); English Dictionary QA passed on the same head ([run 45849090452](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45849090452)). The earlier Batch 08 final content validation is recorded at [run 45837848040](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837848040).

### Phase 2 remains open — required human review

All 650 Malay entries and 672 senses remain editorial drafts. All 1,344 English/Chinese support translations remain machine-assisted drafts. Competent human Malaysian Standard Malay review, independent translation review, source verification and item-level rights clearance remain outstanding. Medical, technical, administrative and environmental terms require subject-matter review. Automated CI is not linguistic approval or legal clearance.

No DBP/PRPM/Kamus Dewan protected text was copied or scraped. Malaysia PDPA and broader international privacy/legal review remain mandatory before public activation. The `ms` package remains planned/inactive and unselectable. No Malay learning content, Supabase schema/data/Auth/RLS change or migration, staging preview, main merge, production deployment or ZIP occurred.

**Archive:** [Phase 2 closeout validation checkpoint](conversation-archive/2026-11-26-update-3-0-phase-2-closeout-validation.md).  
**Plan:** [Update 3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md).


## 19. Update 3.0 Phase 2 — editorial review preparation and revised review timing (2026-11-27)

A 650-row headword review worksheet was generated from `data/languages/malay-dictionary.js` on `feature/update-3.0-phase-0-audit`. The generation inventory verified **650 unique stable entry IDs and 650 unique normalised headwords**. The worksheet tracks Malaysian Standard Malay spelling, POS, every sense and example, search/morphology, English and Simplified Chinese translation review, source verification, rights clearance, specialist review, reviewer identity/date, decision and notes.

- **Worksheet:** [Malay Dictionary editorial review CSV](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/review/malay-dictionary-editorial-review-worksheet.csv).
- **Instructions:** [Malay Dictionary editorial review guide](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/review/README.md).

The total inventory remains 650 headwords, 672 senses and 1,344 machine-assisted English/Simplified Chinese translation records. The worksheet has one row per headword; every sense and both translation records under that entry must be inspected. No reviewer IDs, dates, sources, rights decisions or approval states may be fabricated.

**Owner correction — review timing:** Human Malaysian Standard Malay linguistic review and independent English/Simplified Chinese translation review will be conducted during the staging review, after Phase 3 is implemented and internally validated. They are no longer a prerequisite to beginning Phase 3. The worksheet remains pending and all content/translation records remain draft until actual review is completed. Source/provenance and rights clearance remain mandatory before public activation; unresolved or unlicensed material must be corrected or excluded.

No Malay production activation, Supabase schema/data/Auth/RLS change or migration, staging handoff, production merge or deployment occurred in this preparation step. Malaysia PDPA and international privacy/legal review remain required before public launch.

**Plan:** [Update 3.0 Development Plan](UPDATE-3.0-DEVELOPMENT-PLAN.md).

## 20. Update 3.0 Phase 3 — Malay learning foundation authorised (2026-11-27)

The owner explicitly authorised Phase 3 to proceed before human linguistic review. The development sequence is now: implement Malay Lessons and Daily Learning; complete internal validation; provide the isolated staging preview; then conduct the owner's human review of Malay Dictionary entries, English/Simplified Chinese translations and learning content using the worksheet. No draft may be labelled reviewed or approved before that review.

Phase 3 scope:
- Independently authored Malay Lessons across Beginner, Intermediate and Advanced, with lesson reader, practice, feedback, stable IDs, independent course/difficulty progress and selected support-language behaviour.
- All four Daily Learning categories: Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision.
- Reuse the existing shared daily allowance categories, local-midnight reset and completion-only charging. Do not create Malay-specific allowance buckets.
- Preserve English and Simplified Chinese functionality, progress, history, account isolation and existing allowance ledgers.
- Fill-in-the-Blank remains Update 3.1; Quiz and Flashcards remain later U3.0 phases.

The feature branch remains `feature/update-3.0-phase-0-audit`; documentation remains on `docs/master-development-record`. Phase 3 staging is not authorised until internal implementation and regression checks are complete. No production database, Auth/RLS, main merge or deployment change is authorised.



## 21. Update 3.0 Phase 3 — initial Malay learning implementation (2026-11-27)

The owner moved human Malaysian Standard Malay linguistic review and independent English/Simplified Chinese translation review to the staging-review checkpoint. Phase 3 implementation is authorised to proceed; all existing Malay Dictionary records, translations and new lesson/activity content remain draft and unapproved until actual human review.

Initial implementation on `feature/update-3.0-phase-0-audit`:
- Added `data/malay-lessons.js` with 9 lessons (3 per difficulty), stable IDs, Malay primary text, English/Simplified Chinese support text, explanations, key points, examples, common mistakes and three multiple-choice practices per lesson.
- Added `data/malay-daily-learning.js` with 3 Daily Topic, 3 Daily Application and 93 Daily Discovery records. Discovery uses a stable 93-entry rotation derived from the Malay Dictionary draft inventory.
- Connected the Malay Dictionary, Lessons and Daily Learning data through the shared content-package bootstrap and registered Malay as active only in this feature/staging branch. Quiz and Flashcards remain unsupported and are blocked in the UI.
- Added immediate refresh of Malay lesson/daily support text when the translation-language selection changes.
- Added architecture/content tests for all three difficulty levels, bilingual fields, question structure, 93 unique Discovery records, shared package wrapping and capability gating.

The U3.0 architecture/adapter/content regression workflow passed **45/45 tests** (run [45931107403](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45931107403), commit `ac5d8d0e2b694004686b5f4c18d9a72447dc47ee`). English dictionary QA also passed on the application-wiring checkpoint (run [45931053784](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45931053784)). These results do not prove browser/device acceptance, DB compatibility or linguistic correctness.

A database-impact report was added at [U3.0 Phase 3 Database Impact](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/U3.0-PHASE-3-DATABASE-IMPACT.md). It records the en/zh-only lesson constraints and RPC guards, the missing Malay approved-content catalogue rows, the need to verify language registry/FK compatibility for Daily Learning, and the need for an environment-specific additive staging migration. No SQL migration was added to the active migration directory or applied to either Supabase environment. Staging migration requires separate explicit owner approval after schema diff and SQL review.

Legal/privacy planning: Phase 3 reuses existing account-bound progress, practice-result, daily-session and allowance mechanisms and introduces no intended new personal-data field or third-party processor. Before public launch, re-check Malaysia PDPA Amendment Act 2024 obligations and current Commissioner guidance for controller registration, DPO, breach notification and cross-border transfers; assess whether the existing privacy notice adequately describes adaptive topic-level review. All dictionary and lesson content rights/provenance remain open until review.

**Phase status:** Phase 3 is in progress. No staging preview, production activation, main merge or deployment has occurred.


## 22. Phase 3 Malay Lessons expansion — Batch 02 (2026-11-27)

Expanded the draft Malay permanent Lessons catalogue from 9 to **18 lessons**, balanced across the three difficulty levels (6 Beginner, 6 Intermediate, 6 Advanced). New file: `data/malay-lessons-expansion-02.js`, loaded after `data/malay-lessons.js` and before `js/core/legacy-content-bootstrap.js`.

Content added:
- Beginner: daily routines; time and days; polite food ordering.
- Intermediate: aspect markers for ongoing/completed/future actions; prepositions for location/direction/recipients; conjunctions and logical relations.
- Advanced: active/passive voice including pronoun-specific passive patterns; discourse cohesion, references and discourse markers; evidence-based arguments and fact/opinion distinction.

The Malay manifest now records version `u3-ms-lessons-0.2.0` and lesson counts of 6/6/6. Regression coverage was updated to assert 18 unique lesson IDs and the three difficulty totals. The U3.0 architecture/adapter/content workflow passed **45/45 tests** (run [45932215643](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45932215643), commit `9ee2d59b77e1ac9ded2e4ffa205ee9bbfdb79ac3`).

All Malay content and machine-assisted translations remain draft for the owner's staging review. The test pass confirms syntax, structure, package integration and automated contracts only; it does not validate Malaysian Standard Malay editorial quality or translation accuracy. No staging preview, DB migration, production activation, main merge or deployment occurred. Phase 3 remains in progress.


## 23. Phase 3 Malay Lessons expansion — Batch 03 (2026-11-27)

Added 9 more original draft lessons in `data/malay-lessons-expansion-03.js`. The Malay permanent Lessons catalogue now totals **27 lessons: 9 Beginner, 9 Intermediate and 9 Advanced**.

Topics added:
- Beginner: family relationships and possessive phrases; locations and giving directions; shopping, prices and quantities.
- Intermediate: adjective comparison; intensifiers; compound and complex sentence construction.
- Advanced: sentence-structure variation; paraphrasing and summarising while preserving meaning; critical reading, evidence and source reliability.

The file is loaded after expansion batch 02 and before the shared content-package bootstrap. The Malay manifest version is `u3-ms-lessons-0.3.0`, with lesson counts 9/9/9. Automated tests now assert all 27 IDs are unique and the package contains 27 permanent lessons.

U3.0 architecture/adapter/content regression passed **45/45 tests** (run [45932623195](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45932623195), commit `8fc2695e2147fd99e58cfcdd9fef5fde49c03fea`). This is automated structural and integration validation only. Human Malaysian Standard Malay review and independent EN/ZH translation review remain scheduled for staging review.

No staging preview, DB migration, production activation, main merge or deployment occurred. Phase 3 remains in progress.


## 24. Phase 3 Malay Lessons expansion — Batch 04 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-04.js`. The permanent Malay Lessons catalogue now contains **36 lessons: 12 Beginner, 12 Intermediate and 12 Advanced**.

Topics added:
- Beginner: weather and clothing; transport and travel; health-related language and appointments.
- Intermediate: direct and reported speech; modal expressions for ability, permission, intention and obligation; relative clauses using “yang”.
- Advanced: register and audience; systematic editing and error correction; proposal and persuasive writing.

Each lesson includes multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions. The file is integrated before the shared content bootstrap. The manifest is `u3-ms-lessons-0.4.0`, with 12 lessons at each level. Regression tests now load batch 04 and assert 36 unique IDs and 36 package lessons; the validation workflow syntax-checks the new file.

All Malay content and machine-assisted EN/ZH support remain draft for staging review. Automated validation is pending for the latest application commit; previous 45/45 results apply only to batch 03. No staging preview, database migration, production activation, main merge or deployment occurred. Phase 3 remains in progress.


## 25. Phase 3 Malay Lessons expansion — Batch 05 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-05.js`. The permanent Malay Lessons catalogue now contains **45 lessons: 15 Beginner, 15 Intermediate and 15 Advanced**.

Topics added:
- Beginner: home and household items; school and learning; feelings and simple opinions.
- Intermediate: conditional sentences; classifiers and quantifiers; cause-and-effect relationships.
- Advanced: data and statistical language; policy language and formal correspondence; ethical and inclusive language.

Each lesson includes multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions. The file is integrated before the shared content bootstrap. The manifest is `u3-ms-lessons-0.5.0`, with 15 lessons at each level. Regression tests now load batch 05 and assert 45 unique IDs and 45 package lessons; the validation workflow syntax-checks the new file.

All Malay content and machine-assisted EN/ZH support remain draft for staging review. Automated validation is pending for this batch. No staging preview, database migration, production activation, main merge or deployment occurred. Phase 3 remains in progress.


## 2026-11-27 — Malay Dictionary cross-course translation target and filters

The owner confirmed the intended translation direction:
- English course → Malay target translation.
- Simplified Chinese course → Malay target translation.
- Malay course → existing English and Simplified Chinese support translations remain unchanged.

The source-language inventory on the current U3.0 feature branch is 1,316 English headwords (1,931 senses) and 725 Chinese characters (825 senses). The target coverage is therefore 2,756 meaning-level translations, including separate translations for polysemous entries. The target selector must not expose Malay for English/Chinese Dictionary records until the relevant coverage is complete; missing translations must never silently display source-language text. This is a Dictionary requirement and does not imply that English/Chinese Lessons, Quiz or Flashcards are already translated into Malay.

The Malay Dictionary already has topic categories and part-of-speech metadata. Added malay-category-filters.js to group those existing categories into learner-facing Malay topic filters and separate Malay word-class filters. It preserves the existing Dictionary search and grid matching logic and keeps uncategorised material reachable through “Lain-lain”. Added automated tests for category grouping, word-class matching and page wiring. Local helper-level checks against all 650 Malay records found no entry without a filter category; the broader GitHub Actions regression result for the latest branch commit is still pending verification.

Legal/content review: translations are to be independently authored from SwiftDictionary's existing source definitions. No DBP/PRPM/Kamus Dewan protected text or external dictionary dataset is to be copied. New translations remain machine-assisted drafts pending the owner's staging review. This static content change introduces no new personal-data field or processor; existing Malaysia PDPA and international privacy checks remain release gates.

No Supabase schema/data/Auth/RLS change, staging migration, production database write, merge to main or production deployment was made for the filter implementation. Draft PR #20 remains unmerged. Continue the translation content in analysed batches and expose Malay as a Dictionary target only after complete coverage and regression validation.


## 2026-11-27 — U3.0 staging feedback and Malay Quiz batch 01

The owner's five staging observations and their feature-branch corrections are recorded in [the staging feedback and Malay Quiz batch 01 archive](conversation-archive/2026-11-27-u3-staging-feedback-and-malay-quiz-batch-01.md). The corrections cover Malay Dictionary target selection, multilingual Daily Application options, Malay permanent Lesson review from Daily History, registry-based language labels and capability-derived Quiz unavailable state. Static regression tests have been added; final CI and preview refresh remain pending.

Malay Quiz authoring has started: 12 draft questions per support-language pair (Malay→English and Malay→Simplified Chinese), four per difficulty, plus a curriculum map and validator. The manifest keeps Malay Quiz capability disabled. This draft batch is below the existing availability minimums, and no Malay Quiz secure backend path or staging database migration has been applied. Expand and validate the bank, then implement the private server-side session/answer path and staging-only migration under the existing Quiz security/allowance model. All content remains draft pending owner review. No production changes, merge or deployment.


### 2026-11-27 — U3.0 staging fixes CI checkpoint

Follow-up corrections allow the Malay target selector for the Malay learning course (including the Profile save and refresh paths), default generated Malay Dictionary translation records to the correct machine-assisted draft status, and remove the remaining static Chinese-specific Quiz placeholder copy. The U3.0 architecture/content workflow passed on `6abd022e08a1d7a4079884e8de8dc0136f0e1530`, including all 62 tests and the Malay Quiz validator. Cloudflare build-routing guard and U2.9 English Dictionary QA also passed on that head. U2.3/U2.5/U2.6/U2.7/Quiz database cross-version checks were still pending or in progress. Latest Pages deployment was not independently confirmed; no database changes, merge or production deployment.

See [the staging feedback and Malay Quiz batch 01 archive](conversation-archive/2026-11-27-u3-staging-feedback-and-malay-quiz-batch-01.md).


### Cross-version browser regression follow-up — 2026-11-27

The U2.7 browser suite exposed one compatibility issue introduced by the registry-based language-label change: it displayed the English label “Simplified Chinese” where the existing UI contract expects the native “简体中文”. This was corrected by using the registered native name for `zh` while using the registered display name for English and Malay. The Daily History language label now says “Malay”. The U2.7 PostgreSQL lesson-start/allowance job passed; its browser job failure was isolated to this display label. A fresh U3.0 and cross-version rerun was triggered on application commit `12524ca92de2c71804d4ba72d6f2977b071aa6ec`; results are pending. Earlier U3.0 and U2.9 passes remain valid for commit `6abd022e08a1d7a4079884e8de8dc0136f0e1530`, but they do not validate the subsequent label-only correction. Preview publication is still unconfirmed.


### Latest feature-head verification — 2026-11-27

Application branch head: `12524ca92de2c71804d4ba72d6f2977b071aa6ec`.
- U3.0 Phase 1 architecture/content regression passed, including the Malay Quiz draft validator and all 62 tests: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957631376
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957631477
- U2.3, U2.5, U2.6, U2.7, U2.9 and Quiz database foundation workflows were still pending/in progress when recorded. U2.7's previous browser run failed only because the registered Simplified Chinese display label was rendered in English; the native-label fix is included in this head and the rerun is pending.
- The stable Pages alias is the existing staging endpoint, but latest branch-head publication was not independently verified from Cloudflare. No final staging preview handoff or owner browser/device acceptance is claimed.
- PR #20 remains draft and unmerged. No staging Quiz schema/data changes or production changes were applied.


## 2026-11-27 — Malay Quiz batch 02 and secure runtime implementation

The owner requested 36 questions per batch and implementation of secure server-side session/evaluation support. The second authoring batch now adds **36 questions per support-language pack** (12 Beginner, 12 Intermediate, 12 Advanced): 36 Malay→English plus 36 Malay→Simplified Chinese, 72 new question records total. Together with the initial 12-question batch, each support-language pack contains 48 draft questions (16 per difficulty; 96 records across both packs). All questions remain original SwiftDictionary draft content, `release_approved:false`, with curriculum lesson/objective mappings. The meN- prefix distractor glosses were corrected for uniqueness. The Malay manifest remains `capabilities.quiz:false` and package status `draft`; content is not playable or approved.

A new additive migration, `supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql`, adds private Malay availability and start-session implementations and routes the existing public availability/start RPCs by the caller's saved learning course. It uses the existing private session/question snapshots, randomized option order, answer-key redaction, authenticated answer-save RPC, server-side submit/scoring path, completion-only allowance ledger, one-active-session constraint, account-scoped ownership and local-day no-repeat reservation ledger. It supports Malay→English and Malay→Simplified Chinese bank snapshots. When the user selects Malay as its own translation/display language, the server uses an English support snapshot internally while the client continues to display Malay-only text. Existing save/submit/abandon/history/review functions remain shared and language-agnostic; no client-supplied correct answer is accepted.

Added a Malay draft SQL exporter and import assertions, an authenticated PostgreSQL integration test covering all three difficulties, both support-language pairs, answer-key privacy, cross-account review denial, same-language fallback, server scoring, completion-only allowance and no-charge abandon behaviour, and static tests for the runtime security boundary. CI was wired to apply the additive migration in its disposable local Supabase environment, import the 96 Malay draft rows, and run the integration suite. The first CI runs are pending; no passing result is claimed yet.

**Staging boundary:** the migration has been committed to the feature branch but has NOT been applied to the connected staging Supabase project. This follows the standing requirement for a separate explicit owner approval after schema diff and SQL review. Production remains untouched. Keep PR #20 draft/unmerged. Do not turn on the Malay Quiz manifest capability until the approved content bank meets the availability thresholds and owner linguistic review is complete.

**Legal/content provenance:** questions and distractors are independently authored for SwiftDictionary; no DBP/PRPM/Kamus Dewan text or third-party question bank was imported. English/Chinese support translations are draft derivative translations; retain the existing Malaysia Copyright Act 1987 and model-artifact licence/attribution review before public production release.


### Runtime schema and allowance corrections — 2026-11-27

A direct review of the connected Quiz schema found three language checks that still restricted answer/snapshot language codes to `en` and `zh`. The Malay runtime migration now extends those exact checks to include `ms` (question-type equality checks remain intact), validates the constraints, and keeps the existing private-schema boundaries. The local integration test seeds the U3.0 Malay language/catalogue baseline before applying this migration.

**Allowance policy correction:** the existing Quiz trigger charges the Quiz allowance when a session starts (`learning_activity_log.event_type='started'`), not when it is submitted. The Malay start function now writes the same server-owned start event inside the session transaction. Resuming an existing active session does not charge a second start; abandoning a session does not refund the already-consumed start allowance. The generic server-side submit/evaluation function remains shared and computes the score from private answer-key snapshots. Earlier draft notes in this archive described completion-only charging; those statements are superseded by this correction.

One intermediate U3.0 static test run failed because a newly added test assertion had incorrect regex escaping; the runtime migration itself was not executed in that run. The assertion was replaced with literal SQL-fragment checks, and the latest feature-head U3.0 and Quiz database workflows are pending. No staging migration has been applied.


### Latest U3.0 static regression checkpoint — 2026-11-27

U3.0 Phase 1 architecture/content regression passed on application head `4edff5a73896f9bc0f87b4bdf3da85714ffba780`, including the 48-question-per-pair Malay validator, the runtime migration security/constraint assertions, and the UI guard that waits for the saved course preference before starting. Run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45960273133. The Quiz database foundation workflow is still in progress on the same head and must pass its disposable PostgreSQL import and authenticated local Supabase integration stages before runtime acceptance is claimed. No connected staging or production database has been changed.


### Course-preference routing compatibility — 2026-11-27

The public three-argument Quiz start wrapper now preserves the existing English/Chinese course-override routing for compatibility, while the Malay path requires the saved learning course to be `ms` and rejects a client attempt to start Malay while the saved course is another language. The Quiz UI waits for its queued course-preference write before requesting a Malay session, preventing a fast course switch from racing the server-side saved-preference check. U3.0 static tests cover this ordering. The generic authenticated save, submit/scoring, active-session, abandon, history and review RPCs remain shared across all learning languages.


### Quiz integration CI fixture correction — 2026-11-27

The first full local Supabase integration attempt reached the U3.0 baseline and found that the full Phase 3 Malay catalogue seed also inserts Daily Discovery rotation orders, colliding with the global unique discovery-order index in the isolated Quiz test database. This is unrelated to Malay Quiz question content or runtime. The Quiz workflow now runs the Malay enablement baseline and a Quiz-only fixture containing just the 72 permanent-lesson catalogue rows needed by the Quiz source checks; it deliberately omits Daily Discovery rotation data. The failed run stopped before applying the Malay Quiz runtime migration or executing the new RPC tests. A fresh local Supabase integration run is pending on the corrected workflow. No connected staging data was changed.
