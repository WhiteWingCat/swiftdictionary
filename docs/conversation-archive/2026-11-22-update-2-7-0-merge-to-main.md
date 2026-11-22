# Update 2.7.0 — owner-approved merge to main

Date: 2026-11-22  
Repository: https://github.com/WhiteWingCat/swiftdictionary  
Pull request: [#14 — SwiftDictionary Update 2.7.0 — Chinese Dictionary & Lessons Expansion](https://github.com/WhiteWingCat/swiftdictionary/pull/14)  
Source branch: `feature/update-2-7-0-chinese-dictionary-lessons`  
Source head: `c355a23f3d4555fec1384fd14fb4056d77336756`  
Base head before merge: `11679f706ef3c03f314eeb6f0acf2d753a7e3a8a`  
Merge commit: `1d74e4925456c23b96223a94e64827b42c9cb869`

## Owner instruction

The owner explicitly authorised merging the completed U2.7.0 release candidate into `main`. This superseded the earlier release-polishing hold on PR #14. The instruction was to merge the branch; it did not grant approval to apply the three production Supabase migrations.

## Merge execution and verification

- Retrieved the latest PR state before acting: PR #14 was open, draft, mergeable, targeted `main`, and pointed at source head `c355a23f3d4555fec1384fd14fb4056d77336756`.
- Reviewed the latest check runs. The U2.7.0 and cross-version application workflows, Cloudflare Pages build-routing guard and feature-branch Pages deployment were successful. One separate check, `Workers Builds: swiftdictionary-testing`, remained failed because it targets the retired testing Worker; this was documented in the PR and was not the Pages deployment.
- Marked PR #14 ready for review.
- Merged PR #14 using the standard merge-commit method, with the expected head SHA guard set to `c355a23f3d4555fec1384fd14fb4056d77336756`.
- GitHub returned `merged: true` and merge commit `1d74e4925456c23b96223a94e64827b42c9cb869`.
- Independently fetched PR #14 and `main`: PR state is closed/merged, and `main` points to the same merge commit.
- Updated the PR description to replace the former draft/release-hold status with the final merge status and explicit database/legal boundaries.

## Production Pages deployment

The repository's GitHub integration automatically triggered the `pages build and deployment` workflow on `main` after the merge:

- Workflow run: [45024731635](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/45024731635)
- Triggering commit: `1d74e4925456c23b96223a94e64827b42c9cb869`
- Final verification: workflow completed with `success`; build, report-build-status and deploy jobs all succeeded. The merge commit also has a successful `Cloudflare Pages` check and a successful `Workers Builds: swiftdictionary-testing` check on `main`.

The production GitHub Pages workflow and the Cloudflare Pages check both completed successfully for the merge commit. The main-commit Cloudflare Workers build check also succeeded. This is deployment-check evidence; it does not prove the production Supabase migrations were applied.

## Database, legal and release boundaries

- These three U2.7.0 migrations remain applied to the U2.7.0 staging Supabase project only:
  - `20261121140000_swiftdictionary_update_2_7_0_language_aware_lessons.sql`
  - `20261122123000_update_2_7_0_chinese_daily_learning_catalog.sql`
  - `20261122143000_update_2_7_0_lesson_start_allowance.sql`
- No production Supabase migration was performed. A separate explicit owner approval and production preflight are required before applying them.
- Formal Malaysia PDPA and general international legal/privacy review remain outstanding. No compliance certification is implied.
- No release tag or ZIP was created during this merge.

## Recovery point and next steps

1. Current source of truth is `main` at `1d74e4925456c23b96223a94e64827b42c9cb869`.
2. Check GitHub Pages workflow run #45024731635 and verify the live production site only after it completes successfully.
3. Keep the three U2.7.0 production database migrations unapplied until separately approved.
4. Update the Master Development Record and archive index (completed in this documentation commit).
5. Do not delete the feature branch until confirming the PR merge and that no unique unmerged work remains.
