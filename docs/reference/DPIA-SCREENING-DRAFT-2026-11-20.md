# SwiftDictionary — DPIA Screening Record (Working Draft)

**Date:** 20 November 2026  
**Status:** Preliminary screening only; not a completed DPIA or legal determination.  
**Controller/operator:** [Confirm identity and role]  
**Reviewer:** [Assign an accountable DPIA lead]  
**Related:** Update 2.6.0 Legal, Privacy, Safety & Security Blueprint; current Privacy Notice and Terms drafts.

## 1. Purpose and scope

This screening considers whether SwiftDictionary's current account-based dictionary and learning features are likely to result in a high risk to individuals' rights and freedoms, and whether a full Data Protection Impact Assessment (DPIA) should be completed under the current Malaysian Personal Data Protection Commissioner's guidance.

The service currently processes account identifiers/email, profile and preferences, saved words, lesson progress, learning practice results, Daily Learning activity, Quiz question/session snapshots and selected option IDs, private Flashcard content, per-card mastery/review history, game-session summaries and allowance state. It is intended for users aged 16+ and uses adaptive weak-topic/weak-card prioritisation.

This is a screening record, not a substitute for the official JPDP DPIA Guideline or legal advice.

## 2. Quantitative threshold screen

JPDP's current DPIA guidance describes quantitative thresholds including processing expected to involve more than 20,000 data subjects or sensitive personal data (including financial information) of more than 10,000 data subjects.

| Question | Current evidence | Screening result |
|---|---|---|
| More than 20,000 data subjects expected? | Current project is an individually operated early-stage service; no verified user-count forecast was supplied in this review. | Not established. Record actual/forecast count and reassess before growth. |
| More than 10,000 data subjects with sensitive/financial data? | Current product does not intentionally collect sensitive personal data or financial information; no payment processing is implemented. | Not currently indicated; verify data flows and future features. |

A result below these quantitative thresholds does not automatically mean a DPIA is unnecessary. The current JPDP guideline also requires consideration of qualitative risk factors.

## 3. Qualitative risk screen

| Processing feature | Risk consideration | Current safeguards / gaps | Initial assessment |
|---|---|---|---|
| Users aged 16–17 | Teenagers are within the intended audience; applicable consent and child-data safeguards require legal review. | 16+ policy intent exists, but no age gate or approved consent process is implemented. | High-priority legal/design issue |
| Learning history over time | Repeated records can reveal interests, proficiency, routines and areas of difficulty. | Minimal tracking intent; no advertising/analytics tracker found in reviewed source. Retention periods remain unapproved. | Moderate; assess monitoring criterion |
| Adaptive weak-topic revision | The system uses learning performance to prioritise revision. | Rule-based educational recommendation; no consequential eligibility, employment, credit, health or other high-impact decision identified. | Moderate; document logic and user expectations |
| Quiz answer-level records | Selected option IDs and question snapshots are retained, not merely aggregate scores. | Account-scoped private data and RPC access; retention and user deletion must be verified. | Moderate |
| Flashcard user-created content | Users may enter personal or third-party information in custom card fields. | Collections are private; stored-XSS review exists. No content moderation or sensitive-data warning should be assumed. | Moderate; add clear user guidance |
| International provider processing | Hosting, database, OAuth, CDN and provider support/logs may process data outside Malaysia. | Provider map exists; contract status, exact subprocessors and account-specific retention are not fully verified. | High-priority transfer assessment |
| Account deletion | Users may expect account deletion to remove associated data. | Learning-history deletion exists; self-service account deletion is not confirmed implemented. | High-priority transparency and control gap |
| Security and access | Unnecessary grants were found and remediated in staging; production remains pending separate approval. | Staging ACL migration applied and verified; production still needs approved remediation. | High-priority release gate |
| Public feedback route | GitHub issue content may be public if a user submits it. | Current Cloudflare feedback path is copy-first; a private inbox proposal is not implemented. | Moderate; disclose visibility and avoid sensitive submissions |

## 4. Data-flow and purpose summary

- **Authentication:** Google OAuth via Supabase Auth; app stores Supabase user identity and relevant account metadata.
- **Application data:** Supabase production database primary region Tokyo, Japan.
- **Website delivery:** Cloudflare Pages global network.
- **Browser libraries/stroke data:** jsDelivr CDN; asset request URLs may reveal which character asset was requested.
- **Source and feedback:** GitHub hosts the code; a user-created public issue may disclose submitted feedback.
- **Staging:** separate Singapore Supabase project, synthetic test data only.

The database region is not a complete statement of all processing locations. Obtain current provider DPA, subprocessors, support/log/backup and retention facts before completing the transfer assessment.

## 5. Risk treatment proposed

1. Obtain Malaysian legal advice on Act 709 applicability and the Regulation 3(3) issue for 16–17-year-olds.
2. Decide whether to keep 16+ eligibility and what age/guardian-consent process is lawful and proportionate.
3. Complete the DPO screening separately, specifically the regular/systematic-monitoring criterion.
4. Complete a provider-by-provider Section 129 transfer assessment and document safeguards.
5. Approve numeric or event-based retention for every data category, including logs and backups.
6. Implement and test account deletion with trusted server-side Auth Admin operations; accurately explain residual backup/log and JWT behaviour.
7. Maintain owner-scoped RLS/RPC access, review SECURITY DEFINER functions and remediate production privileges only after staging validation and approval.
8. Provide clear explanations for adaptive revision, avoid consequential profiling and do not introduce advertising/marketing use.
9. Provide accessible access/correction/deletion request routes and assess data portability requirements.
10. Re-screen before adding payments, public sharing, messaging, AI profiling, analytics or new data categories.

## 6. Screening conclusion

**Preliminary result: a full DPIA is recommended before broader public onboarding.**

This recommendation is precautionary, based on the combination of 16–17-year-old users, longitudinal learning records, adaptive revision, detailed Quiz answer records, cross-border provider processing, and unresolved retention/account-deletion controls. It is not a formal finding that a statutory DPIA is definitely mandatory. The current JPDP guideline's quantitative and qualitative criteria and the actual controller status must be assessed by the responsible controller/DPO and qualified Malaysian counsel.

## 7. Approval record

- [ ] Confirm controller/operator identity and accountable DPIA lead.
- [ ] Confirm actual/forecast data-subject counts.
- [ ] Complete the DPO appointment screening.
- [ ] Obtain legal advice on minors and processing basis.
- [ ] Verify provider contracts, subprocessors, transfer safeguards and retention.
- [ ] Approve risk treatment owners and target dates.
- [ ] Complete the full DPIA if required or adopted as best practice.
- [ ] Reassess after material product/provider changes.
