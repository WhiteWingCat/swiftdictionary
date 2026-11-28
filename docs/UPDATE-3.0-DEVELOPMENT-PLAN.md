# SwiftDictionary Update 3.0.0 — Final Development Plan

**Status:** Owner-approved U3.0 staging preview is available. The latest application branch is feature/update-3.0-phase-0-audit, currently at 0d9f847a928a5b10c26668868f8606595be2b834. The staging Supabase project ivatvkfrtifgfheeaelj is healthy; all U3.0 staging migrations through 20261127190000 are applied. Malay course content includes 72 permanent lessons, 60 Daily Topics, 60 Daily Applications, 93 Daily Discovery entries, 240 approved staging Quiz questions (120 each for Malay→English and Malay→Simplified Chinese) and 650 Malay Dictionary Flashcard entries. Complete machine-assisted Dictionary translation coverage is available for 1,316 English headwords / 1,931 senses and 725 Chinese headwords / 825 senses (2,041 headwords / 2,756 senses); content remains draft pending human Malaysian Standard Malay review. Dashboard Malay favourites, Malay Collections lookup, Daily History labels and Flashcards course-switch mode preservation are implemented. Flashcards now uses the full generated Dictionary Malay corpus as a fallback, with cache-busting version ms13; the static Flashcards job and Cloudflare routing guard pass on the latest change, while Chromium and the remaining cross-version workflows are still queued/running. Remaining content gaps: Malay target-language prompts/options for English/Chinese lesson practice and English/Chinese Quiz banks. Staging Google OAuth and latest Cloudflare publication are not independently verified. PR #20 remains draft/unmerged; production remains untouched. Preview: [stable branch preview](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev). See the [latest staging handoff](conversation-archive/2026-11-27-u3-staging-preview-handoff.md).

**Production baseline:** SwiftDictionary Update 2.9.1.  
**Language standard:** Malaysian Standard Malay (Bahasa Melayu Malaysia).  
**Primary objective:** Introduce Malay as a complete learning language while modernising the existing English and Simplified Chinese implementation to a consistent, language-independent U3.0 platform.

## 1. Release scope

U3.0 is a multilingual-platform and Malay-expansion release, not a Malay-only add-on. Its delivered platform must support three active learning languages:

- English (`en`)
- Simplified Chinese (`zh`)
- Malaysian Standard Malay (`ms`)

Each language package owns its own linguistic and educational content. English is not the permanent master curriculum. Shared schemas and engines must support language-specific content, capabilities and processing without forcing the languages to behave alike.

### Included

1. Modernise legacy application code and data structures to the U3.0 shared architecture for **all three languages**, including existing English and Simplified Chinese.
2. Malay dictionary: vocabulary, meanings/senses, POS, pronunciation, examples, related terms, search and language-specific processing.
3. Malay Lessons: Beginner, Intermediate and Advanced, authored curriculum, lesson reader, interactive practice, independent progress and selected support-language content.
4. Malay Quiz: curated question bank, difficulty, answer options, explanations, secure answer validation, progress and allowance integration.
5. Malay Flashcards: authored card sets, appropriate recall modes, examples, translation/support text, review history and progress.
6. Malay Daily Learning: Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision, using the existing shared daily activity and allowance model.
7. Shared multilingual translation/support-language infrastructure, coverage tracking and content-version handling.
8. Shared regression and migration work to preserve existing English/Chinese data, progress, preferences, account isolation and user workflows.

### Explicitly excluded

- Fill-in-the-Blank typing questions: Update 3.1.
- Games page and Wordmine: Update 3.2.
- Japanese and Korean as selectable learning languages: future U4.0 and U5.0 respectively.
- Premium payment, checkout, subscription activation or entitlement-policy changes.
- Any restriction on dictionary word-grid search. Dictionary search remains free and unlimited.

## 2. Architecture and data principles

### 2.1 Shared platform plus independent language packages

The shared platform owns navigation, authentication, preferences, course/support-language selection, UI engines, content loading, progress, allowances, history, account synchronisation, accessibility, common validation and test tooling.

Each language package owns:
- language metadata, script/locale and capability declarations;
- dictionary entries, senses, POS, pronunciation, examples and related terms;
- independently authored lessons, objectives, practice questions, Quiz questions and explanations, and Flashcards;
- language-specific tokenisation, morphology, search/input normalisation, pronunciation and script behaviour;
- content provenance, editorial status and review history.

Do not scatter `if language === ...` branches through shared UI/business logic. Use bounded language adapters and explicit capabilities. Do not assume every language is alphabetic, whitespace-tokenised, inflected like English or has one-to-one content parity.

### 2.2 Versioned shared schemas

Define and document versioned schemas for:
- language metadata and capabilities;
- dictionary entries and stable entry/sense IDs;
- lessons, objectives, sections, examples and practice items;
- Quiz questions, choices, answer references, explanations and curriculum links;
- Flashcards, prompts, answers, recall modes and review identities;
- Daily Learning activities and their category/schedule metadata;
- translation records, source/target language, context, status and source revision;
- provenance, reviewer/approval state, schema version and content version.

Every item has an authored language. A learner's support/translation language is a separate setting. Independent target-language content is not mislabelled as a translation. Optional relationships are allowed where concepts or learning objectives do not map one-to-one.

### 2.3 Translation registry and coverage

Introduce a central, versioned translation registry keyed by stable content identity and explicit source/target language. Track content type/ID, source revision, translation revision, status (not started, draft, machine-assisted draft, legacy-unverified, reviewed, approved, stale, not applicable). Legacy-unverified is a migration-only status and never implies review or approval, provenance/reviewer and validation metadata.

U3.0 launch coverage must support English, Simplified Chinese and Malay in the active product surfaces. The detailed matrix must be generated from the real content inventory and record availability per item/type/pair; never imply full coverage merely because a selector exists. Missing translations must produce an explicit, intentional fallback/unavailable state, never silently show text in the wrong language. Reviewed translations are not silently overwritten when source content changes.

Japanese/Korean background translations may be prepared only as a prioritised, review-tracked queue. They remain inactive and are not a launch dependency for U3.0.

## 3. Phased implementation

Phases are sequential. Each phase has its own implementation and validation checkpoint. Heavy content/data audits must be split into small batches and consolidated only after all batches are checked. Do not issue intermediate ZIPs.

### Phase 0 — Legacy architecture and production audit

- Audit the current `main` code, runtime data, test fixtures, content loaders, language conditionals, Supabase schema/RPCs/RLS, migration ledger and production data dependencies.
- Inventory every English/Chinese structure and feature path: Dictionary, Lessons, Daily Learning, Quiz, Flashcards, Dashboard/Profile, translation switching, progress, allowances, history and account synchronisation.
- Identify hard-coded `en/zh` constraints, duplicated language-specific logic, implicit English assumptions, unstable IDs, schema drift and old data formats.
- Build compatibility and migration maps. Read-only inspect Live Supabase; do not mutate production.
- Deliver an audit report, dependency map, data counts and migration risks before architecture implementation.

**Exit:** all affected legacy structures and compatibility risks are identified; no undocumented production assumptions.

### Phase 1 — U3.0 shared architecture and legacy modernisation

- Implement the shared language registry, package/capability contract, versioned schemas, stable-ID strategy, translation registry and content-loading/validation interfaces.
- Refactor existing English and Simplified Chinese code and data into the new architecture. This is mandatory scope, not optional cleanup.
- Replace hard-coded two-language constraints with validated registered-language support where appropriate. Keep capability checks for features that genuinely differ by language.
- Preserve existing English/Chinese content, meanings, progress, Quiz/Flashcard history, saved words, preferences, collections, account ownership and allowance ledgers.
- Introduce backwards-compatible migrations only after disposable/local and staging migration tests. Use expand/migrate/verify/contract sequencing where necessary; preserve stable IDs and historical records.
- Update import/export and validators so new content can be added without rewriting shared engines.
- Ensure switching learning/support language refreshes all dependent content immediately and does not leak stale text or answers.

**Exit:** English and Chinese operate through the U3.0 architecture; legacy data is mapped and validated; existing features pass regression. No Malay feature should be built on top of unmodernised legacy assumptions.

### Phase 2 — Malay Dictionary

- Build the Malaysian Standard Malay lexical package and dictionary records, with headwords, contextual senses, POS, pronunciation where appropriate, examples, related terms and provenance.
- Support Malay spelling, affixes and morphology (including prefixes, suffixes, circumfixes and reduplication where relevant) through a Malay-specific search/processing adapter.
- Keep headword search semantics deliberate; do not accidentally search descriptions unless explicitly designed.
- Integrate support-language display and translations using the registry.
- Keep dictionary grid/search free and unlimited.

**Execution sequence:**
1. Freeze the Malay Dictionary authoring contract and content-provenance policy before adding records.
2. Build the Malay-owned data package and manifest in small, auditable batches. Use stable IDs independent of translations; keep lemmas/headwords separate from inflected search forms; model contextual senses independently; record Malaysian usage/register and part of speech.
3. Implement and test Malay-specific orthographic normalisation and conservative affix-aware search. Preserve the exact authored headword as the displayed/search identity; derived forms are search aliases only and must not become duplicate grid cards. Do not guess stems or strip affixes in ways that create false positives.
4. Add English and Simplified Chinese support-language fields only where the translation is authored and checked; register each translation against the Malay source revision with explicit workflow status. Do not mark machine-assisted or unreviewed text approved.
5. Run structural, duplicate, reference, morphology/search, sense/example, translation coverage, responsive and English/Chinese non-regression checks. Record automated checks separately from competent human linguistic review.
6. Keep `ms` registered as planned/inactive and do not add it to selectable courses or production database language rows during Phase 2.

**Authoring and legal safeguards:**
- Use independently written definitions, examples and usage notes. DBP/PRPM and Kamus Dewan may be consulted as linguistic references, but their dictionary entries, definitions, example sentences, or other protected content must not be copied or scraped into the project without written permission/licensing. The DBP website states that reproduction of its content requires prior written permission: https://dbp.gov.my/hak-cipta/.
- Record item-level authorship/provenance, source consulted, access date, licence/permission where applicable, editorial status and reviewer. A reference consulted for verification is not a licence to reproduce its text.
- Follow Malaysian Standard Malay spelling, vocabulary, grammar and register; avoid Indonesian-only forms unless explicitly labelled as regional/contrastive.
- This phase adds lexical content and search logic only. It must not add learner telemetry, personal-data fields or external dictionary API calls.
- Continue the Malaysia PDPA / international privacy review before public activation. The Personal Data Protection (Amendment) Act 2024 has phased commencement dates in 2025; re-check current Commissioner guidance and the actual controller/processor, purpose and cross-border facts at launch. This planning note is not legal advice or compliance clearance.

**Implementation checkpoint:** structural, duplicate, morphology/search, sense/example, translation-registry coverage and existing-language regression checks pass. These automated checks are recorded separately from human review. The owner has directed that competent Malaysian Standard Malay editorial review and independent English/Simplified Chinese translation review occur during the Phase 3 staging review, not before Phase 3 implementation. The dictionary and translations remain explicitly draft/unreviewed until real review evidence is entered. Source/provenance and item-level rights questions remain open and must be resolved or quarantined before public activation. Malay stays unselectable outside the isolated development/staging environment.
### Phase 3 — Malay learning foundation and staging-preview gate

**Authorisation and review timing (owner decision, 2026-11-27):** Phase 3 implementation may proceed while the Malay Dictionary's human linguistic and independent translation review remains pending. Do not mark dictionary or translation records approved. The owner will conduct that review after a staging preview is ready. The 650-row worksheet remains the review tracker and is to be used during staging review. Source/provenance and rights clearance remain mandatory before public activation; unresolved items must be corrected or excluded.

- Build the independently authored Malay Lessons curriculum across Beginner, Intermediate and Advanced, with lesson reader, practice, answer feedback, objectives and independent progress.
- Integrate Malay into Daily Learning: Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision. Reuse the existing daily schedule, completion semantics and shared allowance categories; do not create per-language allowance buckets.
- Add Malay content to the shared learning catalogue/registry and integrate the selected support-language behaviour.
- Confirm the language-aware shared platform is functioning end-to-end for English, Simplified Chinese and Malay across Dictionary, Lessons and Daily Learning.
- Complete the internal implementation and regression suite before any owner preview handoff.

**Staging-preview rule:** **No staging preview is to be provided before Phase 3 is complete.** Once Phase 3 has passed internal verification, a staging preview may be prepared for owner review. The preview must accurately identify which later U3.0 phases are still unfinished; it must not be presented as the completed U3.0 release. No staging handoff is permitted merely because the app builds or the Dictionary/reader loads.

**Exit:** Phase 0–3 acceptance checks pass; preview uses isolated staging services and synthetic accounts; owner feedback is recorded. This gate does not cancel or replace Phases 4 onward.

### Phase 4 — Malay Quiz

- Author and validate a Malay Quiz bank across all three difficulty levels.
- Use language-appropriate prompts, distractors, explanations and accepted answers.
- Preserve secure server-side answer validation; never expose answer keys before submission.
- Integrate language-aware sessions, question reservation/no-repeat rules, progress, review and existing allowance behaviour.
- Verify selected support-language switching during setup, active sessions and review without stale or mixed-language content.

**Exit:** content, answer-key security, SQL/RPC, allowance, browser, translation and regression checks pass.

### Phase 5 — Malay Flashcards

- Author Malay Flashcards across appropriate vocabulary and useful expressions.
- Define recall modes that make linguistic sense for Malay; do not force English/Chinese-specific modes where unsuitable.
- Integrate setup, session snapshots, weak-memory/review, mastery, progress, support-language text and existing allowance enforcement.
- Preserve English/Chinese Flashcard data and historical sessions through the modernised shared schema.

**Exit:** all supported modes, content, persistence, review, allowance, language switching, responsive and account-isolation checks pass.

### Phase 6 — Cross-language translation integration and coverage closeout

- Complete the agreed English/Simplified Chinese/Malay translation-support matrix for all launch surfaces, based on actual content inventory.
- Audit UI strings, Dictionary senses, lesson reader/practice, Daily Learning, Quiz, Flashcards, feedback, review, Profile/Dashboard and errors.
- Resolve missing/stale translations or explicitly document intentionally unavailable/not-applicable cells.
- Add source-revision invalidation and review workflows; do not publish machine-assisted drafts as approved translations.
- Optionally seed a small Japanese/Korean background translation queue for stable, high-value material, without enabling those languages.

**Exit:** translation coverage report has no unexplained gaps; selected-language refresh and fallback tests pass.

### Phase 7 — Full U3.0 QA, release readiness and rollout

- Run full automated data/schema validation, PostgreSQL/Supabase migration and security tests, browser/integration tests, accessibility/reduced-motion tests, responsive tests and cross-version regression.
- Manually review linguistic/educational quality for Malay and sample/review migrated English and Chinese content. Report machine-assisted checks and human linguistic review separately.
- Test Google sign-in, sign-out, account switching, account-isolated saved words, cross-device sync, collections, preferences, course/support-language changes, progress, history deletion and shared allowances.
- Verify no regressions to Chinese pinyin/search/stroke order, English multi-sense dictionary, lessons, Quiz, Flashcards, Dashboard and Your Collections.
- Prepare release notes, data provenance/licensing notices, migration runbook, rollback/recovery notes and final consolidated deliverable only after the complete task/phase is validated.
- Inspect actual Live Supabase schema and migration history immediately before rollout. Obtain explicit owner approval. If migrations are required, test first and apply/verify approved Live migrations before merging dependent application code to `main`.
- Update root README on `main` with the actual shipped release status as part of the approved release workflow.

**Exit:** all required tests and legal/privacy/licensing checks are recorded; Live migration order is satisfied; owner approves merge and deployment; Cloudflare Pages production deployment is independently verified.

## 4. Allowances, progress and user data

- Preserve the established allowance amounts, plan semantics and local-timezone midnight reset unless separately approved.
- Keep permanent Lessons and Daily Learning usage shared across the relevant language courses; do not multiply allowances by enabling Malay.
- Preserve completion-only charging for Daily Learning and existing resume/review rules.
- Dictionary word-grid search remains free and unlimited.
- Preserve account ownership, RLS and deletion semantics. Do not add raw-answer telemetry or unnecessary personal data.
- Do not activate Premium payments, checkout or subscriptions in U3.0.

## 5. Content quality and authoring

- Malay content follows Malaysian Standard Malay, including Malaysian spelling, vocabulary, grammar terminology, register and natural local examples. Avoid silently mixing Indonesian vocabulary or conventions.
- Each language's curriculum is independently authored for its own grammar and learning progression. Translation supports comprehension; it does not dictate curriculum.
- Maintain stable IDs, context, learning objectives, terminology notes and provenance from authoring time.
- Structural validators detect missing fields, duplicate IDs, duplicate content, invalid references, inconsistent POS/senses, invalid distractors, answer-key mismatch, missing translations and stale revisions.
- Automated and machine-assisted checks are not equivalent to professional linguistic approval. Record native/competent human review and unresolved editorial limitations.

## 6. Legal, privacy, licensing and accessibility planning

Mandatory planning review for the release:
- Malaysia PDPA and 2024 amendment implications, controller/processor roles, purpose limitation, data minimisation, user rights, security, breach readiness and retention.
- International audience and cross-border processing, including actual Supabase production/staging regions and provider arrangements.
- Intended 16+ audience and jurisdiction-specific rules for younger users; do not infer a universal age threshold from the project target.
- Dictionary corpus, pronunciation, fonts, examples, lesson/Quiz/Flashcard content and translation-provider licensing/attribution/share-alike obligations.
- Translation service/provider terms and whether learner/user content is sent to external processors.
- Accessibility, keyboard/focus semantics, contrast, responsive behaviour and reduced-motion support.
- Premium is not being activated; if monetisation is later proposed, conduct a separate consumer, recurring-payment, tax, cancellation/refund and processor review.

This is a planning checklist, not legal advice, legal clearance or a compliance certification. Resolve applicable obligations with competent Malaysian counsel before broader public/commercial onboarding.

## 7. Development and release safeguards

- Production baseline remains U2.9.1 until a later release is approved and deployed.
- Keep application work on a focused feature branch created from current `main`; do not put internal planning documents on `main`.
- Keep MDR, dated archive and plan documents on `docs/master-development-record`.
- Cloudflare Pages is the sole active build/deployment platform. Cloudflare Workers Builds is retired and must not be treated as active.
- Use website-created prompts/dropdowns, not browser-native product dialogs. Maintain established dark background/dark-blue panel language, appropriate shadows, transitions, colour-coded grouping, responsive layouts and reduced-motion behaviour.
- Run small sequential data-analysis batches. Do not provide intermediate ZIPs; create one consolidated deliverable only after the full task/phase is complete and validated.
- Do not claim tests, preview deployments, migrations or production changes that have not actually been verified.
- No production migration, destructive operation, merge or deployment without explicit owner approval.
- Update root README whenever a release-affecting change is merged to production `main`, and ensure its version/status reflects the actual shipped state.

## 8. Roadmap boundaries

| Release | Scope |
|---|---|
| **U3.0.0** | Multilingual architecture modernisation + Malaysian Standard Malay Dictionary, Lessons, Daily Learning, Quiz and Flashcards |
| **U3.1** | Fill-in-the-Blank typing questions in Lessons and Quiz across English, Simplified Chinese and Malay; one missing word per question initially |
| **U3.2** | Games page and Wordmine; Flashcards becomes a game within Games; shared Games allowance |
| **U4.0** | Japanese language expansion |
| **U5.0** | Korean language expansion |

**Final plan status:** U3.0 scope and phase sequence are finalised. This document does not claim that implementation has begun or that any phase is complete. Start with Phase 0 audit on a focused feature branch from current `main`.


## Phase 0 audit status

Phase 0 read-only audit is complete. The findings, production/staging schema differences, en/zh restrictions, content inventory and provenance/legal risks are recorded in [the Phase 0 Audit Report](UPDATE-3.0-PHASE-0-AUDIT.md). The next step is Phase 1 on `feature/update-3.0-phase-0-audit`. No code or database changes were made during the audit.


## Phase 1 implementation status — 2026-11-26

Phase 1 has started on `feature/update-3.0-phase-0-audit`. The initial architecture foundation is committed:
- `js/core/language-registry.js`: registered language metadata, active/planned state, capability declarations, and language lookup.
- `js/core/content-contracts.js`: versioned stable-identity, dictionary-entry, translation workflow, and language-package structural validators.
- `tests/multilingual-architecture.test.cjs`: initial Node test coverage for activation boundaries, capability separation, stable IDs, translation review requirements, and package consistency.
- `docs/U3.0-MULTILINGUAL-ARCHITECTURE.md`: architecture and migration contract.

**Historical foundation checkpoint:** at this point the modules were not yet wired into the application and the test suite had not been executed. This status was superseded by the later Phase 1 integration and final validation checkpoints below. No Supabase schema/data, Auth configuration, production deployment, merge or main-branch change was made at that earlier checkpoint.

**Historical next-step list:** the items above were completed or validated in the later Phase 1 integration work. See the final validation checkpoint below for the completed evidence and the remaining database migration boundary.


## Phase 1 implementation checkpoint — 2026-11-26

The feature branch now contains the shared language registry, language adapters, content-package registry, versioned content contracts, translation registry, legacy bootstrap, English/Chinese package manifests and extracted Dictionary/Lessons source files. The main application loads these modules in dependency order. Dictionary and Lessons read through compatibility-wrapped packages; Daily Learning uses explicit per-language package resolution; Flashcards requires a registered language adapter and does not silently fall back to English for an unsupported course. Saved-word handling, Collections and anonymous account deletion use the language registry. Quiz validators share generic language-pair and question-envelope validation while retaining their pair-specific curriculum and answer rules.

Validation evidence:
- 22 core Node architecture/integration tests passed in the local run.
- Application script dependency order and en/zh active + ms planned manifest states checked against the feature branch.
- Dictionary source inventory checked: English 810 baseline + 506 expansion = 1,316 unique word/POS records; Chinese 206 baseline + 519 expansion = 725 unique character records.
- Lesson inventory checked: English 17 base + 3 expansion = 20; Chinese 17 with 112 practice questions.
- Chinese Daily Learning checked: 6 topics, 7 applications, 93 discovery items.
- Chinese Flashcards checked: 519 character, 904 vocabulary and 24 expression cards; source remains draft.
- Shared question-envelope rules checked against 229 English-learning and 145 Chinese-learning Quiz draft records; no envelope errors found.
- Additional repository tests for bootstrap wiring and source parity have been added, but were not included in the 22-test local run.

**Historical status at this checkpoint:** Phase 1 was not signed off at the time of this integration checkpoint. This status was superseded by the final validation record dated 2026-11-26; see [Phase 1 validation completed](conversation-archive/2026-11-26-update-3-0-phase-1-validation-complete.md).


## Phase 1 regression and migration-compatibility checkpoint — 2026-11-26

**Historical status at this checkpoint:** Phase 1 was still blocked while the remaining regression and compatibility checks were being executed. This was superseded by the final validation record dated 2026-11-26.

Read-only review confirmed:
- 22 core tests passed in the earlier local run; seven current test files contain 25 cases, including later wiring/parity tests that were not included in that run. The current full suite was not executable in this review environment.
- Production and staging each contain 27 inspected tables with RLS enabled, but their migration histories (71 vs 63) and schema definitions differ.
- Five known table differences remain across `saved_words`, `languages`, `profiles`, `learning_activity_log` and `lesson_progress`.
- Function, policy, index and trigger definitions also differ. In particular, allowance enforcement, lesson-progress guards, collection ordering/broadcasting, timestamp/timezone triggers, and saved-word uniqueness must be reconciled explicitly.
- Production aggregate row counts and language distributions are recorded in [the Phase 1 regression and migration checkpoint archive](conversation-archive/2026-11-26-update-3-0-phase-1-regression-and-migration-compatibility.md). These are baselines, not migration-parity proof.
- No SQL, schema, data, Auth setting, RLS policy, function, trigger or index was changed.

### Historical Phase 1 exit-gate checklist

This checklist was active at the time of the earlier checkpoint. Its regression and compatibility requirements were subsequently satisfied or explicitly re-scoped in the final validation section below.

1. Run all 25 current architecture/wiring/translation/content-parity tests plus the relevant existing regression suites against the exact feature commit; fix and record failures.
2. Complete browser/device regression for English and Chinese Dictionary, Lessons, Daily Learning, Quiz, Flashcards, Dashboard/Profile, translation switching, saved words, Collections, sign-in/out, account switching, cross-device sync, progress/history, allowances, responsive layouts, keyboard/accessibility and reduced motion.
3. Reconcile production/staging migration differences across columns/defaults/checks/FKs, indexes, triggers, function bodies/signatures, grants and RLS policies. Do not replay migrations by name/count or blindly replace environment-specific objects.
4. Rehearse expand/migrate/verify/contract on a disposable/local database, then staging, with old-client compatibility, stable IDs, restartability and aggregate/reference parity checks.
5. Verify that saved words, collections/order, preferences, account ownership, lesson progress, practice history, Daily Learning history, Quiz/Flashcard snapshots and mastery/review history, and shared allowance ledgers remain unchanged through rehearsal.
6. Classify remaining explicit en/zh branches as intentional language-specific behaviour or refactor them to capability-driven logic.
7. Resolve or explicitly retain as non-approved the English/Chinese Quiz and Chinese Flashcard provenance/status discrepancies. Preserve legacy translation records as `legacy_unverified` until reviewed.

A Cloudflare Pages branch build succeeded for commit `65d3888`, but build success is not browser or database validation. A Workers Builds check failed; Workers Builds is retired and is not an active deployment path. No preview URL is to be handed to the owner before Phase 3 completion.

**Historical release gate at this checkpoint:** Phase 2 was blocked pending regression evidence. This was superseded by the final validation record below. The staging-preview, Live migration, merge and production-deployment safeguards remain unchanged. Phases 3–7 remain required after the Phase 3 preview gate.

## Phase 1 final validation — 2026-11-26

**Phase 1 complete — ready for Phase 2.**

The final validation checkpoint is recorded in [the completed Phase 1 validation archive](conversation-archive/2026-11-26-update-3-0-phase-1-validation-complete.md).

Successful GitHub Actions evidence:
- U3.0 architecture regression: 29/29 Node tests passed.
- U2.9.0 English Dictionary QA: legacy content validators passed; 29/29 Mock Quiz/Flashcards tests passed; 20/20 Chromium browser tests passed.
- Quiz database foundation and local Supabase integration: both jobs passed. Existing 2.3.x–2.9.0 migrations replayed in a disposable local environment; authenticated Quiz RPC/session tests, Flashcards/Preferences, Daily Learning, Chinese Dictionary and Supabase security-advisor checks passed.
- Additional browser results: 22 Quiz + 7 Flashcards/Preferences + 2 Daily Learning + 5 Chinese Dictionary tests passed.
- Total: 114 Node/Playwright test cases passed, plus SQL migration/integration assertions.

Production and staging read-only checks found zero duplicate identity keys and zero unknown language references across the audited saved-word, collection, progress, allowance, Quiz and Flashcard records in both environments. RLS was enabled on all 27 inspected tables in each environment; direct SELECT to private Quiz, Flashcard and allowance tables was denied to anon/authenticated, and protected RPCs were authenticated-only.

### Phase 2 readiness and database boundary

**Phase 2 may begin.** It is Malay Dictionary content authoring and requires no U3.0 Supabase schema migration or Malay activation. `ms` remains planned/inactive.

Production/staging drift remains recorded: 71 vs 63 migration records, five table-definition differences, two production-only helper functions, three production-only triggers, four production-only indexes and one meaningful `learning_plan_limits` RLS-policy difference. Seven common function raw hashes differed only because of comments/whitespace; normalised bodies matched. See the final archive for the exact inventory.

This drift does not block content-only Phase 2. It **must** be reconciled before any U3.0 database migration, Malay database registration/activation or release depending on new schema/RPC behaviour. Do not replay migrations by count/name or force production/staging parity by manual mutation.

No SQL was applied to production or staging. No merge to `main`, production deployment or staging-preview handoff occurred. No staging preview URL is to be provided before Phase 3 is complete. Cloudflare Pages remains the only active deployment platform; Workers Builds remains retired.

**Historical handoff:** Phase 0 complete; Phase 1 complete; Phase 2 ready but not started. This was superseded when the owner authorised Phase 2 on 2026-11-26. Current Phase 2 implementation status is recorded in the dated checkpoint at the end of this plan.

## Phase 2 implementation checkpoint — 2026-11-26

**Phase 2 is in progress.** Two sequential Malay Dictionary authoring batches have been added on `feature/update-3.0-phase-0-audit`:
- 54 unique headwords and 76 contextual senses.
- 152 per-sense support translations (English and Simplified Chinese), all explicitly marked `machine_assisted_draft`.
- Item-level provenance and editorial metadata; all entries remain draft with source verification, rights review and competent human linguistic review pending.
- Malay search uses the canonical headword and explicit, curated inflected forms; no blind stemming, description search or example search.
- Shared content-package adaptation preserves stable Malay IDs, morphology metadata and provenance and registers per-sense translation records. Same-language translation pairs are excluded.

The final U3.0 architecture/content workflow passed **39/39 Node tests** on application commit `0bba05d70dd8646a0d31f7bbe21bb143bb05a8f7`: [workflow run 45790689541](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45790689541). The legacy U2.9.0 English Dictionary QA workflow also passed on the same commit: all content validators, Mock Quiz/Flashcards regression tests and Chromium browser smoke tests succeeded ([workflow run 45790689624](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45790689624)). This includes the existing 29 architecture tests and 10 new Malay Dictionary tests.

This is an initial content and adapter checkpoint, not Phase 2 completion. The Malay package remains `planned`, is not loaded into the live course selector and is not activated. No Supabase schema/data/Auth/RLS changes or migrations, production merge/deployment, or staging-preview handoff occurred. Phase 1's production/staging schema drift remains a mandatory future database/activation gate. See [the Phase 2 initial-batches archive](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-initial-batches.md).


## Phase 2 vocabulary target update — 2026-11-26

The owner has expanded the Malay Dictionary scope to approximately **700 unique headwords**, with a practical target band of **650–750**. This is a coverage goal, not a requirement to fill the catalogue with low-value entries. Quality, distinct lexical identity, natural Malaysian Standard Malay usage, sense accuracy, examples, morphology and source/rights traceability take priority over count.

At the end of authoring batch 03, the package contains **123 unique headwords, 145 senses and 290 per-sense support-translation records** (English and Simplified Chinese). Approximately 527–627 further headwords are needed to enter the target band. The next content batches should be organised by balanced everyday and general-purpose domains, avoid duplicate lemmas and avoid treating predictable inflections as separate headwords. Every batch must pass structural, duplicate, alias-collision, package-adaptation and regression validation before the next batch is frozen.

Latest checkpoint: [Phase 2 batch 03 archive](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-03.md).


## Phase 2 implementation checkpoint — batch 08 (final content, 2026-11-26)

Batch 08 adds **204 new unique headwords**, taking the Malay Dictionary to **650 unique headwords, 672 senses and 1,344 en/zh per-sense draft translation records**. Package revision: u3-ms-dict-0.8.0. An initial draft count exposed 23 duplicate headwords; these were removed and replaced with 23 distinct, useful terms. Redundant aliases colliding with separate headwords were removed. The final content has reached the lower boundary of the 650–750 catalogue target. Final-head validation passed on application commit c02cf9f2841f872bd1a68fe10fb24a5732fff522: U3.0 architecture regression **39/39** ([run 45837848040](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837848040)) and English Dictionary QA ([run 45837847935](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45837847935)). The final regression confirms 650 unique Malay headwords, 672 senses, 1,344 en/zh translation records, consistent u3-ms-dict-0.8.0 versioning, no duplicate headwords or search-alias collisions, shared Dictionary contract compliance, and that Malay remains inactive/unselectable.

**Archive:** [Batch 08](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-08.md).


## Phase 2 closeout checkpoint — post-Batch 08 (2026-11-26)

The eight lexical batches have reached the owner's requested catalogue range. The next work is **Phase 2 validation and closeout**, not Phase 3 feature implementation yet:

1. Re-run the Malay adapter and search contract checks against the final 650-headword package: Unicode normalisation, canonical headword matching, explicit valid aliases, no definition/example search, no false-positive stemming, no alias/headword collisions and no duplicate grid cards.
2. Verify every entry/sense has stable IDs, required schema fields, Malaysian POS/locale metadata, natural contextual examples and item-level provenance. Check the manifest/package revision (`u3-ms-dict-0.8.0`) and all content counts.
3. Audit all 1,344 English/Simplified Chinese support records against their Malay source sense IDs and source revisions. They remain `machine_assisted_draft`; no translation may be marked reviewed/approved without independent human review.
4. Produce a human-review queue covering all 650 Malay entries and 672 senses, all support translations, specialist medical/technical/administrative/environmental terms, uncertain sources and any incomplete rights metadata. Automated checks must be reported separately from human editorial and legal review.
5. Confirm English/Chinese dictionary non-regression and inactive-language gating. Keep `ms` planned/inactive; do not change Supabase, staging, production `main`, deployment or public course selection.
6. Record results and unresolved blockers in the MDR and a Phase 2 closeout archive. Phase 2 exit requires the agreed validation evidence and an honest account of outstanding human-review/legal prerequisites; public activation remains a later release gate.

**Next implementation phase after Phase 2 closeout:** Phase 3 — Malay Lessons (Beginner, Intermediate, Advanced) and all four Daily Learning activities, with independent Malay curriculum, shared allowance semantics and support-language integration. The staging-preview gate remains closed until all Phase 3 internal acceptance checks pass. Phases 4–7 remain mandatory afterward.


## Phase 2 closeout — automated validation checkpoint (2026-11-26)

The final Batch 08 application head was extended with two additional closeout tests on commit `1d0ac17d5166e32ab59c9d29b0a35afeecdacf3c` on `feature/update-3.0-phase-0-audit`. The tests assert learner-facing metadata and per-sense coverage across the full Malay package, explicit draft/provenance/rights states, and exact translation-registry mapping for every sense to one `ms→en` and one `ms→zh` record (1,344 unique records total, revision/status/provenance populated). The U3.0 architecture, adapter, translation and content-parity workflow passed on this commit: [workflow 45849090462](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45849090462). The English dictionary QA workflow also passed on the same head: [workflow 45849090452](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45849090452).

This is an automated validation checkpoint only. It does **not** constitute competent Malaysian Standard Malay editorial review, independent translation review, source verification, item-level rights clearance or responsive/manual linguistic acceptance. All 650 headwords and 672 senses remain draft; all 1,344 translations remain machine-assisted drafts. Phase 2 is therefore still open for editorial/provenance closeout. Do not begin Phase 3 implementation or provide a staging preview until the Phase 2 exit evidence is complete. No database/schema/Auth/RLS/migration, language activation, staging handoff, main merge or production deployment was performed.


## Phase 2 editorial review preparation — 2026-11-27

The owner directed work to proceed after the Batch 08 checkpoint. Phase 2 remains open because human Malaysian Standard Malay editorial review, independent English/Simplified Chinese translation review, source verification and item-level rights clearance cannot be claimed by automated checks. To make that review actionable, a 650-row headword worksheet was generated from the current `data/languages/malay-dictionary.js` package, using stable entry IDs and the canonical headwords. The inventory was checked for 650 unique entry IDs and 650 unique normalized headwords before export. The worksheet tracks Malay spelling/POS/definitions/examples/search morphology, both support-language reviews, source verification, rights clearance, specialist review, reviewer identity, date, decision and notes.

**Worksheet:** [Malay Dictionary editorial review CSV](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/review/malay-dictionary-editorial-review-worksheet.csv).  
**Instructions:** [Malay Dictionary editorial review guide](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/review/README.md).

The worksheet is a human-review tracker, not a quality certificate. Each of the 672 senses and its 1,344 translation records must be inspected under its parent entry before that entry can be marked reviewed. Empty `sourcesConsulted` metadata and pending rights status must be resolved or explicitly quarantined; a source consulted for verification does not grant reuse rights. Reviewer IDs/dates/approval states must only be filled by actual reviewers.

**Phase status:** 2A–2B authoring target reached; 2C–2E automated checks recorded; 2F human/editorial/provenance closeout still pending. Phase 3 implementation remains gated. No Malay activation, Supabase changes, staging preview, main merge or production deployment.





## Phase 3 final daily-content expansion — Batch 03 (2026-11-27)

The owner set a final target of **60 Daily Topics and 60 Daily Applications**, after which the catalogue may be expanded in future updates rather than delaying U3.0. Batch 03 adds exactly **30 Topics and 30 Applications**, with 10 new records per difficulty in each category. Final inventory: **60 Topics, 60 Applications, 93 Discovery entries** (213 fixed Daily Learning records), plus adaptive Daily Revision. The 72 permanent Malay Lessons remain unchanged.

The new topics cover family and home life, meals, directions, pets, weather, clothing, school equipment, hygiene, shopping, time, affixes, compound sentences, prepositions, classifiers, intensifiers, reading comprehension, discourse markers, notices, proverbs, cohesion, argumentation, figurative language, source credibility, audience/register, inference, paraphrasing, summarisation, data analysis and policy evaluation. Each new Application has a four-option question with Malay, English and Simplified Chinese prompt/option text and a linked topic identity.

Daily content version is `u3-ms-daily-0.4.0`. Updated tests now assert exactly 60 Topics and 60 Applications, 20 at each difficulty, unique IDs, multilingual question/option structure, valid answer indices and topic links.

**Runtime/package validation:** 650 dictionary entries, 72 Lessons, 60 Topics, 60 Applications and 93 Discovery entries loaded successfully; both daily categories have 20/20/20 difficulty balance; all 30 new application records have valid topic references and multilingual four-option questions; the shared package returned active with 1,344 dictionary translation records. No structural errors were found. This was an isolated JavaScript runtime and package integration check; a full GitHub Actions run and browser/device acceptance have not yet been completed for this final commit.

**Phase 3 status:** content authoring and feature-branch implementation are complete. The formal staging-preview gate is not yet cleared. Read-only inspection of the dedicated Supabase staging project confirms the current database still registers only `en` and `zh`; the learning-content catalogue has no `ms` records; lesson progress, practice results, practice attempts, catalogue language checks and lesson RPC guards still reject `ms`. The `saved_words.course` check also remains `en/zh` only. A staging-only additive migration must be designed, reviewed and explicitly approved before it is applied. Browser/device checks and a full CI run must also pass. Production remains untouched. Human Malaysian Standard Malay and independent translation review remain scheduled for the owner's staging review; provenance and item-level rights clearance remain required before public activation.

**Formal Phase 3 handoff status:** The owner-requested content target is complete and the feature-branch runtime/package checks pass. Do not claim the staging preview itself is ready to open until the dedicated staging database migration has been separately approved/applied and browser/device plus full CI acceptance pass. The staging migration is not authorised by the content-completion request alone; production remains untouched.

## Phase 3 implementation start — 2026-11-27

The owner explicitly directed that human Malaysian Standard Malay linguistic review and independent English/Simplified Chinese translation review are to take place during staging review, not as a prerequisite to Phase 3 implementation. Phase 3 is therefore authorised and in progress. The 650-row worksheet and review guide remain pending trackers; no human approval is implied. Keep all Malay content visibly draft in the development/staging environment, and do not activate it in production or represent it as approved.

Phase 3 implementation scope remains the independently authored Malay Lessons curriculum (Beginner, Intermediate and Advanced) and all four Daily Learning categories (Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision). Reuse the existing shared allowance categories, local-timezone reset and completion semantics. No per-language quota buckets, payment/entitlement changes or Fill-in-the-Blank questions are included. The staging preview may be handed to the owner only after all Phase 3 internal implementation and regression checks pass. The preview must explicitly invite review of the Malay Dictionary, its translations and new learning content. No production database, Auth/RLS, main merge or deployment changes are authorised by this checkpoint.


## Phase 3 initial implementation checkpoint — 2026-11-27

Phase 3 implementation has started on `feature/update-3.0-phase-0-audit`.

Initial content and integration batch:
- 9 Malay permanent lessons: 3 Beginner, 3 Intermediate and 3 Advanced, each with stable IDs, explanations, points, examples, common mistakes and three four-option practice questions. Malay is the primary text; English and Simplified Chinese support strings are included. Content and support translations remain draft.
- 3 Daily Topic activities and 3 Daily Application activities.
- 93-item Daily Discovery rotation derived from the existing Malay Dictionary draft inventory and connected to the shared deterministic scheduler.
- Daily Revision uses the existing adaptive topic-priority logic with Malay application topics.
- Malay is active only in the feature-branch registry/manifest for Dictionary, Lessons and Daily Learning. Quiz and Flashcards remain unavailable and are explicitly guarded in the UI.
- Lesson and Daily Learning support text refreshes when the selected translation language changes. The shared allowance categories and timezone reset are reused; no Malay-only quota was added.

Automated evidence: U3.0 architecture/adapter/content regression passed **45/45 tests** on commit `ac5d8d0e2b694004686b5f4c18d9a72447dc47ee` ([workflow 45931107403](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45931107403)). U2.9.0 English dictionary QA passed after the application wiring was added ([workflow 45931053784](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45931053784)). These checks do not constitute browser/device acceptance or human review.

**Database blocker:** existing U2.7/U2.8 SQL contains `en`/`zh`-only lesson progress/result constraints, lesson insert/completion guards and an approved-content catalogue. The nine Malay lesson identities are not seeded in that catalogue. Daily session language registry compatibility also requires environment-specific verification. The detailed assessment is [U3.0 Phase 3 Database Impact](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/U3.0-PHASE-3-DATABASE-IMPACT.md). No migration was added to the active migration directory or applied to staging/production. A separate owner approval is required before any staging database migration.

**Phase 3 remains in progress.** Remaining work includes expanding the lesson and daily content bank, completing integration and browser/device tests, designing and reviewing a safe staging-only content release/migration path, and validating existing-language progress/allowance regressions. No staging preview, production activation, main merge or deployment has occurred.


## Phase 3 Malay Lessons expansion — Batch 02 (2026-11-27)

Added 9 further original draft lessons in `data/malay-lessons-expansion-02.js`, bringing the permanent Malay curriculum to **18 lessons (6 Beginner, 6 Intermediate, 6 Advanced)**.

New Beginner topics: daily routines; telling time and days; polite food ordering.  
New Intermediate topics: ongoing/completed/future aspect markers; prepositions for location, direction and recipients; conjunctions and logical relationships.  
New Advanced topics: active/passive constructions (including first/second-person passive patterns); discourse cohesion and reference; reasoned arguments, evidence, and fact/opinion distinctions.

The expansion is loaded after the base Malay lesson file and before the shared content bootstrap. The manifest and automated content tests now reflect 18 lessons. All lesson content and English/Simplified Chinese support strings remain draft; owner review is planned during staging review.

Automated U3.0 architecture/adapter/content regression passed **45/45 tests** on commit `9ee2d59b77e1ac9ded2e4ffa205ee9bbfdb79ac3` ([workflow 45932215643](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45932215643)). This is structural/content-contract validation, not human language review or browser/device acceptance.

Phase 3 remains in progress. No staging preview, database migration, production activation, main merge or deployment has occurred.


## Phase 3 Malay Lessons expansion — Batch 03 (2026-11-27)

Added a further 9 original draft lessons in `data/malay-lessons-expansion-03.js`. The permanent Malay Lessons catalogue now contains **27 lessons**, balanced as 9 Beginner, 9 Intermediate and 9 Advanced.

New Beginner topics: family relationships and possessive phrases; places and giving directions; shopping, prices and quantities.  
New Intermediate topics: adjective comparisons; intensifiers; compound and complex sentences.  
New Advanced topics: sentence-structure variation; paraphrasing and summarising without changing meaning; critical reading and source reliability.

The new batch is loaded before the shared content bootstrap. Manifest and automated assertions now record 27 unique lesson IDs and 9 lessons at each level. Content and English/Simplified Chinese support remain draft for staging review.

U3.0 architecture/adapter/content regression passed **45/45 tests** on commit `8fc2695e2147fd99e58cfcdd9fef5fde49c03fea` ([workflow 45932623195](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45932623195)). This validates syntax, package wiring and structural contracts only, not human language quality or browser/device acceptance.

Phase 3 remains in progress. No staging preview, database migration, production activation, main merge or deployment has occurred.


## Phase 3 Malay Lessons expansion — Batch 04 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-04.js`, bringing the permanent Malay Lessons catalogue to **36 lessons: 12 Beginner, 12 Intermediate and 12 Advanced**.

New Beginner topics: weather and clothing; transport and travel; health-related language and appointments. New Intermediate topics: direct and reported speech; modal expressions for ability, permission, intention and obligation; relative clauses using “yang”. New Advanced topics: register and audience; systematic editing and error correction; proposal and persuasive writing.

The batch is loaded after expansion batch 03 and before the shared content bootstrap. The manifest now records `u3-ms-lessons-0.4.0`; structural tests assert 36 unique lessons and 12 at each difficulty, and the workflow syntax-checks the new file. All content and EN/ZH support remain draft for staging review. Automated validation is pending for this commit.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.


## Phase 3 Malay Lessons expansion — Batch 05 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-05.js`, bringing the permanent Malay Lessons catalogue to **45 lessons: 15 Beginner, 15 Intermediate and 15 Advanced**.

New Beginner topics: home and household items; school and learning; feelings and simple opinions. New Intermediate topics: conditional sentences; classifiers and quantifiers; cause-and-effect relationships. New Advanced topics: data and statistical language; policy language and formal correspondence; ethical and inclusive language.

The batch is loaded after expansion batch 04 and before the shared content bootstrap. The manifest now records `u3-ms-lessons-0.5.0`; structural tests assert 45 unique lessons and 15 at each difficulty, and the workflow syntax-checks the new file. Automated validation is pending for this batch. All content and EN/ZH support remain draft for staging review.

No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.


## Phase 3 current status update — 2026-11-27 (after Lessons Batch 05)

The application branch `feature/update-3.0-phase-0-audit` is currently at `a60ff7a24d630c38a1af38ff6fb844535cef3f47` (commit: “Integrate Malay Lessons expansion batch 05”). The documentation branch is `docs/master-development-record`; the application and documentation branches remain separate.

### Permanent Malay Lessons inventory

The current permanent Malay Lessons catalogue contains **45 lessons**, evenly distributed:

| Difficulty | Lessons |
|---|---:|
| Beginner | 15 |
| Intermediate | 15 |
| Advanced | 15 |
| **Total** | **45** |

The latest completed authoring batches are:
- Batch 01: initial 9-lesson foundation (3 per level).
- Batch 02: 9 lessons; 18 total.
- Batch 03: 9 lessons; 27 total.
- Batch 04: 9 lessons; 36 total.
- Batch 05: 9 lessons; 45 total.

Batch 05 topics cover home and household items, school and learning, feelings and simple opinions (Beginner); conditional sentences, classifiers and quantifiers, cause-and-effect relationships (Intermediate); data and statistical language, policy and formal correspondence, and ethical and inclusive language (Advanced). Each lesson follows the established content contract: multilingual topic/title/summary support, explanations, learning points, an example, a common-mistake note and three four-option practice questions.

### Validation status and next authoring work

Batch 05 is integrated in `data/malay-lessons-expansion-05.js`, with manifest revision `u3-ms-lessons-0.5.0`. Its archive explicitly records automated validation as pending. Do not carry forward the earlier 45/45 test result as evidence for Batch 05; rerun the current workflow against the current application head and record the actual result.

Continue the permanent lesson catalogue in balanced batches of nine (three per difficulty), preserving stable IDs and the existing schema. Avoid near-duplicate objectives, examples and question stems across lessons. Strengthen or add automated checks for unique lesson IDs, per-level counts, required multilingual fields, three questions per lesson, four options per question, valid answer indexes, repeated question stems and answer-position distribution. Automated checks are structural safeguards, not linguistic approval.

The next work sequence is:
1. Validate the current Batch 05 integration on the latest application branch head.
2. Continue authoring Batch 06 with three distinct Beginner, three Intermediate and three Advanced lessons.
3. Integrate the batch, update the manifest/content version and run the full U3.0 and relevant legacy regression workflows.
4. Update the MDR and dated archive with the exact commit, test run, lesson counts and any limitations.
5. Continue Daily Learning content and complete browser/device, progress, allowance, translation-switching and existing-language regression before Phase 3 exit.

### Unchanged boundaries

- All 45 lessons and their English/Simplified Chinese support strings remain draft pending staging review.
- The 650-entry Malay Dictionary and its 672 senses/1,344 support translations remain draft; human review, source verification and item-level rights clearance are not complete.
- Malay remains inactive in production. Do not register/activate it in production or apply database migrations without a separately reviewed migration plan and explicit owner approval.
- No staging preview until Phase 3 implementation and internal verification are complete.
- No merge to `main`, production deployment, payment/entitlement changes or public activation is authorised by this content checkpoint.
- Continue the Malaysia and general international legal/privacy/licensing review for the new learning content and any later public activation. This plan is not legal advice or legal clearance.


## Phase 3 Malay Lessons expansion — Batch 06 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-06.js`, bringing the permanent Malay Lessons catalogue to **54 lessons: 18 Beginner, 18 Intermediate and 18 Advanced**.

New Beginner topics: food and drinks; daily activities; weather and natural conditions. New Intermediate topics: pronouns and reference; derived nouns and verbs; paragraph development. New Advanced topics: meaning nuance and authorial stance; comparing and synthesising sources; systematic editing and final proofreading.

The new file is loaded after expansion batch 05. The manifest is now `u3-ms-lessons-0.6.0`; the Phase 3 content test loads all six source files and asserts 54 unique lesson IDs, 18 lessons per difficulty, 54 package lesson records and 45 expansion additions beyond the original nine-lesson foundation. The first two automated runs exposed test-fixture omissions (the batch-06 file was not loaded) and then a stale package-count assertion; both were corrected. The latest U3.0 architecture/adapter/translation/content-parity workflow passed **45/45 tests** on commit `5eb2cde78c4b4c2b9532e11e80df7191b2b47fbd` ([run 45936240420](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45936240420)). This is automated structural and integration validation, not human linguistic or translation approval and not browser/device acceptance.

All 54 lessons and EN/ZH support strings remain draft for staging review. No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.


## Phase 3 Malay Lessons expansion — Batch 07 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-07.js`, bringing the permanent Malay Lessons catalogue to **63 lessons: 21 Beginner, 21 Intermediate and 21 Advanced**.

New Beginner topics: places in the community; hobbies and free time; asking for and offering help. New Intermediate topics: word order and emphasis; idioms and fixed expressions; cause, concession and contrast. New Advanced topics: counterarguments and rebuttals; ethical use of quotations; ambiguity and linguistic precision.

The batch is loaded after expansion batch 06. Content version is `u3-ms-lessons-0.7.0`. The Phase 3 test fixture now loads all seven lesson source files and asserts 21 lessons per level, 63 unique lesson IDs and 63 shared-package lesson records.

The final integration workflow is pending at [U3.0 architecture regression run 45936478798](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45936478798); the earlier 45/45 run on the content-only commit preceded the final loader/test-fixture changes and is not sufficient to sign off Batch 07. The final English Dictionary QA workflow is also running on the final integration head. Update this checkpoint with actual results before treating Batch 07 as validated.

All 63 lessons and EN/ZH support strings remain draft for staging review. No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.


## Phase 3 Malay Lessons expansion — Batch 08 (2026-11-27)

Added 9 original draft lessons in `data/malay-lessons-expansion-08.js`, bringing the permanent Malay Lessons catalogue to **72 lessons: 24 Beginner, 24 Intermediate and 24 Advanced**.

New Beginner topics: transport and directions; shopping and prices; time and daily routines. New Intermediate topics: active and passive sentences; compound sentences and clause relationships; formal letters and emails. New Advanced topics: evaluating source credibility; adapting register and genre; coherent argument structure.

The batch is loaded after expansion batch 07. Content version is `u3-ms-lessons-0.8.0`. The Phase 3 test fixture now loads all eight lesson source files and asserts 24 lessons per level, 72 unique lesson IDs and 72 shared-package lesson records.

The Malay Daily Learning content inventory is currently **99 authored records**: 3 Daily Topics, 3 Daily Applications and 93 Daily Discovery entries. Daily Revision is adaptive and generated from learner progress/weak areas rather than stored as a fixed catalogue; it is not included in the 99. Batch 08 adds permanent Lessons only and does not change the Daily Learning inventory.

The final loader/test integration workflow passed **45/45 tests** at [U3.0 architecture regression run 45937654497](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45937654497) on commit `b844cc58838baaebb13217ddd41cc23707e0f2b0`. This includes the final loader and test changes. Automated success does not certify human linguistic/translation approval or browser/device acceptance.

All 72 lessons and EN/ZH support strings remain draft for staging review. No staging preview, database migration, production activation, main merge or deployment has occurred. Phase 3 remains in progress.


## Phase 3 daily-content rebalance — Batch 01 (2026-11-27)

The owner directed that Daily Topic and Daily Application receive substantially more attention because these are recurring daily activities. The initial inventory target is **30 Topics and 30 Applications**, with 10 per difficulty in each category. Daily Discovery remains a mixed, expanding pool; Daily Revision remains adaptive and is not counted as a fixed catalogue. Permanent Lessons continue in parallel but at a more measured pace.

Batch 01 adds nine distinct Daily Topics (three per difficulty) and ten Daily Applications (four Beginner, four Intermediate and two Advanced):
- Daily Topic: family relationships; home spaces; food and mealtimes; time and duration; meN- prefix changes; active/passive voice; prepositions; paragraph unity/cohesion; argument/evidence/inference.
- Daily Application: describe home locations; arrange a daily schedule; order food; give directions; correct affix usage; summarise a notice; compare viewpoints; write a formal email; evaluate source reliability; review argument strength.

Current inventory after Batch 01: **12 Topics, 13 Applications, 93 Discovery entries** (118 fixed records total). Daily Revision remains adaptive and excluded. The nine-per-category expansion is draft content with Malay, English and Simplified Chinese fields; translations and Malay editorial review remain pending staging review. Automated structural checks are being run; no staging preview, merge, deployment, or database change is authorised. Original educational drafting only; no DBP/PRPM text or protected source wording intentionally copied. Item-level provenance, rights review, Malaysia PDPA/international privacy review remain release gates.



## 2026-11-27 — Phase 3 staging database update

The owner approved applying the Malay-only migration and seed to the dedicated SwiftDictionary Indie Staging project (`ivatvkfrtifgfheeaelj`). The changes were applied to staging only; production was not touched.

- Active language registry: `ms`.
- Staging catalogue: 285 unique active rows — 72 permanent lessons, 60 Daily Topics, 60 Daily Applications and 93 Daily Discovery entries.
- Daily Topic and Daily Application balance verified at 20 per difficulty; Discovery rotation verified at 1–93.
- All Daily Applications now match an active Malay Topic identity.
- Existing English/Chinese data and user-owned progress counts remained unchanged.
- Lesson start, completion and replay functions now validate against the active language registry and retain their ownership, approved-catalogue, locking and aggregate-result safeguards.
- No Quiz/Flashcard schema or content was changed by Phase 3.
- Draft PR [#20](https://github.com/WhiteWingCat/swiftdictionary/pull/20) was opened solely for a staging preview handoff and is explicitly **not to be merged**.
- U3.0 architecture/content regression passed; Cloudflare build-routing guard passed. The full database integration workflow is still running.
- The preview hostname and staging Google OAuth are not yet verified. Browser/device acceptance and owner linguistic/translation review remain outstanding.

Detailed operational record: [Phase 3 staging preview preparation](https://github.com/WhiteWingCat/swiftdictionary/blob/feature/update-3.0-phase-0-audit/docs/U3.0-PHASE-3-STAGING-PREVIEW-PREPARATION.md).


## 2026-11-27 — Phase 3 preview deployed

Cloudflare Pages confirmed a successful staging preview deployment for application commit `253ee8052a290676f6313e66f880ac543d924457`.

- **Stable branch preview:** https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev
- **Commit-specific preview:** https://fc13805c.swiftdictionary.pages.dev
- Draft handoff PR: [#20 — U3.0 Phase 3 staging preview only](https://github.com/WhiteWingCat/swiftdictionary/pull/20). Keep draft; do not merge.
- U3.0 architecture/content regression passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45943073178
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45943073157
- The broader U2.3, U2.5, U2.6, U2.7, U2.9 and Quiz database foundation regression workflows are still running. Several older U2.x static checks needed updates to read the U3.0 language-owned package structure; their final outcomes are not yet known.
- Staging Google OAuth has not been verified/configured. Account sign-in and user-owned progress testing may not be available until the separate staging OAuth client and redirect allowlist are set up.
- Owner desktop/mobile browser acceptance and the planned Malaysian Standard Malay + English/Simplified Chinese translation review remain outstanding.

The staging database and 285 Malay catalogue records were applied and verified on the dedicated staging project only. Production remains untouched.


### Preview refresh — latest branch commit 376db5f

After the preview handoff documentation was refreshed, Cloudflare Pages also confirmed a successful deployment for latest application branch commit `376db5f0c495c281124335556b8633096d8902c9`.

- Stable branch preview: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev
- Latest commit preview: https://ec791600.swiftdictionary.pages.dev
- U3.0 architecture/content regression passed on this branch head: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45943196116
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45943196257
- Broader cross-version and browser regression workflows remain in progress; do not claim full CI acceptance yet.


## 2026-11-27 — Cross-course Malay Dictionary translation target and filters

The owner confirmed that Malay must be available as a translation target while studying either English or Simplified Chinese. The Malay course continues to use English and Simplified Chinese as its support-language targets. This is a Dictionary-content requirement: the target selector must not expose Malay until the corresponding Dictionary meanings have real Malay text, and the existing English/Chinese lesson, Quiz and Flashcard translation paths must not be misrepresented as Malay-supported.

Coverage inventory on the U3.0 feature branch:
- English Dictionary: **1,316 headwords and 1,931 senses**.
- Simplified Chinese Dictionary: **725 characters and 825 senses**.
- Translation work therefore covers up to **2,756 meaning-level records**, preserving separate contextual senses.

Implementation requirements:
- Author Malay translations from SwiftDictionary's existing original-authored English and Chinese Dictionary definitions; do not copy DBP/PRPM/Kamus Dewan entries or import unlicensed third-party dictionary text.
- Store headword-level and sense-level translations, including separate Malay wording for every existing sense.
- Mark new translations as machine-assisted drafts; do not claim linguistic approval. Human Malaysian Standard Malay and independent translation review remain part of the owner's staging review.
- Keep the selector hidden/disabled for a target/course combination until its coverage is complete; never silently substitute the source-language definition for a missing Malay translation.
- Preserve English and Chinese source text, examples, search, grid rules, saved words and account data.
- No new personal-data collection, analytics, processor or Supabase schema is required for this static Dictionary-content expansion. Existing Malaysia PDPA and international privacy release checks remain in force.

The Malay Dictionary filter addition reuses its existing category and part metadata. The UI groups the current topic vocabulary into readable Malay topic filters and provides separate word-class filters. Unknown existing categories remain reachable through “Lain-lain”; filtering must not remove any dictionary records or alter search semantics. Dictionary word-grid search remains free and unlimited.

Work stays on feature/update-3.0-phase-0-audit; documentation stays on docs/master-development-record. No main-branch merge, production deployment, production database change or staging database migration is authorised by this scope.


## 2026-11-27 — Malay translation selector, Dashboard, Collections and Daily History follow-up

**Owner's latest direction:** Malay must be selectable as the support/translation language when the learner is studying English or Simplified Chinese. When Malay is the learning language, Malay remains the native course language and English/Simplified Chinese remain available as support languages. This supersedes the earlier selector-hidden-until-complete presentation decision; incomplete individual meanings must show an explicit unavailable state rather than silently displaying the source-language text.

### Feature-branch implementation

Application branch: `feature/update-3.0-phase-0-audit`

- `1d17c2d4f24c8efe4d0cf9bec2058f7faa4c983a` — add Malay to the Dashboard Favorite Words view; resolve Dashboard and Collections saved-word opens through the registered language package; add Malay to the translation and Profile preference selectors; split Daily History into Lessons and Daily Learning groups with explicit activity labels and Malay title resolution; extend dictionary translation package mapping to include Malay target records; add a translation-registry integration test.
- `0c27d5daab9cc069b00de7c08c940c35696f0ff8` — clarify Malay in the Your Collections add-word picker.
- `8372a3c2e200df4e4a5a4451ef0a3b21524c2909` — include Malay target-language dictionary sense fields in the shared package/translation adapter.
- `ca6b084079ac05d8d7abe2068e2593e51c057dbc` — package integration test and the main frontend fix set present on the branch.
- `b70f617b48c46021d2e3f44c27b6bde75151f51d` — replace source-language fallbacks with explicit missing-translation messages for dictionary meanings when the requested support language is unavailable.

### Reported issues and implementation state

1. **Dashboard Favorite Words:** added a Bahasa Melayu group. Favourite entries now resolve using the registered language content package rather than an English/Chinese-only catalogue switch.
2. **Your Collections:** Malay saved-word cards now use the same package-backed dictionary lookup when clicked. The add-word picker explicitly includes Malay.
3. **Daily History:** Lessons and Daily Learning are shown as separate activity groups. Daily activity types are labelled as Daily Topic, Daily Application, Daily Discovery or Daily Revision rather than mechanically title-casing database identifiers. Malay lesson and daily content titles and course labels are resolved from the Malay content packages.

### Translation coverage remains an open gate

The selector and routing are present, but this does **not** mean the 2,756 Dictionary meaning-level translations are complete. The inventory remains 1,931 English senses plus 825 Simplified Chinese senses. The English and Chinese dictionary packages do not yet contain the complete Malay target corpus, and the Malay Dictionary's English/Chinese support fields cover only part of its records. The package adapter registers Malay translations when the underlying content record actually contains them. The UI now shows an explicit unavailable message for missing meanings; it must not be treated as translation coverage.

No translation may be marked reviewed/approved without a competent review record. The 650 Malay headwords and existing Malay English/Chinese draft translations remain subject to the staging review process. No dictionary source text from DBP/PRPM or other protected dictionaries may be copied into the project.

### Verification checkpoint

On commit `ca6b084079ac05d8d7abe2068e2593e51c057dbc`:
- U3.0 architecture/content regression passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45947048355
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45947048363
- English dictionary QA passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45947048387
- Chinese dictionary filter checks passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45947048426
- U2.6 ACL regression passed its static and disposable PostgreSQL 17 checks; the run was still completing its final status when recorded.
- U2.3 allowance/dashboard browser regression was still running, including its isolated signed-out Chromium checks.
- Some unrelated Flashcards/Quiz browser jobs were cancelled by workflow concurrency; their database/logic jobs completed successfully. These are not represented as full browser acceptance.

The last text-only missing-translation fallback change is commit `b70f617b48c46021d2e3f44c27b6bde75151f51d` and did not yet have a separate workflow run at this checkpoint.

### Preview and release gate

The existing branch preview alias is https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev and draft PR #20 remains open and unmerged: https://github.com/WhiteWingCat/swiftdictionary/pull/20. The alias was deployed earlier in Phase 3, but publication of the latest follow-up commit was not independently confirmed. Do not describe the current preview as verified against commit `b70f617` until the latest Cloudflare Pages deployment is confirmed.

Staging Google OAuth and desktop/mobile owner acceptance remain outstanding. The staging project remains `ivatvkfrtifgfheeaelj`; production remains untouched. The user requested a final staging handoff only after the remaining translation work and bug fixes are complete. Therefore this checkpoint is **implementation progress, not Phase 3 exit or final preview handoff**. No merge or production deployment is authorised.


### Follow-up browser regression and CI result — 2026-11-27

- Added Playwright coverage for adding a Malay saved word to a collection and opening it with the `ms` course code, plus checks that Dashboard Malay favourites and Malay translation preference options are present. Test file: `tests/browser/u2-9-0-favorite-collections.spec.js`.
- Test change commit: `718bcfbff4592a0efcc4efaa7234e3e3287c76d5`. No separate CI run for this newest commit was visible at the time of this record.
- The U2.3 allowance/dashboard workflow completed with a browser job failure: 86 passed, 22 skipped, 1 failed. The failing case was an existing Flashcards course-switch assertion in `tests/browser/update-2-5-0-flashcards.spec.js` (expected “Translation Recall”, received “Word Recall”); it is outside the three Malay fixes and was not changed in this scope. The PostgreSQL 17 migration/allowance job and local Supabase Auth compatibility job passed.
- The U2.6 ACL workflow completed successfully. U3.0 architecture, Cloudflare build-routing, English Dictionary QA and Chinese Dictionary filter checks also passed on the earlier `ca6b084` commit.
- No full acceptance claim is made. The newest Malay browser tests and latest branch head require a fresh CI run; the final Cloudflare Pages deployment of the newest branch head is also unconfirmed.


### Malaysia/general legal-risk check — Malay Dictionary translation pipeline (2026-11-27)

- **Source-text copyright:** Malaysia's Copyright Act 1987 (Act 332), section 8, expressly treats translations and adaptations of copyright-eligible works as derivative works. The translation input remains SwiftDictionary's original-authored English and Simplified Chinese Dictionary definitions. No DBP/PRPM/Kamus Dewan or other third-party dictionary entries are imported. Keep source attribution/provenance and do not replace project definitions with copied reference-dictionary text. Official MyIPO Act text: https://www.myipo.gov.my/wp-content/uploads/2025/09/Copyright-Act-1987-Act-332.pdf
- **Machine-translation model licensing:** the pipeline uses Argos Translate model packages (en→ms 1.9 and zh→en 1.9, then en→ms). The Argos package index repository is dual-licensed MIT/CC0, but that license applies to the index and should not be assumed to govern each model artifact. Argos maintainers have discussed inconsistent model-package license metadata; the en→ms model is listed among packages identified as CC-BY-4.0, while the exact zh→en artifact license/attribution still needs direct confirmation before public production release. Reference: https://github.com/argosopentech/argos-translate/issues/507 and https://github.com/argosopentech/argospm-index
- **Staging boundary:** generated Malay text is marked `machine_assisted_draft`, with reviewer unset. Staging review is permitted as a draft review step; do not represent the corpus as linguistically verified or approved. Before a public production release, verify both model artifact notices, include required attribution, and complete competent Malaysian Standard Malay review.
- **Privacy/security:** the translation workflow runs inference locally in GitHub Actions. Its inputs are the project's Dictionary definitions and manual translation overrides; no learner account data, saved words or personal learning history are part of the translation input. Model package downloads are external, but inference is local.

This legal check is planning guidance, not a legal opinion. No change to production hosting, production Supabase, authentication or user data is authorised by this translation phase.


## 2026-11-27 — Complete Malay Dictionary translation corpus and final preview readiness

### Translation generation — complete

Application branch: `feature/update-3.0-phase-0-audit`  
Generated translation commit: `df7e8e1efa78774fba917f5e6a8acaefee421b37`

The U3.0 offline Argos translation workflow completed successfully:
- English: **1,316 headwords / 1,931 meanings**, all translated to Malay.
- Simplified Chinese: **725 headwords / 825 meanings**, all translated to Malay.
- Total: **2,041 headwords and 2,756 meanings**, zero missing headwords and zero missing senses.
- 658 English meaning translations and 499 Chinese meaning translations were retained as authored/manual draft overrides; the remaining meanings were generated by the offline Argos pipeline.
- Generated output: 1,197,626 bytes.
- Engine: Argos Translate, en→ms 1.9 and zh→en 1.9 followed by en→ms 1.9.
- Output status remains `machine_assisted_draft`; reviewer is unset. This is complete machine-assisted coverage, not linguistic approval.

Successful generator workflow: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45953123750

The existing Malay Dictionary has 650 headwords and 672 meanings. Its English and Simplified Chinese support translations remain present for all 672 meanings, as asserted by the translation inventory regression.

### Latest implementation follow-ups

- `d27ea8f841ad8402f20b8fa621abf69d8fdc9a77` and the follow-up on the same feature branch: preserve the equivalent Flashcards recall mode when switching between English and Chinese courses. The initial patch was extended to the course-change event handler after the first browser run exposed that it reset the mode before render.
- `857b5378921f6c4b9592b5274b207dab3ebaf40e` and `c6ec324d2a15e5587dca59b2fa369df51fac44aa`: when opening a saved word from Dashboard/Collections, synchronise the learning-course selector, Profile preference selector and Malay support-language availability before opening the detail drawer. This prevents the Malay course from retaining Malay as its own support language.
- The earlier Dashboard Favorite Words, Your Collections and Daily History fixes remain in place; Malay collection browser coverage was added.

### Verification and workflow approval gate

The translation generation/validation workflow completed successfully, including exact source inventory export, full-coverage validation and commit/rebase to the feature branch.

The generated commit was authored by `github-actions[bot]`. Because PR #20 is open, GitHub marked the PR-triggered follow-up workflows as `action_required` and is waiting for repository-owner approval. These are **not failed tests and not successful tests**; they have not run on the generated commit. The owner must use GitHub's **Approve and run** action for the pending workflows before full regression acceptance can be claimed.

Pending owner-approved workflow runs on commit `df7e8e1efa78774fba917f5e6a8acaefee421b37`:
- U3.0 Phase 1 architecture regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012262
- U2.9 English Dictionary QA / Malay Dashboard & Collections browser tests: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012263
- U2.3 allowance and Dashboard browser regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012261
- U2.5 Flashcards regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012203
- Cloudflare build-routing guard: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012269
- U2.7 Chinese filter checks: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012095
- U2.6 ACL regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45954012094

Previously completed checks include U3.0 architecture and Cloudflare routing on earlier commits, English/Chinese dictionary checks, and U2.6 ACL tests. They do not substitute for approval and re-running on the generated head.

### Preview and remaining owner review

Branch preview alias: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev  
Draft PR #20: https://github.com/WhiteWingCat/swiftdictionary/pull/20  
Latest feature commit: `df7e8e1efa78774fba917f5e6a8acaefee421b37`

The feature branch uses the staging Supabase configuration for `.pages.dev` preview hosts; production host and production Supabase remain excluded. The Cloudflare branch preview alias was deployed earlier in Phase 3, but publication of the newly generated commit was not independently confirmed from Cloudflare's deployment service. Treat the alias as the staging preview endpoint and verify the current build/commit when opening it.

Staging Google OAuth has not been independently verified for this preview host. If sign-in is rejected, the staging Supabase Google provider's redirect allowlist must include the preview host before account-backed Dashboard and Collections acceptance can be completed.

**Release state:** dictionary translation coverage is complete as machine-assisted drafts; the three Malay UI bugs are implemented; final CI approval, latest preview publication confirmation, staging OAuth verification and owner desktop/mobile linguistic review remain open. Do not merge PR #20 or deploy production without separate approval.


## 2026-11-27 — Staging review corrections and Malay Quiz workstream

### Owner staging feedback

The owner tested the current Phase 3 staging preview and reported the following defects. These are now tracked as required U3.0 staging corrections:

1. **Malay Dictionary support-language selector:** when Malay is the learning course, Malay itself must not be offered as its own support language, but the Malay option must remain enabled when studying English or Simplified Chinese once the corresponding full Dictionary translation corpus is available. Malay-course support choices remain English and Simplified Chinese. Keep this course/target distinction explicit and test it independently from the Dictionary course selector.
2. **Daily Application answer option rendering:** some activities visibly render the literal placeholder `[option option]` instead of the actual answer choices. Audit every Malay Daily Application record against the shared Daily Learning renderer's option contract; normalise legacy string options and structured multilingual option objects through one safe adapter. Never expose a placeholder or stringify an object as learner-facing text. Add regression fixtures for both supported source shapes.
3. **Malay permanent Lesson history:** completions made in the Malay course must be discoverable in Daily History under the permanent Lessons group. Trace completion event creation, activity type/category filtering, language-code matching and lesson-title resolution. Preserve historical English/Chinese records and do not duplicate completions.
4. **Learning progress language label:** resolve registered language code `ms` to the display name “Malay” (and native name where appropriate), rather than exposing the raw code in Profile/progress summaries. Use the language registry for all registered language labels.
5. **Quiz navigation placeholder:** changing navigation while Malay is selected can show the stale “Chinese Quiz is coming soon” message even though Chinese Quiz is implemented. The Quiz unavailable state must be derived from the current course's registered capability and reset on every course/navigation render. It must never reuse a stale course-specific heading or hide an implemented language's Quiz.

### Malay Quiz — begin implementation within U3.0

Malay Quiz is now an active U3.0 workstream, reusing the existing shared Quiz engine, session lifecycle, secure server-side evaluation, history and allowance ledger. It is not a separate Quiz product or a Malay-only frontend.

**Product behaviour inherited from the approved Quiz specification:**
- Beginner / Intermediate / Advanced sessions contain 10 / 15 / 20 questions.
- Beginner draws only from Beginner content; Intermediate uses the approved Beginner/Intermediate mix; Advanced uses the approved Advanced/Intermediate/optional Beginner mix.
- Multiple choice only; no timer, countdown, pass/fail threshold or time pressure.
- Choices and question order are randomised once at session creation and remain stable on resume.
- Learners can navigate and change answers before submission; correct answers and explanations remain hidden until submission.
- Unfinished sessions persist; explicit abandonment consumes no allowance; only successful submission consumes a Quiz completion allowance.
- Results include score, percentage, per-question review and topic-level insights. Completed sessions are immutable and reviewable.
- Existing Free/Premium allowance policy, timezone reset, account isolation, and deletion semantics remain unchanged. Do not create Malay-specific allowance buckets or change entitlement limits as part of this work.

**Malay-specific content and translation behaviour:**
- Malay is the learning/answer language; English and Simplified Chinese are support/translation languages selected using the existing preference.
- Author an independent Malay Quiz question bank mapped to the 72 Malay permanent lessons and their objectives. Do not copy Lesson practice questions one-to-one.
- Each question and each answer choice must have complete Malay source text plus English and Simplified Chinese support text where the selector offers those languages. Keep content and translations explicitly draft until owner review.
- Validate four unique, meaningful options, exactly one correct option, lesson/objective/topic references, difficulty coverage and duplicate prompts/distractors. No placeholder option values are permitted.
- Keep correct-option identity and answer keys private/server-only. Do not put the answer key in a browser-readable question-bank file or expose it through a client API.
- Start with a small independently validated authoring batch, then expand in sequential batches; do not issue intermediate ZIPs.

**Required technical sequence:**
1. Fix and test the five staging defects against the existing shared architecture.
2. Audit current Quiz UI, question-bank schemas, private catalogue, language constraints, authenticated RPCs, allowance trigger, history deletion and existing en/zh browser/database tests.
3. Add `ms` to Quiz capability only when the complete Malay Quiz runtime and secure backend path are ready. Do not simply toggle the capability flag before the database accepts and validates Malay sessions.
4. Prepare additive staging-only database changes to permit `ms` in Quiz question/session snapshots and catalogue records, and update server-side RPC validation to require an active registered language and an approved Malay question bank. Preserve en/zh behavior, private answer-key isolation, ownership checks, least privilege and immutable snapshots.
5. Add the Malay curriculum map and draft question bank, validators, SQL import assertions and Playwright coverage for all three difficulties, both support languages, resume, answer randomisation, submission, review, abandonment and allowance accounting.
6. Apply any database migration only after a separate staging schema diff, SQL review and explicit owner approval. Production remains untouched.
7. Run U3.0 and cross-version regressions, verify Cloudflare preview commit and staging OAuth, then provide an updated staging preview for owner review. Keep PR #20 staging-only, draft and unmerged; no production merge/deployment is authorised.

### Legal, privacy and content review

The new Quiz content must be original SwiftDictionary-authored material. Do not copy DBP/PRPM/Kamus Dewan or third-party question banks, exercises, answer explanations or translations. Record authorship/provenance and translation status per item. Existing Quiz infrastructure stores account-bound answers, sessions, results and activity history; reuse these structures without adding unnecessary personal-data fields, telemetry or external processors. Extend the existing learning-history deletion path for Malay Quiz only if the schema introduces new Quiz records; never reset the allowance ledger through history deletion. Re-check Malaysia PDPA and international privacy/legal requirements before public activation. This is planning guidance, not legal advice.

**Current gate:** the Phase 3 staging corrections and Malay Quiz implementation are in progress. Staging data already contains the approved Phase 3 Malay lesson/daily catalogue only; no Malay Quiz database content or schema change is authorised/applied by this plan update. PR #20 remains draft and unmerged; production remains untouched.


## 2026-11-27 — Owner staging feedback fixes and Malay Quiz authoring batch 01

The owner reported five staging issues: Malay target-language selection was disabled for the Malay course; some Daily Application options rendered placeholders; completed Malay permanent lessons could not be opened from Daily History; Learning Progress showed the raw code `ms`; and the Quiz unavailable panel could retain misleading Chinese-specific “coming soon” wording. Feature-branch fixes have been committed: structured Malay options now render their Malay text and selected support translation; Malay lesson history review resolves the correct Malay difficulty catalogue; active language labels resolve through the shared language registry; the Malay selector no longer disables its own-language option solely on course equality; and Quiz unavailable copy is capability-derived and no longer hard-codes Chinese Quiz as coming soon. Static regression coverage was added. The Daily History row continues to require a completed record for the current local day and uses the completion timestamp; no history or progress data was rewritten.

Malay Quiz authoring has begun using the shared Quiz content model. The first draft batch contains 12 questions per support-language pair (Malay→English and Malay→Simplified Chinese), four per difficulty, plus an initial curriculum map and draft validator. All records remain unapproved drafts. The manifest retains `quiz:false` because 12 questions per difficulty pair do not meet the existing bank minimums and no Malay-specific secure server-side Quiz RPC or staging migration has been implemented. The next Quiz steps are to expand the bank, map the full Malay lesson curriculum, implement the language-aware private question/session path, prepare a staging-only migration, and test the complete session/allowance/history lifecycle. Do not expose Malay Quiz as playable until all gates pass.

The first CI validator run detected the draft batch's initial 5/4/3 difficulty imbalance. The authoring files were corrected to 4/4/4 and a fresh CI run is pending. This is not yet a passing validation checkpoint. The current preview must be refreshed and verified against the corrected feature-branch head before owner re-review. No staging Quiz schema/data change, production change, merge, or deployment has been authorised or applied. PR #20 remains staging-only, draft and unmerged. See [staging feedback and Malay Quiz batch 01](conversation-archive/2026-11-27-u3-staging-feedback-and-malay-quiz-batch-01.md).


### Follow-up implementation and CI checkpoint — 2026-11-27

Additional fixes made after the first CI review:
- The Malay target option is now permitted when the learning course is also Malay. The Profile save guard and translation-view refresh no longer force Malay back to English for `ms → ms`; only incomplete Dictionary translation coverage blocks it.
- Dictionary translation registry records targeting Malay now default to `machine_assisted_draft` when a generated record has no explicit item-level status, while manually authored Malay→English/Chinese records retain their existing draft status. This preserves the required machine-assisted provenance.
- Updated the existing selector regression to assert the new same-language behavior and replaced the static Quiz placeholder copy as well as the translated copy.

**U3.0 architecture/content regression passed** on application commit `6abd022e08a1d7a4079884e8de8dc0136f0e1530`, including the Malay Quiz validator and all 62 architecture/content tests. Run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957445422. Cloudflare build-routing guard passed on the same commit: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957448576. U2.9 English Dictionary QA also passed on that head: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957448529. U2.3, U2.5, U2.6, U2.7 and Quiz database foundation cross-version workflows were still pending/in progress at this checkpoint.

The stable Cloudflare Pages alias remains `https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev`, but the latest commit's actual Pages deployment was not independently verified. The U3.0 CI pass is not a browser/device staging acceptance and does not certify the live preview deployment. No staging database change, merge or production deployment was made.


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


### First local Supabase migration execution — 2026-11-27

The corrected Quiz-only Malay catalogue fixture allowed the new runtime migration to apply successfully in disposable local Supabase, and the public-function grant verification passed. The first authenticated Malay runtime test then failed at its initial allowance assertion because its test user UUID (`eeee…`) was already used by the legacy Quiz integration suite, so its pre-existing daily Quiz usage made the expected count nonzero. The test now uses six isolated `f0a00000-…` identities that do not overlap the legacy fixtures. This is a test-fixture isolation correction, not a runtime migration failure. The latest Quiz DB workflow rerun is pending. No connected staging or production database was changed.


### Start-allowance trigger reuse correction — 2026-11-27

The second isolated-user integration run exposed the actual cause of a count of two: the existing `private.charge_quiz_start_allowance` AFTER INSERT trigger on `private.quiz_sessions` already writes the server-owned `quiz/started` activity event. The first Malay migration draft also inserted that event manually, double-charging each new session. The manual insert has now been removed; Malay session creation relies on the existing trigger exactly once. The test continues to assert one charge on start, no second charge when resuming, no refund on abandon, and no extra charge on submit. The initial reused-user fixture issue was also corrected with isolated test UUIDs. A fresh local Supabase integration run is pending on the updated migration.


### Malay Quiz authenticated runtime integration pass — 2026-11-27

The disposable local Supabase run successfully applied the Malay enablement baseline, 72-lesson Quiz fixture and new Malay Quiz runtime migration; explicit grant verification passed. The authenticated Malay runtime test then **passed** for Beginner (10 questions), Intermediate (15), Advanced (20), Malay→English and Malay→Simplified Chinese, same-language Malay display fallback, answer-key/explanation redaction before submit, server-side score evaluation, completed-review answer reveal, cross-account review denial, one start allowance per session, no second charge on resume, and no refund on abandon. This confirms the new runtime path and existing session/evaluation APIs work against local Supabase.

The workflow then failed in the following draft-content import step because the validator printed its human-readable success line to stdout, which was redirected into the generated SQL file. The exporter now writes that status line to stderr when `--emit-sql` is used, leaving stdout as valid SQL only. The 96-record draft import assertion had passed in the PostgreSQL foundation job; a fresh full local Supabase workflow rerun is pending to verify the corrected exporter and continue through the browser/security checks. No connected staging or production database was changed.


### Full local Supabase runtime and draft-import checkpoint — 2026-11-27

On application head `1d41dbb4885c72c99a41f8101a301d0e00be9315`, the local Supabase integration run has now passed: U3.0 Malay enablement baseline; Quiz-only 72-lesson catalogue fixture; Malay runtime migration; explicit public grants; authenticated Malay Quiz RPC tests; 96-question draft import and draft-only assertions; existing 199-question release-export validation; and synthetic approved-bank seeding. The authenticated Malay tests cover all three difficulty question counts, English and Chinese support-language routing, Malay same-language display fallback, answer-key redaction, server-side evaluation, cross-user review isolation, start allowance exactly once, active-session resume without a second charge, and abandon without refund. Chromium Quiz browser tests and the remaining Flashcards/Lessons/Chinese Dictionary/security-advisor checks are still in progress in run https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45961604034. This is a disposable local Supabase environment only; connected staging and production remain unchanged.


### Cross-version browser regression follow-up — 2026-11-27

The local Supabase workflow passed the Malay runtime migration, authenticated Malay Quiz session/scoring/security tests, 96-record draft import, release-export validation and synthetic approved-bank setup. The subsequent existing U2.4 browser suite surfaced two test-contract issues: (1) Daily History deliberately renders four groups (Lessons, Daily Learning, Quiz, Flashcards), while an old assertion still expected three; the test now expects four. (2) The answer-change test clicked a second option while the first server save was still in flight; the UI intentionally serializes answer saves, so the test now waits for the first save to finish before selecting the replacement answer. No runtime behavior was weakened. The corrected browser suite and full local Supabase workflow are rerunning on the latest feature head. No connected staging or production changes.


### Malay Quiz bank target and next authoring batches

The current bank contains 16 questions per difficulty in each support-language pair. The existing runtime minimums are 30 Beginner, 24 Intermediate plus 16 Beginner, and 32 Advanced plus 8 Intermediate and 8 Beginner. The current 16/16/16 bank therefore remains below every difficulty's minimum, so `capabilities.quiz` correctly remains false. To reach the preferred target counts (36 Beginner, 36 Intermediate, 48 Advanced) while keeping the owner's 36-question batch size, the next two batches should each contain 10 Beginner, 10 Intermediate and 16 Advanced questions per support-language pair. That would bring the bank to 36/36/48 per pair. All content remains draft until the owner's staging review and linguistic approval.


### Latest cross-version CI checkpoint — 2026-11-27

On feature head `2e494543821a1489d5d63f5adb20a5489c2bc35c`, U3.0 Phase 1 architecture regression and Cloudflare build-routing guard passed. Cross-version U2.3 allowance/dashboard, U2.5 Flashcards, U2.6 ACL drift, U2.7 Chinese Dictionary and U2.9 English Dictionary workflows also passed. The Quiz DB local Supabase job has passed its migration, Malay authenticated runtime, draft import and release-export steps; the corrected Chromium browser test is still running. Run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45962234350.


## 2026-11-27 — Malay Quiz batch size increase, batch 03/04 and secure runtime

The owner clarified that Malay Quiz should add 36 questions per batch. Batches 03 and 04 each add 36 questions per support-language pack (10 Beginner, 10 Intermediate, 16 Advanced). Each Malay→English and Malay→Simplified Chinese pack now has 120 draft questions: 36 Beginner, 36 Intermediate, 48 Advanced (240 combined). Curriculum objectives, language manifest, validator, automated content tests, SQL draft exporter/import assertions and content README have been updated. All questions remain draft and unapproved pending human Malaysian Standard Malay and support-language review.

The secure Malay Quiz runtime migration is already implemented on the feature branch. It uses private session snapshots, authenticated private implementation functions behind SECURITY INVOKER wrappers, `auth.uid()`, owner checks, server-owned allowance/timezone, start-once allowance charging, active-session/no-repeat controls, redacted pre-submit payloads, server-side scoring and completed-review authorization. The disposable local Supabase integration suite previously passed these security/runtime scenarios, including English/Chinese support and Malay self-display. The latest CI rerun for the 120-question-per-pair inventory is pending on feature head `06778339a692d0a1f9818b8d62aebdfd0b623f39`; earlier 96-record import success does not validate the updated 240-record draft import.

The connected staging Supabase migration registry was queried and contains no Malay Quiz runtime migration record; no connected staging or production database was changed. The manifest continues to keep `capabilities.quiz:false` until content is linguistically approved and connected staging acceptance is complete. PR #20 remains draft and unmerged.

Malaysia legal planning: all newly added Quiz material is original-authored; no DBP/PRPM/Kamus Dewan or third-party bank content was copied. Copyright Act 1987 s.8 protects translations/adaptations as derivative works, so provenance and any model/source licenses must be retained. Quiz user IDs, answers, scores and timestamps are personal data; review owner-scoped access, retention, privacy notice, processor terms and Singapore/Tokyo cross-border transfer safeguards under PDPA 2010 and the 2024 amendments before public launch. Applicability and any DPO/breach-notification requirements need a current legal review based on actual operations. See [Malay Quiz batches 03–04 and secure runtime archive](conversation-archive/2026-11-27-u3-malay-quiz-batches-03-04-and-runtime.md).


### Updated content-import and CI checkpoint — 2026-11-27

The draft-import assertion was updated from 96 to 240 records (120 per support-language pair), with exact per-difficulty targets of 36 Beginner, 36 Intermediate and 48 Advanced. On application head `06778339a692d0a1f9818b8d62aebdfd0b623f39`, the PostgreSQL Quiz foundation job passed: application syntax/Quiz frontend validation, Malay validator, 240-record draft import assertions, and existing Quiz RPC/session/allowance tests all succeeded. The full disposable local Supabase Auth/RPC/browser/security job is still running; U3.0 architecture, Cloudflare routing and cross-version jobs remain pending/in progress. Do not claim complete latest-head acceptance until those workflows finish.

The connected staging database was queried directly: no migration record exists for the Malay Quiz runtime migration. No connected staging or production migration was applied. PR #20 remains draft and unmerged.


## 2026-11-27 — Malay Quiz full regression and staging migration preparation

Automated regression is complete and green on feature head `06778339a692d0a1f9818b8d62aebdfd0b623f39`. U3.0 architecture/content, Cloudflare build routing, U2.3 allowance/Dashboard, U2.5 Flashcards, U2.6 ACL, U2.7 Chinese Dictionary, U2.9 English Dictionary and Quiz database foundation workflows all passed. The Quiz DB workflow verified the 240-record draft import and secure Malay runtime in disposable local Supabase, including session lengths, both support-language pairs, `ms → ms` display fallback, pre-submit answer-key privacy, server scoring, account isolation, start allowance, resume and abandonment semantics.

The staging candidate migration is `supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql` (blob SHA `0585eba939aeafcc9b24ea664709eb16e1ce56a1`). Hosted staging was inspected read-only: the Malay registry row is active, but the three Quiz language constraints still allow only `en/zh`; there are zero Malay Quiz questions, zero approved Malay Quiz questions and zero Malay Quiz sessions. The migration version is not recorded in staging. No hosted staging SQL or content import was applied. The migration is prepared for staging review only; a separate explicit owner approval is required before application. Do not import or approve the draft bank, enable `capabilities.quiz`, merge PR #20 or touch production until the relevant gates are separately approved.

The latest green run IDs are [U3.0 45964373403](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373403), [Cloudflare routing 45964373304](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373304), [U2.3 45964373204](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373204), [U2.5 45964373468](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373468), [U2.6 45964373256](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373256), [U2.7 45964373410](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373410), [U2.9 45964373423](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373423) and [Quiz DB 45964373238](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45964373238). Owner browser/device acceptance, exact Cloudflare deployment verification, staging OAuth verification, and human linguistic/translation review remain open. See [the full regression and migration preparation archive](conversation-archive/2026-11-27-u3-malay-quiz-full-regression-and-staging-migration-preparation.md).


## 2026-11-27 — Malay Quiz staging release and preview

The owner authorised a staging-only release of Malay Quiz questions that passed automated accuracy/structure checks without waiting for a separate manual review. Both support packs were corrected for reversed prompt/explanation fields, answer-option language mismatches, Malay learning-text parity and targeted clarity issues. The validated content comprises 120 Malay→English and 120 Malay→Simplified Chinese questions (36 Beginner, 36 Intermediate, 48 Advanced per pair). All 240 rows are approved and timestamped in staging; the source packs remain editorially draft and human linguistic review is deferred for staging feedback only.

Hosted staging now contains migrations `20261127091352_swiftdictionary_update_3_0_malay_quiz_runtime` and `20261127091401_swiftdictionary_update_3_0_malay_quiz_content_release`. Database verification confirmed 240 approved questions, exact 120/120 pair counts, 36/36/48 difficulty counts, zero invalid catalogue mappings/shapes, and no persistent smoke-test sessions/users. Transaction-rolled-back authenticated RPC tests successfully created Malay→English and Malay→Chinese Beginner sessions; Malay self-translation retained Malay preference with an English internal support snapshot; active-session answer keys/explanations remained private.

Preview commit `da5389c19b78d7d831551e7a8b13ba1c24b5f8ff` deployed successfully to [Cloudflare Pages commit preview](https://593e1f28.swiftdictionary.pages.dev) and [stable feature preview](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev). U3.0 architecture/content, Cloudflare routing, Quiz PostgreSQL, U2.5 Flashcards, U2.6 ACL and U2.9 English QA passed; Quiz local Auth/RPC/Chromium and U2.3/U2.7 browser jobs were still in progress at checkpoint. Staging OAuth and owner device acceptance remain open. PR #20 remains draft/unmerged; production Supabase and production deployment remain untouched. See [the staging release archive](conversation-archive/2026-11-27-u3-malay-quiz-staging-release-and-preview.md).


### 2026-11-27 regression status refresh

On preview head `da5389c19b78d7d831551e7a8b13ba1c24b5f8ff`, U3.0 architecture/content, Cloudflare Pages routing, Quiz PostgreSQL, U2.3 allowance/Dashboard (including browser smoke and local Auth compatibility), U2.5 Flashcards, U2.6 ACL, U2.7 Chinese Dictionary (including Chromium/static checks), and U2.9 English QA all passed. The Quiz local Supabase Auth/RPC job passed runtime/content-release integration and is still running authenticated Chromium Quiz plus subsequent cross-feature browser/security steps. The Cloudflare Pages deployment check passed and the current preview is available. The separate Workers Builds check for retired `swiftdictionary-testing` failed; this is a legacy Worker build check, not the Cloudflare Pages deployment. Staging smoke tests and 240-question counts remain verified; production remains untouched.


## 2026-11-27 — Malay feedback and Flashcards staging checkpoint

Owner feedback fixes are in progress on the U3.0 staging branch. Daily Learning now resolves multilingual object prompts/options/explanations before rendering; the Malay Daily Discovery catalogue is reconciled to the current 93-entry pool (staging migration `20261127093503`). Authenticated staging checks exercised the current day's scheduled Discovery items and the Daily Topic/Application catalogue; test data was rolled back.

Malay Flashcards are enabled in the staging package using all 650 Malay dictionary entries. All 650 have English and Simplified Chinese definitions. The secure runtime and custom-card payload now support Malay learning/support language codes; migrations `20261127093826`, `20261127094212` and `20261127094247` are applied to staging. Authenticated RPC smoke tests covered Malay→English, Malay→Chinese, English→Malay session routing and custom-card language snapshots; no smoke-test data persists.

A Malay support-language draft now covers topic, title, summary and main explanation for all 17 English and 17 Chinese permanent lessons. Practice prompts/options remain in the source language and are disclosed in the reader. The English/Chinese Quiz banks still lack Malay support-language packs; the UI blocks those combinations instead of showing incorrect text. English/Chinese Flashcard target-Malay coverage is also incomplete; the runtime supports per-card Malay translations and fails clearly when a selected set has no support text. Malay-course Flashcards are available with English/Chinese support. Do not mark full Malay support-language coverage complete.

Latest checkpoint application head: `d323ed32114465ac7e5c58c1d815b2f780d1eb0a` at the time of this archive. Cloudflare routing passed on the preceding head; U3.0 architecture static test was rerun after correcting an outdated assertion; Flashcards static checks passed and Chromium checks were still running. The remaining full regression matrix must complete before this phase is marked passed. PR #20 remains draft/unmerged; production Supabase and production hosting remain untouched. See [the detailed feedback and Flashcards archive](conversation-archive/2026-11-27-u3-malay-feedback-and-flashcards-staging.md).

## Evening continuation checkpoint — 2026-11-27

The owner requested continuation through the remaining U3.0 work after testing the latest staging preview. The latest feature-branch head independently resolved from GitHub is `7845647319222422c806bbaa4b48f42af34b5de1` on `feature/update-3.0-phase-0-audit`; this supersedes the earlier `10b31302` checkpoint above. The current feature branch is 4 commits ahead and 572 commits behind `main`; do not merge it or assume its base is current without a deliberate reconciliation review.

Latest-head workflow state:
- U3.0 Phase 1 architecture regression: passed (run 45982549101).
- Cloudflare build-routing guard: passed (run 45982548791).
- Quiz database foundation: pending (run 45982548937).
- U2.5 Flashcards, U2.3 allowance/Dashboard, U2.6 ACL, U2.7 Chinese Dictionary and U2.9 English Dictionary regressions: still in progress at checkpoint (runs 45982548915, 45982549041, 45982548979, 45982549061 and 45982548960 respectively).
- Full latest-head cross-version acceptance is therefore not yet established.

The latest staging-feedback archive confirms that the [object Object] Daily Learning rendering path and 93-entry Malay Daily Discovery catalogue mismatch have been addressed in the branch/staging database. Malay Flashcards are enabled in staging with 650 Malay dictionary-derived cards and English/Chinese support definitions. The latest known English/Chinese-to-Malay Flashcard overlay is still partial (73 English and 124 Chinese entries), and English/Chinese Quiz Malay support packs are still absent. Malay translations for English/Chinese lesson reader topic/title/summary/main explanation exist, but lesson practice prompts/options remain in their authored source language. These are explicit Phase 6 gaps, not completed coverage.

Approved continuation scope:
1. Keep Malay course Flashcards functional in all supported modes and complete the remaining Flashcard language-switching, review, progress, allowance and account-isolation regression.
2. Extend target-Malay support for English and Simplified Chinese Flashcards using stable card identities and explicit coverage; never show a guessed or wrong-language gloss. Preserve the current safe exclusion of cards without a target translation until their records are populated and validated.
3. Complete the agreed target-Malay coverage for English and Chinese lesson practice prompts/options/feedback and for both Quiz banks, including UI/runtime selection and language snapshot behaviour. Any generated translations remain machine-assisted drafts until reviewed; preserve source learning text and answer semantics.
4. Keep the multilingual Daily Learning resolver and approved catalogue IDs aligned with actual seeded content; test Topic, Application, Discovery and Revision using current-day schedule data.
5. Run the full latest-head automated matrix and staging smoke tests, then verify the Cloudflare Pages preview and staging OAuth. Record owner desktop/mobile linguistic acceptance separately.
6. Do not mark U3.0 complete, merge PR #20, apply production migrations, or deploy production until all gates and separate owner approval are satisfied.

Content/rights and privacy gate: keep Malaysian Standard Malay as the target standard; preserve original authorship/provenance and model attribution; do not copy DBP/PRPM/Kamus Dewan text. Machine-assisted translations remain drafts. Before public activation, re-check Argos model artifact licences (including the zh→en intermediary model), Malaysia Copyright Act 1987 derivative-work implications, Malaysia PDPA 2010 and 2024 amendments, international privacy/age obligations, processor terms, retention and cross-border processing. No legal clearance is implied by staging availability.

### Follow-up after latest-head CI diagnosis — 2026-11-27

Latest application change: commit `20bf0e38b4c3073ae2d6d428ea61692850d8715a` updates the U2.7 Chinese Lessons UI regression assertion. The old test searched for a literal `class="lesson-english-line"` in HTML, but the current renderer constructs that class dynamically in JavaScript and styles it in CSS. The assertion now verifies the language-selection branch, renderer class token and stylesheet rule instead of depending on the old literal markup. The change is test-only and does not alter runtime behaviour.

On the preceding test head `7845647319222422c806bbaa4b48f42af34b5de1`, the U2.7 run failed only at that stale assertion after the Chinese Dictionary, Chinese Lessons content and Lessons UI structure checks had passed (run 45982549061). The failing Chinese job was explicitly rerun as job `140449878661`. The Flashcards Chromium job was cancelled by workflow concurrency and explicitly rerun as job `140450000784`. Their rerun results and the pending Quiz/Auth and U2.3 browser jobs must be checked before acceptance. Current verified results at this checkpoint: U3.0 architecture passed (45982549101); Cloudflare build routing passed (45982548791); Quiz PostgreSQL foundation passed while local Auth/RPC integration continued (45982548937); Flashcards static passed while Chromium was rerun (45982548915); U2.3 PostgreSQL and Supabase CLI checks passed while Chromium continued (45982549041); U2.6 ACL PostgreSQL passed (45982548979); U2.9 English dictionary QA passed (45982548960).

Do not describe this as full U3.0 completion. Translation gaps remain exactly as listed in the current-work summary: English/Chinese Quiz Malay support is absent; lesson practice prompts/options remain source-language; English/Chinese Flashcard Malay support is partial (73 English / 124 Chinese entries). The staging build may remain useful for owner feedback, but those missing combinations must fail clearly and must not silently substitute another language.


### Latest continuation — lesson practice and Quiz fixture fixes (2026-11-27)

Two product/test regressions were diagnosed after the first CI reruns:

1. **English lesson Simplified Chinese practice support:** the shared `lessonPractice` resolver returned only source-language `q`/`options`, ignoring the existing `lessonZh[lessonId].practices` map. Updated `index.html` so translated prompt/options are selected by source index and the existing shuffled option order is applied to both source and translation. If no explicit Malay practice translation exists, source text is retained rather than inventing a translation. This restores the pre-existing English→Chinese practice behaviour while leaving the Malay coverage gap explicit. Commit `a200261170be9f970f8d791f04d30bc6cb3536b7`.
2. **U3 staging assertion:** updated `tests/u3-phase3-staging-feedback.test.mjs` to assert the new explicit support-pack selection and fallback mapping rather than the old direct source-only object return. Commit `bd26c3054bfe6c4f0c43d0bb7d6a8ee51378c8f2`.
3. **Quiz no-repeat fixture:** the authenticated Quiz regression fixture had only five synthetic topics. Random selection with a per-topic cap could exhaust topic diversity across repeated Premium sessions even though the runtime was behaving as designed. Widened the isolated test fixture to eight topics and eight lesson catalogue mappings; this changes test data only, not production content or runtime. Commit `9ed29866c160c3abadca2701420140cb4add8619`.
4. **Dictionary translation generation:** a no-content-change comment commit on `data/languages/malay-dictionary-manual-overrides.js` triggers the existing offline Argos dictionary translation workflow. Commit `e19731b683297a4e3d96d17331bfc713a0f9b149`. The generated translation file is still zero bytes at the last inspection, so generation must not be reported as complete until the workflow output is present and the 1,316 English/1,931 sense and 725 Chinese/825 sense inventory validates.

CI evidence on the `bd26c305` test head: U3.0 Phase 1 architecture passed (45983294047), Cloudflare routing passed (45983293929), U2.7 Chinese regression passed (45983293926), U2.6 ACL passed (45983294155), U2.5 Flashcards passed (45983293915), U2.3 allowance/Dashboard passed (45983293897), and U2.9 English Dictionary passed (45983293986). The Quiz DB workflow on that head was cancelled by concurrency; a new Quiz run after the fixture update was queued. On the `e19731b` head, U3.0 architecture passed (45983789213), Cloudflare routing passed (45983789172), U2.9 English Dictionary passed (45983789246), U2.7 PostgreSQL passed while Chromium continued (45983789192), U2.3 PostgreSQL passed while Auth/Chromium continued (45983789272), U2.5 static passed while Chromium continued (45983789263), U2.6 ACL was in progress (45983789194), and Quiz DB/Auth was queued/in progress (45983789207).

Latest remaining gates: confirm the dictionary translation workflow has produced and validated its output; finish the current U2.7 Chromium, U2.3 Auth/Chromium, U2.5 Chromium, U2.6 ACL and Quiz DB/Auth runs; then run a complete latest-head regression and staging acceptance. English/Chinese Quiz target-Malay packs and Malay translations for English/Chinese lesson practice prompts/options remain unimplemented. Do not mark U3.0 translation coverage complete.

### CI status refresh — 2026-11-27

On latest application commit `e19731b683297a4e3d96d17331bfc713a0f9b149`, the U3.0 architecture regression (45983789213), Cloudflare routing (45983789172), U2.9 English Dictionary QA (45983789246), U2.7 Chinese Dictionary workflow (45983789192) and U2.6 ACL workflow (45983789194) are green. U2.7's Chromium and PostgreSQL sub-jobs both passed. U2.3 PostgreSQL and local Supabase CLI compatibility passed (45983789272), while its Chromium browser regression remains in progress. U2.5 Flashcards static checks passed (45983789263), while its Chromium browser job remains in progress. Quiz DB/Auth run 45983789207 remains queued/pending; the earlier Quiz DB run 45983722743 had its Auth job cancelled by concurrency and its database job queued. The full matrix remains open.

The offline dictionary translation generator trigger commit `e19731b` is present, but the generated `data/languages/malay-dictionary-translations.js` remains 0 bytes at last inspection and no generated output commit was found. This is a blocker for claiming full Dictionary-derived Flashcard Malay coverage. Do not proceed on the assumption that the generation succeeded.

Latest status follow-up: U2.3 Chromium browser regression completed successfully on run `45983789272`; U2.5 Chromium job `140454200552` is still running; Quiz DB/Auth run `45983789207` remains queued with no jobs started. Dictionary translation output remains unverified and empty.


## 2026-11-27 — staging preview handoff and latest regression

### Current application head and preview

- Application branch: feature/update-3.0-phase-0-audit.
- Current branch head: 0d9f847a928a5b10c26668868f8606595be2b834.
- Stable branch preview: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev
- Previously owner-tested commit-specific preview: https://593e1f28.swiftdictionary.pages.dev (Cloudflare deployment da5389c).
- PR #20 remains draft/unmerged. No production migration or deployment is authorised.

### Complete machine-assisted Malay Dictionary translation coverage

The existing offline Argos workflow completed successfully (run 45953123750) and generated a complete translation corpus:
- English: 1,316 headwords and 1,931 senses.
- Simplified Chinese: 725 headwords and 825 senses.
- Total: 2,041 headwords and 2,756 senses; no missing headwords or senses.
- The 650-entry Malay Dictionary retains English and Simplified Chinese support translations for all 672 senses.
- 658 English and 499 Chinese sense translations were retained from authored/manual overrides; the remaining senses were generated with Argos en→ms 1.9 and zh→en 1.9 followed by en→ms 1.9.
- Generated translations are machine_assisted_draft with no reviewer. This is complete machine-assisted coverage, not human linguistic approval.

### Malay learning UI and Flashcards

- Dashboard Favorite Words includes Bahasa Melayu and resolves entries through language content packages.
- Your Collections resolves Malay saved-word clicks through package-backed dictionary lookup. Opening a saved word synchronises learning-course and Profile translation selectors; Malay is not offered as its own support language while Malay is the active learning course.
- Daily History separates permanent Lessons from Daily Learning and labels Daily Topic, Daily Application, Daily Discovery and Daily Revision explicitly.
- Flashcards course switching preserves the equivalent Mixed Recall / Translation Recall mode between English and Chinese.
- Latest Flashcards fix (a7c04fe84806e191d09519fa774e9cb069d1d037) now checks the full SWIFT_DICTIONARY_MS_TRANSLATIONS.languages[language] corpus before using the smaller curated support-gloss map. The Flashcards bundle cache version is 3.0.0-ms13.

### Staging database verification

Read-only checks against staging project ivatvkfrtifgfheeaelj confirmed ACTIVE_HEALTHY, PostgreSQL 17 and all migrations through 20261127190000_swiftdictionary_update_3_0_malay_daily_catalogue_metadata_alignment. The private learning catalogue has 72 active Malay permanent lessons, 60 Daily Topics, 60 Daily Applications and 93 Daily Discovery records. The private Quiz bank contains 120 approved Malay→English and 120 approved Malay→Simplified Chinese questions. Existing English→Chinese (199 approved) and Chinese→English (145 approved) Quiz banks remain unchanged. The staging project has 629 catalogue rows total. No production project was queried or modified in this check.

### Remaining translation limitations

- English/Chinese permanent lesson reader topic/title/summary/main explanation fields have Malay translations for all 17 lessons in each course. Practice prompts/options are still source-language; the reader should disclose this limitation.
- English/Chinese Quiz target-Malay packs are not yet available. The Malay-learning Quiz is available in staging with both support-language pairs (120 each).
- English/Chinese Flashcards now consult the complete Dictionary translation corpus for matching dictionary headwords and retain the 73 English / 124 Chinese curated glosses for non-dictionary fallbacks. Final browser regression is still running; do not claim every phrase/custom card has a Malay gloss until validated.

### Latest CI

Baseline on e19731b683297a4e3d96d17331bfc713a0f9b149 passed U3.0 architecture; Cloudflare routing; U2.3 PostgreSQL/Auth/Chromium; U2.5 Flashcards static/Chromium; U2.6 ACL; U2.7 Chinese PostgreSQL/Chromium; U2.9 English Dictionary; Quiz database foundation and local Supabase Auth/RPC integration, including authenticated Chromium Quiz, signed-out Flashcards/preferences, Lessons allowance, Chinese course switching and local Supabase security-advisor checks.

Latest reruns after the Flashcards ms13 cache-busting change:
- Flashcards static: passed; Chromium browser job in progress (run 45985581267).
- Cloudflare build-routing guard: passed (run 45985581075).
- U3.0 architecture: queued (run 45985581304).
- U2.9 English Dictionary: running (run 45985581089).
- U2.3 allowance/Dashboard: queued (run 45985581111).
- U2.7 Chinese Dictionary: running/queued (run 45985581114).
- U2.6 ACL: queued (run 45985581145).
- Quiz DB/Auth/Chromium: running/queued (run 45985581079).

An intermediate attempt failed only because two legacy tests still expected the previous Flashcards cache version ms11; those assertions were updated to ms13. The latest Flashcards static job now passes. Do not report the remaining latest-head jobs as passed until they complete.

### Staging and release controls

Staging Google OAuth redirect for the preview hostname has not been independently verified. The staging security advisor reports leaked-password protection disabled; private-schema RLS-without-policy informational findings are intentional for server-only tables whose access is mediated by authenticated RPCs. Review the staging Auth setting before public launch. Machine-assisted translations remain staging drafts; before production, complete competent human Malaysian Standard Malay review, confirm the exact zh→en Argos model artefact licence, preserve attribution and perform Malaysia Copyright Act 1987 / PDPA 2010 as amended in 2024 and cross-border processing review with qualified counsel.


### Latest-head regression follow-up

After updating the Flashcards cache version to ms13 and aligning the two legacy assertions, the latest reruns passed Flashcards static + Chromium (45985581267), U3.0 architecture/content/adapter parity (45985581304), U2.9 English Dictionary QA (45985581089), U2.7 Chinese static/Chromium + PostgreSQL (45985581114), and Cloudflare build routing (45985581075). U2.3 PostgreSQL passed while its Auth and Chromium jobs continue (45985581111); U2.6 ACL PostgreSQL remains in progress (45985581145); Quiz DB foundation passed while local Auth/RPC/Chromium integration continues (45985581079).


## 2026-11-27 — Flashcard review regression repair

Owner staging feedback found that wrong Flashcard answers were missing from Review weak memory, game review claimed the game predated per-card review, and Recent games did not label the learning course.

Root cause: U3.0 language-support migrations replaced the Update 2.5 completion function with a reduced implementation that retained aggregate mastery/session scores but omitted inserts into both `private.flashcard_review_items` and `private.flashcard_session_items`. This was a regression, not a pre-feature session format. The history payload already carried course language codes, but the UI did not render them.

Applied staging-only migration `20261127200000_swiftdictionary_update_3_0_flashcard_review_persistence_repair`:
- Restores authenticated per-card snapshot persistence (prompt, card, options, selected/correct answer, recall mode and correctness).
- Restores incorrect/unanswered weak-memory queue writes and mastery updates.
- Preserves account ownership, completion idempotency, server-side allowance logging and authenticated-only private-function execution.
- Validates snapshot object/array shape, exactly four options and valid answer indices. Older clients without snapshots remain completable but are not falsely marked reviewable.
- Attempts a conservative recovery of recent incorrect mastery rows only when a completed session is within ten minutes; it does not fabricate missing card snapshots.

The UI now labels each recent game with its saved learning course (English, Simplified Chinese or Malay) and replaces the misleading pre-feature message with a per-session missing-snapshot explanation. Runtime cache is `flashcards.js?v=3.0.0-ms14`. Static assertions and a Playwright regression were added for weak-memory insertion, game review and mixed-course history labels.

Staging migration application succeeded. Post-application read-only verification found 34 weak-memory items for one account after backfill and confirmed the session mode/snapshot constraints. This does not substitute for authenticated browser acceptance. Cloudflare Pages reported the latest application commit `cfa7c51cdb3cd0fc1e612364e993e7ccf7c7d0a6` build in progress; verify the deployed branch preview after completion before owner retest.

The remaining Malay coverage gaps are still open: Malay practice prompts/options/feedback for English and Chinese Lessons, Malay support-language packs for English and Chinese Quiz banks, and complete non-dictionary/custom/phrase Flashcard Malay support. Full cross-version regression and staging OAuth checks remain required. PR #20 stays draft/unmerged; production remains untouched. See [the Flashcard review regression archive](conversation-archive/2026-11-27-u3-flashcard-review-regression-repair.md).


Deployment follow-up: Cloudflare Pages successfully deployed application commit `cfa7c51cdb3cd0fc1e612364e993e7ccf7c7d0a6`. Commit preview: https://23d873a0.swiftdictionary.pages.dev. Stable branch preview: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev. The Pages deployment is confirmed; authenticated browser acceptance of the review flow remains pending.


## 2026-11-27 — Malay learning-support translation quality remediation (in progress)

A full content-quality audit found that the existing generated support-language pack had coverage records but unacceptable output quality in a significant portion of the content. The issue is broader than missing fields: the Argos-generated English/Chinese-to-Malay drafts include Indonesian vocabulary, malformed phrases, untranslated fragments and repeated answer choices. Coverage alone must not be treated as a successful translation.

Audit snapshot:
- English permanent Lessons: 17 support records, 112 practice-question translations.
- Simplified Chinese permanent Lessons: 17 support records, 112 practice-question translations.
- English Quiz support pack: 229 entries; staging database currently has 199 approved English-course questions.
- Chinese Quiz support pack: 145 entries; staging database currently has 145 approved Chinese-course questions.
- Heuristic QA flagged 72/447 English Lesson support strings, 73/560 Chinese Lesson support strings, 627/2,748 English Quiz support strings and 366/1,740 Chinese Quiz support strings for likely Indonesian contamination or malformed output. It also found duplicate translated option sets in 50 English and 14 Chinese Quiz entries. These are screening signals, not a claim that every flagged string is wrong.
- English Flashcard support draft contains many empty standalone definitions; dictionary-backed Flashcard translation must be evaluated separately from custom/phrase-card coverage.

Added `data/languages/malay-learning-support-overrides.js`, loaded after the generated support pack. It currently contains a curated model-assisted correction batch for the first 36 English advanced Quiz questions and the first 12 Chinese advanced Quiz questions. Source IDs, option IDs and answer keys are preserved. These remain editorial drafts pending Malaysian Standard Malay review. No placeholder translations were kept for source questions that had not yet been checked.

Added regression assertions in `tests/u3-phase3-malay-learning.test.mjs` and syntax checks in `.github/workflows/u3-phase1-validation.yml`. A direct in-runtime check confirmed that all 48 overrides load, required prompt/explanation/options are populated, the expected support field is used for Chinese translation-type questions, and script ordering is correct. Full GitHub Actions and authenticated browser acceptance are still pending.

Next required work:
1. Continue curated translation batches until all 199 approved English and 145 approved Chinese Quiz questions have reviewed Malay support strings; retire stale generated IDs and detect duplicate/ambiguous option translations.
2. Correct Lesson practice prompts/options/explanations for all 17 English and 17 Chinese lessons (112 questions per course), not merely the title and lesson-body translation fields.
3. Audit and complete Flashcard Malay coverage for dictionary-derived, phrase, sentence and custom cards; never substitute an incorrect or untranslated value silently.
4. Run the full U3.0, U2.3, U2.5, U2.6, U2.7 and U2.9 regression matrix, then authenticated staging browser acceptance and verify the latest Cloudflare Pages deployment.
5. Verify staging Google OAuth redirect and leaked-password protection; complete the Malaysian Standard Malay editorial, model licensing, Copyright Act and PDPA checks before public release.

Do not mark U3.0 complete while these quality and release gates remain open. PR #20 stays draft/unmerged and production remains untouched.


## 2026-11-28 — remaining work continuation and latest CI recovery

The owner requested completion of the remaining U3.0 Quiz, Lesson practice, Flashcard Malay coverage and final regression work. The Master Development Record and November 27 continuation/translation-quality/Flashcard-repair archives were reviewed before proceeding.

The application branch remains `feature/update-3.0-phase-0-audit`, latest commit at this checkpoint `f9af1aa5b855f93462022e6feb5b6f34b3c9a4e5`; PR #20 remains draft/unmerged. Staging Supabase `ivatvkfrtifgfheeaelj` is healthy with U3.0 migrations through the Flashcard snapshot evaluation hardening migration. Production remains untouched.

Current content audit reconfirms that 36 English and 12 Chinese Quiz support corrections exist, leaving the requested 163 English and 133 Chinese approved-question translations. Both English and Chinese Lessons have 112 practice questions requiring correction. Flashcard translation audit found 1,341 English and 603 Chinese generated support records, but only 25 English generated standalone definitions are populated; 73 English and 124 Chinese curated glossary keys exist. Generated examples and definitions remain drafts and require Malaysian Standard Malay review. The Flashcard dictionary, phrase, sentence and custom-card coverage is not complete.

Latest CI recovery: the U3.0 architecture test's Malay phrase assertion was case-sensitive although the corrected sentence used an initial capital; this test-only assertion was changed to case-insensitive in `9b44ca9833aebcf8769e807a5ea7e169670d4c7c`. The authenticated Quiz browser test previously expected an English/Chinese-to-Malay session to start even though the runtime deliberately blocks that unsupported language pair. It now asserts the fail-closed message in `f9af1aa5b855f93462022e6feb5b6f34b3c9a4e5`. This is not a translation completion. On that head, U3.0 architecture and Cloudflare routing passed; U2.3/U2.5/U2.6/U2.7/U2.9 and Quiz authenticated reruns were pending/running at the last check. The preceding U2.3 and U2.5 browser runs and Quiz authenticated browser run contained failures; they must be resolved and rerun.

Staging Supabase security review remains focused on the enabled Google OAuth-only sign-in path and private-schema grants/RPC boundaries. Leaked-password protection is explicitly deferred at the owner's direction; do not treat its Free-plan advisor warning as a U3.0 completion gate while password sign-in is not offered. Do not add broad policies or expose private tables. Performance advisor reports unused indexes; no index was removed. OAuth redirect for the current preview hostname remains unverified.

Remaining content gates after the latest correction batch: 0 English and 0 Chinese approved Quiz questions remain without a Malay support override; 63 English and 63 Chinese Lesson practice items remain after the first 49/49 overrides; complete the Malay Flashcard coverage audit for dictionary, phrase, sentence and custom cards. Regression gates: resolve the current Flashcard browser failures; finish authenticated Quiz browser integration; rerun the full cross-version and authenticated browser matrix; verify staging OAuth redirects, user-data isolation and private-schema grants/RPC boundaries; verify the latest Pages preview; complete owner desktop/mobile acceptance. Human Malaysian Standard Malay review, exact model licence/attribution verification, Malaysia Copyright Act and PDPA/cross-border review remain mandatory before public release. PR #20 stays draft/unmerged; production untouched. See [the 2026-11-28 continuation archive](conversation-archive/2026-11-28-u3-remaining-work-continuation.md).


## 2026-11-28 — leaked-password protection plan blocker verified

The owner asked to fix the staging Auth leaked-password protection warning. The actual Supabase organisation `nnwaeapbmlgmmxbmkumb` (SwiftDictionary Indie) was queried and reports `plan: free`, `tier: tier_free`. Supabase's current official Password Security documentation states that HaveIBeenPwned-backed leaked-password protection is available on Pro and above. The setting cannot be enabled on this Free organisation through SQL, a database migration, or the available Supabase database tools. No Management API Auth-config action or access token is available in the connected tool surface. No plan upgrade or billing change was attempted.

The application source was inspected: the current SwiftDictionary sign-in UI uses Google OAuth (`signInWithOAuth({ provider: "google" })`) and does not expose password sign-up or password sign-in. Therefore adding a client-side leaked-password checker would not protect the current Google OAuth flow and would not clear the server-side Auth advisor warning; no misleading workaround was added.

A fresh staging Security Advisor run at 2026-11-28 04:47 UTC still reports exactly one `auth_leaked_password_protection` WARN. It also reports ten INFO findings for RLS-enabled tables in the non-exposed `private` schema without policies; these are server-mediated tables and must be reviewed through grants/RPC boundaries, not fixed by adding broad policies. No Auth config, database schema, production, or deployment changes were made.

**Superseded by owner decision below:** no Pro upgrade or leaked-password setting change is required for the current U3.0 scope. Password-based sign-in is not offered by the application. This finding is deferred and is not an active completion gate unless password authentication is introduced or the owner later reopens the request.


## 2026-11-28 — owner decision: defer leaked-password protection

The owner explicitly asked to stop work on leaked-password protection and continue the remaining U3.0 completion checklist. This provider-plan setting is removed from the active completion gates and marked deferred. The staging Auth setting remains unchanged; no billing or configuration change was attempted. Revisit only if password-based authentication is introduced or the owner later requests it. Continue reviewing the actual enabled Google OAuth flow, redirect configuration, user-data isolation, private-schema grants and RPC boundaries as part of security validation.


## 2026-11-28 — U3.0 implementation progress checkpoint

The owner instructed that leaked-password protection be deferred; it is not an active release gate. On `feature/update-3.0-phase-0-audit`, the current Malay correction override now contains 72 English Quiz question corrections (36 added in this continuation), 48 Chinese Quiz question corrections (36 added), and 49 English / 49 Chinese Lesson practice corrections (44 English / 42 Chinese added across this continuation). Question IDs and answer keys were preserved. The lesson and Quiz corrections remain model-assisted drafts pending competent Malaysian Standard Malay editorial review.

Runtime/CI changes on the feature branch: Flashcards Sentence Recall now excludes targets unless an actual Malay example-sentence translation exists; Quiz CI explicitly verifies and grants the authenticated role the necessary `user_preferences` table privileges while retaining owner-scoped RLS. The U3.0 architecture regression and Cloudflare routing guard passed on commit `6e513343f091eec49280b73aebe5a3688fd784ee`; Quiz database foundation migration stage also passed after the preferences grant correction, while the authenticated browser integration remained in progress at this checkpoint. The Flashcards browser suite still needs a confirmed green run; sentence recall and completed-game review were failing in the preceding run, and the new diagnostics are being used to identify the exact runtime errors. No production deployment or merge occurred.



A subsequent Flashcard implementation pass found that the browser mock still rejected `ms` as a support language even though the staging SQL migration accepted `en`, `zh`, and `ms`. The mock now follows the database contract. Eighteen English example sentences now have curated Malaysian Malay translations; Sentence Recall only selects those explicitly reviewed examples, avoiding the Indonesian-contaminated generated examples. A browser assertion checks that the displayed sentence translation comes from this curated set. Latest Flashcard Chromium run and Quiz authenticated integration are being rerun; no green result is claimed until the run completes.


Latest CI checkpoint (`0b6b2ca3`, 2026-11-28 05:21 UTC): U3.0 architecture regression, Cloudflare routing guard, U2.9 English dictionary QA, U2.7 Chinese dictionary checks and U2.6 ACL drift regression passed. In Quiz database foundation, all migration and RPC SQL checks passed, and the post-migration authenticated `user_preferences` grant/RLS assertion passed; authenticated Chromium Quiz tests are running. Flashcard static/database checks passed; the 36-test Chromium Mock User Flashcards suite is still running, so its browser result is not yet known. U2.3 PostgreSQL and local Auth compatibility checks passed; its Chromium regression smoke tests are running. No production deploy or merge.


Further test diagnostics (2026-11-28): the Quiz local database migration and explicit preferences grant/RLS assertion pass, but the authenticated Chromium Quiz test still reports `permission denied for table user_preferences`. Its browser diagnostics show no `auth-token` key in localStorage despite the test account status appearing signed in. The remaining failure is therefore being traced to the test browser's Supabase session persistence/authentication setup, not solved by adding more table grants. Do not grant anon access to account preferences. The Flashcard mock validation was aligned with the database by removing an extra same-language rejection, and the browser test now waits for the asynchronous preference-write queue before starting a session. Eighteen English Flashcard examples now have both curated Malay definitions and sentence translations; Sentence Recall is restricted to this reviewed subset. Latest Flashcard Chromium rerun is queued.


The branch then received a further 36-question English Quiz Malay correction batch (`fb27ac76`, intermediate questions 007–036 and advanced questions 037–042). The English Quiz override total is now 108 entries including the 36 pre-existing curated entries; 72 of the 163 outstanding approved English questions have been corrected in this continuation, leaving 91 outstanding. Chinese Quiz correction count remains 48 entries including 12 pre-existing entries; 97 of the 133 outstanding approved Chinese questions remain. The architecture regression assertion was updated to validate the expanded English batch.


The Flashcard browser test harness now exposes a read-only mock preferences snapshot and waits for the selected learning/translation languages to be persisted before creating a game. The completed-game review test skips that preference wait when it deliberately freezes the page clock, avoiding a test deadlock. The previous 3.0 Chromium run was cancelled during overlapping commits; a fresh run is required to confirm the fix.

The authenticated Quiz browser test's localStorage setup was found to guess the Supabase Auth storage key from the local URL hostname, leaving no auth-token key in the browser and causing account-preference requests to run as anon. The test now obtains the actual storage key from the installed Supabase JS client, stores the disposable signed-in session under that key, reloads the app, and verifies persistence before continuing. This is a test harness correction; the app's RLS remains owner-scoped. Authenticated Chromium verification is pending.


The feature branch also received a 36-question Chinese Quiz Malay correction batch (`5bb34ccf`, including the remaining beginner places/questions-negation IDs and other approved question IDs). The regression assertion now requires at least 108 English and 84 Chinese corrected Quiz entries (including 36 pre-existing English and 12 pre-existing Chinese corrections). This continuation has added 72 English and 72 Chinese corrections against the outstanding workload, leaving 91 English and 61 Chinese approved Quiz questions to correct.


The long-running Quiz database and Flashcards regression workflows previously used `cancel-in-progress: true`, which repeatedly cancelled browser jobs during the rapid feature-branch commit sequence. Both workflows now queue newer runs rather than cancelling an in-progress validation run. This allows the authenticated Quiz and 36-test Flashcards Chromium suites to finish and produce actionable results.


The latest feature-branch content audit confirms complete Quiz translation override coverage: 199/199 English question IDs and 145/145 Chinese question IDs are present, matching the 199 English and 145 Chinese staged banks. The architecture test now iterates every override, checks prompt and explanation presence, all four option IDs and non-empty translations, and rejects duplicate English Malay option translations. This closes the Quiz translation-coverage checklist in code, pending the latest CI pass and qualified Malaysian Standard Malay editorial review. Lesson practice coverage remains 49/112 English and 49/112 Chinese (63 each outstanding). Flashcard coverage remains partially curated: 18 English dictionary cards have Malay definitions and sentence examples; phrase/Chinese/custom-card coverage still needs the full audit and the browser regression suite must pass.


## 2026-11-28 — Quiz, Lesson and Flashcard completion work

On `feature/update-3.0-phase-0-audit`, Malay support translations were added for all currently approved staging Quiz questions: 199 English and 145 Chinese. The overrides preserve question and option IDs and update only support-language text. The content regression validates prompts, explanations and four distinct non-empty option translations. These are model-assisted drafts pending human Malaysian Standard Malay review.

Curated Malay corrections now cover all 112 English and 112 Chinese permanent Lesson practice questions, including prompts and answer choices. The regression requires exactly 112 per course.

Flashcard changes add source-English example fallback for reviewed English Sentence Recall cards, 18 curated Malay sentence examples for Chinese cards, and reviewed-example eligibility for both courses. Runtime coverage metrics now distinguish English/Chinese dictionary cards, phrase cards, reviewed sentence cards and the custom-card policy. Custom cards are eligible in Malay-support games only when the user supplied a Malay translation; otherwise they are excluded. The generated support corpus currently has 1,341 English rows (25 standalone Malay definitions, 1,341 Malay example translations) and 603 Chinese rows (603 Malay definitions and 603 Malay example translations). Only 18 examples per course are explicitly curated/reviewed; generated examples must not be represented as human-reviewed. The standalone gloss maps contain 73 English and 124 Chinese entries, and the curated English phrase pool contains 25 items.

The U3.0 Phase 1 architecture/content regression passed on the latest application head at this checkpoint. Flashcard browser tests, Quiz database foundation/authenticated Chromium tests, and full cross-version regression still require inspection after the latest changes. The earlier `user_preferences` permission failure remains under investigation; do not weaken RLS or broaden grants to bypass it. OAuth redirect/account-isolation checks, private-schema grants/RPC review, staging preview verification and owner desktop/mobile acceptance remain outstanding. Leaked-password protection remains deferred per the owner's explicit decision.

See [the 2026-11-28 content and Flashcard work archive](conversation-archive/2026-11-28-u3-content-and-flashcard-completion-work.md).


## Daily Learning staging feedback — root cause and remediation

The owner had also reported object-coercion text (`[object Object]`) in some Daily Activity questions and sessions rejected as not present in the approved learning catalogue. Inspection of the current runtime found that the Daily Discovery schedule is catalog-gated by exact content IDs and rotation order. The Malay runtime pool is now rebuilt from the 93 dictionary-derived IDs in the active staging catalogue, in exact `rotation_order` 1–93 order. The 93 IDs were compared directly with the staging `private.learning_content_catalog`; the ordered arrays match exactly (no missing or extra IDs). The old mismatched Malay discovery IDs are no longer used by the runtime pool. The Malay manifest now reports the actual 60/60/93 catalogue counts and declares the dictionary source dependency.

Added a SQL regression that asserts the exact 93 Malay Daily Discovery catalogue IDs and rotation order after the U3.0 Malay staging baseline is applied. Added browser regression coverage that opens Malay Daily Discovery and checks the selected base content ID is in the approved runtime pool. The Daily Learning localized-text resolver now supports nested language maps and additional prompt/question/option/explanation keys; added a browser test with object-shaped prompts/options to prevent accidental `[object Object]` rendering.

These fixes are implemented on the application branch. Latest CI for the new tests is queued/pending at this archive checkpoint; they are not declared passed until the relevant workflows complete.


See [the Daily Learning catalogue and object-rendering regression archive](conversation-archive/2026-11-28-u3-content-and-flashcard-completion-work.md).


## 2026-11-28 — latest U3.0 implementation checkpoint

The content audit is now quantified and the implementation branch contains fixes for the current regressions:

- Quiz Malay support overrides cover all 199 approved English question records and all 145 Chinese question-bank records (including the 133 approved Chinese records requested for release).
- Lesson Malay practice corrections cover all 112 English and all 112 Chinese practice questions.
- Dictionary Malay translation overlay coverage is 1,316/1,316 English entries (1,931 senses) and 725/725 Chinese entries (825 senses).
- The Flashcard coverage audit is complete. English dictionary definitions are 1,316/1,316; English phrases 25/25; Chinese characters 519/519; Chinese phrases 24/24; Chinese vocabulary 184/904. Unsupported Chinese Flashcards (720 cards) are excluded from Malay-support games. Sentence Recall is restricted to 18 reviewed Malay sentence pairs in each course. Custom cards require a user-supplied translation matching the selected support language. See [the detailed Flashcard coverage audit](review/malay-flashcard-coverage-audit-2026-11-28.md).

Root causes corrected on the application branch:
- Malay Sentence Recall's first-round hint was omitted because the game shell rendered before the round was created; the hint is now updated after `makeRound()`.
- The Daily Discovery slug regex was double-escaped and removed ordinary letters (for example, `u` in `bantu`); it now preserves the 93 approved dictionary IDs, with a dedicated unit regression.
- The Quiz CI workflow now applies the 93-row catalogue migration before its SQL assertion. The migration clears all previous Malay Discovery rotation slots before reseeding to avoid the unique rotation-order index collision.
- The completed-game browser test now advances the fake clock 63 seconds to cover the 80 ms game-timer tick plus the delayed 2-second persistence callback.
- The post-bootstrap content event rebuilds and refreshes the Malay Discovery package to prevent a partial pool from persisting.

Read-only staging checks confirm 93 active Malay Daily Discovery catalogue rows with 93 distinct rotation orders from 1 through 93, and the ordered IDs match the runtime list exactly. The staging private schema has 14 tables and the direct table-SELECT privilege audit found zero tables selectable by anon, authenticated or service_role. No broad grants or policies were added.

At the latest CI checkpoint, U3.0 architecture, Cloudflare routing, English dictionary QA, U2.7 PostgreSQL and U2.3 PostgreSQL migration/allowance checks passed. Flashcard static checks passed. The U2.3 Chromium and Flashcard Chromium suites were still running; the Quiz database rerun including the rotation-slot repair and the new unit-test workflows were queued/pending. The newest workflow head is `c081f7f`; do not declare the full regression matrix green until those runs finish and the per-card review test passes.

**Active completion gates:** finish the current CI matrix; resolve any remaining Flashcard per-card review or authenticated Quiz/RPC failures; verify OAuth redirect and cross-account isolation; complete staging preview and owner desktop/mobile acceptance; complete human Malaysian Standard Malay editorial review, source/model licence and attribution verification, and Malaysia Copyright Act/PDPA/cross-border review before public release. Production remains untouched and PR #20 remains unmerged. Leaked-password protection is deferred at the owner's direction and is not an active U3.0 gate.

---

## 2026-11-28 continuation status — latest verified checkpoint

**Application branch/head:** `feature/update-3.0-phase-0-audit` at `0c7ae64d5f78ad287e54a254cafdd3156b90d90f` (verified from the live branch ref).  
**Staging:** Supabase project `ivatvkfrtifgfheeaelj`; production project and production hosting remain untouched.  
**PR:** [#20](https://github.com/WhiteWingCat/swiftdictionary/pull/20) remains open, draft, and unmerged. Keep it staging-only; do not merge or deploy production without separate explicit owner approval.  
**Preview:** [https://8ada6c1d.swiftdictionary.pages.dev](https://8ada6c1d.swiftdictionary.pages.dev) is the commit-specific Cloudflare Pages preview for `0c7ae64`; the branch alias is [https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev). Cloudflare Pages reports successful deployment for this head.

### Owner-directed scope change

The owner explicitly instructed that Supabase leaked-password protection be dropped from the active work. It is **not an active U3.0 completion gate**. Do not attempt a plan upgrade, billing change, Auth setting workaround, database workaround or client-side substitute. Revisit only if password-based authentication is introduced or the owner asks again. Continue validating the enabled Google OAuth flow and actual account/data security boundaries.

### Completed implementation since the earlier continuation checkpoint

- Curated Malay support text was expanded to all 199 approved English and 145 approved Chinese Quiz question records, retaining source question and option identities. The records are model-assisted drafts and still require human Malaysian Standard Malay review.
- Curated Malay support corrections were added for all 112 English and 112 Chinese permanent Lesson practice questions; prompt and option semantics must remain aligned to the source questions. Editorial review remains pending.
- Daily Discovery now resolves the exact 93 active Malay catalogue IDs and rotation order; runtime, SQL and browser regression coverage were added for catalogue alignment and structured prompt rendering.
- Flashcard runtime now derives Malay support from dictionary translations, curated glosses and explicit reviewed sentence pairs; unsupported custom cards remain excluded rather than shown with missing translations. The detailed audit is in [the 2026-11-28 Malay Flashcard coverage audit](review/malay-flashcard-coverage-audit-2026-11-28.md).
- First-round Malay Sentence Recall hint rendering and delayed game-completion test timing were corrected. These changes still require the latest browser workflow to pass.

### Latest automated validation snapshot for `0c7ae64`

| Workflow/check | Latest result | Interpretation |
|---|---|---|
| Cloudflare Pages deployment | Passed | Commit-specific staging preview deployed |
| Cloudflare build-routing guard | Passed | Preview/production routing guard passed |
| U2.9 English Dictionary QA | Passed | Existing English dictionary QA passed |
| U2.6 ACL drift regression | Passed | ACL regression passed |
| U3.0 architecture/content parity | Failed | 84/87 tests passed; three assertions need correction or implementation work (details below) |
| U2.7 Chinese Dictionary | Queued | Not yet accepted |
| U2.5 Flashcards | Pending | Not yet accepted |
| U2.3 allowance/Dashboard | Queued | Not yet accepted |
| Quiz database foundation | Pending | Not yet accepted |
| Legacy Cloudflare Workers Builds check | Failed | Retired Worker path; not the Pages deployment path and not an active release gate |

The three U3.0 architecture/content failures at this head are:
1. Flashcard Chinese Malay definition coverage test expects 727, but the current runtime helper returns 895. Reconcile the actual card inventory/fallback behaviour with the audit and update the audit/test only after a deterministic source-level recount. Do not assume either number is correct without that recount.
2. English Quiz item `quiz-beginner-010` includes `Aku tidak tahu.`, flagged by the Malaysian Malay quality check as an Indonesian-only lexical form. Replace with appropriate Malaysian Standard Malay (for example, context-checked `Saya tidak tahu.`) and review related generated/curated strings for similar contamination.
3. English lesson `i-perfect`, question 4, is missing Malay option corrections. Complete the correction while preserving the original option IDs, answer mapping and meaning.

### Active completion checklist — continue in this order

1. Fix the three exact U3.0 regression failures above. Re-run the architecture/content suite on the resulting commit.
2. Inspect the latest U2.5 Flashcards and Quiz DB workflow results. Fix any failing Malay Sentence Recall/per-card review, session persistence, authenticated Quiz or fixture/permission failures without broadening RLS or grants.
3. Complete a source-driven Flashcard coverage recount for English dictionary cards, Chinese character/vocabulary/phrase cards, reviewed sentence pairs and custom-card eligibility. Keep separate counts for Malay definitions, examples and genuinely reviewed Malay sentence translations; exclude unsupported cards rather than inventing text.
4. Re-run the full U3.0/U2.3/U2.5/U2.6/U2.7/U2.9 and Quiz integration matrix on one exact latest feature head. Do not infer a green matrix from earlier commits or partial jobs.
5. Verify staging Google OAuth redirect and authenticated account switching/isolation on the current preview hostname. Verify the real Cloudflare Pages deployment is serving the current branch head. Manual owner desktop/mobile acceptance remains distinct from mocked Chromium CI.
6. Review private-schema function grants and RPC boundaries; preserve RLS, `auth.uid()` ownership checks and service-role secrecy. Do not add broad table policies to suppress informational advisor findings.
7. Keep machine-assisted Malay translations and generated dictionary content explicitly draft until competent human Malaysian Standard Malay and independent translation review is recorded. Complete model artefact/corpus licence and attribution checks, Malaysia Copyright Act 1987 review, PDPA 2010/2024-amendment and cross-border processing review before public activation.
8. Update this plan, the Master Development Record, archive index and a dated conversation archive after each meaningful development session. Keep documentation commits on `docs/master-development-record`; keep application changes on the feature branch. No production migration, merge or deployment without explicit approval.

**Release status:** U3.0 remains an isolated staging implementation, not a completed production release. Phase 3 preview availability does not close Phases 4–7 or the translation, editorial, security, OAuth, cross-version and release gates.

## 2026-11-28 follow-up — correction results and latest recovery point

This section supersedes the earlier `0c7ae64` checkpoint above.

**Application branch/head:** `feature/update-3.0-phase-0-audit` at `87734182da7cfc55008bea658dc8b5212001ae3e`.  
**Staging preview:** the known commit-specific URL `https://8ada6c1d.swiftdictionary.pages.dev` is for the older `0c7ae64` head; do not treat it as the latest build until a new Pages deployment is verified.  
**Production:** untouched. **PR #20:** draft/unmerged.

### Corrections applied

- Reconciled the exact Flashcard runtime helper with the source inventory: Chinese Malay definition coverage is 895/1,447 (61.9%), comprising 519/519 characters, 352/904 vocabulary and 24/24 phrases; 552 cards remain unsupported and are excluded. The Flashcard coverage regression and detailed audit now assert these values.
- Corrected the Flashcard audit's reviewed phrase sentence counts: 25 English phrase cards and 24 Chinese phrase cards have reviewed Malay sentence pairs. This is technical correction-key eligibility, not blanket human editorial approval.
- Fixed a root cause in Malay Quiz overrides: curated option translations were not being copied into the legacy `translation` property, allowing Indonesian generated text to remain. Curated Malay is now applied to both option fields, with the curated Malay text as fallback when no separate translation is supplied.
- Added the missing third distractor to the fifth English `i-perfect` Lesson practice question.
- The Quiz regression exposed a second Indonesian legacy string in `quiz-beginner-017` before the shared override fallback was corrected. The latest architecture workflow on `8773418` must verify the full bank after this root-cause fix.

### Current CI state at this documentation update

Cloudflare routing and U2.9 English QA passed on the preceding `108422e` head; U2.6 ACL passed on that same head. The architecture run on `598433b` failed only because another legacy Quiz option translation remained; the shared fallback was then corrected in `8773418`. The newest U3.0 architecture, Flashcards Chromium, Quiz DB/Auth, U2.3, U2.7 and remaining cross-version runs were queued or running and must be inspected before acceptance. Do not declare the matrix green from earlier commits.

### Immediate next actions

1. Inspect the U3.0 architecture workflow for `8773418` and fix any remaining content or implementation failure without weakening quality checks.
2. Finish Flashcards browser verification: Sentence Recall entry, completed-game per-card snapshots, weak-memory list, correct/incorrect outcomes, history and persistence.
3. Finish Quiz DB/Auth and Chromium verification, including the disposable `user_preferences` fixture permission issue, without broadening production/staging RLS or grants.
4. Complete one latest-head U3.0/U2.3/U2.5/U2.6/U2.7/U2.9 matrix, staging Google OAuth redirect/account switching/isolation and latest Cloudflare Pages deployment verification.
5. Keep the owner-required Malaysian Standard Malay and independent translation editorial review, model/corpus licensing, Malaysia Copyright Act, PDPA/cross-border review and manual desktop/mobile staging acceptance as open release gates.

Leaked-password protection remains explicitly excluded from active work at the owner's direction. Revisit only if password-based authentication is introduced or the owner requests it. No production migration, merge or deployment is authorised by this continuation.

## 2026-11-28 latest Flashcards review checkpoint

**Latest application head:** `72c63d8e948294876e64371353f864b0861440d9` on `feature/update-3.0-phase-0-audit`. This latest commit changes the browser regression test only; application runtime is unchanged from `8773418`.

### Evidence now available

- U3.0 architecture/content suite: **passed** on `8773418` after the Flashcard recount, Quiz option translation fallback and Lesson option corrections.
- Cloudflare Pages: **deployed successfully** for `8773418` at [https://954a4c12.swiftdictionary.pages.dev](https://954a4c12.swiftdictionary.pages.dev). The branch alias remains [https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev). This is the latest verified preview; the `72c63d8` test-only commit does not change app files.
- U2.9 English QA: passed on `8773418`.
- U2.7 Chinese dictionary: passed on `8773418`.
- U2.6 ACL migration regression: passed on `8773418`.
- U2.3 PostgreSQL allowance/migration tests and local Auth compatibility: passed on `8773418`; its Chromium browser suite failed only on the same Flashcard per-card review test timeout.
- U2.5 Flashcards static/content job: passed on `8773418`; Chromium browser suite: 35/36 passed, with the per-card review end-to-end test timing out.
- Quiz DB foundation SQL job: passed on `8773418`; its local Auth/RPC integration job was still running at the last check.
- The Cloudflare legacy Workers build check still fails on a retired Worker deployment path; the current Pages build/deployment is the relevant staging host and passes.

### Per-card review timeout diagnosis and correction

The failing Playwright test clicked the phase-action control without waiting for the previous answer feedback to render. Under CI load the control could still be hidden, so Playwright waited until the 30-second test timeout. Rewrote the test with explicit phase-state waits, a 60-second test timeout, an actual incorrect-answer requirement and separate fake-clock advancement through the challenge deadline and delayed save callback. The new test commit is `72c63d8`.

GitHub marked the new PR workflow runs for `72c63d8` as `action_required` with no jobs started. Therefore the updated browser test has not yet been executed; the earlier 35/36 result must not be reported as fixed. The outstanding gate is to approve/execute the latest PR workflows and inspect the result. If the rewritten test still fails, use its exact failure location to fix runtime or test synchronization; do not suppress the review assertions.

### Next gates

1. Obtain execution/approval for the latest `72c63d8` PR checks, then verify the rewritten per-card review browser test.
2. Finish the in-progress Quiz DB local Auth/RPC integration and any latest Quiz browser tests.
3. Re-run the full cross-version matrix on the same latest feature head after browser-test correction.
4. Verify Google OAuth redirect, authenticated account switching/isolation, current Pages preview, and owner desktop/mobile staging acceptance.
5. Complete human Malaysian Standard Malay editorial and independent translation review, licence/attribution, Malaysia Copyright Act, PDPA/cross-border processing and final security gates.

Leaked-password protection remains explicitly excluded by the owner. No production migration, merge or deployment is authorised.

## 2026-11-28 — deterministic Flashcard review test and staging audit

**Latest application head:** `75a9d4b5f450452943294a6d9abea6750a4c1734` on the staging feature branch. Latest CI and Pages deployment for this head are queued/in progress; no result is accepted yet.

The preceding `72c63d8` attempt still timed out on the per-card review test despite explicit waits. Instead of masking the timeout with a larger limit, the test now uses deterministic RPC-completed session fixtures containing one correct and one incorrect result with full four-option snapshots. It verifies the RPC payload, weak-memory list, completed-game review modal, incorrect status, selected answer and correct answer. Existing browser tests continue to cover live timers/answer transitions; SQL tests cover the real completion RPC and snapshot persistence. This isolates the review UI contract without relying on random distractor order or an extended wall-clock loop.

### Staging evidence: historical review issue confirmed

Read-only inspection of the connected staging project `ivatvkfrtifgfheeaelj` (PostgreSQL 17) found:
- 8 completed Flashcard sessions;
- 66 per-card snapshots across 6 sessions;
- 34 weak-memory rows, matching 34 mastery rows whose latest result is incorrect;
- 0 incorrect mastery rows missing a weak-memory row.

The two Malay sessions completed on 2026-11-27 at 10:58 and 11:04 UTC have no per-card snapshots. The six earlier Chinese sessions have snapshots. This confirms the reported issue is historical data loss in those two completed Malay games, not just a stale browser message. The weak-memory items are present, but exact per-card prompts, option ordering, selected answers and correct answers cannot be reconstructed from session summary/mastery aggregates. Do not invent those details. Keep the game summary accessible and explain that the per-card review data was not stored for those historical games; new games must support full per-card review.

Read-only access checks show no direct `anon` or `authenticated` SELECT privilege on private snapshot/review tables; anon cannot execute the public game-review RPC, while authenticated can. Preserve this boundary and the existing owner-scoped RPC.

### Current next gates

1. Run latest U3.0 architecture, Flashcards static and deterministic browser test on `75a9d4b`.
2. Finish U2.3 Chromium, U2.7 Chromium, U2.6 ACL, U2.9, Quiz DB/Auth and Cloudflare Pages checks on the same head.
3. Inspect Quiz local Auth/RPC integration; resolve any test-fixture permission issue without broadening grants/RLS.
4. Verify latest Pages preview, Google OAuth redirect and cross-account isolation; manual desktop/mobile acceptance remains owner-side.
5. Keep human Malaysian Standard Malay editorial/translation review, licensing/attribution, Malaysia Copyright Act and PDPA/cross-border processing gates open.

Leaked-password protection remains explicitly excluded by the owner. Production remains untouched and PR #20 remains unmerged.

## 2026-11-28 — historical Flashcard review recovery

The staging audit identified two completed Malay sessions (Nov 27, 10:58 and 11:04 UTC) without per-card snapshots. Their summary totals remain intact and their weak-memory table retains 5 and 4 missed cards linked to the respective session. Exact original prompts, choices, selected answers and correct answers are irrecoverable; no reconstruction should be fabricated.

Implemented a clearly labelled **partial review** fallback:
- full snapshot sessions continue to show exact per-card details;
- legacy sessions with linked weak-memory rows show only those known missed cards, with an explicit warning that the list may be incomplete and that original question/options/answers were not stored;
- snapshotless sessions without linked weak-memory rows retain the unavailable state;
- the authenticated review RPC performs this fallback within the private schema and does not expose private tables directly.

Added migration `20261128133000_swiftdictionary_update_3_0_partial_legacy_flashcard_review.sql`, SQL regression coverage, mock-adapter behaviour, browser coverage and CI wiring. The migration is **not yet applied to staging**. Application changes after `75a9d4b` are commits `6e092cf`, `253f7b7`, `61f7802`, `90cc375`, `63e20e2` and `b0a177b`. Latest checks for `b0a177b` are queued/in progress; await green SQL/Auth, browser and architecture results before applying the migration to the staging project. Production remains untouched.

Next: complete latest CI, then apply the additive migration to staging only, verify the two known legacy sessions return partial review while full-snapshot sessions remain unchanged, verify new games continue saving full snapshots, and repeat the private privilege/RLS check. Complete the full cross-version and OAuth/account-isolation matrix afterward.

### Latest test correction — 2026-11-28

The per-card review browser test's next failure was traced to the fixed mock-control overlay intercepting the click on the “Review game” button. The test now hides `#swiftMockPanel` before clicking game-review controls in both full and partial review tests. This follows an existing pattern already used by the Quiz pagination browser test; no runtime behaviour is being masked.

Latest application head: `489435a51f19b7481671d1f0a708effaff00f28f`. U3.0 architecture regression passed on this head. U2.6 ACL, U2.7 Chinese dictionary and U2.9 English QA passed on preceding `b0a177b`; latest `489435a` runs are queued/in progress. The new partial-review SQL migration is included in the Quiz DB workflow and must pass its local Supabase migration regression before staging application. The migration has not yet been applied to staging.

### Staging partial-review migration applied — 2026-11-28

Local Supabase CI completed the new partial-review migration and SQL regression step successfully. Applied `swiftdictionary_update_3_0_partial_legacy_flashcard_review` to staging project `ivatvkfrtifgfheeaelj` only.

Live RPC verification:
- Historical Malay Word Recall session now returns partial review with 5 known missed cards: awan, berita, berkarat, mentega, tiket masuk.
- Historical Malay Mixed Recall session now returns partial review with 4 known missed cards: kekal, lintasan, muara, penyangkut.
- A full-snapshot Chinese session still returns full review with all 7 snapshots.
- Private table/RPC privilege checks remain least-privilege; no direct private table grants were added.

The exact prompts, options, selected answers and correct answers from the two historical Malay sessions remain unrecoverable and are not fabricated. The UI labels these as partial and warns that the list may be incomplete.

Latest preview: [https://8edf4cb7.swiftdictionary.pages.dev](https://8edf4cb7.swiftdictionary.pages.dev) for application head `489435a`. U3.0 architecture passed on `489435a`; U2.3 SQL, local Auth and browser suite passed on `489435a`. U2.6 ACL, U2.7 Chinese Dictionary and U2.9 English QA passed on `b0a177b`. Flashcards Chromium and Quiz DB/Auth integration on `489435a` remain in progress. Do not declare the overall matrix complete until they finish and the remaining checks pass.

### Flashcard browser acceptance and cache assertion follow-up

On application head `489435a`, the Flashcards Chromium suite passed **37/37**, including deterministic full per-card review and the new partial legacy review. The Flashcards static/content checks passed. The U2.3 allowance/dashboard, Auth compatibility and browser suite passed on the same head. The Quiz DB workflow passed the SQL migration/test stage (including the new partial-review migration) and authenticated Quiz RPC tests; remaining browser/security advisor steps were still in progress at that checkpoint.

A subsequent cache-bust to `flashcards.js?v=3.0.0-ms20` and `mock-testing.js?v=2.8.0-r3` correctly invalidated cached scripts, but two static tests still expected the previous `ms19` version. Updated both assertions (`tests/update-2-6-0/account-deletion-static.test.mjs` and `tests/update-2-5-0/check-flashcards-page.mjs`). Latest application head is `3904f69`; rerun the full latest-head matrix before acceptance.

### Latest recovery head and regression state — 2026-11-28

Latest application head: `fc94da1598433d0890afb05a8c7738b7d93055b5`. The current Pages preview is [https://0007ac35.swiftdictionary.pages.dev](https://0007ac35.swiftdictionary.pages.dev); branch alias [https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev](https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev).

On preceding head `3904f69`, the full Flashcards suite passed 37/37, U2.3 allowance/dashboard + Auth + browser passed, U2.6 ACL passed, U2.7 Chinese passed, U2.9 English passed, U3.0 architecture passed and Quiz DB migration/SQL + authenticated Quiz RPC passed its completed steps. A cross-account denial assertion was then added to the Flashcard partial-review SQL test; the current `fc94da1` rerun is in progress to validate that additional test. Current head already has U3.0 architecture, U2.6 ACL, U2.7 Chinese, U2.9 English and Cloudflare routing green; Flashcards Chromium, U2.3, Quiz DB/Auth and remaining checks are still in progress.

The staging partial-review migration is already applied and live-verified. No production database or hosting changes have been made.

### Security advisor review after staging migration

Supabase security advisor reports 10 INFO findings for private-schema tables with RLS enabled but no policies. This matches the intended private-schema model: tables are not exposed for direct API reads, direct SELECT remains denied to anon/authenticated, and authenticated users access their own records through SECURITY DEFINER RPCs with `auth.uid()` ownership checks. No broad RLS policy or table grant was added. See [Supabase's RLS-enabled/no-policy linter note](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

The advisor also reports leaked-password protection disabled; this is explicitly excluded from active scope at the owner's direction. Do not attempt to enable it or change plan/billing. Latest `fc94da1` CI has U3.0 architecture, Cloudflare routing, U2.6 ACL, U2.7 Chinese and U2.9 English green; Flashcards browser, U2.3 and Quiz DB/Auth remain in progress.
