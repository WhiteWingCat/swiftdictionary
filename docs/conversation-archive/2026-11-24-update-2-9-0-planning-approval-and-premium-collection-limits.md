# 2026-11-24 — Update 2.9.0 planning approval and Premium collection-limit decision

## Session purpose

The owner provided the intended scope for SwiftDictionary Update 2.9.0, reviewed the recommended development sequence, and explicitly approved that sequence. The owner requested that the plan be finalized, added to the Master Development Record (MDR), and that a future Premium-benefit direction be preserved in the project record.

## Owner-approved Update 2.9.0 scope

1. Expand the English dictionary, targeting approximately 500–700 new words where quality permits.
2. Perform a complete review of existing and new English entries for missing/incomplete definitions, multiple meanings, context, grammatical accuracy and relevant tense/inflection handling.
3. Add Dashboard Favorite collections beneath the existing Favorite words panel. Users can create named folders, add saved words, and organize them. Creation must use a centred in-site modal (with background blur/dimming), never a browser-native prompt. Collections must accept English and Chinese saved words regardless of language difference.
4. English Lessons, Quiz and Flashcards expansion is optional and only proceeds if workload allows after core scope.
5. Expand English dictionary filters with useful categories, including actions, terms, activities, scientific, historical and other relevant categories.
6. Ensure Simplified Chinese translations work across English dictionary definitions, including multiple senses and translation switching.
7. Prepare the visual interface and navigation for Get Premium Plan only. This is not confirmation that Premium setup, payments or launch are ready.

## Approved development sequence

1. Repository/content/data audit and planning.
2. English dictionary expansion and full accuracy review.
3. English filter expansion and translation QA.
4. Favorite collections implementation and Supabase integration.
5. Visual-only Premium interface/navigation preparation.
6. Optional English Lessons/Quiz/Flashcards expansion if capacity allows.
7. Consolidated full QA and release preparation.

The authoritative detailed specification and acceptance criteria are in `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md`.

## Favorite collections — requirements captured

- Add **Your collections** immediately below **Favorite words**.
- Plus/New folder opens a custom centred in-site modal with the background blurred/dimmed; no native browser prompt/alert/confirm.
- User may name collections, create them, open them, rename them and delete them.
- Users may add/remove saved words. A word may belong to multiple collections.
- Removing a word from a collection does not remove it from Favorite words. Deleting a collection does not delete the saved words.
- Collections may mix English and Chinese words in the same collection.
- Collections synchronize across devices and are isolated per authenticated account.
- Supabase RLS and server-side authorization must protect all collection and membership operations.

## Future Premium direction — new owner decision

The owner intends to expand Premium benefits in the future so Premium is not limited to increased daily learning allowances.

One proposed additional Premium benefit is increased capacity for creating collection folders:
- **Free:** maximum 16 folders per user.
- **Premium:** maximum 40 folders per user.

The owner considers these caps reasonable to keep collections from becoming unlimited and to discourage excessive folder creation/abuse.

### Status and safeguards

- These values are a **proposed future entitlement direction**, recorded for future Premium planning. They are not active entitlements and do not authorize implementation/enforcement in U2.9.0.
- U2.9.0 Premium work is visual-only. No checkout, payment processing, subscription activation, billing, entitlement mutation or changes to existing daily allowance rules.
- Future enforcement should be server-side and safe against concurrent folder-creation races; UI-only caps are insufficient.
- Recommended data-preserving downgrade behaviour: if a Premium user has more than 16 folders after losing Premium, preserve all existing folders and their contents, but block creation of additional folders until the user is within the Free limit or regains Premium. Never silently delete collections or membership data. This downgrade policy is a technical recommendation to bring back for owner confirmation before implementation, not a separately approved final subscription policy.
- Future Premium planning should consider other benefits beyond daily allowances and collections; no further benefit has been approved in this session.

## Legal, privacy and security planning

The project’s standing Malaysia/general legal-risk review remains mandatory. For this update, review Malaysia PDPA applicability, international privacy and age-related safeguards for the intended global 16+ audience, data minimisation, retention/deletion, cross-border processing, dictionary-content licensing and (before actual Premium launch) consumer/payment disclosures, cancellation and refund obligations. This is planning guidance, not legal advice or legal clearance.

Collections must not weaken existing account isolation, saved-word synchronization or Supabase RLS. Production database and deployment actions remain separately gated by explicit owner approval.

## Development authorization and current state

This session approves and finalizes the **plan**, not implementation. No application code, dictionary content, SQL migration, Supabase schema/RPC/policy, staging data, production data, payment integration or deployment was changed or authorized by this planning decision.

Implementation should begin only after a separate owner instruction. Phase 1 should inspect the latest current `main`, dictionary/content schemas, Favorite/saved-word architecture, Supabase RLS/RPCs and entitlement foundation before any schema proposal.

## Documentation changes

- `docs/UPDATE-2.9.0-DEVELOPMENT-PLAN.md` — authoritative approved plan.
- `docs/MASTER-DEVELOPMENT-RECORD.md` — current status, roadmap and durable owner decisions updated.
- `docs/conversation-archive/README.md` — archive index updated.

Documentation-only changes belong on `docs/master-development-record`; do not merge these internal records into the production `main` branch.

## Recovery point

- Branch: `docs/master-development-record`.
- U2.8.0: owner-confirmed completed and live as of 2026-11-24.
- U2.9.0: plan approved; development not started.
- Next action when separately authorized: perform Phase 1 audit and baseline report, then return findings and any technical/data-model decisions before implementation.
