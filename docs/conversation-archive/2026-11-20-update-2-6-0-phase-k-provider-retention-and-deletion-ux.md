# Update 2.6.0 — Phase K: provider retention evidence and account-deletion UX

**Date:** 20 November 2026  
**Status:** Public provider-documentation review recorded; tenant-specific settings remain to be verified. Owner approved the initial account-deletion UX direction. No provider settings, application code, database schema, Auth configuration or production deployment changed.

## 1. Owner-approved account-deletion UX direction

The owner approved the following placement and first confirmation step:

- Put **Delete account** inside **Profile → Preferences**.
- Selecting it opens a warning prompt explaining that deletion is permanent and may erase all personal data associated with the SwiftDictionary account.
- Give the user explicit **Confirm** and **Cancel** choices.
- Cancel closes the prompt without changing anything.
- Confirm proceeds to the secure deletion flow.

Engineering safeguards remain required and are not replaced by the prompt:
- Require fresh authentication/reauthentication before the irreversible server action.
- Derive the target user ID from a verified Supabase Auth session on the server; never accept a client-supplied UID.
- Use a trusted server-side Auth Admin operation; never expose the service-role key in browser code.
- Revoke refreshable sessions and account for the remaining lifetime of already-issued access JWTs.
- Make partial failures safe to retry and report success only after Auth deletion is confirmed.
- Explain that deleting a SwiftDictionary account does not delete the user's Google account.
- Distinguish account-linked cloud data from browser-local signed-out saved words, which may belong to another person on a shared device.

Suggested warning copy for later UX review (not final legal text):

> **Delete your account?**  
> This action is permanent. Your SwiftDictionary account and associated personal data may be deleted, including saved account data, learning progress, Quiz history and Flashcard collections. This does not delete your Google account. Some provider logs or backups may remain for limited periods under provider retention policies or legal requirements.  
> **Cancel** / **Confirm deletion**

Final wording must match the implemented deletion scope and verified provider behaviour. Do not promise immediate erasure from provider backups/logs.

**Unresolved owner decision:** whether a separate optional action should clear signed-out, device-local saved words on the current browser. Do not silently clear these as part of account deletion because the browser/device may be shared.

## 2. Provider retention evidence reviewed

### Supabase

- Current public Data Residency and Transfers FAQ says database data remains while a project is active; deleting an entire project removes Customer Data within 30 days. It describes customer-account data retention for legal obligations and up to 60 days for personal information after account closure, and says usage logs/telemetry have specific retention periods without giving one universal period.
- Backup documentation updated 12 November 2026 says daily backup windows are 7 days for Pro, 14 for Team and up to 30 for Enterprise. PITR is a paid add-on with a configurable recovery period and replaces daily backups.
- These facts do **not** mean individual SwiftDictionary learner-account deletion takes 30 days. Whole-project deletion and an individual Auth user deletion are different operations.
- Actual production/staging plan, PITR, backup and service-log settings remain unverified.

Sources:
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
- https://supabase.com/docs/guides/platform/backups

### Cloudflare Pages

- Cloudflare's 19 November 2026 update says Pages deployments/Workers versions are retained for 30 days, except the 100 most recent and current production deployment.
- This is deployment/version retention, not a visitor request-log or build-log retention period.
- Enabled Pages/Workers/Turnstile/Analytics/Logpush products and account-specific log retention remain unverified.

Sources:
- https://developers.cloudflare.com/changelog/post/2026-11-19-workers-pages-version-retention/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/debugging-and-logging/

### GitHub

- The repository `WhiteWingCat/swiftdictionary` was confirmed public.
- GitHub's published default Actions log/artifact retention is 90 days; public repositories can configure 1–90 days. The actual repository setting and any organization override remain unverified.
- Workflow logs/artifacts must not contain learner data, secrets or private support messages.

Sources:
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository
- https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization

### Google Sign-In

- Google documentation confirms the stable `sub` identifier and profile claims such as email, name and picture may be present in ID tokens. Use `sub`, not email, as the external identity key.
- Revoking Google consent is distinct from deleting SwiftDictionary account records already stored in Supabase.
- Actual OAuth scopes, Supabase Auth provider settings and token handling remain unverified.

Sources:
- https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
- https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works

### jsDelivr

- The published policy describes CDN request metadata including IP address, browser/referrer details, requested CDN URL and request time. Non-aggregated usage data is described as retained for a shorter period, without a fixed number of days.
- Its subprocessor page lists Cloudflare, Fastly and Gcore as CDN providers that may receive IP/browser request information.
- The reviewed privacy policy is dated 23 November 2023; verify it is still applicable and confirm current asset use before relying on it in public disclosures.

Sources:
- https://github.com/jsdelivr/jsdelivr/blob/master/Privacy%20Policy.md
- https://github.com/jsdelivr/jsdelivr/blob/master/Sub-Processors.md

## 3. What is not yet verified

No provider-specific retention setting was changed or represented as verified. Still required:
1. Supabase production and staging plan, backup/PITR settings, DPA/subprocessors and exact service-log retention.
2. Cloudflare Pages enabled products, build-log and request-log settings, analytics and Logpush.
3. GitHub Actions repository retention setting and organization overrides; inspect artifacts/logs for accidental personal data.
4. Google OAuth scopes and Supabase Auth provider configuration.
5. Whether jsDelivr remains in the production asset path, current subprocessors and available retention specifics.

No fixed numeric application-data retention periods are approved. The public provider defaults cannot be used as substitutes for account-specific evidence.

## 4. Legal and privacy boundary

- The Malaysian Act 709 applicability/exemption, operator/controller identity, processing basis, 16–17-year-old parental-consent issue, DPO/DPIA, cross-border transfer, retention and Terms questions remain open in the Legal Approval Register.
- The Tuta mailbox is created/configured but still awaiting external send/receive verification. Do not publish it as a verified privacy-request channel yet.
- Privacy Notice and Terms remain internal drafts. Do not publish or begin real-user onboarding based on this review.
- This is provider-documentation research and development planning, not legal advice or a compliance certification.

## 5. Repository and production safety

- Updated only documentation on `docs/master-development-record`.
- No application code, migrations, Auth settings, provider dashboard settings, production data, Cloudflare deployment, merge or production release changed.
- No user rows, user content or provider log contents were inspected.

## 6. Next actions

1. Verify account-specific Supabase, Cloudflare and GitHub settings from their dashboards; ask the owner for manual screenshots/details only where connector access is unavailable.
2. Inspect actual Google OAuth scopes and whether jsDelivr is still used by the current production bundle.
3. Populate evidence fields in the working retention schedule, then propose only the application-controlled retention periods that SwiftDictionary can actually enforce.
4. Continue account-deletion technical design in staging after the function contract, reauthentication and local-storage scope are settled.
5. Keep all legal/publication and real-user onboarding gates open until reviewed by qualified Malaysian counsel and verified operationally.
