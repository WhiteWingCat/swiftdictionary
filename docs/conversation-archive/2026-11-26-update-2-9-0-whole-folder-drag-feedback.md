# SwiftDictionary Update 2.9.0 — whole-folder drag feedback — 2026-11-26

## Owner feedback

After testing the latest staging preview, the owner requested a more direct folder-reordering interaction:
- Hold the left mouse button on the folder itself and drag it to another position.
- If reliable, remove the separate drag icon and the up/down arrow controls.

## Implementation

Application branch: `feature/u2-9-0-collections-feedback`

- Replaced the small drag handle with pointer-based dragging from the folder heading.
- A movement threshold distinguishes a deliberate drag from a normal click, preserving click-to-expand/collapse.
- The upper/lower half of the target folder determines insertion before/after it; the existing reorder RPC persists the new account-owned order.
- Removed the visible drag handle and move-up/move-down arrow buttons.
- Retained keyboard accessibility: focus a folder heading and press `Alt + Arrow Up` or `Alt + Arrow Down`.
- Pointer listeners are delegated once at document level to avoid attaching a fresh global listener on every folder render.
- No schema, migration, RLS, entitlement, allowance, or personal-data changes were required.

## Browser validation

- Updated `tests/browser/u2-9-0-favorite-collections.spec.js` to verify whole-heading drag to the first and last positions, absence of old controls, and keyboard movement.
- U2.9.0 English dictionary QA passed on commit `3bf1dbb248346330c629de9c983201438a161191`, GitHub Actions run [45748313425](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45748313425). This workflow includes the complete U2.9.0 Playwright suite, including the new folder interaction coverage.
- Cloudflare Pages check and build-routing guard passed for this commit.
- At the time of this archive entry, remaining cross-version browser, Flashcards and local Supabase Auth/RPC checks were still in progress. The separate Cloudflare Workers Builds check failed again and remains distinct from the successful Pages deployment.

## Release boundary

- PR #18 remains open; no merge or production deployment.
- No production Supabase migration/write, Premium activation, entitlement mutation, or allowance change.
- Existing Free 16 / Premium 40 folder capacities remain unchanged.
- Legal/privacy review: the change reuses existing account-owned ordering metadata and existing owner-scoped RPC/RLS. No new personal-data category, purpose, processor or tracking was introduced. Existing Malaysia PDPA, cross-border transfer, global 16+ safeguards, content provenance and future Premium consumer/payment reviews remain open planning items, not legal clearance.

## Recovery point

- Application commit: `3bf1dbb248346330c629de9c983201438a161191`
- Branch: `feature/u2-9-0-collections-feedback`
- PR: [#18](https://github.com/WhiteWingCat/swiftdictionary/pull/18)
- U2.9.0 plan: `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`


## Final polish and validation closeout — 2026-11-26

Final application head: `55a1ff5c43487985f2d20618385d1cb7a27edf9b`.

### Additional polish completed

- Added Dashboard Favourite disclosures to the same animation/accessibility initializer as Profile disclosures. Because the Dashboard tab may be inserted after the initial page mount, the Collections module now detects later DOM insertions and initializes the new disclosures once. Reduced-motion and inert-state behaviour remain intact.
- Removed the duplicate unversioned module loader from `account-deletion.js`; the single versioned loader in `supabase-config.js` now uses `favorite-collections.js?v=2.9.0-p4-r4`.
- Updated the Flashcards browser test's mocked Supabase config to reproduce the real versioned Collections loader, so the regression suite tests the production script-loading sequence.
- Removed temporary lesson diagnostic logging.
- Modernized affected workflows to checkout v6, setup-node v7 and Supabase setup-cli v3 while retaining a fixed Supabase CLI v2.81.3.

### Final latest-head validation

- U2.9.0 English dictionary QA: run [45750692619](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45750692619) passed; **20/20** Playwright tests passed, including direct folder-heading drag, removal of old controls, keyboard reordering, account isolation, geometry and disclosure/reduced-motion tests.
- Dashboard/Flashcards/allowance regression: run [45750692621](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45750692621) passed; broad Chromium suite **87/87**. The Dashboard Favorite disclosure test now passes with the versioned module loaded through the mocked app-shell loader.
- Authenticated local Supabase Auth/RPC runs [45750692738](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45750692738) and [45750686934](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45750686934) both passed. They include real local Auth, all staged migrations through U2.9.0, explicit grants, Collections RLS/order/security assertions, authenticated Quiz RPC/session/allowance checks, authenticated Quiz browser runtime, signed-out Flashcards/Preferences, Lessons allowance notifications, Quiz draft import/release export and security advisors. Security advisor output: **No issues found**.
- Flashcards, Chinese dictionary/Lessons, PostgreSQL migration/allowance, U2.7 lesson-start allowance, U2.6 ACL drift and Cloudflare build-routing checks passed.
- The latest check matrix has **15 successful checks, zero pending, and one failed separate Cloudflare Workers Builds check**.
- Cloudflare Pages deployed successfully for the latest head: deployment preview https://a71ff936.swiftdictionary.pages.dev ; branch preview https://feature-u2-9-0-collections-f.swiftdictionary.pages.dev .
- The failed Worker check is for the separate `swiftdictionary-testing` service, not Cloudflare Pages. Its build log is at https://dash.cloudflare.com/4095c6f30d6c1e0454918d2f9726ff6a/workers/services/view/swiftdictionary-testing/production/builds/731fc543-13e2-4584-bc81-629a8953a14d . This failure has appeared on earlier commits; check whether it is configured as a required PR status before merging. Branch-protection settings could not be read during this pass.

### Merge and production boundary

- PR #18 remains open and unmerged. GitHub reports the head is mergeable, but the independent Worker check remains failed; the owner should confirm whether it blocks branch protection.
- No production deployment, merge, Supabase production migration/write, Premium activation, entitlement mutation or allowance change occurred.
- The 30 new Quiz questions remain draft-only; the 199-question approved release subset is unchanged.
- No new personal-data category, purpose, processor, tracking, schema field or entitlement change was introduced. Malaysia PDPA, cross-border transfer, global 16+ safeguards, publication of Terms/Privacy notices and future Premium consumer/payment review remain pre-publication planning items, not legal clearance.
