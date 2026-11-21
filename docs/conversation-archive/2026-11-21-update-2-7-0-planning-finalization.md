# SwiftDictionary Update 2.7.0 — Planning Finalization and Development Handover

Date: 2026-11-21

## Purpose

Finalize the owner-approved scope for Update 2.7.0 and prepare a clean application feature branch, following the Master Development Record's branch-separation and archive rules.

## Source-of-truth review

- Repository: `WhiteWingCat/swiftdictionary`.
- Documentation branch: `docs/master-development-record`.
- Application base: `main`, current merge commit `ba580c3f43e8b34f79205b69ae9f858186759036` (U2.6.0 PR #13 merge).
- The Master Development Record and November 20–21 U2.6.0 handover were reviewed before branch preparation.
- The roadmap identifies U2.7.0 as Chinese Dictionary Expansion & Chinese course lessons, followed by U2.8.0 Chinese Course Quiz & Flashcards.

## Owner-approved U2.7.0 scope

1. Expand the Simplified Chinese single-character dictionary. Initial target at least 500–700 new unique characters, no hard cap if quality and validation permit.
2. Replace the ineffective Chinese filter with Pinyin A–Z initial filtering and useful character categories. Allow filters to be combined. Suggested categories: Actions, People, Objects, Nature, Places, Time & Numbers, Emotions & States, Descriptions, Grammar & Function, Communication. Characters may have multiple valid categories.
3. Preserve one character per grid card, keep the grid character-only (no pinyin displayed on cards), and retain existing character/pinyin search and detail pinyin.
4. Permanent layout rule: character above pinyin, pinyin directly underneath. Never left, right or above. This applies to desktop, mobile and responsive layouts.
5. Add a Simplified Chinese course to the existing Lessons framework; do not rebuild the framework.
6. Initial minimum at least 17 lessons and 112 practice questions, matching the actual English library (7/5/5 lessons and 44/34/34 questions across Beginner/Intermediate/Advanced); may exceed if quality permits.
7. English support is guaranteed for Chinese lessons regardless of selected translation language.
8. Pinyin is mandatory throughout Chinese lesson content, including sentences, expressions, idioms, proverbs, quotations and poetry. In Lessons only, Chinese text must appear above pinyin directly underneath; never beside or above the Chinese text. English support follows the pinyin.
9. Include grammar, vocabulary, common expressions, 成语, 谚语, 名言警句 and selected 诗词; distinguish each content type and verify quote attribution.
10. Integrate English-to-Chinese exercises and English/Chinese structural comparisons.
11. Reuse existing lesson reader, practice, progress, completion, translation refresh, allowance and account-synchronisation behavior. No timer or time pressure.
12. Prepare structured content for U2.8.0 Chinese Quiz and Flashcards.

## Development preparation

- Created application branch `feature/update-2-7-0-chinese-dictionary-lessons` from `main`.
- No application files, database, production configuration or deployment were changed in this session.
- A read attempt for `index.html` through the GitHub connector returned empty content, including line-range requests. Do not infer that the file is empty; use an alternate source retrieval workflow during Phase 0.
- The README on `main` reports the old 2.2.0 baseline and should not be treated as a complete specification for the current deployed app.
- Phase 0 must audit the current app source, actual dictionary catalogue/data shape and counts, Chinese filter implementation, Lessons architecture, translation refresh, progress/allowance integration, tests, CI and third-party notices before implementation.

## Implementation sequence

1. Phase 0: source/data/architecture baseline audit and technical design.
2. Phase 1: character metadata, A–Z/category/combined filters and strict character-over-pinyin layout.
3. Phase 2: sequential Chinese dictionary content expansion with uniqueness, linguistic and licensing validation.
4. Phase 3: integrate Chinese course into existing Lessons architecture.
5. Phase 4: author bilingual/pinyin-rich Chinese curriculum and practice bank.
6. Phase 5: automated, browser, responsive, linguistic, translation and owner preview QA.
7. Phase 6: consolidated release readiness, documentation and package.

Do not start bulk content work before Phase 0 is complete. Do not provide intermediate ZIPs; provide one consolidated package per completed phase/task when requested.

## Legal, privacy and content licensing

- Include Malaysia-specific and general international legal/privacy risk planning for the expansion.
- Formal legal/privacy review remains deferred, not cleared; do not claim legal compliance.
- Avoid new personal-data collection or tracking.
- Review licensing/provenance for dictionaries, explanations, examples, pinyin data, idioms, quotes, poems and translations. Prefer original, public-domain or appropriately licensed texts. Verify quote attribution and avoid substantial unlicensed modern copyrighted material.
- Preserve dictionary lookup as free and unlimited.

## Exact recovery point

- Application branch: `feature/update-2-7-0-chinese-dictionary-lessons`.
- Base: `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Documentation branch: `docs/master-development-record`.
- Plan document: `docs/UPDATE-2.7.0-DEVELOPMENT-PLAN.md`.
- Next task: Phase 0 baseline audit only. Do not modify production or merge/deploy without explicit owner approval.


## Owner correction — pinyin display scope (2026-11-21)

The owner clarified that pinyin must **not** be added to Chinese Dictionary grid cards. Keep the existing character-only grid presentation. The vertical character-above-pinyin requirement applies specifically to Chinese Lessons content and readers. The development plan was corrected accordingly before implementation; no application source was changed for this clarification.


## Phase 0 audit results (2026-11-21)

- Audited `main` at `ba580c3f43e8b34f79205b69ae9f858186759036`, application entry point `index.html`.
- Chinese dictionary contains 206 unique single-character entries, all with a pinyin value; 12 are polyphonic (221 slash-separated readings total). There are no multi-character grid entries and no character-category metadata. Existing broad `part` labels are not sufficient as learner categories.
- Current Chinese A–Z filter is disabled; the alphabet strip is hidden for Chinese. The existing English part-of-speech category row is also hidden for Chinese. Pinyin search already works.
- Dictionary grid cards intentionally show the character only. Owner clarified: do not add pinyin to grid cards.
- Current English Lessons baseline is 17 lessons and 112 questions: Beginner 7/44, Intermediate 5/34, Advanced 5/34. The `lessonZh` data translates those English lessons into Chinese; it is not a Chinese learning course. Update 2.7.0 should target at least the same 17/112 volume.
- The existing Lessons reader does not render pinyin. Chinese course content needs its own lesson dataset and pinyin-aligned reader rendering; pinyin should be authored/validated at phrase and sentence level because character-only automatic transliteration cannot resolve all polyphonic/contextual readings.
- Supabase progress and practice result tables currently do not identify the learning language. The private approved-content catalogue permits only `en`; validation and completion/replay RPCs hardcode English. A backward-compatible additive migration is needed for language-aware progress and approved Chinese lesson catalogue entries. Existing lesson quota counts completions by user/activity type across language codes; preserve this shared allowance pool.
- Existing CI includes static checks, Chromium browser tests, PostgreSQL 17 migration tests and disposable local Supabase Auth/RPC integration. Dedicated Chinese filter/lesson tests do not yet exist.
- Third-party notices cover Hanzi Writer MIT and separately licensed Arphic Public License stroke data. The current Chinese dictionary data lacks per-entry provenance/licensing metadata; establish content sourcing records before release.
- No application code, hosted Supabase schema, production settings or deployment has been changed during Phase 0.
- The detailed audit is recorded in Section 9 of `docs/UPDATE-2.7.0-DEVELOPMENT-PLAN.md`.


## Phase 1 implementation progress (2026-11-21)

- Added Chinese Pinyin A–Z filtering to the feature branch. It uses all slash-separated pinyin readings, so polyphonic characters are discoverable under each initial. Existing pinyin/character search combines with the initial filter.
- Added category filter UI/state for Actions, Expressions, People, Objects, Nature, Places, Time & Numbers, Emotions & States, Descriptions, and Grammar & Function. It reads a multi-value `categories` array. Category controls stay hidden until category metadata is present; the current 206 entries still need classification.
- Kept dictionary grid cards character-only; no pinyin is displayed on the grid.
- Added static data/script assertions, three Chromium tests (including polyphonic H/K filtering) and a dedicated Actions workflow.
- Final CI run [44867027510](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44867027510) passed all checks at feature-branch head `510954a3e2c037ab7f231ddaeec3247299c08181`.
- No Chinese dictionary content expansion, category assignments, lesson code or hosted database changes have been made yet.
- The detailed technical progress is recorded in Section 10 of `docs/UPDATE-2.7.0-DEVELOPMENT-PLAN.md`. Next: build a source-backed Chinese character dataset in small batches, adding categories and provenance while preserving quality.



## Chinese dictionary content batches (2026-11-21)

- Added the first 100 HSK Level 1 candidate characters to `data/chinese-characters.js`; current combined count is 306 unique single-character entries.
- New records include pinyin, English and Chinese meanings, example sentences, related vocabulary, learning notes, category tags, HSK level and provenance source IDs.
- Category filter now has 11 categories: Actions, Expressions, Communication, People, Objects, Nature, Places, Time & Numbers, Emotions & States, Descriptions, Grammar & Function.
- Published a user-facing attribution page at `data-sources.html` and linked it from the app footer and Terms placeholder. Detailed source registry is `data/CHINESE-DICTIONARY-SOURCES.md`.
- Static checks and four Chromium tests passed in GitHub Actions run [44868243733](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44868243733).
- The Chinese grid remains character-only. The pinyin-below-character rule is reserved for Chinese Lessons.
- Next: add the remaining 48 Level 1 candidates, then proceed through HSK Levels 2–5 in reviewed batches. Lessons and Supabase migration work remain pending.


## Post-planning correction (2026-11-21)

The owner clarified that the pinyin-under-character rule applies specifically to **Chinese Lessons**, not to the Dictionary grid. The Chinese Dictionary grid must remain character-only; do not add pinyin to its cards. Keep existing pinyin search and detail-panel pinyin. In Chinese Lessons, every Chinese text block must be followed immediately by its pinyin on the next line, with English support below; pinyin must never appear above or beside the Chinese text.

The source audit also found the current English Lessons baseline is 17 lessons and 112 questions, distributed 7/5/5 lessons and 44/34/34 questions by difficulty. The Chinese course target was raised from the preliminary 15/52 estimate to match this actual baseline.
