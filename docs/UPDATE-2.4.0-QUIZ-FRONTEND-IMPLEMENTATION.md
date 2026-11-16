# SwiftDictionary Update 2.4.0 — Quiz frontend implementation

## Scope

This stage replaces the Quiz placeholder with an authenticated Quiz experience on the existing five-page application. It is implemented on `feature/update-2-4-0-quiz` and is not deployed to the live website.

## Learner experience

- Signed-out visitors see a sign-in prompt. Quiz sessions and history are account-scoped.
- The overview shows the server-reported daily allowance, configured timezone, active-session prompt, difficulty availability and completed Quiz history.
- Beginner sessions contain 10 questions, Intermediate 15 and Advanced 20.
- Difficulty availability is taken from `get_my_quiz_availability`; the browser does not infer readiness from local content counts.
- The UI shows approved question-bank counts and explains minimum/target readiness and server-reported blockers.
- An unfinished session can be resumed. The backend remains authoritative for the one-active-session-per-account rule.
- Questions have four server-shuffled answer options. Learners can move backward/forward and change selections until submission.
- Each answer and current position are saved through an authenticated RPC. Closing/reloading the page does not intentionally abandon the session.
- Submission requires every question to be answered and asks for confirmation.
- Completed results show score and rounded percentage without pass/fail, followed by a full answer and explanation review.
- Completed sessions appear in account-scoped Quiz history and can be reviewed later.
- Abandonment requires explicit confirmation and explains that issued questions remain unavailable for reuse that local day.

## RPC integration

The frontend uses only these public authenticated RPC wrappers:

- `get_my_quiz_availability`
- `start_my_quiz`
- `get_my_active_quiz`
- `save_my_quiz_answer`
- `submit_my_quiz`
- `abandon_my_quiz`
- `get_my_quiz_history`
- `get_my_quiz_review`

The browser does not query `private.quiz_question_bank`, `private.quiz_sessions` or `private.quiz_session_questions` directly. Answer keys and explanations are returned only by the completed-review RPC path. The frontend does not accept or submit a user ID; ownership is derived server-side from the authenticated session.

## Language behaviour

The active session stores its learning/translation language pair. The frontend renders the translation snapshot returned for that session rather than looking up current preferences mid-session. The current draft content pack supports English learning with Simplified Chinese translation. Other translation pairs remain unavailable until matching content is reviewed, approved and imported.

## Validation added

- `scripts/quiz/validate-quiz-frontend.mjs` extracts the main inline application script and parses it with Node's JavaScript parser.
- It asserts that the required Quiz screens and RPC integrations are present.
- It guards against direct browser queries to the private Quiz tables.
- The Quiz database workflow now runs this frontend validation alongside its PostgreSQL and disposable local Supabase jobs.

A separate runtime/browser test with authenticated test sessions is still required before the frontend can be considered fully validated. The static validator is not a substitute for that test or for owner testing.

## Release and data boundaries

- All 114 authored questions remain draft and unpublished.
- No Quiz schema/RPC migration or question content was applied to production.
- No production website deployment or PR merge was performed.
- The live Supabase Quiz allowance-only change (Free 1/day, Premium 3/day) remains the only production Quiz change and was independently verified.
- The frontend adds no analytics, advertising trackers or external content sources.
- Quiz answers/selections, session state, score and history are account-linked learning data. The database design already provides account-scoped storage and learning-history deletion. The temporary same-day question reservation ledger is a separate minimal record retained until expiry to prevent reuse after history deletion.
- Malaysia PDPA and general privacy review remains required before release. Review the privacy notice's explanation of stored Quiz progress, answer selections, history deletion and temporary reservation retention. This document is not legal advice or a compliance certification.

## Next validation steps

1. Confirm the frontend static-validation job passes in GitHub Actions.
2. Run authenticated browser tests against disposable local Supabase with synthetic users and an approved test-only content fixture. Do not approve or publish the 114 production draft questions to enable testing.
3. Verify signed-out gating, Free/Premium allowance presentation, difficulty readiness states, answer persistence/change, resume after reload, abandonment, submit scoring, full review, history, language snapshot and account switching.
4. Keep PR #8 in draft until the runtime tests and owner review are complete.
5. Do not merge, deploy or apply the Quiz schema/content to production without explicit approval.
