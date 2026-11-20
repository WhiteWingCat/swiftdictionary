# Update 2.6.0 — Phase L: owner dashboard inspection (20 November 2026)

## Scope

The owner inspected the SwiftDictionary production and staging Supabase projects and the Cloudflare Pages production project through their normal dashboards. This was a read-only review. No settings, deployments, databases, logs or user records were changed or inspected beyond the owner-reported observations below.

## Supabase production

- Project: SwiftDictionary; project ID `pzymiesazmpyvnfvsbsc`; region Tokyo (`ap-northeast-1`).
- Owner later confirmed the production organization subscription plan is **Free** through the Subscription Plan page. The Project Settings → General page did not display the plan label.
- Google sign-in is enabled.
- “Skip nonce checks” is disabled.
- “Allow users without an email” is disabled.
- No database backup or PITR recovery window is configured/available on the Free plan according to the owner’s dashboard inspection. Do not publish a numeric backup-retention promise or imply immediate erasure from provider backups.
- Supabase’s current public pricing page lists **24 hours** of Auth Audit Log history on Free. Its Logs documentation separately lists **1 day** of API/database log retention on Free. These are provider-published plan limits, not proof of the exact age or contents of every record in this project.
- Supabase Auth Audit Logs documentation confirms authentication events are captured and can be stored in external log storage and optionally in `auth.audit_log_entries` in Postgres. The database-storage toggle does not disable the external audit-log storage.
- Platform Audit Logs are not available on Free; this is separate from Auth Audit Logs and service logs.

## Supabase staging

- Project ID: `ivatvkfrtifgfheeaelj`; region Singapore (`ap-southeast-1`).
- Owner confirms the project uses the Free plan.
- Owner confirms no database backups are configured/available on this plan.
- No PITR recovery window is confirmed.
- The same published Free-plan log-retention values are relevant as plan-level documentation, but staging-specific log contents/settings were not independently queried in this phase.

## Cloudflare Pages production and Logs

- Project: `swiftdictionary`; production branch is `main`; automatic production deployments are enabled; preview deployments are enabled for non-production branches.
- Owner observed 236 deployments at inspection time. This is a point-in-time count, not a retention period.
- Build command and build output directory are blank.
- Cloudflare Web Analytics is not configured.
- Turnstile was not found in the inspected dashboard; record as not found/not confirmed, not as definitive proof that no integration exists.
- No Logpush section/configuration was found by the owner; do not infer that all Cloudflare logging is disabled.
- Observability Events showed no matching events in the selected view. The dashboard notice stated a Workers Free allowance of 200,000 Observability events per day.
- Observability → Usage showed the 1–30 November 2026 billing cycle, day 20 of 30, 0.00 / 0.50 GB ingested today, zero days at the cap, no data in the displayed dataset chart, and **7 days** retention for the logs/traces covered by that Usage page.
- Observability → Logs showed actual HTTP request records for the Pages hostname in the selected last-hour window: 43 served by Cloudflare, zero mitigated and zero served by origin. Visible sample requests were GET `/favicon.ico` with edge status `200 OK`.
- The Logs page demonstrates request-log visibility. It does not, by itself, prove that the seven-day Observability Usage retention value applies to this separate HTTP request-log view, nor does it establish the retention of Pages build logs or all Cloudflare platform/security records.

## Privacy and retention interpretation

1. Supabase Free plan is owner-confirmed for production and staging.
2. Supabase Free plan public documentation currently states 24 hours for Auth Audit Logs and one day for API/database logs. Treat these as accessible log-history limits, not proof of physical erasure of every provider copy or universal retention of all provider operational/security records.
3. Supabase’s Auth Audit Logs can include user IDs, timestamps, action metadata and, for some event types, IP/user-agent fields. The current project’s actual audit-log storage toggle and record contents were not independently inspected.
4. Supabase Platform Audit Logs are a separate feature and are not included on Free.
5. No configurable Supabase database backup/PITR recovery period is confirmed for either project. Do not promise a numeric backup period or immediate backup deletion on individual account deletion.
6. Cloudflare Observability Usage displays seven days for its logs/traces usage. The scope of that value relative to the separately inspected HTTP request-log interface remains unverified.
7. Cloudflare request logs are visible for the Pages hostname. The sample view is a limited time-window observation, not a full traffic or unique-visitor count.
8. Cloudflare deployment/version retention is distinct from visitor request-log, build-log and security-log retention.
9. Web Analytics being unconfigured does not establish zero data collection by Cloudflare or other infrastructure.
10. No numeric operator-controlled application-data retention periods are approved.

## Follow-up

- Do not ask the owner to search further for the production plan label; the Subscription Plan page is the available source and confirms Free.
- Treat the Supabase Free-plan Auth Audit Log and API/database log durations as provider-published accessible-history values, while keeping broader provider operational/security retention separate.
- Verify the Cloudflare Logs view’s retention scope through current product documentation or account UI if it is material to the Privacy Notice.
- Keep provider-controlled backups/logs separate from operator-controlled application retention.
- Do not enable paid backup/logging features or change provider settings without explicit owner approval.

## Release and safety status

This phase is documentation-only. No production or staging changes, deployments, migrations, source-code edits, provider settings or legal approvals were made. Privacy Notice and Terms drafts remain internal and unapproved.

Related record: [Data Retention Schedule](../reference/DATA-RETENTION-SCHEDULE-DRAFT-2026-11-20.md).
