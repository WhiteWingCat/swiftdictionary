# SwiftDictionary U2.8.0 — Chinese Quiz and Flashcard Content QA

**Review date:** 24 November 2026  
**Branch:** `feature/update-2-8-0-chinese-quiz-flashcards`

## Chinese Quiz

- Reviewed all **145 approved Staging questions**: 128 knowledge questions and 17 English-to-Chinese translation questions.
- Difficulty distribution: Beginner 44 knowledge + 7 translation; Intermediate 36 + 5; Advanced 48 + 5.
- Checked answer keys, four-option uniqueness, distractor plausibility, Chinese prompt wording, English prompt translations, explanations, and lesson-objective mapping.
- Published **23 new question revisions** to correct Pinyin alignment, improve ambiguous wording, repair mismatched English prompt translations, and remove direct answer cues from Pinyin guides. Previous revisions are retained as retired history.
- Pinyin guides are optional and omitted where including them would reveal an answer or where a reliable complete guide is unavailable.
- The updated validator and Staging SQL regression scan for direct answer text and Pinyin leakage. Authenticated Quiz runtime tests verify that correct answers are not exposed in an active session before completion.

## Chinese Flashcards

The bank contains **1,447 cards**: 519 single characters, 904 multi-character vocabulary items, and 24 SwiftDictionary-authored phrases.

- All 519 character cards are compared with the existing Chinese dictionary source for Pinyin, English gloss, Chinese definition, example sentence, related words, and HSK level.
- All 904 CC-CEDICT-derived vocabulary entries are checked for numeric-tone to accented-Pinyin consistency.
- The 24 authored phrase cards are checked for Pinyin, meaning, Chinese equivalent, and example use.
- Duplicate terms, missing mode-specific fields, and mode eligibility are checked.
- Every eligible target must have at least three distinct distractors, allowing four unique choices in Word, Definition, English Translation, Chinese Translation, and Sentence modes.
- Found **20 examples** where the target character appeared more than once. Sentence Recall now blanks every occurrence, and answer options remain hidden during the memory phase.

## Release and legal notes

- The Quiz and Flashcard source data remain in draft/review status until release-owner sign-off.
- CC-CEDICT attribution and licence information remain in the repository notice and in-app data-sources page; underlying data files remain publicly accessible. Gameplay allowances do not gate access to the licensed source files.
- No new personal-data collection or tracking was introduced.
- No Production Supabase migration, production deployment, or merge to `main` is included.

## QA boundary

The Quiz bank received a question-by-question review. Flashcard character records were compared with the existing dictionary source, vocabulary Pinyin was mechanically cross-checked against numeric Pinyin, and all 24 authored phrases were manually reviewed. The 904 CC-CEDICT English glosses remain source-derived; this QA does not claim a separate native-speaker retranslation of every gloss.
