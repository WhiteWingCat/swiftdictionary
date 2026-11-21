# SwiftDictionary Update 2.7.0 — Development Plan

Date: 2026-11-21  
Status: Planning finalized; development branch prepared  
Repository: WhiteWingCat/swiftdictionary  
Application base: main at `ba580c3f43e8b34f79205b69ae9f858186759036`  
Feature branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Documentation branch: `docs/master-development-record`

## 1. Objective

Expand the Simplified Chinese dictionary and introduce a substantial Chinese learning course in the existing Lessons experience. Reuse the established lesson reader, interactive practice, progress tracking, allowance enforcement, translation refresh and account-synchronised learning architecture. Prepare structured Chinese content for Update 2.8.0 Chinese Quiz and Flashcards.

## 2. Approved scope

### A. Chinese dictionary expansion and filtering

- Expand the single-character Chinese dictionary. Initial planning target: at least 500–700 new unique character entries, with no hard upper cap if data quality, source rights and validation permit.
- Audit the current catalogue before selecting additions. Count unique single-character entries separately from multi-character related vocabulary; identify duplicates, missing pinyin, polyphonic readings, incomplete meanings and category gaps.
- Prioritise useful, common characters and learner value rather than raw volume.
- Replace the ineffective Chinese filter with:
  - Pinyin A–Z initial filter, based on the first letter of each valid Mandarin reading.
  - Character category filter. Initial categories: Actions; People; Objects; Nature; Places; Time & Numbers; Emotions & States; Descriptions; Grammar & Function; Communication.
  - Combined filtering, with text/character/pinyin search remaining usable while filters are active.
- A character may belong to multiple justified categories. Polyphonic characters should be discoverable under each relevant pinyin initial where supported by the data model.
- Preserve one Chinese character per grid card. Multi-character vocabulary remains in related-word/detail content, not as grid cards.
- Preserve the existing grid presentation: **do not add pinyin to Chinese Dictionary grid cards**. Keep the existing character-only card display and preserve character/pinyin search, stroke-order interactions, detail-panel behavior and unlimited free dictionary access.
- The strict character-above-pinyin layout rule applies specifically to **Chinese Lessons**. Whenever lesson content presents Chinese text with pinyin, pinyin must appear directly below its corresponding character/text, never above or beside it. Test this in lesson readers and responsive layouts.

### B. Chinese Lessons course

- Add a Chinese course to the existing Lessons page and reuse the current lesson architecture; do not rebuild the English lesson system.
- Provide Beginner, Intermediate and Advanced difficulty levels with independent progress.
- Initial minimum catalogue: **at least 17 permanent lessons and 112 practice questions**, matching the current English library (7 Beginner / 5 Intermediate / 5 Advanced; 44 / 34 / 34 questions respectively). The target may be exceeded if quality permits. This is a minimum, not a cap; expand when quality and validation permit.
- Reuse existing reader, practice, completion, progress and allowance behavior. No timer or time pressure.
- Guarantee English support for Chinese lessons regardless of the user's selected translation language. English must remain available as a reliable support language, not be replaced by the selected translation.
- Always include accurate tone-marked Hanyu Pinyin for Chinese lesson content: vocabulary, individual examples, full Chinese sentences, expressions, idioms, proverbs, quotations and poetry. For longer passages, align pinyin clearly with the Chinese text.
- Integrate English-to-Chinese practice, including converting familiar English words, phrases and sentences into natural Chinese.
- Teach meaningful English/Chinese structural comparisons: word order, measure words, time/tense expression, questions, negation, particles and natural phrasing versus literal translation.
- Content areas may include grammar, vocabulary, common expressions/phrases, 成语 (idioms), 谚语 (proverbs), 名言警句 (notable sayings/quotes) and selected 诗词 (poetry). Clearly distinguish these forms; do not treat them as interchangeable.
- Verify quotation wording and attribution. Prefer public-domain, original or appropriately licensed texts. Avoid substantial reproduction or unlicensed translations of modern copyrighted poems and quotations.
- Preserve the existing selected-translation behavior and refresh requirement. Translation changes must refresh all relevant lesson content without unrelated navigation or loss of current practice state.

### C. Future compatibility

- Structure vocabulary, character identity, pinyin readings, meanings, categories, examples and lesson objectives so U2.8.0 can reuse them for Chinese Quiz and Flashcards.
- Avoid introducing new personal-data collection or unnecessary learning telemetry.
- Do not change allowance values or subscription policy as part of this scope unless a concrete compatibility issue is found and approved separately. Dictionary lookup remains free and unlimited.

## 3. Suggested lesson curriculum structure

This is an initial content design guide, not a fixed lesson-title list.

- Beginner: pinyin foundations and pronunciation awareness; greetings and introductions; numbers and dates; pronouns and basic sentence patterns; common verbs and everyday vocabulary.
- Intermediate: measure words; particles; time expressions; comparisons; questions and negation; everyday situations; sentence expansion.
- Advanced: complex sentence structures; connectors; idioms and proverbs in context; nuanced vocabulary; natural expression; selected literary/cultural language.

Balance grammar, vocabulary and practical comprehension. Avoid making every lesson a list of isolated character definitions.

## 4. Implementation phases and gates

1. **Phase 0 — Baseline audit and technical design.** Inspect current main source, dictionary data shape and counts, existing filter UI/state, lesson catalogue/schema, translation refresh path, progress/allowance integration, tests and third-party notices. Record exact baseline commit and data counts. No content additions until the data model and validation approach are understood.
2. **Phase 1 — Data model and dictionary filter foundation.** Design/extend character metadata for pinyin initials and multi-category membership. Implement A–Z/category/combined filters while preserving the character-only grid cards. Add/validate the pinyin-below-Chinese-text presentation in the Chinese Lessons reader, not the dictionary grid.
3. **Phase 2 — Chinese dictionary content expansion.** Add content in small sequential batches. Validate uniqueness, Simplified Chinese form, pinyin tones and polyphonic readings, meanings, category assignment and source/licensing notes. Do not deliver intermediate ZIPs; consolidate after phase validation.
4. **Phase 3 — Chinese Lessons framework integration.** Add course selection and difficulty-specific lesson catalogue using existing lesson infrastructure. Preserve English lessons and existing progress/allowance behavior.
5. **Phase 4 — Bilingual curriculum and practice content.** Author and validate Chinese lessons, pinyin alignment, English support, English-to-Chinese exercises and language comparisons. Meet the minimum 15 lessons/52 questions before release candidate.
6. **Phase 5 — Automated and manual QA.** Run syntax/static/data/catalogue checks, unit/integration tests, Chromium/browser tests, responsive checks and owner preview testing. Verify translations refresh on every relevant page/state and preserve practice answers. Test English Lessons for regressions.
7. **Phase 6 — Release readiness.** Consolidate content, update README/release notes/third-party notices as required, complete the legal/content-risk checklist, confirm CI and preview evidence, and present a single consolidated release package only when requested. Merge/deploy only with explicit owner approval.

## 5. Mandatory QA

### Dictionary and content
- No duplicate character identities or unintended duplicate entries.
- Correct Simplified Chinese forms and accurate tone-marked pinyin.
- Polyphonic characters correctly represented and searchable.
- Pinyin A–Z initial and multi-category filters return correct results; combined filters intersect predictably.
- Search works with characters, pinyin with tones and pinyin without tones.
- One character per grid card; related words remain detail content.
- Dictionary grid cards remain character-only; no pinyin is added to the cards.
- In Chinese Lessons, pinyin is directly below the corresponding Chinese character/text on desktop/mobile and all responsive breakpoints.
- Stroke-order controls and detail-panel translation switching remain functional.

### Lessons and account behavior
- At least 17 Chinese lessons and 112 practice questions, with at least five lessons per difficulty; target the current English distribution of 7 Beginner / 5 Intermediate / 5 Advanced and 44 / 34 / 34 questions.
- English support always available; selected translation language refreshes correctly.
- Pinyin present and aligned across all Chinese lesson content.
- English-to-Chinese exercises and comparisons are pedagogically correct.
- Answer shuffling preserves correct-answer mapping; answer state survives translation switching.
- Completion is saved only after successful practice; progress remains independent by difficulty.
- Existing allowance, resume/replay, account isolation and cross-device sync behavior remain intact.
- Existing English Lessons, Quiz, Flashcards, authentication, account switching, saved words, Profile and Daily Learning regressions are checked where affected.

## 6. Legal, privacy and content-risk planning

This is a planning safeguard, not legal advice or a compliance certification. Formal external legal/privacy review remains deferred, not cleared.

- Reassess Malaysia PDPA applicability and general international privacy/16+ considerations if data collection or processing changes. Prefer no new personal-data fields, telemetry or tracking.
- Review source terms and redistribution rights for dictionary entries, definitions, pinyin datasets, example sentences, idioms, quotations, poems, translations, fonts and any third-party linguistic data. Record provenance and attribution; do not assume factual character data makes an entire database or explanatory text free of copyright.
- Use original explanations/examples or public-domain/appropriately licensed source texts. Verify quotation attribution and copyright status of translations. Do not include substantial modern copyrighted poetry or quote collections without permission.
- Recheck Hanzi Writer/stroke-data notices if the distribution arrangement changes.
- Do not claim legal compliance or legal clearance.

## 7. Development and release safeguards

- Application changes only on `feature/update-2-7-0-chinese-dictionary-lessons`, created from current `main`.
- Internal planning and archives only on `docs/master-development-record`; never merge documentation into `main`.
- Keep `main` as the production source branch. No production deployment, database mutation or destructive action without explicit owner approval.
- Protect Supabase authentication, account isolation, saved-word sync and existing RLS. No service-role keys or OAuth secrets in browser code or repository.
- Respect free-plan limits and avoid paid infrastructure assumptions.
- Keep dictionary search free and unlimited.
- Use one consolidated downloadable package per completed phase/task when requested, not intermediate ZIPs.
- Release package naming: `SwiftDictionary Update 2.7.0`.

## 8. Initial development starting point

Begin with Phase 0 only. Do not begin bulk data entry or lesson authoring until the current source/data structure has been audited. The current GitHub connector returned an empty body for `index.html` in the initial fetch attempt, so retrieve/inspect the application source through a suitable repository workflow before making technical assumptions. The README on `main` appears older than the current deployed application and must not be treated as a complete current implementation specification.


## 9. Phase 0 baseline audit — verified findings (2026-11-21)

**Audited source:** `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`; application entry point `index.html` (Git blob `f339021f75c7c92b9ffeaf2461c5c686702c46d3`). Feature branch remains based on this exact commit.

### Chinese dictionary
- Current dataset: 206 entries, 206 unique single Han characters; no multi-character grid entries.
- All 206 entries currently contain a `phonetic` value. Twelve entries include multiple slash-separated readings; across the dataset there are 221 listed readings.
- Existing schema fields: `word`, `part`, `phonetic`, `definition`, `definitionZh`, `examples`, `breakdown`, `related`, `course`.
- Current `part` values are broad labels (`汉语词汇`: 187; `汉字`: 19), not useful learner categories. No character has a `categories`/category/tag field.
- Current Chinese alphabet filtering is disabled: `makeAlphabet()` hides the A–Z strip for Chinese, and `filteredWords()` bypasses letter matching for the Chinese course. The existing category row is the English part-of-speech filter and is hidden for Chinese.
- Character cards currently display only the character and saved marker. This is intentional and must remain unchanged: **do not add pinyin to dictionary grid cards**.
- Character and pinyin search already work. Pinyin search strips diacritics for matching; retain that behavior. Current data has 22 distinct first-letter values among readings; empty A–Z letters should simply be disabled/empty.
- Stroke-order and dictionary-detail pinyin helpers already exist. The lesson reader is a separate renderer and does not currently use the pinyin line renderer.

### Existing Lessons baseline
- Current English permanent lesson library: 17 lessons — Beginner 7, Intermediate 5, Advanced 5.
- Current English practice bank: 112 questions — Beginner 44, Intermediate 34, Advanced 34.
- The existing `lessonZh` object contains Simplified Chinese translations for all 17 English lessons and their 112 questions. It is a translation layer for English-learning lessons, **not** a Chinese-language learning course.
- The current lesson reader renders lesson text, examples and practice through the English lesson data plus optional Chinese translations. It does not render pinyin. A new Chinese course therefore needs its own authored lesson data and pinyin-aware content renderer; do not repurpose `lessonZh` as Chinese course content.
- The current pinyin lookup map has 1,131 character mappings, but character-by-character lookup cannot reliably resolve context-sensitive polyphonic readings or guarantee correct sentence-level tone changes. Author and validate pinyin at phrase/sentence level for Chinese lesson material; use explicit aligned pinyin rather than assuming automatic transliteration is sufficient.

### Supabase progress, catalogue and allowance architecture
- `public.lesson_progress` currently has no learning-language column. Its uniqueness key is `(user_id,difficulty,lesson_id)`; English lesson identity is assumed throughout.
- `public.lesson_practice_results` similarly stores no learning-language identity and deduplicates by `(user_id,difficulty,lesson_id)`.
- `private.learning_content_catalog.language_code` is constrained to `en`; its permanent-lesson validation trigger and completion/replay RPCs hardcode English.
- Completion triggers write `learning_activity_log.language_code='en'`. The quota enforcement counts completed activity by user and activity type across language codes, so the existing daily lesson allowance is shared across languages. Preserve that shared limit; adding Chinese must not create a second allowance pool or bypass the existing Free/Premium limits.
- A backward-compatible additive migration is required to add explicit learning-language identity to lesson progress/practice records, permit approved `zh` permanent lessons in the private catalogue, and update secure validation/completion/replay paths. Preserve all legacy rows as English by default. Do not apply any migration to hosted staging or production without explicit approval.
- Existing RLS, authenticated-only RPC execution, atomic completion/allowance logging, user-scoped access and personal testing exemption must remain intact.

### Tests, CI and third-party content
- Existing checks include Node static/frontend assertions, Playwright Chromium smoke/regression suites, PostgreSQL 17 migration tests, disposable local Supabase Auth/RPC integration, and Supabase security-advisor checks.
- There are no dedicated Chinese dictionary-filter or Chinese Lessons browser/content validation suites yet. Add them during implementation.
- `THIRD_PARTY_NOTICES.md` identifies Hanzi Writer 3.7.3 under MIT and separately identifies Hanzi Writer stroke data from Make Me a Hanzi under the Arphic Public License. Stroke data is fetched from the upstream CDN at runtime and is not the source of the dictionary headword definitions.
- The current 206-entry dictionary dataset does not carry per-entry source/provenance/license metadata. Establish and record provenance/licensing for new and retained dictionary definitions, examples, pinyin and related vocabulary before release.

### Phase 0 conclusion
The application source is now accessible and the current baseline is sufficiently understood to design Phase 1. The key technical dependency is a language-aware but backward-compatible Lessons progress/catalogue layer. The Chinese Dictionary grid must remain character-only; the new A–Z and category filters operate on metadata without changing card presentation. The Chinese Lessons reader needs an explicit pinyin-aligned rendering model.


### Preliminary open-data source and Malaysia copyright note

- CC-CEDICT is a candidate source for single-character pinyin and English glosses, not yet approved or ingested. Its official project download page identifies the data as CC BY-SA 4.0 and states that commercial and non-commercial reuse is allowed subject to attribution and ShareAlike. If adopted, retain source/version attribution, link the licence, mark modifications, and distribute adapted CC-CEDICT data under CC BY-SA 4.0. Keep that dataset clearly separable from original SwiftDictionary lesson content; do not impose access restrictions on the licensed dictionary-derived data. Sources: https://cc-cedict.org/editor/editor.php?handler=Download and https://creativecommons.org/licenses/by-sa/4.0/.
- The MyIPO-hosted updated text of Malaysia's Copyright Act 1987 (Act 332), stated as at 30 June 2022, includes dictionaries among literary works and addresses derivative works including translations/adaptations and qualifying compilations of data through selection/arrangement. This is a relevant risk flag for copied dictionary text, translations and curated compilations, not a legal determination. Verify the latest law and actual licensing implications before release: https://www.myipo.gov.my/wp-content/uploads/2025/09/Copyright-Act-1987-Act-332.pdf.
- CC-CEDICT's licence does not automatically clear the existing 206 entries or any other source. Track provenance per imported/adapted field and do not assume character facts, pinyin readings, example sentences and explanatory definitions all have identical copyright status.
