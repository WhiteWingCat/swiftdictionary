# SwiftDictionary Update 2.7.0 — Dictionary Expansion and Chinese Lessons Progress

Date: 2026-11-21

## Current state

- Application repository: `WhiteWingCat/swiftdictionary`.
- Application branch: `feature/update-2-7-0-chinese-dictionary-lessons`.
- Current application branch head at archive time: `006871a1ed42947a277c89b70965ee277e3c5e22`.
- Production base: `main` at U2.6.0 merge `ba580c3f43e8b34f79205b69ae9f858186759036`.
- Documentation branch: `docs/master-development-record`.
- No merge to main, hosted Supabase migration, production database change or deployment has occurred.

## Owner clarification — pinyin display

The user clarified that pinyin must **not** be added to Chinese Dictionary grid cards. Preserve the existing one-character, character-only grid. The vertical rule applies only to Chinese Lessons: show Chinese text first, pinyin directly underneath, and English support after it. Never put lesson pinyin above or beside the corresponding Chinese text.

## Dictionary progress

- 519 new unique single-character records added to the existing 206, bringing the combined Chinese dictionary to 725 unique entries.
- Pinyin A–Z initial filter implemented; all slash-separated readings are considered, so polyphonic characters can appear under multiple initials.
- Eleven category filters implemented with combined category + initial filtering.
- Existing character and pinyin search, stroke order, detail presentation and character-only grid retained.
- New records include pinyin, English/Chinese meanings, examples, related vocabulary, learning notes, categories, HSK candidate level and source IDs.
- Data-source notices committed: `data-sources.html`, `data/CHINESE-DICTIONARY-SOURCES.md`, `THIRD_PARTY_NOTICES.md`.
- Static checks passed for 725 unique characters, including 519 additions, category/provenance metadata and one-character-per-entry constraints.

## Chinese Lessons progress

- Separate Chinese course dataset and pinyin-aware renderer integrated with existing Lessons architecture.
- 17 permanent lessons and 112 practice questions:
  - Beginner: 7 lessons / 44 questions.
  - Intermediate: 5 lessons / 34 questions.
  - Advanced: 5 lessons / 34 questions.
- Each Chinese lesson text block carries Simplified Chinese, tone-marked pinyin and English support. English support remains visible regardless of selected translation language.
- Content includes pinyin foundations, greetings, numbers/dates, pronouns, actions, places, questions/negation, measure words, particles, time expressions, comparisons, sentence expansion, complex structures, connectors, idioms, proverbs, nuanced vocabulary and selected classical literature.
- Dedicated content validator checks 17/112 totals, 7/5/5 difficulty counts, unique lesson IDs, Supabase catalogue IDs, bilingual fields, pinyin presence, and four-option question structure.
- Browser test verifies 7/5/5 lesson library counts and Chinese → pinyin → English vertical order.

## Language-aware lesson progress

- Additive migration: `supabase/migrations/20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql`.
- SQL regression test: `supabase/tests/update_2_7_0_language_aware_lessons.sql`.
- The PostgreSQL/CI database foundation job passed the U2.7.0 migration and SQL regression suite, including English compatibility, separate English/Chinese progress identity, shared lesson allowance and catalogue checks.
- The companion local Supabase Auth/RPC integration and security-advisor job was still running at the time of this archive.
- **The migration has not been applied to hosted staging or production.**

## Verification

- U2.7.0 dictionary/lesson workflow run #44875595145 passed:
  - 725 unique Chinese dictionary entries (519 new)
  - 17 Chinese lessons / 112 practice questions
  - Five dictionary Chromium tests
  - One Chinese Lessons layout browser test
- Quiz/database foundation workflow run #44875595192: PostgreSQL/CI job passed; local Supabase Auth/RPC companion job still running at archive time.
- Earlier failed runs were used to correct the duplicate lesson-renderer structure, restore the full Lessons renderer, and fix the static Quiz translation-continuity assertion formatting. The final dictionary/lesson workflow above passed.

## Legal, privacy and content-quality notes

- Formal legal/privacy review remains deferred, not cleared. Do not claim legal compliance.
- CC-CEDICT-derived gloss adaptations are identified as CC BY-SA 4.0; Unihan 18.0.0 and HSK candidate-list notices are included.
- Existing 206 dictionary entries still need their own provenance review.
- Chinese Lessons explanations and examples are authored separately from CC-CEDICT. Classical excerpts used are attributed to their historic sources; verify attribution and keep modern copyrighted content out unless licensed.
- Final linguistic review of pinyin, polyphonic readings, examples, idioms/proverbs and English translations remains part of release QA.

## Next steps

1. Complete local Supabase Auth/RPC integration and local security advisors.
2. Run the full English Lessons and Daily Learning browser regression suite.
3. Add/verify Chinese course progress completion in browser tests, including English/Chinese progress isolation.
4. Complete linguistic and licensing review and owner preview.
5. Prepare release notes and one consolidated release package only after QA. Do not merge, apply hosted migrations or deploy without explicit owner approval.


## Subsequent verification (2026-11-21)

- Latest app branch head: `27739f86162ddd2b7251ebe52ca98490f224782e`.
- U2.7.0 workflow #44876433048 passed:
  - 725 dictionary entries / 519 additions and script syntax check.
  - 17 Chinese lessons / 112 questions and bilingual/pinyin validation.
  - Full English Lessons and Daily Learning browser regression: 26/26 passed.
  - Chinese Dictionary filter browser tests: 5/5 passed.
  - Chinese Lessons vertical bilingual layout: 1/1 passed.
- The 26-test regression includes the Chinese lesson completion and English/Chinese progress-isolation check.
- Quiz database foundation workflow #44876433049 PostgreSQL job passed. Local Supabase Auth/RPC integration remained in progress at this update.


## Latest category and integration verification (2026-11-21)

- Current app branch head: `c0d986a31b2905639c5ddd28b59e63d4c217edf2`.
- U2.7.0 workflow #44876788816 passed: 725 dictionary entries (519 new), 17 lessons / 112 questions, 26/26 full Lessons/Daily Learning regressions, 5/5 dictionary filter checks and 1/1 Chinese Lessons bilingual layout check.
- The original 206 dictionary entries are categorized through the legacy metadata map `window.SWIFT_CHINESE_METADATA` in `data/chinese-characters.js`; the 519 additions carry their own categories. All 725 are covered by the category filter.
- Quiz database foundation #44876788818 passed. Companion local Supabase Auth/RPC run #44876433049 passed the U2.7.0 migration and SQL tests, authenticated Quiz runtime, Flashcards and Lessons allowance regressions, and local security advisors. A rerun against the current head is in progress.
- No hosted Supabase migration, merge or deployment has occurred.


## Current Malaysia and international legal-risk review (2026-11-21)

A current risk-planning review was added to Section 12 of the U2.7.0 Development Plan. Main findings:
- U2.7.0 adds only a `learning_language` dimension to existing user-linked lesson progress; no new identity data, sensitive personal data, advertising profile or telemetry.
- The Malaysia PDPA Amendment Act 2024 took effect in phases during 2025. DPO thresholds include regular/systematic online behaviour monitoring as well as numerical thresholds; the app's progress tracking should be assessed as usage grows.
- Data-breach notification guidance uses a 72-hour deadline to notify the Commissioner where criteria are met, with affected-user notification for significant harm.
- The 2024 amendments introduce data portability subject to technical feasibility/compatibility; this is not implemented in U2.7.0 and remains a broader backlog item.
- Existing Singapore staging and Tokyo production processing, plus Cloudflare and onward processors, require a documented cross-border transfer review under section 129 and the Commissioner's CBPDT Guidelines. U2.7.0 does not change the regions.
- The 13-class controller registration requirement does not appear to automatically include a general dictionary/learning website, but the actual business activity and current 2026 circular must be checked.
- GDPR Article 8 and the UK Children's Code require separate attention for a global 16+ audience, especially UK 16–17-year-olds if likely to access the service.
- CC-CEDICT-derived content remains under CC BY-SA 4.0 with attribution/share-alike; older 206-entry provenance is still an audit item. Classical Li Bai/Xunzi excerpts are attributed; modern copyrighted texts are excluded unless licensed.
- This is risk planning only. Formal legal/privacy review remains deferred; no compliance or legal clearance is claimed.


## Local Supabase integration — final pass (2026-11-21)

- Current app branch head: `c0d986a31b2905639c5ddd28b59e63d4c217edf2`.
- Quiz database foundation workflow #44876788818 and its companion local Supabase Auth/RPC job passed.
- U2.7.0 language-aware lesson migration and SQL regression passed on an ephemeral local Supabase instance; Auth contract passed.
- Authenticated Chromium regressions: Quiz runtime 12 passed, Flashcards 3 passed, Lessons/Daily Learning allowance 2 passed.
- Supabase security advisors: “No issues found.”
- This did not modify hosted staging or production; no merge/deploy occurred.
