# U2.7.0 — Language-aware permanent Lessons schema design

Date: 2026-11-21  
Status: Proposed technical design only — not an executable migration and not approved for hosted application.

## Problem found in Phase 0

The current Lessons implementation is English-only at the data layer:

- `public.lesson_progress` has no learning-language field and is unique on `(user_id,difficulty,lesson_id)`.
- `public.lesson_practice_results` has no learning-language field and the one-summary-per-lesson unique index is on `(user_id,difficulty,lesson_id)`.
- `private.learning_content_catalog.language_code` currently permits only `en`.
- The lesson-progress insert guard, completion validation and replay-summary validation hardcode `en`.
- The completion trigger records activity as `language_code='en'`.

Simply adding Chinese lesson objects in JavaScript would not create reliably independent progress or secure server-side validation.

## Proposed additive/backward-compatible changes

1. Add `learning_language text not null default 'en'` to `lesson_progress` and `lesson_practice_results`, constrained to `en` and `zh`. Existing rows remain English automatically.
2. Replace the progress uniqueness constraint with `(user_id,learning_language,difficulty,lesson_id)`.
3. Replace `lesson_practice_results_one_per_lesson` with a unique index on `(user_id,learning_language,difficulty,lesson_id)`.
4. Change the private content-catalogue language check to allow `en` and `zh`. Keep existing daily-activity catalogue rows English unless a separately approved future scope adds Chinese Daily Learning.
5. Update the catalogue guard trigger to validate `new.learning_language` instead of hardcoding `en`.
6. Make `learning_language` immutable after a progress row is created, alongside user, difficulty, lesson ID and start time.
7. Add language-aware completion and replay RPC entry points. Preserve the existing English RPC signatures as English wrappers so older clients remain compatible. The new Chinese RPC path must validate language, lesson ID, topic ID and difficulty against the private approved catalogue.
8. Update the completion trigger to store `new.learning_language` in `learning_activity_log.language_code` and `lesson_practice_results.learning_language`.
9. Update frontend progress loading and lookup to filter by learning language. New progress inserts must explicitly include the active learning language.
10. Include learning language in Profile lesson-practice queries/aggregations where needed. Learning-history deletion already deletes both lesson tables by user and should continue to remove both courses' records.

## Allowance rule — preserve existing shared quota

The current completion-limit enforcement counts completed rows by user and activity type, not by language code. Keep that design. English and Chinese permanent lessons must consume the same daily Lessons allowance; a second language must not create a second Free/Premium quota pool. Keep the current plan values, timezone reset, personal testing exemption and completed-only charging unchanged.

## Security and compatibility requirements

- Preserve RLS, user ownership checks, authenticated-only RPC execution, least-privilege grants, SECURITY DEFINER search-path hardening and atomic completion/allowance transaction behavior.
- Do not grant browser access to the private content catalogue.
- Keep existing English progress rows and practice summaries intact as `en`.
- Preserve completed lesson replay without consuming another allowance.
- Keep learning-language identity separate from translation language. Translation preference must never change which course's progress is being read or written.
- No hosted Supabase migration is authorised by this design. Validate only in disposable local PostgreSQL/Supabase CI first. Staging application requires explicit owner approval; production remains separately gated.

## Required regression tests

- Legacy English progress remains visible and completable after migration.
- Same user can have English and Chinese lessons with the same lesson ID and difficulty without colliding.
- Progress and practice summaries are isolated by learning language.
- Unapproved language/content IDs are rejected by the database, not merely hidden by the frontend.
- Direct REST completion updates remain denied; authenticated RPC completion is atomic and idempotent.
- Chinese and English completions both consume the same shared daily lesson limit.
- A quota rejection rolls back the progress completion and activity/practice writes.
- Replaying a completed Chinese lesson does not consume another allowance and records at most one language-specific practice summary.
- Account isolation, account switching, history deletion, RLS and the personal test exemption continue to work.
