# SwiftDictionary rolling three-branch implementation policy — 2026-11-18

## Owner decision

The owner approved a rolling limit of three recent implementation branches. Each time a new implementation task starts, retire the oldest retained implementation branch and create a fresh task branch from the latest `main`.

## Agreed policy

- Keep at most three recent implementation branches across `feature/*`, `fix/*`, `hotfix/*`, `chore/*` and `work/*` naming conventions when they contain implementation work.
- Exclude `main` and the permanent `docs/master-development-record` branch.
- Select the oldest by task start/last meaningful development activity, not just a housekeeping commit timestamp.
- Retire the oldest branch before creating the new branch. Use a fresh task-specific branch name and branch from current `main`; do not reuse stale branch names or base work on old feature branches.
- Merged and verified branches are preferred retirement candidates.
- Never delete a branch with unique unmerged work or unresolved feedback. Inspect its diff, preserve/reconcile useful work with owner approval, then retire it. If safe retirement is impossible, explain the conflict and obtain owner direction rather than silently deleting work or exceeding the limit.
- Maintain a branch register in the Master Development Record with branch, task, status, meaningful activity, PR/merge reference and retirement decision.
- If the GitHub integration cannot delete refs, disclose that limitation and provide safe candidates; never claim deletion prematurely.

## Current known exception

`work/update-2-4-0-quiz-feedback` was found 173 commits ahead and 5 behind current `main`, with unique changes. It remains protected until reviewed and reconciled. The old 2.3.0 planning branch's unique planning documents and migration have been preserved elsewhere and it is a cleanup candidate. Nine branches associated with merged PRs #1, #3 and #5–#11 are also cleanup candidates after checking current status.

## Scope

The policy applies from Update 2.5.0 onward. It does not alter production deployment approvals, QA requirements, the permanent documentation branch, or the requirement to update the Master Development Record and archive for meaningful work.

No branch refs were deleted in this policy-update session. This was a documentation-only change.
