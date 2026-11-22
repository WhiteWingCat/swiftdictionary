# Update 2.7.0 — owner feedback round 3: Daily Learning, allowance timing and Chinese examples

Date: 2026-11-22  
Implementation branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Pull request: #14 (not merged)  
Latest implementation commit: `ade95b7c3e99405d941c33627156aa6856117958`  
Latest Cloudflare Pages preview deployment: `https://fed3bc44.swiftdictionary.pages.dev`  
Stable branch preview: `https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev`

## Owner feedback carried forward

The owner reported that the latest preview still missed earlier feedback:
- Previous item 2: the Daily Learning activity reader/drawer was unreliable and did not visibly transition.
- Previous item 4: completed Daily Learning content needed to be reviewable without creating a new activity session or consuming another allowance.
- Previous item 5: remove the daily-allowance explanatory/reset description from the activity panel.
- Previous item 7: highlighted text must always be bold white; highlights must emphasize the current lesson topic, not subject/verb/object roles.

## Changes implemented

### Daily Learning reader and completed review
- Replaced the drawer's reliance on keyframe-only motion with explicit CSS transform/opacity transitions for both opening and closing.
- Kept the two-frame reader mount sequence and reduced-motion support.
- Added a Chromium regression assertion for the transition property, non-zero duration, and final open transform.
- Completed activity cards now pass their original completed session into the reader and open the saved content directly. The review path does not call the session-start RPC.
- Added a browser regression confirming a completed Chinese daily activity can be reopened and reviewed without a new start call.

### Daily allowance description
- Removed the reset/allowance explanatory paragraph from active Daily Learning panel status.
- Kept the compact allowance meter and its remaining count; sign-in, paused, and unavailable-plan messages remain when relevant.
- Added static and browser assertions that the allowance description is absent while the meter remains visible.

### Lesson topic emphasis
- Removed sentence-role color coding and neutralized old role-based marks.
- Added topic-specific emphasis for the English article lesson: `a`, `an`, and `the`.
- Topic marks use bold white text consistently.
- Added a browser regression asserting article-topic highlights are present and old role-specific marks are absent.

### Permanent lesson allowance timing
- Added a confirmation dialog with the exact owner-provided warning:
  “Selecting this lesson will consume one daily lessons allowance, are you sure?”
- The dialog provides Confirm and Cancel, matching the existing dark UI, shadows and clean rounded styling.
- Cancel leaves the allowance unchanged. Confirm proceeds into the lesson; the database charges the first start atomically.
- New starts are charged once. Completing the lesson, resuming an in-progress lesson, and reviewing a completed lesson do not charge again.
- English and Chinese permanent lessons share the daily lesson allowance.
- Preserved the personal testing exemption.
- Added a private-schema trigger function and a database migration for first-start allowance accounting.
- Added PostgreSQL tests for Free/Premium limits, language sharing, completion neutrality, exemption and concurrent starts.

### Chinese course content
- Replaced the date example's `二〇二六年` with `二零二六年`, and verified the matching pinyin includes `líng`.
- Replaced the English learner name “Maya” with the Chinese name “李明” and matching pinyin “Lǐ Míng”.
- Added static content assertions for the character, pinyin and Chinese name.

## Database and legal/privacy boundary

- Applied the new first-start allowance migration to the Singapore staging Supabase project only. The migration is recorded there as `update_2_7_0_lesson_start_allowance`.
- No production migration or main-branch merge was performed.
- The change reuses the existing lesson progress and allowance ledger; it does not introduce a new category of personal data or a new external data recipient.
- Existing formal legal/privacy review remains separate and is not represented as completed by this implementation.

## Validation status at handover

- PostgreSQL 17 U2.7.0 lesson-start allowance regression passed on the preceding implementation commit, including the concurrent-start test.
- The full Lessons/Daily Learning Chromium suite passed on the preceding implementation commit.
- The latest commit `f9d69cd` adds the explicit drawer-transition implementation and a browser assertion for it. Cloudflare Pages deployment for that commit succeeded.
- CI was re-triggered for `f9d69cd`; the final Chromium and PostgreSQL reruns were still in progress when this record was written.
- Therefore the preview URL is deployed, but it must not be treated as handed to the owner for acceptance until the latest rerun finishes successfully.

## Acceptance checks for the owner

1. Open Daily Learning Topic, Application, Discovery and Revision activities; confirm the correct content appears and the side panel slides in/out.
2. Reopen a completed activity and confirm it is review-only and does not use another daily allowance.
3. Confirm the explanatory daily allowance/reset paragraph is absent; the compact meter may remain.
4. Open the article lesson and verify only the topic terms `a`, `an`, and `the` are highlighted, always in bold white.
5. Select a new permanent lesson, cancel, and verify no allowance is consumed.
6. Select it again, confirm, and verify the practice opens and one allowance is consumed immediately.
7. Resume that lesson and complete it; verify neither action consumes another allowance.
8. Check the Chinese date example and Chinese learner name/pinyin.

