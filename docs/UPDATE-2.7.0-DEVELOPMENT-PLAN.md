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
- Preserve existing character/pinyin search, stroke-order interactions, detail-panel behavior and unlimited free dictionary access.
- **Strict layout invariant:** render the Chinese character above its pinyin, with pinyin directly below it. Never position pinyin to the left, right or above the character. Enforce this in desktop, mobile and responsive layouts and test it explicitly.

### B. Chinese Lessons course

- Add a Chinese course to the existing Lessons page and reuse the current lesson architecture; do not rebuild the English lesson system.
- Provide Beginner, Intermediate and Advanced difficulty levels with independent progress.
- Initial minimum catalogue: 15 permanent lessons (at least five per difficulty) and 52 practice questions. This is a minimum, not a cap; expand when quality and validation permit.
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
2. **Phase 1 — Data model and dictionary filter foundation.** Design/extend character metadata for pinyin initials and multi-category membership. Implement A–Z/category/combined filters and responsive character-over-pinyin layout. Validate existing entries before bulk expansion.
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
- Character is always above pinyin, which is directly below it, on desktop/mobile and all responsive breakpoints.
- Stroke-order controls and detail-panel translation switching remain functional.

### Lessons and account behavior
- At least 15 Chinese lessons and 52 practice questions, with at least five lessons per difficulty.
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
