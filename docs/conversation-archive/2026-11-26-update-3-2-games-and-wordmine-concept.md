# Update 3.2 — Games page and Wordmine concept

**Date:** 2026-11-26  
**Status:** Owner-confirmed product direction and preliminary design; planning only. No implementation, migration, merge or production deployment authorised by this record.

## Context and release placement

The owner proposed Update 3.2 after the planned Update 3.0 Malay course expansion and Update 3.1 Fill-in-the-Blank typing questions in Lessons and Quiz.

The proposed U3.2 direction is to rename the existing **Flashcards** navigation destination/page to **Games**, retain Flashcards as an activity within Games, and add a new game named **Wordmine**. Flashcards is not being removed or rebuilt as part of this naming/navigation change.

## Games page

- Rename the main navigation/page destination from **Flashcards** to **Games**.
- Retain the existing Flashcards activity and its established learning behaviour.
- Add Wordmine as a separate game within Games.
- Treat the allowance previously associated with Flashcards as a general **Games allowance** shared by Flashcards, Wordmine and future games placed in Games.
- Do not create separate daily allowance buckets for each game.
- This is a change in allowance category/scope, not an approved increase or decrease in the configured daily quota. Preserve the existing configured numeric limits unless the owner separately approves a quota change. Inspect the actual Live Supabase schema, limits and migration history during implementation rather than assuming historical staging values are current production values.
- Existing Flashcards-specific progress, history and data must be preserved and mapped compatibly into the Games experience.

## Wordmine — core concept

Wordmine is a Minesweeper-inspired vocabulary/knowledge game with its own rules and visual identity. The inspiration does not authorise copying Minesweeper branding, artwork, code or protected expression.

### Board and tile labels

- A new game begins with a board of **nine square tiles**.
- Each tile displays one of four labels:
  - **Q** — multiple-choice question; the player selects one correct answer from four options.
  - **T** — True/False question; the player chooses True or False.
  - **L** — missing-letter question; the player supplies a missing letter in a word. A definition may be provided as a hint.
  - **B** — sentence fill-in-the-blank; the player supplies the missing word to complete a sentence.
- Selecting a tile reveals a question matching its label.
- Questions must be drawn from the selected learning course/language and respect that language's content and validation rules.

### Correct and incorrect answers

- **Correct:** The selected tile turns green to indicate success and is immediately replaced by a new tile with a newly randomised Q/T/L/B label. The correct answer completes one successful round.
- **Incorrect:** The selected tile turns red and is permanently locked for the remainder of that game. The player must select another non-red tile.
- **Five red tiles:** The game ends immediately in defeat when the fifth tile becomes red.
- There is **no time limit**; players may take as long as they need to answer.

### Question uniqueness

- A question must not be repeated within the same game.
- Once a question has been presented, it is considered used for that game regardless of whether the answer was correct or incorrect.
- The no-repeat rule applies across all four question types and all tile replacements; changing a tile label must not allow the same underlying question to reappear.
- Track presented question IDs for the lifetime of the game session. If the eligible question pool is exhausted, handle that state explicitly rather than silently repeating questions.
- This requirement concerns uniqueness within a game session; cross-session exclusion/history has not been approved.

### Difficulty and winning conditions

Difficulty affects both question complexity and the number of successful rounds required.

| Difficulty | Successful rounds required to win | Mistake limit |
|---|---:|---:|
| Beginner | 10 | 5 red tiles |
| Intermediate | 15 | 5 red tiles |
| Advanced | 20 | 5 red tiles |
| Endless (Wordmine exclusive) | Up to 100 | 5 red tiles |

- Beginner, Intermediate and Advanced are finite games. Reaching the listed successful-round target wins the game.
- Endless is exclusive to Wordmine. There is no ordinary target below the hard cap: the player may continue for as many successful rounds as possible, up to **100**.
- Reaching 100 successful rounds wins Endless.
- Accumulating five red tiles loses the game, including in Endless, even if the player has completed many successful rounds.
- The five-mistake limit is the same at every difficulty.
- A round is counted when a question is answered correctly; an incorrect answer does not count as a successful round.

### End-game navigation

After either victory or defeat, return the player directly to the **Games main page**. Do not insert an automatic retry screen or a separate mandatory result menu. The player can choose what to do next from Games.

## Games allowance behaviour

The former Flashcards allowance category becomes a shared Games allowance.

- Flashcards and Wordmine consume from the same daily Games allowance.
- Future games added to Games should use this same shared allowance unless the owner later approves a different policy.
- A Wordmine **win** consumes one Games allowance use.
- A Wordmine **loss** (five red tiles) consumes one Games allowance use.
- **Abandoning Wordmine before either terminal outcome consumes no allowance.** Do not reserve or charge an allowance merely when a game starts.
- Finalisation should be idempotent so refreshing, reconnecting or repeating a completion request cannot charge the same game more than once.
- Preserve the existing daily reset behaviour based on the user's configured/effective timezone.
- No new numeric Free/Premium quota values are approved in this discussion. The implementation must first inspect the current production limits and preserve the existing Flashcards quota numbers when generalising the category, unless a separate owner decision changes them.
- The exact compatibility treatment for historical Flashcards usage, allowance ledger categories, Profile display and any Supabase migration remains to be designed after inspection of the current production schema.

## Preliminary implementation workstreams (not yet approved technical design)

1. Audit the current Flashcards page, navigation/routes, data model, progress/history and allowance enforcement.
2. Design a Games landing page that retains Flashcards and introduces Wordmine without losing existing user data or progress.
3. Define a reusable, language-aware question source for Q/T/L/B and its content-quality/ambiguity checks.
4. Design Wordmine session state: board labels, question assignment, presented-question ID set, green replacement, red locks, successful-round count, mistake count, difficulty and terminal state.
5. Ensure question uniqueness across the full session and handle insufficient question-pool conditions safely.
6. Integrate the shared Games allowance with server-side, idempotent terminal settlement. Abandonment must not charge.
7. Review Profile/Dashboard statistics and history implications; do not add unapproved reward systems or collect raw answers unnecessarily.
8. Test across all available courses/languages at the time of U3.2, with responsive/mobile, accessibility, account isolation, allowance, persistence and regression coverage.
9. Inspect actual Live Supabase schema and migration history before drafting migrations. Follow the mandatory rule that any required Live migration is approved, applied and verified before dependent production main-branch merge/deployment.

## Legal, privacy and content review required before implementation

This record is a planning checklist, not legal advice or legal clearance.

- Perform the standing Malaysia-specific and general international legal/privacy review before implementation.
- Review PDPA and relevant international privacy obligations for account-linked game progress, usage/allowance records, retention, notices and data minimisation. Avoid storing raw answers unless demonstrably necessary.
- Consider the intended 16+ audience and jurisdiction-specific age-related safeguards.
- Check the availability and potential trademark conflicts of the name **Wordmine** before public release; no trademark clearance is claimed here.
- Keep the game's own branding, art, code and presentation original. Minesweeper is an inspiration for a board-and-tile mechanic, not permission to copy another product's branding, assets, code or protected visual expression.
- Review provenance and licences for all questions, definitions, sentences, translations, fonts, icons and other content used by the game.
- Review consumer/payment implications only if the shared allowance or future Premium functionality changes.

## Confirmed owner decisions

- U3.2 is the proposed release placement for the Games page rename and Wordmine.
- Rename Flashcards to Games in the main navigation/page destination, but retain Flashcards.
- Add Wordmine as a separate game.
- Wordmine starts with nine square tiles labelled Q, T, L or B.
- Q = four-option multiple choice; T = True/False; L = missing letter (definition hint may be shown); B = sentence completion.
- Correct answers turn the tile green and replace it immediately with a newly labelled tile.
- Incorrect answers turn the tile red and lock it.
- Five red tiles end the game in defeat.
- There is no time limit.
- Beginner = 10 successful rounds; Intermediate = 15; Advanced = 20.
- Difficulty affects both question complexity and round target.
- Endless is exclusive to Wordmine, has no ordinary round target, and allows up to 100 successful rounds; 100 is a win, while five red tiles is a loss.
- No question may repeat within a game, including questions already presented earlier in that same session, whether answered correctly or incorrectly.
- After victory or defeat, return directly to the Games main page.
- The Flashcards allowance becomes a shared Games allowance for Flashcards, Wordmine and future Games activities.
- Winning or losing Wordmine consumes one allowance use; abandoning Wordmine consumes none.
- No numeric allowance quota change has been approved.

## Open questions and deferred decisions

- Exact question complexity/content standards for Beginner, Intermediate and Advanced.
- Exact distribution/weighting of Q/T/L/B labels and whether the random selection should be uniformly distributed or balanced.
- Question-pool fallback behaviour when too few unique eligible questions remain.
- Whether a session can be resumed after a browser refresh or device interruption, and how such an interrupted session is classified as abandoned.
- Exact Wordmine statistics/history shown in Profile or Dashboard.
- Detailed Games landing-page layout and navigation route compatibility.
- Historical Flashcards allowance-ledger migration and quota mapping.
- Whether any future game-specific exceptions to the shared allowance are needed.
- Final technical architecture, migration requirements, content volume, estimates and release acceptance criteria.

**Release boundary:** U3.0 remains the planned Malay language expansion; U3.1 remains the planned one-missing-word typing-question feature in Lessons and Quiz; U3.2 is now recorded as the owner-confirmed Games/Wordmine planning direction. This document does not authorise implementation, staging handoff, database changes, merge or production deployment.

**Recovery point:** U2.9.1 remains the production baseline as of 2026-11-26. Cloudflare Pages is the sole active deployment platform; Cloudflare Workers Builds is retired. Internal documentation remains on `docs/master-development-record` and must not be merged into production `main`.
