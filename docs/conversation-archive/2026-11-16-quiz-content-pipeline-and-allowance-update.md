# 2026-11-16 — Quiz authoring pipeline and live allowance change

## User request

The user asked to proceed with the next stage of Update 2.4.0 and explicitly requested changing the Quiz allowance on the live Supabase project to Free 1 / Premium 3 daily limits.

## Live Supabase allowance change

Project migration history was checked first. No Quiz schema migrations had been applied to production. The live plan-limit rows were Free Quiz 5/day and Premium Quiz 12/day, both enabled.

A guarded migration was added to the feature branch:
- `supabase/migrations/20261116043139_swiftdictionary_update_2_4_0_quiz_allowance_1_3.sql`

It verifies the exact expected pre-change values, aborts if unexpected Quiz rows or values exist, updates only `public.learning_plan_limits` rows where `activity_type='quiz'`, and verifies the resulting Free 1 / Premium 3 values.

It was applied to live Supabase and recorded as migration version `20261116043139`, name `swiftdictionary_update_2_4_0_quiz_allowance_1_3`. A follow-up query verified Free Quiz 1/day and Premium Quiz 3/day, both enabled. No other activity limits or usage-ledger rows were modified.

No Quiz schema/RPC tables, question content, sessions or frontend were deployed to production. No user data or usage records were changed.

## Content authoring and import pipeline

New files on `feature/update-2-4-0-quiz`:
- `content/quiz/README.md` — authoring and editorial review workflow.
- `content/quiz/curriculum-map.en.json` — 15 English source lesson IDs mapped to topics and difficulty.
- `content/quiz/questions.en-zh.draft.json` — bilingual draft bank.
- `scripts/quiz/validate-question-bank.mjs` — structural/curriculum validator and draft-only SQL exporter.
- `supabase/tests/quiz_draft_content_catalog.sql` — local lesson mapping fixtures.
- `supabase/tests/quiz_draft_content_import_assertions.sql` — database import assertions.
- `.github/workflows/quiz-db-foundation.yml` — PostgreSQL and local Supabase jobs validate and import drafts in disposable test databases.

The current draft bank contains 114 original English-learning / Simplified-Chinese-translation questions:
- Beginner: 30 questions, six each across five source lessons.
- Intermediate: 36 questions across five source lessons (8 + 7 + 7 + 7 + 7).
- Advanced: 48 questions across four source topics (10 academic/professional, 20 advanced grammar, 9 idioms, 9 precise vocabulary).

Every record has an English prompt, Simplified Chinese translation, four bilingual options, one correct option ID and bilingual explanations. The questions are original SwiftDictionary-authored content, not copied from third-party dictionary corpora, textbooks or commercial quiz banks.

The validator checks stable unique IDs, normalized prompt uniqueness, required bilingual fields, four unique English options, answer-key membership and source lesson/topic/difficulty mapping. Its `--emit-sql` mode emits inserts with `status='draft'`; it cannot approve questions. Manual editorial review and a separate approval migration are required before content can be approved. Structural validation does not prove semantic accuracy.

## Validation

Quiz workflow run [#107](https://github.com/WhiteWingCat/wordbook/actions/runs/43805415258) passed both PostgreSQL 17 and disposable local Supabase jobs for the earlier 66-question Beginner/Intermediate pack, including authenticated RPC/session/allowance tests, content import, local Auth helper checks and Supabase security advisors. Pinning Supabase CLI 2.81.3 resolved the earlier GitHub release API rate-limit failure.

The 48-question Advanced batch and expanded 114-row SQL import assertions have since been added. A structural/curriculum check in this session found 114 unique question IDs and prompts, four unique English options per question, matching answer keys, complete bilingual fields and valid source mappings across all three difficulty levels. The 114-row CI run is pending.

The companion 2.3.x workflow run [#829](https://github.com/WhiteWingCat/wordbook/actions/runs/43805415257) passed PostgreSQL 17 migration/allowance tests, Chromium browser regression and local Supabase Auth compatibility.

## Content readiness

The draft counts reach the preferred three-session question-bank targets:
- Beginner: 30 (target 30).
- Intermediate: 36 Intermediate + 30 Beginner support questions (target 36 + 24).
- Advanced: 48 Advanced + 12 Intermediate + 12 Beginner support questions (target 48 + 12 + 12).

All content remains draft and is not available to learners. Availability additionally requires human approval, production import, active matching lesson/topic mappings, the selected translation language and sufficient unseen questions. The current pack supports English learning with Simplified Chinese translation only.

## Legal and privacy review

The content pack adds no learner personal data, analytics or tracking. It uses original authored educational content. Future external-source materials require provenance and licensing checks. The broader Quiz feature still stores account-linked answer/progress data, so the standing Malaysia PDPA and general privacy review remains applicable. The dedicated Terms and Legal update remains scheduled after Flashcards is released to main.

## Current release boundaries

- Production Quiz allowance is Free 1/day and Premium 3/day.
- Production Quiz question-bank/session schema and RPC migrations have not been applied.
- No draft questions have been imported or approved in production.
- Quiz frontend screens and signed-token HTTP/PostgREST/browser tests remain outstanding.
- PR #8 remains draft and unmerged.
- No merge or deployment occurred.

## Next steps

1. Complete the 114-question PostgreSQL and local Supabase CI validation.
2. Perform human editorial QA on the full bilingual draft bank.
3. Create a separate approval migration only after content review.
4. Implement Quiz frontend and signed-token/PostgREST/browser end-to-end tests.
