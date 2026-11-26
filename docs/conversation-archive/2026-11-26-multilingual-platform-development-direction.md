# Multilingual development workflow discussion and owner decisions

**Date:** 2026-11-26  
**Project baseline:** SwiftDictionary Update 2.9.1  
**Documentation branch:** docs/master-development-record  
**Status:** Architectural direction recorded; Update 3.0 scope and implementation remain unapproved.

## Purpose

Before preparing Update 3.0, the owner raised a long-term development concern: adding Malay will require a new dictionary and its own Lessons, Quiz and Flashcards, while existing English and Simplified Chinese courses need translation/integration. Each additional language could make future development progressively slower. The objective is to control engineering and maintenance growth without compromising accuracy.

## Owner decision: independently authored curricula

The owner explicitly decided that every language should be allowed to have its own independently authored educational content. English must not be treated as the permanent master curriculum or linguistic authority. A shared schema and stable identifiers should enable interoperability and translation relationships without forcing identical curricula, literal translation, or artificial one-to-one content parity.

Language-specific examples, explanations, grammar, question design and pedagogical approaches may differ. Translation should convey intended meaning and learning objective, not merely reproduce wording.

## Proposed development structure

The discussion established the following recommended direction for the MDR:

1. **Shared platform + language packages.** Shared Dictionary/Lessons/Quiz/Flashcards engines, preferences, progress, allowances, loading, translation lookup, validation and regression infrastructure should be reusable. Each language package supplies metadata, dictionary data, independently authored curriculum, translations and bounded language-specific processing adapters.
2. **Standard, versioned schemas.** Define reusable structures for language metadata, dictionary entries/senses, lessons/objectives/practice, quiz items/answers/explanations, flashcards, translation records, provenance/review status and schema/content versions. Keep optional language-specific extensions.
3. **Separate learning language from support language.** The learning language determines the studied content and linguistic processing. The support language provides translations/explanations. A language can be available as a support language before it is selectable as a learning course. Translation coverage alone does not make a course launch-ready.
4. **Stable IDs and translation registry.** Link related content with stable identifiers where appropriate. Track source/target language, content identity/type, source revision, translation version, status, review/provenance and staleness. Independently authored target-language items are not falsely classified as translations.
5. **Repeatable content pipeline.** Author/prepare → structural validation → consistency validation → linguistic/educational review → import → runtime verification → cross-language regression/release.
6. **Three QA levels.** Level 1 automated schema/reference/duplicate/completeness/answer checks; Level 2 human linguistic and educational review; Level 3 application/runtime and cross-language regression. Report these outcomes separately.
7. **Language adapters.** Avoid scattering language-specific assumptions through shared code. Support language-specific tokenisation, morphology, search/input normalisation, pronunciation, scripts and other requirements through explicit capability contracts.
8. **Regression safeguards.** Every language change must test the new language and affected existing languages. Continue verifying immediate learning/support-language refresh, progress, allowances, account isolation and existing functionality.
9. **Operational safeguards.** Retain focused branches, rolling three-branch policy, docs/main separation, explicit owner approval for merge and production changes, Cloudflare Pages-only deployment, free unlimited dictionary search, low-cost tooling and existing legal/privacy review rules.
10. **Success measures.** Track shared code changes per language, repeat work removed, automated defect detection, human approval coverage, translation completeness/staleness, cross-language regression and actual reduction in future launch effort.

## Owner's forward-looking translation idea

The owner proposed preparing translations for future languages (examples: Japanese and Korean) while working on Malay, even if those languages are not yet planned as selectable learning courses. The goal is to spread translation work over time so later launches have less concentrated translation effort.

**Recommendation recorded:** Adopt a staged, demand-aware translation-readiness strategy rather than translating every item into every conceivable language immediately.

- Register and make all new content translation-ready from creation: stable ID, context, learning objective, terminology and source revision.
- Separate background support-language translations from selectable learning-course availability.
- Prioritise stable, high-value, reusable content first (shared UI, common instructions, core dictionary meanings, foundational lesson explanations).
- Keep a coverage matrix and explicit statuses: not started, draft/machine-assisted, reviewed, approved, stale or not applicable.
- Machine translation is draft assistance only; it is never automatic approval.
- Avoid uncontrolled pairwise translation growth (roughly quadratic as language count grows).
- Do not make English the master curriculum. Translate from the language in which an item is authored where appropriate; a pivot language may be a workflow convenience but not an authority. Allow adaptation and independently authored equivalents.
- Keep background translations inactive until reviewed and until the target language's learning-course launch gates are met.
- Evaluate whether advance translation work actually reduces future launch workload; do not spend effort on low-priority material with no plausible use.

## Update 3.0 implications

Malay should be the first real proving case for the shared platform, package structure, translation registry and content pipeline. Audit current code/data assumptions first, then design incremental changes that preserve English/Chinese compatibility. The exact translation matrix, background Japanese/Korean scope, package/database boundaries, IDs, adapters, providers, review workflow, migration strategy, phases and release gates remain open for the separate U3.0 planning process.

No U3.0 implementation, schema, migration, production action or exact translation matrix was authorised by this discussion.

## Legal, privacy and provenance

The existing standing legal-risk planning check remains mandatory for language/content expansions: Malaysia PDPA and amendments, international privacy and cross-border processing, 16+ age-related safeguards, third-party dictionary/corpus/example/pronunciation/font licences and provenance, translation-provider data handling, and consumer/payment rules if future monetisation changes. This is planning, not legal advice or compliance clearance. Prefer original content and record provenance.

## Recovery point for a future conversation

Start from the latest MDR section titled **“Multilingual platform and language-expansion development structure — owner-approved direction (2026-11-26)”**. Treat Update 2.9.1 as the production baseline. Do not start implementation or finalise U3.0 scope until the owner asks to begin that planning. Revisit the open decisions listed in the MDR, especially the English/Chinese/Malay directional translation matrix and the limited background translation queue for future support languages.

