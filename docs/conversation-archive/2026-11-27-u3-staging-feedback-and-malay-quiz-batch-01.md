# SwiftDictionary U3.0 — Staging feedback corrections and Malay Quiz batch 01

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Documentation branch:** `docs/master-development-record`  
**Staging Supabase:** `ivatvkfrtifgfheeaelj`  
**Production:** untouched

## Owner feedback and fixes

The owner reviewed the Phase 3 staging preview and reported four Malay-specific display/review issues plus one navigation-state issue.

1. **Malay support-language selector:** removed the rule that disabled the Malay target option solely because the learning course was Malay. Both the Dictionary selector and Profile preference selector now enable Malay when the complete Malay Dictionary target corpus is available. The existing content renderer resolves the Malay native wording when Malay is selected as its own display language; English and Simplified Chinese remain available as Malay-course support languages.
2. **Daily Application option rendering:** the shared Daily Learning option renderer now recognises structured multilingual option records. For Malay it renders `option.ms` as the primary answer and the selected English/Simplified Chinese support field beneath it. String options remain supported, and Chinese pinyin rendering is unchanged. This removes object/placeholder output such as `[option option]`.
3. **Malay permanent Lesson review from Daily History:** the review action previously resolved only English and Chinese lesson catalogues. It now resolves `SWIFT_MALAY_LESSONS[difficulty]` for `ms`, allowing the original Malay lesson and its practice answers to open in read-only review. The history row still uses the saved completion timestamp and language code.
4. **Learning Progress language label:** active-language labels now resolve through `SWIFT_LANGUAGE_REGISTRY`, so `ms` displays as “Malay” instead of the raw code.
5. **Quiz unavailable-state copy:** removed the stale hard-coded “Chinese Quiz is coming soon” wording from the translation layer. The unavailable panel is recomputed from the current learning-language capability on each render and uses neutral language-specific copy. Existing Chinese Quiz capability remains enabled.

Implementation commits include:
- `02dca63` — selector, Daily History timestamp fallback, registry-based language label and capability-derived Quiz state.
- `36a03f5` — structured Malay Daily Application option rendering.
- `e9e3be1` — Malay permanent Lesson read-only review lookup.
- `84a5b48` — remove stale Chinese Quiz unavailable copy.
- `048a053` — correct Malay review catalogue selection by difficulty.
- `604e6b6` — add static regression tests and CI validator wiring.

The initial CI attempt exposed an imbalance in the first Quiz draft batch (five Beginner, four Intermediate and three Advanced questions). The bank was corrected to four questions per difficulty in both support-language packs; the latest CI rerun is pending. Do not treat the initial failed validator run as a successful test.

## Malay Quiz — first authoring batch

Added a draft-only Malay Quiz question bank using the existing Quiz content model:
- `content/quiz/questions.ms-en.draft.json`: 12 Malay questions with English support text.
- `content/quiz/questions.ms-zh.draft.json`: 12 Malay questions with Simplified Chinese support text.
- `content/quiz/curriculum-map.ms.json`: initial lesson/topic/objective mappings.
- `scripts/quiz/validate-malay-question-bank.mjs`: pair, metadata, option uniqueness, answer identity, difficulty and draft-state validator.
- `tests/malay-quiz-draft.test.mjs`: regression test for both language pairs.
- `tests/u3-phase3-staging-feedback.test.mjs`: static coverage for the five reported UI issues.
- Updated Malay language manifest with Quiz draft inventory; capability deliberately remains `quiz:false`.

The initial 12 questions are independently authored and cover four questions per difficulty. Content and translations remain drafts; owner Malaysian Standard Malay and independent support-language review is pending. This is only the first content batch, not a complete Quiz bank and not an approved release.

## Security and database boundary

No Quiz schema, Quiz RPC, allowance, Auth/RLS, question-bank, or catalogue database change was applied. The existing Quiz engine has separate English and Chinese runtime paths and private answer-key snapshots. Malay needs an equivalent server-side path that:
- checks the active registered `ms` learning language and selected `en` or `zh` support language;
- returns only question prompts and option text before completion;
- keeps correct-option IDs and explanations private until completed review;
- validates source lesson/topic/objective against the active Malay permanent-lesson catalogue;
- uses the existing one-active-session, no-repeat reservation, completion-only allowance and timezone logic;
- preserves existing English/Chinese Quiz behavior and history-deletion semantics.

The first batch is below the current production Quiz availability thresholds and cannot start a session. Do not enable Malay Quiz capability or expose a playable entry point until the full bank, language-aware RPC path, staging migration and end-to-end tests are complete.

Any database migration remains staging-only and requires schema diff, SQL review and separate explicit owner approval. Production remains untouched. PR #20 remains draft and unmerged.

## Validation and preview status

- Added the Malay Quiz draft validator to the U3.0 architecture/content CI workflow.
- Initial CI validator run failed only because the difficulty counts were not balanced; the content was corrected.
- A fresh U3.0 regression run on the corrected bank is pending; no final pass is claimed.
- Cloudflare preview auto-deployment and owner desktop/mobile acceptance must be confirmed against the final corrected branch head before issuing a new staging handoff.
- No merge, production deployment or ZIP was created.


### Follow-up implementation and CI checkpoint — 2026-11-27

Additional fixes made after the first CI review:
- The Malay target option is now permitted when the learning course is also Malay. The Profile save guard and translation-view refresh no longer force Malay back to English for `ms → ms`; only incomplete Dictionary translation coverage blocks it.
- Dictionary translation registry records targeting Malay now default to `machine_assisted_draft` when a generated record has no explicit item-level status, while manually authored Malay→English/Chinese records retain their existing draft status. This preserves the required machine-assisted provenance.
- Updated the existing selector regression to assert the new same-language behavior and replaced the static Quiz placeholder copy as well as the translated copy.

**U3.0 architecture/content regression passed** on application commit `6abd022e08a1d7a4079884e8de8dc0136f0e1530`, including the Malay Quiz validator and all 62 architecture/content tests. Run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957445422. Cloudflare build-routing guard passed on the same commit: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957448576. U2.9 English Dictionary QA also passed on that head: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957448529. U2.3, U2.5, U2.6, U2.7 and Quiz database foundation cross-version workflows were still pending/in progress at this checkpoint.

The stable Cloudflare Pages alias remains `https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev`, but the latest commit's actual Pages deployment was not independently verified. The U3.0 CI pass is not a browser/device staging acceptance and does not certify the live preview deployment. No staging database change, merge or production deployment was made.


### Cross-version browser regression follow-up — 2026-11-27

The U2.7 browser suite exposed one compatibility issue introduced by the registry-based language-label change: it displayed the English label “Simplified Chinese” where the existing UI contract expects the native “简体中文”. This was corrected by using the registered native name for `zh` while using the registered display name for English and Malay. The Daily History language label now says “Malay”. The U2.7 PostgreSQL lesson-start/allowance job passed; its browser job failure was isolated to this display label. A fresh U3.0 and cross-version rerun was triggered on application commit `12524ca92de2c71804d4ba72d6f2977b071aa6ec`; results are pending. Earlier U3.0 and U2.9 passes remain valid for commit `6abd022e08a1d7a4079884e8de8dc0136f0e1530`, but they do not validate the subsequent label-only correction. Preview publication is still unconfirmed.


### Latest feature-head verification — 2026-11-27

Application branch head: `12524ca92de2c71804d4ba72d6f2977b071aa6ec`.
- U3.0 Phase 1 architecture/content regression passed, including the Malay Quiz draft validator and all 62 tests: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957631376
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45957631477
- U2.3, U2.5, U2.6, U2.7, U2.9 and Quiz database foundation workflows were still pending/in progress when recorded. U2.7's previous browser run failed only because the registered Simplified Chinese display label was rendered in English; the native-label fix is included in this head and the rerun is pending.
- The stable Pages alias is the existing staging endpoint, but latest branch-head publication was not independently verified from Cloudflare. No final staging preview handoff or owner browser/device acceptance is claimed.
- PR #20 remains draft and unmerged. No staging Quiz schema/data changes or production changes were applied.


## 2026-11-27 — Malay Quiz batch 02 and secure runtime implementation

The owner requested 36 questions per batch and implementation of secure server-side session/evaluation support. The second authoring batch now adds **36 questions per support-language pack** (12 Beginner, 12 Intermediate, 12 Advanced): 36 Malay→English plus 36 Malay→Simplified Chinese, 72 new question records total. Together with the initial 12-question batch, each support-language pack contains 48 draft questions (16 per difficulty; 96 records across both packs). All questions remain original SwiftDictionary draft content, `release_approved:false`, with curriculum lesson/objective mappings. The meN- prefix distractor glosses were corrected for uniqueness. The Malay manifest remains `capabilities.quiz:false` and package status `draft`; content is not playable or approved.

A new additive migration, `supabase/migrations/20261127130000_swiftdictionary_update_3_0_malay_quiz_runtime.sql`, adds private Malay availability and start-session implementations and routes the existing public availability/start RPCs by the caller's saved learning course. It uses the existing private session/question snapshots, randomized option order, answer-key redaction, authenticated answer-save RPC, server-side submit/scoring path, completion-only allowance ledger, one-active-session constraint, account-scoped ownership and local-day no-repeat reservation ledger. It supports Malay→English and Malay→Simplified Chinese bank snapshots. When the user selects Malay as its own translation/display language, the server uses an English support snapshot internally while the client continues to display Malay-only text. Existing save/submit/abandon/history/review functions remain shared and language-agnostic; no client-supplied correct answer is accepted.

Added a Malay draft SQL exporter and import assertions, an authenticated PostgreSQL integration test covering all three difficulties, both support-language pairs, answer-key privacy, cross-account review denial, same-language fallback, server scoring, completion-only allowance and no-charge abandon behaviour, and static tests for the runtime security boundary. CI was wired to apply the additive migration in its disposable local Supabase environment, import the 96 Malay draft rows, and run the integration suite. The first CI runs are pending; no passing result is claimed yet.

**Staging boundary:** the migration has been committed to the feature branch but has NOT been applied to the connected staging Supabase project. This follows the standing requirement for a separate explicit owner approval after schema diff and SQL review. Production remains untouched. Keep PR #20 draft/unmerged. Do not turn on the Malay Quiz manifest capability until the approved content bank meets the availability thresholds and owner linguistic review is complete.

**Legal/content provenance:** questions and distractors are independently authored for SwiftDictionary; no DBP/PRPM/Kamus Dewan text or third-party question bank was imported. English/Chinese support translations are draft derivative translations; retain the existing Malaysia Copyright Act 1987 and model-artifact licence/attribution review before public production release.


### Runtime schema and allowance corrections — 2026-11-27

A direct review of the connected Quiz schema found three language checks that still restricted answer/snapshot language codes to `en` and `zh`. The Malay runtime migration now extends those exact checks to include `ms` (question-type equality checks remain intact), validates the constraints, and keeps the existing private-schema boundaries. The local integration test seeds the U3.0 Malay language/catalogue baseline before applying this migration.

**Allowance policy correction:** the existing Quiz trigger charges the Quiz allowance when a session starts (`learning_activity_log.event_type='started'`), not when it is submitted. The Malay start function now writes the same server-owned start event inside the session transaction. Resuming an existing active session does not charge a second start; abandoning a session does not refund the already-consumed start allowance. The generic server-side submit/evaluation function remains shared and computes the score from private answer-key snapshots. Earlier draft notes in this archive described completion-only charging; those statements are superseded by this correction.

One intermediate U3.0 static test run failed because a newly added test assertion had incorrect regex escaping; the runtime migration itself was not executed in that run. The assertion was replaced with literal SQL-fragment checks, and the latest feature-head U3.0 and Quiz database workflows are pending. No staging migration has been applied.


### Latest U3.0 static regression checkpoint — 2026-11-27

U3.0 Phase 1 architecture/content regression passed on application head `4edff5a73896f9bc0f87b4bdf3da85714ffba780`, including the 48-question-per-pair Malay validator, the runtime migration security/constraint assertions, and the UI guard that waits for the saved course preference before starting. Run: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45960273133. The Quiz database foundation workflow is still in progress on the same head and must pass its disposable PostgreSQL import and authenticated local Supabase integration stages before runtime acceptance is claimed. No connected staging or production database has been changed.


### Course-preference routing compatibility — 2026-11-27

The public three-argument Quiz start wrapper now preserves the existing English/Chinese course-override routing for compatibility, while the Malay path requires the saved learning course to be `ms` and rejects a client attempt to start Malay while the saved course is another language. The Quiz UI waits for its queued course-preference write before requesting a Malay session, preventing a fast course switch from racing the server-side saved-preference check. U3.0 static tests cover this ordering. The generic authenticated save, submit/scoring, active-session, abandon, history and review RPCs remain shared across all learning languages.


### Quiz integration CI fixture correction — 2026-11-27

The first full local Supabase integration attempt reached the U3.0 baseline and found that the full Phase 3 Malay catalogue seed also inserts Daily Discovery rotation orders, colliding with the global unique discovery-order index in the isolated Quiz test database. This is unrelated to Malay Quiz question content or runtime. The Quiz workflow now runs the Malay enablement baseline and a Quiz-only fixture containing just the 72 permanent-lesson catalogue rows needed by the Quiz source checks; it deliberately omits Daily Discovery rotation data. The failed run stopped before applying the Malay Quiz runtime migration or executing the new RPC tests. A fresh local Supabase integration run is pending on the corrected workflow. No connected staging data was changed.


### First local Supabase migration execution — 2026-11-27

The corrected Quiz-only Malay catalogue fixture allowed the new runtime migration to apply successfully in disposable local Supabase, and the public-function grant verification passed. The first authenticated Malay runtime test then failed at its initial allowance assertion because its test user UUID (`eeee…`) was already used by the legacy Quiz integration suite, so its pre-existing daily Quiz usage made the expected count nonzero. The test now uses six isolated `f0a00000-…` identities that do not overlap the legacy fixtures. This is a test-fixture isolation correction, not a runtime migration failure. The latest Quiz DB workflow rerun is pending. No connected staging or production database was changed.


### Start-allowance trigger reuse correction — 2026-11-27

The second isolated-user integration run exposed the actual cause of a count of two: the existing `private.charge_quiz_start_allowance` AFTER INSERT trigger on `private.quiz_sessions` already writes the server-owned `quiz/started` activity event. The first Malay migration draft also inserted that event manually, double-charging each new session. The manual insert has now been removed; Malay session creation relies on the existing trigger exactly once. The test continues to assert one charge on start, no second charge when resuming, no refund on abandon, and no extra charge on submit. The initial reused-user fixture issue was also corrected with isolated test UUIDs. A fresh local Supabase integration run is pending on the updated migration.


### Malay Quiz authenticated runtime integration pass — 2026-11-27

The disposable local Supabase run successfully applied the Malay enablement baseline, 72-lesson Quiz fixture and new Malay Quiz runtime migration; explicit grant verification passed. The authenticated Malay runtime test then **passed** for Beginner (10 questions), Intermediate (15), Advanced (20), Malay→English and Malay→Simplified Chinese, same-language Malay display fallback, answer-key/explanation redaction before submit, server-side score evaluation, completed-review answer reveal, cross-account review denial, one start allowance per session, no second charge on resume, and no refund on abandon. This confirms the new runtime path and existing session/evaluation APIs work against local Supabase.

The workflow then failed in the following draft-content import step because the validator printed its human-readable success line to stdout, which was redirected into the generated SQL file. The exporter now writes that status line to stderr when `--emit-sql` is used, leaving stdout as valid SQL only. The 96-record draft import assertion had passed in the PostgreSQL foundation job; a fresh full local Supabase workflow rerun is pending to verify the corrected exporter and continue through the browser/security checks. No connected staging or production database was changed.


### Full local Supabase runtime and draft-import checkpoint — 2026-11-27

On application head `1d41dbb4885c72c99a41f8101a301d0e00be9315`, the local Supabase integration run has now passed: U3.0 Malay enablement baseline; Quiz-only 72-lesson catalogue fixture; Malay runtime migration; explicit public grants; authenticated Malay Quiz RPC tests; 96-question draft import and draft-only assertions; existing 199-question release-export validation; and synthetic approved-bank seeding. The authenticated Malay tests cover all three difficulty question counts, English and Chinese support-language routing, Malay same-language display fallback, answer-key redaction, server-side evaluation, cross-user review isolation, start allowance exactly once, active-session resume without a second charge, and abandon without refund. Chromium Quiz browser tests and the remaining Flashcards/Lessons/Chinese Dictionary/security-advisor checks are still in progress in run https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45961604034. This is a disposable local Supabase environment only; connected staging and production remain unchanged.


### Cross-version browser regression follow-up — 2026-11-27

The local Supabase workflow passed the Malay runtime migration, authenticated Malay Quiz session/scoring/security tests, 96-record draft import, release-export validation and synthetic approved-bank setup. The subsequent existing U2.4 browser suite surfaced two test-contract issues: (1) Daily History deliberately renders four groups (Lessons, Daily Learning, Quiz, Flashcards), while an old assertion still expected three; the test now expects four. (2) The answer-change test clicked a second option while the first server save was still in flight; the UI intentionally serializes answer saves, so the test now waits for the first save to finish before selecting the replacement answer. No runtime behavior was weakened. The corrected browser suite and full local Supabase workflow are rerunning on the latest feature head. No connected staging or production changes.


### Malay Quiz bank target and next authoring batches

The current bank contains 16 questions per difficulty in each support-language pair. The existing runtime minimums are 30 Beginner, 24 Intermediate plus 16 Beginner, and 32 Advanced plus 8 Intermediate and 8 Beginner. The current 16/16/16 bank therefore remains below every difficulty's minimum, so `capabilities.quiz` correctly remains false. To reach the preferred target counts (36 Beginner, 36 Intermediate, 48 Advanced) while keeping the owner's 36-question batch size, the next two batches should each contain 10 Beginner, 10 Intermediate and 16 Advanced questions per support-language pair. That would bring the bank to 36/36/48 per pair. All content remains draft until the owner's staging review and linguistic approval.
