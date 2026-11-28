# U3.0 Malay Flashcard coverage audit — 2026-11-28

## Scope and method

This audit evaluates the exact Flashcard runtime support helper in `flashcards.js` against the current English dictionary/phrase sources, Simplified Chinese Flashcard bank, Malay dictionary translations, curated Malay glosses, generated learning-support translations and manual correction keys.

A card counts as definition-supported only when the runtime can resolve a non-empty Malay definition through the same fallback order used by the application. A sentence counts as Malay-supported only when its source example has a reviewed Malay example correction key and a non-empty `exampleMs`. Merely having a source-language example is not counted as a Malay sentence translation.

## Definition and translation coverage

| Card group | Total cards | Malay definitions available | Coverage |
|---|---:|---:|---:|
| English dictionary-derived cards | 1,316 | 1,316 | 100% |
| English curated phrases | 25 | 25 | 100% |
| Chinese character cards | 519 | 519 | 100% |
| Chinese vocabulary cards | 904 | 184 | 20.4% |
| Chinese phrase cards | 24 | 24 | 100% |
| **Chinese Flashcards total** | **1,447** | **727** | **50.2%** |

The 720 Chinese cards without Malay definitions are deliberately excluded from games when Malay is selected as the support language. The runtime filters both dictionary-derived and custom cards through `translationFor`; it does not display untranslated cards as if they had Malay support.

## Sentence Recall coverage

| Card group | Source examples | Reviewed Malay sentence pairs |
|---|---:|---:|
| English dictionary-derived cards | 1,316 | 18 |
| English curated phrases | 25 | 0 |
| Chinese character cards | 519 | 0 |
| Chinese vocabulary cards | 60 | 18 |
| Chinese phrase cards | 24 | 0 |

Only the 18 English and 18 Chinese cards with reviewed Malay sentence pairs are eligible for Malay Sentence Recall. Other cards remain available in supported non-sentence modes where a Malay definition exists, but are not presented as Malay sentence exercises.

## Custom cards

Custom-card coverage is account-specific and cannot be represented by a global dictionary count. A custom card is included when its saved `translation_language_code` matches the selected support language and it has translation text. Cards without a matching translation are excluded from Malay-support games. This preserves user-owned content without inventing machine translations for private cards.

## Regression protection

The coverage assertions are encoded in `tests/flashcard-malay-support-coverage.test.mjs`, including per-category totals, definition counts, sentence counts and reviewed-example counts. The browser regression also checks that the Malay sentence hint is rendered after the first round is created, and that completed-game per-card snapshots remain reviewable.

## Editorial and release status

All counts above describe technical availability, not human editorial approval. The underlying Malay support data is marked machine-assisted draft. Malaysian Standard Malay editorial review remains required before public release. Do not silently expand Sentence Recall eligibility beyond the reviewed-example set.

No production deployment or production database change was made for this audit.
