# Update 2.6.0 — legal, privacy, safety and security baseline audit (2026-11-19)

## Owner instruction and scope

The owner asked the assistant to continue the Update 2.6.0 work and stated that they rely on a thorough investigation of Malaysian PDPA and other applicable requirements to make SwiftDictionary a safe and lawful website.

This session performed a read-only legal research and technical baseline audit, then created the Update 2.6.0 blueprint. The owner's standing constraints remain in force: Malaysia and general legal review for expansions, free dictionary search, minimal tracking, global 16+ intent, low-cost validation, no production/destructive operations without explicit approval, and docs-only records on `docs/master-development-record`.

## Documents read

- `docs/MASTER-DEVELOPMENT-RECORD.md`
- `docs/SWIFTDICTIONARY-LEGAL-PRIVACY-REVIEW-2026-11.md`
- `docs/UPDATE-2.3.0-PRIVACY-AND-DELETION-DESIGN.md`
- `docs/UPDATE-2.3.0-PRIVACY-FIRST-CATALOGUE-DECISION.md`
- `docs/reference/PRIVACY-POLICY-DRAFT.md`
- `docs/conversation-archive/2026-11-14-update-2-4-0-final-decisions-and-legal-roadmap.md`
- `docs/conversation-archive/2026-11-19-update-2-5-0-staging-validation-and-production-release-gate.md`
- Current `main` application source, `daily-learning.js`, `flashcards.js`, `feedback.html`, `supabase-config.js`, `mock-testing.js`, migration history and third-party notices.

## Legal research findings

- The current official Act 709 reprint is available from JPDP and dated 2026. The 2024 Amendment Act and staged commencement must be read with the consolidated Act.
- Act 709's commercial-transaction scope and the individual personal/family/household exemption require a fact-specific legal assessment. A free public learning service storing other people's account and learning data should not assume it is exempt.
- Section 7 privacy notice requirements include a written notice with data categories, purposes, source information, access/correction route, recipient classes, choices, obligatory/voluntary data and consequences; subsection 7(3) requires Bahasa Malaysia and English.
- JPDP's DPO criteria include >20,000 data subjects, >10,000 subjects for specified sensitive/financial data, or regular and systematic monitoring. SwiftDictionary's adaptive revision uses learning performance over time, so the third criterion must be screened rather than dismissed based on small user count.
- JPDP's DPO circular/guideline, DBN guideline, cross-border transfer guideline, DPIA, Data Protection by Design and Automated Decision-Making/Profiling guidelines must be considered.
- A notifiable breach may require Commissioner notification within 72 hours. The exact threshold and user-notification conditions must be applied from current JPDP guidance.
- The 13-class registration regime is distinct from DPO appointment. Current facts do not show an obvious education-class match, but the operator and activity must be confirmed.
- GDPR applies to a non-EU controller only when Article 3 targeting/monitoring conditions are met; mere accessibility is not enough. The global audience means EU targeting must be decided.
- UK Children's Code may apply to services likely to be accessed by children; the intended 16+ audience includes 16- and 17-year-olds. COPPA remains relevant if the service is directed to or knowingly collects data from under-13 users.
- Online Safety Act 2025 was considered; no immediate platform/licensing conclusion is made for the current static/private learning model. Reassess if public UGC, messaging or platform features are added.

## Read-only technical findings

### Environment and database

- Production Supabase project active/healthy, PostgreSQL 17.11.0.003, primary DB region Tokyo, Japan.
- Staging Supabase project active/healthy, primary DB region Singapore.
- Production health advisor returned no health lints.
- Security advisor reported:
  - leaked-password protection disabled;
  - two authenticated-callable SECURITY DEFINER functions;
  - eight private-schema tables with RLS enabled and no policies.
- The two SECURITY DEFINER functions are `public.is_personal_learning_test_access()` and `public.record_completed_lesson_practice_result(...)`. Their definitions use empty search_path and derive the acting user from `auth.uid()`; their current application purposes are narrow. Preserve the personal testing bypass and review exact grants/callers rather than blindly removing or changing these functions.
- Private-schema Quiz/Flashcards/allowance tables have RLS enabled and no direct anon/authenticated table privileges. No direct policies are intentional in the RPC-only access design; do not add blanket policies.
- Public user-owned tables have RLS enabled. `public.daily_activity_sessions` has unnecessary broad table privileges granted to `anon` (including SELECT/INSERT/UPDATE/DELETE and other table privileges), although no anonymous RLS policy was observed. This is a concrete least-privilege hardening item: prepare a migration to revoke anon access, then validate authenticated functionality in staging.
- Application user-owned tables, including private Quiz/Flashcards tables, have `ON DELETE CASCADE` foreign keys to `auth.users(id)`. This supports cleanup after trusted Auth-user deletion but is not a self-service account-deletion workflow.
- No production Edge Functions were listed.
- The visible frontend sign-in flow uses Google OAuth; the leaked-password warning should be assessed against actual Auth provider settings before action.

### Current data map

Current account-linked information includes Google/Supabase account identifiers and email; profile display name/avatar; course and translation preferences; timezone; saved words; lesson progress; aggregate lesson practice counts; Daily Learning session/content/topic/status/timestamps; Quiz session metadata, question/prompt/option/explanation snapshots and selected option IDs; Flashcards collections and user-authored card text; per-card mastery/review counts and timestamps; Flashcard game summaries; plan/allowance data.

**Important privacy-draft correction:** Current Quiz schema stores selected option IDs and question/session snapshots. The old draft and some older planning statements that individual answers are not stored are stale. The next privacy notice must accurately describe Quiz data. Flashcards stores aggregate mastery/session summaries and user-created card content.

The application uses browser localStorage for course/translation preferences, avatar and signed-out saved words. Supabase Auth is configured with `persistSession: true`. No analytics/ad-tracking code, `document.cookie` or geolocation API was found in the source inspected. Provider request metadata (e.g. IP, device/browser and request timestamps) may still be processed by hosting/CDN/auth providers and must be verified from provider documentation/settings.

### Privacy features and gaps

- Profile offers recent-authentication-gated **Delete learning history**, which deletes progress/practice/session/history/mastery while preserving account, saved words, profile/preferences and custom Flashcard collections/cards. Existing allowance usage is not restored.
- There is no user-facing **Delete account** control or account-deletion Edge Function/RPC.
- No current Privacy Policy or Terms link exists in the main page footer. The existing `docs/reference/PRIVACY-POLICY-DRAFT.md` is stale and must not be published without rewriting and verifying controller/provider/retention details.
- Feedback page prepares a GitHub issue rather than sending to a private server. On Cloudflare Pages, its old GitHub Pages hostname/path inference fails to identify the repository and falls back to generic GitHub issues; if a public issue is created, users need to be warned that it may be public.
- Supabase JS is loaded from jsDelivr using floating `@supabase/supabase-js@2`; pin an exact tested version and add SRI or self-host.
- Hanzi Writer 3.7.3 and Hanzi Writer data 2.0.1 are referenced; preserve MIT and Arphic notices and recheck the distinct data licence before bundling/modifying/commercial use.
- `mock-testing.js` is included in the current HTML but guarded by explicit `?swiftMock=1` and a preview/local hostname allowlist. The production host is not allowlisted. Maintain regression coverage and consider excluding test-only code from production.
- Flashcards dynamic HTML uses escaping for reviewed user-authored custom-card rendering paths. Keep stored-XSS and attribute-injection tests for all future render paths.

## Blueprint created

Created `docs/UPDATE-2.6.0-LEGAL-PRIVACY-SECURITY-PLAN.md` on `docs/master-development-record`, commit `7c52b4ea001a1b1b8f1b6cb900c07e04d91f88f8`.

The blueprint covers:
1. Malaysia Act 709 scope and principles, privacy notice, DPO, controller registration, cross-border transfers, breach response and DPIA screening.
2. GDPR/UK Children's Code/COPPA applicability screening and 16+ safeguards.
3. Current data inventory and provider map.
4. Supabase RLS/grants/RPC/auth review, account deletion, dependencies, feedback and licensing.
5. Prioritised remediation register and staged implementation/release gates.
6. Explicitly unresolved legal/operator decisions.

## Priorities

1. Confirm operator/controller identity and obtain Malaysian legal advice on Act 709 scope, section 45 exemption, DPO monitoring criterion and prescribed registration class.
2. Build provider/subprocessor and cross-border processing inventory; verify Supabase Auth/log/backup/support and Cloudflare/GitHub/Google/jsDelivr processing.
3. Replace stale privacy draft with accurate current bilingual Bahasa Malaysia/English notice; prepare Terms of Service and clear privacy contact route.
4. Review and revoke unnecessary anonymous privileges on `daily_activity_sessions` through a migration and staging tests.
5. Define retention and implement secure account deletion using trusted server-side Auth Admin API; do not expose service-role credentials.
6. Establish breach response, DPIA screening, access/correction/export request route and 16–17-year-old safeguards.
7. Pin frontend dependencies, review headers/CSP, feedback destination/public visibility, production mock-test bundle and third-party licence links.

## Approval and release boundary

No production database writes, migrations, Auth configuration changes, repository application-code changes, merge, deployment or production setting changes occurred. This session only performed read-only inspection and wrote a planning document to the docs branch.

The next stage is to agree on legal/operator facts and implement reviewed changes in feature branches/staging. No production migration, Auth setting change, merge or deployment is authorised by this archive.
