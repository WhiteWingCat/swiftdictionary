# SwiftDictionary U3.0 — Malay translation quality remediation (2026-11-27)

## Context

The owner explicitly asked to complete all remaining U3.0 limitations and fix any additional issues found, rather than stopping after the Flashcard staging deployment.

## Audit findings

The generated `data/languages/malay-learning-support-translations.js` contained broad coverage, but coverage was not equivalent to acceptable translation quality. A programmatic screening pass found likely Indonesian contamination, malformed output and duplicate translated options:

| Content | Strings scanned | Likely issue flags |
|---|---:|---:|
| English Lesson support | 447 | 72 |
| Chinese Lesson support | 560 | 73 |
| English Quiz support | 2,748 | 627 |
| Chinese Quiz support | 1,740 | 366 |

The screening also found duplicate translated option sets in 50 English and 14 Chinese Quiz records. This is a heuristic audit; flagged strings need contextual review and the scan is not a definitive language classifier.

Inventory:
- English permanent Lessons: 17 lessons / 112 practice questions.
- Chinese permanent Lessons: 17 lessons / 112 practice questions.
- English Quiz support pack: 229 IDs; staging database has 199 approved English-course questions.
- Chinese Quiz support pack: 145 IDs; staging database has 145 approved Chinese-course questions.
- English Flashcard support draft has many empty standalone definitions. Dictionary-backed translation and custom/phrase-card coverage must be assessed separately.

## Work applied

Added `data/languages/malay-learning-support-overrides.js`, loaded after the generated translation pack in `index.html`. It currently corrects 36 English advanced Quiz questions and 12 Chinese advanced Quiz questions using the source bank records. The question IDs, option IDs and answer keys are preserved. No generic placeholder translations were retained for source questions that had not been checked.

Added assertions in `tests/u3-phase3-malay-learning.test.mjs` for both language groups and syntax checks in `.github/workflows/u3-phase1-validation.yml`. A direct runtime check confirmed all 48 corrections load, the required prompt/explanation/option fields are populated, Chinese translation-type questions use the Malay translation field, and script load order is correct.

The correction content is model-assisted Malaysian Standard Malay draft material and remains pending independent editorial review. It is not human-approved.

## Work still open

- Translate and validate the remaining 163 approved English Quiz questions and 133 approved Chinese Quiz questions.
- Replace/repair the low-quality Lesson practice support strings across all 17 English and 17 Chinese lessons (112 practice questions each).
- Complete Flashcard support for phrase, sentence and custom cards; avoid displaying a wrong-language string as Malay.
- Run all automated and authenticated browser regression suites, verify the latest Pages deployment, and finish staging OAuth/security checks.
- Preserve legal/release gates: human Malaysian Standard Malay review, exact Argos package licence/attribution verification, Malaysia Copyright Act and PDPA review before public release.

PR #20 remains draft/unmerged. Production code, database and hosting remain untouched.
