# Update 2.6.0 — Owner feedback: deletion clarity and signed-out Flashcards banner (20 November 2026)

## Owner feedback

The owner reported three staging-preview UI issues:

1. Preferences displayed **Delete Learning History** where the account-deletion action was expected, creating ambiguity about whether the account itself would be deleted.
2. Selecting the learning-history action opened a browser-native confirmation prompt rather than an in-site dialog. The browser prompt could not display the optional local saved-word checkbox used by the separate account-deletion flow.
3. The Flashcards banner/title was missing for signed-out visitors.

## Implementation

Application changes were made only on `feature/update-2-6-0-legal-privacy-security`; no merge or production deployment occurred.

- `account-deletion.js`: changed the account-deletion heading/button to **Delete Account**; placed its card immediately before the **Learning history** card; expanded the description to distinguish permanent account closure from learning-history-only deletion.
- `index.html`: renamed the existing history section heading to **Learning history** and clarified that it preserves the SwiftDictionary account, saved words, collections, custom cards, profile and preferences. Replaced the native `window.confirm()` prompt with an accessible in-site confirmation dialog that explains the exact scope and distinguishes it from account deletion. The history-deletion action still calls the existing `delete_my_learning_history` RPC; it does not clear local saved words.
- `flashcards.js`: signed-out visitors now receive the same Flashcards banner/title and explanatory copy as signed-in visitors, followed by the sign-in prompt. The existing help control is mounted into the banner in the signed-out state too.
- `tests/update-2-6-0/account-deletion-static.test.mjs`: added regression assertions for the distinct account/history controls, in-site history dialog, absence of the native browser confirmation and signed-out Flashcards banner.

The optional local saved-word checkbox remains part of the **Delete Account** dialog only. Per the prior owner-approved design, it is unchecked by default and shown only if signed-out local saved words exist in the current browser. It clears only the dedicated anonymous saved-word collection, never another account or unrelated browser storage. Deleting learning history does not clear these local words.

## Source-control state

- Active implementation branch: `feature/update-2-6-0-legal-privacy-security`.
- Latest commit authored for this feedback: `85965e1f70335b3ac85292d165bbe0584494f181`.
- Files changed: `account-deletion.js`, `index.html`, `flashcards.js`, `tests/update-2-6-0/account-deletion-static.test.mjs`.
- No PR was opened or merged for this feedback. No deployment was initiated.
- GitHub Actions workflow is configured to run on pushes to this feature branch. The available workflow-run retrieval did not expose push-triggered run results in this session, so the new regression tests and JavaScript syntax checks are **not yet reported as passing**. A local repository clone could not be obtained in this environment because GitHub hostname resolution was unavailable. Verify the branch's Actions run before handing the preview back to the owner.

## Safety, privacy and legal scope

These are clarity, confirmation-interface and signed-out rendering fixes to already approved Update 2.6.0 account deletion and Update 2.5.0 Flashcards functionality. No new personal-data category, processor, analytics event, retention rule, database schema or permission is introduced. The account-deletion server-side safeguards and staging-only Edge Function remain unchanged. No account was deleted; no production or staging database operation, migration, provider setting change or production deployment was performed.

Continue the standing Malaysia PDPA and international privacy/legal review for Update 2.6.0. The existing legal approval, retention, DPIA, provider verification and synthetic staging end-to-end gates remain open.

## Recovery point and next steps

1. Check the latest feature-branch head and GitHub Actions run.
2. If checks pass, deploy/verify the Cloudflare staging preview and test Preferences as a signed-in synthetic account: confirm **Delete Account** appears before **Learning history**, the account dialog contains the optional checkbox only when anonymous local words exist, and the checkbox is unchecked by default.
3. Test learning-history deletion separately with synthetic staging data; verify the in-site prompt, Cancel path, RPC success/error paths and unchanged account/saved words/local anonymous words.
4. Test signed-out Flashcards on desktop and mobile, including banner/title, help control and sign-in action.
5. Do not merge, apply production changes or deploy production without explicit owner approval and completion of the existing 2.6.0 gates.
