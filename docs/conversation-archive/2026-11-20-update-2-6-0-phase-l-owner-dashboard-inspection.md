# Update 2.6.0 — Phase L: owner dashboard inspection (20 November 2026)

## Scope

The owner inspected the SwiftDictionary production and staging Supabase projects and the Cloudflare Pages production project through their normal dashboards. This was a read-only review. No TinyFish or other temporary browser session was used. No settings, deployments, databases, logs or user records were changed or inspected beyond the owner-reported observations below.

## Supabase production

- Project: SwiftDictionary; project ID `pzymiesazmpyvnfvsbsc`; region Tokyo (`ap-northeast-1`).
- Database backups require the Pro plan to configure. No configurable backup was set up during this inspection. The actual production plan label was not separately confirmed in this report; do not infer it solely from the backup screen.
- Google sign-in is enabled.
- “Skip nonce checks” is disabled.
- “Allow users without an email” is disabled.
- Auth log retention was not exposed in the inspected dashboard view. This does not establish that Auth logs do not exist or are not retained.

## Supabase staging

- Project ID: `ivatvkfrtifgfheeaelj`; region Singapore (`ap-southeast-1`).
- Owner confirms the project uses the Free plan.
- Owner confirms no database backups are configured/available on this plan.
- No PITR recovery window is confirmed.

## Cloudflare Pages production

- Project: `swiftdictionary`.
- Production branch is `main`; automatic production deployments are enabled.
- Preview deployments are enabled for all non-production branches.
- Owner observed 236 deployments at inspection time. This is a point-in-time count, not a retention period.
- Build command and build output directory are blank.
- Cloudflare Web Analytics is not configured.
- An Observability/Logs area is present, but no logs were displayed.
- Turnstile was not found in the inspected dashboard; record as not found/not confirmed, not as definitive proof that no integration exists.
- No Logpush section/configuration was found by the owner; do not infer that all Cloudflare logging is disabled.

## Privacy and retention interpretation

1. No configurable database backup/PITR recovery period is confirmed for either Supabase project from this inspection. Do not publish a numeric backup-retention promise or imply account deletion immediately removes backup copies.
2. Supabase Auth log retention remains unverified.
3. Cloudflare deployment count/version retention is distinct from visitor request-log and build-log retention.
4. Web Analytics being unconfigured does not establish zero data collection by Cloudflare or other infrastructure.
5. No displayed Observability logs do not establish absence of operational, request, security or platform logs.
6. Turnstile and Logpush are not confirmed as enabled; current evidence is “not found/not confirmed”.
7. No numeric application-data retention periods are approved by this inspection.

## Follow-up

- Confirm the production Supabase plan label separately under Project Settings → General.
- If the exact retention behaviour of Auth logs, platform logs or Cloudflare logs is material to the Privacy Notice, obtain provider-specific evidence rather than inferring from dashboard visibility.
- Keep provider-controlled backups/logs separate from operator-controlled application-data retention.
- Do not enable paid backup features or change provider settings without explicit owner approval.

## Release and safety status

This phase is documentation-only. No production or staging changes, deployments, migrations, source-code edits, account actions or legal approvals were made. Privacy Notice and Terms drafts remain internal and unapproved. Existing legal approval gates remain open.

Related record: [Data Retention Schedule](../reference/DATA-RETENTION-SCHEDULE-DRAFT-2026-11-20.md).
