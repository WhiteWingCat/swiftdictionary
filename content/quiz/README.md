# SwiftDictionary Quiz content authoring

## Current authoring batch

- File: `questions.en-zh.draft.json`
- Learning course: English
- Translation: Simplified Chinese
- Current status: draft only
- Current draft bank: 214 questions — 129 knowledge questions, 15 word-definition questions and 70 Chinese-translation questions, including 15 Phase 6 additions aligned to existing permanent lessons.
- The word-definition set contains five questions at each difficulty. Chinese-translation supply is 21 Beginner, 21 Intermediate and 28 Advanced, including one-word vocabulary items. The permanent English lessons have been expanded to teach all vocabulary, phrases, idioms, grammar structures and translation targets assessed by the draft bank.
- In the English-learning / Simplified-Chinese translation Quiz, the planned daily mix is a stable pseudorandom 1–7 Chinese questions per session, selected per learner, local reset date and difficulty. The count changes after the learner's local daily reset and remains consistent if that difficulty is restarted on the same day. These replace questions within the fixed 10/15/20-question session lengths.
- Each Mock User session deliberately includes one lesson-aligned word-definition question. The Chinese-translation count is randomized from 1–7 for each learner, local reset date and difficulty. The authenticated Quiz question-type migration now supports knowledge, word-definition and Chinese-translation records. The exporter includes all 214 questions as drafts; no question is automatically approved or made available.

These questions are original SwiftDictionary learning content. Do not copy third-party dictionary entries, textbook exercises, commercial question banks or online quiz sets. Keep prompts, distractors, translations and explanations independently authored. The Chinese-translation assessment questions use Chinese answer choices as the assessment target; their English glosses are supporting metadata, not the answer text.

## Workflow

1. Add or revise question records in the JSON draft pack. Use stable unique question IDs, the exact source lesson ID and a valid `learning_objective_id` from `curriculum-map.en.json`. Every assessed word, phrase, grammar structure and Chinese translation target must be taught in that permanent lesson before it enters the Quiz bank.
2. Run `node scripts/quiz/validate-question-bank.mjs`. This checks required bilingual fields, four unique options, one matching answer key, unique IDs/prompts, source lesson/topic/difficulty mappings and a valid learning-objective link for every question.
3. Run `node scripts/quiz/validate-question-bank.mjs --emit-sql` to generate a draft-only SQL import containing all 199 questions. The exporter never approves content by default.
4. For a release explicitly authorized by the owner, run `node scripts/quiz/validate-question-bank.mjs --emit-sql --approve-for-release`. This generates approved rows with `approved_at`; it must only be used for the owner-authorized release migration. The source JSON remains draft. Never use this flag as part of routine content editing.
5. Human bilingual review is deferred for the current 2.4.0 live-testing release. Friends' and owner's feedback will inform later corrections. Structural validation is not a substitute for checking factual accuracy, natural English/Chinese, one unambiguous answer, plausible distractors, difficulty and explanations.
6. Run the database eligibility checks and the full Quiz RPC test suite before making a difficulty available.

## Availability gates

The backend counts only approved questions whose source lesson is active in `private.learning_content_catalog`, whose lesson ID and topic match, and whose language pair matches the learner's selected translation language.

| Difficulty | Minimum before availability | Preferred three-session target |
|---|---:|---:|
| Beginner | 20 Beginner | 30 Beginner |
| Intermediate | 24 Intermediate + 16 Beginner | 36 Intermediate + 24 Beginner |
| Advanced | 32 Advanced + 8 Intermediate + 8 Beginner | 48 Advanced + 12 Intermediate + 12 Beginner |

Each session also requires at least three topics and caps any one topic at 40%. Fresh questions must remain available for the requested session. Same-day question reuse is blocked across sessions and difficulty levels.

The minimum and target checks are per selected difficulty. Because question IDs cannot repeat on the same local day across difficulties, a learner who mixes difficulties may consume overlapping source-difficulty inventory faster than the per-difficulty target alone suggests.

## Safety and release boundaries

- Draft packs and generated SQL do not change production by themselves.
- Do not import Quiz content into production until the Quiz schema/RPC migrations are approved and applied.
- The current 2.4.0 production content release is explicitly owner-authorized with human review deferred. Do not infer that structural validation certifies educational accuracy; record and correct issues found during live testing.
- No learner personal data is part of this content pack.
- This batch introduces original authored educational text; maintain a provenance note for future additions.


## Chinese-learning draft bank — Update 2.8.0

- File: `questions.zh-en.draft.json`
- Learning course: Simplified Chinese
- Supporting translation language: English
- Current status: draft only; no automatic approval or live availability.
- Current draft: 128 Chinese-language knowledge questions (44 Beginner, 36 Intermediate, 48 Advanced) plus 17 English-to-Chinese translation questions (7 Beginner, 5 Intermediate, 5 Advanced).
- The knowledge bank alone meets the approved three-session preferred capacity targets. Translation questions are supplemental and are eligible only when the learner selects English as the translation language. Selecting Chinese excludes all English-to-Chinese integration items and keeps question prompts, answers, Pinyin and explanations in Chinese.
- Translation items are authored as English prompts with Simplified Chinese answer choices, Pinyin support and Chinese explanations. The renderer displays Chinese answers as primary text and English glosses as supporting text only in the English translation preference.
- The bank is mapped to the permanent Chinese lesson catalogue and learning objectives. Every topic has at least one translation item; no translation item is a language-only duplicate of an existing prompt.

### Chinese bank workflow

1. Edit `questions.zh-en.draft.json` and `curriculum-map.zh.json`. Keep every question linked to a valid permanent lesson and learning objective.
2. Run `node scripts/quiz/validate-chinese-question-bank.mjs` to check lesson/objective mapping, question types, Pinyin, four distinct options, unique prompts, and the minimum knowledge/translation coverage.
3. Run `node scripts/quiz/validate-chinese-question-bank.mjs --emit-sql` only to produce a draft-only import. The exporter writes `status='draft'` and never approves content.
4. Complete independent Simplified Chinese/English linguistic review, answer-key verification, distractor review, Pinyin review, and mode-overlap review before owner release approval.
5. Do not apply the Chinese Quiz import or mark any question approved in staging or production until the separate release gate is satisfied.
