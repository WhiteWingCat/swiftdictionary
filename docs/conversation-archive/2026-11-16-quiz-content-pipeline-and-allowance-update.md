# 2026-11-16 — Quiz authoring pipeline and live allowance change

## User request

The user asked to proceed with the next stage of Update 2.4.0 and explicitly requested changing the Quiz allowance on the live Supabase project to the agreed Free 1 / Premium 3 daily limits.

## Live Supabase allowance change

Project migration history was checked first. No Quiz schema migrations had been applied to production. The live plan-limit rows were:
- Free Quiz: 5/day, enabled.
- Premium Quiz: 12/day, enabled.

A guarded, narrowly scoped migration was added on the Quiz feature branch:
- `supabase/migrations/20261116123000_swiftdictionary_update_2_4_0_quiz_allowance_1_3.sql`

The migration verifies that exactly the expected Free 5 and Premium 12 enabled Quiz rows exist, aborts on unexpected values or extra Quiz rows, updates only `public.learning_plan_limits` rows for `activity_type='quiz'`, and verifies the resulting Free 1 / Premium 3 values.

It was applied to the live Supabase project. The platform recorded:
- Version: `20261116043139`
- Name: `swiftdictionary_update_2_4_0_quiz_allowance_1_3`

Post-migration query verified:
- Free Quiz: 1/day, enabled.
- Premium Quiz: 3/day, enabled.

No other activity limits, usage-ledger rows, users, sessions, or learning history were modified. The Quiz schema/RPC migrations and question content remain unapplied to production.

## Content authoring and import pipeline

New files on `feature/update-2-4-0-quiz`:
- `content/quiz/README.md` — authoring and editorial review workflow.
- `content/quiz/curriculum-map.en.json` — source lesson IDs mapped to topics and difficulty.
- `content/quiz/questions.en-zh.draft.json` — original bilingual draft batch.
- `scripts/quiz/validate-question-bank.mjs` — structural/curriculum validation and SQL export.
- `supabase/tests/quiz_draft_content_catalog.sql` — local lesson mapping fixtures.
- `supabase/tests/quiz_draft_content_import_assertions.sql` — database import assertions.
- `.github/workflows/quiz-db-foundation.yml` — PostgreSQL and local Supabase jobs extended to validate and import draft content in disposable test databases.

Batch 01 has 30 Beginner questions, four mapped to each of five live English permanent lesson IDs:
- `b-verb-combinations` → `everyday-vocabulary`
- `b-articles` → `nouns-and-articles`
- `b-countable-nouns` → `nouns-and-quantity`
- `b-sentence` → `sentence-basics`
- `b-present` → `verb-tenses`

Every record has an English prompt, Simplified Chinese translation, four bilingual options, one correct option ID, and bilingual explanations. The batch is original SwiftDictionary-authored content, not copied from third-party dictionary corpora, textbooks or commercial quiz banks.

The validator checks stable unique IDs, normalized prompt uniqueness, required bilingual fields, four unique options, answer-key membership, and source lesson/topic/difficulty mapping. Its `--emit-sql` mode emits an insert script that explicitly sets every row to `status='draft'`; it cannot approve questions. The CI workflow tests this generated SQL against disposable PostgreSQL and local Supabase databases, asserting 20 rows, five mapped topics, valid four-option rows and zero approved questions.

A separate manual editorial review and separate approval migration are required before content can be approved. Structural validation does not prove that an answer is semantically correct or that distractors are unambiguous.

## Content readiness

- Beginner: 30 draft questions across five topics. Reaches the preferred three-session target but remains unavailable until manual approval and import.
- Intermediate: not yet authored. Minimum 24 Intermediate + 16 Beginner; preferred target 36 + 24.
- Advanced: not yet authored. Minimum 32 Advanced + 8 Intermediate + 8 Beginner; preferred target 48 + 12 + 12.
- Availability counts only approved content with an active, matching permanent lesson/topic mapping and the selected translation language.
- Current content batch supports English learning with Simplified Chinese translation only. Other translation languages remain unavailable until matching content is created and approved.
- Draft content has not been imported into production. No difficulty is enabled by this batch.

## Legal and privacy review

The content pack adds no learner personal data, analytics or tracking. It uses original authored educational content. Future external-source materials require provenance and licensing checks. The broader Quiz feature still stores account-linked answer/progress data, so the standing Malaysia PDPA and general privacy review remains applicable. The dedicated Terms and Legal update remains scheduled after Flashcards is released to main.

## Current release boundaries

- Production Quiz allowance is now Free 1/day and Premium 3/day.
- Production Quiz question-bank/session schema and RPC migrations have not been applied.
- No draft questions have been imported or approved in production.
- Quiz frontend screens and signed-token HTTP/PostgREST/browser tests remain outstanding.
- PR #8 remains draft and unmerged.
- No merge or deployment occurred.

## Next steps

1. Continue with additional Beginner questions to reach the 30-question target.
2. Author and review Intermediate and Advanced batches to their preferred three-session targets.
3. Perform manual editorial QA and create a separate approval step only after the owner reviews the content.
4. Run complete PostgreSQL/local Supabase validation, then implement Quiz frontend and end-to-end browser tests.
