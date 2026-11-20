# SwiftDictionary Update 2.6.0 — Legal Approval Register

**Date:** 20 November 2026  
**Status:** Open — not legally cleared. This register tracks decisions required before public legal-document publication and before Mock User testing is offered as release-ready.

This is an internal project-control document, not legal advice. Owner decisions do not replace qualified legal review where indicated.

| ID | Decision / evidence required | Current position | Who must resolve | Gate |
|---|---|---|---|---|
| L-01 | Does Malaysia's Personal Data Protection Act 2010 (Act 709) apply to this free, individually operated public learning service? Is any personal/household exemption available? | Unresolved; free use and individual operation do not automatically settle applicability. | Malaysian privacy lawyer + operator | Before publishing Privacy Notice |
| L-02 | Identify the data controller/operator and the capacity in which the service is operated. | Operator confirmed as individual; public legal identity/capacity not approved for publication. | Operator + lawyer | Before publishing either document |
| L-03 | Create a monitored public privacy/support contact route without unnecessarily exposing a private home address. | No approved public contact route. | Operator | Before publishing either document |
| L-04 | Determine lawful processing basis/purpose by purpose and whether consent under Regulation 3 is relied on. | Not determined. Do not treat Terms acceptance as blanket privacy consent. | Malaysian privacy lawyer | Before account onboarding/notice finalisation |
| L-05 | Resolve the Regulation 3(3) issue for users aged 16–17 if Regulation 3 consent is used. | 16+ product intent; no age gate or parental-consent process implemented. | Malaysian privacy lawyer + operator | Before accepting 16–17-year-old users |
| L-06 | Confirm DPO appointment requirement, especially regular/systematic monitoring. | Numeric thresholds appear unlikely based on current early-stage project, but monitoring criterion needs assessment because adaptive revision uses learning activity over time. | Malaysian privacy lawyer / appointed DPO if required | Before broader public onboarding |
| L-07 | Complete DPIA determination and, if required/adopted, full DPIA. | Preliminary screen recommends full DPIA before broader public onboarding as a precaution. | Controller/DPIA lead + lawyer | Before broader public onboarding |
| L-08 | Complete cross-border transfer assessment for Supabase, Cloudflare, Google, jsDelivr and GitHub. | Provider map exists; account-specific contracts, exact subprocessors and some processing/retention details remain unverified. | Operator + provider account owners + lawyer | Before Privacy Notice publication |
| L-09 | Approve retention periods for each category, including logs/backups. | Provider plan-level evidence now recorded: Supabase Free lists 24-hour Auth Audit Logs and 1-day API/Database log retention; Cloudflare Observability Usage displays 7 days for the logs/traces represented there. Cloudflare Pages HTTP request-log retention scope remains unverified. No numeric operator-controlled application retention periods are approved; backup/PITR and broader provider operational/security retention must remain distinct. | Operator + providers + lawyer | Before Privacy Notice publication |
| L-10 | Implement account deletion and define residual JWT, logs and backup behaviour. | Learning-history deletion exists; self-service account deletion is not confirmed implemented. | Development + operator + legal review | Before promising account deletion |
| L-11 | Confirm access/correction/data portability/privacy-request handling process. | Request route and export process not fully implemented or operationally assigned. | Operator + development + lawyer | Before Privacy Notice publication |
| L-12 | Review Terms under Electronic Commerce Act 2006, Consumer Protection Act 1999 and general contract law. | Working Terms draft exists; no recorded acceptance flow. | Malaysian lawyer + operator | Before Terms publication/acceptance |
| L-13 | Verify copyright provenance/licensing for dictionary content, translations, examples, Hanzi Writer and stroke-order assets. | Third-party notices exist; source-by-source provenance and use rights need final verification. | Operator + content/legal review | Before broader distribution or commercial use |
| L-14 | Decide whether feedback is private or public and define the data request route. | Current feedback flow is copy-first and can lead to GitHub issues; private inbox proposal is not implemented. | Operator | Before publishing support instructions |
| L-15 | Add versioned Terms acceptance and accessible Privacy Notice links. | No published links or recorded Terms acceptance flow. | Development after legal approval | Before account onboarding under new Terms |
| L-16 | Review other target markets, especially EU/EEA and UK, given global audience and 16–17-year-old users. | Applicability screen started; active targeting/territorial scope and required local safeguards need legal review. | Operator + relevant counsel | Before deliberate market targeting |

## Current release position

- Privacy Notice draft: created in Bahasa Malaysia and English; not approved or published.
- Terms of Use draft: created; not approved or published.
- Data retention schedule: created; no numeric periods approved.
- DPIA screening: created; recommends full DPIA before broader public onboarding as a precaution.
- Incident response playbook: created; not yet approved or rehearsed.
- Staging ACL follow-up: applied and verified in Singapore staging.
- Production security remediation: pending separate owner approval.
- Cloudflare staging preview/OAuth: owner dashboard configuration still pending.
- Mock User testing: not yet declared ready.

## Do not close this register until

1. The operator/controller identity and privacy contact route are approved.
2. Malaysian counsel has addressed Act 709 scope, the 16–17-year-old consent issue, DPO/DPIA and Terms enforceability.
3. Provider and cross-border facts and retention periods are verified.
4. Account deletion and privacy-request procedures match the actual product.
5. Final bilingual notice and Terms are reviewed, published and accepted through a tested versioned flow.
6. All remaining technical staging and browser smoke tests pass.


## Acceptance implementation design

A separate proposed technical design is recorded at `docs/reference/LEGAL-DOCUMENT-ACCEPTANCE-AND-AGE-GATE-DESIGN.md`. It separates Terms acceptance, Privacy Notice acknowledgement and any consent that must be separately obtained; uses server-derived identity and timestamps; preserves versioned records; and explicitly leaves the 16–17-year-old consent approach unresolved pending Malaysian legal advice. No acceptance UI, age gate or schema has been implemented.
