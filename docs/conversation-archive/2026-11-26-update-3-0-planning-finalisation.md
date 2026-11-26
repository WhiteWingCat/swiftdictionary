# SwiftDictionary Update 3.0.0 — planning finalisation (2026-11-26)

## Purpose and source review

The owner asked to read the current Master Development Record and relevant conversation archives before preparing U3.0. The reviewed source of truth identifies U2.9.1 as the production baseline, U3.0 as Malay expansion, U3.1 as Fill-in-the-Blank typing questions, and U3.2 as Games/Wordmine.

The owner has now confirmed:
- Older code must be brought up to the U3.0 implementation architecture.
- The modernisation explicitly includes English and Simplified Chinese code and data structures, not only Malay.
- No staging preview is to be provided before Phase 3 is complete.
- All later phases after Phase 3 must remain in the plan and be completed; the Phase 3 preview gate does not mean U3.0 is finished.
- Malay must follow Malaysian Standard Malay (Bahasa Melayu Malaysia).

## Final U3.0 scope

U3.0 is a shared-platform modernisation and Malay language expansion. English, Simplified Chinese and Malay must operate through a consistent language-independent platform with independently authored language packages and language-specific processing adapters.

Included:
- Legacy code/data modernisation for English and Simplified Chinese as well as Malay.
- Versioned shared schemas, language registry/capability contract, stable content IDs and translation registry.
- Malay Dictionary, Lessons, Daily Learning (all four categories), Quiz and Flashcards.
- Cross-language support/translation coverage and source-revision tracking.
- Full migration, compatibility and regression work to preserve existing content, progress, allowances, history, account isolation and user workflows.

Excluded:
- U3.1 typing questions.
- U3.2 Games/Wordmine.
- Japanese/Korean selectable courses (future U4.0/U5.0).
- Premium checkout/payment/subscription activation.
- Any limit on free unlimited dictionary search.

## Final phase sequence

1. **Phase 0 — Legacy architecture and production audit:** inventory old English/Chinese structures, hard-coded language assumptions, code/data paths, Supabase schema/RPC/RLS/migration history, content IDs and compatibility risks. Live inspection is read-only.
2. **Phase 1 — Shared architecture and legacy modernisation:** implement language registry, package contracts, schemas, translation registry, stable IDs, shared content loaders/validators; refactor English and Chinese onto this architecture; preserve old records and progress.
3. **Phase 2 — Malay Dictionary:** Malaysian Standard Malay dictionary package, morphology-aware search/processing, senses, POS, pronunciation, examples, related terms, support translations and free unlimited lookup.
4. **Phase 3 — Malay learning foundation and staging-preview gate:** independently authored Beginner/Intermediate/Advanced Lessons, reader/practice/progress, and all four Daily Learning categories (Daily Topic, Daily Application, Daily Discovery, adaptive Daily Revision); integrate with shared allowance semantics and support-language infrastructure. Complete internal verification before any preview handoff. A preview may be provided after Phase 3, with unfinished later phases clearly disclosed.
5. **Phase 4 — Malay Quiz:** authored bank, language-appropriate distractors/explanations, secure server-side answer validation, progress/review/allowance integration.
6. **Phase 5 — Malay Flashcards:** Malay-authored cards and suitable recall modes, sessions, review/mastery/progress and allowance integration.
7. **Phase 6 — Translation integration and coverage closeout:** complete actual English/Simplified Chinese/Malay launch coverage by content type and direction; resolve or explicitly mark gaps; test refresh/fallback/staleness; optional reviewed background Japanese/Korean translations remain inactive.
8. **Phase 7 — Full QA and release rollout:** full automated/manual linguistic QA, migration/security/accessibility/responsive/regression matrix, legal/privacy/licensing review, Live migration preflight/approval/application/verification before dependent main merge, README release update and verified Cloudflare Pages production deployment.

## Architecture decisions

- English is not the permanent master curriculum. Each language may have independently authored dictionary, lessons, examples, Quiz questions, explanations and Flashcards.
- Learning language and support/translation language are separate concepts.
- Shared engines handle common interaction and data contracts; language adapters handle language-specific morphology, tokenisation, scripts, input normalisation, pronunciation and other capabilities.
- Stable IDs and optional cross-language relationships must support concepts without one-to-one equivalents.
- Translation records are versioned and status-tracked. Machine-assisted translations are drafts, not approved educational content. A changed source marks affected translations for review; reviewed translations are not silently overwritten.
- Missing translations are explicit and must never silently display the wrong language.
- U3.0 translation coverage is based on a measured English/Simplified Chinese/Malay content inventory, not assumptions based on selectors.

## Allowance and compatibility rules

- Preserve established allowance amounts, reset at configured local midnight, completion-only Daily Learning charging, resume/review behaviour and cross-course shared buckets.
- Do not create per-language allowance pools.
- Preserve all existing English/Chinese dictionary data, lesson and Quiz progress, Flashcard sessions/history, preferences, saved words, collections, account ownership and deletion semantics.
- Keep RLS and server-side answer-key security.
- Dictionary word-grid search remains free and unlimited.
- No Premium payment/subscription activation in U3.0.

## Legal/privacy and content review

Apply the standing Malaysia-specific and international legal/privacy check: PDPA and 2024 amendments, controller/processor roles, cross-border data flows, intended 16+ audience and jurisdiction-specific younger-user rules, content corpus/font/pronunciation licensing, translation provider terms, data minimisation, retention, accessibility and security. This is planning, not legal advice or legal clearance.

Malay content must follow Malaysian Standard Malay and be reviewed for Malaysian spelling, vocabulary, register and natural usage; avoid accidental Indonesian localisation. Record automated validation separately from competent human linguistic review.

## Release workflow and boundaries

- Current production remains U2.9.1.
- Application work belongs on a focused feature branch from current `main`; MDR, plan and archive belong on `docs/master-development-record`.
- Cloudflare Pages is the only active build/deployment path; Workers Builds is retired.
- No staging preview before Phase 3 completion. Phase 4–7 remain required after that preview gate.
- No Live migration, production data mutation, merge or deployment without explicit owner approval. For DB-dependent releases, apply and verify the approved Live migration before merging dependent code to `main`.
- Update root README for actual main-branch release changes.
- Use website-created prompts/dropdowns, consistent UI patterns, responsive/reduced-motion design and truthful test reporting.
- Heavy data analysis stays sequential and small-batch; one consolidated deliverable only after a complete validated phase.

## Status and recovery point

- U3.0 plan is finalised; implementation has not been started by this planning session.
- No feature branch, source-code changes, Supabase migration, staging preview, production merge or deployment was created/performed.
- Root `README.md` was corrected on `main` to identify U2.9.1 as the current release and document U2.9.0/U2.9.1. See commit `0f24b0f65f136f793c831bcb04b2802dbdae5f49`.
- The README update is a documentation-only production-branch correction explicitly requested by the owner; it does not change application code or deploy a new product feature.
- Next implementation action: create a focused U3.0 feature branch from the latest `main` and begin Phase 0 read-only audit.
