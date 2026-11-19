# Update 2.6.0 — Account deletion and retention design

**Date:** 19 November 2026  
**Status:** Design-only; no code, Auth settings or database changes.

## Proposed account-deletion workflow

- A separate signed-in-only Delete Account action in Profile, distinct from Delete Learning History.
- Clear explanation that deletion removes SwiftDictionary account-linked data and does not delete the user's Google account.
- Fresh Google reauthentication and explicit irreversible confirmation.
- Dedicated JWT-verified Supabase Edge Function. Verify the bearer token with Auth; derive UID from the verified user; never trust a client-supplied UID.
- Keep service-role secret only in server-side Edge Function secrets.
- Revoke all refreshable sessions, then use Auth Admin to delete the verified user.
- Confirm all user-owned foreign keys cascade correctly and handle future Storage objects before Auth deletion.
- Do not report success until Auth deletion is confirmed. Make partial failures safe to retry.
- Clear local auth/account state after confirmed deletion. Owner must decide whether to also clear browser-local signed-out saved words on that device.
- Document residual JWT access-token lifetime, provider logs and backup expiry. Deleting an Auth user does not itself invalidate already-issued JWTs; strict immediate denial on sensitive operations may require validating session_id against auth.sessions or checking account existence.

## Supabase-specific constraints checked

Current Supabase User Management documentation warns:
- Deleting a user does not automatically sign out a user; JWT access tokens can remain valid until expiry.
- A user cannot be deleted while they own Storage objects; those objects must be removed or ownership reassigned.
- Admin operations must remain on a trusted server side, not in the public browser.

SwiftDictionary currently has no deployed Edge Functions in production or staging. The current reviewed product flow does not use user-uploaded Storage assets. Recheck both facts before implementation.

## Retention schedule framework

No numeric retention periods have been approved. The Privacy Notice must not invent them. A schedule must separately cover:
- Auth/account identity, profile and preferences.
- Saved words and private custom Flashcard content.
- Lesson progress, practice results and Daily Learning sessions, including abandoned sessions.
- Quiz snapshots, selected answer IDs and result history.
- Flashcard mastery, review items and game sessions.
- Provider request/security logs and CDN request metadata.
- Database backups/PITR, Cloudflare logs/build artifacts, Google identity data and GitHub issues.

For each category, record purpose, active-system retention, user deletion control, backup expiry, provider-controlled retention and legal exceptions. Deleting learning history removes active application records; it does not promise immediate deletion from provider backups/logs. Public GitHub issues are visible according to repository visibility.

## Owner decisions still required

1. Should account deletion clear all SwiftDictionary browser-local storage on the current device, including signed-out saved words?
2. Confirm the exact reauthentication UX and confirmation copy before implementation.
3. Approve retention periods after provider-account checks and legal review.
4. Confirm the public privacy request/contact route.

## References

- Supabase [User Management — deleting users](https://supabase.com/docs/guides/auth/managing-user-data).
- Supabase [Auth Admin sign-out](https://supabase.com/docs/reference/javascript/auth-admin-signout).
