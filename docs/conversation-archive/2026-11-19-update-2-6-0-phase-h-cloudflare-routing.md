# Update 2.6.0 — Phase H: Cloudflare Pages identification and safe backend routing

**Date:** 19 November 2026  
**Cloudflare Pages project:** `swiftdictionary`  
**Implementation branch:** `feature/update-2-6-0-legal-privacy-security`  
**Documentation branch:** `docs/master-development-record`

## Owner-provided project identification

The owner supplied the Cloudflare dashboard URL for the Pages project. The project slug is confirmed as `swiftdictionary`. The dashboard itself has not yet been accessed through a connected Cloudflare/browser integration, so its current production branch, preview branch rules, build command/output directory and environment variables remain unverified.

## Safe deployment design

The existing tracked `supabase-config.js` contains the Tokyo production Supabase URL. That is a safe baseline for the live `main` deployment, but it must not be reused by preview deployments.

A build-time routing script was added on the 2.6.0 implementation branch:

- `build.sh` reads Cloudflare Pages' `CF_PAGES` and `CF_PAGES_BRANCH`.
- `main` is pinned to the known Tokyo production Supabase URL.
- Every non-`main` branch is pinned to the known Singapore staging Supabase URL.
- Both environments require `SWIFT_SUPABASE_URL` and `SWIFT_SUPABASE_PUBLISHABLE_KEY` to be set in their corresponding Cloudflare Pages environment.
- The script rejects missing environment values, missing branch identity, a URL that does not match the expected project for that branch, and a key that is not in the modern `sb_publishable_` format.
- The generated `supabase-config.js` is written only in the Pages build workspace. The tracked local config is unchanged by local runs of the script.
- This fails closed if production and preview environment variables are accidentally swapped.

Cloudflare's documented `CF_PAGES_BRANCH` variable and environment-specific build variables support this approach. Production and Preview environment values must be set separately in the Pages project.

## Automated validation

Added:
- `tests/cloudflare-build-routing.sh`
- `.github/workflows/cloudflare-build-routing.yml`

The shell test covers local-config preservation, staging routing on preview branches, production routing on `main`, rejection of cross-environment URLs, rejection of invalid keys, missing branch identity and missing configuration.

Local shell validation passed. GitHub Actions run **#44518836358** (workflow `Cloudflare build routing guard`) completed successfully; its `cloudflare-build-routing` job passed.

Implementation commits:
- `b6d6f697e9bdceb0bcb443a0ece6d8f8caf42246` — build-time routing script.
- `91dcb80a090de67d5eacd115904af5f0999d2993` — shell tests.
- `2544083fe67773512f528f2ec941b16d13cf55c8` — CI workflow.

## Remaining Cloudflare dashboard work

The following must be verified/configured in the `swiftdictionary` Pages project before a live preview can be tested:

1. Confirm `main` is the Production branch.
2. Enable preview deployments for `feature/update-2-6-0-legal-privacy-security` (or all non-production branches).
3. Set the build command to `bash build.sh` and output directory to `.` (the project is a static root-level site; verify the current root directory before saving).
4. In the **Production** build environment, set `SWIFT_SUPABASE_URL` to the Tokyo production project URL and `SWIFT_SUPABASE_PUBLISHABLE_KEY` to that project's publishable key.
5. In the **Preview** build environment, set `SWIFT_SUPABASE_URL` to the Singapore staging project URL and `SWIFT_SUPABASE_PUBLISHABLE_KEY` to that project's publishable key.
6. Confirm the build output contains the expected project URL without exposing a service-role key. Never add a service-role key to Pages environment variables used by client-side static builds.
7. Add the exact preview hostname to the staging Supabase Auth Redirect URLs allowlist, while keeping the production Site URL on the production domain.
8. Add the staging Supabase Auth callback URI to the Google OAuth client's authorized redirect URIs. Verify the production callback remains unchanged.

The Cloudflare dashboard has not yet been accessed or modified. A browser-capable Cloudflare session is needed to verify and save these settings. No production build or deployment was triggered by these commits because they were pushed only to the feature branch.

## Safety and legal notes

The build-time Supabase URL and publishable key are public client configuration, not secrets. The service-role key must never be used in this script. Preview traffic will still generate provider-side IP/device/log metadata, so the staging test remains a real processing event and should use only a controlled mock/test account, not friends or real learner accounts.

Production database, Auth settings, custom domains and deployed site remain untouched.
