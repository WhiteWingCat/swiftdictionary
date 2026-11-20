# Update 2.6.0 — Legal, Privacy, Safety & Security Blueprint

**Review date:** 19 November 2026  
**Status:** Initial legal research and provider/data-flow review completed; both least-privilege staging migrations applied and verified; bilingual Privacy Notice, Terms of Use and retention schedule working drafts created; legal/operator decisions and production remediation remain open.  
**Production baseline:** Update 2.5.0, released 19 November 2026.  
**Scope:** Malaysia-first legal review, international applicability screening, privacy/data-flow review, Supabase and frontend security review, and implementation/release gates.

> This is a development and risk-planning document, not a legal opinion, legal compliance certification, penetration-test report, or guarantee of security. Legal conclusions about Act 709 scope, DPO obligations, international laws and operator status must be confirmed by a qualified lawyer where necessary.

## 1. Project assumptions and non-negotiable boundaries

The review uses the currently recorded product intent:

- Individually operated learning project, currently free to use.
- Intended audience is global; intended minimum age is 16+.
- Minimal tracking is preferred.
- English and Simplified Chinese are the current learning courses.
- Dictionary word-grid search remains free and unlimited; it must not be placed behind a subscription.
- A future Premium model for learning features remains undecided and is not treated as an existing commercial activity.
- Account sync uses Google sign-in and Supabase.
- Production is hosted on Cloudflare Pages. Production Supabase database region is Tokyo, Japan; staging database region is Singapore.

Do not add analytics, advertising, sale of user data, behavioural advertising, location tracking, public user-to-user content sharing, payment processing or new personal-data categories without a separate privacy/legal review.

## 1.1 Confirmed operator facts and proposed 16+ gate (19 November 2026)

The owner has confirmed that SwiftDictionary is operated personally by the owner as an individual, not through a registered company or other incorporated business. This is an important factual input for the Malaysian Act 709 assessment, but it does not by itself establish that the Act is inapplicable or that the personal/family/household exemption applies. SwiftDictionary is a public-facing service that processes other people's account and learning data; the commercial-transaction scope and exemption remain matters for qualified Malaysian legal advice. Do not publish the owner's private legal name or home address merely to fill a policy template. A suitable public controller/contact route must be agreed before publication.

### Proposed age-confirmation experience

The product's intended minimum age remains 16+. A proportionate self-declaration is a reasonable initial control to consider, but it is an age assertion, not reliable age verification and not proof that the person is actually 16 or older.

Proposed flow for legal review and owner approval:

1. Before starting Google OAuth or creating a SwiftDictionary account, show: **“Are you 16 years of age or older?”**
2. **Yes:** continue to sign-in. After successful authentication, record the affirmative declaration against the authenticated account.
3. **No:** do not start sign-in or provide account access; explain that the service is intended for people aged 16 or older and they may return when eligible.
4. Record only the account ID, affirmative declaration, timestamp and age-notice/policy version. Do not collect a full date of birth, identity document, selfie or other age-verification data unless a documented legal requirement and proportionate method justify it.
5. Re-confirm only when the minimum-age wording or material policy changes, not on every ordinary visit. Provide a clear route for a user to correct an accidental response.

The gate should appear before OAuth because a post-login prompt would occur after Google/Supabase account data has already been processed. A client-side bypass is possible, so this control must not be described as proof of age or as a guarantee that underage access is prevented.

### Important Malaysia 16–17-year-old issue

The Personal Data Protection Regulations 2013, Regulation 3(3), provides that consent under Regulation 3 for a data subject under 18 is to be given by a parent, guardian or person with parental responsibility; Regulation 3(5) places the burden of proving that consent on the data user. Therefore, a 16+ self-declaration does not resolve the separate parental-consent question for 16- and 17-year-olds where consent under Regulation 3 is the applicable processing basis. The legal basis for each processing purpose, the application of Regulation 3(3), and any alternative lawful basis must be assessed by Malaysian counsel before the age gate or privacy notice is finalised. Do not assume that a checkbox from the teenager satisfies parental consent.

The Malaysian online-safety age-verification requirements discussed in the June 2026 government materials concern licensed social-media service providers. SwiftDictionary's current private dictionary/learning-service design does not obviously fall into that category; do not import those verification duties automatically. Reassess if public posting, messaging, public user-to-user content or other platform-like features are introduced.

**Decision status:** the owner has confirmed the individual-operator fact and the intended 16+ audience. The exact prompt and flow above are a proposal for review, not yet an approved implementation or a legal conclusion. No age gate has been implemented.

## 2. Review method and limits

Read-only checks were performed against the documentation branch, the current main-branch source at the Update 2.5.0 release baseline, the connected production Supabase project and its staging counterpart.

The technical checks included:

- Current frontend source, account/profile flows, browser storage, feedback page, third-party scripts and notices.
- Production/staging Supabase project status and security/health advisors.
- Table metadata, column names, RLS state, browser-role table grants, function metadata and foreign-key delete behaviour.
- Existing learning-history deletion workflow and current user-facing deletion controls.

No user rows or message contents were read. No database writes, migrations, settings changes, OAuth changes, deployments, branch merges or production operations were performed. A full penetration test, independent external security assessment, Cloudflare dashboard review, Google OAuth console review and provider-contract review have not yet been completed.

## 3. Malaysia legal baseline

### 3.1 Personal Data Protection Act 2010 (Act 709)

The current official Act reprint is dated 15 September 2026. Act 709 applies to personal-data processing in connection with commercial transactions. The statutory definition of commercial transactions includes matters relating to the supply or exchange of goods or services and is not limited to signed contracts.

The Act also contains an exemption for personal data processed by an individual only for that individual's personal, family or household affairs, including recreational purposes. A public-facing service that stores other people's account and learning data is not obviously within that narrow personal/household exemption.

**Preliminary position:** SwiftDictionary's free and individually operated status does not automatically settle whether Act 709 applies. Whether this service is a transaction of a commercial nature, and whether the personal/household exemption could apply to any part of the operation, are fact-specific questions for Malaysian legal advice. Until that is resolved, design the product to meet the Act's core privacy and security standards rather than relying on an exemption.

### 3.2 Core requirements to design for if Act 709 applies

- **General Principle:** identify a lawful purpose, use a valid basis for processing, and collect only data that is adequate and not excessive for that purpose.
- **Notice and Choice:** Section 7 requires a written notice describing the data, purposes, available source information, access/correction rights and contact route, classes of recipients, choices/limits, whether provision is obligatory or voluntary, and consequences of not providing obligatory data. Section 7(3) requires the notice to be in Bahasa Malaysia (the national language) and English, with an accessible way to exercise choices in both languages where necessary.
- **Disclosure:** do not use or disclose data for unrelated purposes or to undisclosed recipient classes without an appropriate legal basis.
- **Security:** apply practical access, integrity, authentication, privilege, processor and incident controls. The 2024 amendments make data processors directly responsible for the Security Principle as well as the controller's responsibility to choose and oversee processors.
- **Retention:** do not keep personal data longer than required for the purpose. Define retention periods and deletion processes for active records, logs and backups.
- **Data integrity and access:** provide a workable route for users to access and correct personal data. The amended Act also introduces data portability under section 43A, subject to its statutory conditions and technical feasibility.
- **Consent and choices:** do not treat a generic Terms acceptance as a substitute for a clear privacy notice or for separate consent where consent is the relevant basis.

The seven principles and exact duties must be checked against the current Act and regulations before finalising the notice.

### 3.3 DPO screening

JPDP's published criteria require a controller or processor to appoint a Data Protection Officer if processing involves any of the following:

1. Personal data of more than 20,000 data subjects.
2. Sensitive personal data, including financial information, of more than 10,000 data subjects.
3. Activities requiring regular and systematic monitoring, with online user-behaviour tracking given as an example.

The third criterion is not a user-count threshold. SwiftDictionary stores learning activity over time and uses prior practice performance to support weak-topic/adaptive revision. This is limited educational progress processing, not behavioural advertising, but it may still raise the regular/systematic-monitoring question. **A Malaysian privacy lawyer must assess this against the current DPO guideline.** Do not conclude that no DPO is needed merely because the project is small.

Where appointment is required, JPDP says the appointment must be notified within 21 days. The DPO's business contact information and ability to communicate in Bahasa Melayu and English must be considered.

### 3.4 Controller registration

Registration is not automatically required for every website. It is tied to prescribed classes under the Class of Data Users Order and amendments, with the Commissioner's Circular No. 1/2026 now listed in the official materials.

The published education class refers to registered private higher-education institutions and private schools/education institutions under the relevant education laws. SwiftDictionary is currently an individually operated learning website, not an identified registered private school or higher-education institution. The current facts do not show an obvious fit with the listed classes, but the operator's legal status and actual activity must be checked before any incorporation, institutional registration, formal education activity or commercial expansion.

Do not confuse data-controller registration with the separate DPO appointment test.

### 3.5 Breach response and cross-border transfers

- Establish an incident-response process before onboarding more users. Under the amended Act and JPDP's breach-notification materials, a notifiable breach can require notification to the Commissioner within 72 hours; user notification is also required in relevant significant-harm cases. The exact trigger and notification content must be applied using the current guideline/circular.
- Section 129 and JPDP's Cross-Border Transfer Guideline require a valid transfer condition and appropriate assessment/safeguards for transfers outside Malaysia. The primary database region alone does not establish the location of Auth, logs, backups, support access, CDN delivery or every subprocessor.
- Complete and retain a transfer inventory/assessment for Supabase, Google, Cloudflare, GitHub and jsDelivr before publishing a definitive cross-border statement.

### 3.6 DPIA, design and profiling

JPDP issued current Data Protection Impact Assessment, Data Protection by Design, and Automated Decision-Making and Profiling guidelines on 30 April 2026. Complete a documented DPIA screening for learning progress, quiz answer records, Flashcard mastery, adaptive revision, users aged 16–17 and international transfers. If the screening indicates high risk, follow the current DPIA guideline. Reassess if future features make consequential decisions or introduce more intensive profiling.

## 4. International and child/teen applicability screening

### EU/EEA — GDPR

GDPR Article 3 can apply to a controller outside the EU where processing relates to intentionally offering goods or services to people in the EU, whether paid or free, or monitoring behaviour in the EU. Mere website accessibility in the EU is not sufficient by itself; the operator's intention and actual targeting/monitoring matter.

The owner's stated global audience means EU applicability must be explicitly assessed rather than ignored. If EU residents are intentionally within the audience, review lawful bases, rights, notices, processor contracts, international transfers, representative requirements, DPIA and breach handling. A 16+ threshold is not a blanket exemption from child-data rules. If consent is the basis for an information-society service offered directly to a child, Article 8 and the relevant Member State's age (13–16) must be checked.

### United Kingdom — UK GDPR and Children's Code

The ICO says the Children's Code can cover information-society services likely to be accessed by children, including educational websites, even when the service is not specifically aimed at children. A child is under 18 for this code. SwiftDictionary's intended 16+ audience includes 16- and 17-year-olds; therefore, if UK data-protection law applies and the service is likely to be accessed by UK children, the Children's Code is a material risk.

Use high privacy by default, data minimisation, clear age-appropriate explanations, no unnecessary location collection, no nudges to disclose extra data, and a careful review of adaptive revision/profiling. Consider applying child-protective defaults to all users rather than collecting exact birth dates or building intrusive age verification.

### United States — COPPA

COPPA focuses on services directed to children under 13 and services with actual knowledge that they collect personal information from a child under 13. The 16+ product intent is relevant but is not a substitute for handling actual knowledge. Do not knowingly collect under-13 users' personal data without the required process. Review if marketing, content or actual audience changes.

### Other regimes

A global launch cannot be certified by reviewing only Malaysia, EU, UK and US rules. Maintain a country-by-country screen for markets deliberately targeted, especially where the product later adds paid services, children-focused content, user sharing, advertising or local partnerships.

### Malaysia online safety / platform scope

The Online Safety Act 2025 took effect on 1 January 2026 and imposes obligations on defined licensed service providers. SwiftDictionary currently appears to be a static learning/dictionary service with private account-owned content, not an internet messaging or public social-content platform. No immediate licensing conclusion is made. Reassess if public sharing, messaging, public user-generated content or platform-like features are added, or if MCMC licensing status changes.

## 5. Current application data map

The following categories were confirmed from the current source and live database schema. They are personal data when linked to an identifiable account.

| Category | Current fields / examples | Purpose |
|---|---|---|
| Authentication | Supabase Auth user ID, Google sign-in email and provider/account metadata; account-provided name is used to initialise display name | Sign-in, account switching and sync |
| Profile | Display name, selected avatar icon, timestamps | Profile display |
| Preferences | Learning course, translation language, IANA timezone, allowance-timezone transition fields, enabled Daily Learning categories | Personalisation and local-day allowance reset |
| Saved words | Word/character, course and timestamp | Cross-device saved-word sync |
| Lessons | Lesson ID, difficulty, progress state, start/completion/update timestamps | Progress display and completion |
| Lesson practice | Correct count, question count, topic, difficulty, lesson ID and attempt time | Progress and weak-topic analysis |
| Daily activities | Activity type, language, content/topic ID, difficulty, source, local date, timezone, status, correct/question counts and timestamps | Activity history, allowances and adaptive revision |
| Quiz | Session difficulty/languages, question count, local date/timezone, status, score/percentage, question position; question snapshots, option order, prompt/option/explanation snapshots, correct option ID snapshot, selected option ID and answer timestamp | Quiz operation, results, history and content integrity |
| Flashcards | Private collection names, custom card front/back/example/translation text, dictionary word references, card order and timestamps | User-created collections and learning |
| Flashcard mastery/review | Per-card correct/incorrect counts, streak, last result/time, review mode and last incorrect timestamp | Weak Memory and progress |
| Flashcard sessions | Mode, difficulty, status, words seen, correct/incorrect/unanswered counts, duration and timestamps | Results, history and allowance enforcement |
| Allowances/entitlements | Plan/activity usage, status and validity timestamps | Enforce the currently implemented learning limits |
| Browser-local storage | Course/translation preferences, avatar, signed-out saved words; Supabase Auth session persistence is explicitly enabled | Local preference persistence, signed-out convenience and account session |
| Provider request metadata | Standard request/network data potentially processed by hosting/CDN/auth providers, such as IP address, browser/device and timestamps | Delivery, security and provider operations |

**Important correction:** The older privacy draft and some 2.3.0 planning statements say individual answers are not stored. That is no longer accurate for Quiz: the current Quiz schema stores selected option IDs and question/session snapshots. The privacy notice must disclose this accurately. Flashcards stores aggregate per-card mastery and game summaries, plus private custom card content.

The timezone is an IANA preference such as Asia/Kuala_Lumpur; the application describes it as a timezone setting, not a precise location. The source reviewed contains no GPS/geolocation API, analytics package or advertising tracker. This does not mean the site stores no browser data: localStorage and the Supabase authentication session are used.

## 6. Providers and international data flow

| Provider | Current role | Known location / open verification |
|---|---|---|
| Cloudflare Pages | Static website hosting and edge delivery | Global network; review Cloudflare account region, request/security logs, retention, DPA and subprocessors |
| Supabase production | Authentication and application database | Primary database in Tokyo, Japan (ap-northeast-1); verify Auth, logs, backups, support access and subprocessors |
| Supabase staging | Isolated development/test database | Singapore (ap-southeast-1); keep synthetic test accounts/data only and do not copy production learner data |
| Google | User-selected OAuth sign-in | Review OAuth scopes, data returned, Google's role and applicable terms/privacy information |
| jsDelivr | Supabase JS client, Hanzi Writer library and per-character Hanzi Writer stroke JSON | CDN edge locations vary; the requested character appears in the stroke-data asset path |
| GitHub | Repository and feedback issue workflow | Feedback submitted through the GitHub issue route may be public; GitHub account and public issue processing must be clearly disclosed |

No analytics, ad-tech or marketing tracker was found in the source inspected. No document.cookie or geolocation API use was found. Supabase Auth is explicitly configured with persistSession: true; users should be told that the sign-in session is persisted in browser storage.

The feedback page says it prepares a GitHub issue rather than sending feedback to a private server. On the current Cloudflare Pages domain, its legacy GitHub Pages hostname/path detection does not identify the repository, so the submit action currently falls back to a generic GitHub issues page and instructs the user to copy feedback. If the GitHub Pages route is used, submitted issue content may be public. Fix the destination and explain visibility before relying on this as the support channel.


### 6.1 Provider and cross-border verification — Phase B (19 November 2026)

This is a provider-document and configuration review, not a contractual legal opinion. Public provider documentation was checked on 19 November 2026. The connected Supabase project metadata was read directly; Cloudflare and Google account dashboards, contract acceptance records and tenant-specific retention settings were not accessible in this review.

| Provider | Verified processing / exposure | What remains unverified or required |
|---|---|---|
| Supabase production | Live project metadata confirms Tokyo, Japan (AWS ap-northeast-1). Supabase's current FAQ says the selected region hosts the primary database, Auth, Storage and backups. It also states that customer account/configuration/billing data may be processed centrally outside the region; support personnel are global; operational usage telemetry/logs are processed outside the region and logs are ingested/stored in EU data centres; US-affiliate support/operations may access data when necessary. | Confirm the account's plan-specific backup retention, log retention, exact current subprocessor list, DPA applicability/acceptance and any project-specific support settings. Do not describe all processing as Tokyo-only. |
| Supabase staging | Live project metadata confirms Singapore (AWS ap-southeast-1), active and healthy. No Edge Functions are deployed in either connected project. | Keep synthetic test data only. Verify staging log/back-up retention and ensure no production learner records are copied into it. |
| Cloudflare Pages | Main site is hosted on Cloudflare Pages. Cloudflare's public DPA is version 6.4, effective 3 April 2026; Cloudflare operates a global network. | Cloudflare account/dashboard and plan-specific service settings were not inspected. Confirm the DPA's applicability/acceptance, current subprocessor list, request/security-log categories and retention, account data location, Pages build/deployment logs and any support access. Do not invent a fixed global-edge retention period. |
| Google | Google is the selected OAuth identity provider. The application uses Google sign-in through Supabase; the local app schema stores the Supabase user identity and Google-provided account email/provider metadata. Google documents the standard authentication-only scopes as openid, email and profile. | Actual OAuth consent-screen scopes, brand verification status, redirect/origin configuration, Google Cloud project ownership, token handling and any additional API scopes must be checked in the Google Cloud Console. This connector cannot inspect that console. Confirm no unrelated Google APIs or scopes are enabled. |
| GitHub | GitHub hosts the source repository and is the intended destination for user-submitted issue feedback. The current feedback page does not transmit its form contents to a private SwiftDictionary endpoint. On Cloudflare Pages, hostname detection fails and the page falls back to generic GitHub Issues instructions; the user must copy/paste the text. | If a user manually creates an issue in a public repository, the issue content is public and is processed by GitHub. Confirm repository visibility and issue settings before changing the form to a direct issue URL. Do not send learner records, authentication details or other sensitive data to GitHub. Consider a private contact route if private support is required. |
| jsDelivr | The application loads the Supabase JS client and Hanzi Writer library/stroke JSON from jsDelivr. Its published privacy materials describe request metadata such as IP address, browser/version, referrer domain, requested CDN URL, timestamp and diagnostic/device information; its CDN subprocessors include Cloudflare, Fastly and Gcore (plus Bunny for legacy endpoints). A Hanzi Writer stroke-data request URL identifies the requested character asset, but does not include the SwiftDictionary account ID. | Verify current DPA/subprocessor terms and retention with the provider if relying on a formal processor arrangement. Consider self-hosting/pinning the Supabase client and Hanzi Writer assets to reduce third-party request exposure and supply-chain dependence. |

#### Provider-specific conclusions

1. **Tokyo is the primary database region, not a complete data-residency guarantee.** Supabase explicitly describes out-of-region account administration, global support access, EU-based operational logs and possible US-affiliate support/operations. Any privacy notice or transfer assessment must describe these categories accurately.
2. **Staging is a separate Singapore processing location.** The connected staging project is active and healthy, and currently has no deployed Edge Functions. It must remain synthetic-data-only.
3. **jsDelivr is a meaningful third-party disclosure point.** Browser requests reveal IP/network metadata and the requested asset URL to the CDN and its listed delivery providers. Character stroke JSON paths can reveal which character asset was requested, but no account identifier is embedded in that URL. Self-hosting is a reasonable privacy and supply-chain improvement, subject to preserving MIT and Arphic notices.
4. **Google scope minimisation remains a verification task.** Standard authentication-only scopes are appropriate in principle; actual tenant scopes and Google brand verification have not been checked. Google's current policy says production apps using Sign in with Google for authentication only must complete brand verification to display app branding, privacy policy, Terms and scopes in the consent screen.
5. **GitHub feedback is not a private support channel.** The current Cloudflare-hosted form does not automatically publish the text; the user copies it. If the user later submits an issue to a public repository, it becomes public. The UI must clearly explain this before encouraging submission.
6. **No tenant-specific provider contract acceptance or exact retention periods have been verified.** These must remain marked as unknown until checked in the relevant dashboards or provider support channels. Public provider documentation alone does not prove that the owner has accepted a DPA or selected a particular retention setting.

#### Evidence checked

- Supabase [Data Residency and Transfers FAQ](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq), [Data Processing Addendum](https://supabase.com/legal/customer-resources/data-processing-addendum), [Subprocessor List](https://supabase.com/legal/customer-resources/subprocessor-list), and [available regions](https://supabase.com/docs/guides/platform/regions).
- Cloudflare [Data Processing Addendum](https://www.cloudflare.com/cloudflare-customer-dpa/) (version 6.4, effective 3 April 2026) and [subprocessor list](https://www.cloudflare.com/gdpr/subprocessors/).
- Google [OAuth 2.0 Policies](https://developers.google.com/identity/protocols/oauth2/policies), [authentication-only scope guidance](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works), and [brand verification guidance](https://developers.google.com/identity/verification/authentication-policy-compliance).
- jsDelivr [Privacy Policy](https://www.jsdelivr.com/terms/privacy-policy), [Data Processing Agreement](https://www.jsdelivr.com/documents/data-processing-agreement.pdf), and [Subprocessor List](https://github.com/jsdelivr/jsdelivr/blob/master/Sub-Processors.md).
- GitHub [Data Protection Agreement](https://github.com/customer-terms/github-data-protection-agreement) and [Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

#### Decisions and safeguards

- Do not change the production or staging database region as part of this phase; region changes would be a separate migration and availability decision.
- Do not copy production user rows to staging.
- Do not add analytics, tracking pixels or extra Google OAuth scopes.
- Keep the feedback workflow copy-first until a deliberate public-issue disclosure or private contact process is approved.
- Prioritise pinning/self-hosting third-party JavaScript and stroke assets in a later implementation branch after compatibility and licensing checks.
- The privacy notice must distinguish the database's selected region from global support, operational logs, CDN delivery and other provider processing.

## 7. Current technical security audit

### 7.1 Supabase baseline

- Production project is active/healthy; PostgreSQL version reported as 17.11.0.003.
- Staging project is active/healthy.
- Production health advisor returned no health lints in this review.
- Security advisor findings include disabled leaked-password protection, two SECURITY DEFINER functions, and RLS-enabled private tables without policies.
- The two SECURITY DEFINER functions are not automatically vulnerabilities. The current application uses public.record_completed_lesson_practice_result() for lesson completion and public.is_personal_learning_test_access() for the owner's test exemption. The reviewed design derives identity from auth.uid(), uses a constrained/empty search path, and limits execution to authenticated users. Preserve the narrow owner-scoped behaviour; inspect complete definitions, ownership and EXECUTE grants during remediation. Do not remove the personal test bypass without a replacement approved by the owner.
- Private-schema tables have RLS enabled and no direct SELECT/INSERT/UPDATE/DELETE grants to anon or authenticated. No policies on those private tables is intentional in the current RPC-only design; do not add broad policies just to silence an advisor warning.
- Public user-owned tables have RLS enabled. The current daily_activity_sessions table has broad table privileges for anon, although RLS is enabled and no anonymous policy was observed. This currently relies on RLS denial, but is excessive privilege. Add a reviewed migration to revoke all unnecessary anon privileges and retain only the authenticated operations actually required by the app.
- The user-owned application tables reference auth.users(id) with ON DELETE CASCADE, including the private Quiz and Flashcards tables. This supports account data cleanup after Auth-user deletion, but does not itself provide a user-facing account-deletion feature.
- No production Edge Functions were listed during the audit.
- Leaked-password protection is disabled. The visible application sign-in UI offers Google OAuth only. Verify the actual Supabase Auth provider configuration; enable leaked-password protection if password-based authentication is enabled or will be used. Do not treat this advisor item as a confirmed exploitable password issue in a Google-only flow.


### 7.4 Phase C — least-privilege migration (staging only, 19 November 2026)

A first database hardening migration was applied to the isolated Singapore staging project only:

- Migration: `20261119112433_swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions`.
- Repository migration file: `supabase/migrations/20261119112433_swiftdictionary_2_6_0_least_privilege_defaults_and_daily_sessions.sql` on `feature/update-2-6-0-legal-privacy-security`.
- `public.daily_activity_sessions`: revoke all table privileges from `anon`; revoke direct DELETE from `authenticated`; preserve authenticated SELECT/INSERT/UPDATE required by the current application and its RLS policies.
- Future objects created by `postgres` migrations in `public`: revoke default table CRUD privileges from `anon` and `authenticated`; revoke default sequence USAGE/SELECT (retain UPDATE); revoke global default function EXECUTE from `PUBLIC` and schema-specific EXECUTE from `anon`/`authenticated`. Future RPC migrations must explicitly grant only the needed operations.
- Remove direct EXECUTE on `public.guard_daily_activity_session_update()` and `public.guard_lesson_progress_update()` from `PUBLIC`, `anon` and `authenticated`; these are trigger-only functions, not RPC endpoints.

#### Validation evidence

- Staging migration history records version `20261119112433` with the expected name.
- Staging `daily_activity_sessions`: anon SELECT/INSERT/UPDATE/DELETE all false; authenticated SELECT/INSERT/UPDATE true and DELETE false.
- Staging trigger-only functions: anon/authenticated EXECUTE false.
- Transactional PostgreSQL tests verified both trigger guards still execute for authenticated-role updates and reject direct/untrusted completion transitions with their expected errors despite direct EXECUTE being revoked.
- A rollback-only probe created a temporary public table, sequence and function and verified that new objects created by `postgres` no longer inherit anon/authenticated table CRUD, sequence USAGE/SELECT or function EXECUTE. The probe transaction was rolled back.
- Staging Security Advisor still reports the eight private-schema RLS-enabled/no-policy informational findings (intentional RPC-only access) and two authenticated SECURITY DEFINER warnings (reviewed, retained because the app requires them). No new finding was introduced by this migration.

#### Important limits and follow-up

- Production remains unchanged; the migration has not been applied there.
- Existing production table/sequence/function grants were not globally rewritten. This migration changes one existing table, trigger-function grants, and defaults for future objects created by `postgres`.
- The separate `supabase_admin` default-privilege entries remain platform-managed. Supabase's current guidance says these cannot be changed by project SQL and that the Data API default-exposure control changes only the `postgres` defaults. Continue creating app schema objects through controlled `postgres` migrations and inspect object ownership/grants.
- No authenticated browser Mock User test was performed yet; full app-level staging smoke tests are still required before production rollout.
- Leaked-password protection remains unverified in the Auth dashboard. The visible app uses Google OAuth only, so the advisor warning should not be treated as proof that a password login path is exposed. Confirm enabled providers before deciding whether to enable the feature.
- The two SECURITY DEFINER RPCs remain callable by authenticated users by design: they have empty search paths and derive the caller from `auth.uid()`; the personal test exemption is retained. Re-review whenever either function changes.


#### Required owner-run staging browser smoke test (after CI passes)

Before considering the migration ready for production, the owner must test a dedicated synthetic Google account against a Cloudflare preview explicitly configured to use the Singapore staging Supabase project. Do not use the production site or a real learner account for this test.

1. Confirm the preview is connected to the staging Supabase URL/project, not the Tokyo production project.
2. Sign in, open Daily Learning and start a session; refresh/reopen and confirm the in-progress session resumes.
3. Complete a Daily Learning activity and confirm completion, result and allowance are saved once.
4. Abandon a separate in-progress activity and confirm it does not consume an allowance.
5. Use **Delete Learning History** after fresh authentication; confirm Daily Activity history is deleted despite direct authenticated DELETE being revoked, while the account, saved words, preferences and custom Flashcard content remain.
6. Complete a permanent lesson and confirm progress still saves.
7. Run one Quiz and one Flashcard session; confirm no regressions in results, review history or allowance.
8. Switch to a second synthetic account; confirm no cross-account data is visible, then switch back.
9. Sign out and verify the signed-out Dictionary still works and no account-scoped data remains visible.

Record any errors and browser console/network failures before authorising a production migration. If no staging-configured Cloudflare preview exists, stop and configure one before browser testing; never point the production site at staging credentials.

### 7.2 Account and learning-history deletion

The Profile currently provides a recent-authentication-gated Delete learning history action. It removes learning history, including lesson/practice records, Daily Learning sessions, Quiz session history, Flashcard sessions/mastery/review records, while preserving the account, saved words, profile/preferences and user-created Flashcard collections/cards. Daily allowance usage already consumed remains unchanged until reset.

There is no current user-facing Delete account action or account-deletion Edge Function/RPC. The FK cascade is present, so a secure server-side workflow can delete the Auth user and associated rows. It must:
- require recent re-authentication and an explicit irreversible confirmation;
- derive the target UID from the authenticated request, never from a client-supplied user ID;
- call the Supabase Auth Admin API only from a trusted server-side function;
- never expose a service-role/secret key in browser code or public repository files;
- handle any future Storage objects and external provider data separately;
- clear local browser state, sign out, and verify deletion/cascade behaviour;
- document backup/log expiry and residual JWT/session behaviour accurately.

Deleting a SwiftDictionary account must not be described as deleting the person's Google account.


#### Proposed secure account-deletion architecture (design only; not implemented)

Supabase's current User Management guidance warns that deleting an Auth user does not automatically invalidate already-issued JWT access tokens; those tokens can remain valid until expiry. It also warns that deletion can fail if the user owns Storage objects. The current SwiftDictionary application does not currently use a user-uploaded Storage feature in the reviewed product flow, but the deletion workflow must check again before implementation.

Recommended implementation contract:

1. Add a signed-in-only **Delete account** action in Profile, separate from **Delete learning history**. Explain that it permanently deletes the SwiftDictionary account and all account-linked data, including saved words, profile/preferences, lesson progress, Daily Learning history, Quiz history/answer snapshots, Flashcard collections/cards/mastery and allowances. It does not delete the user's Google account.
2. Require a fresh Google sign-in/re-authentication and an explicit irreversible confirmation. Reuse the existing 15-minute recent-authentication pattern only after confirming that the new session's `session_id` and `created_at` are refreshed by the OAuth flow.
3. Call a dedicated Supabase Edge Function (proposed name `delete-my-account`, JWT verification enabled). The function must verify the bearer token with Supabase Auth, derive the target UID from the verified user, and reject any client-supplied target UID. The function must use the service-role secret only in server-side environment secrets; never include it in the browser bundle or repository.
4. Revoke all refreshable sessions before deletion, then call the Auth Admin delete-user operation for the verified UID. Treat partial failure safely: do not show success unless the Auth deletion is confirmed; return a retry-safe error if session revocation succeeded but deletion failed.
5. Verify every user-owned foreign key uses the intended `ON DELETE CASCADE` behaviour. Handle any future Storage objects explicitly before deleting the Auth user. Never delete or mutate another account's data.
6. After confirmed deletion, clear the current browser's SwiftDictionary auth session and account-scoped local state, then return to signed-out Dictionary. Decide explicitly whether signed-out local saved words should also be cleared on this browser; that data is browser-local and not deleted by the server cascade.
7. Document residual access-token lifetime, provider backups, operational logs and backup expiry accurately. Revoking sessions does not justify promising instantaneous erasure of every previously issued access token or every provider backup copy. For strict immediate denial on sensitive server operations, consider validating the JWT `session_id` against `auth.sessions` or checking account existence in addition to `auth.uid()`.
8. Validate on staging with synthetic accounts: recent-auth requirement, wrong/missing JWT, user-ID spoof attempt, all-session revocation, account deletion, cascade completeness, retry after partial failure, stale-token behaviour, local-state clearing and cross-account isolation.

**Decision gate:** this architecture is a technical proposal, not an approved user-facing flow. No account-deletion function, UI, Auth configuration or production change has been created. The exact local-storage clearing behaviour and reauthentication UX remain owner decisions.

#### Retention schedule — current status

No numeric retention period has been approved. Do not invent one in the Privacy Notice. The schedule must cover at least:

- Auth/account identity, profile and preferences.
- Saved words and private custom Flashcard collections/cards.
- Lesson progress, practice summaries and Daily Learning sessions (including abandoned sessions).
- Quiz question/session snapshots, selected answer IDs and result history.
- Flashcard mastery, review items and game sessions.
- Provider access/security logs and CDN request metadata.
- Supabase database backups, PITR/backups (if enabled), Cloudflare build/request logs, Google account/identity data and GitHub issues.

For each category, record purpose, active-system retention, user deletion control, backup expiry, provider-controlled retention and any legal hold/exception. User-triggered learning-history deletion removes the active history rows but is not a promise of immediate removal from provider backups or logs. GitHub issues manually created in a public repository remain subject to GitHub/repository visibility and retention controls. Final periods require provider-account verification, legal review and owner approval.

### 7.3 Frontend, dependencies and content injection

- The browser loads @supabase/supabase-js@2 from jsDelivr using a floating major-version URL. Pin an exact tested version and add Subresource Integrity where practical, or self-host the pinned file.
- Hanzi Writer is pinned to version 3.7.3 and its stroke data to 2.0.1. Keep these version references explicit and verify upstream licence/notice terms before bundling, modifying or redistributing.
- mock-testing.js is included in the production HTML, but its adapter is gated by an explicit swiftMock=1 and an allowlist of testing preview/local hosts. The production host is not in that allowlist. Keep this boundary covered by tests; consider excluding test-only code from production builds.
- Flashcards renders dynamic HTML. The reviewed user-authored front/back/example/translation fields are escaped in the observed collection/card rendering paths. Continue security tests for stored XSS, attribute injection and malformed content as new rendering paths are added.
- THIRD_PARTY_NOTICES.md and ARPHICPL.TXT exist in the repository, but the website footer does not currently link to a third-party notices/licensing page. Add a visible attribution/licence link.
- The site has no Privacy Policy or Terms of Service link in the current footer. A draft exists in docs/reference/PRIVACY-POLICY-DRAFT.md, but it is stale and must not be published as-is.

## 8. Prioritised remediation register

| Priority | Finding / work | Planned response |
|---|---|---|
| P0 — before broader external onboarding | No current published privacy notice/terms and no verified controller contact | Confirm controller identity/contact; prepare accurate Bahasa Malaysia and English privacy notice; prepare Terms of Service; publish only after legal review |
| P0 — before broader external onboarding | Old privacy draft is inaccurate for current Quiz data | Replace the 2.3.0-era draft with a current data map, provider list, purposes, rights, retention and transfer description |
| P1 — high | Malaysia PDPA applicability, DPO and registration status unresolved | Obtain Malaysian legal opinion; specifically assess commercial-transaction scope, personal exemption, DPO monitoring criterion and 13-class registration |
| P1 — high | Cross-border provider locations/terms not fully verified | Complete provider/subprocessor map and Section 129 transfer assessment |
| P1 — high | No account deletion workflow | Implement secure server-side Auth-user deletion using Admin API; test cascade and local state cleanup |
| P1 — high | No documented retention schedule for session history, custom cards, logs and backups | Agree retention by category; implement only where needed; do not promise immediate backup erasure |
| P1 — high | No documented breach-response process | Establish incident owner, detection/escalation, processor notification, breach register and 72-hour assessment/notification workflow |
| P1 — high | anon has unnecessary privileges on daily_activity_sessions | Add a migration revoking anonymous table privileges; validate authenticated operations in staging |
| P1 — high | DPO/DPIA and 16–17-year-old safeguards need assessment | Complete DPO threshold and DPIA screening; apply privacy-by-default controls |
| P2 — medium | Floating Supabase JS CDN dependency | Pin exact version, add integrity checks and monitor updates |
| P2 — medium | Third-party notices not linked from website | Add visible legal/licence page and footer link |
| P2 — medium | Feedback-to-GitHub destination/visibility is unclear on Cloudflare Pages | Use a stable repository destination, disclose public issue visibility, and offer copy-only/private route if appropriate |
| P2 — medium | Production includes mock-testing adapter | Keep host/parameter guard and CI test; preferably exclude from production build |
| P2 — medium | Security headers/CSP not yet independently verified | Review Cloudflare Pages _headers; add suitable HSTS, frame, MIME, referrer and permissions controls; deploy CSP in report-only first and tighten without breaking inline application scripts |
| P2 — medium | Leaked-password protection advisor warning | Confirm whether password auth is enabled; enable protection if applicable |
| Ongoing | Content and dependency licensing | Keep source/provenance register, preserve MIT and Arphic notices, reassess commercial use and future bundling |

Priorities are planning labels, not a legal risk rating.

## 9. Proposed Update 2.6.0 work sequence

### Phase A — Legal applicability and operator facts

1. Confirm the person/entity that operates the service and who determines processing purposes.
2. Obtain a Malaysian lawyer's view on Act 709 scope, section 45 exemption, registration class and DPO criterion.
3. Decide whether EU/EEA and UK users are intentionally included in the global target market; complete GDPR/UK GDPR applicability screening.
4. Confirm the 16+ audience and whether to add a minimal age confirmation without collecting exact date of birth.
5. Complete a DPIA screening and cross-border transfer assessment.

### Phase B — Data governance

1. Finalise a current data inventory and purpose/basis map.
2. Confirm each provider's contractual role, processing locations, subprocessors, support access, logs, backups and retention.
3. Agree retention periods for account/profile, saved words, learning history, custom cards, allowances, logs and backups.
4. Define user access, correction, portability (where applicable), learning-history deletion and account-deletion request procedures.
5. Create a breach-response playbook and minimal request/incident register.

### Phase C — Technical safeguards

1. [Staging migration completed] Revoke unnecessary anonymous privileges on daily_activity_sessions and tighten postgres default privileges; complete authenticated browser smoke tests before production approval.
2. Re-review SECURITY DEFINER functions, ownership, search path, EXECUTE grants and caller identity checks. The two lesson/test-exemption functions were reviewed and intentionally retained for authenticated callers; their warning remains documented.
3. Verify Auth provider configuration and harden it appropriately.
4. Pin CDN dependencies, add integrity protections, review security headers/CSP and remove test-only production code where feasible.
5. Implement server-side account deletion with recent re-authentication and cascade verification.
6. Test cross-account isolation, RLS, stored-XSS protections, session lifecycle, deletion, backups and restoration.

### Phase D — Public legal documents and disclosures

Prepare:
- Privacy Notice in Bahasa Malaysia and English; Simplified Chinese may be added for accessibility but does not replace the two required languages if Act 709 applies.
- Terms & Conditions (Terms of Service). Publish its link in the bottom-page footer alongside **Feedback & Suggestions**, not in the primary navigation; activate the link only after the Terms are reviewed and published.
- Acceptable-use and user-content rules for private custom Flashcards.
- Educational-information disclaimer that does not overclaim learning outcomes or certification.
- Third-party notices/licensing page.
- Clear contact and privacy-request route.

The notice must describe current Quiz answer IDs/question snapshots and current Flashcards custom content/mastery. It must distinguish learning-history deletion from account deletion and must not promise that deleting an account immediately erases provider backups.

### Phase E — Validation and release

1. Run static/source security checks and automated tests.
2. Validate database migrations and account-deletion behaviour in local/disposable PostgreSQL and isolated Supabase staging.
3. Verify Google sign-in, account switching, data isolation, access requests, history deletion and account deletion with synthetic Mock Users.
4. Verify Cloudflare headers, public legal links, feedback disclosure and third-party notices on the deployed preview.
5. Obtain owner review and any required qualified legal review.
6. Merge/deploy only after the owner approves the release gate. Production migrations and settings changes remain separately gated.

## 10. Decisions deliberately not made yet

- Whether Act 709 legally applies to the current free, individually operated service.
- Whether a DPO is required due to adaptive learner-progress monitoring.
- Whether a formal registration class applies to the actual operator/activity.
- Whether EU/EEA and UK residents are actively targeted and which international requirements therefore apply.
- Final controller identity, public contact address and privacy email.
- Exact retention periods, backup expiry and security-log periods.
- Whether to use a 16+ age declaration, stronger age controls or another approach.
- Whether GitHub issues remain the feedback channel or are replaced by a private contact route.
- Any Premium terms, billing, cancellation, refunds or payment-provider processing.

These require facts, legal advice or owner decisions. Do not invent operator identity, contact details, retention periods or provider contractual commitments.

## 11. Official and primary reference sources

### Malaysia

- [Personal Data Protection Act 2010 (Act 709), current reprint and materials](https://www.pdp.gov.my/en/akta/pdp-act-2010-en/)
- [Personal Data Protection (Amendment) Act 2024](https://www.pdp.gov.my/en/akta/personal-data-protection-amendment-act-2024/)
- [Application and Non-Application of Act 709](https://www.pdp.gov.my/en/akta/application-and-non-application-of-the-act/)
- [Commissioner's FAQ — DPO criteria and registration](https://www.pdp.gov.my/en/faq/)
- [Commissioner's Circular No. 1/2026 — Registration of Data Controllers](https://www.pdp.gov.my/en/akta/personal-data-protection-commissioners-circular-no-1-2026-registration-of-data-controllers/)
- [Personal Data Protection (Class of Data Users) Order](https://www.pdp.gov.my/en/akta/personal-data-protection-order-class-of-data-users/)
- [DPO Guidelines](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-the-appointment-of-data-protection-officer-dpo/)
- [Data Breach Notification Guidelines](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-data-breach-notification-dbn/)
- [Cross-Border Transfer Guidelines](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-cross-border-transfer-of-personal-data-cbpdt/)
- [Data Protection Impact Assessment Guideline](https://www.pdp.gov.my/en/akta/data-protection-impact-assessment-guideline-dpia/)
- [Data Protection by Design Guideline](https://www.pdp.gov.my/en/akta/data-protection-by-design-guideline-dpbd/)
- [Automated Decision-Making and Profiling Guideline](https://www.pdp.gov.my/en/akta/automated-decision-making-and-profiling-guideline-admp/)
- [Quick Guide to Privacy Notice](https://www.pdp.gov.my/wp-content/uploads/2025/01/A-Quick-Guide-to-PRIVACY-NOTICE.pdf)
- [Online Safety Act 2025 (Act 866)](https://lom.agc.gov.my/ilims/upload/portal/akta/outputaktap/2867049_BI/Act%20866-Online%20Safety%20Act%202025.pdf)

### International child/privacy references

- [European Commission — GDPR territorial applicability](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/application-gdpr_en)
- [European Data Protection Board — Guidelines 3/2018 on GDPR territorial scope](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en)
- [European Commission — children's personal data and consent ages](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)
- [UK ICO — services covered by the Children's Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/services-covered-by-this-code/)
- [UK ICO — Children's Code standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/)
- [US FTC — COPPA Rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)


### 7.5 Phase D — private feedback inbox proposal and staging environment verification (19 November 2026)

#### Feedback without requiring GitHub accounts — recommended design, not implemented

The current `feedback.html` is a static form that prepares a GitHub issue. It explicitly tells visitors that submitting requires a GitHub account, and on the Cloudflare Pages hostname its old GitHub Pages host/path detection cannot identify the repository, so the form falls back to a generic GitHub Issues page. This is not a good public feedback experience.

Recommended replacement:

- Keep **Feedback & Suggestions** as a public footer link and public submission page. Visitors should be able to submit feedback without a GitHub account or SwiftDictionary account.
- Store feedback privately in Supabase, not as a public GitHub issue. A submission should contain only the category, optional word/page, message, timestamp and status. Do not collect a name or account identifier by default. An optional reply email may be offered only if the user wants a response.
- Build a **Feedback Inbox** section inside Profile, but render it only for the project owner. Authorise the owner using a trusted `app_metadata` role/claim configured server-side; never use editable `user_metadata`, a client-supplied UID, or a hard-coded email comparison as the security boundary.
- Do not grant ordinary users SELECT access to the feedback table. Route submission through a small server-side Edge Function with JWT verification for signed-in submitters, optional anonymous submission, input validation, spam/rate limiting and a challenge such as Cloudflare Turnstile. The function should insert a sanitised record. Owner reads/updates/deletes should use a verified owner claim and narrowly scoped server-side access or a private-schema/RPC design.
- Add a short notice explaining that the message is visible to the SwiftDictionary operator, what fields are collected, that feedback is not public, and that users should not include passwords or sensitive personal data. If reply email is offered, explain its purpose and retain it only as long as needed to respond.
- Define a retention and deletion process for feedback. The message may contain personal data even if the form does not ask for it; private storage does not remove applicable data-protection obligations. Keep provider request logs and abuse-prevention metadata separate from the feedback content and disclose provider retention accurately.
- Add abuse handling, report/delete controls, and a practical way for a submitter to request correction/deletion. Consider anonymous feedback availability alongside signed-in feedback, rather than forcing account creation.

**Privacy assessment:** collecting feedback privately is not inherently a personal-data violation. However, free-text messages and optional contact details may contain personal data. The operator still needs an appropriate notice, purpose limitation, security, retention and request-handling process, and the applicability of Malaysia's PDPA and any other relevant laws must be confirmed. This is safer than sending feedback into a public repository, but not automatically exempt from privacy law.

The design is a proposal only. No feedback table, Edge Function, Profile inbox or UI change has been implemented. The user has not yet approved the exact form fields, optional reply-email field or retention period.

#### Staging project and preview findings

- Supabase project `SwiftDictionary Indie Staging` exists, is `ACTIVE_HEALTHY`, and is hosted in Singapore (`ap-southeast-1`). It was created on 17 November 2026; a second staging project is not needed.
- Production remains the separate `SwiftDictionary` project in Tokyo (`ap-northeast-1`).
- Staging currently has zero Auth users and no deployed Edge Functions. Its schema and content catalogue/Quiz bank are populated with release data; no real learner accounts were copied.
- Staging has the Update 2.6.0 migration recorded. Its project-specific publishable key is available and distinct from production. Only a public publishable key may be placed in a browser preview; service-role/secret keys must never be used client-side.
- GitHub Actions run [#44514979573](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44514979573) completed successfully. Both jobs passed, including local Supabase Auth/RPC integration, applying the 2.6.0 migration, privilege assertions, authenticated Chromium Quiz runtime tests and local security-advisor checks.
- A dedicated Cloudflare Pages preview configured to use staging has **not** yet been verified. The repository's current `supabase-config.js` hard-codes the production project URL and public key. Do not deploy the implementation branch as a browser preview until a separate preview configuration explicitly selects the staging project and the resulting hostname is verified. The Cloudflare Pages project name/settings and preview environment configuration must be inspected in the owner's Cloudflare dashboard; the connected tools available in this session do not expose that account configuration.
- Staging remains safe for the next test, but owner-run browser tests still need a confirmed staging-configured preview. Do not point the production site at staging credentials.


### 7.6 Phase E — production-vs-staging privilege comparison (read-only, 19 November 2026)

A second read-only audit compared effective PostgreSQL privileges and ACLs on the two Supabase projects. No SQL changes were made in this phase.

#### Confirmed production residual grants

- `public.daily_activity_sessions` is owned by `postgres` and has broad ALL privileges for both `anon` and `authenticated`, including SELECT/INSERT/UPDATE/DELETE and non-DML privileges. This is the principal existing table-grant issue. The staged migration removed all anon privileges and removed authenticated DELETE; production remains unchanged.
- Anonymous role has USAGE/SELECT/UPDATE on four public sequences: `learning_activity_log_id_seq`, `lesson_practice_results_id_seq`, `lesson_practice_results_id_seq1`, and `lesson_progress_id_seq`. No anonymous sequence access was observed on `saved_words_id_seq`. These grants appear unnecessary for the current application and should be reviewed for removal in a follow-up migration.
- Anonymous SELECT on `public.languages` and `public.learning_plan_limits` is intentional/public configuration access; preserve unless application review proves otherwise.
- Anonymous EXECUTE is limited to the two trigger-only guard functions `guard_daily_activity_session_update()` and `guard_lesson_progress_update()`. The staging migration removes these direct EXECUTE grants and the authenticated grants while preserving trigger execution. Production still has them until a migration is approved and applied.
- Existing authenticated RPC EXECUTE grants match between production and staging for the reviewed public functions. The two required SECURITY DEFINER RPCs remain authenticated-only.
- Production `postgres` default privileges in `public` still grant broad table CRUD, sequence privileges and function EXECUTE to API roles. The staging migration tightens these defaults for future objects created by `postgres`; production is unchanged.

#### Staging caveats

- The staging migration is applied and CI has passed, but the staging project is not a perfect byte-for-byte ACL clone of production. Several older/bootstrap-created tables still carry non-DML privileges (TRUNCATE, REFERENCES, TRIGGER and PostgreSQL 17 MAINTAIN) for API roles. These are not the same as row-level Data API CRUD, but should be explicitly reviewed and removed where not required before calling the entire schema least-privilege.
- Supabase platform-owned `supabase_admin` default ACLs remain outside the project's SQL control. The migration only changes defaults for objects created by `postgres`; object owner and ACL must be inspected for each future migration.
- The staging project currently has zero Auth users and no deployed Edge Functions. Google OAuth provider configuration and redirect URLs were not verifiable through the available project tools. A real browser smoke test therefore still requires the owner to confirm/configure the staging OAuth callback and Cloudflare preview environment.

#### Next remediation scope — prepare and stage only

1. Add a follow-up migration to revoke the unnecessary anonymous sequence privileges in production and staging, preserving any authenticated sequence permissions proven necessary by actual INSERT paths/triggers.
2. Revoke all privileges on `daily_activity_sessions` from API roles, then explicitly grant only authenticated SELECT/INSERT/UPDATE. This also removes production's extra TRUNCATE/REFERENCES/TRIGGER/MAINTAIN rights rather than only DELETE.
3. Remove direct EXECUTE from the two trigger-only guards in production when rollout is approved; retain trigger functionality.
4. Review existing non-DML table grants across all public tables and remove only those that are confirmed unnecessary. Do not blindly revoke SELECT on public language/plan configuration.
5. Do not apply any of these changes to production until owner approval and a complete staging/browser regression pass.


### 7.7 Phase F — provider processing and cross-border data-flow review (19 November 2026)

This is a public-document review combined with the live project-region/configuration facts confirmed above. It is not a substitute for inspecting the owner's paid/free plan, account agreements, Cloudflare project settings or provider dashboards.

#### Supabase

- Production primary project region: Tokyo, Japan (`ap-northeast-1`). Staging: Singapore (`ap-southeast-1`). Supabase states that the chosen project region hosts the primary Postgres database, Auth service, Storage and backups.
- Supabase's Data Residency and Transfers FAQ (version 1, 6 October 2026) states that the chosen region is not a promise that all processing remains there. Customer account/configuration/billing data may be processed in central systems outside the project region; support access can be global; usage information, telemetry, logs and service metadata may be processed outside the region (the FAQ identifies EU-based log storage); Storage content may be served/cached globally if Storage is used.
- Supabase identifies Supabase Pte. Ltd. (Singapore) as the primary processor under its agreements and Supabase, Inc. (US) for technical support/operations where needed. The FAQ says SCCs are used for EU/UK/Swiss transfers to Singapore and the US; this does not automatically settle the Malaysian PDPA Section 129 analysis.
- Supabase says database retention lasts while the project is active; project deletion removes Customer Data within 30 days. Backup retention depends on plan; paid plans have daily backup periods, while free projects are recommended to export backups. The exact current plan and backup settings for SwiftDictionary have not been verified; do not put numeric backup retention in the Privacy Notice yet.
- Obtain/download the current DPA, subprocessor list and relevant transfer documentation from the account's legal/trust hub. Confirm plan, backup/PITR configuration, log retention and support access. Do not assume the project region alone resolves cross-border transfer obligations.

#### Cloudflare Pages / network

- Cloudflare's public Privacy Policy describes Cloudflare as a processor for Customer Logs and content that transits or is stored on its network, while Cloudflare also acts as controller for certain account and service data. It says Cloudflare is a US-based global company and information is primarily stored in the US and EEA, with global access/transfers for operations.
- Cloudflare's Singapore PDPA FAQ says metadata about network activity is processed in US and European data centres and may include visitor IP addresses for a limited period. This is relevant even if SwiftDictionary itself does not use analytics or advertising cookies.
- Obtain the current Cloudflare DPA and subprocessor list; inspect which Pages/Workers/Turnstile/analytics/logging products are enabled, what request logs are retained, whether Logpush or analytics are configured, and account-level retention. Do not infer exact retention from generic marketing or policy pages.
- The Cloudflare Pages preview is not yet configured/verified. Do not use a production Supabase config in a preview.

#### Google OAuth

- Google states that Sign in with Google shares the user's name, email address and profile picture after permission; it does not share the Google account password. The app uses these attributes for account identity/profile. No additional Google API scopes should be requested unless a feature genuinely needs them.
- Verify the actual requested OAuth scopes and the staging OAuth callback/redirect configuration in Google Cloud Console. The connected tools do not expose that project configuration.
- Account deletion at SwiftDictionary must be explained separately from disconnecting the app in Google Account settings; removing a Google link does not itself delete app-held data.

#### GitHub feedback

- The current feedback page prepares a GitHub issue. This creates a public-repository disclosure path and requires a GitHub account; it is being replaced in the proposal by a private feedback inbox. Until replaced, visitors should be warned not to submit personal/sensitive details through public GitHub issues.
- GitHub repository visibility, issue retention, moderation and any user-data requests must be checked in the GitHub account. The project should not use public issues as a private support mailbox.

#### Data-flow conclusion and legal action

- The current architecture includes at least Japan (production database/Auth/backups), Singapore (staging database/Auth/backups), the US and EEA (Cloudflare network metadata and provider operational processing; Supabase central operational/log processing), and potentially global support/subprocessor locations. Google OAuth provides basic identity attributes. Exact Cloudflare Pages storage/processing and provider log retention remain account-level verification items.
- Malaysia PDPA cross-border transfer assessment is still required if Act 709 applies. The chosen database region is only one part of the transfer map; provider support, logs, account metadata and subprocessors also matter. Obtain the actual DPAs/subprocessor lists and record the relevant transfer mechanism/safeguards before finalising the notice.
- No provider settings or production configuration were changed by this review.

## 12. Release position

The current application has meaningful privacy protections already: account-scoped data, RLS on application tables, private-schema tables without direct browser grants, owner-scoped RPC patterns, no analytics/ad-tracking code found in the source reviewed, and a user-facing learning-history deletion control.

However, this is not yet a complete legal/privacy/security foundation. The privacy notice is stale, Terms of Service are absent, account deletion is not self-service, retention and provider transfer details remain unresolved, and the anonymous grant on daily_activity_sessions has been removed in staging but remains unchanged in production pending approval.

**No production settings, schema, data, OAuth configuration or deployments were changed by this review.** The staging-only migration and implementation branch are recorded above. The next implementation work must proceed through reviewed code changes and staging validation; no production migration or deployment is authorised by this document.


### 7.8 Phase G — ACL re-verification and staging gap analysis (read-only, 19 November 2026)

A targeted re-check of effective PostgreSQL ACLs confirmed the exact staging state and identified one residual gap that the earlier Phase E summary did not isolate:

- Production `public.daily_activity_sessions` still has broad anon/authenticated privileges; staging has only authenticated SELECT/INSERT/UPDATE and no anon grant.
- Production anon retains SELECT/UPDATE/USAGE on four sequences. Staging has removed anon SELECT/USAGE, but **anon UPDATE remains on three sequences**: `learning_activity_log_id_seq`, `lesson_practice_results_id_seq`, and `lesson_progress_id_seq`. The duplicate `lesson_practice_results_id_seq1` has no anon grant in staging.
- Production's two trigger-only guard functions still grant EXECUTE to PUBLIC, anon and authenticated. Staging has no PUBLIC/anon/authenticated EXECUTE grant for these guards. Any production revocation must include PUBLIC; removing only the explicit API-role grants would leave inherited execution.
- Staging still has TRUNCATE/REFERENCES/TRIGGER/MAINTAIN on eight older/bootstrap-created public tables. Review each object individually; do not confuse these object privileges with RLS row visibility, and preserve intentional anon/authenticated SELECT on `languages` and authenticated-only SELECT on `learning_plan_limits`.
- Staging's `postgres` default ACLs no longer show the broad anon/authenticated defaults seen in production. Platform-owned `supabase_admin` defaults remain outside project-level control.

No data was read and no database writes or migrations were performed. The follow-up migration must be generated using the Supabase CLI workflow; the CLI is unavailable in this environment, so no migration filename was fabricated. Production remains untouched pending complete staging validation and explicit approval. See [Phase G archive](conversation-archive/2026-11-19-update-2-6-0-phase-g-acl-reverification.md) for the detailed result and revised remediation sequence.


### 7.9 Phase H — Cloudflare Pages project and backend routing (19 November 2026)

The owner supplied the Cloudflare Pages dashboard URL, confirming the project slug `swiftdictionary`. The dashboard settings themselves have not yet been inspected or changed.

To make the eventual preview safe, the implementation branch now contains a build-time router. It uses Cloudflare's `CF_PAGES_BRANCH`: `main` must use the Tokyo production project, while every non-main preview branch must use the Singapore staging project. It requires environment-specific `SWIFT_SUPABASE_URL` and `SWIFT_SUPABASE_PUBLISHABLE_KEY` variables and fails closed on missing variables, wrong project URL, missing branch identity or non-publishable key. Local development keeps the checked-in config unchanged.

Added `build.sh`, `tests/cloudflare-build-routing.sh` and `.github/workflows/cloudflare-build-routing.yml`. Local shell validation passed; GitHub Actions run #44518836358 passed. Commits: `b6d6f697e9bdceb0bcb443a0ece6d8f8caf42246`, `91dcb80a090de67d5eacd115904af5f0999d2993`, `2544083fe67773512f528f2ec941b16d13cf55c8`.

Remaining dashboard work: confirm `main` as production branch; enable preview builds for the 2.6.0 feature branch; set build command `bash build.sh` and output directory `.`; set separate Production and Preview environment values; verify the staging preview hostname and add it to staging Supabase Auth Redirect URLs; add the staging Supabase Auth callback URI to Google OAuth. No Cloudflare settings, Supabase Auth settings, production build or production deployment were changed. See the [Phase H archive](conversation-archive/2026-11-19-update-2-6-0-phase-h-cloudflare-routing.md).


### 7.10 Phase I — staging ACL follow-up and live advisor review (20 November 2026)

The follow-up ACL migration has now been applied to the isolated Singapore staging project `ivatvkfrtifgfheeaelj`. Production was not modified.

#### Migration and validation

- Repository migration: `supabase/migrations/20261120023718_update_2_6_0_remove_residual_api_privileges.sql`.
- Staging migration history records `20261120023718_update_2_6_0_remove_residual_api_privileges`.
- The migration revokes TRUNCATE, REFERENCES, TRIGGER and MAINTAIN from `anon` and `authenticated` on the eight reviewed legacy tables, and revokes anonymous UPDATE on the three identified sequences.
- It preserves the existing DML grants and RLS policies, anonymous/authenticated SELECT on `languages`, and authenticated-only SELECT on `learning_plan_limits`.
- The post-migration ACL assertion test ran directly against hosted staging and passed. A separate effective-ACL query returned no remaining targeted grants.
- GitHub Actions run [#44655246355](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44655246355) passed after applying the committed migration in disposable local Supabase CI and running the authenticated Quiz/RPC/Chromium regression workflow.
- A repository filename mismatch was caught and corrected: the migration file now uses the exact version recorded in hosted staging, `20261120023718`, so future CLI migration history will not treat it as a separate pending migration.

#### Current staging Security Advisor

After the migration, the Security Advisor reports:

- Eight INFO findings for private-schema tables with RLS enabled and no policies. This is intentional: `anon` has no USAGE on `private`, and authenticated users have no direct table DML grants; access remains through narrowly granted RPCs.
- Two WARN findings for authenticated execution of `public.is_personal_learning_test_access()` and `public.record_completed_lesson_practice_result(...)`. Both are intentional SECURITY DEFINER RPCs required by the application. Their caller identity, empty search path, ownership checks and grants must remain covered by regression tests; do not revoke them just to silence a generic warning.
- No health lints.
- Performance findings: ten unindexed foreign keys, four RLS initplan suggestions and ten unused-index suggestions. These are not evidence of an ACL regression. Do not drop indexes based only on synthetic staging usage; assess query plans and workload before making changes.

The migration removes the specific residual privileges in scope; it does not make staging a byte-for-byte ACL clone of production or complete the entire security review. Production still requires its own separate, reviewed remediation and explicit owner approval.

#### Preserved DML and RLS matrix

The migration does not change ordinary Data API DML or RLS policies. `languages` remains readable by anon and authenticated users under the active-language policy. `learning_plan_limits` remains readable by authenticated users only. Authenticated SELECT-only access remains on `learning_activity_log`, `learning_plan_limits`, `lesson_practice_results` and `user_entitlements`; authenticated SELECT/INSERT/UPDATE remains on `lesson_progress`, `profiles` and `user_preferences`, with owner checks based on `auth.uid()`.

#### Remaining staging work

- Confirm Cloudflare Pages Preview settings and a dedicated staging preview hostname in the owner's dashboard.
- Add the preview hostname to the staging Supabase Auth redirect allowlist and configure the Google OAuth callback through the owner's own Google Cloud Console.
- Run owner-led browser smoke tests with synthetic accounts only.
- Continue the separate account-deletion implementation and retention verification before the legal-document release gate.

No production SQL, Auth settings, Cloudflare settings, OAuth configuration, merge or deployment was changed.

### 7.11 Phase J — legal-document drafting and release-readiness review (20 November 2026)

#### Work completed

Three new working documents were created on `docs/master-development-record`:

- `docs/reference/PRIVACY-NOTICE-DRAFT-2026-11-20.md` — bilingual Bahasa Malaysia/English working draft using the current Update 2.5.0 data inventory, including Quiz selected option IDs and question snapshots, Flashcard user-created content/mastery, browser local storage and the current Cloudflare/Supabase/Google/jsDelivr/GitHub provider map.
- `docs/reference/TERMS-OF-USE-DRAFT-2026-11-20.md` — service scope, 16+ eligibility, accounts, current free model and learning limits, acceptable use, private user-created Flashcard content, intellectual property, educational limitations, availability, privacy separation, termination and Malaysia governing-law proposal.
- `docs/reference/DATA-RETENTION-SCHEDULE-DRAFT-2026-11-20.md` — category-by-category retention register covering account data, saved words, learning history, Quiz answer snapshots, Flashcards, allowance state, provider logs, CDN requests, feedback, builds and backups.

The earlier `docs/reference/PRIVACY-POLICY-DRAFT.md` is a superseded 2.3.0-era draft and must not be published. It contains inaccurate statements about Quiz answer storage and older provider/deployment details.

#### Legal baseline rechecked

The current official Act 709 reprint (15 September 2026), JPDP guidance and the 2013 Regulations were rechecked. The draft work reflects:

- Section 7 notice content and the Bahasa Malaysia/English language requirement, if Act 709 applies.
- Regulation 3(3): where consent under Regulation 3 is required for a data subject under 18, it must be obtained from a parent, guardian or person with parental responsibility; a 16+ self-declaration does not resolve this.
- The DPO criteria, including regular and systematic monitoring as a distinct criterion not tied to a minimum user count.
- Section 43A data portability, subject to statutory conditions and technical feasibility.
- Section 129 cross-border transfer conditions under the amended Act, together with JPDP guidance.
- Data-breach notification and DPIA screening requirements under current JPDP materials.

Primary sources include the [2026 Act 709 reprint](https://www.pdp.gov.my/en/akta/personal-data-protection-act-2010-reprint/), [2013 Regulations](https://www.pdp.gov.my/en/akta/personal-data-protection-regulations-2013/), [DPO guidance](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-the-appointment-of-data-protection-officer-dpo/), [cross-border transfer guidance](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-cross-border-transfer-of-personal-data-cbpdt/), [breach-notification guidance](https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-data-breach-notification-dbn/) and [DPIA guidance](https://www.pdp.gov.my/en/akta/data-protection-impact-assessment-guideline-dpia/).

#### Items deliberately not finalised

- Whether Act 709 applies to this free, individually operated public service and whether any exemption applies.
- The processing basis for each purpose and the Regulation 3(3) approach for users aged 16–17.
- Controller identity/capacity and a safe, monitored public privacy contact route.
- Verified provider contract status, exact subprocessors, transfer assessment and provider-specific log/backup retention.
- Numeric retention periods and operational account-deletion workflow.
- Whether a DPO is required due to adaptive learning/progress monitoring and whether a DPIA is required.
- Final enforceability review of Terms, limitation clauses, governing law and user-content licence.
- Publication and acceptance UX. Neither document is published or accepted by users.

The drafts are internal review artifacts only. Do not add them to the public footer or present them as final legal advice until owner decisions and qualified legal review are complete.
