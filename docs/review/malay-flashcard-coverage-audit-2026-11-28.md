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
| Chinese vocabulary cards | 904 | 904 | 100% |
| Chinese phrase cards | 24 | 24 | 100% |
| **Chinese Flashcards total** | **1,447** | **1,447** | **100%** |

The Chinese vocabulary inventory includes 844 multi-character entries that have an English gloss but no authored Chinese definition. The support generator now translates those English glosses directly into Malay, while retaining Chinese-to-Malay translation for entries with a Chinese definition. The exporter and generator require a non-empty translated definition for every card and reject duplicate or untranslatable inventory rows. The runtime filters both dictionary-derived and custom cards through `translationFor`; it does not display untranslated cards as if they had Malay support.

## Sentence Recall coverage

| Card group | Source examples | Reviewed Malay sentence pairs |
|---|---:|---:|
| English dictionary-derived cards | 1,316 | 18 |
| English curated phrases | 25 | 0 |
| Chinese character cards | 519 | 0 |
| Chinese vocabulary cards | 60 | 18 |
| Chinese phrase cards | 24 | 0 |

Machine-assisted Malay example translations are generated for every English and Chinese source example. Sentence Recall remains limited to the existing curated correction-key set (18 English dictionary cards plus 25 English phrases; 18 Chinese vocabulary cards plus 24 Chinese phrases) so the game does not silently promote uncorrected generated sentences into assessed answer choices. All 1,341 English and 1,447 Chinese cards have Malay definition support for the other applicable recall modes.

## Custom cards

Custom-card coverage is account-specific and cannot be represented by a global dictionary count. A custom card is included when its saved `translation_language_code` matches the selected support language and it has translation text. Cards without a matching translation are excluded from Malay-support games. This preserves user-owned content without inventing machine translations for private cards.

## Regression protection

The coverage assertions are encoded in `tests/flashcard-malay-support-coverage.test.mjs`, including per-category totals, definition counts, sentence counts and reviewed-example counts. The browser regression also checks that the Malay sentence hint is rendered after the first round is created, and that completed-game per-card snapshots remain reviewable.

## Editorial and release status

All counts above describe technical availability, not human editorial approval. The underlying Malay support data remains marked machine-assisted draft. Per the owner's U3.0 direction, independent human review is deferred to live-site review; no machine-assisted content is relabelled as human-reviewed or editorially approved. Sentence Recall remains limited to its curated correction-key set.

No production deployment or production database change was made for this audit.
