# Update 3.1 — Fill-in-the-Blank scope confirmation

**Date:** 2026-11-26  
**Status:** Owner-confirmed roadmap decision; planning only. No implementation authorised or started by this decision.

## Owner decision

The owner confirmed that the Fill-in-the-Blank typing-answer feature should be placed in **Update 3.1**, not Update 3.0. The reason is that Update 3.0 already carries the Malay language expansion, while the typing feature must be designed and validated across existing and new language courses rather than treated as a Malay-only feature.

## Confirmed initial scope

- Typing questions are intended for **both Lessons and Quiz**.
- The initial format is **one missing word per question**.
- The feature is intended to support all current learning courses (English and Simplified Chinese) and the planned Malay course, subject to language-specific validation and content readiness.
- A shared reusable typing-question experience is preferred over separate implementations for each language or learning area.
- Language-specific validation rules/adapters are required; the shared interface must not assume that all languages follow English spelling or word-boundary conventions.
- Multiple blanks in one question are deferred from the initial scope.

## Technical direction discussed, not yet fully specified

The preliminary process described six work areas:

1. Define supported question formats and interaction rules.
2. Define a structured question/answer data model, including expected answers, reviewed accepted alternatives, case and punctuation rules, hints and explanations.
3. Build a reusable, accessible typing interface with submission, feedback and retry behaviour.
4. Implement deterministic answer validation first, including safe normalisation and language-specific rules.
5. Integrate the shared component into Lessons and Quiz while preserving their different learning/assessment behaviour, progress and allowance rules.
6. Prepare and linguistically review content, then validate the feature across languages, devices, scripts, progress, allowances and existing functionality.

The proposed first validation level is deterministic matching against the expected answer and explicitly reviewed alternatives, with carefully scoped normalisation. More flexible semantic interpretation or AI-based grading is not part of the confirmed initial scope and would require separate design and accuracy review.

Quiz answer-key confidentiality must be preserved; the implementation must not expose correct answers to the browser before submission. The exact secure validation architecture remains open.

## Release placement

| Release | Planned direction |
|---|---|
| Update 3.0 | Malay language expansion; do not include the typing-question implementation |
| Update 3.1 | Fill-in-the-Blank typing questions in Lessons and Quiz |
| Update 4.0 | Japanese language expansion |
| Update 5.0 | Korean language expansion |

Moderate releases and the broader language roadmap remain subject to future planning and owner approval.

## Open design questions

- Exact question-data schema and migration requirements.
- Accepted-answer authoring and review workflow for each language.
- Language-specific normalisation and validation rules, especially Chinese input and Malay morphology.
- Whether and how retry, hints and feedback differ between Lessons and Quiz.
- Secure Quiz answer-checking architecture and persistence model.
- Question mixing, scoring, progress and weak-topic/revision integration.
- Content volume and editorial review requirements.
- Accessibility, mobile keyboard behaviour, reduced-motion and responsive UI details.
- Detailed implementation estimate after inspection of the then-current codebase and database.

## Release and quality safeguards

The normal SwiftDictionary standing rules apply: Malaysia-specific and general legal/privacy/accessibility/licensing planning; implementation and internal verification before staging handoff; regression across all supported courses; Live Supabase migration approval, application and verification before dependent production merge/deployment; README update on production release; consistent Lessons/Quiz/Flashcards UI patterns; and truthful reporting of test evidence.

**Recovery point:** U2.9.1 remains the production baseline as of this decision. Update 3.0 planning/implementation has not been authorised by this decision, and Update 3.1 implementation has not started.
