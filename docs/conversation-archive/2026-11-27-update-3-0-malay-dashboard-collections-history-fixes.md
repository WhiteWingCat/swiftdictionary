# SwiftDictionary U3.0 — Malay translation and Dashboard follow-up

**Date:** 2026-11-27  
**Application branch:** `feature/update-3.0-phase-0-audit`  
**Documentation branch:** `docs/master-development-record`  
**Staging project:** `ivatvkfrtifgfheeaelj`  
**Production:** untouched

## Owner request

Finish remaining translation work and fix:
1. Missing Malay section in Dashboard Favorite Words.
2. Malay saved-word clicks in Your Collections not responding.
3. Incorrect Malay activity naming/content in Daily History.

The owner also confirmed that Malay must be an available support language for English and Simplified Chinese courses, while the Malay course must retain English and Simplified Chinese support-language behaviour.

## Code changes

- Dashboard Favorite Words now renders Malay and resolves entries from the language package.
- Your Collections uses the package-backed dictionary lookup for Malay saved-word cards; the add-word picker copy includes Malay.
- Daily History now has separate Lessons and Daily Learning groups and explicit activity names for all four Daily Learning types. Malay titles and language labels are resolved from Malay content.
- Translation and Profile preference selectors include Malay.
- The shared dictionary package adapter maps Malay sense translations and registers Malay as a target language when text is present.
- Missing Dictionary meanings now show an explicit unavailable message rather than silently showing the source-language text.

Application commits: `1d17c2d4`, `0c27d5da`, `8372a3c2`, `ca6b0840`, `b70f617b`.

## Translation status

The user-facing selector and translation routing are integrated, but the complete Dictionary translation corpus is not finished. Coverage still requires 2,756 meaning-level Malay translations: 1,931 English senses and 825 Simplified Chinese senses. The Malay Dictionary also has incomplete English/Chinese support-language coverage. The selector being visible must not be confused with full coverage; missing meanings are explicitly identified. All newly authored machine-assisted translations remain drafts pending owner review.

## Automated verification

On `ca6b084079ac05d8d7abe2068e2593e51c057dbc`:
- U3.0 architecture/content regression passed.
- Cloudflare build-routing guard passed.
- English dictionary QA passed.
- Chinese dictionary filter checks passed.
- U2.3 allowance/dashboard browser regression was still in progress.
- U2.6 ACL static and disposable PostgreSQL checks passed; final workflow status was still completing.
- Some unrelated Quiz/Flashcards browser jobs were cancelled by workflow concurrency; no full cross-version browser acceptance is claimed.

The last text-only fallback commit `b70f617b48c46021d2e3f44c27b6bde75151f51d` had not yet received a separate CI run.

## Preview and safety

The existing stable branch preview alias is https://feature-update-3-0-phase-0-a.swiftdictionary.pages.dev. It was deployed earlier, but latest-commit publication was not independently confirmed. Draft PR #20 remains open and unmerged: https://github.com/WhiteWingCat/swiftdictionary/pull/20.

Staging OAuth and owner desktop/mobile acceptance remain outstanding. This is not final Phase 3 exit or a final preview handoff. Production hosting, production Supabase, production credentials and production data remain untouched. Do not merge PR #20 or deploy production without separate approval.
