# SwiftDictionary repository documentation and branch hygiene review — 2026-11-18

## Purpose

The owner asked for the Master Development Record to be checked and corrected because completed Update 2.3.0 gates were still displayed as outstanding and Update 2.4.0 was not marked completed. The owner also reiterated that production code and durable development notes must be kept separate, and that the growing number of stale feature branches should be reduced.

## Repository audit

Repository: https://github.com/WhiteWingCat/swiftdictionary

At the time of inspection:
- `main` HEAD: `65d0a35bab577adc15a0b1911661c222ed625739` (Update 2.4.2 merge).
- `docs/master-development-record` HEAD before this documentation update: `724877b82ea0cf0322fbf21db83f13786be9788e`.
- The dedicated documentation branch exists, but `main` also contains a stale copy of `docs/MASTER-DEVELOPMENT-RECORD.md` and other `docs/` material.
- Old implementation branches remain for 2.2.0, 2.3.0, 2.3.1, 2.3.2, 2.3.3, 2.4.0, 2.4.1 and 2.4.2, despite their related implementation PRs being merged.
- Open draft PR #2 is the historical 2.3.0 planning PR targeting `main`; open draft PR #4 is the documentation-branch PR targeting `main`. Neither is an appropriate path for merging durable project notes into production.
- `work/update-2-4-0-quiz-feedback` was present without a matching merged PR in the current PR listing and must be inspected before deletion.

## Changes made to the Master Development Record

Updated `docs/MASTER-DEVELOPMENT-RECORD.md` on `docs/master-development-record`:
- Updated the handover summary to identify 2.4.2 as the current completed production baseline, with merge SHA, CI workflow runs, deployment run and owner live confirmation.
- Replaced the misleading active “Remaining 2.3.0 release gates” heading with a historical, closed/superseded note. The completed 2.3.x engineering work is documented in the implementation and release sections; privacy and friend-onboarding safeguards remain separate.
- Marked Update 2.4.0 Quiz, 2.4.1 and 2.4.2 completed/released.
- Identified Update 2.5.0 Flashcards as the next planned milestone, not yet started.
- Strengthened the standing branch rule: `main` must not receive the Master Development Record, conversation archives or internal planning notes; documentation-only changes stay on `docs/master-development-record`; temporary implementation branches are focused, created from current `main`, and deleted after merge when safe.

Documentation commit:
- `a6f06c5dc3ef0c037a77d02dfad0fbea1a089979`

## Agreed branch responsibilities

- `main`: production application/runtime source and the build, test, workflow, database-migration, licence and attribution assets needed to maintain and release the website. No Master Development Record, conversation archives or internal planning notes.
- `docs/master-development-record`: Master Development Record, dated conversation archives, archive index and supporting project planning notes. Documentation-only; never merge this branch into `main`.
- Temporary feature branches: one focused active implementation task, based on current `main`; merge only after validation and explicit owner approval; delete after merge when safe.

## Branch cleanup status and safeguards

This session completed the audit and implemented the documentation separation. It did not delete branch refs because the connected GitHub actions do not expose a branch-delete operation. Before the remaining branch cleanup:
1. Preserve any unique documentation currently present on `main` in the dedicated documentation branch.
2. Confirm the old feature branches are merged or otherwise contain no unique unmerged work.
3. Close the obsolete draft PRs #2 and #4 rather than merging them into `main`.
4. Nine branches associated with already merged PRs remain present; they can be safely deleted in GitHub after confirming the corresponding merged PRs #1, #3, #5–#11. The closed/unmerged planning branch and unassociated work branch must be inspected first.
5. The documentation-only paths have now been preserved on `docs/master-development-record` and removed from `main` in one commit (`686d874`). Runtime, test, workflow, migration, licence and attribution assets were retained.

No application code, production database, production settings, Supabase project or learner data was changed during this documentation review. Pages deployment #44233284108 completed successfully for main commit `686d8743f42ab32e3736c51861a2dbb9b2686420`; all three jobs passed. No open PRs remain. Nine branches associated with merged PRs remain cleanup candidates, but the connected GitHub integration did not expose branch deletion. The unmerged planning branch was compared with current main: its only unique paths are the old 2.3.0 planning document, technical design and 2.2.0 reconciliation migration. The documents are preserved on the documentation branch and the migration is already on main, so it is a safe deletion candidate after owner confirmation. The old `work/update-2-4-0-quiz-feedback` branch compares 173 commits ahead and 5 behind current main and contains unique file changes, so it must be preserved until audited. Update 2.5.0 implementation was not started.

## Next recovery point

Continue on `docs/master-development-record`. Finish the branch cleanup as a separate, carefully verified repository-maintenance operation before beginning Update 2.5.0.
