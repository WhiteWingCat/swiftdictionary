# Update 2.7.0 — release-polishing pass and README refresh

Date: 2026-11-22  
Application branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Pull request: [#14 — SwiftDictionary Update 2.7.0 — Chinese Dictionary & Lessons Expansion](https://github.com/WhiteWingCat/swiftdictionary/pull/14)  
Latest application head: `c355a23f3d4555fec1384fd14fb4056d77336756`  
Owner-accepted functional head: `2ce01237c2350115941c56f524b0a7661365879b`  
Cloudflare Pages commit preview for the README refresh: https://962c2836.swiftdictionary.pages.dev  
Cloudflare Pages branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

## Owner instruction and release boundary

The owner confirmed that the latest staging preview was functionally good and authorised a polishing pass and release preparation. The owner specifically requested that the README no longer describe only Update 2.2.0, and instead list and describe the features added, changed, fixed or removed in Update 2.7.0.

This authorises polishing and release preparation, not merging or production deployment. PR #14 remains draft/open/unmerged. The application branch is kept separate from `main`.

## Branch history and scope

- The feature branch was two commits behind `main`; both missing commits concerned a documentation archive file only.
- The feature branch was synchronized with the latest `main` history using a merge commit whose resolved tree retained the feature branch's application files. The final comparison is ahead of `main` by 347 commits and behind by zero.
- The only file changed after the owner-accepted functional head `2ce0123` is `README.md`. No application source, content data, stylesheet, SQL migration or runtime behaviour changed during this polishing pass.
- The README update is on the U2.7.0 feature branch. The `main` README intentionally remains unchanged until the owner approves merging PR #14; it will receive this README when the PR is merged.

## README changes

Replaced the obsolete Update 2.2.0 English Lessons Foundation README with a complete U2.7.0 release-candidate guide covering:

- 519 new Chinese single-character records and 700+ total unique Chinese characters.
- Chinese dictionary category/pinyin-initial filtering, polyphonic search, expanded senses and pinyin examples.
- The 17-lesson / 112-question Chinese Lessons curriculum and bilingual Chinese/pinyin/English presentation.
- Chinese Daily Learning pools: 6 topics, 7 application activities and 93 Discovery entries, plus the shared adaptive Daily Revision system.
- Course-specific permanent lesson progress, shared English/Chinese daily activity allowances, first-confirmed-start permanent lesson charging, free resume/review and the exhausted Discovery card behaviour.
- Lessons/Daily Learning UI redesign, scoped content highlighting, drawer slide/reduced-motion behaviour and the round-5 fixes.
- Current five-page app capabilities, including Quiz and Flashcards (no longer Coming Soon).
- Free/Premium allowance reference, with a clear note that Premium payment/checkout is not implemented.
- All three U2.7.0 Supabase migrations and their staging-only application status.
- Cloudflare Pages build/environment safeguards, data-source attribution, licensing, privacy and legal caveats, verification results and release history.

README content was checked against the actual branch data and test contracts. The Chinese dictionary cards are character-only; pinyin search and detail content provide pronunciation information. The README preserves the rule that dictionary search is free and unlimited.

## Feature-by-feature polishing audit

The accepted application code was checked against the U2.7.0 source, regression assertions and cross-version workflows:

1. **Chinese dictionary:** 519 new entries; combined catalogue exceeds 700 unique characters; one-character cards; pinyin search without tone marks; category and initial filters; polyphonic reading handling; separate-sense pinyin; source provenance and public attribution.
2. **Chinese Lessons:** 17 lessons and 112 practice questions across Beginner (7/44), Intermediate (5/34) and Advanced (5/34); bilingual text validation requires Chinese, pinyin and English support; language-specific progress and practice-result records.
3. **Chinese Daily Learning:** 6 Topic entries, 7 Application entries and 93 Discovery entries; shared schedule and category allowances; Chinese adaptive revision source; review-only reopening; cross-course exhausted Discovery fallback.
4. **Allowance lifecycle:** first permanent lesson start requires explicit confirmation and is charged atomically; resume and completed review are free; Daily Learning consumes a category allowance only after successful completion; English and Chinese share the same category allowance.
5. **Lessons UI and highlighting:** expandable lesson content, responsive tabs, revised practice layout, curated highlights limited to explanations/examples/sentence breakdowns, no heading/question/answer emphasis, no grammatical-role highlighting.
6. **Daily Learning drawer:** transform-only slide for normal motion, independent backdrop fade, reduced-motion fade, proper hidden-state handling and course/session-aware content resolution.
7. **Existing app compatibility:** English Lessons, Quiz, Flashcards, Profile, Google Auth, account switching, saved-word isolation/synchronisation, account deletion safeguards, allowance handling and Cloudflare build routing.

## Latest-head validation

For application head `c355a23f3d4555fec1384fd14fb4056d77336756`:

- U2.7.0 Chinese dictionary data/static checks, Chinese Lessons bilingual/pinyin checks, Lessons/Daily Learning UI checks, full Lessons/Daily Learning Chromium suite, isolated Chinese filter browser tests, Chinese bilingual-layout browser test and PostgreSQL 17 first-start allowance regression: **passed**.
- Update 2.3.x PostgreSQL, local Supabase Auth compatibility and Chromium regressions: **passed**.
- Update 2.5.0 Flashcards database and Chromium regressions: **passed**.
- Update 2.6.0 PostgreSQL ACL drift regression: **passed**.
- Quiz database foundation and local Supabase Auth/RPC/Chromium integration: **passed**.
- Cloudflare build-routing guard: **passed**.
- Cloudflare Pages deployment for commit `c355a23`: **Deploy successful** at https://962c2836.swiftdictionary.pages.dev.
- The separate `Workers Builds: swiftdictionary-testing` check remains failed because it targets the retired testing Worker. It is not the Cloudflare Pages deployment and does not override the successful Pages deployment or build-routing guard.

## Database, privacy and legal boundary

- U2.7.0's three migrations remain applied to staging only: language-aware lesson progress/catalogue, Chinese Daily Learning catalogue and permanent lesson first-start allowance.
- No production Supabase migration or production deployment occurred.
- The new course-specific progress field is an extension of existing learning progress; this pass introduces no new personal-data category, tracking purpose, third-party processor or external recipient.
- CC-CEDICT-derived dictionary content remains attributed under CC BY-SA 4.0; the dictionary remains free and unlimited. Unihan, HSK candidate metadata, pinyin-data and Hanzi Writer/Arphic notices remain documented.
- Formal Malaysia PDPA and general international legal/privacy review remain deferred/outstanding. The README is not a legal compliance certification.

## Release status and next gate

- Owner has accepted the functional U2.7.0 staging preview.
- README is updated on the feature branch; PR #14 description/title now reflect the actual release scope.
- Latest feature branch is synchronized with `main` history but remains a separate branch. `main` was not changed.
- PR #14 remains draft/open/unmerged. No release tag, production migration or production deployment was created.
- Next gate is owner approval to move PR #14 from draft to final review/merge and a separately authorised production migration/deployment plan.
