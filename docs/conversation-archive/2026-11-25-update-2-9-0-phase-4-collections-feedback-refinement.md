# SwiftDictionary Update 2.9.0 — Phase 4 Your Collections feedback refinement

**Date:** 2026-11-25  
**Owner request:** Refine Your Collections after the first staging review, then verify the implementation before issuing a refreshed staging preview.

## Owner feedback

1. Dim the overly bright New folder button.
2. Replace the separate folder-opening modal with inline expand/collapse folders, matching Dashboard Favorite words. Selecting a word in an expanded folder must open the existing dictionary detail panel.
3. Add a right-side `…` custom menu on each folder with Add words, Rename and Remove.
4. Add an Add to collection action beside the Favorite save button in the shared detail panel. It appears only for saved words and lets the user assign the word to a folder.
5. Unsaving a word must remove it from all collection folders.
6. Use custom in-site menus/dialogs, not browser-native prompts or dropdowns; add subtle shadows where appropriate.
7. Set the Your Collections description to: “Customize and organize any saved words to your preferences.”

## Implementation

- Work is on `feature/u2-9-0-collections-feedback`, tracked by PR #18: https://github.com/WhiteWingCat/swiftdictionary/pull/18. PR #17 was closed without merging and superseded by PR #18.
- The New folder action uses a dimmer accent. Relevant controls and custom menu surfaces have restrained shadows.
- Folders expand inline and display English and Simplified Chinese saved-word cards. Clicking a word dispatches into the existing shared dictionary detail drawer.
- The right-side custom menu provides Add words, Rename and Remove. Add words selects from the signed-in user's saved words. Rename and Remove use custom in-site dialogs.
- The shared detail drawer has an Add to collection button immediately beside Favorite. It is hidden when the word is not saved. Its custom dialog allows selection across one or more folders.
- Existing `favorite_collection_items.saved_word_id` FK was verified as `ON DELETE CASCADE`; no schema migration was needed. Unsaving a word deletes the saved_words row, which cascades its membership rows.
- Private Realtime channels are now removed on sign-out as well as account switching. Per-folder request sequence guards prevent stale asynchronous folder reads from overwriting newer collapse/reopen states or crossing account boundaries.
- Updated description is exact.

## QA and verification

- Browser regression suite on commit `25f10b2dfc28837e6fc799cff44b1b0c8215c763`: 79 passed, 22 skipped. All three Your Collections tests passed:
  - Inline expansion, custom folder menu, mixed-language content, opening shared word detail, folder-level membership changes, detail-panel assignment, saved-word deletion cascade and visual checks.
  - Account isolation, private Realtime channel replacement and sign-out channel cleanup.
  - Dictionary detail panel Add to collection visibility and assignment through the real UI event.
- The suite also verifies stale folder-load responses cannot repaint after a rapid collapse/reopen sequence.
- The staging SQL regression was expanded to delete a saved word inside a rollback transaction and assert that its memberships are removed. It passed against isolated staging.
- GitHub Actions checks passed for Cloudflare Pages, build routing, English dictionary validation, PostgreSQL migration/ACL/allowance regressions, Chinese dictionary checks, Flashcards and local Supabase authenticated integration.
- Chromium smoke job reported 79 passed and 22 skipped.
- A separate Cloudflare Workers Builds check for `swiftdictionary-testing` failed. It is separate from Cloudflare Pages, which deployed successfully; retain as a separate infrastructure issue before final release sign-off.
- Supabase health advisor: no findings. Security advisor: no new collections-specific finding; pre-existing 10 private-schema informational RLS notices and one leaked-password-protection warning remain.
- Staging row counts after the rollback SQL regression: saved_words 14, favorite_collections 1, favorite_collection_items 3. These represent the owner's existing staging test data and were preserved.

## Staging preview and release boundary

- Refreshed Cloudflare Pages preview for commit `25f10b2dfc28837e6fc799cff44b1b0c8215c763`:
  - Branch URL: https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev
  - Deployment-specific URL: https://c780307d.swiftdictionary.pages.dev
- The existing build routing guard uses the isolated staging Supabase project. No production database, `main` branch or live website was modified or deployed.
- This is an interim Phase 4 re-review. Phase 4 awaits owner acceptance of the revised preview. Phase 5 (visual-only Premium interface/navigation), Phase 6 (optional aligned English Lessons/Quiz/Flashcards expansion) and final full QA/release preparation remain open.
- Unlimited free dictionary word-grid search and existing daily learning allowances remain unchanged. No 16/40 folder cap, subscription, payment or entitlement enforcement was activated.
- Legal/privacy: no new personal-data category or third-party processor was introduced. Malaysia PDPA and general international privacy review remain pre-publication requirements for existing account-linked collection names and saved-word references.
