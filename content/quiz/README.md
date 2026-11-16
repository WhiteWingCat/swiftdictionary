# SwiftDictionary Quiz content authoring

## Current authoring batch

- File: `questions.en-zh.draft.json`
- Learning course: English
- Translation: Simplified Chinese
- Current status: draft only
- Batch 01: 20 Beginner questions, four mapped curriculum topics? The current batch spans five Beginner topics and four questions per topic.

These questions are original SwiftDictionary learning content. Do not copy third-party dictionary entries, textbook exercises, commercial question banks or online quiz sets. Keep prompts, distractors, translations and explanations independently authored.

## Workflow

1. Add or revise question records in the JSON draft pack. Use stable unique question IDs and the exact source lesson ID from `curriculum-map.en.json`.
2. Run `node scripts/quiz/validate-question-bank.mjs`. This checks required bilingual fields, four unique options, one matching answer key, unique IDs/prompts and source lesson/topic/difficulty mappings.
3. Run `node scripts/quiz/validate-question-bank.mjs --emit-sql` to generate SQL that inserts records as `draft`. The exporter never approves content.
4. Review each question manually for factual accuracy, one unambiguous answer, plausible distractors, appropriate difficulty, natural English, accurate Simplified Chinese and explanation quality. The validator is structural, not a substitute for educational/editorial review.
5. Only after explicit content review should a separate reviewed approval migration change selected records from `draft` to `approved`. Never combine import and approval.
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
- Do not approve content until human editorial review is complete.
- No learner personal data is part of this content pack.
- This batch introduces original authored educational text; maintain a provenance note for future additions.
