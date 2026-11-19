# Update 2.6.0 — Phase B provider and cross-border data-flow review

**Date:** 19 November 2026  
**Branch:** `docs/master-development-record`  
**Scope:** Provider documentation review, live Supabase project metadata, current frontend integration points and data-flow/privacy implications.

## Owner decision recorded

The owner wants the future **Terms & Conditions** link placed at the bottom-page footer alongside **Feedback & Suggestions**. It should not be added to the primary navigation. The link should be enabled only when the Terms have been reviewed and published.

## Work completed

- Rechecked connected Supabase production and staging project metadata. Both are active and healthy. Production is in Tokyo (ap-northeast-1); staging is in Singapore (ap-southeast-1).
- Confirmed no Edge Functions are currently deployed in either connected project.
- Reviewed current Supabase, Cloudflare, Google OAuth, jsDelivr and GitHub public provider materials.
- Inspected the repository's current `supabase-config.js`, feedback page and third-party notices. The public frontend uses a Supabase publishable key, not a service-role key.
- Confirmed the feedback page is copy-first on Cloudflare Pages: it does not send the form content to a private backend. Because Cloudflare Pages does not match the legacy GitHub Pages hostname detection, it falls back to generic GitHub Issues instructions.
- No production or staging data rows were read.

## Provider findings

### Supabase

The production primary project is hosted in Tokyo; staging is hosted in Singapore. Supabase's October 2026 Data Residency and Transfers FAQ says that the chosen region hosts the primary database, Auth, Storage and backups, but it does not promise that all processing remains in-region. Customer account/configuration/billing data can be handled by central systems outside the region; global support personnel may access data when needed; usage telemetry and operational logs are processed outside the selected region, with logs ingested/stored in EU data centres; and the US affiliate may provide support and operational services. The privacy notice must not describe all processing as Tokyo-only.

Plan-specific backup retention, log retention, exact current subprocessors, contract acceptance and project-specific support settings remain unverified.

### Cloudflare Pages

Cloudflare is the static host and edge-delivery provider. Its public DPA version 6.4 is effective 3 April 2026. The connected Cloudflare dashboard and account-specific plan/settings were not accessible; exact log categories, retention, account data location, support access and DPA acceptance remain open verification tasks.

### Google OAuth

Google is the selected identity provider. Google documents `openid`, `email` and `profile` as standard authentication-only scopes. Actual tenant scopes, Google Cloud consent-screen settings, redirect/origin configuration, token handling and production brand-verification status were not inspectable. Do not assume no additional scopes without checking the Google Cloud Console. Google's current policy requires production brand verification for authentication-only Sign in with Google apps.

### jsDelivr

The app loads the Supabase JS client and Hanzi Writer assets from jsDelivr. Its public privacy materials describe request metadata including IP address, browser/version, referrer domain, requested CDN URL, time/date and diagnostic/device information. Its listed delivery subprocessors include Cloudflare, Fastly and Gcore, with Bunny for legacy endpoints. Hanzi Writer stroke JSON paths identify the requested character asset but do not include a SwiftDictionary account ID. Self-hosting pinned assets is a reasonable later privacy/supply-chain improvement, subject to preserving MIT and Arphic notices.

### GitHub feedback

The current feedback page does not transmit feedback to a private SwiftDictionary endpoint. On Cloudflare Pages, the hostname logic fails and falls back to generic GitHub Issues instructions; the user must copy/paste the text. If a user manually creates an issue in a public repository, that issue content is public. Do not describe the existing form as private or as automatically submitting data. A private support route remains a separate decision.

## Cross-border implications

- Tokyo is the production database region, not a guarantee of Tokyo-only processing.
- Singapore is a separate staging processing location; keep staging synthetic-data-only.
- CDN requests expose network metadata and asset URLs to jsDelivr and its delivery providers.
- Provider contract acceptance and exact retention periods are not verified and must not be invented in the public privacy notice.
- No region migration, production setting change, migration, user-data copy, deployment or OAuth change was performed.

## Next steps

1. Verify the account-specific Cloudflare plan, DPA acceptance, subprocessor list, Pages logs and retention.
2. Verify actual Google OAuth scopes and production brand verification in Google Cloud Console.
3. Confirm Supabase plan-specific backup/log retention and current subprocessors; determine whether the DPA applies to this account.
4. Decide whether to self-host pinned Supabase JS and Hanzi Writer assets, preserving all licence notices.
5. Complete retention schedule and cross-border legal assessment before drafting definitive provider disclosures.
6. Continue technical remediation with staging-first validation; production remains untouched.

## References

- Supabase [Data Residency and Transfers FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [DPA](https://supabase.com/legal/customer-resources/data-processing-addendum), [Subprocessors](https://supabase.com/legal/customer-resources/subprocessor-list).
- Cloudflare [DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) and [subprocessors](https://www.cloudflare.com/gdpr/subprocessors/).
- Google [OAuth policies](https://developers.google.com/identity/protocols/oauth2/policies), [authentication-only scopes](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works), [brand verification](https://developers.google.com/identity/verification/authentication-policy-compliance).
- jsDelivr [Privacy Policy](https://www.jsdelivr.com/terms/privacy-policy), [DPA](https://www.jsdelivr.com/documents/data-processing-agreement.pdf), [subprocessors](https://github.com/jsdelivr/jsdelivr/blob/master/Sub-Processors.md).
- GitHub [DPA](https://github.com/customer-terms/github-data-protection-agreement) and [Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).
