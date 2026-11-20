# Update 2.6.0 — allowance notification CI compatibility and legal-review deferral

Date: 2026-11-20

## Owner confirmation

The owner tested the updated Singapore staging preview and reported no issues. Account deletion completes and signs the user out as intended. This is the owner’s manual staging acceptance for the tested account-deletion flow and current UI behaviour.

## Allowance notification CI diagnosis and fix

The earlier local Supabase/Auth/RPC browser workflow failed two Daily Learning notification assertions:
- Permanent Lessons allowance exhaustion notification.
- Daily Topic allowance exhaustion notification.

The tests use a lightweight Supabase adapter whose `rpc()` returns native JavaScript Promises. The application’s allowance observer previously decorated the Supabase RPC builder's custom `.then()` method. Awaiting a native Promise uses Promise assimilation and bypasses that overridden method, so the notification observer did not run in the test adapter.

The feature branch was updated to attach a passive observer to native Promise RPC results while preserving the existing custom-thenable path for the real Supabase client. This observes the same RPC result and does not execute the RPC twice.

- Fix commit: `5345c78ae6db1162118e777ecde329e75ec22cd9`.
- The full Local Supabase Auth/RPC integration workflow was started again for this commit as run `44731349080`; its result was still pending at the time of this archive.
- Cloudflare build-routing guard passed for the fix commit (run `44731349283`).
- Cloudflare Pages successfully deployed the fix commit to preview `https://0416a496.swiftdictionary.pages.dev`, with branch alias `https://feature-update-2-6-0-legal-p.swiftdictionary.pages.dev`.
- A separate Cloudflare Workers build check for the `swiftdictionary-testing` Worker service reported failure on that commit. The Pages preview deployment itself reported success; the Worker failure still needs triage to determine whether that service is part of the active product deployment.

## Terms publication and legal/privacy review status

The owner explained that they cannot currently arrange or fund an external lawyer and requested that formal legal/privacy review be deferred for this update.

The Terms page remains a non-binding publication placeholder. Its wording was updated in commit `919a63c839cafad37d8f52bdbaad4184238da2ea` to state that publication is deferred while the service operator, contact details and data-handling disclosures are confirmed. It does not request or record acceptance and does not claim legal approval.

No complete Terms & Conditions or Privacy Notice is being represented as legally reviewed. No operator identity, address, or operational contact has been invented or published. Formal review is recorded as **deferred, not completed or waived**. This owner decision does not remove any applicable legal obligations and is not evidence of compliance.

The outstanding matters remain:
- Determine whether and how Malaysia's PDPA applies to the actual service and its processing circumstances.
- Confirm the legal/service operator identity and a reliable contact channel.
- Review safeguards and consent/notice requirements for users aged 16–17.
- Document the data flows, processors/subprocessors, hosting regions and cross-border transfer basis.
- Determine whether a DPIA and/or DPO obligations apply.
- Review provider terms and the final Privacy Notice/Terms before public onboarding.

The Malaysian Personal Data Protection Commissioner describes the PDPA as regulating personal-data processing in commercial transactions and publishes official guidance on privacy notices and cross-border transfers. Applicability and obligations depend on the real operating facts; this archive is not a legal determination.

## Current release boundary

- Feature branch: `feature/update-2-6-0-legal-privacy-security`.
- Latest known feature commit at archive time: `919a63c839cafad37d8f52bdbaad4184238da2ea`.
- No pull request has been opened and no merge to `main` has been performed.
- Tokyo production remains untouched.
- Singapore staging account-deletion Edge Function remains version 3.
- The owner’s request is to defer the formal legal/privacy review from this update. The risk must remain visible in the release record; Terms publication and broad public onboarding should not be presented as legally cleared.


## Follow-up validation and draft pull request

The feature branch received two additional test-maintenance corrections:
- Commit `a86a36989f7650c57130b15a90548f5e692e4673` updates the Flashcards page check to accept the cache-busted runtime script URL used by the build.
- Commit `d2cb49d12d7808fc58d401b873bcf53091e6041b` updates the older 2.3.x frontend regression assertion to reflect the U2.6.0 Preferences layout: the Delete Account and Learning history controls are separate and both remain in Preferences.

Latest application branch head: `d2cb49d12d7808fc58d401b873bcf53091e6041b`.

### Confirmed passing checks on the latest head
- Cloudflare Pages deployed successfully to preview `https://43934340.swiftdictionary.pages.dev`.
- Cloudflare build-routing guard passed.
- Quiz database foundation passed.
- PostgreSQL 17 migration and allowance suite passed, including ledger, data-preservation and concurrency assertions.
- Supabase CLI local Auth compatibility suite passed, including its local security-advisor check.
- Flashcards static/mock regression suite passed.
- Chromium Mock User Flashcards browser suite passed all 17 tests.
- Local Supabase/Auth/RPC integration passed, including Auth contract, migrations, least-privilege grants, Quiz RPC integration, 199-question export validation, authenticated Quiz browser runtime, signed-out Flashcards/Preferences regressions, and permanent Lessons allowance exhaustion notification regression.
- The U2.6.0 local Supabase security-advisor command completed successfully and reported: `No issues found`.

### Remaining automated check / Cloudflare integration
- The separate general Chromium browser smoke workflow `44732605727` was still in its Playwright dependency-install step at archive update time; its test step had not started.
- Cloudflare's separate `Workers Builds: swiftdictionary-testing` check failed (check run `136276269890`) while the Cloudflare Pages deployment succeeded. The repository contains no Wrangler configuration or Worker entrypoint, so this appears separate from the active Pages application, but the owner should confirm whether that Worker service is still used before disconnecting or ignoring it.

### Draft pull request
- Draft PR #13 opened: https://github.com/WhiteWingCat/swiftdictionary/pull/13
- Title: `U2.6.0 — Account deletion and privacy/security safeguards`.
- Base: `main`; head: `feature/update-2-6-0-legal-privacy-security`.
- At creation/update time it contained 147 commits and 25 changed files.
- PR remains draft, unmerged and not approved for production deployment. Its description records that formal legal/privacy review is deferred at the owner's request, not completed or waived.
