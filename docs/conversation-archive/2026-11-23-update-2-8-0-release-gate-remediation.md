# 2026-11-23 — Update 2.8.0 release-gate remediation and staging readiness

## Owner instruction and boundaries

The owner requested that the latest Master Development Record and relevant conversation archive be read first, then the remaining release gates and issues be completed before staging preview readiness. Work remains limited to the existing U2.8.0 feature branch. No merge, staging database migration, production migration, production data change or production deployment was performed. Staging activation remains subject to its separate explicit operation approval.

## Documentation and repository baseline reviewed

- Read `docs/MASTER-DEVELOPMENT-RECORD.md`, `docs/UPDATE-2.8.0-DEVELOPMENT-PLAN.md`, the conversation archive index, the U2.8.0 final-planning archive and the U2.8.0 development-start/repository-audit archive.
- Verified PR #16 remains open/draft and targets `main`.
- Current feature branch: `feature/update-2-8-0-chinese-quiz-flashcards`.
- Production `main` remains `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420` as last observed.
- The previous audited head `f91b776d5c885cfaa967340fe086644f55ac4112` had successful Pages, database foundation, PostgreSQL 17, ACL, Chromium, signed-out Flashcards, Chinese dictionary and build-routing checks. The authenticated local Supabase/Auth/RPC workflow was still running at that point.
- Cloudflare Pages preview for `f91b776`: https://92587b07.swiftdictionary.pages.dev

## Release-gate remediation performed

1. Reviewed the Chinese Flashcard data pack. It contains 519 characters, 904 multi-character vocabulary entries and 24 authored phrases. Character and vocabulary sentence-Pinyin fields are currently absent; the runtime's Sentence Recall currently uses the example sentence, not sentence Pinyin. This is recorded as a content-quality limitation for explicit linguistic review rather than silently claimed complete.
2. Reviewed the four Chinese recall-mode runtime paths. Updated the Chinese-selected Translation Recall prompt in `flashcards.js` to describe choosing the closest Chinese equivalent, clarifying its intended direct-equivalent task versus the descriptive clue used by Definition Recall. This is a small copy-only change.
3. Updated PR #16's description to reflect the implementation that is actually present, the six migrations found in the branch, the successful checks at `f91b776`, and the outstanding gates. PR remains draft.
4. Reconciled the migration inventory: the feature branch contains six U2.8.0 SQL migration files, not four as the earlier audit summary stated:
   - `20261123120000_swiftdictionary_update_2_8_0_chinese_review_foundation.sql`
   - `20261123121000_swiftdictionary_update_2_8_0_flashcard_language_and_snapshots.sql`
   - `20261123122000_swiftdictionary_update_2_8_0_chinese_quiz_runtime.sql`
   - `20261123123000_swiftdictionary_update_2_8_0_daily_practice_attempt_metrics.sql`
   - `20261123124000_swiftdictionary_update_2_8_0_quiz_source_composition_guard.sql`
   - `20261123125000_swiftdictionary_update_2_8_0_security_invoker_wrappers.sql`

## Latest feature head and CI state

- Latest feature head after the prompt clarification: `a981ae25622b7a2e5a5b230a1ebc09373ef27cb7`.
- Cloudflare Pages deployment check for this head succeeded.
- Latest-head workflows were in progress when this archive was written: Flashcards, Mock User Flashcards Chromium, Quiz DB foundation, authenticated local Supabase/Auth/RPC, PostgreSQL 17 migration/allowance, Chromium smoke, Supabase CLI Auth compatibility, Chinese dictionary checks, ACL regression and U2.7 lesson-start regression. Do not mark these latest-head checks passed until their final conclusions are read.
- The retired `swiftdictionary-testing` Workers Builds failure remains unrelated to the Pages preview and is not a reason to restore that retired Worker.

## Remaining blockers before staging preview can be called ready

- Await and inspect all latest-head CI conclusions; remediate any actual failures and rerun until green.
- Complete independent linguistic review of Chinese question answer keys, distractors, Pinyin, translations, curriculum links, and all four recall-mode distinctions. Structural validators alone are not language QA.
- Decide whether missing sentence Pinyin for character/vocabulary cards is acceptable under the approved experience; if required, source and validate it rather than generating unsupported pronunciation data.
- Review all six migrations, RLS, RPC execution grants, security-invoker wrappers, and account-/learning-history deletion cascades in disposable local Supabase.
- Verify the latest branch-head Pages preview and its expected staging backend configuration.
- Apply U2.8.0 migrations/content only to isolated staging after explicit staging-operation approval; none of the six U2.8.0 migrations has been applied to staging or production.
- Complete Malaysia/international legal and privacy risk review, including retention, cross-border transfers, 16–17-year-old handling, controller/contact details and DPIA/DPO screening, plus CC BY-SA attribution/share-alike and content licensing. This remains a release gate, not legal clearance.
- Obtain owner staging-preview review and separate release approval. Merge and production deployment remain separately authorised actions.

## Recovery

Continue from `feature/update-2-8-0-chinese-quiz-flashcards` at `a981ae25622b7a2e5a5b230a1ebc09373ef27cb7`. Keep the PR draft. Keep all internal records on `docs/master-development-record`; never merge the documentation branch into production `main`.
