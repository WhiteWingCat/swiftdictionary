# Update 2.6.0 — Phase A operator and age-gate clarification

**Date:** 19 November 2026  
**Workstream:** Update 2.6.0 — Legal, Privacy, Safety & Security  
**Repository:** WhiteWingCat/swiftdictionary  
**Documentation branch:** docs/master-development-record

## Owner-confirmed facts

- The owner operates SwiftDictionary personally as an individual, not through a registered company or incorporated business.
- The intended minimum age remains 16+.
- The owner wants development to return to the planned updates after completing branch cleanup.

The individual-operator fact informs, but does not settle, whether Malaysia's Personal Data Protection Act 2010 (Act 709) applies. The service is public-facing and processes other people's account and learning data; the personal/family/household exemption should not be assumed. Qualified Malaysian legal advice remains necessary on commercial-transaction scope, the exemption, DPO screening and controller-registration classes.

## Age-gate analysis

A 16+ self-declaration can document that the service communicated its minimum-age rule and that an account holder affirmed it. It cannot prove the person's actual age, prevent deliberate misrepresentation or independently establish parental consent.

A proposed low-data flow has been added to the 2.6.0 blueprint:

- Ask “Are you 16 years of age or older?” before Google OAuth/account creation.
- Continue only after an affirmative response; decline access after a negative response.
- After successful authentication, retain only account ID, affirmative declaration, timestamp and notice version.
- Avoid collecting date of birth, identity documents, selfies or other intrusive age-verification data unless a documented legal requirement justifies it.
- Re-prompt only after a material change to the age rule or notice.

This remains a proposal pending owner/legal approval and is not implemented.

### Malaysian Regulation 3(3) issue

The Personal Data Protection Regulations 2013, Regulation 3(3), requires consent under Regulation 3 for a data subject under 18 to be given by a parent, guardian or person with parental responsibility; Regulation 3(5) places the burden of proof on the data user. Accordingly, the proposed 16+ checkbox alone does not resolve the parental-consent question for 16–17-year-olds if consent under Regulation 3 is relied on. Counsel must assess the lawful basis for each processing purpose and the application of this rule before launch. Do not treat the teenager's checkbox as parental consent.

The June 2026 Malaysian age-verification discussion for licensed social-media providers should not automatically be treated as applying to SwiftDictionary's current private dictionary/learning design. Reassess if platform-like public sharing or messaging is added.

## Branch housekeeping

The owner removed the seven merged historical branches and also removed feature/update-2-3-0-planning, which contained planning-only material. The retained repository branch set was verified as:

- main
- docs/master-development-record
- feature/update-2-5-0-flashcards
- feature/update-2-4-2-dashboard-quiz-fixes
- feature/update-2-4-1-fix-changes
- work/update-2-4-0-quiz-feedback

The three most recent implementation branches remain, along with the separate unmerged Quiz feedback work branch. The permanent main and documentation branches remain. Continue to inspect unique work before retiring any unmerged branch.

## Current status and next actions

- Update 2.5.0 remains the production baseline and is merged/deployed.
- Update 2.6.0 legal/privacy/security baseline audit is complete; this session clarified Phase A facts and documented the age-gate proposal.
- No application code, database schema/data, Supabase settings, OAuth settings, production deployment or production branch was changed.
- Next: complete the Malaysia legal applicability/DPO/registration assessment; verify processor/subprocessor locations and contractual terms; finish DPIA and cross-border-transfer screening; then prioritise low-risk technical remediation with isolated staging validation.
- Do not publish legal documents or implement the age gate as a compliance claim before the relevant legal basis, wording and user journey are reviewed.