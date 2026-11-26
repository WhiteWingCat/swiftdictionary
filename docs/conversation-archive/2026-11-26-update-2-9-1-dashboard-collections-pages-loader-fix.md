# 2026-11-26 — Update 2.9.1 Dashboard Collections Pages-loader fix

## Owner report
After U2.9.0 was merged and Live Supabase migrated, the owner checked the live website and found that all updated functionality appeared except "Your Collections" in Dashboard. The owner requested diagnosis, a fix, and immediate merge as Update 2.9.1.

## Diagnosis
- Live Supabase U2.9.0 migration was already complete; the feature's database tables, RLS policies, private Broadcast and RPCs were not the cause.
- The application module `favorite-collections.js` existed in the repository, and the U2.9.0 implementation had added a dynamic loader to `supabase-config.js`.
- Cloudflare Pages' `build.sh` intentionally overwrites `supabase-config.js` at build time with environment-specific URL and publishable key. This replacement discarded the dynamic Collections loader. Consequently, the production page did not request the module, and its Dashboard mount routine never ran.

## Code fix
- Added `<script src="favorite-collections.js?v=2.9.1"></script>` to `index.html` after the main application and account-deletion scripts. This explicit entrypoint is retained by Cloudflare Pages build transformations and runs after the application globals are declared.
- Removed the dynamic module loader from checked-in `supabase-config.js`; it is no longer responsible for loading a UI feature.
- Extended `tests/cloudflare-build-routing.sh` to check that:
  - the Collections asset exists;
  - the explicit script tag is present and ordered after the main app scripts;
  - the tag and asset survive preview and production build transformations;
  - the generated Supabase config is not expected to contain the Collections loader.
- This is a focused frontend/build integration patch. No changes to the collection module's business logic or Supabase migrations.

## PR and deployment
- PR #19: https://github.com/WhiteWingCat/swiftdictionary/pull/19
- Squash merge commit: `4ab30af1c9c1ef7eb2fe35cdf015755a5e87e16d`
- Feature head: `f684cbea0f110d99db40d4931d9792870f169e96`
- Cloudflare Pages preview deployment succeeded: https://d6bd7a26.swiftdictionary.pages.dev .
- Cloudflare build-routing regression passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45755214948 .
- U2.9.0 English dictionary/Collections browser QA passed: https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45755214893 .
- PostgreSQL migration/allowance, Chromium regression smoke, Supabase CLI compatibility, Chinese dictionary, ACL and U2.7 allowance checks passed.
- At archive creation time, the local Supabase Auth/RPC integration and Mock Flashcards browser test jobs remained in progress; record their eventual outcome after completion.
- Production Cloudflare Pages deployment succeeded for deployment `0959fe7d-e5da-4f81-b7ff-d0ba5f3d7835`: https://dash.cloudflare.com/?to=/4095c6f30d6c1e0454918d2f9726ff6a/pages/view/swiftdictionary/0959fe7d-e5da-4f81-b7ff-d0ba5f3d7835 .

## Supabase and user-data impact
- No U2.9.1 migration was needed. The existing Live Supabase U2.9.0 schema remains active and unchanged.
- No writes or changes to saved words, collections, membership rows, profiles, preferences, user entitlements, authentication, RLS or Realtime policies were performed.
- No billing, payment, checkout, subscription activation or entitlement mutation.
- Word-grid search remains free and unlimited; folder caps remain Free 16 / Premium 40.

## Cloudflare platform policy
Cloudflare Pages remains the only active build/deployment platform. The separate Cloudflare Workers Builds integration for `swiftdictionary-testing` remains retired and not in operation. Its failure status is obsolete and not a release blocker.

## Legal/privacy impact
This is a frontend build-loading fix only. It introduces no new personal-data category, processing purpose, processor, tracking, payment or entitlement processing. Previously documented Malaysia PDPA, cross-border safeguards, global 16+ obligations and Terms/Privacy publication review items remain; this is not legal advice or legal clearance.
