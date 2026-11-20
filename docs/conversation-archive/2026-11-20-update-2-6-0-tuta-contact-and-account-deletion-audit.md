# Update 2.6.0 — Tuta contact setup and staging account-deletion audit

**Date:** 20 November 2026  
**Status:** Contact mailbox created and configured by owner; outbound/inbound verification pending Tuta's first-24-hour sending restriction. Read-only account-deletion dependency audit completed against Singapore staging. No application code, schema, Auth settings, production data or deployments changed.

## 1. Owner update: privacy contact mailbox

The owner created a dedicated Tuta Mail address for SwiftDictionary. The mailbox's security/configuration checklist is mostly complete. Tuta prevents newly registered accounts from sending email during the first 24 hours, so external send/receive verification cannot yet be performed.

Implementation/documentation treatment:
- Treat the mailbox as created and configured, but **not yet externally verified**.
- It may be used as the proposed contact address in internal working drafts, clearly marked pending verification.
- Do not publish it as an operational support/privacy-request channel until inbound and outbound delivery have both been tested.
- The mailbox does not resolve the separate legal decision about the controller/operator's public legal identity and capacity, Act 709 applicability, or whether a postal address must be disclosed.
- Do not publish a private home address merely to fill a legal-document placeholder.

## 2. Staging environment inspected

Supabase projects were enumerated:
- Production: `SwiftDictionary`, Tokyo (`ap-northeast-1`), project `pzymiesazmpyvnfvsbsc`.
- Staging: `SwiftDictionary Indie Staging`, Singapore (`ap-southeast-1`), project `ivatvkfrtifgfheeaelj`.
- Both were reported `ACTIVE_HEALTHY` at inspection time.

All database inspection in this session was read-only and targeted staging. No production queries that read user rows, no writes, migrations, Auth changes or deployment actions were performed.

## 3. Account-deletion dependency audit

### Existing implementation

- Staging has no deployed Supabase Edge Functions.
- The only deletion-related RPCs found are the existing learning-history functions:
  - `public.delete_my_learning_history()` — SECURITY INVOKER wrapper.
  - `private.delete_my_learning_history_impl()` — SECURITY DEFINER implementation with empty search_path.
- No account-deletion RPC or Edge Function was found.
- The existing history-deletion control is not account deletion and must remain distinct.

### Foreign-key and Storage findings

- All 18 application tables with direct `user_id` ownership references to `auth.users(id)` use `ON DELETE CASCADE`.
- Flashcard cards cascade through their collection relationship; Quiz session-question snapshots cascade through the composite session/user relationship. These relationships were inspected separately.
- Staging has no Storage buckets, so there are currently no user-uploaded Storage objects in that environment to remove before Auth deletion.
- No user rows or message contents were inspected.

### Remaining engineering work

A safe account-deletion implementation still requires:
1. A dedicated server-side, JWT-verified Edge Function; derive the target UID only from a verified Supabase Auth user, never a client-supplied UID.
2. Fresh reauthentication and explicit irreversible confirmation in the client flow.
3. Revoke refreshable sessions before Auth Admin deletion; account for already-issued access JWTs that can remain valid until expiry.
4. Auth Admin deletion from the trusted server only; never expose service-role credentials in browser code.
5. Retry-safe partial-failure behaviour and clear success only after Auth deletion is confirmed.
6. Clear the deleted account's local auth/session and account-linked client state after confirmed deletion.
7. Decide whether to also clear device-local signed-out saved words. This is an owner UX decision; those words may belong to another shared-device user and are not necessarily linked to the deleted account.
8. Verify the live production schema and Storage configuration before any production rollout. Staging findings do not prove production parity.

No account-deletion implementation was started in this session.

## 4. Staging security and health snapshot

- The security advisor returned eight INFO findings for private-schema RLS-enabled tables without policies; these are the documented RPC-only private tables.
- Two WARN findings remain for authenticated execution of reviewed SECURITY DEFINER functions. They were already documented as intentional and require function-body/privilege review rather than blind revocation.
- The health advisor returned no findings.
- These advisor results are a point-in-time staging snapshot, not a penetration test or security certification.

## 5. Legal/privacy and release boundaries

The controlling Update 2.6.0 legal approval register remains open. In particular:
- Act 709 applicability and any personal/household exemption require qualified Malaysian legal advice.
- Individual operation does not by itself establish an exemption.
- Controller/operator identity and capacity remain unapproved for publication.
- The public privacy contact must be monitored and verified.
- The Regulation 3(3) issue for 16–17-year-olds, processing basis, DPO/DPIA, provider contracts/subprocessors, cross-border transfers, retention periods, privacy-request handling and Terms enforceability remain open.
- The bilingual Privacy Notice and Terms remain internal working drafts. Do not publish them or start real-user Mock User onboarding.
- An explicit internal test-only exception may be considered separately, but must not onboard real users and must not be described as legal clearance.

Malaysia PDPA/Act 709, relevant regulations and general international privacy/consumer/copyright review remain standing checks for Update 2.6.0. This archive is a development record, not legal advice or a compliance certification.

## 6. Recovery point and next actions

1. Wait until Tuta's first-24-hour restriction expires, then test both outbound and inbound mail using an external account. Record the date and result; keep the address unpublished until successful.
2. Continue the account-deletion technical design using staging-only work. Do not deploy an Edge Function or alter Auth settings until the function contract, session-revocation strategy, retry behaviour and client UX have been reviewed.
3. Obtain the owner's decision on whether account deletion should also clear device-local signed-out saved words on the current browser/device.
4. Continue provider retention/contract verification and complete the draft retention schedule without inventing numeric retention periods.
5. Resolve legal approval-register items with qualified Malaysian counsel before public legal-document release or real-user onboarding.
6. Keep production Supabase, production Cloudflare and `main` untouched until separately reviewed and explicitly approved.

**Current repository state:** This session made no repository or branch changes before this documentation archive. The archive, index and Master Development Record updates are documentation-only on `docs/master-development-record`.
