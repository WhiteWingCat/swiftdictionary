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
