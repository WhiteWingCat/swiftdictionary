# Update 2.6.0 — Private feedback inbox proposal and staging verification

**Date:** 19 November 2026  
**Status:** Design and read-only verification; no feedback feature or Cloudflare deployment implemented.

## Feedback experience

The current `feedback.html` is a static GitHub-issue generator. It tells visitors that GitHub login is required, and its old GitHub Pages hostname/path detection fails on the Cloudflare Pages host, falling back to a generic GitHub Issues page.

Recommended direction:
- Public **Feedback & Suggestions** page allows anonymous submissions without GitHub or SwiftDictionary account.
- Store messages privately in Supabase, not public GitHub issues.
- Minimal fields: category, optional word/page, message, created timestamp, status. Do not collect name/account ID by default. Optional reply email only when the visitor wants a response.
- Owner-only **Feedback Inbox** in Profile, protected by a trusted server-managed `app_metadata` claim. Never use user-editable metadata, client-supplied user IDs or a hard-coded email as the authorization boundary.
- No ordinary-user SELECT on feedback records. Use a server-side Edge Function with validation, spam/rate limiting and a challenge such as Cloudflare Turnstile. Owner-only read/update/delete.
- Tell submitters who can see the message, what is collected, that feedback is private, and not to include sensitive details. Establish a retention and deletion/request process.

Private feedback collection is not inherently a personal-data violation. Free text and optional email can contain personal data, so the operator still needs purpose limitation, notice, security, retention and rights-handling, subject to legal applicability. The feature remains a proposal; no schema, function, or UI was created.

## Staging environment verification

- Existing Supabase project: **SwiftDictionary Indie Staging**, Singapore (`ap-southeast-1`), `ACTIVE_HEALTHY`, created 17 November 2026. No new project is needed.
- Production is the separate Tokyo project (`ap-northeast-1`).
- Staging currently has zero Auth users and no deployed Edge Functions. It has the application schema/content and the 2.6.0 migration; no real learner accounts were copied.
- A distinct staging publishable key exists. Only this public key may be used in a browser preview; never expose service-role/secret keys.
- GitHub Actions run [#44514979573](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44514979573) passed both jobs: full local schema build, migration, privilege assertions, Auth/RPC integration, authenticated Chromium Quiz runtime and local security-advisor checks.
- A Cloudflare Pages preview configured to point to staging is not yet verified. The repository's current `supabase-config.js` hardcodes production URL/key. Do not deploy this branch as a preview until separate preview config uses staging and the resulting host is confirmed. Cloudflare Pages project settings must be checked in the owner's dashboard; current connected tools do not expose that account.
- No production config, database, OAuth settings or deployment was changed.

## Terms footer placement

Terms & Conditions must be linked in the bottom-page footer alongside Feedback & Suggestions, not in primary navigation.
