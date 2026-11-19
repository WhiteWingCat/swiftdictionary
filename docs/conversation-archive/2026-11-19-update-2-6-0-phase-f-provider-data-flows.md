# Update 2.6.0 — Phase F provider processing and cross-border review

**Date:** 19 November 2026  
**Status:** Public provider-document review plus live project-region facts; no account settings changed.

## Supabase

- Production: Tokyo (`ap-northeast-1`); staging: Singapore (`ap-southeast-1`). Supabase says the selected region hosts the primary Postgres DB, Auth, Storage and backups.
- Supabase Data Residency and Transfers FAQ v1 (6 Oct 2026) says some customer account/configuration/billing processing, global support access, usage telemetry/logs/service metadata, and global Storage CDN delivery may occur outside the selected region. The FAQ says operational logs are stored in EU data centres and identifies Supabase Pte. Ltd. (Singapore) as primary processor and Supabase, Inc. (US) for support/operations when needed.
- The FAQ describes SCCs for EU/UK/Swiss transfers to Singapore and US; this does not itself resolve Malaysia PDPA Section 129.
- Supabase says database data remains while a project is active; project deletion removes Customer Data within 30 days. Backup retention varies by plan. Exact SwiftDictionary plan and backup/PITR settings are not yet verified.
- Next: obtain actual DPA/subprocessor list/transfer docs from the account legal hub; confirm plan, backups/PITR, logs and support settings.

## Cloudflare

- Cloudflare's Privacy Policy describes processor roles for Customer Logs and content transiting/stored on its network, while Cloudflare also acts as controller for some account/service data. It is a US-based global company; policy describes US/EEA primary storage and global operational transfers.
- Cloudflare's Singapore PDPA FAQ says metadata about network activity is processed in US/European data centres and may include visitor IP addresses for a limited period.
- Next: inspect Pages/Workers/Turnstile/analytics/logging products enabled, request-log retention, Logpush and analytics settings; obtain current DPA and subprocessor list. Exact Pages account configuration is not available to the connected tools.

## Google OAuth

- Google says Sign in with Google shares name, email and profile picture after user permission, but not the Google password.
- Next: verify actual OAuth scopes and staging callback URLs in Google Cloud Console. Disconnecting Google access is not equivalent to deleting SwiftDictionary data.

## GitHub feedback

- Current feedback page prepares a GitHub issue, requiring a GitHub account and creating a public-repository disclosure path. It is not a private support inbox. The private Supabase feedback inbox proposal is the preferred replacement.
- Until replaced, public feedback should warn users not to include personal or sensitive details.

## Cross-border conclusion

The current architecture involves at least Japan (production DB/Auth/backups), Singapore (staging DB/Auth/backups), US/EEA operational and network metadata processing, global support/subprocessor locations, and Google identity attributes. Exact Cloudflare Pages processing and provider log retention remain account-level verification items. If Malaysia PDPA applies, complete the Section 129 transfer assessment using the actual provider DPAs, subprocessors and safeguards before publishing the final notice.

No provider settings or production configuration were changed.
