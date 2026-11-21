# SwiftDictionary Update 2.7.0 — Implementation Audit and QA Checkpoint

Date: 2026-11-21

## Current application branch

- Repository: `WhiteWingCat/swiftdictionary`.
- Feature branch: `feature/update-2-7-0-chinese-dictionary-lessons`.
- Reviewed head: `c8c6e72e92a0fac2b1be4d8454c25a1227053a36`.
- Application main remains unchanged. The feature branch was already populated with substantial U2.7 implementation commits when this audit resumed; review continued from its current head rather than overwriting it.
- Documentation branch remains `docs/master-development-record`.

## Verified implementation

- Chinese dictionary: 519 new entries plus 206 legacy entries = 725 unique single-character entries.
- Pinyin A–Z filter indexes all readings; semantic categories and combined filtering are present. Legacy category assignments are held in a separate metadata map.
- Dictionary grid retains the existing character-only card layout. No pinyin was added to the grid.
- Chinese Lessons: 17 lessons and 112 questions (Beginner 7 lessons/44 questions; Intermediate 5/34; Advanced 5/34).
- Lesson data contains Simplified Chinese, tone-marked pinyin and English support. The selected translation language cannot remove English support.
- Lesson renderer places pinyin directly below Chinese text. The browser test checks every visible bilingual block on desktop and narrow mobile layouts.
- 17 question prompts containing Chinese characters in otherwise English strings were converted to bilingual Chinese/pinyin/English objects. The static lesson checker now rejects unpaired Chinese text anywhere in the lesson data.
- Additive Supabase migration adds language-aware lesson progress and practice results, Chinese content catalogue support and language-aware completion/replay RPCs. Existing English progress defaults to `en`.
- The existing shared daily permanent-lesson allowance remains Free 5 / Premium 15 across both courses.
- Public `data-sources.html` and `THIRD_PARTY_NOTICES.md` cover CC-CEDICT (CC BY-SA 4.0), Unicode Unihan (Unicode License v3), mozillazg/pinyin-data (MIT) and HSK 3.0 source data (MIT). CC-CEDICT-derived dictionary data remains free and unrestricted.

## Review changes made during this checkpoint

1. Raised dictionary static-test minimum from 50 to 500 new entries and asserted at least 700 combined unique characters.
2. Added automated checks for the public data-source page, CC BY-SA attribution, Unihan copyright/licence notice, pinyin-data MIT notice and Pleco/HSK attribution.
3. Added 17 bilingual Chinese/pinyin/English practice question prompts where Chinese text previously appeared unpaired inside English question strings.
4. Strengthened lesson static checks to reject any raw Chinese string outside a bilingual object with pinyin and English support.
5. Expanded the browser pinyin-layout test to check all visible bilingual blocks on desktop and mobile.
6. Corrected the Unihan copyright period to 2021–2026 and included mozillazg/pinyin-data MIT attribution and notice.

## CI checkpoint

- U2.7 dictionary static + Chromium workflow passed at reviewed head: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44881091752
- Local Supabase database foundation job, including U2.7 migration regression, passed in: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44881091714
- The separate Local Supabase Auth/Quiz/Flashcard integration job was still running at this checkpoint.

## Remaining work and safety boundary

- Automated tests verify data structure and UI behavior, not linguistic correctness. Manually review pinyin and tone-sandhi accuracy, definitions, Simplified forms and category assignments. Review the 80 new polyphonic entries carefully; secondary readings limited to names, literary forms or specific compounds should be clearly labelled or removed if they add little learner value.
- Verify HSK level assignments against pinned source snapshots.
- Apply the additive migration only to the Singapore staging project after explicit owner approval, then test the feature preview against staging. It has only been applied in disposable CI so far.
- No staging or production database was changed during this checkpoint. Do not merge to main or deploy production without explicit owner approval.
- No new tracking was introduced. The new language discriminator is attached to existing user-linked lesson progress and practice records; update privacy disclosures when next revised.
- Malaysia-specific and general legal/privacy review remains deferred, not cleared. Source attribution is not a legal compliance certification.


## CI completion follow-up

After this checkpoint was written, the separate local Auth/Quiz/Flashcard integration workflow completed successfully. Both jobs passed, including the U2.7 language-aware migration regression: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44881091714. The U2.7 dictionary static/Chromium workflow passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44881091752. No staging or production database changes were made.
