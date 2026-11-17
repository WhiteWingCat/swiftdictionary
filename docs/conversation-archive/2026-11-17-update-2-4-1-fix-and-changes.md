# SwiftDictionary Update 2.4.1 — Fix & Changes

**Date:** 2026-11-17  
**Repository:** https://github.com/WhiteWingCat/swiftdictionary  
**Live site:** https://whitewingcat.github.io/swiftdictionary/  
**Feature branch:** `feature/update-2-4-1-fix-changes`  
**Pull request:** [#10 — SwiftDictionary Update 2.4.1: Fix & Changes](https://github.com/WhiteWingCat/swiftdictionary/pull/10)  
**Merge commit:** `6dfd084fa9b2c1290fb183fbf0862dadec0dd8f7`

## Owner approval and scope

The owner approved the repair and requested that all four UI feedback items be included in Update 2.4.1 and merged to `main`.

1. Remove the complete “Draft question-bank preview” information from the live Quiz page.
2. Show a short-lived notification after changing either Learning Course or Translation Language, confirming that the page refreshed.
3. Prevent translation changes from making an unfinished Quiz appear as the active session on the main Quiz page. Preserve the current Quiz subview instead.
4. Translate the main Quiz page when Simplified Chinese is selected.

The two reported production defects were also in scope: Daily Learning displayed no activities, and no Quiz could be started.

## Investigation and root causes

### Daily Learning

The browser query for in-progress Daily Learning sessions did not include the `id` column. Expired-session cleanup then attempted to call `abandon_daily_activity_session` with the missing ID and failed before rendering the activity cards.

The query now selects `id` along with the session fields needed by the UI. The existing expiry test covers the expected behaviour: an old session is abandoned, it no longer appears as in progress, and the learner can start a new activity.

### Quiz eligibility and start

The released 199-question bank contains English learning content with a Simplified Chinese translation pack (`translation_language_code='zh'`). The availability function incorrectly treated the learner's display translation preference as a requirement for the underlying question bank. With English selected, this excluded the entire pack and made every difficulty unavailable.

The 2.4.1 migration corrects the separation:
- English learning content remains selectable regardless of whether the learner's display translation is English or Simplified Chinese.
- Chinese-translation integration questions are included only when Simplified Chinese is selected.
- The browser passes the current learning and translation selector values explicitly to the Quiz start RPC, so the session snapshot matches the selection made by the learner.

### Stale preference hydration and Quiz subview

A delayed Profile data read could complete after the learner changed the language selectors, then overwrite the newer selection with older account preference data. Profile hydration now records the selector-selection version and does not apply stale language values after a newer local selection has occurred. Once Profile data finishes loading, the current language is reapplied to the Quiz overview or visible session.

The translation refresh logic records which Quiz subview was visible before the selector changed. An already-open session stays open; when the learner is on the overview, translation changes keep the overview visible rather than opening the unfinished session. Session snapshots and saved answers are not rewritten.

## Implementation and release

PR #10 includes:
- Daily Learning session query fix in `daily-learning.js`.
- Quiz availability and explicit-language start migration.
- Stale Profile preference hydration guard.
- Quiz overview Simplified Chinese translations, including static and dynamic overview content.
- Accessible transient selector-refresh toast for both selectors.
- Removal of the draft-bank preview notice from the live HTML.
- Expanded authenticated Chromium and frontend validation coverage.
- PR description recording the four owner feedback items.

The final PR head was `db96af2b1c1099380f09bd0b387d5d1863e3f7e1`. PR #10 was squash-merged to `main` as `6dfd084fa9b2c1290fb183fbf0862dadec0dd8f7`.

## Validation

Both final-head CI workflows passed:

- Quiz database foundation / authenticated Quiz runtime: [workflow #44097715861](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44097715861). PostgreSQL 17 migration and foundation assertions, local Supabase/Auth/RPC integration, authenticated Chromium Quiz runtime tests and security advisors passed.
- 2.3.x regression suite: [workflow #44097715708](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44097715708). PostgreSQL migration/allowance tests, local Supabase Auth compatibility and Chromium browser regression smoke tests passed.

Earlier CI failures were not ignored:
- The initial Quiz runtime test caught a language selector reverting to English after an asynchronous preference refresh.
- The frontend validator referenced an earlier migration filename after the migration was timestamped.
- The migration path was corrected and the Profile hydration race was fixed. The final PR-head workflows above passed.

## Production Supabase verification

Production project: `pzymiesazmpyvnfvsbsc` (Tokyo, `ap-northeast-1`), PostgreSQL 17.11.0.003, status `ACTIVE_HEALTHY`.

The production migration history already contained `20261117132100_swiftdictionary_update_2_4_1_quiz_translation_language_fix`. The release wrap-up verified its presence and function privileges; it did not reapply the migration.

Production question-bank counts remain unchanged:

| Type | Approved rows |
|---|---:|
| Knowledge | 114 |
| Word definition | 15 |
| Chinese translation | 70 |
| **Total** | **199** |

All 15 active permanent English lesson mappings remain present.

The new three-argument `public.start_my_quiz(text,text,text)` wrapper and private implementation are installed. Authenticated execute is granted; anon and public execute are false. Existing one-argument overloads remain authenticated-only. No production Quiz session was started during this verification.

Post-release security advisor:
- 7 INFO findings: RLS-enabled private-schema tables without direct client policies; access remains mediated by authenticated RPCs.
- 2 WARN findings: previously reviewed public lesson SECURITY DEFINER functions.
- 1 WARN finding: leaked-password protection is disabled; the current app uses Google OAuth.
- No health findings and no new Quiz-specific security warning.

At verification, production still had two old Daily Learning sessions marked `in_progress` and two completed sessions. No learner rows were manually modified. The corrected frontend is expected to abandon the expired sessions on the user's next Lessons load.

## GitHub Pages deployment

GitHub Pages deployment [#44098139901](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44098139901) completed successfully for main commit `6dfd084fa9b2c1290fb183fbf0862dadec0dd8f7`.

The repository has been renamed from `WhiteWingCat/wordbook` to `WhiteWingCat/swiftdictionary`. The current canonical site URL is:

https://whitewingcat.github.io/swiftdictionary/

## Manual production test checklist

Automated browser tests used disposable local Supabase accounts. The owner's real production Google account was not used, to avoid creating a Quiz session or reserving questions on their behalf. Manual live testing remains outstanding.

1. Hard-refresh the live site to load the newly deployed assets.
2. Open Lessons. Verify all four Daily Learning activity tabs/cards appear. Expired sessions should be cleared automatically.
3. Open Quiz with English translation selected and test all three difficulties.
4. Switch translation to Simplified Chinese. Verify the main Quiz overview, difficulty cards, allowance, history and controls are translated.
5. Start a Quiz and change translation while it is open. Confirm the session remains open and answers/position remain intact.
6. Return to the Quiz overview with an unfinished session. Change translation and confirm the overview remains visible with a Resume option.
7. Change both selectors and verify the short-lived refresh toast appears and disappears.
8. Report any live-test issues before inviting friends.

## Deferred content and legal/privacy gates

The owner's human bilingual accuracy review of the 199-question bank remains **deferred, not waived**. Database status `approved` means selectable by learners; it does not mean independently human-reviewed. The owner intends to test the live website first and then gather feedback from friends before reviewing and correcting the questions and lessons.

Update 2.4.1 adds no learner personal-data fields, analytics or tracking. Existing Quiz processing still includes account-linked selected option IDs, question/lesson snapshots, scores, session history, timezone and temporary no-repeat reservation metadata. Before friends sign in, provide a concise test/privacy notice covering data stored, purposes, retention/deletion, Tokyo hosting/cross-border processing and a contact route. The current site still lacks formal public Privacy Notice and Terms pages. Continue Malaysia PDPA and applicable international/16+ review before broader public use. This is planning guidance, not legal advice.
