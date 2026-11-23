# 2026-11-23 — Update 2.8.0 final planning approval and documentation handover

## Owner decision

The owner approved the final SwiftDictionary Update 2.8.0 plan, while explicitly instructing that development must not begin yet. The immediate task is documentation accuracy: update the Master Development Record and planning/archive references before any implementation.

## Confirmed scope

U2.8.0 is titled **Chinese Quiz & Flashcards Expansion** and includes:
1. Sufficient Chinese Quiz question-bank depth and coverage across Beginner, Intermediate and Advanced; numeric targets are to be established only after auditing actual curriculum and complete-session/no-repeat demand.
2. Chinese Flashcard bank expansion covering individual characters, multi-character vocabulary and useful expressions/phrases.
3. English-to-Chinese integration for Chinese-course Quiz and Flashcards only when English is the selected translation language. Chinese translation preference must remain Chinese-focused and must not introduce English prompts or explanations. Session language pair is captured at session/game start.
4. Distinct recall-mode learning objectives: Word Recall tests lexical form/pronunciation (pinyin); Definition Recall tests conceptual meaning through a descriptive clue; Translation Recall tests language equivalence (English equivalent to Chinese when English is selected, Chinese paraphrase/equivalent when Chinese is selected); Sentence Recall tests sentence-level retrieval. Anti-overlap content QA is mandatory; the modes must not become near-duplicates.
5. Quiz landing and active test UI redesign aligned with Lessons and Flashcards, including shadows, navigation background colour, coherent animated transitions, previous/next question transitions, answer preservation, rapid-navigation protection, responsive layout and reduced-motion support.
6. Replace Dashboard allowance gauges with clearer allowance cards, without changing quotas.
7. Flexible lesson completion: learner can proceed after reviewing explanation without selecting the correct answer; first-attempt and subsequent errors remain available to Practice Insights.
8. Quiz-to-topic review: Quiz questions link to permanent lesson topics; incorrect answers can raise review priority; recent Quiz performance includes the five most recent completed Quiz reviews; Chinese questions link to Chinese lesson topics.
9. Dashboard tabs: Favourites, Learning Progress, Daily History and Analytics (Flashcard statistics combined with Practice Insights).
10. Daily History shows today's completed Lessons, Quiz sessions and Flashcard games; resets its displayed view at effective local midnight but does not destructively delete underlying historical records.
11. Every completed Flashcard game in Daily History can be reopened for a full read-only review of every card, including correctly answered cards. Preserve original content/order/language and learner response/result where available. Review does not create a game, change result or consume allowance.
12. Completed Daily Topic, Application, Discovery and Revision activities leave the active daily view at local midnight and are replaced with fresh eligible activities. Historical/permanent progress remains; no rolling 24-hour interpretation.
13. Existing quotas, allowance accounting, dictionary-free-access policy, English functionality, custom Flashcard collections, account isolation, timezone and session rules remain unchanged.
14. Mandatory Malaysia/international privacy, data retention, cross-border, account deletion, RLS and content licensing review. Formal legal/privacy clearance remains outstanding.

## Prior project decisions carried forward

- Quiz session sizes and difficulty composition remain as specified in the U2.4.0 Quiz technical specification: Beginner 10, Intermediate 15, Advanced 20; four options; no timer; editable answers until submission; complete review; one active session; resume/abandon free; same-day issued-question reservation; minimum eligible unseen bank capacities Beginner 20, Intermediate 24 + 16 Beginner, Advanced 32 + 8 Intermediate + 8 Beginner (preferred larger capacities).
- Existing quota baselines recorded in prior approved work: permanent lessons Free 5/Premium 15 daily; each Daily Learning category Free 1/Premium 3 daily; Quiz Free 1/Premium 3 daily; Flashcards Free 3/Premium 10 daily. Verify actual production configuration during audit; U2.8.0 does not change them.
- Daily history is a current-day view, not a data-deletion process. Underlying session records remain for long-term progress/analytics and applicable retention/deletion rules.
- No exact numeric target for the new Chinese Quiz/Flashcard banks was approved. Derive targets after audit; do not fabricate counts or treat old draft content as owner-approved.
- The owner agreed to Chinese Flashcards covering characters + vocabulary + useful phrases.

## Branch and implementation status

- Application branch `feature/update-2-8-0-chinese-quiz-flashcards` was found to exist on 2026-11-23.
- Branch was created from current `main` in the preceding planning stage; it is still untouched.
- No application code/content, SQL, schema, migrations, RPCs, staging/production data or deployments were changed for U2.8.0.
- This archive and the U2.8.0 plan are documentation-only updates on `docs/master-development-record`.
- The owner's plan approval is not permission to begin development. Wait for a separate explicit instruction to start the technical audit and implementation.
- No PR to `main`, merge, release tag or ZIP is part of this documentation task.

## Documentation work in this session

- Added the authoritative plan at `docs/UPDATE-2.8.0-DEVELOPMENT-PLAN.md`.
- Updated `docs/MASTER-DEVELOPMENT-RECORD.md` status and U2.8.0 planning section.
- Added this dated archive and linked it from `docs/conversation-archive/README.md`.
- Documentation branch only; no production website effect.
