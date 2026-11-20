# Update 2.6.0 — account-deletion dialog preview regression

Date: 2026-11-20

## Owner report

After Cloudflare preview routing was corrected, the owner confirmed Google sign-in on the Singapore staging project no longer redirects to production. Immediately after signing in, the account-deletion confirmation dialog appeared. Pressing Close did not dismiss it.

## Diagnosis

Inspection of `account-deletion.js` on `feature/update-2-6-0-legal-privacy-security` found that the dialog overlay is initialized with `overlay.hidden = true`, and the Cancel handler sets it back to true. However, its custom CSS assigned `display:grid` directly to `.swift-delete-overlay`. A normal author `display` declaration can override the browser's built-in `[hidden] { display:none }` rule, leaving the dialog visible while its hidden property is true.

This explains the observed symptoms. No evidence indicates that the account-deletion request was submitted; the confirmation handler only runs after the explicit Confirm deletion button is clicked.

## Implementation

On the existing feature branch:
- Added an explicit `.swift-delete-overlay[hidden]{display:none!important}` rule before the overlay's visible-state styling.
- Added a static regression assertion to ensure the hidden-state override remains present and the dialog retains its open/close state transitions.

Commits:
- CSS fix: `bfe7f4e65167cbd275bf23abd9739d192e10b0fc`
- Regression test: `5ff8cc49f15d25f27529954aa3be66af5c5b1d30`

## Validation and next steps

- Source-level diagnosis and targeted regression assertion added.
- A real browser test of initial hidden state, explicit opening, Cancel, backdrop and Escape dismissal remains to be run in the preview.
- Deploy the updated feature branch to Cloudflare preview, then verify the dialog is absent immediately after sign-in and only appears after selecting Delete Account in Preferences.
- Do not press Confirm deletion during this UI regression test. Any destructive account-deletion validation must use a synthetic staging account and the approved deletion test plan.

## Safety and release boundary

All changes are confined to `feature/update-2-6-0-legal-privacy-security`. No Supabase account, data, schema, Edge Function, production setting or production deployment was changed. Production remains untouched. Existing Malaysia-first legal/privacy/security release gates remain open.
