# Update 2.4.0 — authenticated Quiz question-type support

**Date:** 2026-11-17  
**Conversation:** Approve Chinese Distribution Development — authenticated backend continuation  
**Repository:** `WhiteWingCat/wordbook`  
**Implementation branch:** `feature/update-2-4-0-quiz`  
**Pull request:** #8 (draft, open, unmerged)

## Owner authorisation and scope

The owner asked to continue the recommended backend stage: expand and validate authenticated question-type support, while keeping production untouched. Human bilingual accuracy review remains a separate gate before content approval or main-branch release.

The approved content scope remains the 199-question draft pack:
- 114 knowledge questions (30 Beginner, 36 Intermediate, 48 Advanced).
- 15 word-definition questions (five per difficulty).
- 70 Chinese-translation questions (21 Beginner, 21 Intermediate, 28 Advanced).

Every item must retain a valid `learning_objective_id` belonging to its mapped permanent English lesson. Session lengths and source-difficulty composition remain unchanged (Beginner 10; Intermediate 12 Intermediate + 3 Beginner; Advanced 12 Advanced + 6 Intermediate + 2 Beginner).

## Implementation

Added feature-branch migration:
- `supabase/migrations/20261117180000_swiftdictionary_update_2_4_0_quiz_authenticated_question_types.sql`

The migration extends the private question bank and immutable issued-question snapshots with:
- `question_type`: `knowledge`, `word_definition`, or `chinese_translation`.
- `answer_language_code`: English for knowledge/definition items; Simplified Chinese for Chinese-translation assessment items.
- `learning_objective_id` and a matching session snapshot field.

The authenticated session payload now returns question type, answer language and learning-objective metadata without exposing answer keys before submission. Snapshot immutability guards include the new fields.

The authenticated selector now:
- Includes exactly one word-definition item in each session.
- When the learner's translation preference is Simplified Chinese, includes a stable pseudorandom 1–7 Chinese-translation items per account, local allowance date and difficulty.
- Excludes Chinese-translation assessment items when the translation preference is English.
- Fills remaining source-difficulty slots with knowledge questions.
- Preserves the existing 10/15/20 session lengths, approved source-difficulty composition, same-day cross-session question non-reuse, topic diversity and 40% topic cap.
- Requires objective-linked question records and type-specific bank capacity before availability is reported.

Updated `scripts/quiz/validate-question-bank.mjs` to export all 199 questions with type, answer language and objective metadata. The exporter imports everything as `draft`; it never approves content. Updated the content authoring README, SQL import assertions, authenticated SQL fixtures and CI workflow.

## Validation and corrections

- GitHub Actions Quiz workflow **#473** (run ID `44064776337`) passed:
  - PostgreSQL 17 schema/migration and authenticated RPC/session/allowance tests.
  - All 199 draft rows imported in the disposable PostgreSQL test database, with expected type and difficulty counts, valid lesson mappings/objective IDs, and zero approved rows.
  - Disposable local Supabase Auth/RPC integration.
  - Authenticated Chromium Quiz runtime tests.
  - Supabase security advisors.
  - Disposable local services were stopped after testing.
- The first implementation run **#465** exposed a malformed JavaScript string in the SQL exporter; it was corrected.
- A subsequent authenticated integration attempt exposed a mismatch between the synthetic test bank's translation-language code and its English test preference. The fixture was aligned with its intended English-only test path.
- A follow-up SQL integration test was added to exercise a Chinese-preference authenticated Beginner session, checking 1–7 Chinese-translation questions, exactly one definition question, preserved Chinese answer-language metadata and free abandonment. Its follow-up workflow **#477** is pending at the latest record update.
- Companion 2.3.x regression workflow #998 was queued with the follow-up commit; its result is not yet recorded.

## Production, staging and release boundaries

- No production Quiz schema/RPC migration, content import, learner-data operation or production configuration change was performed.
- No production website deployment, merge to `main`, or PR #8 merge occurred.
- The only existing production Quiz change remains the previously authorised allowance update: Free 1/day and Premium 3/day.
- The separately created Supabase staging project remains empty. The clean-schema bootstrap blocker is unresolved; no staging migration or content import was attempted.
- PR #8 remains open, draft and unmerged.

## Legal, privacy and content gates

This is a schema/payload extension for existing Quiz content and does not add a new learner personal-data category or new analytics/tracking. Existing Quiz processing of account-linked answer selections, scores, session history, timezones and temporary no-repeat reservations remains subject to the standing Malaysia PDPA and applicable international/16+ privacy review, including retention/deletion wording, cross-border processing and provider disclosures. This is planning guidance, not legal advice or compliance certification.

All 199 questions remain draft. Structural validation, objective-link checks and automated tests do not establish educational accuracy or bilingual quality. Human review must check factual correctness, natural English and Simplified Chinese, one unambiguous correct answer, plausible distractors, appropriate difficulty and explanations. Do not approve or publish the bank until that review is complete and the owner explicitly approves.

## Recovery point and next actions

1. Confirm follow-up workflow #477 passes the new authenticated Chinese-mix SQL test and all local Supabase/Auth/browser/security jobs.
2. Resolve any failures before treating authenticated question-type support as complete.
3. Keep production untouched and PR #8 draft/unmerged.
4. Complete the human bilingual accuracy review of all 199 questions before any content approval.
5. Revisit the staging clean-schema bootstrap separately. Only after it is safely validated should staging migrations/import and authenticated staging-account testing proceed.
6. Keep content approval, production migration, merge and deployment as separate explicit approval gates.
