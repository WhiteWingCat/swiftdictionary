# SwiftDictionary — Legal Document Acceptance and Age Gate Design

**Date:** 20 November 2026  
**Status:** Proposed design only. No UI, schema, RPC or age gate has been implemented.  
**Requires:** Malaysian legal review, owner approval and final Privacy Notice/Terms versions.

## 1. Goals

- Make the final Privacy Notice and Terms easy to find before a user creates or accesses an account.
- Obtain a clear, recorded acceptance of the Terms where an agreement is intended.
- Distinguish acknowledgement of a Privacy Notice from consent to processing.
- Avoid collecting full date of birth or identity documents unless a legal assessment establishes a necessary and proportionate reason.
- Respect the intended 16+ service eligibility while resolving the separate Malaysian consent issue for 16–17-year-olds.
- Preserve a minimal, auditable record of the document versions accepted.

## 2. Public legal pages

Before the acceptance flow is enabled:

1. Publish versioned Privacy Notice pages in Bahasa Malaysia and English, with Simplified Chinese as an optional additional translation.
2. Publish the approved Terms of Use and keep prior versions accessible.
3. Add links in the site footer, not the primary navigation.
4. Make the pages readable without signing in.
5. Display document version, effective date, operator identity and approved contact route.
6. Ensure the Privacy Notice accurately describes the production deployment and does not contain staging credentials or internal security details.

Do not publish working drafts or placeholders as final documents.

## 3. Proposed first-account flow

The final flow depends on legal advice about the under-18 issue. The following is a design framework, not an approved age/consent mechanism.

1. Before starting Google OAuth, show the service eligibility information and links to the Privacy Notice and Terms.
2. Present the Terms acceptance separately from the Privacy Notice acknowledgement. Both controls must be unchecked by default.
3. If a separate consent is required for a specific optional processing purpose, present it separately and explain the purpose. Do not bundle optional consent into Terms acceptance.
4. If the user does not accept the Terms, do not create or activate an account; the public dictionary may remain accessible without sign-in.
5. Do not let a self-declared age of 16+ bypass a parental-consent requirement where Regulation 3(3) applies. The precise 16–17 flow must be approved by Malaysian counsel before implementation.
6. After successful OAuth, record the account's accepted document versions using a trusted server-side database function. The database must derive the account ID from `auth.uid()`, generate the timestamp server-side and reject arbitrary client-supplied user IDs.
7. Keep the user's account in a limited state until required acceptance records are confirmed. Do not rely solely on localStorage for legal acceptance.

## 4. Versioned acceptance record — proposed schema

A future private table or equivalent controlled record may contain:

- authenticated user ID;
- document type (Terms, Privacy Notice acknowledgement, or a separately defined consent);
- document version;
- language/locale presented;
- accepted/acknowledged boolean;
- server-generated timestamp;
- acceptance method/version of the UI;
- only if legally justified, an age-eligibility declaration or guardian-consent evidence reference.

Do not store full date of birth, government identity numbers, identity documents or guardian identity documents by default. If the legal analysis requires parental consent evidence, design the least intrusive evidence and verification mechanism with counsel.

The record must be append-only for evidence purposes or otherwise preserve an immutable audit trail. A user should not be able to rewrite another user's record or change the server timestamp.

## 5. Existing accounts and document changes

- On first access after the new legal flow is released, existing accounts must be shown the applicable new Terms version before account-dependent use continues.
- A Privacy Notice update should be communicated clearly. It does not automatically require consent unless the legal basis/purpose change requires it.
- Material Terms changes should require a new affirmative acceptance where appropriate.
- Preserve the version previously accepted and the timestamp; do not overwrite the old event.
- If a user declines a new required Terms version, account-dependent access should be suspended without deleting the account data automatically. Provide a clear route to request account deletion.
- Account switching must evaluate acceptance independently for each account.

## 6. Technical security requirements

- No service-role or secret key in browser code.
- Use a narrowly scoped authenticated RPC or server-side Edge Function.
- Derive identity from the verified session; never accept a target user ID from the browser.
- Validate allowed document versions against a server-controlled release table or function constants.
- Use server time, not client time.
- Make writes idempotent for the same user/document/version, while preserving the original timestamp.
- Keep legal acceptance records private from other users and unavailable to anonymous Data API roles.
- Do not use editable user metadata as a legal acceptance or age-verification authority.
- Add audit logging without duplicating unnecessary personal information.

## 7. Required test cases

- New user accepts current Terms and acknowledges the current Privacy Notice.
- User declines Terms; no account-dependent features become available.
- Existing user is prompted for a new material Terms version.
- Privacy Notice changes without a new consent requirement; acknowledgement and communication behave as designed.
- Optional consent is independently accepted or declined.
- User switches between two accounts with different acceptance histories.
- User signs out and signs back in on another device.
- Missing, stale, forged or unknown document version is rejected.
- Client-supplied user ID, timestamp or acceptance status cannot spoof another account.
- Guardian consent flow is tested if legal advice requires it.
- Deletion and access-request processes correctly handle acceptance evidence records.
- Public dictionary search remains free and accessible without account acceptance.

## 8. Release blockers

- [ ] Malaysian counsel confirms whether Act 709 applies and the appropriate processing bases.
- [ ] Counsel resolves Regulation 3(3) for 16–17-year-olds.
- [ ] Owner approves operator identity/contact route and the intended age/eligibility flow.
- [ ] Privacy Notice and Terms are finalised, bilingual where required, and approved.
- [ ] Retention period for acceptance evidence is approved.
- [ ] Schema/RPC or Edge Function design is reviewed and staged.
- [ ] Acceptance UX is tested for accessibility, account switching and version changes.
- [ ] No public release until the complete legal and technical gates pass.
