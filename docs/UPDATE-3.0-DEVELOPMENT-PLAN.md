# SwiftDictionary Update 3.0.0 — Final Development Plan

**Status:** Owner-approved plan, 2026-11-26. Phase 0 and Phase 1 are complete. Phase 2 Malay Dictionary authoring is in progress toward an owner-requested target range of approximately 650–750 unique headwords (around 700). Batches 01–06 currently contain 336 unique draft headwords and 358 senses, with 716 English/Simplified Chinese machine-assisted draft translation records. Batch 06 added 110 unique headwords. The owner has directed future batches to contain 100+ new unique headwords, targeting approximately 100–120 per batch where quality and validation permit. See [the latest Phase 2 batch checkpoint](conversation-archive/2026-11-26-update-3-0-phase-2-dictionary-batch-06.md). The final Phase 1 evidence and known database boundaries are recorded in [the completed validation archive](conversation-archive/2026-11-26-update-3-0-phase-1-validation-complete.md). No staging preview before Phase 3. Database changes, staging handoff, merge and production deployment remain subject to the normal release gates.

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

**Exit:** structural, duplicate, morphology/search, sense/example, translation-coverage and responsive UI checks pass; linguistic review and provenance are recorded separately from automated validation. Malay remains inactive until Phase 3 and the later U3.0 release gates are satisfied.
### Phase 3 — Malay learning foundation and staging-preview gate

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
