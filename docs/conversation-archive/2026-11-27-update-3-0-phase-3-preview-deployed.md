# SwiftDictionary U3.0 Phase 3 — Preview deployment confirmed

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Staging Supabase:** `ivatvkfrtifgfheeaelj`  
**Production:** untouched

## Preview URLs

Cloudflare Pages confirmed successful deployment of application commit `253ee8052a290676f6313e66f880ac543d924457`.

- Stable branch preview: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev
- Commit-specific preview: https://fc13805c.swiftdictionary.pages.dev
- Draft PR #20: https://github.com/WhiteWingCat/swiftdictionary/pull/20

PR #20 is draft and unmerged. It must not be merged without separate production-release authorization. A later documentation-only update was committed to the feature branch after this successful deployment; the stable branch alias is intended to follow that latest branch build.

## Database state

The owner-approved Phase 3 Malay-only migrations and seed were applied to the dedicated staging project only:

- `u3_phase3_malay_enablement`
- `u3_phase3_malay_catalog_seed`
- `u3_phase3_malay_catalog_metadata_fix`

Verified catalogue: 285 unique active rows — 72 permanent lessons, 60 Daily Topics, 60 Daily Applications, 93 Daily Discovery. Topic/Application each have 20 per difficulty; Discovery uses 93 unique rotation slots 1–93. No application references a missing Topic identity. Existing user-owned row counts remained unchanged.

## CI status at preview deployment

- U3.0 architecture/content regression passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45943073178
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45943073157
- U2.3, U2.5, U2.6, U2.7, U2.9 and Quiz database foundation regressions were still running at the time of this archive. The U2.7 and U2.3 legacy tests were updated to read U3.0 language-owned content packages; final outcomes were not yet known.
- The staging preview is a deploy confirmation, not a substitute for owner browser/device acceptance.

## Outstanding preview requirements

1. Verify the current stable branch alias after the latest documentation-only feature-branch commit has finished deploying.
2. Configure/verify staging-only Google OAuth. Do not reuse production OAuth secrets in staging.
3. Test dictionary, Malay Lessons, Daily Topic, Daily Application, Daily Discovery and adaptive Daily Revision in desktop and mobile browsers.
4. Verify signed-in progress, account isolation and allowance/timezone behavior after OAuth is ready.
5. Owner performs Malaysian Standard Malay and independent translation review.
6. Mark Phase 3 exit complete only after these acceptance gates pass.

## Security and privacy

Supabase advisors reported pre-existing private-schema RLS informational notices, disabled leaked-password protection and unused-index notices. No unrelated settings or policies were changed. No new personal-data fields or tracking were introduced. All production systems remain unchanged.


## Latest preview refresh

The feature branch documentation refresh generated a second successful Cloudflare Pages deployment. The current branch head is `376db5f0c495c281124335556b8633096d8902c9`.

- Stable branch preview: https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev
- Latest commit preview: https://ec791600.swiftdictionary.pages.dev
- U3.0 architecture/content regression passed on this branch head; full cross-version CI and browser checks remain in progress.
