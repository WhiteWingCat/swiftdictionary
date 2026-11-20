# SwiftDictionary Data Retention Schedule — Working Register (20 November 2026)

**Status:** Draft inventory only. No numeric retention periods are approved.  
**Owner:** [Operator/controller to be confirmed]  
**Related documents:** Privacy Notice draft; Update 2.6.0 Legal, Privacy, Safety & Security Blueprint.

Do not publish retention promises until each period is checked against the live system, provider settings, backups, support workflow and legal requirements.

| Data category | Active-system record / location | Deletion trigger or control | Backup / provider retention still to verify | Proposed decision |
|---|---|---|---|---|
| Supabase Auth identity and Google-linked email | Supabase Auth user record | Account deletion process not yet confirmed as self-service | Auth backups, logs, support access and token/session expiry | Set period and deletion workflow after provider review |
| Profile and preferences | User-owned public tables; some values in browser local storage | Account deletion; local device clearing requires a defined workflow | DB backups and browser copies | Define active and local-device cleanup |
| Saved words | Supabase user table; signed-out local storage | User deletion/account deletion; local signed-out data may persist separately | DB backups and browser copies | Define account vs device deletion |
| Lesson progress and practice summaries | User-owned progress/practice tables | Delete Learning History; account deletion | DB backups | Verify current history-deletion coverage and backup expiry |
| Daily Learning sessions and history | User-owned activity/session tables | Delete Learning History; account deletion | DB backups | Verify abandoned/completed session retention |
| Quiz sessions, question snapshots and selected option IDs | Private Quiz tables via RPC | Delete Learning History; account deletion | DB backups | Explicitly include answer-level records in deletion and notice |
| Flashcard collections and user-created text | Private Flashcard tables | User deletion of cards/collections; account deletion | DB backups | Confirm whether collection deletion is user-controlled and backup expiry |
| Flashcard mastery and review history | Private review/mastery tables | Delete Learning History; account deletion | DB backups | Verify every table in deletion RPC |
| Flashcard game/session summaries | Private Flashcard session tables | Delete Learning History; account deletion | DB backups | Verify deletion and retention behaviour |
| Learning allowance and entitlement state | Private allowance/entitlement tables | Allowance-window expiry or account deletion, as designed | DB backups | Preserve current-day allowance on history deletion; define residual period |
| Security/authentication logs | Supabase, Cloudflare and Google systems | Provider/operator security retention policy | Provider-controlled periods and global processing | Obtain tenant-specific provider facts; do not invent periods |
| CDN and asset request metadata | Cloudflare and jsDelivr | Provider-controlled retention | Global CDN/subprocessor retention | Confirm request logs and retention from provider documentation/settings |
| Feedback/support | GitHub issue or approved private channel | User request and repository policy; public issues may remain visible | Provider backups/archives | Decide whether to add a private contact route and retention process |
| Build/deployment logs and source repository records | GitHub Actions and Cloudflare Pages | Repository/workflow retention settings | Provider retention and account settings | Verify actual settings; do not equate code history with user-data retention |
| Staging test records | Singapore staging Supabase project | Reset/cleanup of synthetic test accounts and fixtures | Staging backup/log retention | Synthetic data only; never copy production learner rows |

## Required approvals and evidence

- [ ] Approve a numeric active-system retention period for each category where a fixed period is appropriate.
- [ ] Define event-based retention where deletion/window expiry is more appropriate.
- [ ] Verify Supabase database backup/PITR and log retention for the actual plan.
- [ ] Verify Cloudflare Pages build/deployment and security-log retention.
- [ ] Verify Google OAuth and account metadata handling.
- [ ] Verify jsDelivr request metadata and subprocessor handling.
- [ ] Verify GitHub repository visibility, issue retention and Actions log settings.
- [ ] Test learning-history deletion across every relevant table.
- [ ] Implement and test account deletion, including Auth sessions, foreign-key cascades and residual JWT behaviour.
- [ ] Document exceptions for security incidents, legal claims and mandatory retention.
- [ ] Ensure the Privacy Notice describes the verified periods and limitations accurately.
