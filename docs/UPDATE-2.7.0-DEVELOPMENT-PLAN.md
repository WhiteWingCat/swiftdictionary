# SwiftDictionary Update 2.7.0 — Development Plan

Date: 2026-11-21  
Status: Implementation in progress; automated U2.7 checks pass; staging validation pending  
Repository: WhiteWingCat/swiftdictionary  
Application base: main at `ba580c3f43e8b34f79205b69ae9f858186759036`  
Feature branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Documentation branch: `docs/master-development-record`

## 1. Objective

Expand the Simplified Chinese dictionary and introduce a substantial Chinese learning course in the existing Lessons experience. Reuse the established lesson reader, interactive practice, progress tracking, allowance enforcement, translation refresh and account-synchronised learning architecture. Prepare structured Chinese content for Update 2.8.0 Chinese Quiz and Flashcards.

## 2. Approved scope

### A. Chinese dictionary expansion and filtering

- Expand the single-character Chinese dictionary. Working candidate pool: up to **1,295 new unique characters** from HSK 3.0 character levels 1–5 after deduplication against the current 206 entries; all candidates remain subject to source, linguistic, usefulness and quality validation. No hard upper cap if further additions are justified.
- Audit the current catalogue before selecting additions. Count unique single-character entries separately from multi-character related vocabulary; identify duplicates, missing pinyin, polyphonic readings, incomplete meanings and category gaps.
- Prioritise useful, common characters and learner value rather than raw volume.
- Replace the ineffective Chinese filter with:
  - Pinyin A–Z initial filter, based on the first letter of each valid Mandarin reading.
  - Character category filter. Initial categories: Actions; Expressions; Communication; People; Objects; Nature; Places; Time & Numbers; Emotions & States; Descriptions; Grammar & Function.
  - Combined filtering, with text/character/pinyin search remaining usable while filters are active.
- A character may belong to multiple justified categories. Polyphonic characters should be discoverable under each relevant pinyin initial where supported by the data model.
- Preserve one Chinese character per grid card. The Dictionary grid remains character-only: do not add pinyin to grid cards. Multi-character vocabulary remains in related-word/detail content, not as grid cards. Keep existing pinyin search and pinyin in character details.
- Preserve the existing grid presentation: **do not add pinyin to Chinese Dictionary grid cards**. Keep the existing character-only card display and preserve character/pinyin search, stroke-order interactions, detail-panel behavior and unlimited free dictionary access.
- The strict character-above-pinyin layout rule applies specifically to **Chinese Lessons**. Whenever lesson content presents Chinese text with pinyin, pinyin must appear directly below its corresponding character/text, never above or beside it. Test this in lesson readers and responsive layouts.

### B. Chinese Lessons course

- Add a Chinese course to the existing Lessons page and reuse the current lesson architecture; do not rebuild the English lesson system.
- Provide Beginner, Intermediate and Advanced difficulty levels with independent progress.
- Initial minimum catalogue: **at least 17 permanent lessons and 112 practice questions**, matching the current English library (7 Beginner / 5 Intermediate / 5 Advanced; 44 / 34 / 34 questions respectively). The target may be exceeded if quality permits. This is a minimum, not a cap; expand when quality and validation permit.
- Reuse existing reader, practice, completion, progress and allowance behavior. No timer or time pressure.
- Guarantee English support for Chinese lessons regardless of the user's selected translation language. English must remain available as a reliable support language, not be replaced by the selected translation.
- Always include accurate tone-marked Hanyu Pinyin for Chinese lesson content: vocabulary, individual examples, full Chinese sentences, expressions, idioms, proverbs, quotations and poetry. **Strict Lessons layout invariant:** show the Chinese text first and its pinyin immediately underneath; never place pinyin to the left, right or above. Put English support after the pinyin. For longer passages, align pinyin clearly with each Chinese sentence or passage block.
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
5. **Phase 4 — Bilingual curriculum and practice content.** Author and validate Chinese lessons, pinyin alignment, English support, English-to-Chinese exercises and language comparisons. Meet the minimum 17 lessons/112 questions before release candidate.
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
- Pinyin present and aligned across all Chinese lesson content; every Chinese lesson text block displays Chinese first, pinyin directly below, then English support.
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

Phase 0 audit completed on 2026-11-21. Core dictionary filters/content expansion, Chinese Lessons, language-aware progress migration, source attribution and automated QA are now implemented on the feature branch. The existing Free 5 / Premium 15 permanent-lesson daily allowance is preserved as a shared allowance across English and Chinese, consistent with the existing activity-type accounting and regression tests. Continue with final manual linguistic review and owner-approved staging validation.


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

- **Character selection candidate: HSK 3.0 character list (Levels 1–5).** The MIT-licensed `elkmovie/hsk30` list contains 300 characters per level for Levels 1–5, but its own header warns that it was OCRed and not extensively proofread. Use it only as a prioritisation checklist, not as unquestioned authority. After deduplication against the existing 206 entries, Levels 1–5 provide 1,295 new candidates; Levels 1–4 alone provide 998. All 1,295 candidates were found in the CC-CEDICT single-character data and Unihan `kMandarin` readings; 1,283 also appear in the `kHanyuPinlu` reading data. Validate every character and HSK level before adding. Source: https://github.com/elkmovie/hsk30 (MIT; copyright notice in `charlist.txt` identifies Pleco Inc.).
- **Primary source candidate: Unicode Unihan 18.0.0.** The current Unihan release is Unicode 18.0.0 (2026-09-01). Its fields include `kDefinition` (English gloss), `kMandarin` (customary pinyin reading), `kHanyuPinyin` (dictionary-based pinyin readings, with multiple readings ordered by the cited dictionary), `kHanyuPinlu` (pronunciation/frequency information), and `kIICore` (core ideographs with A/B/C priority and source identifiers). These fields can support candidate selection, but Unihan explicitly warns that readings and definitions are not definitive and can vary by word/context. Validate every selected character and all polyphonic readings; do not treat a single character reading as a guaranteed sentence-level pronunciation. Use the Chinese-source identifiers and IICore priority conservatively when ranking candidates. Sources: https://www.unicode.org/reports/tr38/ and https://www.unicode.org/Public/18.0.0/ucd/Unihan.zip.
- Unicode's official FAQ identifies the Unicode License as a permissive free/open-source license, and the Unicode License v3 grants rights to use, modify, publish, distribute and sell the data provided the copyright and permission notice is included with copies or associated documentation. Preserve the exact notice and record the source release. Sources: https://www.unicode.org/faq/unicode_license.html and https://www.unicode.org/license.txt.
- **Secondary candidate: CC-CEDICT.** Its official project page identifies the dictionary as CC BY-SA 4.0. If used for additional pinyin/definitions, keep it as a separately attributable data layer, provide attribution and licence links, indicate modifications, and distribute adapted CC-CEDICT data under the same licence. Do not assume the CC-CEDICT licence applies to separately authored SwiftDictionary lesson content. Sources: https://cc-cedict.org/editor/editor.php?handler=Download and https://creativecommons.org/licenses/by-sa/4.0/.
- Do not rely on the old Unihan `kFrequency` field; it was removed in Unicode 16.0.0. The current `kHanyuPinlu` property is a distinct readings/frequency source.
- The MyIPO-hosted updated text of Malaysia's Copyright Act 1987 (Act 332), stated as at 30 June 2022, includes dictionaries among literary works and addresses derivative works including translations/adaptations and qualifying compilations of data through selection/arrangement. This is a relevant risk flag for copied dictionary text, translations and curated compilations, not a legal determination. Verify the latest law and actual licensing implications before release: https://www.myipo.gov.my/wp-content/uploads/2025/09/Copyright-Act-1987-Act-332.pdf.
- Neither source automatically clears the existing 206 entries or any other source. Track provenance per imported/adapted field and do not assume character facts, pinyin readings, example sentences and explanatory definitions all have identical copyright status. For imported records, store source identifiers per field (e.g. CC-CEDICT for adapted English glosses, Unihan 18.0.0 for pinyin, HSK 3.0 list for candidate level) and keep original SwiftDictionary categories/examples clearly identified.


## 10. Phase 1 implementation progress — Chinese dictionary filter foundation

**Current status: partial implementation committed to the application feature branch; CI green.**

- Application branch head: `510954a3e2c037ab7f231ddaeec3247299c08181`.
- Pinyin A–Z filter is enabled for the Chinese course. It matches the first letter of any slash-separated pinyin reading, strips tone diacritics for initial detection, disables letters with no matching entries, and combines with the existing character/pinyin search.
- Polyphonic characters can appear under each listed pinyin initial. Browser coverage explicitly checks the character 会 under H and K.
- Added Chinese category-filter controls and category matching against an entry's `categories` array. Supported category slugs: actions, expressions, communication, people, objects, nature, places, time-numbers, emotions-states, descriptions, grammar-function. A character can have multiple categories.
- Added a separate `data/chinese-characters.js` data file, loaded before the main app script. It now contains the first 100 new HSK Level 1 characters; the combined dictionary contains 306 unique single-character entries (206 existing + 100 additions).
- Every new entry includes pinyin, English and Simplified Chinese meanings, an example sentence, related vocabulary, a learning breakdown, one or more categories, HSK level metadata and per-entry source IDs. The category row is now visible because the new records are tagged.
- Category filter currently supports 11 categories: Actions, Expressions, Communication, People, Objects, Nature, Places, Time & Numbers, Emotions & States, Descriptions, and Grammar & Function. Combined category + Pinyin initial filtering is browser-tested.
- Dictionary cards remain character-only. No pinyin was added to grid cards; the new A–Z filter uses the pinyin data without changing card presentation. The pinyin-below-Chinese layout rule remains specific to Chinese Lessons.
- Added explicit hidden-state CSS for category rows inside the filter panel, so hidden category controls do not remain displayed because of a more-specific flex rule.
- Added `tests/update-2-7-0/check-chinese-dictionary.mjs`, `tests/browser/update-2-7-0-chinese-filters.spec.js`, and dedicated GitHub Actions workflow `.github/workflows/update-2-7-0-chinese-dictionary.yml`.
- Added per-entry provenance documentation at `data/CHINESE-DICTIONARY-SOURCES.md`, expanded `THIRD_PARTY_NOTICES.md), and published user-facing `data-sources.html`, linked from the app and Terms placeholder footer.
- GitHub Actions run [44868243733](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44868243733) passed: 306 unique single-character entries, pinyin/category/provenance checks, inline JavaScript syntax check and all four Chromium browser tests.
- Early CI attempts exposed a CSS specificity issue with the `hidden` attribute, a Playwright locator assertion issue, a missing course marker on imported records and a category slug mismatch. These were corrected; the final recorded run is green.
- Continue the remaining 48 HSK Level 1 candidates and then Levels 2–5 in small, reviewed batches. No Chinese Lessons implementation or hosted Supabase migration has occurred yet.



## 11. Development progress — verified snapshot (2026-11-21)

The following implementation results supersede the earlier Phase 0-only starting point and the initial 100-character Phase 1 milestone recorded above.

### Phase 0 — baseline audit
- Complete. The actual application Git blob was retrieved and audited; the earlier empty connector response was an access-method limitation, not an empty application file.
- Baseline: `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Existing English Lessons baseline confirmed as 17 lessons and 112 questions (Beginner 7/44, Intermediate 5/34, Advanced 5/34).
- Existing Chinese Dictionary baseline confirmed as 206 unique single-character entries. The Dictionary grid is intentionally character-only; pinyin must not be added to its cards.

### Phase 1 — dictionary filter foundation
- Implemented Pinyin A–Z initial filtering, category filtering and combined filtering with existing character/pinyin search.
- Implemented 11 learning categories and support for polyphonic readings under their applicable initials.
- Dictionary grid remains unchanged and character-only. Existing pinyin search and detail presentation remain.
- The dedicated U2.7.0 browser suite passed all five dictionary tests.

### Phase 2 — Chinese Dictionary expansion
- Current dataset contains **519 new entries**, bringing the combined Chinese Dictionary to **725 unique single-character entries** (206 existing + 519 new).
- The 519 additions include pinyin, definitions, examples, related vocabulary, learning notes, categories, HSK candidate level and per-entry source IDs.
- Static checks confirm unique single-character records, required metadata, category validity, source identifiers and no duplicate entries.
- Data-source and attribution notices are present in `data-sources.html`, `data/CHINESE-DICTIONARY-SOURCES.md` and `THIRD_PARTY_NOTICES.md`. This is not a legal clearance; review the licensing notes in Section 6 before release.

### Phase 3 — Chinese Lessons framework integration
- Chinese Lessons now use a separate Chinese course dataset and language-aware progress/catalogue model, while reusing the existing reader, practice, allowance and progress architecture.
- The additive Supabase migration is committed at `supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql`.
- The migration and its regression SQL have passed the PostgreSQL/CI database foundation job. The local Supabase Auth/RPC integration workflow is tracked separately.
- **The migration has not been applied to hosted staging or production.** No hosted database or production deployment was changed.

### Phase 4 — Chinese lesson content
- Chinese lesson catalogue contains **17 permanent lessons and 112 practice questions**, matching the actual English course volume:
  - Beginner: 7 lessons / 44 questions.
  - Intermediate: 5 lessons / 34 questions.
  - Advanced: 5 lessons / 34 questions.
- English support is included in every bilingual lesson text block and remains visible independently of the selected translation language.
- Pinyin is authored at phrase/sentence level and is rendered directly below Chinese lesson text. This layout requirement applies to Lessons only, never to Dictionary grid cards.
- Curriculum includes pronunciation, greetings, numbers/dates, pronouns, actions, places, questions/negation, measure words, particles, time, comparisons, sentence patterns, complex structures, connectors, idioms, proverbs, nuanced vocabulary and selected classical literature.
- A dedicated content validator checks lesson counts, question counts, stable IDs against the Supabase content catalogue, English support, pinyin presence and four-option practice structure.
- The Chinese lesson layout browser test passed, including the Chinese-text / pinyin / English vertical order and the 7/5/5 difficulty library counts.

### Verified CI snapshot
- U2.7.0 dictionary/lesson workflow run **#44875595145** passed: 725 unique dictionary characters (519 new), 17 lessons, 112 practice questions, five dictionary Chromium tests and one Chinese Lessons layout test.
- Quiz/database foundation job in workflow **#44875595192** passed, including the U2.7.0 language-aware lesson migration and SQL regression tests.
- Await the companion local Supabase Auth/RPC integration job and complete broader Lessons/Daily Learning browser regression before release readiness.

### Current next steps
1. Complete the local Supabase Auth/RPC integration and security-advisor checks.
2. Run the full English Lessons and Daily Learning browser regression suite, not only the Chinese-specific smoke test.
3. Add/verify Chinese course progress completion in browser tests, including English/Chinese progress isolation.
4. Conduct a final linguistic review of pinyin, examples, translations, idioms, proverb classifications and classical-source attribution.
5. Complete content-source/licensing review and owner preview testing.
6. Only then prepare release notes and a consolidated release package. Do not merge to `main`, apply the migration to hosted Supabase, or deploy without explicit owner approval.


### Verification update — full browser regression passed (2026-11-21)

- Latest application feature-branch head: `27739f86162ddd2b7251ebe52ca98490f224782e`.
- U2.7.0 workflow **#44876433048** completed successfully:
  - Dictionary static/data checks: 725 unique characters, 519 new; inline script syntax check passed.
  - Chinese Lessons content validation: 17 lessons / 112 questions; bilingual/pinyin field checks passed.
  - Full English Lessons and Daily Learning browser regression: **26/26 passed**. This includes the Chinese lesson completion/progress-isolation test.
  - Chinese Dictionary filter browser checks: **5/5 passed**.
  - Chinese Lessons bilingual vertical-layout browser check: **1/1 passed**.
- Quiz database foundation workflow **#44876433049**: PostgreSQL/CI job passed. Companion local Supabase Auth/RPC integration job was still in progress at this snapshot.
- The full suite verified the corrected distinction: Dictionary grid cards remain character-only; Chinese Lessons render Chinese text, then pinyin directly below, then English support.


### Latest verification and category coverage clarification (2026-11-21)

- Current application feature branch head: `c0d986a31b2905639c5ddd28b59e63d4c217edf2`.
- U2.7.0 workflow **#44876788816** passed on the current code:
  - Dictionary checks: 725 unique characters (519 new), inline JavaScript syntax passed.
  - Chinese Lessons checks: 17 lessons / 112 questions, all bilingual and pinyin-supported.
  - Full English Lessons and Daily Learning regression: 26/26 passed.
  - Chinese Dictionary filter browser tests: 5/5 passed.
  - Chinese Lessons bilingual layout test: 1/1 passed.
- Category coverage clarification: the original 206 Chinese entries already receive their 11 learner categories and verified additional pinyin readings from `window.SWIFT_CHINESE_METADATA` in `data/chinese-characters.js`; the app applies this metadata before filtering. The 519 new entries carry their own categories. Therefore all 725 entries are included in the category system. No duplicate inline category map is needed.
- Quiz database foundation job **#44876788818** and its companion local Supabase Auth/RPC integration both passed against the current branch head. The local integration applied the U2.7.0 migration to an ephemeral local Supabase instance, passed the Auth contract, SQL regression, authenticated Quiz runtime (12 tests), Flashcards (3 tests), Lessons/Daily Learning allowance (2 tests), and Supabase security advisors (“No issues found”). This was local CI only; no hosted migration was applied.
- No hosted staging or production Supabase migration has been applied; no merge or deployment has occurred.


## 12. Malaysia and international privacy-risk check — 2026-11-21

This is a product-planning risk review, not legal advice or a compliance certification. Formal legal/privacy review remains deferred.

### U2.7.0 data-change assessment

- U2.7.0 adds a `learning_language` dimension to existing lesson progress and practice records so English and Chinese course progress are separate. It does not add new identity fields, sensitive personal data, advertising profiles, analytics SDKs or new telemetry.
- The new field remains attached to the existing authenticated user record and uses the existing account-scoped RLS, user foreign keys and account-deletion cascade. CI validates the language-aware migration and isolation.
- This is still user-linked learning-progress data. The Privacy Notice should clearly explain that lesson progress is recorded separately by course language, why it is used, how long it is retained, how a user can request access/correction/deletion, and which processors/locations are involved.
- The feature does not change the existing Supabase/Cloudflare service providers or data regions. Existing Singapore staging and Tokyo production processing still need a documented cross-border transfer assessment; no new region was introduced by U2.7.0.

### Malaysia — PDPA Act 709 and 2024 amendments

- The Personal Data Protection (Amendment) Act 2024 came into force in phases on 1 January, 1 April and 1 June 2025. It introduces/clarifies data-controller terminology, processor security duties, DPO appointment, breach notification, data portability and cross-border transfer changes.
- The Act regulates personal-data processing in the context of commercial transactions. SwiftDictionary is currently intended as a free personal learning project and the revenue model is undecided; whether the Act applies to the exact current operating model requires fact-specific review. If subscriptions or other commercial transactions are introduced, reassess before launch.
- Controller registration applies to specified classes, not automatically every website. The Commissioner’s current materials continue to refer to 13 classes; a general dictionary/learning site does not obviously fall within the listed classes, but confirm the actual business activity and current 2026 circular before relying on that assumption.
- DPO appointment is required where processing exceeds 20,000 data subjects, exceeds 10,000 sensitive/financial-data subjects, or involves regular and systematic monitoring such as online user-behaviour tracking. The app is intended to minimise tracking, but its ongoing lesson/quiz/flashcard progress records should be assessed against the monitoring criterion if usage grows. Do not assume that a small user count alone removes this criterion.
- The Commissioner’s breach-notification guideline sets a 72-hour notification period to the Commissioner when the notification criteria are met, with notification to affected individuals where significant harm is caused or likely. Maintain an incident-response and escalation plan before public growth.
- The amended Act introduces a data-portability right subject to technical feasibility and compatible formats. Account deletion exists, but a user-facing progress export/data-portability workflow has not been implemented in U2.7.0; keep it on the broader legal/product backlog.
- Cross-border transfer arrangements must be reviewed under the amended section 129 and the Commissioner’s 2025 CBPDT Guidelines. Document the countries, processors/sub-processors, access, safeguards, notice and any transfer-impact assessment or other applicable mechanism for Supabase, Cloudflare and onward processing.

### International and 16+ audience

- GDPR Article 8 uses 16 as the default age for a child’s consent to information-society services, but EU Member States may lower it to no less than 13. A 16+ audience setting is not a substitute for a lawful basis, transparent notice or other GDPR duties.
- The UK Children’s Code may apply to online services likely to be accessed by under-18s, even where under-18s are not the target audience. If SwiftDictionary is likely to be accessed by UK 16–17-year-olds, assess age-appropriate design, high-privacy defaults, data minimisation, transparency and profiling restrictions.
- Keep age declarations proportionate; do not collect identity documents or excessive age-verification data without a separate necessity and legal review.
- If subscriptions, advertising, profiling, public social features or new analytics are introduced, perform a fresh jurisdiction-specific assessment before release.

### Content licensing and copyright

- CC-CEDICT-derived adapted glosses are identified as CC BY-SA 4.0; retain attribution and share-alike notices for the adapted dictionary material.
- Unihan and HSK candidate-list provenance/licensing are identified in the source registry and third-party notices.
- The 17 Chinese Lessons use authored explanations/examples and selected classical material attributed to Li Bai and Xunzi. Keep modern copyrighted poetry, quotations and translations out unless appropriately licensed; verify source wording and attribution.
- Provenance for the original 206 Chinese entries remains a separate audit item; do not assume the new 519-entry source registry retroactively clears the older material.

### Recommended pre-release actions

1. Confirm whether the current free project and any planned subscription model fall within PDPA commercial-transaction scope.
2. Review the 2026 controller-registration circular and the 13-class schedule against the actual operating entity/business activity.
3. Assess whether ongoing progress tracking qualifies as regular/systematic monitoring for DPO purposes; document the conclusion.
4. Complete a cross-border transfer inventory and appropriate transfer assessment for Singapore, Tokyo and service-provider onward processing.
5. Review/update the Privacy Notice and data-retention wording for course-language-specific progress.
6. Prepare a breach-response contact and 72-hour escalation procedure.
7. Keep data portability/export, children’s privacy, and content-source provenance on the release/legal backlog.
8. Obtain qualified legal/privacy review when feasible. Until then, do not claim legal clearance.

### Official reference material reviewed

- Malaysia PDPA Amendment Act 2024 (Act A1727): https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2024/11/Act-A1727.pdf
- Commencement Gazette P.U. (B) 522/2024: https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2024/12/PENETAPAN-TARIKH-PERMULAAN-KUAT-KUASA.pdf
- Commissioner FAQ (DPO thresholds and controller registration): https://www.pdp.gov.my/en/faq/
- Data Breach Notification Guidelines: https://www.pdp.gov.my/wp-content/uploads/2025/08/GP_DBN_ENG.pdf
- Cross-Border Transfer Guidelines: https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-cross-border-transfer-of-personal-data-cbpdt/
- Registration of Data Controller classes: https://www.pdp.gov.my/en/registration-of-data-controller/
- UK ICO Children’s Code: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-code/
- GDPR Article 8: https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=celex%3A32016R0679


## 9. Phase 0 baseline audit — completed 2026-11-21

### Application source and dictionary

- Audited the actual `main` application Git blob, not the stale README. Base commit: `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Current Chinese dictionary contains 206 unique entries; every entry is a single character. No duplicate character identities were found.
- All 206 entries currently contain the expected core fields: `word`, `phonetic`, `definition`, `definitionZh`, `examples`, `breakdown`, `related`, `course` and `part`.
- Twelve entries have multiple readings represented in the `phonetic` field (for example 中, 了, 会, 只, 少, 差, 当, 得, 没, 还, 长 and 答). Pinyin A–Z filtering must index every supported reading, not only the first.
- Existing `part` values are only `汉语词汇` and `汉字`; there is no useful semantic category taxonomy yet. New category metadata must be designed and authored; do not mistake the existing `part` field for the planned categories.
- Current data has pinyin initials for 22 letters. A–Z filter must handle letters with no current matches gracefully and must not fabricate results.
- **Dictionary layout correction:** current Chinese grid cards intentionally display the character only (plus saved marker). Preserve this layout exactly; do not add pinyin to dictionary grid cards.
- The application already has pinyin rendering helpers for Chinese dictionary detail content. They are not a substitute for manually validated, context-sensitive pinyin in the new lesson dataset.

### Existing Lessons architecture

- Audited current English lesson data: 17 permanent lessons and 112 practice questions across Beginner, Intermediate and Advanced.
- The `lessonZh` object provides Chinese translations for those 17 English lessons and their 112 questions. These are translations of English learning content, not an independent Chinese course.
- Lesson data is currently structured as English `lessonData[difficulty]`; `lessonField()` optionally substitutes `lessonZh` based on the selected translation language. There is no independent course-specific Chinese lesson catalogue.
- The global learning-course selector already stores `en` or `zh`, but `applyLearningCourseAvailability()` deliberately hides the permanent lesson library for Chinese and displays the Chinese-unavailable notice.
- Current lesson reader renders text fields and practice directly. It has no structured, authored pinyin pairing for a separate Chinese course. The new Chinese course needs explicit pinyin fields and a renderer that pairs every taught Chinese item/sentence with its pinyin underneath.
- Translation refresh currently re-renders the English lesson catalogue/reader using `lessonZh`; new Chinese lesson rendering must retain English support even when the selected translation language is Chinese and must preserve selected answers/practice state on refresh.

### Progress, content catalogue and allowance architecture

- Current `public.lesson_progress` is keyed by user, difficulty and lesson ID; it has no course/language column. Its uniqueness constraint therefore cannot safely represent the same lesson ID across English and Chinese without a migration.
- `public.lesson_practice_results` likewise has no language column; the current one-per-lesson unique index is keyed by user, difficulty and lesson ID.
- `private.learning_content_catalog.language_code` is constrained to `en`. The lesson-start guard and the permanent-lesson completion/replay RPCs explicitly validate `en`.
- Lesson completion trigger writes `learning_activity_log.language_code = 'en'` regardless of course.
- Recommended additive database design: add `language_code` (default `en`, allowed `en`/`zh`) to progress and practice-result rows; replace uniqueness with user + language + difficulty + lesson ID; allow `zh` permanent lesson catalogue rows; validate the row's language in start/completion/replay paths; and write the correct language to the activity log. Preserve existing English rows as `en`. Keep existing English RPC signatures working or provide safe compatibility wrappers while the frontend transitions.
- Current lesson completion allowance is stored as one `lesson` activity type and counted by activity type, not by language. Existing Free 5 / Premium 15 permanent-lesson daily limits can therefore remain a shared allowance across both courses without changing the existing policy. Confirm with the owner before altering this behavior; no allowance expansion is assumed.
- Existing learning-history deletion deletes progress and practice rows by user ID, so adding a language column does not require a separate deletion path. Re-test deletion behavior after migration.
- Do not apply any migration to staging or production during this phase.

### Test and release baseline

- Existing automated checks include the U2.3 frontend/content checker, Chromium browser smoke tests, PostgreSQL allowance/catalogue tests, Quiz/Flashcard tests and U2.6 ACL tests.
- The inspected latest main-branch CI workflow jobs completed successfully (build/deploy, Chromium smoke, PostgreSQL allowance and ACL checks, local Supabase Auth compatibility, Quiz and Flashcards).
- A dedicated U2.7 suite is now present: dictionary/content static checks, Chinese lesson bilingual/pinyin checks, Chromium filter and reader tests, language-isolation/allowance SQL tests, and local Supabase Auth/RPC integration.
- Source attribution pages and notices now cover CC-CEDICT (CC BY-SA 4.0), Unicode Unihan (Unicode License v3), mozillazg/pinyin-data (MIT) and the HSK 3.0 source list (MIT). Formal legal review remains deferred; do not claim legal clearance.


## 10. Implementation checkpoint — 2026-11-21

**Feature branch:** `feature/update-2-7-0-chinese-dictionary-lessons`  
**Reviewed head:** `c8c6e72e92a0fac2b1be4d8454c25a1227053a36`  
**Status:** Core implementation is on the feature branch; automated U2.7 Chromium/static checks and the U2.7 database migration regression have passed. Staging preview and owner testing remain pending.

### Implemented on the feature branch

- Chinese dictionary: 519 new single-character entries plus 206 existing entries = 725 unique characters; no duplicate identities in the combined catalogue.
- New character data includes pinyin, meanings, learner examples, source IDs, HSK candidate level and category metadata. Legacy entries use a separate metadata map.
- Dictionary filters: Pinyin A–Z initial filter, all supported readings for polyphonic characters, semantic categories and combined filtering. Existing dictionary card design is preserved: **no pinyin is added to dictionary grid cards**.
- Chinese Lessons: 17 permanent lessons and 112 practice questions (Beginner 7/44, Intermediate 5/34, Advanced 5/34), matching the audited English lesson volume.
- Chinese lesson content provides Simplified Chinese, tone-marked pinyin and English support. The selected translation language does not remove English support. Pinyin is rendered directly below Chinese text in lesson content and practice; it is not placed above or beside the Chinese text.
- All 17 question prompts that included Chinese inside English-only strings were converted to bilingual Chinese/pinyin/English objects. The static checker now rejects any unpaired Chinese text in lesson data.
- Language-aware progress and practice-result migration supports separate English/Chinese records, catalogue rows and completion/replay RPCs. The existing Free 5 / Premium 15 permanent-lesson daily allowance remains shared across both courses.
- Public Dictionary Data Sources page and repository notices cover CC-CEDICT, Unicode Unihan, mozillazg/pinyin-data and HSK 3.0 source licensing. The CC-CEDICT-derived dictionary remains free and unrestricted.

### QA and recent corrections

- U2.7 dictionary static + Chromium workflow passed at reviewed head: [run 44881091752](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44881091752).
- The local Supabase database foundation job, including the U2.7 language-aware lesson migration regression, passed in [run 44881091714](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44881091714). The separate local Auth/Quiz/Flashcard integration job was still running at the time of this checkpoint.
- The dictionary static test now enforces at least 500 new entries and 700 total unique entries and checks public source attributions.
- The Chinese lesson browser test checks pinyin stacking on desktop and narrow mobile layouts.
- Unicode Unihan copyright notice corrected to Copyright © 2021-2026 Unicode, Inc.; mozillazg/pinyin-data MIT attribution was added alongside the upstream Unicode notice.

### Remaining release gates

1. Complete the remaining local Auth/RPC integration workflow.
2. Conduct manual linguistic review. Automated checks confirm structure and coverage, not the correctness of every pinyin reading, tone-sandhi choice, definition or category. Review the 80 new polyphonic entries especially; some secondary readings are restricted to names, literary forms or specific words and must be labelled clearly or removed if not useful to learners.
3. Review Simplified Chinese character forms and the HSK level assignments against the pinned sources.
4. Deploy/test the feature branch preview against the Singapore staging project only after the owner approves the staging migration. The migration has only been applied in disposable CI; no staging or production database was changed in this checkpoint.
5. Complete owner browser testing for course switching, translation refresh, saved progress, independent English/Chinese progress, shared daily allowance, mobile layouts and existing English-course regressions.
6. Merge to `main` and deploy to production only with explicit owner approval. Apply the migration to production separately and only after approval.

### Privacy and legal boundary

No new tracking or unrelated personal-data collection was introduced. The migration adds a language discriminator to existing user-linked lesson progress and practice records. Review the privacy notice when the owner next updates it. Malaysia-specific and general international legal/privacy review remains deferred; source notices are attribution measures, not a legal compliance certification.
