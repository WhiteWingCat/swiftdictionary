# SwiftDictionary — Personal Data Incident Response Playbook (Working Draft)

**Date:** 20 November 2026  
**Status:** Internal draft; requires operator approval and legal review.  
**Incident owner:** [Name/role to be confirmed]  
**Privacy contact:** [Monitored route to be created]

This playbook is an operational draft for suspected personal-data breaches. It does not replace the current Malaysian Personal Data Protection Act 2010 (Act 709), the Personal Data Protection Commissioner's Data Breach Notification Guideline/Circular, or legal advice. The incident owner must verify the current notification criteria and deadlines at the time of an incident.

## 1. What to treat as a potential incident

Examples include:
- unauthorised access to a user's account, saved words, learning history, Quiz answers or private Flashcards;
- accidental disclosure of account data through a public GitHub issue, logs, support message or deployment artifact;
- leaked Supabase service-role/secret credentials or Cloudflare/Google/GitHub credentials;
- RLS, RPC, storage or API misconfiguration that exposes one user's data to another;
- loss, theft or compromise of a device or data export containing personal data;
- provider notification of a security incident affecting SwiftDictionary data.

A vulnerability report without evidence of personal-data access is still a security incident to investigate, but it is not automatically a confirmed personal-data breach.

## 2. Immediate response

1. Record the time the incident was detected or reported, who reported it, the affected service and a short factual description.
2. Preserve relevant evidence: provider incident notices, timestamps, deployment versions, access logs and error details. Do not copy unnecessary learner records into chat, GitHub issues or personal devices.
3. Contain the issue proportionately: disable a vulnerable endpoint, rotate an exposed secret, revoke sessions, revert a deployment or restrict access. Never put service-role keys in browser code.
4. Notify the relevant provider immediately where the issue involves Cloudflare, Supabase, Google, GitHub or jsDelivr. Record when the provider was notified and its response.
5. Determine whether personal data was accessed, disclosed, altered, lost or made unavailable. Identify categories and approximate number of affected individuals without collecting additional data unnecessarily.
6. Keep a decision log. Do not delay containment while waiting for legal advice.

## 3. Notification assessment

For each confirmed or suspected personal-data breach:

- Assess the current JPDP Data Breach Notification Guideline and Circular No. 1/2025 to determine whether the breach meets a notification criterion, including significant harm or significant scale.
- If notification to the Commissioner is required, the current JPDP guideline states notification should be made as soon as practicable and no later than 72 hours from the occurrence/detection point defined by the guideline.
- Where significant harm to affected individuals triggers user notification, apply the current guideline's content and timing requirements. The published guideline describes notification to affected data subjects without unnecessary delay and no later than seven days after the initial Commissioner notification.
- If the breach is not notifiable, document why, what evidence was considered and what corrective action was taken.
- Obtain legal advice promptly for borderline cases, cross-border incidents or uncertain timelines. Do not assume a provider's notification alone satisfies the controller's own obligations.

The applicable trigger and clock must be checked against the current official guideline when an incident occurs; do not treat this summary as an automatic rule for every incident.

## 4. Information to prepare

Prepare only the information required by the current notification template/rules:

- nature and timeline of the breach;
- systems/providers affected;
- categories and approximate volume of personal data and affected people;
- likely consequences and risks;
- containment and remediation completed or planned;
- contact point for follow-up;
- reasons for any delay, if applicable.

Do not publish technical details that would enable exploitation or expose other users' data.

## 5. User communications

If affected users must be notified, use a clear and accessible channel. Explain:
- what happened and when, to the extent known;
- what categories of information may be affected;
- likely consequences;
- steps already taken;
- practical protective steps the user can take; and
- how to contact the operator.

Do not speculate, minimise impact or promise that no harm occurred before investigation supports that statement.

## 6. Recovery and follow-up

- Rotate secrets and review access grants, RLS policies, RPCs, Auth sessions and deployment configuration.
- Check whether data was copied to public GitHub issues, build artifacts or logs and request removal where appropriate; removal from a public location does not guarantee all copies are erased.
- Verify that containment works and run regression tests before restoring affected functionality.
- Complete a root-cause analysis and document corrective actions, owners and deadlines.
- Update the data map, risk register, DPIA and Privacy Notice if the incident reveals a new processing practice or material risk.
- Preserve records of the incident, assessment, decisions, notifications and remedial steps according to an approved retention schedule.

## 7. Contact and escalation

- Incident owner: [To be assigned]
- Privacy/legal contact: [To be assigned]
- Supabase support route: [Verify account access]
- Cloudflare support route: [Verify account access]
- Google Cloud/OAuth contact: [Verify account access]
- GitHub security contact: [Verify repository settings]

## 8. Approval checklist

- [ ] Assign incident owner and backup contact.
- [ ] Confirm provider incident notification channels and escalation SLAs.
- [ ] Create a secure incident register with restricted access.
- [ ] Confirm current JPDP reporting criteria, form and submission route.
- [ ] Prepare user notification templates in Bahasa Malaysia and English.
- [ ] Run a tabletop exercise using synthetic data.
- [ ] Review the playbook at least annually and after material provider/product changes.
