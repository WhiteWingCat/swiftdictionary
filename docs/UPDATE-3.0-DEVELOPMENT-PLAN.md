# SwiftDictionary Update 3.0.0 — Final Development Plan

**Status:** Owner-approved plan, 2026-11-26. Phase 0 audit completed read-only on 2026-11-26; Phase 1 implementation is next. Database changes, staging handoff, merge and production deployment remain subject to the normal release gates.

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

Introduce a central, versioned translation registry keyed by stable content identity and explicit source/target language. Track content type/ID, source revision, translation revision, status (not started, draft, machine-assisted draft, reviewed, approved, stale, not applicable), provenance/reviewer and validation metadata.

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

**Exit:** structural, duplicate, morphology/search, sense/example, translation-coverage and responsive UI checks pass; linguistic review is recorded separately from automated validation.

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
