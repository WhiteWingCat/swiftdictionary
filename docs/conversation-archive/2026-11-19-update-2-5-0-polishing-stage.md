# Update 2.5.0 Flashcards — polishing stage (2026-11-19)

## Scope and release boundary

The owner approved proceeding from the round-4 UI refinements into the Update 2.5.0 polishing stage and supplied two additional items:

1. Quiz and Flashcards introductions did not appear on first entry; update the Flashcards introduction because it contained removed or outdated information.
2. Add an **Answer now** control beside the game gauge to skip the remaining memory period. After an answer is submitted, change that control to **Next** so the next round can begin immediately.

The work was performed on `feature/update-2-5-0-flashcards`. PR #12 remains open and unmerged. Production `main`, production Supabase and staging Supabase were not changed.

## Changes implemented

### First-entry introductions and translations

- Hardened the learning-introduction preference load path so a failed preference lookup does not suppress the first-entry guide.
- The navigation callback now checks that the requested page is still active before showing an asynchronously loaded guide, preventing a delayed guide for a page the learner has already left.
- Added Simplified Chinese introductory copy for Quiz and Flashcards, selected using the current translation language.
- Rewrote the Flashcards introduction and help copy to remove references to the retired Translation Recall mode and removed personal-collection features.
- Corrected the challenge description to explain the current Word, Definition, Mixed and Sentence Recall modes, the 60/120-second challenge choices, the mode/difficulty-specific memory and answer windows, and the early-proceed controls.
- Updated the Flashcards page banner description in English and Simplified Chinese.

### Flash Recall controls and uniqueness

- Added an accessible **Answer now** button beside the memory/answer gauge. It ends the memory phase immediately and opens the answer phase.
- The button is hidden while the learner is selecting an answer. Once an answer is recorded (including an unanswered timeout), the button becomes **Next**.
- Clicking **Next** clears the feedback delay and starts the next memory round immediately. The existing short automatic transition remains as a fallback when the learner does not click.
- Changed within-challenge uniqueness tracking to use a normalized prompt key rather than the internal card ID. It normalizes Unicode, case and repeated whitespace, so dictionary/custom-card variants with the same visible prompt are treated as one question.
- The uniqueness set remains shared across the selected mode or Mixed Recall submodes for the whole challenge. Weak Memory/mastery identity remains based on the stable card key.

### Question bank and permanent lessons

- Expanded the English Flashcards/dictionary bank from **792 to 810 entries** with 18 everyday terms and phrases:
  - Greetings/polite expressions: thanks, excuse me, good morning, good afternoon, good evening, take care.
  - Places/getting around: station, market, library, hospital, restaurant, museum, entrance, exit, corner, bridge, ticket, platform.
- Each new entry includes an English definition, Simplified Chinese meaning, example sentence and an explicit permanent lesson ID.
- Added two permanent Beginner lessons:
  - `b-greetings-polite-expressions` — **Use greetings and polite expressions**
  - `b-places-getting-around` — **Name everyday places around town**
- Added Simplified Chinese titles, summaries, explanations, examples, common-mistake notes and practice prompts for both lessons.
- Both lessons use the existing approved **Everyday vocabulary** topic rather than introducing new topic IDs.
- Updated the content-catalogue migration draft with both permanent lesson IDs and adjusted catalogue assertions from 161 to 163 entries and from 15 to 17 permanent lessons. These are draft/test changes only; no migration was applied to staging or production.

## Content audit

- Parsed the complete English word bank: **810 entries and 810 unique normalized headwords**; no duplicate headwords found.
- All 810 entries have a definition, Simplified Chinese translation and at least one example sentence.
- All 18 new entries are explicitly linked to one of the two new permanent lessons.
- All 17 permanent lesson IDs have Simplified Chinese lesson content.
- New definitions, translations and examples were reviewed for common usage and consistency. This is a content review, not a claim that every legacy dictionary entry has undergone a fresh expert linguistic certification.

## Automated validation

- **SwiftDictionary Update 2.5.0 Flashcards checks — workflow #44491878289:** all jobs passed.
  - JavaScript syntax and page integration checks passed.
  - Mock account, allowance, collection and timer regression tests: **25/25 passed**.
  - Chromium Mock User Flashcards browser tests: **14/14 passed**, including first-entry Quiz/Flashcards guides, Answer now, Next, mixed-mode uniqueness, 60/120-second challenge behaviour, Chinese UI and existing round-4 refinements.
- **SwiftDictionary 2.3.x allowance and dashboard regression checks — workflow #44491878344:** all jobs passed, including the exact 163-entry approved content catalogue check, PostgreSQL migration/allowance assertions, local Supabase Auth compatibility, security advisor and signed-out browser regression smoke tests.
- **Quiz database foundation — workflow #44491878440:** the PostgreSQL Quiz foundation passed. The companion local Supabase Auth/Quiz runtime job was still running when this archive was first written; its final status is to be appended after completion.
- Cloudflare Pages testing preview successfully deployed the application changes at commit `173e753fc79cf84d25d1c24c860f52f5025f9eef`. Subsequent feature-branch commit `541c6d3e27f998dcc2d1209d2264d07b0bcdccee` only updated test harness coverage and did not change the deployed application code.
- Verified branch preview: https://feature-update-2-5-0-flashca.swiftdictionary-testing.pages.dev
- Mock User entry: https://feature-update-2-5-0-flashca.swiftdictionary-testing.pages.dev/?swiftMock=1

## Privacy and legal planning

- This work adds vocabulary and lesson content plus UI behaviour. It introduces no new personal-data category, third-party processor, analytics event, raw-answer telemetry, retention period or learning-history record.
- Existing account-scoped introduction preferences, Flashcards history and deletion controls are unchanged.
- The new lesson IDs are present in the frontend and the approved-catalogue migration draft, but that migration has not been applied to staging or production. Live completion of the new lessons therefore remains gated on explicit owner approval of the relevant migration.
- Continue the standing Malaysia PDPA and applicable international/16+ privacy review before wider public or commercial expansion. This work is not a legal compliance certification.

## Next gate

- The polishing implementation and automated Flashcards validation are complete. Owner should perform the final Mock User review on the verified testing preview.
- Do not merge PR #12, deploy production or apply staging/production migrations without explicit owner approval.
- Keep development documentation on `docs/master-development-record`; recovery branch remains `feature/update-2-5-0-flashcards`.
