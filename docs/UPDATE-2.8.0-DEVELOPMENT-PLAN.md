# SwiftDictionary Update 2.8.0 — Final Development Plan

**Status:** Owner-authorised development; initial implementation exists on the feature branch; CI and integration remediation underway  
**Planning date:** 2026-11-23  
**Update title:** Chinese Quiz & Flashcards Expansion  
**Application branch:** `feature/update-2-8-0-chinese-quiz-flashcards` (PR #16 open as draft; head `888d7c4e6bada45b2e09e23b449d49d1c71843a9`; 94 commits ahead of `main` at audit time)  
**Production/main:** No changes for U2.8.0  
**Database:** Four U2.8.0 migrations exist on the feature branch; none applied to staging or production  
**Staging:** Cloudflare Pages preview check succeeded; no U2.8.0 staging database migration/data changes

This document is the authoritative scope and acceptance baseline for U2.8.0. On 2026-11-23, the owner explicitly authorised development after the latest Master Development Record and relevant conversation archives were reviewed. The technical audit and implementation may proceed on the reserved application branch. Scope changes, merge, production migrations and production deployment remain subject to their separate approval gates.

## 1. Goals and boundaries

U2.8.0 expands Quiz and Flashcards for the Simplified Chinese course, improves the Quiz visual experience, corrects Practice Insights so mistakes can contribute to review recommendations, and redesigns the Dashboard. Preserve existing English learning, existing Quiz/Flashcard rules, account isolation, custom collections, allowances, timezone handling and permanent learning records.

Out of scope unless separately approved:
- Changing Free/Premium quotas, subscription policy or allowance consumption rules.
- Restricting dictionary search.
- Replacing or removing existing Quiz/Flashcard modes or challenge mechanics.
- Destructive deletion of learning history at midnight.
- Production deployment, production migration, merge or release without separate explicit approval.

## 2. Chinese Quiz content and bank capacity

Provide a sufficiently large, diverse Chinese-course question bank for Beginner, Intermediate and Advanced. Content coverage must include:
- Character recognition and meanings.
- Pinyin and pronunciation.
- Vocabulary and useful expressions.
- Sentence comprehension.
- Grammar and sentence structure.
- Contextual usage.
- English-to-Chinese translation only when the Chinese course's selected translation language is English.

Retain existing Quiz mechanics:
- Beginner: 10 questions; Intermediate: 15; Advanced: 20.
- Exactly four options per question: one correct answer and three plausible distractors.
- No timer and no pass/fail threshold.
- Exact score and rounded whole-number percentage; per-question review.
- Answers remain editable until submission; correct answers and explanations are hidden until submission.
- Unfinished sessions persist until completed or explicitly abandoned; one active session per account. Resume and abandonment are free; only successful completion consumes the existing allowance.
- A session captures its course/translation-language pair at start. Changing preferences must not mutate an existing session.
- Preserve the existing same-account, same-effective-local-day no-repeat reservation rules, including the rule that questions issued to an abandoned session remain reserved for that day.
- Preserve existing difficulty composition and minimum eligible unseen bank capacity: Beginner 20 questions for two sessions (preferred 30); Intermediate 24 Intermediate + 16 Beginner (preferred 36 + 24); Advanced 32 Advanced + 8 Intermediate + 8 Beginner (preferred 48 + 12 + 12). Higher levels may consume lower-level questions only according to the established ratios.
- If the eligible unseen bank cannot support a complete session with the required topic/language coverage, show the difficulty as unavailable; never shorten a session, repeat a same-day question or substitute out-of-scope content.

The Chinese bank must be audited against these session-capacity requirements before final targets are set. No arbitrary fixed Chinese question count was approved during planning. Establish numeric bank targets from the actual curriculum, difficulty distribution, topic diversity, language-pair coverage and no-repeat allowance model during the technical/content audit. The bank must exceed bare minimum where feasible and be validated for correctness, distractor quality, duplicate detection and lesson-topic links.

Existing English Quiz content must remain functional and must be audited before reuse. Do not assume historic draft questions are approved or suitable for Chinese-course assessment.

## 3. Chinese Flashcards content and bank capacity

The Chinese Flashcard bank covers all three content levels:
- Individual characters.
- Multi-character vocabulary.
- Useful expressions and phrases.

Include pinyin/pronunciation, meanings, definitions, contextual usage and sentence knowledge as appropriate. Ensure sufficient bank depth across Beginner, Intermediate and Advanced, all supported modes and both translation-language configurations. The precise numeric bank target is to be set after auditing the actual dictionary and lesson curriculum; no unsupported count is to be invented.

Preserve existing modes, collections, custom-card behaviour, account synchronisation, review history, challenge durations and allowance rules. Do not regress English Flashcards.

### 3.1 Distinct recall-mode learning objectives (mandatory)

Word Recall, Definition Recall and Translation Recall must not become three differently worded versions of the same question. Their content schemas, prompts, expected answers and QA tests must enforce separate primary cognitive tasks:

1. **Word Recall — lexical-form / pronunciation retrieval.** Present a Chinese character or word and primarily ask the learner to recall its pinyin/pronunciation (with tone marks where applicable). It is not a definition or translation prompt.
2. **Definition Recall — conceptual/semantic retrieval.** Present a descriptive explanation, usage description or defining clue and ask the learner to identify the Chinese word/expression. A definition must describe the concept or usage rather than merely provide a direct translated equivalent.
3. **Translation Recall — language-equivalence retrieval.** Present a direct equivalent in the selected translation language and ask for the corresponding Chinese expression. When English is selected, use English-to-Chinese equivalents. When Chinese is selected, keep the activity Chinese-only by using a Chinese paraphrase or equivalent-expression prompt; it must remain distinct from a descriptive dictionary-style definition.

**Anti-overlap QA:** Reject duplicate or near-duplicate cards across these modes where the prompt and answer test the same retrieval operation. A Translation Recall prompt must not simply be a Definition Recall description translated into Chinese. Definition Recall must not be a direct English gloss when English translation is selected. Word Recall must not reveal pinyin in its prompt if pinyin is the expected recall. Content reviewers must check examples across all three modes, both language preferences, all levels and different content types.

4. **Sentence Recall — sentence-level retrieval.** Focus on recalling, reconstructing or interpreting complete sentences and contextual usage; do not reduce it to single-word translation.

For Chinese translation preference, no English prompts, translations or explanations are introduced into Chinese-course games. Word Recall remains pronunciation-focused; Definition Recall uses a Chinese descriptive clue; Translation Recall uses a Chinese equivalent/paraphrase with a distinct prompt design; Sentence Recall remains Chinese sentence-level. Avoid presenting identical text on both sides.

### 3.2 Translation-language capture

The selected translation language controls content eligibility and prompt/answer language:
- Chinese course + English translation preference: English-to-Chinese translation cards/questions may be included.
- Chinese course + Chinese translation preference: English integration is excluded; all prompts and explanations remain Chinese-focused.
- Capture the course and translation-language pair when each Quiz session or Flashcard game starts. Preference changes affect new sessions only, not an in-progress session.

## 4. Quiz UI redesign

Redesign both the Quiz landing/selection experience and the active Quiz test interface to align with the visual language of Lessons and Flashcards:
- Consistent card shadows, depth, navigation background colour, corner radii, spacing and typography.
- Coherent animated transitions between relevant Quiz screens.
- Directional animated transition for previous/next question navigation.
- Preserve selected answers when navigating backwards and forwards.
- Guard against rapid repeated navigation causing skipped, duplicated or corrupted question state.
- Responsive desktop and mobile layouts.
- Respect reduced-motion preferences; provide an appropriate non-motion alternative.
- Keep focus, keyboard operation, readable contrast and accessible state feedback.

## 5. Dashboard allowance overview

Replace the current gauge-based allowance overview with a clearer card-based presentation. Show the relevant completed count, daily limit and remaining availability/status for Lessons, Quiz, Flashcards and Daily Revision. Keep current Free/Premium limits, reset timezone and allowance accounting unchanged. The allowance UI must not imply a changed quota or treat abandoned activities as completed.

## 6. Practice Insights: lesson and Quiz performance

### 6.1 Flexible lesson completion (owner-approved)

Learners may continue after reviewing an explanation even if they never select the correct answer. Do not force a correct answer as a prerequisite for lesson completion. Record first-attempt errors and subsequent mistakes so eventual correction does not erase evidence of the original difficulty. Completion and mastery are separate concepts.

Track, at topic level where available:
- First-attempt accuracy.
- Incorrect attempts and repeated mistakes.
- Recent performance.
- Performance across relevant lesson activities.
Use the evidence to identify review needs without labelling a topic weak from one isolated mistake. Preserve a supportive, non-punitive learning experience.

### 6.2 Quiz-to-topic review (existing intended rule to carry forward)

Quiz questions must link to their relevant permanent lesson objective/topic. Incorrect Quiz responses can increase that topic's review priority and make the related lesson available from Dashboard Practice Insights. Use recent Quiz evidence, including the five most recent completed Quiz reviews as previously specified, rather than relying on one isolated answer. Chinese questions must link to relevant Chinese lesson content. If an assessed concept has no corresponding lesson objective, identify the curriculum gap and add/extend the appropriate lesson content as part of content planning rather than creating an orphan topic.

### 6.3 Combined insight model

Lesson and Quiz evidence contribute to topic-level Practice Insights. Analytics should show the origin of evidence (Lessons or Quiz) and distinguish first-attempt errors, repeated errors and recent Quiz performance. Avoid claiming mastery solely from completion or a correct final retry. Weak-topic recommendations can inform Daily Revision and Daily Learning prioritisation.

The technical audit must determine the least-invasive data model that supports these requirements. Attempt-level performance data may be new personal data/learning analytics; minimise stored fields, document purpose and retention, enforce account ownership/RLS and include account deletion behaviour. Do not store unnecessary raw answer text.

## 7. Dashboard four-tab redesign

Provide four tabs:

1. **Favourites:** saved English and Chinese words, course distinction, search/filter and quick dictionary-detail access.
2. **Learning Progress:** long-term permanent lesson completion, Quiz participation/results, Flashcard progress, and course/difficulty progress.
3. **Daily History:** completed Lessons, Quiz sessions and Flashcard games for the current effective local day, with completion times/results as appropriate.
4. **Analytics:** combine Flashcard statistics and Practice Insights, including topic strengths/weaknesses and performance trends, with English/Chinese course filtering.

The current gauge-based allowance overview is replaced as specified in section 5. The Dashboard must remain responsive and consistent with the established application visual language.

## 8. Daily History and complete Flashcard game review

**Owner-approved reset behaviour:** Daily History displays the current local day and resets at midnight in the user's effective/configured timezone. This is a reset of the daily view, not destructive deletion of historical session records. Retain underlying records needed for Learning Progress, Analytics, account export/deletion and any existing history functions.

Every completed Flashcard game from the current day must appear in Daily History and be fully reviewable, regardless of whether each card was answered correctly or incorrectly. Reopening a completed game must:
- Show every card in the original game, not only missed cards.
- Preserve the original game content/order and captured language configuration, preferably using an immutable session snapshot or an equivalent safe reference to the exact historical card version.
- Show the card's prompt, answer/explanation and the learner's recorded response/result where the existing data model supports it.
- Allow the learner to revisit cards they answered correctly because a correct response does not prove understanding.
- Be read-only review: do not create a new game, consume another allowance, mutate the original result or alter the original session's completion time.
- Keep old underlying records for long-term Analytics/Progress after the daily view rolls over. Historical full-game access beyond the current-day Daily History view is not separately expanded by this requirement unless an existing history feature already provides it.

A bank edit or deletion after completion must not silently change what a past completed game displays. The technical audit must choose an appropriate snapshot/versioning strategy and account for storage/privacy implications.

## 9. Daily Learning activity refresh

At the effective local midnight reset, previously completed Daily Topic, Daily Application, Daily Discovery and Daily Revision activities leave the active Daily Learning view. Fresh eligible activities are generated according to the existing activity-selection rules and weak-topic prioritisation. This is a local calendar-day reset, not a rolling 24-hour timer.

- Do not delete permanent lesson completion, historical activity records or long-term progress.
- Yesterday's completions do not consume today's allowance.
- Preserve existing abandoned-session/allowance semantics.
- Avoid duplicates within the same daily cycle.
- Keep current cross-course shared allowance rules and timezone source.
- Verify behaviour when the app remains open across midnight, when a user changes course/translation preference, and across account/device sessions.

## 10. Existing allowance and product rules to preserve

Do not change quota policy in U2.8.0. Preserve current configured Free/Premium quotas and server-side enforcement. Recorded policy baselines from earlier approved work include:
- Permanent lessons: Free 5/day; Premium 15/day.
- Daily Topic, Daily Application, Daily Discovery and Daily Revision: Free 1 each/day; Premium 3 each/day.
- Quiz: Free 1 completed/day; Premium 3 completed/day.
- Flashcards: Free 3 completed games/day; Premium 10 completed games/day.

Abandoning a session/game does not consume a completion allowance; only successful completion does, subject to the existing Quiz question-reservation rule. Confirm actual production configuration and migration history during audit before making any assumptions or proposing database changes. Personal testing bypass must remain narrowly scoped and must not be expanded.

Dictionary word-grid search remains free and unlimited.

## 11. Compatibility and regression requirements

Do not regress:
- English Quiz, Flashcards, Lessons or Daily Learning.
- Existing Quiz difficulty composition, question reservation/no-repeat rules, session resume/abandon/submit/review behaviour.
- Existing Flashcard modes, custom collections, collection ownership/sync, challenge durations, game history and allowance accounting.
- Account switching, sign-in/out, per-account isolation, saved-word sync and RLS.
- Course and translation preference refresh; in-progress sessions retain their captured language pair.
- Daily allowance reset and shared cross-course accounting.
- Permanent lesson completion, Daily Learning review and completed-content access.
- Chinese character-only dictionary grid, pinyin placement/search and related-word behaviour.
- Desktop/mobile layout, accessibility and reduced-motion behaviour.

## 12. Technical audit and development sequence

Development is authorised. Begin with:
1. Audit current `main`, actual production/staging migration state, existing Quiz/Flashcard schemas and RPCs, allowance policies, content banks, lesson-topic mappings, dashboard data and account deletion/RLS.
2. Inventory Chinese dictionary/lesson coverage and existing candidate question/card content. Determine numeric bank targets from actual session demand and diversity; identify missing curriculum coverage.
3. Design content schemas and validate mode separation, language-pair gating, distractors, duplicates, pinyin, translations and topic links.
4. Implement Chinese Quiz and Flashcard banks and language-dependent session capture.
5. Implement the Quiz UI redesign and navigation transitions.
6. Implement flexible lesson attempt recording and Quiz-linked Practice Insights.
7. Implement Dashboard tabs, allowance cards, Daily History and full-game Flashcard review.
8. Implement local-midnight Daily Learning refresh without destructive history deletion.
9. Run static/content/schema/RLS/RPC/database/browser/accessibility/mobile/timezone/account/allowance regression tests.
10. Prepare a staging preview and report exact test evidence and known limitations for owner testing.

The sequence may change to respect discovered dependencies. Application development may proceed under this authorisation. No merge, production migration or production deployment occurs without separate explicit approval.

## 13. Legal, privacy, security and content review gate

Before implementation design is finalised and again before release, conduct the required Malaysia-specific and general international legal/privacy review. Consider Malaysia PDPA where applicable, global 16+ audience obligations, cross-border processing, Supabase/hosting processors, transparency/disclosure, purpose limitation, retention, access/deletion, account deletion, security/RLS, and whether attempt-level performance analytics create additional processing purposes or personal-data categories. Assess copyright/licensing/attribution for Chinese dictionary, example, lesson, quiz and flashcard content. This is a risk-planning gate, not legal advice or compliance certification. The existing formal legal/privacy review remains outstanding; U2.8.0 must not be described as legally cleared merely because this plan records the review requirement.

## 14. Acceptance gates

U2.8.0 is not complete until:
- Chinese banks support complete sessions/games with validated content and adequate diversity at every difficulty.
- Word Recall, Definition Recall, Translation Recall and Sentence Recall test distinct skills; cross-mode overlap QA passes.
- Chinese-course English integration appears only under English translation preference; Chinese preference remains English-free.
- Existing sessions preserve their captured language configuration.
- Quiz UI and test navigation transitions work without losing answers or corrupting state.
- Lesson completion is flexible and mistakes remain available to Practice Insights.
- Quiz errors map to relevant lesson topics and the recent-review rule is respected.
- Dashboard tabs, allowance cards and course-aware analytics work.
- Every completed Flashcard game in the current Daily History view can be reopened with every original card, including correct answers, without allowance or result mutation.
- Daily History rolls over at local midnight without deleting long-term records.
- Daily Learning completed activities refresh at local midnight without destroying historical records or changing allowance rules.
- English functionality, account isolation, custom collections, quotas, timezone handling, mobile and accessibility regressions pass.
- Legal/privacy/content review is documented and unresolved risks are disclosed.
- Owner tests the staging preview and explicitly approves release; merge, migrations and production deployment receive separate approval.

## 15. Owner authorisation and recovery point (2026-11-23)

The original planning approval archive recorded a hold on development. The owner subsequently supplied the separate explicit instruction to read the latest Master Development Record and relevant archive, update the plan, and begin development. That later instruction supersedes the earlier hold. Application work is authorised on the existing feature branch. Merge, production database migration and production deployment remain separately gated.

- Production `main`: `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`.
- U2.8.0 feature branch: `888d7c4e6bada45b2e09e23b449d49d1c71843a9`.
- PR #16 is open as a draft, targeting `main`.
- The branch contains substantial U2.8.0 implementation; do not reset, overwrite or discard it.
- Four U2.8.0 migrations are present in source control. They have not been applied to staging or production.
- Cloudflare Pages preview check succeeded for the latest branch head. This is not production deployment.
- Latest CI is not green; failures and remediation are recorded in the audit update below.
- No merge, production migration or production deployment is authorised by the development-start instruction.

## 14. Initial technical audit baseline — 2026-11-23

The owner authorised development after the latest Master Development Record and relevant archives were reviewed. The reserved application branch `feature/update-2-8-0-chinese-quiz-flashcards` exists and initially matches `main` commit `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`. Application implementation has not yet been committed at the time of this audit note. All database checks below were read-only; no production or staging rows, schema, settings or deployments were changed.

### 14.1 Quiz inventory and derived Chinese capacity

- Production and staging each contain 199 approved Quiz questions for English learning with Simplified Chinese translation, and no Chinese-learning Quiz bank rows.
- Existing English bank distribution is Beginner 56 (30 knowledge, 5 word-definition, 21 Chinese-translation), Intermediate 62 (36, 5, 21), Advanced 81 (48, 5, 28).
- The Chinese curriculum currently has 17 permanent lessons: 7 Beginner, 5 Intermediate, 5 Advanced. Their lesson-reader practice arrays contain 112 candidate questions: 44 Beginner, 34 Intermediate, 34 Advanced. These are candidate source items, not yet imported/approved Quiz questions; validate prompts, options, explanations, translation quality, duplicates and topic mapping before release.
- Carrying forward the existing preferred three-session capacity targets gives Chinese bank targets of at least 30 Beginner, 36 Intermediate, and 48 Advanced questions, with the existing lower-difficulty composition reserves. The current candidate inventory is short by 2 Intermediate and 14 Advanced items; author at least those 16 additional items, then validate the complete pool and topic diversity. Keep the 112 current items only where they pass the same quality bar as new Quiz content.
- Use the 17 existing Chinese permanent lesson/topic records as the allowlist and source of truth. Add stable learning-objective IDs to the Chinese curriculum map so every approved question links to a lesson objective and topic. Same-day reservations must remain shared across difficulty and translation preference; do not create language variants that allow the same logical question to repeat under another preference.

### 14.2 Chinese Flashcard inventory and mode interpretation

- The current Chinese dictionary data contains 519 entries, all single-character headwords: HSK 1 = 148, HSK 2 = 271, HSK 3 = 100. Entries already include pinyin, English gloss, Chinese definition, examples and related terms.
- Related multi-character terms are references inside character entries, not standalone cards. The new Flashcard content pack must add independently usable multi-character vocabulary and useful expressions/phrases, with pinyin, contextual examples and separate definition/translation cues.
- The production and staging schemas currently constrain Flashcard dictionary cards to `language_code='en'`; the start-game RPC rejects Chinese learning courses. The current session/review mode constraints are `word`, `definition`, `mixed`, `sentence`. Extend both the card and session model for Chinese without weakening owner checks.
- Interpret the approved four distinct learning objectives as Word Recall, Definition Recall, Translation Recall and Sentence Recall. Preserve the existing Mixed Recall option as a composite mode, so the Chinese course exposes those four distinct modes plus Mixed Recall; English retains its current four modes and behaviour. Mixed Recall for Chinese samples from all four distinct tasks.
- Word Recall must ask for pinyin; Definition Recall must use a Chinese descriptive clue; Translation Recall must use a direct English equivalent when English is selected or a distinct Chinese paraphrase/equivalent when Chinese is selected; Sentence Recall remains sentence-level. The QA pack must reject identical/near-identical Definition and Translation cues.

### 14.3 Full Flashcard review history limitation

- Production currently has four completed Flashcard sessions, 39 mastery rows and 12 weak-memory rows. Staging has no Flashcard learner rows.
- Existing Flashcard sessions store aggregate totals only. They do not store the cards/options shown, card order, selected answer or per-card result. The existing production sessions cannot be reconstructed into full card-by-card reviews.
- Add private per-session item snapshots for new games and an owner-checked read-only review RPC. New snapshots must preserve original content, language pair, order, selected answer and correctness; no review action may create a game or consume allowance. Learning-history deletion and account deletion must cascade to the new rows.
- For legacy sessions without snapshots, show the available summary and clearly explain that full card review is unavailable for games completed before U2.8.0; never fabricate a review.

### 14.4 Lesson completion, Practice Insights and Dashboard

- Current lesson UI says every practice question must be answered correctly and auto-completes only after all are correct. Add an explicit completion path after explanation review that does not require a correct answer.
- Existing `lesson_practice_results` stores only one aggregate first-try summary per lesson and does not preserve subsequent incorrect attempts. Add minimal per-attempt aggregate records (no raw answer text) so first-attempt accuracy and retry mistakes remain available to topic-level Practice Insights. Include owner checks, RLS/private storage, account deletion and learning-history deletion.
- Existing Quiz session snapshots already retain question/topic/objective/selected-answer/correct-answer data for completed Quiz reviews. Reuse the five most recent completed reviews to inform topic priority; do not duplicate raw answer data unnecessarily.
- The current Dashboard is a long page with separate Favourites, Learning Progress, Quiz History, Flashcard Statistics and Practice Insights sections; it has no four-tab navigation. Replace the allowance gauges with cards while keeping the verified server quotas unchanged.
- Current production and staging quotas match the approved baseline: Free — Lessons 5, Quiz 1, Flashcards 3, each Daily Learning category 1; Premium — Lessons 15, Quiz 3, Flashcards 10, each Daily Learning category 3.
- Daily Learning already calculates the effective timezone's local-day window, but its completed-card list reads all historical completed sessions. Restrict the active daily view to the current effective local day; keep historical rows stored and do not delete them at midnight.
- Daily History must filter completed lesson, Quiz and Flashcard records by the effective local day. Add a timezone-aware Flashcard completion timestamp/session snapshot as needed; this is a display filter, not a retention/deletion mechanism.

### 14.5 Security, operations and legal/privacy gate

- Production and staging both use private-schema tables with RLS and owner-checked RPC access. The existing security advisor baseline includes eight informational private-schema RLS/no-policy findings (default deny), two intentional SECURITY DEFINER warnings, and leaked-password protection disabled. Do not weaken private-schema grants or broaden function execution; new tables/RPCs must use the same narrow pattern and be explicitly tested for cross-account access.
- Production currently contains real Flashcard history, so destructive or fixture-based tests must use disposable local/CI or synthetic staging accounts only. Do not use the owner's production account or copy production learner rows to staging.
- The existing legal review remains a planning assessment, not legal clearance. U2.8.0 adds per-card Flashcard answer/review snapshots and lesson attempt aggregates, increasing the educational-behaviour data inventory. Minimise fields, keep them private, document purpose/retention, include them in DPIA/DPO screening, and ensure learning-history/account deletion removes them.
- Keep Chinese dictionary-derived content accessible to Free users under the existing allowance model; do not make CC-CEDICT-derived material Premium-only. Preserve CC BY-SA 4.0 attribution/share-alike notices and use original lesson-authored content for Quiz questions. No new external processor is planned.
- Formal Malaysian PDPA applicability advice, international transfer assessment, 16–17-year-old handling, DPO/DPIA screening, controller/contact details and retention approval remain outstanding release gates.

### 14.6 Supabase operational note

The current Supabase changelog records the CLI v3 local-by-default behaviour and a Production Branches read-write permission requirement for branch merges (November 2026). U2.8.0 will continue using the connected project tools and the repository's guarded Cloudflare build routing; do not use an ambiguous CLI default or merge/deploy a hosted database branch as part of this development phase. No production schema or deployment change is authorised by the start instruction.


## 16. Repository and CI audit update (2026-11-23)

### Repository state
- Verified `main` at `38dbee3f2a3c409e1d5fdc4bd1f8833f8c71c420`.
- Verified U2.8.0 branch head `888d7c4e6bada45b2e09e23b449d49d1c71843a9`; GitHub compare reports 94 commits ahead and zero behind.
- PR #16, “WIP: SwiftDictionary Update 2.8.0 — Chinese Quiz and Flashcards”, remains open/draft. Its current description is stale and understates the implementation now present; update it after the implementation and test inventory is reconciled.
- Current branch changes cover Chinese Quiz and Flashcard draft content, recall-mode logic, language-aware runtime, Flashcard review snapshots, Dashboard tabs/allowance cards/Daily History, Practice Insights attempt metrics, Daily Learning current-day filtering, and four SQL migrations.
- The feature branch's existing work predates the latest owner instruction in the current conversation. Preserve it and establish an accurate baseline rather than treating the branch as empty.

### Latest CI evidence at head 888d7c4
- Cloudflare Pages preview check: passed.
- U2.8.0 Quiz database foundation check: passed.
- Supabase CLI local Auth compatibility: passed.
- Local Supabase Auth/RPC integration: failed. The SQL regression fixture inserts a Flashcard session whose count values violate the existing `flashcard_sessions_counts_check` constraint. Correct the fixture or implementation only after verifying the intended invariant; do not weaken the production constraint to make the test pass.
- PostgreSQL 17 migration/allowance tests: failed; inspect the job log and resolve the specific U2.8.0/legacy regression failures.
- Chromium browser regression smoke tests: 49 passed, 3 failed, 13 skipped. Failures include Dashboard/Practice Insights and historical Daily Learning review expectations, plus signed-out Flashcards auth-card visibility. Determine whether each is a genuine regression or a stale test assertion, then fix code/tests accordingly.
- U2.7.0 Chinese dictionary static/Chromium checks: failed on a source-string assertion expecting an older Daily Learning filtering expression; verify actual semantics and update the test only if equivalent behaviour is proven.
- Cloudflare build-routing check: failed because its static test expects a different cache-version placement/pattern than the current build script. Preserve environment routing and verify actual asset cache busting before correcting the assertion.
- U2.6.0 ACL migration regression: failed; inspect exact output and distinguish migration/security regression from workflow fixture drift.
- Workers Builds: `swiftdictionary-testing` failed. This is the retired testing Worker and must not be treated as the Cloudflare Pages preview result or as a reason to re-enable that Worker.
- Several older cross-version tests fail because they assert pre-U2.8.0 implementation details; do not dismiss them without proving the new behaviour preserves the prior contract.

### Immediate development priorities
1. Reconcile the failing SQL fixture and inspect all PostgreSQL/ACL regression outputs.
2. Fix the browser failures, retaining U2.7.0 Daily Learning and U2.5.0 signed-out Flashcards behaviour.
3. Reconcile stale static/cache assertions without weakening build routing.
4. Re-run all CI workflows to green; document any intentional skips and unrelated retired-Worker failure separately.
5. Continue the independent linguistic review of Chinese Quiz and Flashcard draft banks. Structural validators do not establish linguistic accuracy or release approval.
6. Review the migrations/RLS/RPCs and deletion paths in disposable local Supabase. No staging or production migration until separate approval.
7. Complete Malaysia/international privacy, retention, cross-border and content-licensing review before release; no legal clearance is implied.
