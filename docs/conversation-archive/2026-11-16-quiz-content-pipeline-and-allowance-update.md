# 2026-11-16 — Quiz authoring pipeline and live allowance change

## User request

The user asked to proceed with the next stage of Update 2.4.0 and explicitly requested changing the Quiz allowance on the live Supabase project to Free 1 / Premium 3 daily limits.

## Live Supabase allowance change

Project migration history was checked first. No Quiz schema migrations had been applied to production. The live plan-limit rows were:
- Free Quiz: 5/day, enabled.
- Premium Quiz: 12/day, enabled.

A guarded, narrowly scoped migration was added to the feature branch:
- `supabase/migrations/20261116043139_swiftdictionary_update_2_4_0_quiz_allowance_1_3.sql`

It verifies that exactly the expected Free 5 and Premium 12 enabled Quiz rows exist, aborts on unexpected values or extra Quiz rows, updates only `public.learning_plan_limits` rows for `activity_type='quiz'`, and verifies the resulting Free 1 / Premium 3 values.

It was applied to the live Supabase project. The platform recorded:
- Version: `20261116043139`
- Name: `swiftdictionary_update_2_4_0_quiz_allowance_1_3`

Post-migration query verified:
- Free Quiz: 1/day, enabled.
- Premium Quiz: 3/day, enabled.

No other activity limits, usage-ledger rows, users, sessions or learning history were modified. The Quiz schema/RPC migrations and question content remain unapplied to production.

## Content authoring and import pipeline

New files on `feature/update-2-4-0-quiz`:
- `content/quiz/README.md` — authoring and editorial review workflow.
- `content/quiz/curriculum-map.en.json` — 15 English source lesson IDs mapped to topics and difficulty.
- `content/quiz/questions.en-zh.draft.json` — original bilingual draft bank.
- `scripts/quiz/validate-question-bank.mjs` — structural/curriculum validator and draft-only SQL exporter.
- `supabase/tests/quiz_draft_content_catalog.sql` — local lesson mapping fixtures.
- `supabase/tests/quiz_draft_content_import_assertions.sql` — database import assertions.
- `.github/workflows/quiz-db-foundation.yml` — PostgreSQL and local Supabase jobs validate and import drafts in disposable test databases.

Current draft content:
- Beginner: 30 questions, six each across five source lessons:
  - `b-verb-combinations` → `everyday-vocabulary`
  - `b-articles` → `nouns-and-articles`
  - `b-countable-nouns` → `nouns-and-quantity`
  - `b-sentence` → `sentence-basics`
  - `b-present` → `verb-tenses`
- Intermediate: 36 questions across five source lessons:
  - `i-collocations` → 8 questions
  - `i-conditionals` → 7 questions
  - `i-phrasal` → 7 questions
  - `i-perfect` → 7 questions
  - `i-word-families` → 7 questions

Every record has an English prompt, Simplified Chinese translation, four bilingual options, one correct option ID and bilingual explanations. The questions are original SwiftDictionary-authored content, not copied from third-party dictionary corpora, textbooks or commercial quiz banks.

The validator checks stable unique IDs, normalized prompt uniqueness, required bilingual fields, four unique English options, answer-key membership and source lesson/topic/difficulty mapping. Its `--emit-sql` mode emits inserts with `status='draft'`; it cannot approve questions. Manual editorial review and a separate approval migration are required before content can be approved. Structural validation does not prove semantic accuracy or eliminate ambiguous distractors.

## Validation

Quiz workflow run [#107](https://github.com/WhiteWingCat/wordbook/actions/runs/43805415258) passed both jobs:
- PostgreSQL 17: Quiz migrations, authenticated RPC/session/allowance tests, content validator, generated SQL import and database assertions.
- Disposable local Supabase: real Auth helpers, authenticated Quiz RPC integration, generated SQL import and Supabase security advisors.

Both environments imported 66 draft rows (30 Beginner and 36 Intermediate), verified ten source-topic groups, valid lesson mappings and four-option rows, and confirmed zero approved questions. Pinning Supabase CLI 2.81.3 resolved the earlier GitHub release API rate-limit failure in run 104.

The companion 2.3.x workflow run [#829](https://github.com/WhiteWingCat/wordbook/actions/runs/43805415257) passed PostgreSQL 17 migration/allowance tests, Chromium browser regression and local Supabase Auth compatibility.

## Content readiness

- Beginner: 30 draft questions across five topics, reaching the preferred three-session target by count.
- Intermediate: 36 draft questions across five topics, reaching the preferred target by count; the 30 Beginner drafts exceed its 24-question Beginner support target.
- Advanced: not authored yet. Minimum 32 Advanced + 8 Intermediate + 8 Beginner; preferred target 48 + 12 + 12.

Beginner and Intermediate remain unavailable because all content is draft. Availability also requires approved content, active matching lesson/topic mappings, the selected translation language and enough unseen questions. The current pack supports English learning with Simplified Chinese translation only.

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

1. Author the Advanced batch to its preferred three-session target.
2. Perform human editorial QA on the Beginner and Intermediate drafts.
3. Create a separate approval migration only after content review.
4. Run full validation, then implement Quiz frontend and signed-token/PostgREST/browser end-to-end tests.
