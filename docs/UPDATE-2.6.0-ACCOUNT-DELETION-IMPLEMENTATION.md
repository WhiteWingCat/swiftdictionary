# Update 2.6.0 — Account deletion implementation notes

## Approved behaviour

- Account deletion is initiated from Profile → Preferences.
- The confirmation dialog is explicit and warns that cloud account data is permanently deleted; the Google account is not deleted.
- If the current browser contains a separate signed-out local saved-word collection, offer an optional checkbox, unchecked by default, to clear only that collection.
- Do not clear unrelated browser storage or another account's cloud data.
- Account deletion succeeds independently of optional local clearing. If local clearing fails after Auth deletion is confirmed, report that the account was deleted but local words may remain.

## Current saved-word lifecycle discovery

The existing application uses `swiftdictionary-saved` as the signed-out local key, but its Auth refresh handler removes that key when an account signs in or signs out. Signed-in saved words are loaded from `public.saved_words` and are not cached in the shared browser key.

The implementation introduces `swiftdictionary-anonymous-saved` as a separate, hidden while signed in collection. A pre-startup migration copies the old key into the new key before the existing Auth handler can clear the legacy key. Signed-out saves write only to the new key; signed-in cloud saves remain in Supabase. On sign-out the anonymous collection is restored to the dictionary UI. On account deletion, only the explicit checkbox removes this new key.

## Server deletion contract

The `delete-account` Edge Function:
- Requires POST, an explicit `confirm: true` payload, a valid Supabase user JWT, and an `auth_time` no older than 15 minutes.
- Derives the target UID exclusively from `auth.getUser(accessToken)`; it does not accept a user ID from the client.
- Uses server-side `SUPABASE_SERVICE_ROLE_KEY`; no privileged key is shipped to the browser or committed.
- Revokes refreshable sessions globally before calling Auth Admin deleteUser.
- Verifies the user is no longer returned by Auth Admin before reporting success.
- Returns retryable partial-failure codes if revocation succeeds but deletion fails.
- Notes that already-issued access JWTs remain valid until their expiry.

The application sends only the current access token and explicit confirmation. It signs out the current browser locally after confirmed deletion.

## Staging data-boundary inspection (20 November 2026)

A read-only foreign-key inspection of the Singapore staging project found that all SwiftDictionary application-table references to `auth.users` use `ON DELETE CASCADE`. This includes public saved words, profiles, preferences, entitlements, learning logs, lesson progress/practice, daily activity, learning page introduction preferences, private learning allowance records, Quiz sessions/questions/reservations, and Flashcard collections/cards/mastery/review/session records. Supabase-owned auth identities, MFA factors, tokens and sessions also cascade. The only non-cascade Auth-schema FK returned was Supabase's `auth.scim_users.user_id` with `ON DELETE SET NULL`; SwiftDictionary does not use SCIM.

## Validation still required

- Deno unit tests for JWT payload parsing.
- Static frontend checks for the optional local-clear scope and account-deletion UI.
- Deploy the Edge Function to Singapore staging only and verify it is listed/serving.
- Create a disposable synthetic staging Auth user with associated rows; test stale-auth rejection, session revocation, full cascade deletion, retry/partial-failure handling, and local checkbox checked/unchecked behaviour.
- Confirm the Cloudflare preview uses the staging Supabase URL before any destructive staging test. Do not test against production or the owner's personal accounts.
