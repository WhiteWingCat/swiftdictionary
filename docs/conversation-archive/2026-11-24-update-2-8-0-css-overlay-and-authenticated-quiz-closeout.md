# SwiftDictionary U2.8.0 — Staging CSS Overlay, Owner-Feedback Verification and Authenticated Quiz Closeout

**Date:** 2026-11-24  
**Repository:** `WhiteWingCat/swiftdictionary`  
**Feature branch:** `feature/update-2-8-0-chinese-quiz-flashcards`  
**Pull request:** #16 (draft; not merged)  
**Final validated commit:** `c994e271a7296c0ee8dec5d69d6a4376a0fb0b45`

## 1. Owner-reported staging defect

The owner opened the U2.8.0 staging preview and saw what appeared to be source code/scripts rendered over the SwiftDictionary interface.

### Root cause

The main stylesheet in `index.html` had its closing `</style>` tag before the recently added Dashboard and Quiz CSS. As a result, the CSS after that boundary was interpreted as visible page text.

### Correction

- Fixed the stylesheet boundary in commit `cc2063440f67eca2c277df12c789f4150312c205`.
- Added a permanent source-level regression guard in `scripts/quiz/validate-quiz-frontend.mjs`. It checks that the required Quiz and Dashboard visual selectors are inside the main stylesheet and that Translation Recall retains its orange style.
- Cloudflare Pages confirmed deployment success for the corrected feature branch. Stable staging preview: https://feature-update-2-8-0-chinese.swiftdictionary.pages.dev/

## 2. Feedback verification

Both rounds of owner feedback were checked against implementation and browser assertions. The following behaviours were verified:

1. Quiz overview and active-question UI redesign, including directional transitions.
2. Dashboard tabs switch their corresponding visible panels.
3. Recall mode is course-aware: English uses Mixed Recall; Chinese uses Translation Recall in the same third position.
4. Switching courses while the Flashcards setup is open remaps the third mode correctly.
5. Completed Quiz reviews open inside Dashboard Daily History, without navigating away.
6. Daily History segments Lessons, Quiz and Flashcards records.
7. Ordinary Quiz navigation opens the Quiz overview, not a completed review.
8. Chinese Quiz answer choices do not expose answer hints through English translations or Pinyin.
9. Quiz start confirmation explains that the allowance is charged immediately; cancelling does not consume it.
10. Quiz difficulty/review presentation and difficulty styling are redesigned.
11. Translation Recall uses the requested orange visual treatment.
12. Flashcards displays the daily-allowance exhaustion notification.
13. Dashboard hero/tab presentation, Flashcards statistics and in-place Weak Memory review are covered by the dependent browser suite.
14. Existing Chinese Lessons, Daily Learning, history, Preferences and account-isolation regressions remain covered.

Relevant browser test titles include:
- `Quiz overview and active test use redesigned layout and directional transitions`
- `Dashboard tabs switch their visible panels`
- `Recall mode slot swaps between Mixed and Translation by learning course`
- `Switching course remaps open Mixed Recall setup to Translation Recall in the same slot`
- `Chinese Quiz choices do not reveal answers through English translations or Pinyin`
- `Quiz start confirmation warns about allowance and cancellation does not consume it`
- `Daily History reviews a completed Quiz without leaving Dashboard`
- `Dashboard Daily History segments Quiz records and keeps Quiz review in History`
- `Ordinary Dashboard navigation to Quiz opens overview, not completed review`
- `Flashcards shows a five-second toast when daily allowance exhausted`

## 3. Authenticated Quiz regression-test correction

The first post-fix authenticated browser run exposed an intermittent test synchronization issue. The test could accept the previous question while its answer-save/navigation RPC was still pending, then compare that old snapshot with the next question's rendered UI.

The test was strengthened to:
- Wait until `quizPageState.saving` is false.
- Confirm the expected question position after navigation.
- Compare the exact question snapshot against the rendered prompt, Pinyin and translation before asserting question-specific UI.

This preserves the application’s answer-save/navigation protections and strengthens the regression test instead of removing assertions.

Final test correction commit: `c994e271a7296c0ee8dec5d69d6a4376a0fb0b45`.

## 4. Final validation

On `c994e27`, the following completed successfully:

- Quiz database foundation.
- Authenticated Quiz RPC, session lifecycle and allowance tests.
- Authenticated Chromium Quiz runtime, including the selected-translation-language regression.
- Signed-out Flashcards and Preferences browser regressions.
- Permanent Lessons allowance notification regression.
- Supabase security advisors against the disposable local Quiz schema.
- Update 2.3.x Dashboard/allowance regressions.
- Update 2.5.0 Flashcards checks.
- Update 2.6.0 ACL drift regression.
- Update 2.7.0 Chinese dictionary and lesson-start allowance checks.
- PostgreSQL migration/allowance tests.
- Supabase CLI Auth compatibility.
- Chromium browser regression smoke tests.
- Cloudflare build-routing guard.
- Cloudflare Pages deployment.

Both push and pull-request Quiz foundation workflows completed successfully on the final commit.

The separate `Workers Builds: swiftdictionary-testing` check reports failure for the retired testing Worker. It is not the active SwiftDictionary Pages deployment; the Cloudflare Pages deployment check is successful.

## 5. Safety and release state

- Authenticated browser tests ran against disposable local Supabase environments with synthetic test accounts.
- The earlier staging question-bank audit was read-only.
- No Production database migration or Production application change was made.
- PR #16 remains a draft and has not been merged.
- U2.8.0 remains in staging; Production is unchanged.
