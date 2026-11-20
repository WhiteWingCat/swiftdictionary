# Update 2.6.0 — Phase L retention confirmation and remaining-work handover (20 November 2026)

## Purpose

Continue the read-only owner dashboard inspection and consolidate provider-retention evidence, then identify the remaining Update 2.6.0 work. This archive records only general configuration and product findings.

## Owner confirmations

- Production Supabase organization subscription plan is **Free**. The owner confirmed this on the Subscription Plan page; Project Settings → General did not display the plan label. Do not ask the owner to search that General page again.
- Staging Supabase is also Free, as recorded in the preceding Phase L inspection.
- No paid plans, paid backup features or paid logging services are to be introduced as part of this work.

## Supabase retention research

The current public Supabase [pricing page](https://supabase.com/pricing) lists these Free-plan features:

- Auth Audit Logs: **24 hours**.
- API & Database log retention: **1 day**.
- Platform Audit Logs: not included on Free.

The same pricing comparison lists Auth Audit Logs as 7 days on Pro and 28 days on Team; API & Database log retention as 7 days on Pro, 28 days on Team and 90 days on Enterprise. These plan comparisons are provider-published specifications, not a claim that every operational/security record has identical retention or that all underlying copies are physically erased at expiry.

Supabase's [Auth Audit Logs guide](https://supabase.com/docs/guides/auth/audit-logs) states that auth events are automatically captured. By default, they are stored in the project's Postgres `auth.audit_log_entries` table and in external log storage accessible through the dashboard. Disabling database writes does not disable external dashboard storage. The guide's sample format includes timestamp, user ID, action, IP address, user agent and metadata; actual fields vary by event.

Supabase's [Platform Audit Logs guide](https://supabase.com/docs/guides/security/platform-audit-logs) confirms that Platform Audit Logs are available only on Team and Enterprise. These are organization/dashboard administrative events and must not be conflated with Auth Audit Logs or API/Database service logs.

**Not verified:** the production/staging Auth Audit Logs storage toggle, actual project log rows, provider-side deletion semantics beyond the advertised history, exact Edge Function/service-specific log coverage and project-specific support/subprocessor processing.

## Cloudflare owner inspection

The owner supplied screenshots from Cloudflare Observability:

- **Events overview:** no matching Workers events were displayed in the selected view. A banner stated Workers Free includes 200,000 Observability events/day; when the limit is reached, new events are not stored until 00:00 UTC.
- **Usage:** the 1–30 November 2026 billing cycle was shown at day 20/30; 0.00 / 0.50 GB ingested today; zero days at the cap; no dataset data for the selected period; **7 days** retention displayed for the logs/traces represented on this Usage page.
- **Logs:** the HTTP request-log view showed records for the SwiftDictionary Pages hostname in a selected Last 1 hour window. Summary showed 43 served by Cloudflare, zero mitigated and zero served by origin. Visible examples were GET requests for `/favicon.ico` with edge status 200 OK.

Interpretation:
- Cloudflare request-log visibility is established for the selected view.
- The 7-day Observability Usage retention figure is established for the logs/traces represented by that Usage screen.
- It is **not established** that the seven-day figure applies to the separate Pages HTTP request-log view, Pages build logs, or every Cloudflare platform/security record.
- The request sample is a narrow time window and cannot be interpreted as 43 unique visitors or total site traffic.
- Web Analytics was previously reported not configured; Turnstile and Logpush were not found/not confirmed. None of these observations proves that all provider-side data collection is disabled.

## Data-retention register changes

The working Data Retention Schedule was updated with:
- owner-confirmed Free plans for production and staging;
- the current public Supabase Free-plan log-history values and separation between Auth Audit Logs, API/Database logs and Platform Audit Logs;
- the Auth Audit Logs storage distinction;
- Cloudflare Observability Usage retention and separate HTTP request-log visibility;
- remaining scope uncertainties and provider-vs-operator retention cautions.

The Privacy Notice and Terms remain internal drafts. No numeric application-data retention periods were approved. No statement of immediate deletion from provider logs/backups is permitted.

## Remaining Update 2.6.0 work

### Owner decisions / input still needed

1. Decide whether account deletion should offer a **separate optional** action to clear signed-out browser-local saved words on the current device. Do not silently clear local saved words during account deletion because devices may be shared.
2. Confirm/verify a monitored public privacy contact route. The Tuta mailbox was previously created/configured but external send/receive verification remains outstanding; do not publish it until tested.
3. Review the final provider retention scope only if the operator wants to obtain more Cloudflare evidence from the account UI. No additional screenshot is required immediately; current ambiguity can remain explicitly documented pending public provider clarification.

### Development / technical work

1. Complete account deletion in isolated staging: server-side trusted Auth Admin deletion, fresh reauthentication, UID derived from verified session, retry-safe partial-failure handling, refresh-session revocation, access-JWT lifetime caveat, all owned-data cascades, and success only after confirmed Auth deletion.
2. Test account deletion with synthetic accounts across all feature tables and verify account isolation, sign-out/account switching and shared-device local-storage behaviour.
3. Complete staging end-to-end smoke tests through the Cloudflare preview, including Google OAuth, account deletion and regression checks. Do not use real learner data.
4. Review production privilege differences and prepare a separate, reviewed production ACL remediation plan. Production must remain unchanged until explicit approval.
5. Inspect the deployed asset path for jsDelivr use and confirm current Google OAuth scopes/Supabase provider attributes. Keep provider locations, subprocessors and retention facts distinct.
6. Verify GitHub Actions retention settings and ensure workflows/artifacts do not contain personal data or secrets.

### Legal / governance work

1. Resolve the 16 open items in `LEGAL-APPROVAL-REGISTER-UPDATE-2.6.0.md`, especially Act 709 applicability/exemption, controller identity/capacity, lawful basis, 16–17-year-old Regulation 3(3) issue, DPO/DPIA, cross-border transfer, privacy request route, Terms enforceability and licensing.
2. Complete the full DPIA recommended by the preliminary screening before broader public onboarding, or document a qualified legal determination if the formal requirement differs.
3. Set operator-controlled application retention periods and event-based deletion rules only after the data inventory and deletion implementation are verified. Keep provider logs/backups separate.
4. Revise the bilingual Privacy Notice and Terms only after factual and legal decisions are resolved; then implement versioned Terms acceptance and Privacy Notice acknowledgement/consent separation as approved.
5. Approve and rehearse the personal-data incident playbook; assign incident owner and verify provider escalation contacts.
6. Do not publish legal drafts or begin real-user onboarding/Mock User testing as release-ready until the legal register gates are resolved or the owner explicitly approves a limited internal synthetic-data exception.

## Changes made and safety

- Documentation-only updates on `docs/master-development-record`.
- Updated Phase L archive, Data Retention Schedule, Master Development Record and archive index.
- No source code, migrations, database schema/data, provider settings, Cloudflare deployments, production configuration or legal publication changed.

## Recovery point

Continue from the current documentation branch `docs/master-development-record`. Implementation work must use a focused feature branch created from current `main`; do not put internal records on production `main`. Keep all staging validation synthetic and all production changes behind explicit owner approval.
