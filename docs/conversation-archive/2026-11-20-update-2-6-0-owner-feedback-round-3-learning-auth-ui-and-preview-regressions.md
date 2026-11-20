# Update 2.6.0 — owner feedback round 3: learning auth UI and preview regressions

Date: 2026-11-20

## Owner feedback

The owner reported that the previous round's fixes still appeared absent in the latest preview, then requested:

1. Hide the Lessons learning interface while signed out and show a sign-in interface, matching the access model already used by Quiz and Flashcards.
2. Make the Lessons and Quiz sign-in interfaces consistent with the Flashcards sign-in design.
3. Restore the Flashcards banner and titles immediately when signing out.

The earlier feedback in the preceding round remains in scope: first-click Google sign-in, a visible and distinct Delete Account control, an in-site Learning History confirmation, and a Terms & Conditions footer link.

## Implementation on the feature branch

All changes remain on `feature/update-2-6-0-legal-privacy-security`; no pull request, merge or production deployment was made.

- `index.html` now contains a static **Delete Account** card in Preferences before the separate Learning history card. This avoids depending on the account-deletion module to create the visible control.
- `account-deletion.js` now enhances an existing static card rather than returning early merely because the card already exists. It still creates and binds the account-deletion dialog. The account-deletion script URL is cache-busted as `account-deletion.js?v=2.6.0-r3`.
- The Learning History handler continues to use the website's in-site confirmation dialog; it does not call browser-native `confirm()`. A real browser regression test now checks that clicking the action opens the in-site dialog and does not raise a native browser dialog.
- The Terms & Conditions footer link remains present and the browser regression test checks it. The linked page is still a non-binding publication placeholder; the internal legal draft has not been published and no Terms acceptance is collected.
- Lessons now has a dedicated signed-out sign-in card. Daily Learning, lesson difficulty tabs, lesson library and lesson detail content are hidden while signed out. Lesson initialisation is skipped without a signed-in account; opening a lesson detail route while signed out returns to the Lessons landing page. The sign-in button opens the same account sign-in interface used elsewhere.
- Quiz's signed-out card and Lessons' signed-out card share the same `learning-auth-card` / `learning-auth-button` styling used by Flashcards. The three learning pages now present a consistent sign-in action.
- `flashcards.js` now listens directly for Supabase `SIGNED_OUT` as well as the app-level auth-updated event. It clears the in-memory signed-in Flashcards data and immediately re-renders the signed-out banner/title and sign-in card even if a later profile refresh fails. Its script URL is cache-busted as `flashcards.js?v=2.6.0-r3`.
- Cache-busting was increased to revision r3 after changing auth-sensitive scripts, so the preview does not continue requesting the previous JavaScript URL.

## Regression coverage

- Extended `tests/update-2-6-0/account-deletion-static.test.mjs` to assert the Lessons gate, shared sign-in styling, static Delete Account placement, direct Flashcards sign-out handling and fresh script URLs.
- Extended `tests/browser/update-2-4-0-quiz-runtime.spec.js` with browser checks for signed-out Lessons and Quiz.
- Extended `tests/browser/update-2-5-0-flashcards.spec.js` with browser checks for Flashcards banner restoration after sign-out and the Preferences deletion controls / in-site Learning History confirmation / Terms link.
- Added a targeted Flashcards-and-Preferences browser-test step to `.github/workflows/quiz-db-foundation.yml`.

## Commits and validation

- Implementation commit: `2ea1ef3a05ceaa8decc53f50116613272b53bdbd`.
- Browser regression additions: `7ca090707b59b568bfda18dc5c4ad9bf1e954c51`.
- Static-test assertion correction: `cbaa404a6d5728bdff9bf9e819a952c2c8ad8399`.
- Cache-busting and targeted browser-test workflow commit: `52aa7a0b74a74f36c619c7e607fb501798dc7aa1`.
- Cloudflare build-routing guard run `44692571488` passed, including JavaScript syntax/account-deletion safeguards, Deno checks and environment-routing checks.
- The Quiz database foundation job passed. The companion local Supabase/Auth/Chromium job was still running at the time of this archive update; authenticated Quiz browser runtime tests were in progress and the targeted Flashcards/Preferences browser tests were pending. Do not mark the full browser workflow passed until its final result is checked.
- Cloudflare Pages deployment for commit `52aa7a0` succeeded on the `swiftdictionary` Pages project. Immutable deployment preview: https://ab8b4065.swiftdictionary.pages.dev . Branch preview alias: https://feature-update-2-6-0-legal-p.swiftdictionary.pages.dev .

## Legal, privacy and release boundary

The Lessons sign-in gate is an access/UI change using the existing account and progress model. No new data category, analytics, tracking, processor, schema, migration, retention rule or provider permission was introduced. The Terms page remains a non-binding placeholder until the existing Malaysia-first legal review and owner approval are complete. Outstanding PDPA applicability, controller identity, age 16–17, international-transfer, contact-route, retention, licensing and other legal decisions remain open.

All work is feature-branch and preview-only. No production account, schema, data, provider configuration or deployment was changed. No account was deleted. Destructive validation must use synthetic accounts. Do not merge or deploy production without explicit owner approval and completion of the existing Update 2.6.0 legal/security gates.
