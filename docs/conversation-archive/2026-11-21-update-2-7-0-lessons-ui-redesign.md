# SwiftDictionary Update 2.7.0 — Lessons UI redesign and content pause

Date: 2026-11-21

## Owner direction

The owner requested a temporary pause on further Chinese dictionary/content expansion while reworking the Lessons interface. This is a scope adjustment inside Update 2.7.0, not a cancellation of Chinese support or a delay to the overall update.

The new Lessons UI applies consistently to English and Simplified Chinese courses.

## UI changes implemented

1. Rebuilt the Lessons landing layout so a visually elevated **Permanent Lessons** container holds the difficulty selector, daily lesson allowance, topic/progress controls and permanent lesson library.
2. Moved the existing **My daily activities** preference controls from the Lessons page to Preferences. The same preference columns and cloud persistence are retained. The heading localizes with the selected translation language, and save/failure feedback is visible on Preferences.
3. Restyled Daily Learning tabs with distinct blue, teal, purple and amber backgrounds, raised shadows, hover states and an active tab whose lower edge meets the matching activity panel.
4. Added transitions to the difficulty controls, lesson cards, lesson reader and Daily Learning drawer. Opening and closing the drawer animate smoothly; reduced-motion preferences disable nonessential motion.
5. Expanded the permanent lesson reader from its previous 900px maximum to a 1320px maximum and full available parent width.
6. Improved typography and spacing for Chinese, pinyin and English support. Text is no longer forced into compact inline runs, and lesson copy uses bright high-contrast colours instead of low-contrast muted grey on dark panels.
7. Added a consistent highlighted **KEY IDEA / 重点** treatment to every curated lesson point, for both English and Chinese lessons. Existing grammatical sentence-role highlights remain in place.
8. Constrained practice panels, fieldsets, legends, labels and bilingual text with minimum-width controls, wrapping and overflow clipping to prevent questions crossing panel boundaries. Answers remain vertically stacked for readable selection.
9. Reworked the Daily Learning reader into a left-side drawer: half viewport on desktop, 62% on medium screens and full-screen on narrow mobile screens.

The dictionary grid is unchanged and remains character-only. Pinyin has not been added to Dictionary cards.

## Technical implementation

- Added lessons-ui.css as a shared stylesheet.
- Updated index.html to reorganize the Lessons and Preferences markup, add key-point emphasis, animate the permanent lesson reader, and initialize Daily Learning preferences when Preferences is opened.
- Updated daily-learning.js to theme the selected activity panel, animate drawer close/open without prematurely discarding the content, localize the relocated preference heading, and show preference save/failure feedback in Preferences.
- Updated build.sh cache busting for the modified Daily Learning script.
- Added tests/update-2-7-0/check-lessons-ui.mjs and wired it into the U2.7.0 workflow.
- Updated regression assertions to reflect the new Permanent Lessons-first layout, Daily Discovery's shaded backdrop and brighter text, and the updated Daily Learning script cache version.

## Application commits

Feature branch: feature/update-2-7-0-chinese-dictionary-lessons

Latest application head at archive time:
0e0d0b520f8d763dbb9839deda36085ded759082

Relevant implementation commits:
- aff9a03cb3cdf8da81157a5edb98428586931ccb — initial Lessons UI redesign and tests.
- 4aecfe2335d0af8246270e3b903c6cff831b4994 — preference feedback, initialization and asset cache version.
- 5bc440df9176905b1325ae046efb94e6429e3803 — UI test and preferences status assertions.
- 1ac5a797389cc6614e52fcd444441071bf557088 — update existing script cache-bust regression.
- 81c6f8810b3105d2799b40a1c5711a0ade702b70 — update Daily Discovery browser expectations.
- 61223cbd0ba455f9c37dd199b772d2d7d07de077 — borderless discovery drawer refinement.
- 0e0d0b520f8d763dbb9839deda36085ded759082 — update frontend layout regression assertion.

## Preview deployment

Cloudflare Pages deployed the latest app head 0e0d0b5 successfully:
- Deployment: https://8dfdd54f.swiftdictionary.pages.dev
- Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

Cloudflare build-routing guard passed on the latest head. The Pages build uses the branch-aware build script to select Singapore staging for feature previews and Tokyo production only for main. The separate Cloudflare Workers build for the retired swiftdictionary-testing Worker failed; that is not the active Pages deployment and does not invalidate the Pages preview.

## Automated verification

At the latest checked head:
- U2.7.0 workflow run #44886855621 passed all steps: Chinese dictionary static checks, Chinese Lessons content/pinyin checks, the new Lessons UI structural/accessibility test, full Lessons and Daily Learning browser regression, isolated Chinese dictionary browser checks and Chinese bilingual layout browser check.
- Cloudflare build-routing guard #44886855624 passed.
- Update 2.5.0 Flashcards jobs passed in run #44886855618.
- Update 2.3.x PostgreSQL 17 migration/allowance tests and Chromium browser regression passed in run #44886855634; Supabase CLI local Auth compatibility was still completing cleanup at the last check.
- U2.6.0 ACL regression run #44886855686 was still completing disposable local Supabase cleanup.
- Quiz database foundation job in run #44886855646 passed; the companion Local Supabase Auth/RPC integration job was still running.
- The previous 2.3.x failure on run #44886764402 was caused by an obsolete assertion expecting Daily Learning to precede the difficulty selector. The assertion was updated to enforce the new order: Permanent Lessons first, then Daily Learning. The corrected run #44886855634 passed its PostgreSQL and Chromium jobs.

Do not claim every workflow is green until the remaining local Auth/ACL/Quiz integration jobs complete.

## Database, privacy and legal boundary

- No Supabase migration or database schema change was introduced for this UI redesign.
- Singapore staging remains on the already-applied language-aware Lessons migration. Production remains untouched.
- Daily activity preference values, sync behaviour and completion rules are unchanged; only their UI location and feedback presentation changed.
- No new personal data is collected or new processing purpose introduced by these UI changes.
- This is not a formal Malaysia PDPA or international legal clearance. The previously recorded legal/privacy review remains deferred, not cleared.

## Release boundary and next step

- PR #14 remains draft, open and unmerged.
- No production migration, merge to main or production deployment is authorized.
- Owner has already tested the previous staging preview; the new UI preview is available for visual review.
- Continue to hold further Chinese dictionary/content expansion while the owner reviews the shared Lessons UI. Existing Chinese foundation and course-specific progress remain in place.
- After UI acceptance, resume the remaining U2.7.0 QA/content review and separately request approval for PR readiness/merge and any production rollout.




## Final CI completion (2026-11-21)

All relevant latest-head PR workflows completed successfully:
- U2.7.0 dictionary, Chinese Lessons, new UI static/accessibility and browser regression suite: #44886855621 — success.
- Update 2.3.x PostgreSQL 17 migration/allowance, Supabase CLI Auth compatibility and Chromium browser regression: #44886855634 — all jobs success.
- Update 2.5.0 Flashcards: #44886855618 — all jobs success.
- Update 2.6.0 ACL regression: #44886855686 — success.
- Quiz database foundation and local Supabase Auth/RPC/Chromium integration, including signed-out Flashcards/Preferences and permanent Lessons allowance notification regressions: #44886855646 — all jobs success.
- Cloudflare build-routing guard: #44886855624 — success.

The earlier failures were regression expectations that still assumed the previous layout/cache version; those assertions were updated to match the intended redesigned UI. The corrected latest-head suite is green.

PR #14 body was updated with the completed CI run IDs and latest Pages preview URLs. PR remains draft/open/unmerged. Production remains untouched. The only outstanding owner-facing step is optional visual acceptance of the new preview; no code, GitHub, or Supabase manual operation is required from the owner.
