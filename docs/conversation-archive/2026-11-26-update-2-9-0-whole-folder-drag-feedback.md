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
