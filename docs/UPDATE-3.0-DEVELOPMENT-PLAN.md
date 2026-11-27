# SwiftDictionary Update 3.0.0 — Final Development Plan

**Status:** Owner-approved plan, 2026-11-26; workflow revised by owner on 2026-11-27. Phase 0 and Phase 1 are complete. Phase 2 authoring reached 650 draft headwords, 672 senses and 1,344 machine-assisted draft translations. **Phase 3 content authoring and feature-branch implementation are complete as of 2026-11-27:** 72 permanent Malay Lessons (24 per difficulty), 60 Daily Topics (20 per difficulty), 60 Daily Applications (20 per difficulty), 93 Daily Discovery entries and adaptive Daily Revision. The final daily batch passed isolated runtime and shared-package integration checks. The approved staging-only database compatibility migration and Malay catalogue seed were applied successfully on 2026-11-27. U3.0 architecture/content regression and Cloudflare build-routing guard passed. Formal Phase 3 exit remains conditional on confirming the Cloudflare preview URL, staging authentication, browser/device acceptance, completion of the full database integration workflow and owner review. The user intends to review Malay linguistic quality and translations during staging review, so content remains draft. Phase 2 lexical authoring reached the target band: 650 draft headwords, 672 senses and 1,344 English/Simplified Chinese machine-assisted draft translation records. Phase 3 content authoring and feature-branch implementation are complete; the formal staging-preview gate remains pending the staging-only database migration approval and browser/device/full-CI acceptance. The Malay permanent Lessons catalogue has reached 72 draft lessons (24 Beginner, 24 Intermediate, 24 Advanced) through expansion Batch 08. Batch 07 passed its final U3.0 architecture regression (run [45936478798](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45936478798)); Batch 08's final loader/test integration workflow passed **45/45 tests** at [run 45937654497](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45937654497). The Malay Daily Learning inventory now contains 213 fixed records: 60 authored Daily Topics, 60 authored Daily Applications and 93 Daily Discovery entries generated from the first 93 Malay dictionary records. Both categories have 20 records at each of Beginner, Intermediate and Advanced. Permanent Lessons contain 72 draft lessons (24 per difficulty); Daily Revision is adaptive rather than a fixed catalogue and is excluded from fixed counts. Human Malaysian Standard Malay editorial review, independent translation review, source verification and item-level rights clearance remain pending by owner decision and will be conducted during the Phase 3 staging review rather than blocking implementation. These records remain drafts and must not be represented as human-approved. Staging preview remains prohibited until Phase 3 implementation and internal verification are complete. See the [Phase 2 batch checkpoint](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-08.md), [Phase 2 execution plan](U3.0-PHASE-2-MALAY-DICTIONARY-PLAN.md), [Phase 3 Batch 04 archive](conversation-archive/2026-11-27-update-3-0-phase-3-malay-lessons-batch-04.md) and [Phase 3 Batch 05 archive](conversation-archive/2026-11-27-update-3-0-phase-3-malay-lessons-batch-05.md) and [Phase 3 Batch 06 archive](conversation-archive/2026-11-27-update-3-0-phase-3-malay-lessons-batch-06.md) and [Phase 3 Batch 07 archive](conversation-archive/2026-11-27-update-3-0-phase-3-malay-lessons-batch-07.md) and [Phase 3 Batch 08 archive](conversation-archive/2026-11-27-update-3-0-phase-3-malay-lessons-batch-08.md), [Daily Activity Batch 01 archive](conversation-archive/2026-11-27-update-3-0-phase-3-daily-topic-application-batch-01.md) and [Daily Activity Batch 02 archive](conversation-archive/2026-11-27-update-3-0-phase-3-daily-topic-application-batch-02.md), and [final Daily Activity Batch 03 archive](conversation-archive/2026-11-27-update-3-0-phase-3-daily-topic-application-batch-03-final.md). See also [Phase 3 Database Impact and staging schema assessment](../feature/update-3.0-phase-0-audit/docs/U3.0-PHASE-3-DATABASE-IMPACT.md). Database changes, staging handoff, merge and production deployment remain subject to their separate approval gates.



**Daily activity expansion checkpoint — 2026-11-27:** Daily content version `u3-ms-daily-0.3.0` completes the initial target with 30 Topics and 30 Applications. Batch 02 added 18 Topics and 17 Applications. Runtime verification confirmed balanced 10/10/10 difficulty distributions in both categories, unique IDs, four-option application questions, complete Malay/English/Simplified Chinese fields for new questions and options, valid application-to-topic references, and successful integration into the shared content-package contract. The 93-entry Discovery pool and adaptive Revision behaviour were preserved. The package integration check also confirmed 650 dictionary entries, 72 permanent lessons and 1,344 draft translation records. This is automated structural/runtime verification, not the full 45-test CI workflow, browser/device acceptance, human linguistic review, translation approval, provenance verification or rights clearance. See the [Batch 02 archive](conversation-archive/2026-11-27-update-3-0-phase-3-daily-topic-application-batch-02.md) for the exact content coverage and checks. No staging preview, merge, database mutation or production deployment is authorised by this checkpoint.

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
