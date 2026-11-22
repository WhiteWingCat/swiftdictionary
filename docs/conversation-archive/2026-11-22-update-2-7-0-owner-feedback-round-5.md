# Update 2.7.0 — owner feedback round 5: shared allowance explanation, drawer motion and English Daily Discovery

Date: 2026-11-22  
Application branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Pull request: [#14](https://github.com/WhiteWingCat/swiftdictionary/pull/14) (draft/open; not merged)  
Application head at this archive: `2ce01237c2350115941c56f524b0a7661365879b`  
Cloudflare Pages commit preview: https://8f5833dd.swiftdictionary.pages.dev  
Cloudflare Pages branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

## Owner feedback and decisions

1. The owner confirmed that each daily activity's allowance is shared across English and Simplified Chinese, not split by learning course. Completing English Daily Topic therefore uses that activity's allowance when switching to Chinese. No quota logic change was requested; add a plain-language explanation beneath Daily Learning.
2. The owner preferred to compare a true slide-in/slide-out drawer against the existing fade appearance.
3. English Daily Discovery continued to appear empty and required investigation and repair.

## Root cause and implementation

### Shared allowance explanation

- Added a persistent explanatory paragraph directly beneath the Daily Learning heading/intro.
- The text explains that each activity category has one daily allowance shared across English and Simplified Chinese, completion in either course uses that same allowance, course switching does not reset it, completed content remains reviewable, and reset occurs at midnight in the allowance timezone.
- Added Simplified Chinese copy through the existing translation-language label refresh, so the paragraph follows the selected translation language.
- No allowance RPC, quota count, completion accounting, database schema or migration was changed.

### Drawer motion

- Removed opacity animation from the normal-motion drawer panel's transition declaration. Normal motion now animates the panel transform only, sliding it horizontally into and out of view.
- Kept the dimmed backdrop's own opacity transition, which is separate from the panel motion.
- Preserved the reduced-motion alternative: users requesting reduced motion receive a brief fade without a slide.
- Kept the existing global modal animation suppression and hidden-state correction from round 4.

### English Daily Discovery empty state

- The English and Chinese Discovery pools remain separate language-specific 93-entry catalogues and keep the existing global daily schedule.
- Daily Discovery review history is language-scoped, while the allowance usage is shared across courses. When the other course consumes today's Discovery allowance, the active course may have no completed or in-progress rows and no new slots.
- Previously, the render path added no cards in that valid exhausted state and showed an empty-category placeholder.
- Added a safe fallback to keep the first scheduled item visible as a disabled card with the existing “Daily limit reached” action. The card is informational only; it does not create a session, consume an allowance or change the schedule.
- New activity cards now also use the “Daily limit reached” status label when their action is exhausted, rather than presenting them as new activities.

## Files changed

- `index.html`: Daily Learning allowance explanation and stylesheet cache version.
- `daily-learning.js`: translated allowance explanation, exhausted Discovery fallback and status label.
- `lessons-ui.css`: transform-only normal drawer motion; reduced-motion fade retained.
- `build.sh`: refreshed Daily Learning and Lessons stylesheet cache versions.
- `tests/update-2-7-0/check-lessons-ui.mjs`: regression assertions for shared-course allowance explanation, visible exhausted Discovery item and slide-only normal drawer motion.
- `tests/update-2-6-0/account-deletion-static.test.mjs`: updated existing cache-version assertion to match the new Daily Learning script revision.

## Validation and staging

- U2.7.0 static/data/content checks: passed.
- U2.7.0 full Lessons/Daily Learning Chromium suite: passed, including existing drawer and course-aware review regressions.
- U2.7.0 PostgreSQL 17 lesson-start allowance regression: passed.
- Update 2.3.x PostgreSQL, Auth and Chromium regressions: passed.
- Update 2.5.0 Flashcards checks: passed.
- Update 2.6.0 ACL drift regression: passed.
- Cloudflare build-routing guard: passed.
- Quiz database foundation and Local Supabase Auth/RPC integration had completed the database and RPC phases; authenticated Chromium Quiz runtime was still running when this archive was prepared. Confirm the final run status before declaring all cross-version workflows green.
- Cloudflare Pages explicitly reported **Deploy successful** for commit `2ce0123`: https://8f5833dd.swiftdictionary.pages.dev. Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev.
- The separate failed/in-progress Cloudflare Workers Builds check for the retired `swiftdictionary-testing` Worker is not the Pages deployment.

## Legal, privacy and production boundary

- This round changes UI copy, frontend card fallback and animation only. It adds no personal-data field, tracking, external recipient, processor, RPC or database migration.
- No new legal/privacy clearance is implied. Malaysia PDPA and general international legal/privacy review remain deferred/outstanding.
- No change was made to `main`. No production migration or production deployment occurred.
- PR #14 remains draft/open/unmerged. Explicit owner approval is required before merge or production release.

## Owner acceptance

The next staging review should focus on:
1. Read the Daily Learning allowance explanation in English and Simplified Chinese, and verify it remains visible after changing translation language.
2. Complete one English Daily Topic, switch to Chinese, and confirm the same category shows the shared allowance state with the explanation clarifying why.
3. Confirm the drawer visibly slides in and out in normal-motion settings; verify reduced-motion settings retain the brief fade.
4. Complete or exhaust Daily Discovery in one course, switch to the other course, and confirm the scheduled Discovery item remains visible with a disabled limit state rather than an empty panel.
5. Confirm review of previously completed content remains available and does not consume another allowance.

No merge, production migration or production deployment is authorised by this archive.
