# Update 2.6.0 — Legal, Privacy, Safety & Security Blueprint

**Review date:** 19 November 2026  
**Status:** Initial legal research and provider/data-flow review completed; first least-privilege database migration applied and verified in staging; production remediation remains pending owner approval.  
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
- Terms of Service. Publish its link in the bottom-page footer alongside **Feedback & Suggestions**, not in the primary navigation; activate the link only after the Terms are reviewed and published.
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

## 12. Release position

The current application has meaningful privacy protections already: account-scoped data, RLS on application tables, private-schema tables without direct browser grants, owner-scoped RPC patterns, no analytics/ad-tracking code found in the source reviewed, and a user-facing learning-history deletion control.

However, this is not yet a complete legal/privacy/security foundation. The privacy notice is stale, Terms of Service are absent, account deletion is not self-service, retention and provider transfer details remain unresolved, and the anonymous grant on daily_activity_sessions should be hardened.

**No production settings, schema, data, OAuth configuration, deployments or branches were changed by this review.** The next implementation work must proceed through reviewed code changes and staging validation; no production migration or deployment is authorised by this document.
