# SwiftDictionary Update 2.8.0 — Final Development Plan

**Status:** Owner-authorised development; technical audit in progress  
**Planning date:** 2026-11-23  
**Update title:** Chinese Quiz & Flashcards Expansion  
**Application branch reserved:** `feature/update-2-8-0-chinese-quiz-flashcards` (created from current `main`; verified to exist; untouched)  
**Production/main:** No changes for U2.8.0  
**Database:** No U2.8.0 schema changes or migrations  
**Staging:** No U2.8.0 deployment or data changes

This document is the authoritative scope and acceptance baseline for U2.8.0. On 2026-11-23, the owner explicitly authorised development after the latest Master Development Record and relevant conversation archives were reviewed. The technical audit and implementation may proceed on the reserved application branch. Scope changes, merge, production migrations and production deployment remain subject to their separate approval gates.

## 1. Goals and boundaries

U2.8.0 expands Quiz and Flashcards for the Simplified Chinese course, improves the Quiz visual experience, corrects Practice Insights so mistakes can contribute to review recommendations, and redesigns the Dashboard. Preserve existing English learning, existing Quiz/Flashcard rules, account isolation, custom collections, allowances, timezone handling and permanent learning records.

Out of scope unless separately approved:
- Changing Free/Premium quotas, subscription policy or allowance consumption rules.
- Restricting dictionary search.
- Replacing or removing existing Quiz/Flashcard modes or challenge mechanics.
- Destructive deletion of learning history at midnight.
- Production deployment, production migration, merge or release without separate explicit approval.
- Treating plan approval as permission to start work immediately.

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

## 15. Current status and recovery point (2026-11-23)

- Owner approved this final plan.
- Owner explicitly instructed: **do not start development yet**.
- Reserved application branch `feature/update-2-8-0-chinese-quiz-flashcards` exists from current `main`; branch existence was checked on 2026-11-23. It remains untouched.
- No U2.8.0 application files, content, SQL, migrations, schema, RPCs, staging data, production data or deployments have been changed.
- Documentation updates are confined to `docs/master-development-record`.
- Next permitted step: wait for the owner's separate instruction to begin the technical audit/development. Do not interpret approval of this plan as start approval.
