# SwiftDictionary U2.8.0 — staging feedback remediation (2026-11-23)

## Owner feedback

After testing the U2.8.0 staging preview, the owner identified four issues:
1. The Quiz landing and active Quiz test interfaces had not received the planned redesign.
2. Dashboard tab buttons were visible but switching tabs did not change the visible content.
3. Mixed Recall was shown for Chinese even though the intended course-specific third mode is Translation Recall; the third position should swap between the two modes.
4. Daily History review actions navigated away from Dashboard instead of reviewing content in place.

The latest explicit owner instruction supersedes the earlier U2.8 plan paragraph that proposed Chinese Mixed Recall. The owner-approved mode layout is:
- English: Word Recall, Definition Recall, Mixed Recall, Sentence Recall.
- Chinese: Word Recall, Definition Recall, Translation Recall, Sentence Recall.
- Exactly four modes per course; position three is replaced in place and the unavailable mode is hidden.

## Root causes and implementation

### 1. Quiz UI redesign

The earlier implementation retained the generic Quiz overview and basic test question layout despite the plan requiring a full redesign. Updated `index.html` with:
- A new Quiz challenge hero, clear untimed/session/review expectations and redesigned difficulty cards.
- A redesigned active test shell with stronger hierarchy, question number and topic context, progress status, redesigned answer-choice cards and navigation.
- Directional previous/next question transitions.
- Coherent entry transitions between overview, active test and result screens.
- Reduced-motion handling.
- Previous/next controls remain disabled during the save/navigation request; the existing save guard prevents overlapping navigation and preserves selected answers.

### 2. Dashboard tabs

The tab click handler and panel state were already present, but `.dashboard-tab-panel` set `display:grid` and the stylesheet did not override that display when the `hidden` attribute was set. As a result, the panels did not visually hide and the tab clicks appeared ineffective.

Added an explicit `.dashboard-tab-panel[hidden] { display:none !important; }` rule, reliable initial/preserved tab selection, active/selected state updates, roving tab index and Arrow/Home/End keyboard navigation.

### 3. Course-specific Flashcard modes

Updated `flashcards.js` to enforce the four-mode layout:
- English shows Word, Definition, Mixed, Sentence.
- Chinese shows Word, Definition, Translation, Sentence.
- If a learner changes course while the third-mode setup is open, the setup remaps to the corresponding third-position mode.
- Legacy completed game snapshots remain reviewable under their original mode.

The staging database's existing `private.start_my_flashcard_game_impl` was inspected. It already rejects `mixed` for Chinese and rejects `translation` for English before allowance consumption. No database migration or staging data change was needed for this correction. Added an authenticated regression test that attempts a Chinese Mixed Recall start and expects the RPC to reject it.

### 4. Dashboard in-place Daily History review

Added a Dashboard review overlay and review actions for completed permanent lessons and Quiz sessions. Existing Flashcard game review and Daily Learning reader overlays are now opened without calling `showPage` or changing the route.

Daily History now exposes review actions for:
- Permanent Lessons: read-only lesson content, examples, breakdown, mistakes and practice questions with correct answers shown.
- Daily Topic, Daily Application, Daily Discovery and Daily Revision: reuse the completed Daily Learning reader without returning to the Lessons page; completed practice answers are read-only and correct choices are highlighted.
- Quiz sessions: show the full completed Quiz result and answer review in the Dashboard overlay.
- Flashcard games: open the existing full-game review overlay while Dashboard remains visible.

These review paths do not start a new activity, consume allowance, or mutate completed records. The original answer selection is shown only where stored; no unstored learner answer is fabricated.

### Mock and test support

- Updated the mock Flashcard runtime to preserve per-card result snapshots and implement `get_my_flashcard_game_review`, so browser tests exercise the same review contract.
- Added Playwright coverage for Quiz redesign and transitions, in-place Quiz history review, all four Dashboard tabs, lesson/Daily Learning in-place review, Flashcard in-place review, course-specific mode lists and live course switching.
- Updated the authenticated Quiz/Flashcard test to assert the backend rejects Chinese Mixed Recall.
- Bumped cache versions for the changed assets: `lessons-ui.css?v=2.8.0-ui8`, `daily-learning.js?v=2.8.0-r2`, and `flashcards.js?v=2.8.0-r2`. Updated the associated static test expectations.

## Staging / production boundary

- No Supabase staging migration or content change was necessary for these four UI/behaviour fixes. The previously authorized staging database remains at its existing U2.8.0 migration/content state.
- No Production database, Production application code, `main` branch or production deployment was changed.
- The Cloudflare Pages preview build for the latest application-code commit (before the final test-only commits) succeeded. Test-only commits after it do not alter deployed application assets.

## CI status at archive update

The first verification run exposed test/fixture issues rather than a new production schema problem:
- The Node-based Daily Learning frontend check does not provide a DOM `document.createElement`; removed the runtime-injected style element and moved the review highlight rule to `lessons-ui.css`.
- The mock Flashcard adapter had a duplicate `pref` declaration; renamed the new user-specific preference variable.
- Existing static tests asserted the previous CSS/Flashcard asset cache versions; updated those expectations to the U2.8.0 cache versions.

A fresh verification batch was running at the time of this archive update for the U2.3 Dashboard/regression suite, U2.5 Flashcards browser suite, Quiz database/authenticated integration suite, U2.7 Chinese dictionary suite and U2.6 ACL suite. Do not claim all checks green until those latest-head results are inspected. The separate retired Workers Builds workflow remains non-authoritative for Cloudflare Pages preview deployment.

## Current disposition

The four requested fixes have been implemented on `feature/update-2-8-0-chinese-quiz-flashcards`. The plan and Master Development Record are being updated to preserve the corrected mode rule and the new Dashboard review behaviour. Keep PR #16 draft until the fresh CI batch is green and the owner has a refreshed staging preview to retest. No merge, production migration or production release is authorised.


## Follow-up verification — Chinese permanent lesson review and refreshed preview

### Additional defect corrected

During the review of the new in-place Dashboard lesson renderer, a language-specific lookup gap was found: it searched the English permanent-lesson catalogue even when the Daily History item belonged to the Chinese course. The renderer now selects `chineseLessonData` for Chinese records and the English catalogue for English records.

- Application fix commit: `1b9711831519d4acd911c1ad127a05a341026916`
- Added a Playwright regression using the real Chinese lesson ID `zh-b-pinyin-foundations`.
- The test confirms the Chinese title and topic render in the Dashboard review overlay and the route remains `#profile`.
- Test commit: `2749d6359fafbbbbc52429b3b5f4c5a36f42ad71`.

### Staging backend verification

No database migration or staging data change was needed. Inspected the staging `private.start_my_flashcard_game_impl` function and ran an authenticated, rollback-only test as a Chinese-course staging user. A request to start `mixed` was rejected with the expected Chinese-course mode validation error (`22023`), before allowance checks or session insertion. The transaction was rolled back.

The allowed-mode contract remains:
- English: `word`, `definition`, `mixed`, `sentence`.
- Chinese: `word`, `definition`, `translation`, `sentence`.

### Latest preview deployment

- Latest feature head: `2749d6359fafbbbbc52429b3b5f4c5a36f42ad71`.
- Cloudflare Pages check: successful.
- Stable branch preview: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev
- Preview-host Supabase routing continues to use the isolated staging project. Production host routing is unchanged.

### CI status at follow-up

Passed on latest head: Cloudflare Pages; Quiz DB foundation; Flashcards static checks; Chromium Mock User Flashcards suite (including all four requested staging fixes and the Chinese permanent-lesson regression); Chromium signed-out browser smoke; Supabase CLI local Auth compatibility; PostgreSQL 17 U2.7 allowance regression; PostgreSQL 17 ACL regression; Chinese dictionary static/Chromium checks; Cloudflare build-routing; PostgreSQL 17 migration/allowance tests.

Two duplicate push/PR runs of the full local Supabase Auth/RPC integration workflow were still running the authenticated Chromium Quiz runtime step at the time of this follow-up. Verify both final conclusions before declaring all CI complete. The separate retired Workers Builds service `swiftdictionary-testing` still reports a failure; it is unrelated to the successful Cloudflare Pages deployment and is not the preview target.

No Production database, application code, `main` branch or production deployment was changed. PR #16 remains draft.
