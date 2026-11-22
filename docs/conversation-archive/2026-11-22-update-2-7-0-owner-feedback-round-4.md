# Update 2.7.0 — owner feedback round 4: scoped highlighting and Daily Learning review

Date: 2026-11-22  
Implementation branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Pull request: #14 (draft/open; not merged)  
Latest implementation commit: `efd4a1a0f06d29f0a0d5a894d4c96761324c1220`  
Cloudflare Pages commit preview: https://caf353ae.swiftdictionary.pages.dev  
Cloudflare Pages branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

## Owner feedback

The owner requested:
1. Restrict lesson highlighting to explanations, sentence breakdowns and examples in context. Never highlight titles, headings, descriptions, questions or answers. Highlights must be deliberate and topic-led, not added for decoration.
2. Perform a full Daily Activities system check because the slide-in/slide-out drawer transition still appeared absent.
3. Keep completed Daily Discovery content available for review instead of hiding it.
4. Show “Review completed content” for completed Daily Revision, and for Chinese Daily Topic and Daily Application, rather than “Daily limit reached”.

## Root causes found

### Lesson highlighting
- The prior highlighter scanned too broadly across the lesson reader, allowing highlights to leak into content areas that the owner explicitly excluded.
- The old sentence-role marks were based on subject/verb/object/adverbial categories, not on the lesson topic.
- The lesson reader can be replaced during navigation, so a highlighter observer attached only to the first reader node could stop following later lesson content.
- Neutralising old sentence-role marks with `textContent` would flatten bilingual sentence-breakdown markup and remove nested pinyin/translation elements. This was corrected by moving the original child nodes intact.

### Daily Activities content resolution
- The Daily Learning language resolver preferred the visible page-level `course` variable over the language attached to the loaded Daily Learning snapshot.
- During a language initialization or course-switch mismatch, a completed Chinese session could therefore be resolved against the English content pool. When the content resolver returned no item, the completed card was omitted and the exhausted-allowance fallback was rendered instead.
- This affected completed Discovery review and could also affect Revision, Topic and Application review in Chinese.

### Drawer motion
- The Daily Learning panel also carried the shared `.modal` class. The global modal styling applied its own `slide-in` keyframe animation to the same panel that was meant to use the dedicated transform/opacity transition.
- The global keyframe animation competed with the drawer transition, so the intended transition was not reliably observable.
- A later `display:flex !important` override also defeated the native `hidden` attribute, allowing the reader to remain technically visible after closing.

## Changes implemented

### Curated, topic-led highlighting
- Replaced the broad reader-wide scan with an explicit curated topic map for the English and Chinese lesson topics.
- Highlight targets are limited to:
  - explanation paragraphs;
  - examples in context;
  - the sentence-breakdown sentence;
  - the actual term tokens in the sentence-breakdown parts.
- Titles, headings, summaries/descriptions, key-point descriptions, questions, answer choices and answers are not highlight targets.
- Removed subject/verb/object/adverbial role emphasis. Existing role marks are neutralised without flattening their bilingual child markup.
- Highlighted terms remain bold white. If a lesson has no clearly useful topic term, it receives no highlight; the basic-sentence lesson is intentionally not highlighted merely to mark subject/verb/object labels.
- The observer now rebinds if the lesson reader root is replaced.
- Added browser checks for the article lesson (`a`, `an`, `the`), countable/uncountable nouns, the Chinese pronoun/`是` lesson, allowed highlight locations, excluded headings/questions/answers, and preservation of pinyin in sentence breakdowns.

### Daily Activities review and language resolution
- Daily Learning content pools now follow `snapshot.learningLanguage`, the language associated with the loaded Daily Learning data, rather than the possibly out-of-sync page selector.
- Completed sessions continue to resolve from their saved content IDs and source IDs.
- Review mode opens saved completed content without starting a new session or consuming another allowance.
- Added a browser regression that deliberately leaves the visible course selector on English while the saved session data is Simplified Chinese, then checks completed:
  - Daily Topic;
  - Daily Application;
  - Daily Discovery;
  - Daily Revision.
- The regression verifies that each card says “Review completed content”, opens the saved content, displays the completed state, and makes no new `start_daily_activity_session` call.

### Drawer motion and visibility
- Removed the competing legacy drawer keyframe rules and explicitly disabled the global `.modal` keyframe animation on the Daily Learning panel with `animation:none !important`.
- The dedicated transform/opacity transition is now the only normal-motion animation path: slide in on open and slide out on close.
- The panel's initial off-canvas layout is forced before the open class is applied, so the browser has a real starting state to transition from.
- Removed the base `display:flex !important` rule that overrode the reader's `hidden` attribute. The reader now hides correctly after the close transition.
- Users who request reduced motion receive a brief opacity fade rather than a sliding panel; this preserves the accessibility preference while still providing visible state feedback.
- Chromium coverage explicitly emulates normal motion and verifies the panel's transform transition on opening and closing. The final browser diagnostics observed both transform and opacity transitions running.

## Validation

Latest implementation head: `efd4a1a0f06d29f0a0d5a894d4c96761324c1220`.

All required GitHub Actions checks passed:
- U2.7.0 Chinese dictionary static/Chromium checks.
- PostgreSQL 17 U2.7.0 lesson-start allowance regression.
- 2.3.x local Supabase Auth compatibility, PostgreSQL migration/allowance tests and Chromium browser regressions.
- 2.5.0 Flashcards Chromium and database checks.
- 2.6.0 PostgreSQL ACL drift regression.
- Quiz database foundation, local Supabase Auth/RPC integration and authenticated Chromium tests.
- Cloudflare build-routing guard.

Cloudflare Pages explicitly reported **Deploy successful** for commit `efd4a1a`:
- Commit-specific preview: https://caf353ae.swiftdictionary.pages.dev
- Branch preview: https://feature-update-2-7-0-chinese.swiftdictionary.pages.dev

The separate Cloudflare Workers Builds check for the retired `swiftdictionary-testing` Worker is not the Pages deployment and does not invalidate the successful Pages preview.

## Legal, privacy and production boundary

- This round is a UI, content-resolution and accessibility fix. It introduces no new personal-data category, external recipient, third-party processor or Supabase schema/migration change.
- The first-start allowance migration from the previous feedback round remains applied to Singapore staging only.
- Malaysia PDPA and general legal/privacy review remain outstanding and are not represented as completed by this round.
- No changes were made to `main`; no production migration or deployment was performed.
- PR #14 remains draft/open/unmerged. Owner acceptance is still required before any merge or production release.

## Owner acceptance checks

1. Open and close the Daily Learning drawer in a normal-motion browser and confirm the panel slides in and out. If the device requests reduced motion, expect the short fade instead.
2. Complete and reopen Daily Topic, Daily Application, Daily Discovery and Daily Revision in both English and Chinese; confirm the saved content remains reviewable and no additional allowance is consumed.
3. Switch courses and revisit completed content to confirm the saved session language controls the content catalogue.
4. Review article, countable/uncountable and Chinese `是)-sentence lessons. Confirm highlights are bold white and appear only in explanations, sentence breakdowns and examples in context.
5. Confirm titles, headings, descriptions, questions, answer choices and answers remain unhighlighted. Confirm lessons without a clear focal term are left unhighlighted.
6. Confirm Chinese sentence-breakdown pinyin remains visible after role-mark neutralisation.
