# Update 2.6.0 — Phase J: Legal-document drafts and staging ACL follow-up

**Date:** 20 November 2026  
**Status:** Internal working drafts created; second ACL migration applied and verified in Singapore staging. No legal documents published. Production remains untouched.

## 1. Owner's clarification

The owner asked whether law and Terms development had already been covered and requested that this be cleared before Mock User testing. The answer is no: prior work consisted of legal research, provider/data-flow review and a technical risk plan. No completed Terms of Use existed, and the old Privacy Policy draft was stale.

Legal-document completion is therefore a release gate before Mock User testing is declared ready.

## 2. Current legal sources rechecked

The current official Malaysian Act 709 reprint (dated 15 September 2026), the Personal Data Protection Regulations 2013 and current JPDP materials were checked.

Key issues reflected in the working drafts:

- Act 709 Section 7 requires a written privacy notice with prescribed information. Subsection 7(3) requires Bahasa Malaysia and English if the Act applies.
- Regulation 3(3) of the Personal Data Protection Regulations 2013 requires consent under Regulation 3 to be obtained from a parent, guardian or person with parental responsibility where the data subject is under 18. This does not establish that every processing purpose must necessarily rely on that consent; the legal basis for each purpose and the effect of the regulation require Malaysian legal advice.
- DPO screening includes a separate regular and systematic monitoring criterion, not just numerical thresholds. Adaptive revision/learning-performance processing must be assessed.
- Section 43A provides data portability subject to statutory conditions and technical feasibility.
- Section 129 cross-border transfers must be assessed under the amended Act and JPDP guidance.
- Breach notification and DPIA screening must be addressed in operational procedures.

Official sources:
- https://www.pdp.gov.my/en/akta/personal-data-protection-act-2010-reprint/
- https://www.pdp.gov.my/en/akta/personal-data-protection-regulations-2013/
- https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-the-appointment-of-data-protection-officer-dpo/
- https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-cross-border-transfer-of-personal-data-cbpdt/
- https://www.pdp.gov.my/en/akta/personal-data-protection-guidelines-on-data-breach-notification-dbn/
- https://www.pdp.gov.my/en/akta/data-protection-impact-assessment-guideline-dpia/

## 3. Draft documents created

On `docs/master-development-record`:

1. `docs/reference/PRIVACY-NOTICE-DRAFT-2026-11-20.md` — bilingual Bahasa Malaysia/English working draft. It uses the current feature data map and corrects the outdated Quiz statement: selected option IDs and question/session snapshots are stored. It also covers Flashcard user-created content/mastery, browser local storage, Cloudflare, Supabase, Google, jsDelivr and GitHub.
2. `docs/reference/TERMS-OF-USE-DRAFT-2026-11-20.md` — working Terms covering current free service, unlimited dictionary search, learning allowances, age eligibility, accounts, acceptable use, user-created private Flashcards, IP/licences, educational limitations, availability, privacy separation, suspension/termination and proposed Malaysia governing law.
3. `docs/reference/DATA-RETENTION-SCHEDULE-DRAFT-2026-11-20.md` — a category-level retention register for Auth, profile/preferences, saved words, lessons, Daily Learning, Quiz, Flashcards, allowance state, provider logs, CDN requests, feedback, build logs and backups.

The old `docs/reference/PRIVACY-POLICY-DRAFT.md` has been marked **SUPERSEDED — DO NOT PUBLISH** and points to the newer working draft.

## 4. Legal matters not yet cleared

The drafts intentionally retain placeholders and do not invent facts or periods. The following remain open:

- Act 709 applicability to a free, individually operated public learning service and any possible exemption.
- Processing basis for each purpose, including the Regulation 3(3) issue for 16–17-year-olds.
- Controller identity/capacity and a safe, monitored public privacy contact route.
- Actual provider contract status, exact subprocessors, transfer assessment and provider-specific log/backup retention.
- Numeric retention periods and account-deletion workflow.
- DPO and DPIA screening.
- Final Terms enforceability, user-content licence, disclaimers, liability and governing-law review.
- Public publication, footer links and recorded user acceptance.

No Privacy Notice or Terms have been published. No acceptance UI or age gate has been implemented. Do not start Mock User testing until the legal publication/consent decisions are resolved or explicitly approved as an internal test-only exception that does not onboard real users.

## 5. Staging ACL follow-up

The staging project `ivatvkfrtifgfheeaelj` (Singapore) was checked after the previous failed integration calls. Its migration history did not yet contain the follow-up ACL migration. The migration was then applied successfully using the Supabase integration.

Staging migration history now contains:

`20261120023718_update_2_6_0_remove_residual_api_privileges`

It revokes TRUNCATE/REFERENCES/TRIGGER/MAINTAIN from anon/authenticated on eight reviewed public tables and anonymous UPDATE on three sequences. Existing normal DML grants and RLS policies were preserved.

The hosted staging assertion test ran and passed. A targeted effective ACL query returned no remaining targeted privileges. The repository migration filename was aligned to the exact hosted version: `supabase/migrations/20261120023718_update_2_6_0_remove_residual_api_privileges.sql`.

GitHub Actions run [#44662308530](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44662308530) completed successfully after the repository migration filename was aligned with the hosted staging version. It tested the exact committed migration file in disposable local Supabase CI and ran authenticated Quiz/RPC/Chromium tests. Earlier run [#44655246355](https://github.com/WhiteWingCat/swiftdictionary/actions/runs/44655246355) also passed before the filename alignment.

## 6. Post-migration advisor result

- Eight INFO findings for private-schema RLS-enabled tables without policies; intentional RPC-only access. `anon` has no USAGE on `private`; authenticated has no direct table DML.
- Two WARN findings for authenticated execution of the two reviewed SECURITY DEFINER RPCs. Both remain intentional and required. Preserve empty search_path, explicit object qualification, auth.uid()-derived identity and ownership checks.
- No health lints.
- Ten unindexed foreign-key findings, four RLS initplan suggestions and ten unused-index suggestions. These require workload/query-plan assessment and must not be changed blindly.

Production Supabase remains untouched. No production SQL, OAuth, Cloudflare settings, deployment or merge was performed.

## 7. Next steps

1. **Completed:** align the implementation migration filename with the hosted staging history version `20261120023718` and update the CI workflow to use that exact file. A new CI run was triggered for the corrected path.
2. Continue the remaining technical staging smoke test after Cloudflare preview and Google OAuth are configured by the owner.
3. Verify the public controller/contact route and obtain legal review of Act 709 applicability, age/consent, DPO/DPIA and cross-border transfers.
4. Verify provider contracts, subprocessor lists and retention settings; complete the retention schedule.
5. Implement account deletion securely and test history/account deletion semantics.
6. Revise the working Privacy Notice and Terms based on decisions; add footer links and versioned acceptance only after approval.
7. Only then prepare Mock User testing. Keep production untouched until separately approved.


## 8. Additional governance drafts

Two more internal documents were created:

- `docs/reference/DPIA-SCREENING-DRAFT-2026-11-20.md` — preliminary screening of quantitative and qualitative risk factors. It recommends completing a full DPIA before broader public onboarding as a precaution, while not claiming that the statutory threshold has been conclusively met.
- `docs/reference/PERSONAL-DATA-INCIDENT-PLAYBOOK-DRAFT-2026-11-20.md` — incident detection, containment, provider escalation, notification assessment, user communications, evidence preservation and recovery.

Both remain drafts. An incident owner, provider escalation contacts and a restricted incident register still need to be assigned and verified.


## 9. Additional Malaysia contract-law scope

The Terms working draft was expanded to flag review under the Electronic Commerce Act 2006 (Act 658), including clear electronic acceptance and version/timestamp records, and the Consumer Protection Act 1999 (Act 599), including scrutiny of standard-form unfair terms and non-excludable rights. Copyright Act 1987 and the provenance/licensing of dictionary content and third-party assets also remain in scope. Applicability to the actual free service must be determined by counsel.
