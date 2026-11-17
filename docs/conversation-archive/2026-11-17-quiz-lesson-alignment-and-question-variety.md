# Update 2.4.0 — Quiz curriculum alignment and expanded question variety (2026-11-17)

## Owner direction

The owner requested a broader range of Quiz question styles, including word-definition questions, one-word Simplified Chinese translation questions, and a daily-randomized Chinese integration count from 1 to 7 at every difficulty rather than fixed 1/4/7 values.

The owner also required every Quiz question to connect to permanent lesson content, including Chinese-integrated questions. If a question tested something not taught, the relevant permanent lesson must be expanded or supplemented. The owner authorised continuation of development after adding this requirement.

## Curriculum audit and changes

A full pass was performed over the 199-question draft bank, its 15 permanent English lesson records and the bilingual lesson content.

The following existing permanent lessons were expanded in both English and Simplified Chinese. No new lesson IDs were necessary because the identified gaps could be taught coherently within their existing lesson topics:

- **Beginner — Everyday vocabulary:** descriptive adjectives and their meanings, including boring, exciting, beautiful, crowded, comfortable, delicious, friendly, quiet, useful and expensive; everyday collocations are also taught explicitly.
- **Beginner — Articles:** article selection by sound, including umbrella and hour.
- **Beginner — Countable/uncountable nouns:** irregular plural children; advice, information, equipment and furniture; slices of bread and sugar.
- **Beginner — Sentence basics:** subject/verb/object roles, there is/there are, adjective position and do/does question structure.
- **Beginner — Present simple:** positive and negative forms, questions, third-person singular, routines and the correct placement of usually.
- **Intermediate — Collocations:** make progress, heavy rain, meet a deadline, raise an issue, highly unlikely, take responsibility, pose a problem, deeply concerned, make a decision and the meaning of collocation.
- **Intermediate — Conditionals:** zero, first, second and third conditional patterns, unless, even if, provided that, and an introduction to mixed conditionals.
- **Intermediate — Phrasal verbs:** give up, put off, look after, run into, run out of, carry on, bring up, turn down and get along with; postpone is taught as an equivalent of put off.
- **Intermediate — Perfect forms:** present perfect, present perfect continuous, past perfect, since/for, already and yet.
- **Intermediate — Word families:** decide/decision, rely/reliable, succeed/successful, create/creativity, danger/dangerous, accurate/accuracy, persuade, convince/convincing, clarification/unclear and affect/effect.
- **Advanced — Hedging:** tentative, cautious, effective, attributable, consistent, compelling and causal relationship, alongside qualified claims.
- **Advanced — Inversion:** the tested negative/restrictive inversion patterns, including not until, only after, under no circumstances, no sooner…than, little did, at no point and third-conditional inversion.
- **Advanced — Mixed conditionals:** both time-reference patterns and the inverted mixed-conditional form used by a Chinese-integrated question.
- **Advanced — Idioms:** all expressions assessed in the bank, including get the ball rolling, tip of the iceberg, cut corners, on the same page, back to square one, on the fence, blessing in disguise, under the weather, in the long run, break the ice, scratch the surface, take the plunge and jump to conclusions.
- **Advanced — Precise vocabulary:** all tested near-synonym/confusable pairs, including historic/historical, ensure/assure, eminent/imminent, adopt/adapt, complement/compliment, discreet/discrete, credible/credulous, imply/infer, and the tone/disclosure terms tactful, candid, harsh, incidental, reluctant and disclose.

The Chinese lesson records received corresponding Simplified Chinese explanations, points, examples and practice items.

### Curriculum traceability

- Added objective definitions to every source lesson in content/quiz/curriculum-map.en.json.
- Added learning_objective_id to every one of the 199 question records.
- The content validator now rejects a question if its source lesson has no learning objective or if its objective ID does not belong to that source lesson.
- The Mock loader requires every draft question to carry a learning-objective link, and issued Mock questions retain that link.
- A separate semantic audit checked all one-word definition/translation targets against the mapped bilingual lesson text; no target was left without lesson coverage.
- Full-sentence Chinese translation questions were checked against the grammar, collocation, phrasal-verb, idiom or vocabulary topic of their mapped lesson.

### Question-bank composition and session selection

The draft pack now contains 199 questions:
- 114 knowledge questions: 30 Beginner, 36 Intermediate, 48 Advanced.
- 15 word-definition questions: five per difficulty.
- 70 Chinese-translation questions: 21 Beginner, 21 Intermediate, 28 Advanced.

The Mock selector now:
- Includes one word-definition question in each 10/15/20-question session.
- Uses a stable pseudorandom Chinese-translation count from 1 to 7 for each Mock learner, local reset date and difficulty when Simplified Chinese is selected as the translation language.
- Keeps that daily count stable when the learner restarts the same difficulty on the same day; it recalculates after the learner's local daily reset.
- Keeps the total session lengths and existing 10 / 12+3 / 12+6+2 source-difficulty composition unchanged.
- Continues to avoid reusing question IDs on the same local day, including across abandoned sessions and difficulty levels.
- Uses knowledge questions only for the remaining places after the definition and selected Chinese-translation items have been reserved.

The English-learning / English-translation preference still excludes Chinese-translation questions, but the session continues to include the word-definition item.

### Additional content correction

The audit found that quiz-beginner-030 had an incorrect answer sentence placing “usually” after the main verb. The answer was corrected to “She usually drinks tea in the evening.” The distractor set was revised to remain unique after Unicode normalisation.

The Chinese-integrated question quiz-advanced-zh-006 tests a third-conditional inversion, not a mixed conditional. Its source lesson was corrected from the mixed-conditionals lesson to the advanced inversion lesson. The separate inverted mixed-conditional question remains mapped to the mixed-conditionals lesson, which now explicitly teaches that form.

## Validation and current branch state

- Implementation branch: feature/update-2-4-0-quiz.
- Latest application/documentation commit at this note: 5b075f9bc01f0165fa0704931d42fb2d6ab0fa29.
- PR #8 remains open, draft and unmerged.
- Quiz database foundation workflow run #44059590986 passed both PostgreSQL/draft-import and disposable local Supabase Auth/RPC jobs, including six authenticated Chromium Quiz runtime tests and Supabase security advisors.
- Companion 2.3.x regression workflow run #44059591070: PostgreSQL 17, Chromium browser regression (23 passed) and Supabase CLI local Auth compatibility all passed.
- The draft content validator and PostgreSQL import assertions passed for the 199-question source pack; the exporter continues to include only the original 114 knowledge questions.
- Cloudflare Pages check for the feature branch completed successfully. The separate Workers Builds check remains failed, consistent with the pre-existing split result recorded in the preceding archive; it is not the Pages deployment result.

## Backend, legal and release boundaries

- The 15 word-definition and 70 Chinese-translation questions remain Mock User preview-only because authenticated Quiz database/RPC support for the new question types has not yet been added. The SQL exporter intentionally excludes all 85 non-knowledge items.
- All 199 questions remain draft; structural validation and lesson alignment do not constitute final human bilingual editorial approval.
- No production Quiz schema/content, production learner data, production settings or Supabase migration was changed in this work. No staging migration/import was performed.
- This content work adds original educational text only. It adds no learner personal-data field, tracking or analytics. The existing Quiz account-linked progress, answers, score and history processing still requires the standing Malaysia PDPA and applicable international privacy review, retention/deletion disclosures, cross-border processing assessment and 16+ safeguards before release. This is planning guidance, not legal advice.
- PR #8 remains draft and unmerged. Do not merge or mark the bank approved without the owner's explicit approval and completion of human editorial review.

## Next steps

1. Continue bilingual editorial review for factual accuracy, natural Simplified Chinese, answer uniqueness, difficulty and explanations.
3. Add authenticated database/RPC support for word_definition and chinese_translation in a reviewed feature-branch migration, then test it in the isolated staging environment after its clean-schema bootstrap is complete.
4. Keep all content draft until the owner has reviewed and explicitly approved the bank. Production import and release remain separate approval gates.


### Final Mock objective-link guard (2026-11-17)

- The Mock loader now verifies that each question's learning_objective_id actually exists in the objectives array of its mapped permanent lesson; a non-empty but mismatched objective is rejected.
- Issued Mock question snapshots retain learning_objective_id, and the Mock test asserts that the issued snapshot matches the source draft record.
- Follow-up application commit: a0ff09012751a16d5d7e4c683ac965cf385c5d9d.
- On that commit, Cloudflare Pages, quiz-db-foundation, PostgreSQL 17, Chromium browser regression and Supabase CLI local Auth compatibility checks passed. The separate disposable local Supabase Auth/RPC integration job was still running at the latest check. The separate Workers Builds check remains failed; the Pages deployment is successful.
