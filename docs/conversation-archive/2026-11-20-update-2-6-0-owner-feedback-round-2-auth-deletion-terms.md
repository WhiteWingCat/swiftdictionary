# Update 2.6.0 — Owner feedback round 2: sign-in, deletion UI and Terms page (20 November 2026)

## Owner feedback

After inspecting the latest feature deployments, the owner reported:

1. Google sign-in does not register on the first attempt; signing in a second time works.
2. The **Delete Account** control still does not appear in Preferences.
3. Clicking **Delete Learning History** still produces a browser-native prompt rather than the website dialog; the owner reports no checkbox was visible.
4. The owner requested a Terms & Conditions page linked from the website.

## Repository review and diagnosis

Read the current Master Development Record and the previous owner-feedback archive before changing implementation.

Two source-ordering defects were identified:

- In `index.html`, the Google sign-in click listener was attached only after `await refreshAccount()`. That refresh performs network-backed account, saved-word, profile and lesson initialisation. A user could click the sign-in control before the listener was attached, making the first click appear to do nothing. The listener is now attached before the first awaited refresh; error reporting and safe button re-enabling were added. The Supabase auth-state listener is also registered before the first refresh, while its `INITIAL_SESSION` notification is ignored because the explicit initial refresh owns that state.
- `supabase-config.js` dynamically injected `account-deletion.js` as an asynchronous script before the large inline app script had finished establishing its top-level lexical bindings. This could race the module's dependency checks and prevent its Preferences card from mounting. The asynchronous injection was removed from both the checked-in config and Cloudflare `build.sh`. `index.html` now loads `account-deletion.js` explicitly after the main inline app script and the Daily Learning/Flashcards scripts. The module waits for DOMContentLoaded, at which point the Preferences host exists and the main account initialisation has created the Supabase client.
- The current branch's learning-history handler uses `confirmLearningHistoryDeletion()` and the in-site dialog; its handler does not call native `confirm()`. The earlier report of a browser prompt therefore indicates that the preview did not execute the current source path or still served a stale/older build. A targeted regression assertion now inspects the actual learning-history handler for native confirm calls. Verify the next deployed preview before considering the issue closed.

## Changes committed

Implementation remains on `feature/update-2-6-0-legal-privacy-security`; no PR, merge or deployment was initiated by this work.

- `index.html`
  - Registered Google sign-in, sign-out and Supabase auth-state handlers before the first network-backed `refreshAccount()`.
  - Added safe handling for Google sign-in errors and prevents double-clicking while OAuth is starting.
  - Ignores the initial `INITIAL_SESSION` callback in the listener to avoid duplicate concurrent initial profile refreshes.
  - Loads `account-deletion.js?v=2.6.0-r2` explicitly after the main application script, including a cache-busting version query so the preview does not reuse the earlier module.
  - Adds a **Terms & Conditions** link to the main site footer.
  - Retains the in-site learning-history confirmation dialog; the learning-history handler awaits that dialog and does not invoke native `confirm()`.
- `supabase-config.js`: removed the asynchronous dynamic account-deletion loader; it still preserves the dedicated anonymous saved-word collection.
- `build.sh`: stopped injecting the async account-deletion loader into the generated config while retaining anonymous saved-word preservation for both staging and production builds.
- `terms.html`: created an accessible Terms & Conditions page linked from the footer. It is deliberately a publication placeholder: it states that Terms are not yet published, legally effective, or being accepted. The internal full Terms draft remains unpublished pending legal review and owner approval.
- `tests/update-2-6-0/account-deletion-static.test.mjs`: added checks for deterministic script order, no async loader race, first-click sign-in listener ordering, in-site history confirmation, and the Terms page's non-binding placeholder state.

## Important checkbox clarification

The optional local saved-word checkbox belongs to **Delete Account**, not **Delete Learning History**. It remains unchecked by default and appears only if the current browser contains signed-out anonymous saved words. It clears only the dedicated anonymous saved-word key. Learning-history deletion does not clear signed-out local saved words, the account, saved words or Flashcard collections. The website history dialog explains this distinction.

## Legal/privacy review

- Terms of Use draft already exists internally at `docs/reference/TERMS-OF-USE-DRAFT-2026-11-20.md`, version 0.1, and is explicitly marked not approved for publication or acceptance.
- The public-facing `terms.html` is only a placeholder and uses `noindex`; it does not expose the internal draft or create a binding contract.
- Publication of final Terms, versioned Terms acceptance, and the bilingual Privacy Notice remain blocked on the existing Malaysian PDPA/international review and unresolved owner/legal decisions. In particular, operator identity/capacity, 16–17-year-old eligibility/consent, legal basis, cross-border transfers, contact route, data retention, content licensing, liability/consumer-law wording and dispute terms still require review.
- No new data category, tracking, processor, database schema, migration, retention rule, or provider permission was introduced.
- Production remains untouched. No account was deleted and no database or provider operation was performed.

## Verification and handover

- GitHub source edits succeeded. Latest implementation/test commit: `a1a438b121f37f5af46da4a33417e3fa7d013214`. Feature-branch pushes may trigger the configured Cloudflare preview deployment automatically; its completion and deployed commit were not independently verified in this session. No PR, merge or production deployment was performed.
- Two intermediate Cloudflare guard runs failed because a newly added regex assertion was malformed and an older build-routing test still expected the now-removed dynamic loader in `supabase-config.js`. Both test defects were corrected. The final GitHub Actions Cloudflare build routing guard run #62 passed on commit `a1a438b121f37f5af46da4a33417e3fa7d013214`: JavaScript syntax/account-deletion safeguards passed, all 11 static regression tests passed, Deno type-check passed, all 4 Edge Function unit tests passed, and local/staging/production environment-routing safeguards passed. The separate Quiz database foundation workflow for the same commit was still running at the time of this archive update. Cloudflare preview deployment completion and deployed commit were not independently verified.
- The owner should wait for the latest Cloudflare feature deployment and test with synthetic staging accounts only:
  1. Click Google sign-in once from a fresh signed-out session; confirm redirect, return callback and session persistence.
  2. Open Preferences after sign-in; confirm **Delete Account** appears above **Learning history**.
  3. Open Delete Account; confirm the optional local checkbox appears only when anonymous saved words exist and is unchecked by default.
  4. Open Learning history; confirm the website dialog (not a browser prompt) appears, Cancel does not mutate data, and confirmation deletes only learning history.
  5. Verify the Terms & Conditions footer link opens the placeholder page and Back to SwiftDictionary works.
- No real learner data or personal production account should be used for destructive tests. No production deployment or merge without explicit owner approval and completion of existing Update 2.6.0 legal/privacy/security gates.
