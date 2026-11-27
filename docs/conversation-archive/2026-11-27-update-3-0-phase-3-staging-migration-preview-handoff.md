# SwiftDictionary U3.0 Phase 3 — Staging migration and preview handoff

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Staging project:** SwiftDictionary Indie Staging (`ivatvkfrtifgfheeaelj`)  
**Production:** untouched

## Owner approval

The owner explicitly approved:

> Apply the reviewed Phase 3 Malay-only migration and seed the 72 lessons, 60 Daily Topics, 60 Daily Applications and 93 Daily Discovery catalogue records to the dedicated staging project only. Do not modify production.

## Applied changes

Three staging migrations were applied successfully:

1. `u3_phase3_malay_enablement` — added active Malay registry row, extended language checks, and updated lesson start/completion/replay functions to accept registered active languages.
2. `u3_phase3_malay_catalog_seed` — seeded 285 active Malay catalogue identities.
3. `u3_phase3_malay_catalog_metadata_fix` — corrected Daily Topic difficulty balance and Daily Application topic references.

All DDL and DML targeted project `ivatvkfrtifgfheeaelj` only.

## Verified staging inventory

| Activity | Count | Difficulty distribution |
|---|---:|---|
| Permanent Lessons | 72 | 24 / 24 / 24 |
| Daily Topic | 60 | 20 / 20 / 20 |
| Daily Application | 60 | 20 / 20 / 20 |
| Daily Discovery | 93 | Rotation 1–93 |
| **Total fixed catalogue** | **285** | |
| Daily Revision | Adaptive | No fixed catalogue |

Additional checks:
- 93 unique Discovery identities and 93 distinct active rotation slots.
- No Daily Application catalogue row references a missing active Daily Topic identity.
- Active `ms` language registry row present.
- All five language constraints now include `ms`.
- Lesson start guard remains SECURITY DEFINER, empty search_path, auth.uid ownership-checked, and catalogue-gated.
- Permanent lesson completion remains SECURITY INVOKER as before, with auth.uid ownership, input validation, approved-catalogue check, per-user advisory lock and row lock.
- Existing row counts remained unchanged: lesson progress 15; saved words 21; lesson practice summaries 6; daily activity sessions 12; activity log 25.
- No Quiz or Flashcard schema/content was changed.

## CI and preview handoff

- U3.0 architecture/content regression passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45942421726
- Cloudflare build-routing guard passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45942421739
- The broader Quiz database foundation integration workflow was still running at the time of this archive.
- Draft PR #20 was opened to request an isolated Cloudflare Pages preview: https://github.com/WhiteWingCat/swiftdictionary/pull/20
- PR #20 is explicitly marked DO NOT MERGE. It has not been merged.
- The exact Cloudflare Pages preview URL has not yet been confirmed.
- Staging Google OAuth has not been verified. The separate staging OAuth client and redirect allowlist remain a prerequisite for sign-in.
- Browser/device acceptance has not been performed.

## Supabase advisor findings

Security advisor findings included informational RLS-enabled private-schema tables without client policies and a warning that leaked-password protection is disabled. Performance advisor findings were unused-index notices. No advisor settings, RLS policies or unrelated objects were changed in this Phase 3 migration.

## Legal, privacy and content status

No new tracking or personal-data fields were introduced. User-owned progress, daily sessions and saved words remain under existing account ownership/RLS controls. Staging content remains draft; the owner’s Malaysian Standard Malay and independent English/Simplified Chinese translation review is still reserved for staging review. Rights/provenance review remains outstanding before public activation.

## Remaining gates

1. Confirm Cloudflare Pages preview URL and verify the current branch commit is served.
2. Verify/configure staging-only Google OAuth.
3. Complete full database integration CI.
4. Perform desktop/mobile browser acceptance for dictionary, lessons, Daily Learning, persistence, account isolation and allowance/timezone behavior.
5. Owner reviews Malay and translation content on staging.
6. Mark Phase 3 exit complete only after all gates pass. Do not merge PR #20 or deploy production without separate authorization.
