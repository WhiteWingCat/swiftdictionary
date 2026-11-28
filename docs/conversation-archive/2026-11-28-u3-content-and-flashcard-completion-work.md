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
