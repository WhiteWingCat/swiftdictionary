-- Cover the Flashcards review-history session foreign key for efficient cleanup.
create index if not exists flashcard_review_items_last_session_idx
  on private.flashcard_review_items(last_session_id)
  where last_session_id is not null;
