# 2026-11-28 — U3.0 Quiz course switching and Weak Memory polish

## Owner feedback
After testing the latest staging preview, the owner reported:
1. Changing the learning course while on Quiz refreshed the page only when switching to English.
2. Weak Memory review had noticeable latency/lag.

The owner also directed that pre-live human editorial review be skipped for this update and performed on the live website. Machine-assisted content must remain explicitly draft/unreviewed; this instruction does not mean content has been human-approved. Production remains untouched and PR #20 remains draft/unmerged.

## Application fixes
- The Quiz course-change handler previously refreshed Quiz only when `isEnglishCourse()` was true. It now refreshes course availability and the overview for every registered course that supports Quiz.
- The refresh waits for the queued course-preference write so the availability RPC sees the selected course.
- `quizLoadHome` now captures a request ID and course snapshot. It discards responses from a prior course or a superseded request, preventing stale Quiz content after rapid course changes.
- Weak Memory review previously resolved each dictionary-backed row by rebuilding and scanning the full language word bank. A per-language Map index is now built once and reused for every row/detail lookup; it is invalidated when content packages refresh.
- Added a Quiz browser regression for English → Chinese → Malay → English course switching.
- Added an 80-card Weak Memory browser regression with detail navigation. The browser regression passed.

## Content quality and coverage findings
- Approved Malay support is present for 199 English Quiz questions and 145 Chinese Quiz questions. English and Chinese lesson support contains 112 practice translations each. Malay has 72 lessons and 216 practice questions.
- Added checks for distinct answer options and obvious Indonesian-only wording across released Quiz and lesson practice content, plus Malay lesson-reader text.
- Corrected one duplicate Chinese Quiz answer option and additional Indonesian-contaminated Chinese Flashcard definitions. The released Quiz/lesson lexical and distinct-option checks pass after those corrections.
- Chinese Flashcard source inventory contains 519 characters, 904 vocabulary cards and 24 phrases (1,447 total). Current runtime Malay definition support is 895/1,447 (61.9%): 519 characters, 352 vocabulary cards and 24 phrases. The 552 missing definitions are a real gap, not a hidden fallback.
- Updated the source exporter to include all 1,447 Chinese cards. For the 844 vocabulary records without an authored Chinese definition, it uses the authored English gloss as the source for Malay translation. The exporter/generator rejects duplicate or untranslatable inventory rows.
- Added Malaysian Malay normalisation for common Indonesian forms to the offline Dictionary and learning-support generators, with quality validation. Contextual use of “bisa” meaning venom is preserved.
- Added targeted corrections for Indonesian-contaminated Chinese Flashcard glosses and expanded the lexical test.
- English Flashcard definition coverage remains 1,341/1,341. Chinese target coverage is 1,447/1,447 after generation, but the generated output is not yet committed at this checkpoint.
- Sentence Recall remains restricted to 85 curated Malay sentence pairs (18 English dictionary cards, 25 English phrases, 18 Chinese vocabulary cards and 24 Chinese phrases). Generated examples are not automatically promoted into assessed answer choices.

## Translation-generation workflows
Two GitHub Actions generation runs were observed:
- Learning-support generation run `46129682968` (in progress at this checkpoint).
- Dictionary plus learning-support generation run `46129629037` (in progress at this checkpoint), with a second dictionary run `46129801078` queued behind the concurrency group.

The U3.0 architecture test currently fails only because the checked-in support output still resolves 895 rather than 1,447 Chinese Flashcard definitions. It must be rerun after generated output is committed. Do not call translation coverage complete until the output contains 1,447 Chinese Flashcard definitions and the coverage/lexical tests pass.

## Validation and release
- The 80-card Weak Memory browser regression passed.
- Quiz course-switch regression is added; current-head execution remains pending.
- Released Quiz/lesson distinct-option and Malaysian Malay lexical checks pass.
- Cloudflare routing and ACL checks passed on the preceding application head; current-head cross-version, database/Auth and Pages checks remain pending.
- Current Pages preview and deployed Google OAuth/account switching/isolation still require verification.
- No new personal-data collection, telemetry or third-party sharing was introduced by these fixes. Malaysia PDPA 2010/2024, Copyright Act 1987, provenance and model licensing/attribution remain public-release considerations.
- Leaked-password protection remains excluded at the owner's earlier direction.
- No production migration, merge or deployment was performed or authorised.

## Next work
1. Allow the translation-generation workflows to finish and commit their outputs.
2. Verify 1,341/1,341 English and 1,447/1,447 Chinese Flashcard Malay definitions; run all lexical and content coverage tests.
3. Rerun the full cross-version CI matrix, including Quiz course-switch and Flashcard Weak Memory browser tests.
4. Verify current Pages preview and Google OAuth/account isolation.
5. Prepare one consolidated U3.0 staging handoff. Human editorial review is deferred to the live website per owner instruction; do not relabel draft content as reviewed.
