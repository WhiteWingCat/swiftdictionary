# 2026-11-26 — Update 2.9.0 merge, Live Supabase migration and Cloudflare Workers Builds retirement

## Owner request and approval

The owner explicitly approved merging Update 2.9.0 into GitHub `main`, asked that the Master Development Record classify Cloudflare Workers Builds as no longer in operation (Cloudflare Pages is the only active build), and required Live Supabase to be migrated with the latest implementation. The requested completion condition is confirmation of both GitHub `main` and Live Supabase updates.

## GitHub merge

- Repository: `WhiteWingCat/swiftdictionary`.
- PR #18: https://github.com/WhiteWingCat/swiftdictionary/pull/18
- PR was squash-merged successfully after explicit approval.
- Merge commit: `64dc4406f96cf4b5a7644d802f936ff5ffd97289`.
- Feature head merged: `96b856b1419aadb24c3d4e8872a54bd27a4e9294`.
- Application code had last been validated at `55a1ff5c43487985f2d20618385d1cb7a27edf9b`; the later feature-head commit was documentation-only.
- The application implementation includes direct folder-heading drag reorder, removal of drag/arrows controls, keyboard reorder alternative, Favorite/Collections layout refinements, Dashboard disclosure initialization, versioned module loading, three additional permanent English lessons, draft-only Quiz additions, and ten curated English Flashcard expressions.
- Prior QA evidence: U2.9.0 browser QA 20/20; Dashboard/Flashcards/allowance Chromium regression 87/87; local authenticated Supabase Auth/RPC integration passed; additional Chinese, Flashcards, ACL, allowance and content checks passed.

## Cloudflare platform classification

- Cloudflare Pages is the only active build and deployment system. GitHub `main` is the production source; feature branches/PRs produce Pages previews.
- Cloudflare Workers Builds for `swiftdictionary-testing` is **retired — no longer in operation**. The repeated Worker failure is an obsolete status, not an active deployment failure, and must not block this Pages release. Do not restore or rely on that Worker workflow.
- PR preview deployment succeeded: https://1df70422.swiftdictionary.pages.dev .
- A Pages production deployment triggered by the merge must be checked independently; preview success is not evidence of production deployment success.

## Live Supabase rollout

### Project and preflight

- Project: SwiftDictionary, ref `pzymiesazmpyvnfvsbsc`, region `ap-northeast-1`, status `ACTIVE_HEALTHY`.
- Before migration, production history ended at U2.8.0; staging contained all eight U2.9.0 migrations.
- Inspected production schema and confirmed required dependencies: `public.saved_words` uses the expected bigint id and account owner; `public.user_entitlements` has plan/status/validity columns; `private.learning_content_catalog` has the expected lesson allowlist structure.

### Migrations applied successfully

All eight migrations were applied in order, with no reported failures:

| Live migration version | Migration |
|---|---|
| 20261126041610 | `swiftdictionary_update_2_9_0_favorite_collections` |
| 20261126041612 | `swiftdictionary_update_2_9_0_favorite_collections_realtime` |
| 20261126041615 | `swiftdictionary_update_2_9_0_favorite_collections_private_broadcast` |
| 20261126041617 | `swiftdictionary_update_2_9_0_favorite_collections_remove_postgres_changes` |
| 20261126041620 | `swiftdictionary_update_2_9_0_favorite_collection_capacity_limits` |
| 20261126041622 | `swiftdictionary_update_2_9_0_favorite_collection_ordering` |
| 20261126041625 | `swiftdictionary_update_2_9_0_english_lesson_expansion` |
| 20261126041627 | `swiftdictionary_update_2_9_0_reorder_rpc_invoker_security` |

### Post-migration verification

- Live migration history contains all eight versions above.
- `favorite_collections` and `favorite_collection_items` exist. Both are RLS-enabled; six owner-scoped policies exist.
- Three expected triggers exist across the two collection tables (two private Broadcast triggers and one folder-order assignment trigger).
- Public create/reorder wrappers are SECURITY INVOKER; the reorder RPC no longer runs SECURITY DEFINER.
- Collection tables are absent from the `supabase_realtime` Postgres Changes publication; private Broadcast policy and trigger setup is installed.
- All five English lesson allowlist rows are active.
- New collection and membership tables each contain zero rows immediately after rollout. Existing saved_words and user_entitlements data was not modified; no user rows were backfilled or deleted.
- Supabase health advisor: no findings.
- Security advisor: no new U2.9.0 findings. Existing notices: 10 informational private-schema RLS/no-policy findings and one leaked-password-protection-disabled warning.
- Performance advisor: 18 unused-index notices (including the two collection indexes on empty new tables) and one pre-existing duplicate-index warning on `public.learning_activity_log`. The collection indexes are retained for expected account/order and saved-word FK workloads; unrelated cleanup is deferred.

## Product and legal/privacy boundaries

- Dictionary word-grid search remains free and unlimited. Free folder capacity remains 16; Premium capacity remains 40.
- Premium remains presentation-only; no billing, checkout, payment processing, subscription activation or entitlement mutation was introduced.
- The 30 additional Quiz questions remain draft-only; approved Quiz content remains 199 questions.
- No new personal-data category, purpose, processor, tracking purpose or schema field was introduced. Malaysia PDPA, cross-border safeguards, international 16+ requirements, accurate Terms/Privacy publication and future Premium consumer/payment compliance remain pre-publication planning items. This is not legal advice or legal clearance.

## Exact handover state

- GitHub PR #18 merged to `main` at `64dc4406f96cf4b5a7644d802f936ff5ffd97289`.
- Live Supabase has all eight U2.9.0 migrations and post-migration schema/security verification passed.
- Remaining external check before declaring both GitHub and the *live website* fully updated: confirm the merge-triggered Cloudflare Pages production deployment. Cloudflare Workers Builds is retired and irrelevant to the active release.
