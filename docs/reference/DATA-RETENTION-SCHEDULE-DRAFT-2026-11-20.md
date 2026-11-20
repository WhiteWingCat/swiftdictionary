# SwiftDictionary Data Retention Schedule — Working Register (20 November 2026)

**Status:** Draft inventory only. No numeric retention periods are approved.  
**Owner:** [Operator/controller to be confirmed]  
**Related documents:** Privacy Notice draft; Update 2.6.0 Legal, Privacy, Safety & Security Blueprint.

Do not publish retention promises until each period is checked against the live system, provider settings, backups, support workflow and legal requirements.

| Data category | Active-system record / location | Deletion trigger or control | Backup / provider retention still to verify | Proposed decision |
|---|---|---|---|---|
| Supabase Auth identity and Google-linked email | Supabase Auth user record | Account deletion process not yet confirmed as self-service | Auth backups, logs, support access and token/session expiry | Set period and deletion workflow after provider review |
| Profile and preferences | User-owned public tables; some values in browser local storage | Account deletion; local device clearing requires a defined workflow | DB backups and browser copies | Define active and local-device cleanup |
| Saved words | Supabase user table; signed-out local storage | User deletion/account deletion; local signed-out data may persist separately | DB backups and browser copies | Define account vs device deletion |
| Lesson progress and practice summaries | User-owned progress/practice tables | Delete Learning History; account deletion | DB backups | Verify current history-deletion coverage and backup expiry |
| Daily Learning sessions and history | User-owned activity/session tables | Delete Learning History; account deletion | DB backups | Verify abandoned/completed session retention |
| Quiz sessions, question snapshots and selected option IDs | Private Quiz tables via RPC | Delete Learning History; account deletion | DB backups | Explicitly include answer-level records in deletion and notice |
| Flashcard collections and user-created text | Private Flashcard tables | User deletion of cards/collections; account deletion | DB backups | Confirm whether collection deletion is user-controlled and backup expiry |
| Flashcard mastery and review history | Private review/mastery tables | Delete Learning History; account deletion | DB backups | Verify every table in deletion RPC |
| Flashcard game/session summaries | Private Flashcard session tables | Delete Learning History; account deletion | DB backups | Verify deletion and retention behaviour |
| Learning allowance and entitlement state | Private allowance/entitlement tables | Allowance-window expiry or account deletion, as designed | DB backups | Preserve current-day allowance on history deletion; define residual period |
| Security/authentication logs | Supabase, Cloudflare and Google systems | Provider/operator security retention policy | Provider-controlled periods and global processing | Obtain tenant-specific provider facts; do not invent periods |
| CDN and asset request metadata | Cloudflare and jsDelivr | Provider-controlled retention | Global CDN/subprocessor retention | Confirm request logs and retention from provider documentation/settings |
| Feedback/support | GitHub issue or approved private channel | User request and repository policy; public issues may remain visible | Provider backups/archives | Decide whether to add a private contact route and retention process |
| Build/deployment logs and source repository records | GitHub Actions and Cloudflare Pages | Repository/workflow retention settings | Provider retention and account settings | Verify actual settings; do not equate code history with user-data retention |
| Staging test records | Singapore staging Supabase project | Reset/cleanup of synthetic test accounts and fixtures | Staging backup/log retention | Synthetic data only; never copy production learner rows |

## Required approvals and evidence

- [ ] Approve a numeric active-system retention period for each category where a fixed period is appropriate.
- [ ] Define event-based retention where deletion/window expiry is more appropriate.
- [ ] Verify Supabase database backup/PITR and log retention for the actual plan.
- [ ] Verify Cloudflare Pages build/deployment and security-log retention.
- [ ] Verify Google OAuth and account metadata handling.
- [ ] Verify jsDelivr request metadata and subprocessor handling.
- [ ] Verify GitHub repository visibility, issue retention and Actions log settings.
- [ ] Test learning-history deletion across every relevant table.
- [ ] Implement and test account deletion, including Auth sessions, foreign-key cascades and residual JWT behaviour.
- [ ] Document exceptions for security incidents, legal claims and mandatory retention.
- [ ] Ensure the Privacy Notice describes the verified periods and limitations accurately.


## Provider-documentation evidence snapshot — 20 November 2026

This section records public provider documentation, not verified tenant settings. Do not convert these provider defaults into a SwiftDictionary retention promise until the relevant account dashboard, contract and enabled products have been checked.

### Supabase

- Production project: `pzymiesazmpyvnfvsbsc`, Tokyo (`ap-northeast-1`); staging project: `ivatvkfrtifgfheeaelj`, Singapore (`ap-southeast-1`). Both were reported `ACTIVE_HEALTHY` during this review.
- Supabase's current Data Residency and Transfers FAQ says database data is retained while a project is active; when a project is deleted, Customer Data is deleted within 30 days. Customer account information may be retained where required by law, including tax, billing or legal obligations; the FAQ says personal information is deleted up to 60 days after account closure. Usage logs and telemetry have specific operational/security retention periods, but the FAQ does not state a universal fixed period.
- Supabase's Backup documentation (updated 12 November 2026) says Pro projects have 7 days of daily backups, Team 14 days and Enterprise up to 30 days. PITR is a separate paid add-on with configurable recovery retention; enabling PITR replaces daily backups. Free-tier projects are advised to export data regularly rather than being promised a daily-backup period.
- **Owner-confirmed plan:** production and staging are both on Free. The owner confirmed this via the Subscription Plan page for production and earlier staging dashboard inspection.
- Supabase's current [pricing page](https://supabase.com/pricing) lists **24 hours** of Auth Audit Logs for Free, **1 day** of API & Database log retention for Free, and excludes Platform Audit Logs on Free. These are plan-level accessible-history/retention specifications; they do not establish physical deletion of every provider-held operational/security record.
- Supabase's Auth Audit Logs guide says events are stored in external log storage and, by default, also in the project's Postgres `auth.audit_log_entries` table. Disabling database writes does not disable external dashboard storage.
- **Not verified:** tenant-specific Auth Audit Logs storage toggle, actual log rows, PITR state (owner reports unavailable on Free), exact Edge Function/platform operational-log scope, project-specific DPA/subprocessors and provider support access.
- **Important distinction:** the public 30-day project-deletion statement concerns deleting an entire Supabase project, not the self-service deletion of one SwiftDictionary learner account. Do not describe it as an individual account-deletion period.

Sources:
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
- https://supabase.com/docs/guides/platform/backups

### Cloudflare Pages

- Cloudflare's 19 November 2026 changelog and current Pages limits documentation state that deployments are kept for 30 days, except the 100 most recent deployments and the current production deployment. Production deployment is retained while current; older deployments/preview URLs can disappear after the applicable threshold.
- This is **deployment/version retention**, not a stated retention period for visitor IP addresses, HTTP request logs, build logs, security events or account metadata.
- Pages Functions logging documentation describes request/error/custom logs and dashboard/Wrangler access, but the public documentation reviewed here does not establish a universal retention duration for SwiftDictionary's Pages build or request logs.
- Owner inspected Observability → Usage and saw **7 days** retention for the logs/traces represented on that Usage page. This does not yet establish that the same retention applies to the separate HTTP request-log interface.
- Owner inspected Observability → Logs and confirmed that HTTP request records for the Pages hostname are visible in the selected time window. The visible request summary showed 43 served by Cloudflare, zero mitigated and zero served by origin; sample entries were GET requests for `/favicon.ico` with 200 OK. Do not interpret this limited time-window sample as unique visitors or total traffic.
- **Not verified:** exact retention scope for the Pages HTTP request-log interface; build-log retention; account metadata retention; active DPA and subprocessor version. Turnstile and Logpush were not found/not confirmed; Web Analytics was not configured.

Sources:
- https://developers.cloudflare.com/changelog/post/2026-11-19-workers-pages-version-retention/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/debugging-and-logging/

### GitHub

- Repository `WhiteWingCat/swiftdictionary` was confirmed public during this review.
- GitHub documentation states that Actions workflow logs and artifacts default to 90 days. For public repositories, the configured retention period can be from 1 to 90 days. GitHub's 2026 documentation also describes retention for checks, workflow runs and commit statuses; the policy applies to new objects and does not retroactively change existing ones.
- **Not verified:** repository's Actions retention setting; organization-level overrides; whether any workflow artifact or log includes personal data; repository issue and discussion retention. Public issues remain visible according to repository visibility and should not be used for private support.
- Public source code and project-development documentation are separate from learner records; never commit learner data, secrets, OAuth tokens, or private support messages to the repository.

Sources:
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository
- https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization

### Google Sign-In

- Google's current web identity documentation confirms that ID tokens can include a stable Google subject identifier (`sub`) and profile claims such as email, name and picture, depending on what is requested/available. The project must use the stable subject rather than email as the external identity key.
- Google account consent can be revoked separately from deleting a SwiftDictionary account. Revocation does not delete profile or learning data already stored in Supabase.
- **Not verified:** actual OAuth scopes configured in Google Cloud Console; exact attributes stored by Supabase Auth; Google Cloud project/account settings; token retention/revocation implementation; provider-side retention applicable to this exact authentication setup.
- Do not state that deleting a SwiftDictionary account deletes the user's Google account.

Sources:
- https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works

### jsDelivr

- The published jsDelivr Privacy Policy describes CDN usage metadata including IP address, browser information, referrer domain, requested CDN URL and request time. It says non-aggregated usage data is kept for a shorter period and deleted after analysis unless needed for security/functionality or legal obligations; it does not specify a fixed number of days.
- jsDelivr's published subprocessor page lists CDN providers including Cloudflare, Fastly and Gcore, which may receive IP and browser request information for delivery, analytics and security.
- **Not verified:** whether all current SwiftDictionary assets are still loaded from jsDelivr; current subprocessor list and provider terms; any fixed request-log retention periods. The reviewed policy is dated 23 November 2023 and should be rechecked before the Privacy Notice is finalised.

Sources:
- https://github.com/jsdelivr/jsdelivr/blob/master/Privacy%20Policy.md
- https://github.com/jsdelivr/jsdelivr/blob/master/Sub-Processors.md

## Evidence still required before numeric retention approval

1. Check both Supabase project plans and backup/PITR screens; record the exact setting for production and staging separately.
2. Obtain current Supabase DPA, subprocessor list and account-specific retention/support details from the dashboard/legal hub.
3. Inspect Cloudflare Pages project settings and account logs/analytics/Logpush configuration. Record enabled products, not just available products.
4. Inspect GitHub repository Actions retention settings and workflow artifacts/logs. Confirm no workflow prints user data or secrets.
5. Inspect Google Cloud OAuth consent/scopes and Supabase Auth provider configuration; do not infer scopes from default examples.
6. Verify whether jsDelivr is still loaded in the current production build and whether a self-hosted asset alternative is feasible without breaking licensing or updates.
7. Only then propose operator-controlled retention periods for application records. Provider-controlled logs/backups must be described separately and accurately.

**No retention setting was changed during this review. No fixed numeric retention period is approved by this evidence snapshot.**


## Owner dashboard inspection — production and staging (20 November 2026)

This section consolidates owner-reported observations from the Supabase and Cloudflare dashboards and current provider documentation. It is an account-configuration snapshot, not an independent audit or a provider-wide deletion guarantee. No settings were changed.

### Supabase production

- Project: SwiftDictionary; reference `pzymiesazmpyvnfvsbsc`; Tokyo (`ap-northeast-1`).
- Owner confirms the organization subscription is **Free**, using the Subscription Plan page. Project Settings → General did not display the plan label.
- Google sign-in is enabled; “Skip nonce checks” is disabled; “Allow users without an email” is disabled.
- No configurable database backup/PITR recovery period is available/confirmed on the Free plan.
- Current Supabase pricing lists 24 hours of Auth Audit Logs and 1 day of API & Database log retention on Free. Platform Audit Logs are not included on Free. These are separate product categories.
- The Auth Audit Logs guide states that events are stored by default in external dashboard log storage and the project's Postgres `auth.audit_log_entries` table. The project-specific storage toggle and actual records were not inspected.

### Supabase staging

- Project: SwiftDictionary staging; reference `ivatvkfrtifgfheeaelj`; Singapore (`ap-southeast-1`).
- Owner confirms the project is on the Free plan.
- Owner confirms no database backups are configured/available on this plan and no PITR recovery window is confirmed.
- Plan-level log history values above are published Free-plan specifications; staging-specific log rows and settings were not independently queried in this phase.

### Cloudflare Pages production

- Pages project: `swiftdictionary`; production is connected to `main`; automatic production deployments and non-production branch previews are enabled.
- Owner previously observed 236 deployments at the inspection time. This is a point-in-time count, not a retention duration.
- Build command and build output directory are blank.
- Cloudflare Web Analytics was not configured. Turnstile and Logpush were not found/not confirmed.
- Observability Events showed no matching events in the selected view; the dashboard notice stated a Workers Free allowance of 200,000 events/day.
- Observability Usage displayed a 1–30 November 2026 cycle at day 20/30, 0.00/0.50 GB ingested that day, zero days at the cap, no dataset data for the selected period, and 7 days retention for the logs/traces represented on that page.
- Observability Logs showed actual HTTP request records for the SwiftDictionary Pages hostname in the selected Last 1 hour view. The summary showed 43 served by Cloudflare, zero mitigated and zero served by origin; visible sample entries were GET requests for `/favicon.ico` with edge status 200 OK.
- The seven-day Usage retention display has **not** been proven to cover this separate Pages HTTP request-log view, Pages build logs or every Cloudflare security/platform record.

### Retention and privacy implications

- Supabase Free plan log history is documented as 24 hours for Auth Audit Logs and one day for API & Database logs. These plan-level accessible-history values do not prove physical erasure of every provider-held operational/security copy.
- Supabase Platform Audit Logs are a separate feature and are not included on Free.
- No configurable Supabase database backup/PITR recovery period is confirmed for either project. Do not publish a numeric backup-retention promise or imply individual account deletion immediately removes backup copies.
- Cloudflare request-log visibility is confirmed for the selected view, but the seven-day retention scope for that separate request-log interface remains unverified.
- The limited Cloudflare request sample is not a unique-visitor count or total traffic measurement.
- Deployment count/version retention is distinct from visitor request logs, build logs and security logs.
- Web Analytics being unconfigured does not establish zero collection by the hosting provider or other infrastructure.
- No numeric operator-controlled application-data retention periods are approved.

**Evidence type:** Owner-reported dashboard observations plus current public provider documentation, 20 November 2026. No provider settings, deployments, database contents, user records or logs were modified or queried beyond the observations explicitly recorded above.
