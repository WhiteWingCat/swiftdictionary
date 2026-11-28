# U3.0 content and Flashcard completion work — 2026-11-28

## Scope and branch
- Application branch: `feature/update-3.0-phase-0-audit`
- Production remains untouched; draft PR #20 remains unmerged.
- Leaked-password protection is deferred at the owner's explicit direction and is not an active U3.0 gate.

## Quiz Malay support
- Current staging question bank contains 199 approved English questions and 145 approved Chinese questions.
- Added Malay prompt, explanation and four-option support translations for the complete 199 English and 145 Chinese approved question sets in `data/languages/malay-learning-support-overrides.js`.
- Preserved source question IDs and option IDs; the overrides change only Malay support text.
- Expanded the content regression to require at least 199 English and 145 Chinese curated support records and validate prompts, explanations, four option IDs and non-empty/distinct option translations.
- These are model-assisted Malaysian Malay drafts. Human editorial review remains pending; do not label them human-approved.

## Lesson Malay support
- Expanded curated corrections in `data/languages/malay-learning-support-overrides.js` to cover all 112 English and 112 Chinese permanent Lesson practice questions.
- Corrections include prompt text and answer options, retaining source question and answer semantics.
- Added regression assertions requiring exactly 112 corrections per course.
- Draft content remains subject to human Malaysian Standard Malay review.

## Flashcard runtime and coverage audit
- Added explicit source-language example fallback for the 18 reviewed English Malay Sentence Recall cards so each reviewed Malay example can be paired with its English prompt.
- Added 18 curated Malay sentence translations for Chinese Flashcards and enabled the same reviewed-example gate for both English and Chinese courses.
- Added runtime coverage metrics separating dictionary cards, phrase cards, reviewed sentence cards and custom-card policy.
- Custom cards are eligible for Malay-support games only when the user has supplied a Malay translation; unsupported cards are excluded rather than displaying an absent or incorrect translation.
- Existing corpus counts from the support pack: English 1,341 rows (25 standalone Malay definitions, 1,341 Malay example translations); Chinese 603 rows (603 Malay definitions and 603 Malay example translations). The reviewed sentence subset is 18 English + 18 Chinese, not the full generated example corpus.
- The standalone curated gloss map has 73 English and 124 Chinese entries; curated English phrase pool contains 25 items. Runtime metrics now measure actual mapped coverage by card type; capture their exact values from the latest passing browser run before declaring the audit complete.
- Do not claim all generated examples are human-reviewed. Machine-assisted content remains a draft pending editorial QA.

## Flashcard browser test changes
- Moved fake-clock installation until after the app/mock-auth startup to avoid freezing initialization.
- Added English and Chinese Malay Sentence Recall coverage checks and runtime card-type coverage assertions.
- Latest U3.0 Phase 1 architecture/content regression on the 2026-11-28 application head passed. The latest Flashcard browser and Quiz authenticated runs were queued/pending at this checkpoint and must be inspected before sign-off.

## Remaining completion gates
- Inspect latest Flashcard browser test result and actual runtime coverage metrics; fix any failures.
- Inspect Quiz database foundation and authenticated Chromium run, including the earlier `user_preferences` permission failure. Do not weaken RLS or grants broadly; resolve the actual fixture/migration contract.
- Complete full cross-version regression matrix and OAuth redirect/account-isolation checks.
- Review private-schema grants/RPC boundaries and ensure no cross-account data access.
- Verify latest staging Pages preview and owner desktop/mobile acceptance.
- Human Malaysian Standard Malay editorial review, upstream model licence/attribution verification, Malaysia Copyright Act and PDPA/cross-border review remain required before public release.

## Commits and test checkpoint
Application commits include the Quiz content batches, Lesson corrections, Flashcard example/runtime changes, coverage metrics and browser-test updates. See the feature branch history for exact commits.


## Daily Learning staging feedback — root cause and remediation

The owner had also reported object-coercion text (`[object Object]`) in some Daily Activity questions and sessions rejected as not present in the approved learning catalogue. Inspection of the current runtime found that the Daily Discovery schedule is catalog-gated by exact content IDs and rotation order. The Malay runtime pool is now rebuilt from the 93 dictionary-derived IDs in the active staging catalogue, in exact `rotation_order` 1–93 order. The 93 IDs were compared directly with the staging `private.learning_content_catalog`; the ordered arrays match exactly (no missing or extra IDs). The old mismatched Malay discovery IDs are no longer used by the runtime pool. The Malay manifest now reports the actual 60/60/93 catalogue counts and declares the dictionary source dependency.

Added a SQL regression that asserts the exact 93 Malay Daily Discovery catalogue IDs and rotation order after the U3.0 Malay staging baseline is applied. Added browser regression coverage that opens Malay Daily Discovery and checks the selected base content ID is in the approved runtime pool. The Daily Learning localized-text resolver now supports nested language maps and additional prompt/question/option/explanation keys; added a browser test with object-shaped prompts/options to prevent accidental `[object Object]` rendering.

These fixes are implemented on the application branch. Latest CI for the new tests is queued/pending at this archive checkpoint; they are not declared passed until the relevant workflows complete.


## 2026-11-28 — exact Flashcard coverage audit

The exact `addMalayFlashcardSupport` helper from `flashcards.js` was evaluated against the full source catalogues and Malay translation sources. The resulting counts are now enforced by `tests/flashcard-malay-support-coverage.test.mjs` and documented in [the detailed coverage audit](../review/malay-flashcard-coverage-audit-2026-11-28.md).

| Card group | Total | Malay definitions | Sentence source examples | Reviewed Malay sentence pairs |
|---|---:|---:|---:|---:|
| English dictionary | 1,316 | 1,316 | 1,316 | 18 |
| English curated phrases | 25 | 25 | 25 | 0 |
| Chinese characters | 519 | 519 | 519 | 0 |
| Chinese vocabulary | 904 | 184 | 60 | 18 |
| Chinese phrases | 24 | 24 | 24 | 0 |

Chinese Flashcard definition coverage is 727/1,447 (50.2%). The remaining 720 Chinese cards without Malay definitions are excluded when Malay is selected. Sentence Recall is restricted to the 18 reviewed English and 18 reviewed Chinese Malay sentence pairs; source-language examples alone do not count as Malay translations. Custom cards are included only when their stored support-language code matches Malay and the user supplied translation text. This completes the coverage audit, not full Chinese vocabulary translation coverage or human editorial approval.

## 2026-11-28 — implementation fixes and verified root causes

- **Sentence hint rendering:** `flashcards.js` initially rendered the game shell before the first round existed, so the Malay sentence hint was absent from the first DOM render. Added `updateTranslationHint()` after `makeRound()` in `showMemory()`; the hint is inserted/updated after the first round is created.
- **Completed-game review test clock:** the game timer ticks recursively every 80 ms and schedules result persistence 2 seconds after timeout. Advancing only 62 seconds could reach the timeout overlay but stop before the delayed save callback (which can occur just over 62 seconds). The browser test now advances 63 seconds on Playwright's fake clock. This is a test-timing correction; the browser run must still confirm the review list and per-game snapshots.
- **Daily Discovery runtime pool:** the slug regex in `daily-learning.js` contained double-escaped Unicode markers. JavaScript interpreted the character class as ordinary characters and stripped the letter `u` from words such as `bantu`, reducing the 93-entry pool to 70. Corrected the regex to the combining-mark range `[\\u0300-\\u036f]` and added `tests/malay-daily-discovery-pool.test.mjs` to check the exact helper against all 93 dictionary-derived IDs.
- **Daily Discovery migration order:** the Quiz CI workflow tested the 93-row catalogue before applying migration `20261127150000`. The migration is now applied before its SQL assertion. The first CI attempt then exposed a unique-index collision: the migration cleared rotation slots only for stale IDs, leaving existing current IDs temporarily occupying old slots while they were being reordered. It now clears all Malay Daily Discovery rotation slots in the transaction before upserting the ordered 93 rows.
- **Post-bootstrap refresh:** `daily-learning.js` also rebuilds the Malay pool after `swiftdictionary:content-packages-ready` and refreshes the registered Malay package, preventing early partial data from persisting.

The live staging database was checked read-only: it has exactly 93 active Malay Daily Discovery rows, 93 distinct rotation orders from 1 through 93, and no topic/difficulty metadata. The ordered database IDs were compared with the runtime approved ID list: all 93 match exactly.

The staging private schema currently contains 14 tables; the direct table-SELECT grant audit found zero selectable by `anon`, zero by `authenticated`, and zero by `service_role`. This is consistent with the server-mediated RPC boundary; do not add broad table policies to silence informational advisor findings.

## Latest application commits and CI checkpoint

Implementation commits on `feature/update-3.0-phase-0-audit` include:
- `8857144` — initial deterministic Flashcard fake-clock test adjustment (superseded by the 63-second adjustment)
- `e3548ae` — first-round Malay sentence hint rendering fix
- `f6046e6` — post-content-bootstrap Malay Discovery refresh
- `9d9ff9f` — apply the Discovery catalogue migration before its SQL assertion
- `511bced` — clear all previous Malay Discovery rotation slots before reseeding
- `2efc175` — fix the double-escaped Malay Discovery slug regex
- `0bb8720` — advance the completed-game review test clock to 63 seconds
- `8c4f0c5`, `f41c092`, `3c8a65e` — add exact Flashcard category and coverage assertions
- `f267137` — add the 93-word Malay Discovery slug/pool unit regression
- `296439a`, `c081f7f` — run the Flashcard and Daily Discovery audit tests in their CI workflows

At the latest checkpoint, the U3.0 architecture, Cloudflare routing, English dictionary QA, and U2.7 PostgreSQL checks passed. U2.3 PostgreSQL migration/allowance checks passed; its Chromium browser suite was still running. Flashcard static checks passed; its Chromium suite was still running. The Quiz database run before the rotation-slot fix failed on the unique index; a rerun including the fix was queued/pending. The newest CI run at head `c081f7f` had been triggered but had not completed. Do not call the regression matrix green until the newest run finishes and the Flashcard review assertions pass.

No production deployment or production database change was made. Staging preview, OAuth redirect/account-isolation acceptance, human Malaysian Standard Malay editorial review, model licence/attribution verification, and Malaysia Copyright Act/PDPA/cross-border review remain open before public release.
