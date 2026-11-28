# Supabase leaked-password protection — plan blocker (2026-11-28)



## 2026-11-28 — leaked-password protection plan blocker verified

The owner asked to fix the staging Auth leaked-password protection warning. The actual Supabase organisation `nnwaeapbmlgmmxbmkumb` (SwiftDictionary Indie) was queried and reports `plan: free`, `tier: tier_free`. Supabase's current official Password Security documentation states that HaveIBeenPwned-backed leaked-password protection is available on Pro and above. The setting cannot be enabled on this Free organisation through SQL, a database migration, or the available Supabase database tools. No Management API Auth-config action or access token is available in the connected tool surface. No plan upgrade or billing change was attempted.

The application source was inspected: the current SwiftDictionary sign-in UI uses Google OAuth (`signInWithOAuth({ provider: "google" })`) and does not expose password sign-up or password sign-in. Therefore adding a client-side leaked-password checker would not protect the current Google OAuth flow and would not clear the server-side Auth advisor warning; no misleading workaround was added.

A fresh staging Security Advisor run at 2026-11-28 04:47 UTC still reports exactly one `auth_leaked_password_protection` WARN. It also reports ten INFO findings for RLS-enabled tables in the non-exposed `private` schema without policies; these are server-mediated tables and must be reviewed through grants/RPC boundaries, not fixed by adding broad policies. No Auth config, database schema, production, or deployment changes were made.

**Original proposed resolution (superseded):** upgrade the SwiftDictionary Indie organisation to Pro and enable **Authentication → Sign In / Providers → Email → Prevent use of leaked passwords**. The owner subsequently decided not to pursue this setting and explicitly instructed that U3.0 work continue without it. The setting remains unchanged and is no longer an active completion gate. Revisit only if password-based authentication is introduced or the owner later requests it. Current app authentication is Google OAuth-only; continue validating the security boundaries of that enabled flow.

## Evidence
- Supabase organisation: `SwiftDictionary Indie` / `nnwaeapbmlgmmxbmkumb`, tier `tier_free`.
- Staging project: `ivatvkfrtifgfheeaelj`, status `ACTIVE_HEALTHY`.
- Supabase official documentation: [Password security](https://supabase.com/docs/guides/auth/password-security) — leaked password protection is available on Pro and above.
- Current application UI source: `index.html` — Google OAuth only; no password sign-up/sign-in calls.
- Fresh Security Advisor: `auth_leaked_password_protection` WARN remains; ten private-schema RLS-no-policy INFO findings remain for separate access-boundary review.

## Decision
No database workaround, client-side pseudo-protection, unauthorised billing change or claim of successful remediation. Await owner-approved organisation upgrade to Pro, then enable the setting and verify the advisor clears.


## Owner decision — 2026-11-28

Leaked-password protection is deferred. Remove it from the active U3.0 completion checklist. No upgrade, billing change, Auth configuration change, database workaround, or client-side substitute was made. Continue with the remaining content, Flashcard, regression, OAuth, and security work.
