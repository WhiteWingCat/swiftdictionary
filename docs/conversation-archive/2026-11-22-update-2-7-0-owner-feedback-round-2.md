# Update 2.7.0 — owner feedback round 2: Daily Learning, Chinese pinyin and lesson emphasis

Date: 2026-11-22

## Scope and branch boundary

Continued the existing U2.7.0 feature branch `feature/update-2-7-0-chinese-dictionary-lessons` and PR #14. No changes to `main`, no production migration and no production deployment. Singapore staging remains the only U2.7.0 database previously migrated.

## Owner feedback addressed in code

1. Chinese dictionary separate-meaning examples now render pinyin. A sense-aware helper overrides the target polyphonic character with the reading selected by that sense.
2. Daily Learning reader now forces layout before its two-frame entrance transition; the closing transition and reduced-motion handling remain. Course changes dispatch an event to refresh the activity data.
3. Daily Discovery content selection follows the active course. English and Chinese keep their independent 93-entry rotations/catalogues.
4. Completed Daily Learning sessions can be reviewed again without completing or charging a second time. Session history and in-progress sessions are scoped by `language_code`. Historical review cards do not consume today's new activity slots. Adaptive Chinese Daily Revision reconstructs the original source item from the completed session ID.
5. Daily activity headings now describe the learning purpose. Allowance reset, sign-in and paused-plan messages are displayed separately as status information.
6. Chinese Daily Topic and Daily Application content now has English titles and English support for explanations, examples, questions, options and answer feedback. Chinese Daily Revision has an English title. Chinese Daily Discovery cards show the English definition when English translation is selected.
7. Shared subject/verb/predicate/object/adverbial highlighting is styled consistently for English and Chinese. Contextual sentence breakdowns were added to four more English lessons and six more Chinese lessons; seven Chinese lessons now have breakdowns.

## Important regression discovered and corrected

A browser run exposed a temporal-dead-zone error: the new language-scoped session queries referenced `language` before its declaration in `loadDailyData`. That prevented Daily Learning from rendering, causing downstream tab and reader failures. The declaration was moved immediately after preferences are loaded and before the session queries. A static regression assertion now protects this ordering.

## Regression coverage updated

- U2.7.0 static checks validate pinyin-aware dictionary examples, bilingual Chinese lesson content, shared highlight styles, activity descriptions, course-aware selection, replay language scoping, historical-review slot accounting and the language initialization order.
- Playwright coverage was expanded for the Daily Learning drawer open state, English Daily Discovery after switching courses, historical review alongside today's new activity, and the corrected description/status split.
- Browser test fixtures now include the session `language_code` field.

## Latest known validation state at archive creation

- U2.7.0 data/static/accessibility checks passed on earlier head `0cd37a2` and subsequent runs reached the full browser regression stage.
- One earlier full browser run failed. The primary cause was the language variable initialization order described above; the browser fixtures also required updating for the new language-scoped session filter and separate activity status message.
- Latest application head at archive creation: `3ec276effb24ed553ccd697daebcc42ae166dfe5`.
- Latest U2.7.0 GitHub Actions run was queued/in progress; final Chromium results and the corresponding Cloudflare Pages deployment had not yet been confirmed.
- Therefore the staging preview was **not yet declared ready** at archive creation. Do not treat this archive as a release approval.

## Legal and privacy

These corrections add no new personal-data category or processing purpose. No new database migration was required for this round. Formal Malaysia PDPA and international legal/privacy review remains deferred, not cleared.


## Validation follow-up — latest application head `8fec96ab80e889c2cf50ddf71382da643a6e4c23`

- U2.7.0 data/static/accessibility checks passed.
- Full Lessons and Daily Learning Chromium regression suite passed.
- Isolated Chinese dictionary browser checks passed.
- Chinese Lessons bilingual-layout browser check passed.
- 2.3.x PostgreSQL 17 migration/allowance tests, local Supabase Auth compatibility and Chromium browser regressions passed.
- 2.5.0 Flashcards checks passed.
- 2.6.0 ACL drift regression passed.
- Cloudflare build-routing guard passed.
- Quiz DB foundation PostgreSQL validation passed; its separate local Supabase Auth/RPC/Quiz Chromium runtime job was still running at this update.
- The latest U2.7.0 GitHub Actions run succeeded, but the Cloudflare Pages branch-preview deployment itself was not independently verified. Keep the preview readiness gate open until the Pages deployment is confirmed.

Additional fixes discovered during validation:
- Added a supplemental pinyin map for every Han character used in the 725 combined dictionary entries' separate-sense examples. Static coverage now asserts no example character lacks a pinyin fallback.
- Completed review cards are retained without consuming today's slots; the next unused Daily Topic/Application item is still shown.
- Stale completed session IDs that no longer resolve to the original content are no longer rendered as unrelated current content.
- Test fixtures and the Quiz frontend validator now reflect the language-scoped Daily Learning session query contract.


## Final CI compatibility result

The Quiz database foundation workflow also completed successfully, including local Supabase Auth/RPC integration and authenticated Chromium Quiz runtime tests. All GitHub Actions workflows attached to application head `8fec96ab80e889c2cf50ddf71382da643a6e4c23` completed successfully: U2.7.0, 2.3.x, 2.5.0, 2.6.0, Quiz DB foundation and Cloudflare build-routing guard.

The only remaining release gate is independent confirmation that Cloudflare Pages has published the latest feature-branch head to the existing branch-preview URL. The preview URL could not be fetched by the available browser inspection, and no Cloudflare deployment connector/status record is available in this workspace. Do not claim the live Pages preview is confirmed solely from the successful build-routing guard.


## Staging deployment confirmed

Cloudflare's GitHub check run `Cloudflare Pages` for application head `8fec96ab80e889c2cf50ddf71382da643a6e4c23` completed successfully at 2026-11-22 08:47:37 UTC. Deployment ID: `3b37c9ef-d582-4b15-af2b-576141de4368`.

- Commit-specific preview: https://3b37c9ef.swiftdictionary.pages.dev
- Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

The separate `Workers Builds: swiftdictionary-testing` check is still reported as failed for the retired testing Worker. It is not the Cloudflare Pages deployment; the Pages check explicitly reports **Deploy successful** for the latest U2.7.0 head. The staging preview is ready for owner testing. PR #14 remains draft/open/unmerged; production remains untouched.
