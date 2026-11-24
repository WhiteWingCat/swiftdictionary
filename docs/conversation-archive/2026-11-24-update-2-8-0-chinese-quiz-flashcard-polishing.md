# 2026-11-24 — U2.8.0 final Chinese Quiz and Flashcards content polishing

## Owner feedback and small UI adjustment

- Owner's final UI note: the Quiz Answer Review's total-correct percentage sat too close to the top-right close button.
- Increased the score panel's right clearance by 16px at desktop and mobile breakpoints; retained the close button and all existing review controls.
- Refreshed the Lessons UI stylesheet cache key to `2.8.0-ui11` and updated the corresponding legacy smoke-test assertion.
- No new staging review was requested for this final polish; no preview link was issued.

## Chinese Quiz content and answer-integrity audit

- Reviewed all 145 Chinese Quiz questions: 128 knowledge questions and 17 English-to-Simplified-Chinese translation questions.
- The 17 translation prompts and the knowledge-question bank were checked for prompt meaning, answer choice, distractor distinction and Simplified Chinese/Pinyin consistency. No incorrect answer was identified in the review pass.
- The bank's automated validator passed. Every question maps to one of 17 permanent lesson origins and has four distinct options, a valid answer key and a unique prompt.
- A type-aware answer-leak scan returned zero leaked answers, including for English-to-Chinese translation questions.
- Live staging Supabase contains 145 approved active Chinese Quiz questions. SQL integrity checks returned: 145 unique IDs, 145 unique prompts, zero malformed option sets, zero duplicate options, zero missing correct options and zero prompt answer leaks.
- The session RPC randomizes question order and option order per session. The active-session payload omits the correct-option ID, correctness flag and explanation; those fields are only included in the authenticated review payload after the session is completed.
- Quiz review retrieval is scoped to the authenticated owner and rejects incomplete sessions.

## Chinese Flashcards content audit and corrections

- Audited the Chinese Flashcard source bank: 519 single characters, 904 multi-character vocabulary entries and 24 authored phrases (1,447 cards total).
- Automated source checks passed for all 519 character records and all 904 vocabulary Pinyin pairs. Vocabulary numeric Pinyin and accented Pinyin match.
- Every eligible target has at least three distinct distractors; translation cue uniqueness checks pass. Sentence Recall blanks every occurrence of the target; 20 source sentences contain repeated target occurrences and are blanked in full.
- The audit found two duplicate English translation cues: `教师` / `老师` and `夏天` / `夏季`. English Translation Recall was disabled for `教师` and `夏季`, preserving the unambiguous everyday alternatives.
- The audit found answer-revealing Chinese Definition Recall clues on 490 character cards and answer-revealing Chinese Translation Recall cues on 445 cards. These cards remain usable in their other eligible modes but were removed from the affected recall-mode eligibility. Runtime checks and the validator now reject any definition or Chinese-translation cue containing its target.
- `没问题` received a more direct Chinese equivalent cue (`没有问题`) rather than the weaker `当然可以`.
- Current validated mode coverage: Word 1,447; Definition 53; English Translation 1,437; Chinese Translation 71; Sentence 543. The 27 character cards without a reviewed Chinese equivalent remain excluded from Chinese Translation Recall. Definition Recall currently uses 29 target-safe characters and 24 authored phrases.
- The generated runtime bank and its draft JSON source are synchronized. Content remains marked draft; no automatic release approval was applied.

## Validation

All relevant project checks on feature-branch head `931c40242a2061cfe82f2f2a899720f4380b9f68` completed successfully:

- Chinese Quiz and Flashcard content validators.
- Authenticated Quiz RPC and Chromium runtime suite: 22 passed.
- Flashcards/Preferences authenticated integration and browser regressions.
- Chromium Mock User Flashcards browser suite.
- PostgreSQL 17 migration/allowance and U2.7 lesson-start allowance regressions.
- PostgreSQL ACL regression and Supabase CLI Auth compatibility.
- Chinese Dictionary and Lessons browser regressions.
- Chromium browser regression smoke tests.
- Supabase security advisors: no issues found.
- Cloudflare Pages deployment and build-routing guard.

The separate `Workers Builds: swiftdictionary-testing` check remains failed for the retired testing Worker; the active Cloudflare Pages deployment check succeeded. This is not being represented as a passing Worker build.

## Environment and release state

- No Production Supabase migration or write was performed.
- No Production deployment was performed.
- Staging Supabase was read-only during this polishing phase; no additional migration was needed.
- PR #16 remains open and draft on `feature/update-2-8-0-chinese-quiz-flashcards`, based on `main`. It has not been merged.
- U2.8.0 is technically prepared for the owner's main-branch release decision, subject to the owner accepting the reduced Chinese Definition/Translation mode coverage and the separate retired-Worker check disclosure.
