# Update 2.6.0 — Account-deletion success toast and allowance notification verification (2026-11-20)

## Owner feedback
The owner tested account deletion on the Singapore staging preview and confirmed that deletion now works and signs the browser out. The owner noted that no success notification appeared. They also requested a short five-second popup when the daily allowance is exhausted for Lessons, Quiz and Flashcards, and authorised the remaining work.

## Account-deletion success notification
The feature branch already reported success through the shared toast helper, with a fallback element. The owner’s test showed that this feedback was not reliably visible after sign-out. The likely lifecycle issue was that the toast was inserted before dispatching the account-deleted event; sign-out listeners can refresh the page shell synchronously.

Changed `account-deletion.js` so it:
- Writes the success status text as before.
- Dispatches the `swift-account-deleted` event first.
- Schedules a dedicated accessible success toast after event listeners finish, rather than relying on the shared learning-allowance toast node.
- Gives the toast `role=status`, `aria-live=polite`, a high stacking order and a five-second lifetime.

The message continues to distinguish whether signed-out local saved words on this device were cleared or preserved. No deletion backend, database, or data-retention behaviour was changed.

## Daily allowance notifications
A source and test audit found the requested five-second allowance notifications already implemented on this feature branch:
- Lessons: after a successful `complete_permanent_lesson` call, check the server-backed remaining lesson allowance and show the warning toast when it reaches zero.
- Quiz: after a successful `submit_my_quiz` call, check `get_my_quiz_availability` and show the warning toast when no Quiz completions remain.
- Flashcards: after a successful `complete_my_flashcard_game` call and allowance refresh, show the warning toast when no Flashcards games remain.

The shared notification supports English and Simplified Chinese, uses the configured allowance timezone for reset wording, and is five seconds long. Failed RPCs do not trigger the Lessons/Quiz warning. Existing browser regression tests cover the permanent Lessons, Quiz and Flashcards exhaustion cases; the Flashcards browser test also verifies that the toast hides after approximately five seconds.

## Changes and validation
- Feature branch: `feature/update-2-6-0-legal-privacy-security`.
- Account-deletion toast implementation commit: `3d73e488855ebba0b409fd62459ecdc2c04eac80`.
- Toast-handler block correction commit: `71e78055033e3f1bfc912b84502ac8bd0ca9d0f8`.
- Static regression assertion commit: `6d2c73e8ca2fd1553285e04f67f4af513518e31b`.
- Final recorded feature branch head: `6d2c73e8ca2fd1553285e04f67f4af513518e31b`.
- Cloudflare build-routing guard run `44722035154` passed, including JavaScript syntax, account-deletion safeguards, allowance notification static checks and environment routing.
- Quiz database foundation workflow passed. Its companion Local Supabase Auth/RPC/Chromium job was still running authenticated browser tests at the time of this archive; no failure was reported in the visible job state.
- The build script refreshes the account-deletion asset to `v=2.6.0-r5`, Daily Learning to `v=2.6.0-r4`, and Flashcards to `v=2.6.0-r4` for Cloudflare Pages builds.
- The user’s manual staging test confirms account deletion and sign-out. The updated success-toast rendering has not yet been manually re-tested by the owner.
- No production deployment or Tokyo production change was made. Singapore staging Edge Function remains version 3; no backend deployment was required for this UI-only correction.

## Safety and legal boundary
No new data collection, tracking, third-party processor, schema, migration, retention rule or provider permission was introduced. Production remains untouched. Malaysia PDPA applicability, controller identity, 16–17-year-old safeguards, international-transfer review, provider contracts, DPIA and legal approval remain open release gates. No merge or production deployment is authorised by this archive.
